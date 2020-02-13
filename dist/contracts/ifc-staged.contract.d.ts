import { Context, Contract } from 'fabric-contract-api';
import { IFCStaged, AssetProcurement, IFCStagedList } from "../models";
export declare class IFCStagedContract extends Contract {
    constructor();
    bulkSaveIFCStaged(ctx: Context, newListOfIFCStagedLists: IFCStagedList[]): Promise<AssetProcurement[]>;
    saveIFCStaged(ctx: Context, poNumber: string, newIFCStagedList: IFCStaged[]): Promise<AssetProcurement>;
}
