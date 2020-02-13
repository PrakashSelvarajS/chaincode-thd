import { Context, Contract } from 'fabric-contract-api';
import { RDCReceived, AssetProcurement, RDCReceivedList } from "../models";
export declare class RDCReceivedContract extends Contract {
    constructor();
    bulkSaveRDCReceived(ctx: Context, newListOfRDCReceivedLists: RDCReceivedList[]): Promise<AssetProcurement[]>;
    saveRDCReceived(ctx: Context, poNumber: string, newRDCReceivedList: RDCReceived[]): Promise<AssetProcurement>;
}
