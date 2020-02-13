export declare class Vendor {
    constructor(init?: Partial<Vendor>);
    RecordID: string;
    Name: string;
    TenantName: string;
    HLFOrganization: string;
    HLFMemberServicesProvider: string;
    ParentVendorID: string;
    VendorID: string;
    LastUpdatedDate: number;
}
export declare class VendorList {
    constructor(init?: Partial<VendorList>);
    Items: Vendor[];
}
