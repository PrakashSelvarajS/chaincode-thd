import { Object, Property } from 'fabric-contract-api';
import { StageType } from '.';

// NOTE: FillShortage/FillOverage are only for Vendors :: THD uses Overage/Shortage if their is a mistake with shipping internally
export enum DiscrepancyType {
  SKUMissingFromUOM = "SKUMissingFromUOM",
  WrongSKU = "WrongSKU",
  FillOverage = "FillOverage",
  FillShortage = "FillShortage",
  Overage = "Overage",
  Shortage = "Shortage",
  WrongRDC = "WrongRDC",
  MissingPallet = "MissingPallet",
  AdditionalPallet = "AdditionalPallet",
  KeyRecDelayed = "KeyRecDelayed",
  MissingPO = "MissingPO",
  MissingVendorShipped = "MissingVendorShipped",
  BlankSKUAtVendorShipped = "BlankSKUAtVendorShipped"
}

@Object()
export class Discrepancy {

  public constructor(init?:Partial<Discrepancy>) {
      global.Object.assign(this, init);
  }


  @Property() public PONumber: string;
  @Property() public DiscrepancyID: string;
  @Property() public DiscrepancyType: DiscrepancyType;
  @Property() public StageType: StageType;

  @Property() public RecordID?: string;
  @Property() public ItemID?: string;
  @Property() public ExpectedQuantity?: number;
  @Property() public ObservedQuantity?: number;

}