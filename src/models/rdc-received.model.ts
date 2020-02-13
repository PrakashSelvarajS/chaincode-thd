import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class RDCReceived extends StageDetails {


  constructor(init?:Partial<RDCReceived>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CreatedDateTime: number;
  @Property() public KeyRecNumber: string;
  @Property() public RDC: string;
  @Property() public SKU: string;
  @Property() public Quantity: number;
  @Property() public UnitCost: number;

}





@Object()
export class RDCReceivedList {

  constructor(init?:Partial<RDCReceivedList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'RDCReceived[]') public Items: RDCReceived[];

}