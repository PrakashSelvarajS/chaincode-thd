import { StageType } from '.';
export declare enum DiscrepancyType {
    SKUMissingFromUOM = "SKUMissingFromUOM",
    WrongSKU = "WrongSKU",
    FillOverage = "FillOverage",
    FillShortage = "FillShortage",
    Overage = "Overage",
    Shortage = "Shortage",
    WrongRDC = "WrongRDC",
    MissingPallet = "MissingPallet",
    AdditionalPallet = "AdditionalPallet",
    KeyRecDelayed = "KeyRecDelayed",
    MissingPO = "MissingPO",
    MissingVendorShipped = "MissingVendorShipped",
    BlankSKUAtVendorShipped = "BlankSKUAtVendorShipped"
}
export declare class Discrepancy {
    constructor(init?: Partial<Discrepancy>);
    PONumber: string;
    DiscrepancyID: string;
    DiscrepancyType: DiscrepancyType;
    StageType: StageType;
    RecordID?: string;
    ItemID?: string;
    ExpectedQuantity?: number;
    ObservedQuantity?: number;
}
