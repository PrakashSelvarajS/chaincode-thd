import { Context, Contract } from 'fabric-contract-api';
import { Vendor } from "../models";
export declare class VendorContract extends Contract {
    constructor();
    saveVendor(ctx: Context, newVendors: Vendor[]): Promise<Vendor[]>;
    deleteVendor(ctx: Context, sku: string): Promise<boolean>;
    retrieveVendor(ctx: Context): Promise<Vendor[]>;
}
