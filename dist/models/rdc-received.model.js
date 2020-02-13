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
let RDCReceived = class RDCReceived extends stage_details_model_1.StageDetails {
    constructor(init) {
        super();
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], RDCReceived.prototype, "CreatedDateTime", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], RDCReceived.prototype, "KeyRecNumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], RDCReceived.prototype, "RDC", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], RDCReceived.prototype, "SKU", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], RDCReceived.prototype, "Quantity", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Number)
], RDCReceived.prototype, "UnitCost", void 0);
RDCReceived = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], RDCReceived);
exports.RDCReceived = RDCReceived;
let RDCReceivedList = class RDCReceivedList {
    constructor(init) {
        global.Object.assign(this, init);
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], RDCReceivedList.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property('Items', 'RDCReceived[]'),
    __metadata("design:type", Array)
], RDCReceivedList.prototype, "Items", void 0);
RDCReceivedList = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], RDCReceivedList);
exports.RDCReceivedList = RDCReceivedList;
//# sourceMappingURL=rdc-received.model.js.map