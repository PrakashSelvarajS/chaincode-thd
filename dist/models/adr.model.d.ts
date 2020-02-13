export declare enum ADRFactType {
    PurchaseOrderQuantityMatched = "PurchaseOrderQuantityMatched",
    VendorShippedQuantityMatched = "VendorShippedQuantityMatched",
    IFCReceivedQuantityMatched = "IFCReceivedQuantityMatched",
    IFCStagedQuantityMatched = "IFCStagedQuantityMatched",
    IFCShippedQuantityMatched = "IFCShippedQuantityMatched",
    RDCReceivedQuantityMatched = "RDCReceivedQuantityMatched",
    RDCReceivedCostMatched = "RDCReceivedCostMatched",
    InvoiceQuantityMatched = "InvoiceQuantityMatched",
    InvoiceCostMatched = "InvoiceCostMatched",
    IFCReceivedDaysDelayed = "IFCReceivedDaysDelayed",
    RDCReceivedDaysDelayed = "RDCReceivedDaysDelayed"
}
export declare enum ComparisonType {
    GreaterThan = ">",
    LessThan = "<",
    EqualTo = "==",
    GreaterThanOrEqualTo = ">=",
    LessThanOrEqualTo = "<=",
    NotEqualTo = "!="
}
export declare class ADRRule {
    constructor(init?: Partial<ADRRule>);
    RuleID: string;
    Description: string;
    Solution: string;
    Conditions: ADRRuleCondition[];
}
export declare class ADRRuleCondition {
    constructor(init?: Partial<ADRRuleCondition>);
    RuleConditionID: string;
    RuleID: string;
    Description: string;
    FactType: ADRFactType;
    MinimumValue: number;
    MinimumComparisonType: ComparisonType;
    MaximumValue: number;
    MaximumComparisonType: ComparisonType;
    LastUpdatedDate: number;
}
export declare class ADRRuleList {
    constructor(init?: Partial<ADRRuleList>);
    Items: ADRRule[];
}
