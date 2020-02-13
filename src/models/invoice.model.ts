import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class Invoice extends StageDetails {


  constructor(init?:Partial<Invoice>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public InvoiceNumber: string;
  @Property() public InvoiceDate: number;
  @Property() public PVendorID: string;
  @Property() public MVendorID: string;
  @Property() public RDC: string;
  @Property() public MerDeptNumber: string;

  @Property() public SKU: string;
  @Property() public InvoiceQuantity: number;
  @Property() public UnitCostAmount: number;
  @Property() public TotalCostAmount: number;

}





@Object()
export class InvoiceList {

  constructor(init?:Partial<InvoiceList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'Invoice[]') public Items: Invoice[];

}
