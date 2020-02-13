import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { IFCReceived, AssetProcurement, StageType, UnitOfMeasure, UnitOfMeasureList, ADRRule, ADRRuleList, IFCReceivedList } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';

const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/ifc-received.contract.ts');


@Info({ title: 'IFCReceivedContract', description: 'Contract for managing the list of IFCReceiveds, and their related discrepancies' })
export class IFCReceivedContract extends Contract {

    constructor() { super("com.homedepot.procurement.IFCReceivedContract"); }


    // Used to bulk merge several records of new IFCReceived data with existing IFCReceived data
    @Transaction()
    @Param("newListOfIFCReceivedLists", "IFCReceivedList[]")
    @Returns('AssetProcurement[]')    
    public async bulkSaveIFCReceived(ctx: Context, newListOfIFCReceivedLists: IFCReceivedList[]): Promise<AssetProcurement[]> {  
        try {
            // Sanity-checks: list.length > 0
            if (newListOfIFCReceivedLists.length === 0){ 
                throw new Error(`bulkSaveIFCReceived was called with 0 IFCReceiveds`);
            }

            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps : AssetProcurement[] = [];
            for (let currentItemsList of newListOfIFCReceivedLists) {
                let currentSavedAP : AssetProcurement = await this.saveIFCReceived(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }

            return aps;
        } catch (e) {
            logger.error(`bulkSaveIFCReceived failed`);
            logger.error(e);
            return;
        }
    }


    // Used to merge new IFCReceived data with existing IFCReceived data
    @Transaction()
    @Param("poNumber", "string")
    @Param("newIFCReceivedList", "IFCReceived[]")
    @Returns('AssetProcurement')    
    public async saveIFCReceived(ctx: Context, poNumber: string, newIFCReceivedList: IFCReceived[]): Promise<AssetProcurement> {  
        try {
            // Sanity-checks: irlist.length > 0, all items in vslist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newIFCReceivedList.length === 0){ 
                throw new Error(`saveIFCReceived was called with 0 IFCReceived items, for PONumber '${poNumber}'`);
            }
            if (newIFCReceivedList.some((v,i,l)=>{ return (v.PONumber != poNumber); })) {
                throw new Error(`saveIFCReceived was called with some IFCReceived items that do not have PONUmber '${poNumber}`);
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
            
            // Merge the existing IFCReceived data with the new data
            logger.debug('We ' + ((ap.IFCReceiveds !== undefined && ap.IFCReceiveds.length > 0) ? 'have' : 'do not have') + ' VS data for the AP');
            if (ap.IFCReceiveds !== undefined && ap.IFCReceiveds.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newIFCReceivedList.length} new IFCReceiveds`);
                newIFCReceivedList.forEach((vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCReceiveds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber==innerVC.PONumber;
                    });
                    if (existingRecordIndex > -1) { 
                        logger.debug('Found a new IR that matched an existing one'); 
                        ap.IFCReceiveds![existingRecordIndex] = vc;
                    }
                });

                // Deterimine all records that are new and do not match any existing records
                let uniqueIRs : IFCReceived[] = newIFCReceivedList.reduce((pac:IFCReceived[],vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCReceiveds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber==innerVC.PONumber;
                    });
                    if (existingRecordIndex == -1) { 
                        logger.debug('Found a new IR that does not match the existing ones'); 
                        pac.push(vc); 
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueIRs.length} totally new IFCReceiveds`);
  
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueIRs.length > 0) {
                    logger.debug('Adding the final list of unique IRs to the existing list of IRs');
                    ap.IFCReceiveds.push(...uniqueIRs);
                }              
            } else {
                logger.debug('Adding all new IRs since there are no existing IRs.');
                ap.setStageDetails(StageType.IFCReceived, newIFCReceivedList);
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

            logger.debug(`saveIFCReceived saved ${newIFCReceivedList.length} IFCReceived items for PONumber ${poNumber}`);
            return updatedAP;
        } catch (e) {
            logger.error(`saveIFCReceived failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }

}