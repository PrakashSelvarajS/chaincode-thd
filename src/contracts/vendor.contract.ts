import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { Vendor, VendorList } from "../models";
import { VendorListRepository } from '../repositories';




@Info({ title: 'VendorContract', description: 'Contract for managing the list of "Vendor" (and sub-vendor) identification data for a Vendor' })
export class VendorContract extends Contract {


    constructor() { super("com.homedepot.procurement.VendorContract"); }

    // Used to merge new Vendor data with existing Vendor data
    @Transaction(true)
    @Param("newVendors", "Vendor[]")
    @Returns('Vendor[]')
    public async saveVendor(ctx: Context, newVendors: Vendor[]): Promise<Vendor[]> {
        // Clean up the Vendor names to remove double quotes and trailing/leading spaces
        newVendors = newVendors.map((v,i,l) => {
            v.Name = v.Name.replace(/["]+/g, '').trim();
            return v; 
        });

        const repo : VendorListRepository = new VendorListRepository(ctx);

        // Get the list of existing Vendor items
        const existingVendorList : VendorList = await repo.get();
        let savedVendors : Vendor[] = [];

        // If there are no existing Vendor items, then store the new Vendor list
        if (existingVendorList === undefined || existingVendorList.Items === undefined || existingVendorList.Items.length === 0) {
            console.log('No Vendor data, adding all the provided Vendor data to the ledger');
            let newVendorList : VendorList = new VendorList({Items: newVendors});
            await repo.create(newVendorList);
            savedVendors = newVendorList.Items;
        } else {
            // Merge the existing Vendor with the new Vendor, using SKU as a unique identifier
            for (let currentNewVendor of newVendors) {                 
                const existingItemIndex : number = existingVendorList.Items.findIndex((vv,ii,ll)=>{ return currentNewVendor.VendorID == vv.VendorID; });

                if(existingItemIndex > -1 ){                    
                    // Overwrite the existing item values with the new values                    
                    currentNewVendor.RecordID = existingVendorList.Items[existingItemIndex].RecordID;
                    existingVendorList.Items[existingItemIndex] = currentNewVendor;
                    savedVendors.push(currentNewVendor);
                }
            }

            // Get a list of records that are in the new list, but not in the existing list
            let newVendorNotInExistingList : Vendor[] = newVendors.filter((v,i,l)=>{ return (existingVendorList.Items.findIndex((vv,ii,ll)=> { return v.VendorID == vv.VendorID; }) == -1); });
            if (newVendorNotInExistingList.length > 0) {
                existingVendorList.Items.push(...newVendorNotInExistingList);
                savedVendors.push(...newVendorNotInExistingList)
            }

            // HACK : This is a temporary fix to remove double-quotes from all Vendor names....this should be removed after all entries have been fixed in the blockchain
            existingVendorList.Items = existingVendorList.Items.map((v,i,l)=>{
                v.Name = v.Name.replace(/["]+/g, '').trim();
                return v;
            });

            await repo.update(existingVendorList);
        }

        return savedVendors;
    }

    // Delete an existing Vendor record by its SKU
    public async deleteVendor(ctx: Context, sku: string) : Promise<boolean> {
        throw new Error('ERROR: deleteVendor has not been implemented');
    }
    


    @Transaction(false)
    @Returns('Vendor[]')
    public async retrieveVendor(ctx: Context): Promise<Vendor[]> {
        let repo : VendorListRepository = new VendorListRepository(ctx);
        const vendorList : VendorList = await repo.get();
        if (vendorList === undefined || vendorList.Items === undefined || vendorList.Items.length == 0) {
            throw new Error(`ERROR: No Vendors exist in the blockchain for this Vendor`);
        } else {
            return vendorList.Items;
        }
    }

}