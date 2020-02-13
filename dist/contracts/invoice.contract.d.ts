import { Context, Contract } from 'fabric-contract-api';
import { Invoice, AssetProcurement, InvoiceList } from "../models";
export declare class InvoiceContract extends Contract {
    constructor();
    bulkSaveInvoice(ctx: Context, newListOfInvoiceLists: InvoiceList[]): Promise<AssetProcurement[]>;
    saveInvoice(ctx: Context, poNumber: string, newInvoiceList: Invoice[]): Promise<AssetProcurement>;
}
