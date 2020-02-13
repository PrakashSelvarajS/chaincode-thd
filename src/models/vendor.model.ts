import { Object, Property } from 'fabric-contract-api';

@Object()
export class Vendor {
  constructor(init?:Partial<Vendor>) { global.Object.assign(this, init); }

  @Property() public RecordID: string;

  @Property() public Name: string;
  @Property() public TenantName: string;
  @Property() public HLFOrganization: string;
  @Property() public HLFMemberServicesProvider: string;
  @Property() public ParentVendorID: string;
  @Property() public VendorID: string;
  @Property() public LastUpdatedDate: number;

}

@Object()
export class VendorList {
  constructor(init?:Partial<VendorList>) { global.Object.assign(this, init); }

  @Property('Items', 'Vendor[]') public Items: Vendor[];  
}