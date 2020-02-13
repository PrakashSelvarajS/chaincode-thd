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
let UnitOfMeasureContract = class UnitOfMeasureContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.UnitOfMeasureContract"); }
    // Used to merge new UOM data with existing UOM data
    async saveUnitOfMeasure(ctx, newUOMs) {
        let repo = new repositories_1.UnitOfMeasureListRepository(ctx);
        // Get the list of existing UOM items
        let existingUOMList = await repo.get();
        let savedUOMs = [];
        // If there are no existing UOM items, then store the new UOM list
        if (existingUOMList === undefined || existingUOMList.Items === undefined || existingUOMList.Items.length === 0) {
            console.log('No UOM data, adding all the provided UOM data to the ledger');
            let newUOMList = new models_1.UnitOfMeasureList({ Items: newUOMs });
            newUOMList = await repo.create(newUOMList);
            savedUOMs = newUOMList.Items;
        }
        else {
            // Update all the existing UOM with the new UOM, using SKU as a unique identifier
            for (let currentNewUOM of newUOMs) {
                const existingItemIndex = existingUOMList.Items.findIndex((vv, ii, ll) => { return currentNewUOM.SKU == vv.SKU; });
                if (existingItemIndex > -1) {
                    // Overwrite the existing item values with the new values            
                    currentNewUOM.RecordID = existingUOMList.Items[existingItemIndex].RecordID;
                    existingUOMList.Items[existingItemIndex] = currentNewUOM;
                    savedUOMs.push(currentNewUOM);
                }
            }
            // Get a list of records that are in the new list, but not in the existing list
            let newUOMNotInExistingList = newUOMs.filter((v, i, l) => { return (existingUOMList.Items.findIndex((vv, ii, ll) => { return v.SKU == vv.SKU; }) == -1); });
            if (newUOMNotInExistingList.length > 0) {
                existingUOMList.Items.push(...newUOMNotInExistingList);
                savedUOMs.push(...newUOMNotInExistingList);
            }
            existingUOMList = await repo.update(existingUOMList);
        }
        return savedUOMs;
    }
    // Delete an existing UOM record by its SKU
    async deleteUnitOfMeasure(ctx, sku) {
        throw new Error('ERROR: deleteUnitOfMeasure has not been implemented');
    }
    async retrieveUnitOfMeasure(ctx) {
        let repo = new repositories_1.UnitOfMeasureListRepository(ctx);
        const existingUOMList = await repo.get();
        if (existingUOMList === undefined || existingUOMList.Items === undefined && existingUOMList.Items.length == 0) {
            return [];
        }
        else {
            return existingUOMList.Items;
        }
    }
};
__decorate([
    fabric_contract_api_1.Transaction(true),
    fabric_contract_api_1.Param("newUOMs", "UnitOfMeasure[]"),
    fabric_contract_api_1.Returns('UnitOfMeasure[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array]),
    __metadata("design:returntype", Promise)
], UnitOfMeasureContract.prototype, "saveUnitOfMeasure", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('UnitOfMeasure[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], UnitOfMeasureContract.prototype, "retrieveUnitOfMeasure", null);
UnitOfMeasureContract = __decorate([
    fabric_contract_api_1.Info({ title: 'UnitOfMeasureContract', description: 'Contract for managing the "Unit-of-Measure" data for a Vendor' }),
    __metadata("design:paramtypes", [])
], UnitOfMeasureContract);
exports.UnitOfMeasureContract = UnitOfMeasureContract;
//# sourceMappingURL=unit-of-measure.contract.js.map