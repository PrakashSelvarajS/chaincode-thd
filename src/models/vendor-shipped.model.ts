import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class VendorShipped extends StageDetails {


  constructor(init?:Partial<VendorShipped>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CreatedDateTime: number;
  @Property() public ASNNumber: string;
  @Property() public ASNShipmentID: string;
  @Property() public UCC128: string;
  @Property() public RDC: string;
  @Property() public SKU: string;
  @Property() public SKUGTIN: string;
  @Property() public Quantity: number;

  @Property() public POLineItem?: number;

}





@Object()
export class VendorShippedList {

  constructor(init?:Partial<VendorShippedList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'VendorShipped[]') public Items: VendorShipped[];

}