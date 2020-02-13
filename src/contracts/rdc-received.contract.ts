import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { RDCReceived, AssetProcurement, StageType, UnitOfMeasure, UnitOfMeasureList, ADRRule, ADRRuleList, RDCReceivedList } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';

const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/ifc-shipped.contract.ts');


@Info({ title: 'RDCReceivedContract', description: 'Contract for managing the list of RDCReceiveds, and their related discrepancies' })
export class RDCReceivedContract extends Contract {


    constructor() { super("com.homedepot.procurement.RDCReceivedContract"); }


    // Used to bulk merge several records of new RDCReceived data with existing RDCReceived data
    @Transaction()
    @Param("newListOfRDCReceivedLists", "RDCReceivedList[]")
    @Returns('AssetProcurement[]')    
    public async bulkSaveRDCReceived(ctx: Context, newListOfRDCReceivedLists: RDCReceivedList[]): Promise<AssetProcurement[]> {  
        try {
            // Sanity-checks: list.length > 0
            if (newListOfRDCReceivedLists.length === 0){ 
                throw new Error(`bulkSaveRDCReceived was called with 0 RDCReceiveds`);
            }

            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps : AssetProcurement[] = [];
            for (let currentItemsList of newListOfRDCReceivedLists) {
                let currentSavedAP : AssetProcurement = await this.saveRDCReceived(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }

            return aps;
        } catch (e) {
            logger.error(`bulkSaveRDCReceived failed`);
            logger.error(e);
            return;
        }
    }


    // Used to merge new RDCReceived data with existing RDCReceived data
    @Transaction()
    @Param("poNumber", "string")
    @Param("newRDCReceivedList", "RDCReceived[]")
    @Returns('AssetProcurement')    
    public async saveRDCReceived(ctx: Context, poNumber: string, newRDCReceivedList: RDCReceived[]): Promise<AssetProcurement> {  
        try {
            // Sanity-checks: rrlist.length > 0, all items in rrlist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newRDCReceivedList.length === 0){ 
                throw new Error(`saveRDCReceived was called with 0 RDCReceived items, for PONumber '${poNumber}'`);
            }
            if (newRDCReceivedList.some((v,i,l)=>{ return (v.PONumber != poNumber); })) {
                throw new Error(`saveRDCReceived was called with some RDCReceived items that do not have PONUmber '${poNumber}`);
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
            
            // Merge the existing RDCReceived data with the new data
            logger.debug('We ' + ((ap.RDCReceiveds !== undefined && ap.RDCReceiveds.length > 0) ? 'have' : 'do not have') + ' RR data for the AP');
            if (ap.RDCReceiveds !== undefined && ap.RDCReceiveds.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newRDCReceivedList.length} new RDCReceiveds`);
                newRDCReceivedList.forEach((vc,ic,lc)=>{
                    let existingRecordIndex = ap.RDCReceiveds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.KeyRecNumber == innerVC.KeyRecNumber;
                    });
                    if (existingRecordIndex > -1) { 
                        logger.debug('Found a new RR that matched an existing one'); 
                        ap.RDCReceiveds![existingRecordIndex] = vc;
                    }
                });

                // Deterimine all records that are new and do not match any existing records
                let uniqueRRs : RDCReceived[] = newRDCReceivedList.reduce((pac:RDCReceived[],vc,ic,lc)=>{
                    let existingRecordIndex = ap.RDCReceiveds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.PONumber == innerVC.PONumber && vc.KeyRecNumber == innerVC.KeyRecNumber;
                    });
                    if (existingRecordIndex == -1) { 
                        logger.debug('Found a new RR that does not match the existing ones'); 
                        pac.push(vc); 
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueRRs.length} totally new RDCReceiveds`);
  
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueRRs.length > 0) {
                    logger.debug('Adding the final list of unique RRs to the existing list of RRs');
                    ap.RDCReceiveds.push(...uniqueRRs);
                }              
            } else {
                logger.debug('Adding all new RRs since there are no existing RRs.');
                ap.setStageDetails(StageType.RDCReceived, newRDCReceivedList);
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

            logger.debug(`saveRDCReceived saved ${newRDCReceivedList.length} RDCReceived items for PONumber ${poNumber}`);
            return updatedAP;
        } catch (e) {
            logger.error(`saveRDCReceived failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }

}