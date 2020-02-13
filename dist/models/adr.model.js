"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
var ADRFactType;
(function (ADRFactType) {
    ADRFactType["PurchaseOrderQuantityMatched"] = "PurchaseOrderQuantityMatched";
    ADRFactType["VendorShippedQuantityMatched"] = "VendorShippedQuantityMatched";
    ADRFactType["IFCReceivedQuantityMatched"] = "IFCReceivedQuantityMatched";
    ADRFactType["IFCStagedQuantityMatched"] = "IFCStagedQuantityMatched";
    ADRFactType["IFCShippedQuantityMatched"] = "IFCShippedQuantityMatched";
    ADRFactType["RDCReceivedQuantityMatched"] = "RDCReceivedQuantityMatched";
    ADRFactType["RDCReceivedCostMatched"] = "RDCReceivedCostMatched";
    ADRFactType["InvoiceQuantityMatched"] = "InvoiceQuantityMatched";
    ADRFactType["InvoiceCostMatched"] = "InvoiceCostMatched";
    ADRFactType["IFCReceivedDaysDelayed"] = "IFCReceivedDaysDelayed";
    ADRFactType["RDCReceivedDaysDelayed"] = "RDCReceivedDaysDelayed";
})(ADRFactType = exports.ADRFactType || (exports.ADRFactType = {}));
var ComparisonType;
(function (ComparisonType) {
    ComparisonType["GreaterThan"] = ">";
    ComparisonType["LessThan"] = "<";
    ComparisonType["EqualTo"] = "==";
    ComparisonType["GreaterThanOrEqualTo"] = ">=";
    ComparisonType["LessThanOrEqualTo"] = "<=";
    ComparisonType["NotEqualTo"] = "!=";
})(ComparisonType = exports.ComparisonType || (exports.ComparisonType = {}));
let ADRRule = class ADRRule {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRule.prototype, "RuleID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRule.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRule.prototype, "Solution", void 0);
__decorate([
    fabric_contract_api_1.Property('Conditions', 'ADRRuleCondition[]'),
    __metadata("design:type", Array)
], ADRRule.prototype, "Conditions", void 0);
ADRRule = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], ADRRule);
exports.ADRRule = ADRRule;
let ADRRuleCondition = class ADRRuleCondition {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "RuleConditionID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "RuleID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "FactType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], ADRRuleCondition.prototype, "MinimumValue", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "MinimumComparisonType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], ADRRuleCondition.prototype, "MaximumValue", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], ADRRuleCondition.prototype, "MaximumComparisonType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], ADRRuleCondition.prototype, "LastUpdatedDate", void 0);
ADRRuleCondition = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], ADRRuleCondition);
exports.ADRRuleCondition = ADRRuleCondition;
let ADRRuleList = class ADRRuleList {
    constructor(init) { global.Object.assign(this, init); }
};
__decorate([
    fabric_contract_api_1.Property('Items', 'ADRRule[]'),
    __metadata("design:type", Array)
], ADRRuleList.prototype, "Items", void 0);
ADRRuleList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], ADRRuleList);
exports.ADRRuleList = ADRRuleList;
//# sourceMappingURL=adr.model.js.map