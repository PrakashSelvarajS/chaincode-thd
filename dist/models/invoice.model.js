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
let Invoice = class Invoice extends stage_details_model_1.StageDetails {
    constructor(init) {
        super();
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "InvoiceNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Invoice.prototype, "InvoiceDate", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "PVendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "MVendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "RDC", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "MerDeptNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Invoice.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Invoice.prototype, "InvoiceQuantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Invoice.prototype, "UnitCostAmount", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], Invoice.prototype, "TotalCostAmount", void 0);
Invoice = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], Invoice);
exports.Invoice = Invoice;
let InvoiceList = class InvoiceList {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], InvoiceList.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property('Items', 'Invoice[]'),
    __metadata("design:type", Array)
], InvoiceList.prototype, "Items", void 0);
InvoiceList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], InvoiceList);
exports.InvoiceList = InvoiceList;
//# sourceMappingURL=invoice.model.js.map