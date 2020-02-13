import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { Invoice, AssetProcurement, StageType, UnitOfMeasure, UnitOfMeasureList, ADRRule, ADRRuleList, InvoiceList } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';

const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/ifc-shipped.contract.ts');


@Info({ title: 'InvoiceContract', description: 'Contract for managing the list of Invoices, and their related discrepancies' })
export class InvoiceContract extends Contract {

    constructor() { super("com.homedepot.procurement.InvoiceContract"); }


    // Used to bulk merge several records of new Invoice data with existing Invoice data
    @Transaction()
    @Param("newListOfInvoiceLists", "InvoiceList[]")
    @Returns('AssetProcurement[]')    
    public async bulkSaveInvoice(ctx: Context, newListOfInvoiceLists: InvoiceList[]): Promise<AssetProcurement[]> {  
        try {
            // Sanity-checks: list.length > 0
            if (newListOfInvoiceLists.length === 0){ 
                throw new Error(`bulkSaveInvoice was called with 0 Invoices`);
            }

            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps : AssetProcurement[] = [];
            for (let currentItemsList of newListOfInvoiceLists) {
                let currentSavedAP : AssetProcurement = await this.saveInvoice(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }

            return aps;
        } catch (e) {
            logger.error(`bulkSaveInvoice failed`);
            logger.error(e);
            return;
        }
    }


    // Used to merge new Invoice data with existing Invoice data
    @Transaction()
    @Param("poNumber", "string")
    @Param("newInvoiceList", "Invoice[]")
    @Returns('AssetProcurement')    
    public async saveInvoice(ctx: Context, poNumber: string, newInvoiceList: Invoice[]): Promise<AssetProcurement> {  
        try {
            // Sanity-checks: invlist.length > 0, all items in invlist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newInvoiceList.length === 0){ 
                throw new Error(`saveInvoice was called with 0 Invoice items, for PONumber '${poNumber}'`);
            }
            if (newInvoiceList.some((v,i,l)=>{ return (v.PONumber != poNumber); })) {
                throw new Error(`saveInvoice was called with some Invoice items that do not have PONUmber '${poNumber}`);
            }

            let apRepo : AssetProcurementRepository = new AssetProcurementRepository(ctx);
            
            // Retrieve or create the AssetProcurement record
            let ap : AssetProcurement = new AssetProcurement({ PONumber: poNumber });
            let apIsNew : boolean = true;
            if (await apRepo.exists(poNumber) == true) {
                logger.debug(`PONumber ${poNumber} exists`);
                ap = await apRepo.get(poNumber);
                apIsNew = false;
                logger.debug('Retreived AP from storage');
            }

            // Get the list of UnitOfMeasure data
            logger.debug('Retrieving UOM data from storage');
            let uomList : UnitOfMeasureList | undefined = await (new UnitOfMeasureListRepository(ctx)).get();
            if (uomList === undefined){ uomList = new UnitOfMeasureList({ Items: [] }); }
            logger.debug(uomList.Items.length);
        
            // Retrieve the current ADR Rule data
            logger.debug('Retrieving ADR Rules from storage');
            let adrRuleList : ADRRuleList | undefined = await (new ADRRuleListRepository(ctx)).get();
            if (adrRuleList === undefined){ adrRuleList = new ADRRuleList({ Items: [] }); }
            logger.debug(adrRuleList.Items.length);
            
            // Merge the existing Invoice data with the new data
            logger.debug('We ' + ((ap.Invoices !== undefined && ap.Invoices.length > 0) ? 'have' : 'do not have') + ' INV data for the AP');
            if (ap.Invoices !== undefined && ap.Invoices.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newInvoiceList.length} new Invoices`);
                newInvoiceList.forEach((vc,ic,lc)=>{
                    let existingRecordIndex = ap.Invoices!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.InvoiceNumber == innerVC.InvoiceNumber;
                    });
                    if (existingRecordIndex > -1) { 
                        logger.debug('Found a new INV that matched an existing one'); 
                        ap.Invoices![existingRecordIndex] = vc;
                    }
                });

                // Deterimine all records that are new and do not match any existing records
                let uniqueINVs : Invoice[] = newInvoiceList.reduce((pac:Invoice[],vc,ic,lc)=>{
                    let existingRecordIndex = ap.Invoices!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.InvoiceNumber == innerVC.InvoiceNumber;
                    });
                    if (existingRecordIndex == -1) { 
                        logger.debug('Found a new INV that does not match the existing ones'); 
                        pac.push(vc); 
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueINVs.length} totally new Invoices`);
  
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueINVs.length > 0) {
                    logger.debug('Adding the final list of unique INVs to the existing list of INVs');
                    ap.Invoices.push(...uniqueINVs);
                }              
            } else {
                logger.debug('Adding all new INVs since there are no existing INVs.');
                ap.setStageDetails(StageType.Invoiced, newInvoiceList);
            }

            // Run this through the processing engine (FSM)
            logger.debug('Starting the processing engine');
            let updatedAP : AssetProcurement = ProcessingEngine.startProcessing(ap, { uomList, adrRuleList });
            logger.debug('Finished the processing engine');
            
            // Save the AssetProcurement record
            if (apIsNew) {
                logger.debug('Attempting to create a new AP');
                await apRepo.create(updatedAP);
            } else {
                logger.debug('Attempting to update an existing AP');
                await apRepo.update(updatedAP);
            }

            logger.debug(`saveInvoice saved ${newInvoiceList.length} Invoice items for PONumber ${poNumber}`);
            return updatedAP;
        } catch (e) {
            logger.error(`saveInvoice failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }

}