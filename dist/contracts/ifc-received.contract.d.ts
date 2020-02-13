import { Context, Contract } from 'fabric-contract-api';
import { IFCReceived, AssetProcurement, IFCReceivedList } from "../models";
export declare class IFCReceivedContract extends Contract {
    constructor();
    bulkSaveIFCReceived(ctx: Context, newListOfIFCReceivedLists: IFCReceivedList[]): Promise<AssetProcurement[]>;
    saveIFCReceived(ctx: Context, poNumber: string, newIFCReceivedList: IFCReceived[]): Promise<AssetProcurement>;
}
