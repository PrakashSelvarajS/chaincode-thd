import { Context, Contract } from 'fabric-contract-api';
import { VendorShipped, AssetProcurement, VendorShippedList } from "../models";
export declare class VendorShippedContract extends Contract {
    constructor();
    bulkSaveVendorShipped(ctx: Context, newListOfVendorShippedLists: VendorShippedList[]): Promise<AssetProcurement[]>;
    saveVendorShipped(ctx: Context, poNumber: string, newVendorShippedList: VendorShipped[]): Promise<AssetProcurement>;
}
