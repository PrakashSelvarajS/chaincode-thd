import { StageDetails } from './stage-details.model';
export declare class IFCShipped extends StageDetails {
    constructor(init?: Partial<IFCShipped>);
    CreatedDateTime: number;
    ShippedDateTime: number;
    RDC: string;
    SKU: string;
    SKUGTIN: string;
    Quantity: number;
    VendorID: string;
    Description?: string;
    TCASNID?: string;
    BOLNumber?: string;
    PRONumber?: string;
    Carrier?: string;
}
export declare class IFCShippedList {
    constructor(init?: Partial<IFCShippedList>);
    PONumber: string;
    Items: IFCShipped[];
}
