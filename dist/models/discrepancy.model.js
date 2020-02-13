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
const _1 = require(".");
// NOTE: FillShortage/FillOverage are only for Vendors :: THD uses Overage/Shortage if their is a mistake with shipping internally
var DiscrepancyType;
(function (DiscrepancyType) {
    DiscrepancyType["SKUMissingFromUOM"] = "SKUMissingFromUOM";
    DiscrepancyType["WrongSKU"] = "WrongSKU";
    DiscrepancyType["FillOverage"] = "FillOverage";
    DiscrepancyType["FillShortage"] = "FillShortage";
    DiscrepancyType["Overage"] = "Overage";
    DiscrepancyType["Shortage"] = "Shortage";
    DiscrepancyType["WrongRDC"] = "WrongRDC";
    DiscrepancyType["MissingPallet"] = "MissingPallet";
    DiscrepancyType["AdditionalPallet"] = "AdditionalPallet";
    DiscrepancyType["KeyRecDelayed"] = "KeyRecDelayed";
    DiscrepancyType["MissingPO"] = "MissingPO";
    DiscrepancyType["MissingVendorShipped"] = "MissingVendorShipped";
    DiscrepancyType["BlankSKUAtVendorShipped"] = "BlankSKUAtVendorShipped";
})(DiscrepancyType = exports.DiscrepancyType || (exports.DiscrepancyType = {}));
let Discrepancy = class Discrepancy {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "DiscrepancyID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "DiscrepancyType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "StageType", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "RecordID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Discrepancy.prototype, "ItemID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Discrepancy.prototype, "ExpectedQuantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Discrepancy.prototype, "ObservedQuantity", void 0);
Discrepancy = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], Discrepancy);
exports.Discrepancy = Discrepancy;
//# sourceMappingURL=discrepancy.model.js.map