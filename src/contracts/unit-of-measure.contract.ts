import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { UnitOfMeasure, UnitOfMeasureList } from "../models";
import { UnitOfMeasureListRepository } from '../repositories';



@Info({ title: 'UnitOfMeasureContract', description: 'Contract for managing the "Unit-of-Measure" data for a Vendor' })
export class UnitOfMeasureContract extends Contract {


    constructor() { super("com.homedepot.procurement.UnitOfMeasureContract"); }


    // Used to merge new UOM data with existing UOM data
    @Transaction(true)
    @Param("newUOMs", "UnitOfMeasure[]")
    @Returns('UnitOfMeasure[]')
    public async saveUnitOfMeasure(ctx: Context, newUOMs: UnitOfMeasure[]): Promise<UnitOfMeasure[]> {
        let repo : UnitOfMeasureListRepository = new UnitOfMeasureListRepository(ctx);
        
        // Get the list of existing UOM items
        let existingUOMList : UnitOfMeasureList = await repo.get();
        let savedUOMs : UnitOfMeasure[] = [];

        // If there are no existing UOM items, then store the new UOM list
        if (existingUOMList === undefined || existingUOMList.Items === undefined || existingUOMList.Items.length === 0) {
            console.log('No UOM data, adding all the provided UOM data to the ledger');
            let newUOMList : UnitOfMeasureList = new UnitOfMeasureList({Items: newUOMs});
            newUOMList = await repo.create(newUOMList);
            savedUOMs = newUOMList.Items;
        } else {            
            // Update all the existing UOM with the new UOM, using SKU as a unique identifier
            for (let currentNewUOM of newUOMs) {                                     
                const existingItemIndex : number = existingUOMList.Items.findIndex((vv,ii,ll)=>{ return currentNewUOM.SKU == vv.SKU; });

                if(existingItemIndex > -1 ){                    
                    // Overwrite the existing item values with the new values            
                    currentNewUOM.RecordID = existingUOMList.Items[existingItemIndex].RecordID;
                    existingUOMList.Items[existingItemIndex] = currentNewUOM;
                    savedUOMs.push(currentNewUOM);

                }
            }
      
            // Get a list of records that are in the new list, but not in the existing list
            let newUOMNotInExistingList : UnitOfMeasure[] = newUOMs.filter((v,i,l)=>{ return (existingUOMList.Items.findIndex((vv,ii,ll)=> { return v.SKU == vv.SKU; }) == -1); });
            if (newUOMNotInExistingList.length > 0) {
                existingUOMList.Items.push(...newUOMNotInExistingList);
                savedUOMs.push(...newUOMNotInExistingList)
            }

            existingUOMList = await repo.update(existingUOMList);
        }
        
        return savedUOMs;
    }

    // Delete an existing UOM record by its SKU
    public async deleteUnitOfMeasure(ctx: Context, sku: string) : Promise<boolean> {
        throw new Error('ERROR: deleteUnitOfMeasure has not been implemented');
    }
    
    
    @Transaction(false)
    @Returns('UnitOfMeasure[]')
    public async retrieveUnitOfMeasure(ctx: Context): Promise<UnitOfMeasure[]> {
        let repo : UnitOfMeasureListRepository = new UnitOfMeasureListRepository(ctx);
        const existingUOMList : UnitOfMeasureList = await repo.get();
        if (existingUOMList === undefined || existingUOMList.Items === undefined && existingUOMList.Items.length == 0) {
            return [];
        } else {
            return existingUOMList.Items;
        }
    }

}