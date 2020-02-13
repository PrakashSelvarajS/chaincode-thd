import { Context, Contract } from 'fabric-contract-api';
import { AssetProcurement } from "../models";
export declare class AssetProcurementContract extends Contract {
    constructor();
    retrieveAssetProcurement(ctx: Context, poNumber: string): Promise<AssetProcurement>;
    reprocessAssetProcurement(ctx: Context, poNumber: string): Promise<AssetProcurement>;
}
