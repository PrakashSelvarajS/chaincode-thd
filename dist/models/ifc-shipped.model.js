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
let IFCShipped = class IFCShipped extends stage_details_model_1.StageDetails {
    constructor(init) {
        super();
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], IFCShipped.prototype, "CreatedDateTime", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], IFCShipped.prototype, "ShippedDateTime", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "RDC", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "SKUGTIN", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], IFCShipped.prototype, "Quantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "VendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "TCASNID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "BOLNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "PRONumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShipped.prototype, "Carrier", void 0);
IFCShipped = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], IFCShipped);
exports.IFCShipped = IFCShipped;
let IFCShippedList = class IFCShippedList {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], IFCShippedList.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property('Items', 'IFCShipped[]'),
    __metadata("design:type", Array)
], IFCShippedList.prototype, "Items", void 0);
IFCShippedList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], IFCShippedList);
exports.IFCShippedList = IFCShippedList;
//# sourceMappingURL=ifc-shipped.model.js.map