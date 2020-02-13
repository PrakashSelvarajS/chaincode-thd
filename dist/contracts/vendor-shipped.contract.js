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
const Logger = require('../logger');
const logger = Logger.getLogger('./contracts/vendor-shipped.contract.ts');
let VendorShippedContract = class VendorShippedContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.VendorShippedContract"); }
    // Used to bulk merge several records of new VendorShipped data with existing VendorShipped data
    async bulkSaveVendorShipped(ctx, newListOfVendorShippedLists) {
        try {
            // Sanity-checks: list.length > 0
            if (newListOfVendorShippedLists.length === 0) {
                throw new Error(`bulkSaveVendorShipped was called with 0 VendorShippeds`);
            }
            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps = [];
            for (let currentItemsList of newListOfVendorShippedLists) {
                let currentSavedAP = await this.saveVendorShipped(ctx, currentItemsList.PONumber, currentItemsList.Items);
                aps.push(currentSavedAP);
            }
            return aps;
        }
        catch (e) {
            logger.error(`bulkSaveVendorShipped failed`);
            logger.error(e);
            return;
        }
    }
    // Used to merge new VendorShipped data with existing VendorShipped data
    async saveVendorShipped(ctx, poNumber, newVendorShippedList) {
        try {
            // Sanity-checks: vslist.length > 0, all items in vslist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newVendorShippedList.length === 0) {
                throw new Error(`saveVendorShipped was called with 0 VendorShipped items, for PONumber '${poNumber}'`);
            }
            if (newVendorShippedList.some((v, i, l) => { return (v.PONumber != poNumber); })) {
                throw new Error(`saveVendorShipped was called with some VendorShipped items that do not have PONUmber '${poNumber}`);
            }
            let apRepo = new repositories_1.AssetProcurementRepository(ctx);
            // Retrieve or create the AssetProcurement record
            let ap = new models_1.AssetProcurement({ PONumber: poNumber });
            let apIsNew = true;
            if (await apRepo.exists(poNumber) == true) {
                logger.debug(`PONumber ${poNumber} exists`);
                ap = await apRepo.get(poNumber);
                apIsNew = false;
                logger.debug('Retreived AP from storage');
            }
            // Get the list of UnitOfMeasure data
            logger.debug('Retrieving UOM data from storage');
            let uomList = await (new repositories_1.UnitOfMeasureListRepository(ctx)).get();
            if (uomList === undefined) {
                uomList = new models_1.UnitOfMeasureList({ Items: [] });
            }
            logger.debug(uomList.Items.length);
            // Retrieve the current ADR Rule data
            logger.debug('Retrieving ADR Rules from storage');
            let adrRuleList = await (new repositories_1.ADRRuleListRepository(ctx)).get();
            if (adrRuleList === undefined) {
                adrRuleList = new models_1.ADRRuleList({ Items: [] });
            }
            logger.debug(adrRuleList.Items.length);
            // Merge the existing VendorShipped data with the new data
            logger.debug('We ' + ((ap.VendorShippeds !== undefined && ap.VendorShippeds.length > 0) ? 'have' : 'do not have') + ' VS data for the AP');
            if (ap.VendorShippeds !== undefined && ap.VendorShippeds.length > 0) {
                // HACK : We need to repair any existing UCC128's that are missing the SSCC application identifier ('00' prefix).....this should be removed after all entries in the blockchain are repaired
                ap.VendorShippeds = ap.VendorShippeds.map((v, i, l) => {
                    if (v.UCC128.length == 18) {
                        v.UCC128 = '00' + v.UCC128;
                    }
                    return v;
                });
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newVendorShippedList.length} new VendorShippeds`);
                newVendorShippedList.forEach((vc, ic, lc) => {
                    let existingRecordIndex = ap.VendorShippeds.findIndex((innerVC, innerIC, innerLC) => {
                        return vc.RDC == innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber == innerVC.PONumber && vc.ASNNumber == innerVC.ASNNumber && vc.ASNShipmentID == innerVC.ASNShipmentID;
                    });
                    if (existingRecordIndex > -1) {
                        logger.debug('Found a new VS that matched an existing one');
                        ap.VendorShippeds[existingRecordIndex] = vc;
                    }
                });
                // Deterimine all records that are new and do not match any existing records
                let uniqueVSs = newVendorShippedList.reduce((pac, vc, ic, lc) => {
                    let existingRecordIndex = ap.VendorShippeds.findIndex((innerVC, innerIC, innerLC) => {
                        return vc.RDC == innerVC.RDC && vc.SKU == innerVC.SKU && vc.UCC128 == innerVC.UCC128 && vc.PONumber == innerVC.PONumber && vc.ASNNumber == innerVC.ASNNumber && vc.ASNShipmentID == innerVC.ASNShipmentID;
                    });
                    if (existingRecordIndex == -1) {
                        logger.debug('Found a new VS that does not match the existing ones');
                        pac.push(vc);
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniqueVSs.length} totally new VendorShippeds`);
                // If we found some new records to add, Append new records to the existing ones
                if (uniqueVSs.length > 0) {
                    logger.debug('Adding the final list of unique VSs to the existing list of VSs');
                    ap.VendorShippeds.push(...uniqueVSs);
                }
            }
            else {
                logger.debug('Adding all new VSs since there are no existing VSs.');
                ap.setStageDetails(models_1.StageType.VendorShipped, newVendorShippedList);
            }
            // Run this through the processing engine (FSM)
            logger.debug('Starting the processing engine');
            let updatedAP = processing_engine_1.ProcessingEngine.startProcessing(ap, { uomList, adrRuleList });
            logger.debug('Finished the processing engine');
            // Save the AssetProcurement record
            if (apIsNew) {
                logger.debug('Attempting to create a new AP');
                await apRepo.create(updatedAP);
            }
            else {
                logger.debug('Attempting to update an existing AP');
                await apRepo.update(updatedAP);
            }
            logger.debug(`saveVendorShipped saved ${newVendorShippedList.length} VendorShipped items for PONumber ${poNumber}`);
            return updatedAP;
        }
        catch (e) {
            logger.error(`saveVendorShipped failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Param("newListOfVendorShippedLists", "VendorShippedList[]"),
    fabric_contract_api_1.Returns('AssetProcurement[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array]),
    __metadata("design:returntype", Promise)
], VendorShippedContract.prototype, "bulkSaveVendorShipped", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Param("poNumber", "string"),
    fabric_contract_api_1.Param("newVendorShippedList", "VendorShipped[]"),
    fabric_contract_api_1.Returns('AssetProcurement'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Array]),
    __metadata("design:returntype", Promise)
], VendorShippedContract.prototype, "saveVendorShipped", null);
VendorShippedContract = __decorate([
    fabric_contract_api_1.Info({ title: 'VendorShippedContract', description: 'Contract for managing the list of VendorShippeds, and their related discrepancies' }),
    __metadata("design:paramtypes", [])
], VendorShippedContract);
exports.VendorShippedContract = VendorShippedContract;
//# sourceMappingURL=vendor-shipped.contract.js.map