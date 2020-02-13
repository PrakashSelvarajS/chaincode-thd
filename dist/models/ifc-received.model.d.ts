import { StageDetails } from './stage-details.model';
export declare class IFCReceived extends StageDetails {
    constructor(init?: Partial<IFCReceived>);
    CheckinDateTime: number;
    ReceivedDateTime: number;
    UCC128: string;
    RDC: string;
    SKU: string;
    SKUGTIN: string;
    OrderQuantity: number;
    ShippedQuantity: number;
    ReceivedQuantity: number;
    VendorID: string;
    Description?: string;
}
export declare class IFCReceivedList {
    constructor(init?: Partial<IFCReceivedList>);
    PONumber: string;
    Items: IFCReceived[];
}
