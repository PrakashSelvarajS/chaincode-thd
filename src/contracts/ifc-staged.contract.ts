import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { IFCStaged, AssetProcurement, StageType, UnitOfMeasure, UnitOfMeasureList, ADRRule, ADRRuleList, IFCStagedList } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';

const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/ifc-staged.contract.ts');


@Info({ title: 'IFCStagedContract', description: 'Contract for managing the list of IFCStageds, and their related discrepancies' })
export class IFCStagedContract extends Contract {


    constructor() { super("com.homedepot.procurement.IFCStagedContract"); }


    // Used to bulk merge several records of new IFCStaged data with existing IFCStaged data
    @Transaction()
    @Param("newListOfIFCStagedLists", "IFCStagedList[]")
    @Returns('AssetProcurement[]')    
    public async bulkSaveIFCStaged(ctx: Context, newListOfIFCStagedLists: IFCStagedList[]): Promise<AssetProcurement[]> {  
        try {
            // Sanity-checks: list.length > 0
            if (newListOfIFCStagedLists.length === 0){ 
                throw new Error(`bulkSaveIFCStaged was called with 0 IFCStageds`);
            }

            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps : AssetProcurement[] = [];
            for (let currentItemsList of newListOfIFCStagedLists) {
                let currentSavedAP : AssetProcurement = await this.saveIFCStaged(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }

            return aps;
        } catch (e) {
            logger.error(`bulkSaveIFCStaged failed`);
            logger.error(e);
            return;
        }
    }


    // Used to merge new IFCStaged data with existing IFCStaged data
    @Transaction()
    @Param("poNumber", "string")
    @Param("newIFCStagedList", "IFCStaged[]")
    @Returns('AssetProcurement')    
    public async saveIFCStaged(ctx: Context, poNumber: string, newIFCStagedList: IFCStaged[]): Promise<AssetProcurement> {  
        try {
            // Sanity-checks: istlist.length > 0, all items in vslist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newIFCStagedList.length === 0){ 
                throw new Error(`saveIFCStaged was called with 0 IFCStaged items, for PONumber '${poNumber}'`);
            }
            if (newIFCStagedList.some((v,i,l)=>{ return (v.PONumber != poNumber); })) {
                throw new Error(`saveIFCStaged was called with some IFCStaged items that do not have PONUmber '${poNumber}`);
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
            
            // Merge the existing IFCStaged data with the new data
            logger.debug('We ' + ((ap.IFCStageds !== undefined && ap.IFCStageds.length > 0) ? 'have' : 'do not have') + ' IST data for the AP');
            if (ap.IFCStageds !== undefined && ap.IFCStageds.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newIFCStagedList.length} new IFCStageds`);
                newIFCStagedList.forEach((vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCStageds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber==innerVC.PONumber;
                    });
                    if (existingRecordIndex > -1) { 
                        logger.debug('Found a new IST that matched an existing one'); 
                        ap.IFCStageds![existingRecordIndex] = vc;
                    }
                });

                // Deterimine all records that are new and do not match any existing records
                let uniqueISTs : IFCStaged[] = newIFCStagedList.reduce((pac:IFCStaged[],vc,ic,lc)=>{
                    let existingRecordIndex = ap.IFCStageds!.findIndex((innerVC,innerIC,innerLC)=>{
                        return vc.RDC==innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber==innerVC.PONumber;
                    });
                    if (existingRecordIndex == -1) { 
                        logger.debug('Found a new IST that does not match the existing ones'); 
                        pac.push(vc); 
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueISTs.length} totally new IFCStageds`);
  
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueISTs.length > 0) {
                    logger.debug('Adding the final list of unique ISTs to the existing list of ISTs');
                    ap.IFCStageds.push(...uniqueISTs);
                }              
            } else {
                logger.debug('Adding all new ISTs since there are no existing ISTs.');
                ap.setStageDetails(StageType.IFCStaged, newIFCStagedList);
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

            logger.debug(`saveIFCShipped saved ${newIFCStagedList.length} IFCShipped items for PONumber ${poNumber}`);
            return updatedAP;
        } catch (e) {
            logger.error(`saveIFCShipped failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }

}