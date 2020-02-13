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
const decorators_1 = require("../decorators");
let PurchaseOrder = class PurchaseOrder extends stage_details_model_1.StageDetails {
    constructor(init) {
        super();
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "CreatedDateTime", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "IFCDC", void 0);
__decorate([
    fabric_contract_api_1.Property(), decorators_1.NumberRangeValidator({ defaultMinimum: 1 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "Quantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "RDC", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "SKUGTIN", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "VendorID", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "UnitPrice", void 0);
PurchaseOrder = __decorate([
    fabric_contract_api_1.Object(),
    decorators_1.ValidatedObject(),
    __metadata("design:paramtypes", [Object])
], PurchaseOrder);
exports.PurchaseOrder = PurchaseOrder;
let PurchaseOrderList = class PurchaseOrderList {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], PurchaseOrderList.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property('Items', 'PurchaseOrder[]'),
    __metadata("design:type", Array)
], PurchaseOrderList.prototype, "Items", void 0);
PurchaseOrderList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], PurchaseOrderList);
exports.PurchaseOrderList = PurchaseOrderList;
//# sourceMappingURL=purchase-order.model.js.map