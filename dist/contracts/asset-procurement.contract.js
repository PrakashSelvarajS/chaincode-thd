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
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const processing_engine_1 = require("../processing-engine");
let AssetProcurementContract = class AssetProcurementContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.AssetProcurementContract"); }
    async retrieveAssetProcurement(ctx, poNumber) {
        let repo = new repositories_1.AssetProcurementRepository(ctx);
        const ap = await repo.get(poNumber);
        if (!ap) {
            throw new Error(`ERROR: An AssetProcurement record with PONumber ${poNumber} does not exist`);
        }
        else {
            return ap;
        }
    }
    async reprocessAssetProcurement(ctx, poNumber) {
        let repo = new repositories_1.AssetProcurementRepository(ctx);
        const ap = await repo.get(poNumber);
        if (!ap) {
            throw new Error(`ERROR: An AssetProcurement record with PONumber ${poNumber} does not exist`);
        }
        // Get the list of UnitOfMeasure data
        let uomList = await (new repositories_1.UnitOfMeasureListRepository(ctx)).get();
        if (uomList === undefined) {
            uomList = new models_1.UnitOfMeasureList({ Items: [] });
        }
        // Retrieve the current ADR Rule data
        let adrRuleList = await (new repositories_1.ADRRuleListRepository(ctx)).get();
        if (adrRuleList === undefined) {
            adrRuleList = new models_1.ADRRuleList({ Items: [] });
        }
        // Create a processing engine and process the Procurement record
        let updatedAP = processing_engine_1.ProcessingEngine.startProcessing(ap, { uomList, adrRuleList });
        // Save the updated Procurement record
        repo.update(updatedAP);
        return updatedAP;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Param("poNumber", "string"),
    fabric_contract_api_1.Returns('AssetProcurement'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AssetProcurementContract.prototype, "retrieveAssetProcurement", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    fabric_contract_api_1.Param("poNumber", "string"),
    fabric_contract_api_1.Returns('AssetProcurement'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AssetProcurementContract.prototype, "reprocessAssetProcurement", null);
AssetProcurementContract = __decorate([
    fabric_contract_api_1.Info({ title: 'AssetProcurementContract', description: 'Contract for managing the "Asset Procurement" data for a Vendor' }),
    __metadata("design:paramtypes", [])
], AssetProcurementContract);
exports.AssetProcurementContract = AssetProcurementContract;
//# sourceMappingURL=asset-procurement.contract.js.map