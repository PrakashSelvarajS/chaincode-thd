import { StageDetails } from './stage-details.model';
export declare class IFCStaged extends StageDetails {
    constructor(init?: Partial<IFCStaged>);
    CreatedDateTime: number;
    UCC128: string;
    RDC: string;
    SKU: string;
    Quantity: number;
    VendorID?: string;
    Description?: string;
}
export declare class IFCStagedList {
    constructor(init?: Partial<IFCStagedList>);
    PONumber: string;
    Items: IFCStaged[];
}
