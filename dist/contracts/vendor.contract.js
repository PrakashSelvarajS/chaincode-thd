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
let VendorContract = class VendorContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.VendorContract"); }
    // Used to merge new Vendor data with existing Vendor data
    async saveVendor(ctx, newVendors) {
        // Clean up the Vendor names to remove double quotes and trailing/leading spaces
        newVendors = newVendors.map((v, i, l) => {
            v.Name = v.Name.replace(/["]+/g, '').trim();
            return v;
        });
        const repo = new repositories_1.VendorListRepository(ctx);
        // Get the list of existing Vendor items
        const existingVendorList = await repo.get();
        let savedVendors = [];
        // If there are no existing Vendor items, then store the new Vendor list
        if (existingVendorList === undefined || existingVendorList.Items === undefined || existingVendorList.Items.length === 0) {
            console.log('No Vendor data, adding all the provided Vendor data to the ledger');
            let newVendorList = new models_1.VendorList({ Items: newVendors });
            await repo.create(newVendorList);
            savedVendors = newVendorList.Items;
        }
        else {
            // Merge the existing Vendor with the new Vendor, using SKU as a unique identifier
            for (let currentNewVendor of newVendors) {
                const existingItemIndex = existingVendorList.Items.findIndex((vv, ii, ll) => { return currentNewVendor.VendorID == vv.VendorID; });
                if (existingItemIndex > -1) {
                    // Overwrite the existing item values with the new values                    
                    currentNewVendor.RecordID = existingVendorList.Items[existingItemIndex].RecordID;
                    existingVendorList.Items[existingItemIndex] = currentNewVendor;
                    savedVendors.push(currentNewVendor);
                }
            }
            // Get a list of records that are in the new list, but not in the existing list
            let newVendorNotInExistingList = newVendors.filter((v, i, l) => { return (existingVendorList.Items.findIndex((vv, ii, ll) => { return v.VendorID == vv.VendorID; }) == -1); });
            if (newVendorNotInExistingList.length > 0) {
                existingVendorList.Items.push(...newVendorNotInExistingList);
                savedVendors.push(...newVendorNotInExistingList);
            }
            // HACK : This is a temporary fix to remove double-quotes from all Vendor names....this should be removed after all entries have been fixed in the blockchain
            existingVendorList.Items = existingVendorList.Items.map((v, i, l) => {
                v.Name = v.Name.replace(/["]+/g, '').trim();
                return v;
            });
            await repo.update(existingVendorList);
        }
        return savedVendors;
    }
    // Delete an existing Vendor record by its SKU
    async deleteVendor(ctx, sku) {
        throw new Error('ERROR: deleteVendor has not been implemented');
    }
    async retrieveVendor(ctx) {
        let repo = new repositories_1.VendorListRepository(ctx);
        const vendorList = await repo.get();
        if (vendorList === undefined || vendorList.Items === undefined || vendorList.Items.length == 0) {
            throw new Error(`ERROR: No Vendors exist in the blockchain for this Vendor`);
        }
        else {
            return vendorList.Items;
        }
    }
};
__decorate([
    fabric_contract_api_1.Transaction(true),
    fabric_contract_api_1.Param("newVendors", "Vendor[]"),
    fabric_contract_api_1.Returns('Vendor[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array]),
    __metadata("design:returntype", Promise)
], VendorContract.prototype, "saveVendor", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Vendor[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], VendorContract.prototype, "retrieveVendor", null);
VendorContract = __decorate([
    fabric_contract_api_1.Info({ title: 'VendorContract', description: 'Contract for managing the list of "Vendor" (and sub-vendor) identification data for a Vendor' }),
    __metadata("design:paramtypes", [])
], VendorContract);
exports.VendorContract = VendorContract;
//# sourceMappingURL=vendor.contract.js.map