import { Object, Property } from 'fabric-contract-api';
import { StageDetails, PurchaseOrder, VendorShipped, IFCReceived, IFCStaged, IFCShipped, RDCReceived, Invoice, Discrepancy } from '.';



export enum StageType {
  Unstarted = "Unstarted",
  PurchaseOrdered = "PurchaseOrdered",
  VendorShipped = "VendorShipped",
  IFCReceived = "IFCReceived",
  IFCStaged = "IFCStaged",
  IFCShipped = "IFCShipped",
  RDCReceived = "RDCReceived",
  Invoiced = "Invoiced"
}



@Object()
export class AssetProcurement {

  @Property() public PONumber: string;
  @Property() public RecommendedSolution?: string = "Don't Pay";

  @Property('PurchaseOrders', 'PurchaseOrder[]') public PurchaseOrders?: PurchaseOrder[];
  @Property('PurchaseOrderDiscrepancies', 'Discrepancy[]') public PurchaseOrderDiscrepancies?: Discrepancy[];

  @Property('VendorShippeds', 'VendorShipped[]') public VendorShippeds?: VendorShipped[];
  @Property('VendorShippedDiscrepancies', 'Discrepancy[]') public VendorShippedDiscrepancies?: Discrepancy[];

  @Property('IFCReceiveds', 'IFCReceived[]') public IFCReceiveds?: IFCReceived[];
  @Property('IFCReceivedDiscrepancies', 'Discrepancy[]') public IFCReceivedDiscrepancies?: Discrepancy[];

  @Property('IFCStageds', 'IFCStaged[]') public IFCStageds?: IFCStaged[];
  @Property('IFCStagedDiscrepancies', 'Discrepancy[]') public IFCStagedDiscrepancies?: Discrepancy[];

  @Property('IFCShippeds', 'IFCShipped[]') public IFCShippeds?: IFCShipped[];
  @Property('IFCShippedDiscrepancies', 'Discrepancy[]') public IFCShippedDiscrepancies?: Discrepancy[];

  @Property('RDCReceiveds', 'RDCReceived[]') public RDCReceiveds?: RDCReceived[];
  @Property('RDCReceivedDiscrepancies', 'Discrepancy[]') public RDCReceivedDiscrepancies?: Discrepancy[];

  @Property('Invoices', 'Invoice[]') public Invoices?: Invoice[];
  @Property('InvoiceDiscrepancies', 'Discrepancy[]') public InvoiceDiscrepancies?: Discrepancy[];

  
  public constructor(init?:Partial<AssetProcurement>) {
      global.Object.assign(this, init);
  }

  isHomeFreight(): boolean {
    if (this.PurchaseOrders === undefined || this.PurchaseOrders.length === 0) {
      return false;
    } else {
      const firstPO: PurchaseOrder = this.PurchaseOrders![0];
      return (firstPO.RDC === undefined || firstPO.RDC === null || firstPO.RDC.toString().trim().length === 0);
    }
  }

  getStageDetails<T extends PurchaseOrder | VendorShipped | IFCReceived | IFCStaged | IFCShipped | RDCReceived | Invoice>(stageType: StageType): T[] | undefined {
    switch (stageType) {
      case StageType.PurchaseOrdered:
        return this.PurchaseOrders as T[] | undefined;
      case StageType.VendorShipped:
        return this.VendorShippeds as T[] | undefined;
      case StageType.IFCReceived:
        return this.IFCReceiveds as T[] | undefined;
      case StageType.IFCStaged:
        return this.IFCStageds as T[] | undefined;
      case StageType.IFCShipped:
        return this.IFCShippeds as T[] | undefined;
      case StageType.RDCReceived:
        return this.RDCReceiveds as T[] | undefined;
      case StageType.Invoiced:
        return this.Invoices as T[] | undefined;
      default:
        console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
        return undefined;
    }
  }

  setStageDetails(stageType: StageType, details: StageDetails[]): void {
    switch (stageType) {
      case StageType.PurchaseOrdered:
        this.PurchaseOrders = details as PurchaseOrder[];
        break;
      case StageType.VendorShipped:
        this.VendorShippeds = details as VendorShipped[];
        break;
      case StageType.IFCReceived:
        this.IFCReceiveds = details as IFCReceived[];
        break;
      case StageType.IFCStaged:
        this.IFCStageds = details as IFCStaged[];
        break;
      case StageType.IFCShipped:
        this.IFCShippeds = details as IFCShipped[];
        break;
      case StageType.RDCReceived:
        this.RDCReceiveds = details as RDCReceived[];
        break;
      case StageType.Invoiced:
        this.Invoices = details as Invoice[];
        break;
      default:
        console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
        break;
    }
  }

  getStageDiscrepancies(stageType: StageType): Discrepancy[] | undefined {
    switch (stageType) {
      case StageType.PurchaseOrdered:
        return this.PurchaseOrderDiscrepancies;
      case StageType.VendorShipped:
        return this.VendorShippedDiscrepancies;
      case StageType.IFCReceived:
        return this.IFCReceivedDiscrepancies;
      case StageType.IFCStaged:
        return this.IFCStagedDiscrepancies;
      case StageType.IFCShipped:
        return this.IFCShippedDiscrepancies;
      case StageType.RDCReceived:
        return this.RDCReceivedDiscrepancies;
      case StageType.Invoiced:
        return this.InvoiceDiscrepancies;
      default:
        console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
        return undefined;
    }
  }

  setStageDiscrepancies(stageType: StageType, discrepancies: Discrepancy[]): void {
    switch (stageType) {
      case StageType.PurchaseOrdered:
        this.PurchaseOrderDiscrepancies = discrepancies;
        break;
      case StageType.VendorShipped:
        this.VendorShippedDiscrepancies = discrepancies;
        break;
      case StageType.IFCReceived:
        this.IFCReceivedDiscrepancies = discrepancies;
        break;
      case StageType.IFCStaged:
        this.IFCStagedDiscrepancies = discrepancies;
        break;
      case StageType.IFCShipped:
        this.IFCShippedDiscrepancies = discrepancies;
        break;
      case StageType.RDCReceived:
        this.RDCReceivedDiscrepancies = discrepancies;
        break;
      case StageType.Invoiced:
        this.InvoiceDiscrepancies = discrepancies;
        break;
      default:
        console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
        break;
    }
  }

  addStageDiscrepancy(stageType: StageType, discrepancy: Discrepancy): void {
    const currentDiscrepancies: Discrepancy[] | undefined = this.getStageDiscrepancies(stageType);
    if (currentDiscrepancies === undefined || currentDiscrepancies.length === 0) {
      this.setStageDiscrepancies(stageType, [discrepancy]);
    } else {
      currentDiscrepancies.push(discrepancy);
      this.setStageDiscrepancies(stageType, currentDiscrepancies);
    }
  }


}
