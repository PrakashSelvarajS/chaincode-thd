import { AssetProcurement, UnitOfMeasureList, ADRRuleList } from './models';
export interface APProcessingConfig {
    uomList?: UnitOfMeasureList;
    adrRuleList?: ADRRuleList;
}
export interface APMetrics {
}
export declare class ProcessingEngine {
    private states;
    private fsm;
    private ap;
    private uomList;
    private adrRuleList;
    private facts;
    constructor();
    static startProcessing(assetProcurement: AssetProcurement, config: APProcessingConfig): AssetProcurement;
    startProcessing(assetProcurement: AssetProcurement, config: APProcessingConfig): AssetProcurement;
    private finishProcessing;
    private checkPackSizeDiscrepancy;
    private logADROutput;
    private beforeItemsDemanded;
    private beforeVendorTruckLoaded;
    private beforeIFCTruckUnloaded;
    private beforeHomeFreightTruckUnloaded;
    private beforeItemsSorted;
    private beforeIFCTruckLoaded;
    private beforeRDCTruckUnloaded;
    private onBeforeInvoiceReceived;
    private ensureStageHasData;
    private purchaseOrdered;
    private vendorShipped;
    private ifcReceived;
    private ifcStaged;
    private ifcShipped;
    private rdcReceived;
    private invoiced;
    private createDiscrepancy;
}
