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
const logger = Logger.getLogger('./contracts/purchase-order.contract.ts');
let PurchaseOrderContract = class PurchaseOrderContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.PurchaseOrderContract"); }
    // Used to bulk merge several PurchaseOrders of new PurchaseOrder data with existing PurchaseOrder data
    async bulkSavePurchaseOrders(ctx, newListOfPurchaseOrderLists) {
        try {
            // Sanity-checks: polist.length > 0
            if (newListOfPurchaseOrderLists.length === 0) {
                throw new Error(`bulkSavePurchaseOrders was called with 0 PurchaseOrders`);
            }
            // Add each set of PO items to the blockchain, one PONumber at a time
            let aps = [];
            for (let poList of newListOfPurchaseOrderLists) {
                let currentSaveAP = await this.savePurchaseOrder(ctx, poList.PONumber, poList.Items);
                aps.push(currentSaveAP);
            }
            return aps;
        }
        catch (e) {
            logger.error(`bulkSavePurchaseOrders failed`);
            logger.error(e);
            return;
        }
    }
    // Used to merge new PurchaseOrder data with existing PurchaseOrder data
    async savePurchaseOrder(ctx, poNumber, newPurchaseOrderList) {
        try {
            // Sanity-checks: polist.length > 0, all items in polist have PONumber=poNumber
            poNumber = poNumber.trim();
            if (newPurchaseOrderList.length === 0) {
                throw new Error(`savePurchaseOrder was called with 0 PurchaseOrder items, for PONumber '${poNumber}'`);
            }
            if (newPurchaseOrderList.some((v, i, l) => { return (v.PONumber != poNumber); })) {
                throw new Error(`savePurchaseOrder was called with some PurchaseOrder items that do not have PONUmber '${poNumber}`);
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
                logger.debug(ap.PurchaseOrders.length);
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
            // Merge the existing PurchaseOrder data with the new data
            logger.debug('We ' + ((ap.PurchaseOrders !== undefined && ap.PurchaseOrders.length > 0) ? 'have' : 'do not have') + ' PO data for the AP');
            if (ap.PurchaseOrders !== undefined && ap.PurchaseOrders.length > 0) {
                // Merge any records that match on key identifier fields
                logger.debug(`Starting with ${newPurchaseOrderList.length} new PurchaseOrders`);
                newPurchaseOrderList.forEach((vc, ic, lc) => {
                    let existingRecordIndex = ap.PurchaseOrders.findIndex((innerVC, innerIC, innerLC) => {
                        return vc.IFCDC == innerVC.IFCDC && vc.RDC == innerVC.RDC && vc.SKU == innerVC.SKU && vc.SKUGTIN == innerVC.SKUGTIN && vc.Quantity == innerVC.Quantity && vc.CreatedDateTime == innerVC.CreatedDateTime;
                    });
                    if (existingRecordIndex > -1) {
                        logger.debug('Found a new PO that matched an existing one');
                        ap.PurchaseOrders[existingRecordIndex] = vc;
                    }
                });
                // Deterimine all records that are new and do not match any existing records
                let uniquePOs = newPurchaseOrderList.reduce((pac, vc, ic, lc) => {
                    let existingRecordIndex = ap.PurchaseOrders.findIndex((innerVC, innerIC, innerLC) => {
                        return vc.IFCDC == innerVC.IFCDC && vc.RDC == innerVC.RDC && vc.SKU == innerVC.SKU && vc.SKUGTIN == innerVC.SKUGTIN && vc.Quantity == innerVC.Quantity && vc.CreatedDateTime == innerVC.CreatedDateTime;
                    });
                    if (existingRecordIndex == -1) {
                        logger.debug('Found a new PO that does not match the existing ones');
                        pac.push(vc);
                    }
                    return pac;
                }, []);
                logger.debug(`Ended up with ${uniquePOs.length} totally new PurchaseOrders`);
                // If we found some new records to add, Append new records to the existing ones
                if (uniquePOs.length > 0) {
                    logger.debug('Adding the final list of unique POs to the existing list of POs');
                    ap.PurchaseOrders.push(...uniquePOs);
                }
            }
            else {
                logger.debug('Adding all new POs since there are no existing POs.');
                ap.setStageDetails(models_1.StageType.PurchaseOrdered, newPurchaseOrderList);
            }
            // Make sure that all PO items are heading to the same IFCDC / RDC
            let destinations = ap.PurchaseOrders.reduce((p, v, i, l) => {
                if (p.findIndex((vv, ii, ll) => { return vv.ifcdc == v.IFCDC && vv.rdc == v.RDC; }) == -1) {
                    p.push({ ifcdc: v.IFCDC, rdc: v.RDC });
                }
                return p;
            }, []);
            if (destinations.length > 1) {
                let errorMessage = `savePurchaseOrder was called for PONUmber '${poNumber} with some PurchaseOrder items that are being shipped to multiple destinations`;
                destinations.forEach((v, i, l) => {
                    errorMessage += `\nIFCDC : ${v.ifcdc}, RDC : ${v.rdc}`;
                });
                throw new Error(errorMessage);
            }
            // Make sure the provided PO data descriptions match their UOM descriptions
            logger.debug('Updating POs to use their UOM descriptions');
            ap.PurchaseOrders.forEach((v, i, l) => {
                let uomItemIndex = uomList.Items.findIndex((vu, iu, lu) => { return (vu.SKU == v.SKU); });
                if (uomItemIndex > -1 && v.Description != uomList.Items[uomItemIndex].Description) {
                    v.Description = uomList.Items[uomItemIndex].Description;
                }
            });
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
            logger.debug(`savePurchaseOrder saved ${newPurchaseOrderList.length} PurchaseOrder items for PONumber ${poNumber}`);
            return updatedAP;
        }
        catch (e) {
            logger.error(`savePurchaseOrder failed for PONumber ${poNumber}`);
            logger.error(e);
            return;
        }
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Param("newListOfPurchaseOrderLists", "PurchaseOrderList[]"),
    fabric_contract_api_1.Returns('AssetProcurement[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array]),
    __metadata("design:returntype", Promise)
], PurchaseOrderContract.prototype, "bulkSavePurchaseOrders", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Param("poNumber", "string"),
    fabric_contract_api_1.Param("newPurchaseOrderList", "PurchaseOrder[]"),
    fabric_contract_api_1.Returns('AssetProcurement'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Array]),
    __metadata("design:returntype", Promise)
], PurchaseOrderContract.prototype, "savePurchaseOrder", null);
PurchaseOrderContract = __decorate([
    fabric_contract_api_1.Info({ title: 'PurchaseOrderContract', description: 'Contract for managing the list of PurchaseOrders, and their related discrepancies' }),
    __metadata("design:paramtypes", [])
], PurchaseOrderContract);
exports.PurchaseOrderContract = PurchaseOrderContract;
//# sourceMappingURL=purchase-order.contract.js.map