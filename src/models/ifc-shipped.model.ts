import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class IFCShipped extends StageDetails {


  constructor(init?:Partial<IFCShipped>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CreatedDateTime: number;
  @Property() public ShippedDateTime: number;
  @Property() public RDC: string;
  @Property() public SKU: string;
  @Property() public SKUGTIN: string;
  @Property() public Quantity: number;
  @Property() public VendorID: string;     // RENAME

  @Property() public Description?: string;
  @Property() public TCASNID?: string;
  @Property() public BOLNumber?: string;
  @Property() public PRONumber?: string;
  @Property() public Carrier?: string;

}





@Object()
export class IFCShippedList {

  constructor(init?:Partial<IFCShippedList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'IFCShipped[]') public Items: IFCShipped[];

}