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
let Vendor = class Vendor {
    constructor(init) { global.Object.assign(this, init); }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "RecordID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "Name", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "TenantName", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "HLFOrganization", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "HLFMemberServicesProvider", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "ParentVendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Vendor.prototype, "VendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Vendor.prototype, "LastUpdatedDate", void 0);
Vendor = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], Vendor);
exports.Vendor = Vendor;
let VendorList = class VendorList {
    constructor(init) { global.Object.assign(this, init); }
};
__decorate([
    fabric_contract_api_1.Property('Items', 'Vendor[]'),
    __metadata("design:type", Array)
], VendorList.prototype, "Items", void 0);
VendorList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], VendorList);
exports.VendorList = VendorList;
//# sourceMappingURL=vendor.model.js.map