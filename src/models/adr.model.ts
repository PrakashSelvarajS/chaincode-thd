import { Object, Property } from 'fabric-contract-api';
import { AssetProcurement } from './asset-procurement.model';


export enum ADRFactType {
  PurchaseOrderQuantityMatched = 'PurchaseOrderQuantityMatched',
  VendorShippedQuantityMatched = 'VendorShippedQuantityMatched',
  IFCReceivedQuantityMatched = 'IFCReceivedQuantityMatched',
  IFCStagedQuantityMatched = 'IFCStagedQuantityMatched',
  IFCShippedQuantityMatched = 'IFCShippedQuantityMatched',
  RDCReceivedQuantityMatched = 'RDCReceivedQuantityMatched',
  RDCReceivedCostMatched = 'RDCReceivedCostMatched',
  InvoiceQuantityMatched = 'InvoiceQuantityMatched',
  InvoiceCostMatched = 'InvoiceCostMatched',
  IFCReceivedDaysDelayed = 'IFCReceivedDaysDelayed',
  RDCReceivedDaysDelayed = 'RDCReceivedDaysDelayed'
}

export enum ComparisonType {
  GreaterThan = '>',
  LessThan = '<',
  EqualTo = '==',
  GreaterThanOrEqualTo = '>=',
  LessThanOrEqualTo = '<=',
  NotEqualTo = '!='
}


@Object()
export class ADRRule {

  public constructor(init?:Partial<ADRRule>) {
      global.Object.assign(this, init);
  }

  @Property() public RuleID : string;  
  @Property() public Description : string;  
  @Property() public Solution : string;  
  @Property('Conditions', 'ADRRuleCondition[]') public Conditions : ADRRuleCondition[];
}

@Object()
export class ADRRuleCondition {

  public constructor(init?:Partial<ADRRuleCondition>) {
      global.Object.assign(this, init);
  }
  
  @Property() public RuleConditionID : string;  
  @Property() public RuleID : string;  
  @Property() public Description : string;  
  @Property() public FactType : ADRFactType;  
  @Property() public MinimumValue : number;  
  @Property() public MinimumComparisonType : ComparisonType;  
  @Property() public MaximumValue : number;  
  @Property() public MaximumComparisonType : ComparisonType;  
  @Property() public LastUpdatedDate : number;
}



@Object()
export class ADRRuleList {
  constructor(init?:Partial<ADRRuleList>) { global.Object.assign(this, init); }

  @Property('Items', 'ADRRule[]') public Items: ADRRule[];  
}