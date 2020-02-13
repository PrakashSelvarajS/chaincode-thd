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
const stage_details_model_1 = require("./stage-details.model");
let VendorShipped = class VendorShipped extends stage_details_model_1.StageDetails {
    constructor(init) {
        super();
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], VendorShipped.prototype, "CreatedDateTime", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "ASNNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "ASNShipmentID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "UCC128", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "RDC", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShipped.prototype, "SKUGTIN", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], VendorShipped.prototype, "Quantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], VendorShipped.prototype, "POLineItem", void 0);
VendorShipped = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], VendorShipped);
exports.VendorShipped = VendorShipped;
let VendorShippedList = class VendorShippedList {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], VendorShippedList.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property('Items', 'VendorShipped[]'),
    __metadata("design:type", Array)
], VendorShippedList.prototype, "Items", void 0);
VendorShippedList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], VendorShippedList);
exports.VendorShippedList = VendorShippedList;
//# sourceMappingURL=vendor-shipped.model.js.map