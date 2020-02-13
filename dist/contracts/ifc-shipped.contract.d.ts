import { Context, Contract } from 'fabric-contract-api';
import { IFCShipped, AssetProcurement, IFCShippedList } from "../models";
export declare class IFCShippedContract extends Contract {
    constructor();
    bulkSaveIFCShipped(ctx: Context, newListOfIFCShippedLists: IFCShippedList[]): Promise<AssetProcurement[]>;
    saveIFCShipped(ctx: Context, poNumber: string, newIFCShippedList: IFCShipped[]): Promise<AssetProcurement>;
}
