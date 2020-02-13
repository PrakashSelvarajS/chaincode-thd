import { StageDetails } from './stage-details.model';
export declare class Invoice extends StageDetails {
    constructor(init?: Partial<Invoice>);
    InvoiceNumber: string;
    InvoiceDate: number;
    PVendorID: string;
    MVendorID: string;
    RDC: string;
    MerDeptNumber: string;
    SKU: string;
    InvoiceQuantity: number;
    UnitCostAmount: number;
    TotalCostAmount: number;
}
export declare class InvoiceList {
    constructor(init?: Partial<InvoiceList>);
    PONumber: string;
    Items: Invoice[];
}
