import { Object, Property } from 'fabric-contract-api';


@Object()
export class UnitOfMeasure {

  constructor(init?:Partial<UnitOfMeasure>) { global.Object.assign(this, init); }

  @Property() public RecordID: string;
  
  @Property() public VendorID: string;
  @Property() public SKU: string;
  @Property() public SKUGTIN: string;
  @Property() public Description: string;
  @Property() public UnitWeight: number;
  @Property() public UnitVolume: number;
  @Property() public UnitHeight: number;
  @Property() public UnitLength: number;
  @Property() public UnitWidth: number;

  @Property() public UnitCost: number;
  @Property() public PalletCount: number;
  @Property() public CaseCount: number;
  @Property() public PackCount: number;
  @Property() public EachCount: number;
  @Property() public OtherCount: number;
  @Property() public UpdateDate: number;
  @Property() public OrderStandard: PackageType = PackageType.Each;

}

@Object()
export class UnitOfMeasureList {
  constructor(init?:Partial<UnitOfMeasureList>) { global.Object.assign(this, init); }

  @Property('Items', 'UnitOfMeasure[]') public Items: UnitOfMeasure[];  
}

export enum PackageType {
  Pallet = "Pallet",
  Case = "Case",
  Pack = "Pack",
  Each = "Each",
  Other = "Other"
}

