import { StageDetails } from './stage-details.model';
export declare class PurchaseOrder extends StageDetails {
    constructor(init?: Partial<PurchaseOrder>);
    CreatedDateTime: number;
    IFCDC: string;
    Quantity: number;
    SKU: string;
    RDC?: string;
    SKUGTIN?: string;
    VendorID?: string;
    Description?: string;
    UnitPrice?: number;
}
export declare class PurchaseOrderList {
    constructor(init?: Partial<PurchaseOrderList>);
    PONumber: string;
    Items: PurchaseOrder[];
}
