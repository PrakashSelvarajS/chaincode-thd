import { StageDetails, PurchaseOrder, VendorShipped, IFCReceived, IFCStaged, IFCShipped, RDCReceived, Invoice, Discrepancy } from '.';
export declare enum StageType {
    Unstarted = "Unstarted",
    PurchaseOrdered = "PurchaseOrdered",
    VendorShipped = "VendorShipped",
    IFCReceived = "IFCReceived",
    IFCStaged = "IFCStaged",
    IFCShipped = "IFCShipped",
    RDCReceived = "RDCReceived",
    Invoiced = "Invoiced"
}
export declare class AssetProcurement {
    PONumber: string;
    RecommendedSolution?: string;
    PurchaseOrders?: PurchaseOrder[];
    PurchaseOrderDiscrepancies?: Discrepancy[];
    VendorShippeds?: VendorShipped[];
    VendorShippedDiscrepancies?: Discrepancy[];
    IFCReceiveds?: IFCReceived[];
    IFCReceivedDiscrepancies?: Discrepancy[];
    IFCStageds?: IFCStaged[];
    IFCStagedDiscrepancies?: Discrepancy[];
    IFCShippeds?: IFCShipped[];
    IFCShippedDiscrepancies?: Discrepancy[];
    RDCReceiveds?: RDCReceived[];
    RDCReceivedDiscrepancies?: Discrepancy[];
    Invoices?: Invoice[];
    InvoiceDiscrepancies?: Discrepancy[];
    constructor(init?: Partial<AssetProcurement>);
    isHomeFreight(): boolean;
    getStageDetails<T extends PurchaseOrder | VendorShipped | IFCReceived | IFCStaged | IFCShipped | RDCReceived | Invoice>(stageType: StageType): T[] | undefined;
    setStageDetails(stageType: StageType, details: StageDetails[]): void;
    getStageDiscrepancies(stageType: StageType): Discrepancy[] | undefined;
    setStageDiscrepancies(stageType: StageType, discrepancies: Discrepancy[]): void;
    addStageDiscrepancy(stageType: StageType, discrepancy: Discrepancy): void;
}
