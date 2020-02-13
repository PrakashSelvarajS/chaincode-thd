import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class IFCReceived extends StageDetails {


  constructor(init?:Partial<IFCReceived>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CheckinDateTime: number;
  @Property() public ReceivedDateTime: number;
  @Property() public UCC128: string;
  @Property() public RDC: string;
  @Property() public SKU: string;
  @Property() public SKUGTIN: string;
  @Property() public OrderQuantity: number;
  @Property() public ShippedQuantity: number;
  @Property() public ReceivedQuantity: number;
  @Property() public VendorID: string;    // RENAME

  @Property() public Description?: string;

}





@Object()
export class IFCReceivedList {

  constructor(init?:Partial<IFCReceivedList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'IFCReceived[]') public Items: IFCReceived[];

}
