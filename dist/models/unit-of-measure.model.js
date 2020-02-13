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
let UnitOfMeasure = class UnitOfMeasure {
    constructor(init) {
        this.OrderStandard = PackageType.Each;
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "RecordID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "VendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "SKUGTIN", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitWeight", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitVolume", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitHeight", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitLength", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitWidth", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UnitCost", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "PalletCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "CaseCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "PackCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "EachCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "OtherCount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], UnitOfMeasure.prototype, "UpdateDate", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], UnitOfMeasure.prototype, "OrderStandard", void 0);
UnitOfMeasure = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], UnitOfMeasure);
exports.UnitOfMeasure = UnitOfMeasure;
let UnitOfMeasureList = class UnitOfMeasureList {
    constructor(init) { global.Object.assign(this, init); }
};
__decorate([
    fabric_contract_api_1.Property('Items', 'UnitOfMeasure[]'),
    __metadata("design:type", Array)
], UnitOfMeasureList.prototype, "Items", void 0);
UnitOfMeasureList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], UnitOfMeasureList);
exports.UnitOfMeasureList = UnitOfMeasureList;
var PackageType;
(function (PackageType) {
    PackageType["Pallet"] = "Pallet";
    PackageType["Case"] = "Case";
    PackageType["Pack"] = "Pack";
    PackageType["Each"] = "Each";
    PackageType["Other"] = "Other";
})(PackageType = exports.PackageType || (exports.PackageType = {}));
//# sourceMappingURL=unit-of-measure.model.js.map