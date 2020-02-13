import { StageDetails } from './stage-details.model';
export declare class RDCReceived extends StageDetails {
    constructor(init?: Partial<RDCReceived>);
    CreatedDateTime: number;
    KeyRecNumber: string;
    RDC: string;
    SKU: string;
    Quantity: number;
    UnitCost: number;
}
export declare class RDCReceivedList {
    constructor(init?: Partial<RDCReceivedList>);
    PONumber: string;
    Items: RDCReceived[];
}
