import { StageDetails } from './stage-details.model';
export declare class VendorShipped extends StageDetails {
    constructor(init?: Partial<VendorShipped>);
    CreatedDateTime: number;
    ASNNumber: string;
    ASNShipmentID: string;
    UCC128: string;
    RDC: string;
    SKU: string;
    SKUGTIN: string;
    Quantity: number;
    POLineItem?: number;
}
export declare class VendorShippedList {
    constructor(init?: Partial<VendorShippedList>);
    PONumber: string;
    Items: VendorShipped[];
}
