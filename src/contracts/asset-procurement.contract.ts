import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { AssetProcurement, UnitOfMeasure, UnitOfMeasureList, ADRRuleList, ADRRule } from "../models";
import { AssetProcurementRepository, UnitOfMeasureListRepository, ADRRuleListRepository } from '../repositories';
import { ProcessingEngine } from '../processing-engine';



@Info({ title: 'AssetProcurementContract', description: 'Contract for managing the "Asset Procurement" data for a Vendor' })
export class AssetProcurementContract extends Contract {


    constructor() { super("com.homedepot.procurement.AssetProcurementContract"); }


    @Transaction(false)
    @Param("poNumber", "string")
    @Returns('AssetProcurement')
    public async retrieveAssetProcurement(ctx: Context, poNumber: string): Promise<AssetProcurement> {
        let repo : AssetProcurementRepository = new AssetProcurementRepository(ctx);
        const ap : AssetProcurement | undefined = await repo.get(poNumber);
        if (!ap) {
            throw new Error(`ERROR: An AssetProcurement record with PONumber ${poNumber} does not exist`);
        } else {
            return ap;
        }
    }

    @Transaction(true)
    @Param("poNumber", "string")
    @Returns('AssetProcurement')
    public async reprocessAssetProcurement(ctx: Context, poNumber: string): Promise<AssetProcurement> {
        let repo : AssetProcurementRepository = new AssetProcurementRepository(ctx);
        const ap : AssetProcurement | undefined = await repo.get(poNumber);
        if (!ap) {
            throw new Error(`ERROR: An AssetProcurement record with PONumber ${poNumber} does not exist`);
        }

        // Get the list of UnitOfMeasure data
        let uomList : UnitOfMeasureList | undefined = await (new UnitOfMeasureListRepository(ctx)).get();
        if (uomList === undefined){ uomList = new UnitOfMeasureList({ Items: [] }); }
    
        // Retrieve the current ADR Rule data
        let adrRuleList : ADRRuleList | undefined = await (new ADRRuleListRepository(ctx)).get();
        if (adrRuleList === undefined){ adrRuleList = new ADRRuleList({ Items: [] }); }

        // Create a processing engine and process the Procurement record
        let updatedAP : AssetProcurement = ProcessingEngine.startProcessing(ap, { uomList, adrRuleList } );

        // Save the updated Procurement record
        repo.update(updatedAP);
        return updatedAP;
    }

}