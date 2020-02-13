import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';
import { ValidatedObject, NumberRangeValidator } from '../decorators'


@Object()
@ValidatedObject()
export class PurchaseOrder extends StageDetails {


  constructor(init?:Partial<PurchaseOrder>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CreatedDateTime: number;
  @Property() public IFCDC: string;
  @Property() @NumberRangeValidator({defaultMinimum: 1}) public Quantity: number;
  @Property() public SKU: string;

  @Property() public RDC?: string;
  @Property() public SKUGTIN?: string;
  @Property() public VendorID?: string;
  @Property() public Description?: string;
  @Property() public UnitPrice?: number;

}



@Object()
export class PurchaseOrderList {

  constructor(init?:Partial<PurchaseOrderList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'PurchaseOrder[]') public Items: PurchaseOrder[];

}
