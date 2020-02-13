import { Context, Contract } from 'fabric-contract-api';
import { PurchaseOrder, AssetProcurement, PurchaseOrderList } from "../models";
export declare class PurchaseOrderContract extends Contract {
    constructor();
    bulkSavePurchaseOrders(ctx: Context, newListOfPurchaseOrderLists: PurchaseOrderList[]): Promise<AssetProcurement[]>;
    savePurchaseOrder(ctx: Context, poNumber: string, newPurchaseOrderList: PurchaseOrder[]): Promise<AssetProcurement>;
}
