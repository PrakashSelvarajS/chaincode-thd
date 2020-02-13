import { Object, Property } from 'fabric-contract-api';
import { StageDetails } from './stage-details.model';


@Object()
export class IFCStaged extends StageDetails {


  constructor(init?:Partial<IFCStaged>) {
    super();
    global.Object.assign(this, init);
  }

  @Property() public CreatedDateTime: number;
  @Property() public UCC128: string;
  @Property() public RDC: string;
  @Property() public SKU: string;
  @Property() public Quantity: number;

  @Property() public VendorID?: string;     // RENAME
  @Property() public Description?: string;

}





@Object()
export class IFCStagedList {

  constructor(init?:Partial<IFCStagedList>) {
    global.Object.assign(this, init);
  }

  @Property() public PONumber: string;  
  @Property('Items', 'IFCStaged[]') public Items: IFCStaged[];

}