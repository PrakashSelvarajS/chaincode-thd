import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { IFCShipped, AssetProcurement, StageType, UnitOfMeasure, UnitOfMeasureList, ADRRule, ADRRuleList, IFCShippedList } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';

const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/ifc-shipped.contract.ts');


@Info({ title: 'IFCShippedContract', description: 'Contract for managing the list of IFCShippeds, and their related discrepancies' })
export class IFCShippedContract extends Contract {


    constructor() { super("com.homedepot.procurement.IFCShippedContract"); }


    // Used to bulk merge several records of new VendorShipped data with existing VendorShipped data
    @Transaction()
    @Param("newListOfIFCShippedLists", "IFCShippedList[]")
    @Returns('AssetProcurement[]')    
    public async bulkSaveIFCShipped(ctx: Context, newListOfIFCShippedLists: IFCShippedList[]): Promise<AssetProcurement[]> {  
        try {
            // Sanity-checks: list.length > 0
            if (newListOfIFCShippedLists.length === 0){ 
                throw new Error(`bulkSaveIFCShipped was called with 0 IFCShippeds`);
            }

            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps : AssetProcurement[] = [];
            for (let currentItemsList of newListOfIFCShippedLists) {
                let currentSavedAP : AssetProcurement = await this.saveIFCShipped(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }

            return aps;
        } catch (e) {
            logger.error(`bulkSaveIFCShipped failed`);
            logger.error(e);
            return;
        }
    }


    // Used to merge new IFCShipped data with existing IFCShipped data
    @Transaction()
    @Param("poNumber", "string")
    @Param("newIFCShippedList", "IFCShipped[]")
    @Returns('AssetProcurement')    
    public async saveIFCShipped(ctx: Context, poNumber: string, newIFCShippedList: IFCShipped[]): Promise<AssetProcurement> {  
        try {
            // Sanity-checks: ishlist.length > 0, all items in ishlist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newIFCShippedList.length === 0){ 
                throw new Error(`saveIFCShipped was called with 0 IFCShipped items, for PONumber '${poNumber}'`);
            }
            if (newIFCShippedList.some((v,i,l)=>{ return (v.PONumber != poNumber); })) {
                throw new Error(`saveIFCShipped was called with some IFCShipped items that do not have PONUmber '${poNumber}`);
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
            
            // Merge the existing IFCShipped data with the new data
            logger.debug('We ' + ((ap.IFCShippeds !== undefined && ap.IFCShippeds.length > 0) ? 'have' : 'do not have') + ' ISH data for the AP');
            if (ap.IFCShippeds !== undefined && ap.IFCShippeds.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newIFCShippedList.length} new IFCShippeds`);
                newIFCShippedList.forEach((vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCShippeds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.TCASNID == innerVC.TCASNID && vc.PRONumber == innerVC.PRONumber && vc.BOLNumber == innerVC.BOLNumber && vc.Carrier == innerVC.Carrier;
                    });
                    if (existingRecordIndex > -1) { 
                        logger.debug('Found a new ISH that matched an existing one'); 
                        ap.IFCShippeds![existingRecordIndex] = vc;
                    }
                });

                // Deterimine all records that are new and do not match any existing records
                let uniqueISHs : IFCShipped[] = newIFCShippedList.reduce((pac:IFCShipped[],vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCShippeds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.TCASNID == innerVC.TCASNID && vc.PRONumber == innerVC.PRONumber && vc.BOLNumber == innerVC.BOLNumber && vc.Carrier == innerVC.Carrier;
                    });
                    if (existingRecordIndex == -1) { 
                        logger.debug('Found a new ISH that does not match the existing ones'); 
                        pac.push(vc); 
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueISHs.length} totally new IFCShippeds`);
  
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueISHs.length > 0) {
                    logger.debug('Adding the final list of unique ISHs to the existing list of ISHs');
                    ap.IFCShippeds.push(...uniqueISHs);
                }              
            } else {
                logger.debug('Adding all new ISHs since there are no existing ISHs.');
                ap.setStageDetails(StageType.IFCShipped, newIFCShippedList);
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

            logger.debug(`saveIFCShipped saved ${newIFCShippedList.length} IFCShipped items for PONumber ${poNumber}`);
            return updatedAP;
        } catch (e) {
            logger.error(`saveIFCShipped failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }

}