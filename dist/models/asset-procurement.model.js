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
var StageType;
(function (StageType) {
    StageType["Unstarted"] = "Unstarted";
    StageType["PurchaseOrdered"] = "PurchaseOrdered";
    StageType["VendorShipped"] = "VendorShipped";
    StageType["IFCReceived"] = "IFCReceived";
    StageType["IFCStaged"] = "IFCStaged";
    StageType["IFCShipped"] = "IFCShipped";
    StageType["RDCReceived"] = "RDCReceived";
    StageType["Invoiced"] = "Invoiced";
})(StageType = exports.StageType || (exports.StageType = {}));
let AssetProcurement = class AssetProcurement {
    constructor(init) {
        this.RecommendedSolution = "Don't Pay";
        global.Object.assign(this, init);
    }
    isHomeFreight() {
        if (this.PurchaseOrders === undefined || this.PurchaseOrders.length === 0) {
            return false;
        }
        else {
            const firstPO = this.PurchaseOrders[0];
            return (firstPO.RDC === undefined || firstPO.RDC === null || firstPO.RDC.toString().trim().length === 0);
        }
    }
    getStageDetails(stageType) {
        switch (stageType) {
            case StageType.PurchaseOrdered:
                return this.PurchaseOrders;
            case StageType.VendorShipped:
                return this.VendorShippeds;
            case StageType.IFCReceived:
                return this.IFCReceiveds;
            case StageType.IFCStaged:
                return this.IFCStageds;
            case StageType.IFCShipped:
                return this.IFCShippeds;
            case StageType.RDCReceived:
                return this.RDCReceiveds;
            case StageType.Invoiced:
                return this.Invoices;
            default:
                console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
                return undefined;
        }
    }
    setStageDetails(stageType, details) {
        switch (stageType) {
            case StageType.PurchaseOrdered:
                this.PurchaseOrders = details;
                break;
            case StageType.VendorShipped:
                this.VendorShippeds = details;
                break;
            case StageType.IFCReceived:
                this.IFCReceiveds = details;
                break;
            case StageType.IFCStaged:
                this.IFCStageds = details;
                break;
            case StageType.IFCShipped:
                this.IFCShippeds = details;
                break;
            case StageType.RDCReceived:
                this.RDCReceiveds = details;
                break;
            case StageType.Invoiced:
                this.Invoices = details;
                break;
            default:
                console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
                break;
        }
    }
    getStageDiscrepancies(stageType) {
        switch (stageType) {
            case StageType.PurchaseOrdered:
                return this.PurchaseOrderDiscrepancies;
            case StageType.VendorShipped:
                return this.VendorShippedDiscrepancies;
            case StageType.IFCReceived:
                return this.IFCReceivedDiscrepancies;
            case StageType.IFCStaged:
                return this.IFCStagedDiscrepancies;
            case StageType.IFCShipped:
                return this.IFCShippedDiscrepancies;
            case StageType.RDCReceived:
                return this.RDCReceivedDiscrepancies;
            case StageType.Invoiced:
                return this.InvoiceDiscrepancies;
            default:
                console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
                return undefined;
        }
    }
    setStageDiscrepancies(stageType, discrepancies) {
        switch (stageType) {
            case StageType.PurchaseOrdered:
                this.PurchaseOrderDiscrepancies = discrepancies;
                break;
            case StageType.VendorShipped:
                this.VendorShippedDiscrepancies = discrepancies;
                break;
            case StageType.IFCReceived:
                this.IFCReceivedDiscrepancies = discrepancies;
                break;
            case StageType.IFCStaged:
                this.IFCStagedDiscrepancies = discrepancies;
                break;
            case StageType.IFCShipped:
                this.IFCShippedDiscrepancies = discrepancies;
                break;
            case StageType.RDCReceived:
                this.RDCReceivedDiscrepancies = discrepancies;
                break;
            case StageType.Invoiced:
                this.InvoiceDiscrepancies = discrepancies;
                break;
            default:
                console.log('ERROR: Unrecognized StageType - ' + stageType.toString());
                break;
        }
    }
    addStageDiscrepancy(stageType, discrepancy) {
        const currentDiscrepancies = this.getStageDiscrepancies(stageType);
        if (currentDiscrepancies === undefined || currentDiscrepancies.length === 0) {
            this.setStageDiscrepancies(stageType, [discrepancy]);
        }
        else {
            currentDiscrepancies.push(discrepancy);
            this.setStageDiscrepancies(stageType, currentDiscrepancies);
        }
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AssetProcurement.prototype, "PONumber", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AssetProcurement.prototype, "RecommendedSolution", void 0);
__decorate([
    fabric_contract_api_1.Property('PurchaseOrders', 'PurchaseOrder[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "PurchaseOrders", void 0);
__decorate([
    fabric_contract_api_1.Property('PurchaseOrderDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "PurchaseOrderDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('VendorShippeds', 'VendorShipped[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "VendorShippeds", void 0);
__decorate([
    fabric_contract_api_1.Property('VendorShippedDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "VendorShippedDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCReceiveds', 'IFCReceived[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCReceiveds", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCReceivedDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCReceivedDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCStageds', 'IFCStaged[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCStageds", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCStagedDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCStagedDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCShippeds', 'IFCShipped[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCShippeds", void 0);
__decorate([
    fabric_contract_api_1.Property('IFCShippedDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "IFCShippedDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('RDCReceiveds', 'RDCReceived[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "RDCReceiveds", void 0);
__decorate([
    fabric_contract_api_1.Property('RDCReceivedDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "RDCReceivedDiscrepancies", void 0);
__decorate([
    fabric_contract_api_1.Property('Invoices', 'Invoice[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "Invoices", void 0);
__decorate([
    fabric_contract_api_1.Property('InvoiceDiscrepancies', 'Discrepancy[]'),
    __metadata("design:type", Array)
], AssetProcurement.prototype, "InvoiceDiscrepancies", void 0);
AssetProcurement = __decorate([
    fabric_contract_api_1.Object(),
    __metadata("design:paramtypes", [Object])
], AssetProcurement);
exports.AssetProcurement = AssetProcurement;
//# sourceMappingURL=asset-procurement.model.js.map