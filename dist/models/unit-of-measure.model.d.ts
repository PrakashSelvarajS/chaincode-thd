export declare class UnitOfMeasure {
    constructor(init?: Partial<UnitOfMeasure>);
    RecordID: string;
    VendorID: string;
    SKU: string;
    SKUGTIN: string;
    Description: string;
    UnitWeight: number;
    UnitVolume: number;
    UnitHeight: number;
    UnitLength: number;
    UnitWidth: number;
    UnitCost: number;
    PalletCount: number;
    CaseCount: number;
    PackCount: number;
    EachCount: number;
    OtherCount: number;
    UpdateDate: number;
    OrderStandard: PackageType;
}
export declare class UnitOfMeasureList {
    constructor(init?: Partial<UnitOfMeasureList>);
    Items: UnitOfMeasure[];
}
export declare enum PackageType {
    Pallet = "Pallet",
    Case = "Case",
    Pack = "Pack",
    Each = "Each",
    Other = "Other"
}
