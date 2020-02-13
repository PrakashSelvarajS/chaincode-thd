"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("ts-javascript-state-machine");
const models_1 = require("./models");
class ProcessingEngine {
    constructor() {
        this.states = {};
        this.facts = new Map();
        // Define all the states for the FSM
        this.states['Unstarted'] = 'unstarted';
        this.states[models_1.StageType.PurchaseOrdered] = 'purchaseOrdered';
        this.states[models_1.StageType.VendorShipped] = 'vendorShipped';
        this.states[models_1.StageType.IFCReceived] = 'ifcReceived';
        this.states[models_1.StageType.IFCStaged] = 'ifcStaged';
        this.states[models_1.StageType.IFCShipped] = 'ifcShipped';
        this.states[models_1.StageType.RDCReceived] = 'rdcReceived';
        this.states[models_1.StageType.Invoiced] = 'invoiced';
        // Create the FSM using the predefined states
        this.fsm = new StateMachine({
            init: 'unstarted',
            transitions: [
                { name: 'itemsDemanded', from: this.states['Unstarted'], to: this.states[models_1.StageType.PurchaseOrdered] },
                { name: 'vendorTruckLoaded', from: this.states[models_1.StageType.PurchaseOrdered], to: this.states[models_1.StageType.VendorShipped] },
                { name: 'ifcTruckUnloaded', from: this.states[models_1.StageType.VendorShipped], to: this.states[models_1.StageType.IFCReceived] },
                { name: 'homeFreightTruckUnloaded', from: this.states[models_1.StageType.VendorShipped], to: this.states[models_1.StageType.RDCReceived] },
                { name: 'itemsSorted', from: this.states[models_1.StageType.IFCReceived], to: this.states[models_1.StageType.IFCStaged] },
                { name: 'ifcTruckLoaded', from: this.states[models_1.StageType.IFCStaged], to: this.states[models_1.StageType.IFCShipped] },
                { name: 'rdcTruckUnloaded', from: this.states[models_1.StageType.IFCShipped], to: this.states[models_1.StageType.RDCReceived] },
                { name: 'invoiceReceived', from: this.states[models_1.StageType.RDCReceived], to: this.states[models_1.StageType.Invoiced] }
            ],
            methods: {
                onBeforeItemsDemanded: this.beforeItemsDemanded.bind(this),
                onPurchaseOrdered: this.purchaseOrdered.bind(this),
                onBeforeVendorTruckLoaded: this.beforeVendorTruckLoaded.bind(this),
                onVendorShipped: this.vendorShipped.bind(this),
                onBeforeIfcTruckUnloaded: this.beforeIFCTruckUnloaded.bind(this),
                onBeforeHomeFreightTruckUnloaded: this.beforeHomeFreightTruckUnloaded.bind(this),
                onIfcReceived: this.ifcReceived.bind(this),
                onBeforeItemsSorted: this.beforeItemsSorted.bind(this),
                onIfcStaged: this.ifcStaged.bind(this),
                onBeforeIfcTruckLoaded: this.beforeIFCTruckLoaded.bind(this),
                onIfcShipped: this.ifcShipped.bind(this),
                onBeforeRdcTruckUnloaded: this.beforeRDCTruckUnloaded.bind(this),
                onRdcReceived: this.rdcReceived.bind(this),
                onBeforeInvoiceReceived: this.onBeforeInvoiceReceived.bind(this),
                onInvoiced: this.invoiced.bind(this)
            }
        });
    }
    static startProcessing(assetProcurement, config) {
        let engine = new ProcessingEngine();
        return engine.startProcessing(assetProcurement, config);
    }
    startProcessing(assetProcurement, config) {
        this.ap = assetProcurement;
        if (config.uomList === undefined) {
            return this.finishProcessing(this.ap, config);
        }
        this.uomList = config.uomList;
        // Transition to the PurchaseOrdered stage
        this.fsm.itemsDemanded();
        if (this.fsm.state != this.states[models_1.StageType.PurchaseOrdered]) {
            return this.finishProcessing(this.ap, config);
        }
        // Transition to the VendorShipped stage
        this.fsm.vendorTruckLoaded();
        if (this.fsm.state != this.states[models_1.StageType.VendorShipped]) {
            return this.finishProcessing(this.ap, config);
        }
        // Check if this is HomeFreight
        if (this.ap.isHomeFreight()) {
            // Transition to the RDCReceived stage
            this.fsm.homeFreightTruckUnloaded();
            if (this.fsm.state != this.states[models_1.StageType.RDCReceived]) {
                return this.finishProcessing(this.ap, config);
            }
        }
        else {
            // Transition to the IFCReceived stage
            this.fsm.ifcTruckUnloaded();
            if (this.fsm.state != this.states[models_1.StageType.IFCReceived]) {
                return this.finishProcessing(this.ap, config);
            }
            // Transition to the IFCStaged stage
            this.fsm.itemsSorted();
            if (this.fsm.state != this.states[models_1.StageType.IFCStaged]) {
                return this.finishProcessing(this.ap, config);
            }
            // Transition to the IFCShipped stage
            this.fsm.ifcTruckLoaded();
            if (this.fsm.state != this.states[models_1.StageType.IFCShipped]) {
                return this.finishProcessing(this.ap, config);
            }
            // Transition to the RDCReceived stage
            this.fsm.rdcTruckUnloaded();
            if (this.fsm.state != this.states[models_1.StageType.RDCReceived]) {
                return this.finishProcessing(this.ap, config);
            }
        }
        // Transition to the Invoiced stage
        this.fsm.invoiceReceived();
        if (this.fsm.state != this.states[models_1.StageType.Invoiced]) {
            return this.finishProcessing(this.ap, config);
        }
        return this.ap;
    }
    finishProcessing(assetProcurement, config) {
        //Initially setting recommented solution to 'Further Analysis Required', before running through the ADR rules 
        //This additionally helps to not break the existing unit tests
        assetProcurement.RecommendedSolution = 'Further Analysis Required';
        // Sanity check to make sure we have the ADR Rule configurations
        if (config.adrRuleList === undefined) {
            console.log('ADR Rules do not exist');
        }
        else {
            let operators = {
                '!=': function (a, b) { return a != b; },
                '==': function (a, b) { return a == b; },
                '<': function (a, b) { return a < b; },
                '>': function (a, b) { return a > b; },
                '>=': function (a, b) { return a >= b; },
                '<=': function (a, b) { return a <= b; }
            };
            // Process each of the ADR rules
            for (let adrrule of config.adrRuleList.Items) {
                //Loop through all the conditions of an ADR rule to check if any fails
                const indexOfFailingADRRuleCondition = adrrule.Conditions.findIndex((v, i, l) => {
                    if (this.facts[v.FactType] != null) {
                        //Determine the %quantity received, i.e - (facts.observed/facts.expected)*100 
                        let receivedPercentage = (this.facts[v.FactType].observed / this.facts[v.FactType].expected) * 100;
                        //console.log(`>>>>>> ADR RULE - receivedPercentage ${receivedPercentage}`);
                        //Returns true if any one of the range checks fail 
                        //i.e ( minimumvalue minimumcomparisontype receivedpercentage maximumcomparisontype maximumvalue )
                        //e.g ( 0 < 90 <= 100 )
                        return !(operators[v.MinimumComparisonType](v.MinimumValue, receivedPercentage) &&
                            operators[v.MaximumComparisonType](receivedPercentage, v.MaximumValue));
                    }
                    else {
                        return true; //FactType doesn't exist
                    }
                });
                if (indexOfFailingADRRuleCondition == -1) {
                    console.log("adrrule.RuleID", adrrule.RuleID);
                    assetProcurement.RecommendedSolution = adrrule.Solution;
                    break;
                }
            }
        }
        // Advanced ADR Rule to check Pack Size tactics - if shortage / overage qty is divisible by pack size
        // Only shortages/overages at RDC are affected by this rule
        if (this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched]) {
            //Retrieve the list of discrepancies with a shortage
            let shortageList = assetProcurement.RDCReceivedDiscrepancies.filter((v, i, l) => { return v.DiscrepancyType == models_1.DiscrepancyType.Shortage; });
            //Process the list of shortage to check for any pack size discrepancy
            if (shortageList.length > 0) {
                this.checkPackSizeDiscrepancy(assetProcurement, shortageList, config);
            }
            let overageList = assetProcurement.RDCReceivedDiscrepancies.filter((v, i, l) => { return v.DiscrepancyType == models_1.DiscrepancyType.Overage; });
            //Process the list of overage to check for any pack size discrepancy
            if (overageList.length > 0) {
                this.checkPackSizeDiscrepancy(assetProcurement, overageList, config);
            }
        }
        this.logADROutput(assetProcurement);
        return assetProcurement;
    }
    //Determine if there is a Pack Size Discrepancy
    checkPackSizeDiscrepancy(assetProcurement, discrepancyList, config) {
        discrepancyList.forEach((v, i, l) => {
            //console.log ("discrepancyList.length", discrepancyList.length);
            //console.log("discrepancyList[0].ItemID", discrepancyList[0].ItemID);
            //Determine the SKU that from the RDCReceivedDiscrepancy
            let skuID = assetProcurement.RDCReceivedDiscrepancies[i].ItemID;
            //console.log("SKU", skuID);
            //Determine the Item Standard (either: each/pack/pallet) in which the SKU Item is counted from the UOM list
            let skuitemIndex = config.uomList.Items.findIndex((v, i, l) => { return v.SKU == skuID; });
            if (skuitemIndex != -1) {
                let itemStandard = config.uomList.Items[skuitemIndex].OrderStandard;
                //console.log("Item Standard", itemStandard);
                if (itemStandard != null) {
                    //Determine the count of the itemStandard
                    let standardCount = 0;
                    switch (itemStandard) {
                        case models_1.PackageType.Each:
                            standardCount = config.uomList.Items[skuitemIndex].EachCount;
                            break;
                        case models_1.PackageType.Pack:
                            standardCount = config.uomList.Items[skuitemIndex].PackCount;
                            break;
                        case models_1.PackageType.Pallet:
                            standardCount = config.uomList.Items[skuitemIndex].PalletCount;
                            break;
                        case models_1.PackageType.Case:
                            standardCount = config.uomList.Items[skuitemIndex].CaseCount;
                            break;
                        case models_1.PackageType.Other:
                            standardCount = config.uomList.Items[skuitemIndex].OtherCount;
                        default:
                            console.log('WARNING: Unrecognized itemStandard - ' + itemStandard);
                            break;
                    }
                    //Standard count cannot be 0 or less than 0
                    if (standardCount > 0) {
                        //console.log("Standard Count", standardCount);
                        //Determine if there is a pack size discrepancy   :   Abs(RDC In Qty - Sup ASN Qty) % package_qty   :    is the receive count a multiple of the standard package size   
                        let itemCountDoesNotMatchPackageSize = ((Math.abs(this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched].observed - this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched].expected) % standardCount) != 0);
                        if (itemCountDoesNotMatchPackageSize) {
                            //console.log("remainder is not zero, there is a pack size discrepancy", itemCountDoesNotMatchPackageSize);
                            assetProcurement.RecommendedSolution = "Pack size discrepancy";
                        }
                        else {
                            //console.log("remainder is zero, No pack size discrepancy", itemCountDoesNotMatchPackageSize)
                        }
                    }
                    else {
                        console.log("WARNING: Pack Size is 0, so it is either missing or incorrect for SKU", skuID);
                    }
                }
                else {
                    console.log("WARNING: Standard Pack Order Size is missing for SKU", skuID);
                }
            }
        });
    }
    logADROutput(assetProcurement) {
        let output = '';
        let factTypes = Object.keys(models_1.ADRFactType);
        // Loop through each ADRFactType and compute its value
        for (let factType of factTypes) {
            if (this.facts[factType] !== undefined && this.facts[factType] !== null) {
                let percent = (this.facts[factType].observed / this.facts[factType].expected) * 100;
                output += ((output.length > 0) ? ', ' : '') + factType + '=' + percent;
            }
        }
        console.log('>>> ADR Factors  : ' + output);
        console.log('>>> ADR Solution : ' + assetProcurement.RecommendedSolution);
    }
    beforeItemsDemanded() {
        let hasPOData = this.ensureStageHasData(models_1.StageType.PurchaseOrdered);
        let hasSubsequentData = (this.ensureStageHasData(models_1.StageType.VendorShipped) ||
            this.ensureStageHasData(models_1.StageType.IFCReceived) ||
            this.ensureStageHasData(models_1.StageType.IFCStaged) ||
            this.ensureStageHasData(models_1.StageType.IFCShipped) ||
            this.ensureStageHasData(models_1.StageType.RDCReceived) ||
            this.ensureStageHasData(models_1.StageType.Invoiced));
        // Add a MissingPO discrepancy if we do not have PO data but we do have some subsequent data
        if (!hasPOData) {
            if (hasSubsequentData) {
                this.createDiscrepancy(models_1.DiscrepancyType.MissingPO, models_1.StageType.PurchaseOrdered, this.ap.PONumber, "", this.ap.PONumber, 1, 0);
            }
            // Create the PurchaseOrderQuantityMatched fact
            this.facts[models_1.ADRFactType.PurchaseOrderQuantityMatched] = { expected: 1, observed: 0 };
        }
        return hasPOData;
    }
    beforeVendorTruckLoaded() {
        let hasVSData = this.ensureStageHasData(models_1.StageType.VendorShipped);
        let hasSubsequentData = (this.ensureStageHasData(models_1.StageType.IFCReceived) ||
            this.ensureStageHasData(models_1.StageType.IFCStaged) ||
            this.ensureStageHasData(models_1.StageType.IFCShipped) ||
            this.ensureStageHasData(models_1.StageType.RDCReceived) ||
            this.ensureStageHasData(models_1.StageType.Invoiced));
        // Add a MissingVendorShipped discrepancy if we do not have PO data but we do have some subsequent data
        if (!hasVSData) {
            if (hasSubsequentData) {
                this.createDiscrepancy(models_1.DiscrepancyType.MissingVendorShipped, models_1.StageType.VendorShipped, this.ap.PONumber, "", this.ap.PONumber, 1, 0);
            }
            // Create the VendorShippedQuantityMatched fact
            const totalSKUOrdered = this.ap.PurchaseOrders.reduce((p, v, i, l) => { return (p + v.Quantity); }, 0);
            this.facts[models_1.ADRFactType.VendorShippedQuantityMatched] = { expected: totalSKUOrdered, observed: 0 };
        }
        return hasVSData;
    }
    beforeIFCTruckUnloaded() {
        let hasIRData = this.ensureStageHasData(models_1.StageType.IFCReceived);
        if (!hasIRData) {
            // Create the IFCReceivedQuantityMatched fact
            const totalSKUShipped = this.ap.VendorShippeds.reduce((p, v, i, l) => { return (p + v.Quantity); }, 0);
            this.facts[models_1.ADRFactType.IFCReceivedQuantityMatched] = { expected: totalSKUShipped, observed: 0 };
        }
        return hasIRData;
    }
    beforeHomeFreightTruckUnloaded() {
        let hasRRData = this.ensureStageHasData(models_1.StageType.RDCReceived);
        if (!hasRRData) {
            // Create the RDCReceivedQuantityMatched fact
            const totalSKUShipped = this.ap.VendorShippeds.reduce((p, v, i, l) => { return (p + v.Quantity); }, 0);
            this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched] = { expected: totalSKUShipped, observed: 0 };
        }
        return hasRRData;
    }
    beforeItemsSorted() { return this.ensureStageHasData(models_1.StageType.IFCStaged); }
    beforeIFCTruckLoaded() { return this.ensureStageHasData(models_1.StageType.IFCShipped); }
    beforeRDCTruckUnloaded() { return this.ensureStageHasData(models_1.StageType.RDCReceived); }
    onBeforeInvoiceReceived() { return this.ensureStageHasData(models_1.StageType.Invoiced); }
    ensureStageHasData(stageType) {
        const sd = this.ap.getStageDetails(stageType);
        return (sd !== undefined && sd.length > 0);
    }
    purchaseOrdered() {
        // We should only run this set of business rules when PurchaseOrders are being imported. Otherwise, exit and continue with later stages
        if (this.uomList === undefined || this.uomList.Items.length === 0) {
            return;
        }
        this.ap.setStageDiscrepancies(models_1.StageType.PurchaseOrdered, []);
        // Get the PurchaseOrder data
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        // Loop through each PurchaseOrder record
        let totalSKUOrdered = 0;
        pos.forEach((po, i, l) => {
            // Try to find the current SKU for the PurchaseOrder in the UoM data
            const uomItemIndex = this.uomList.Items.findIndex((vp, ip, lb) => { return po.SKU == vp.SKU; });
            if (uomItemIndex === -1) {
                // The PurchaseOrder contains a SKU that the Vendor does not offer (SKUMissingFromUOM)
                this.createDiscrepancy(models_1.DiscrepancyType.SKUMissingFromUOM, models_1.StageType.PurchaseOrdered, po.PONumber, po.RecordID, po.SKU, 0, po.Quantity);
            }
            totalSKUOrdered += po.Quantity;
        });
        // Update the PurchaseOrderQuantityMatched fact
        this.facts[models_1.ADRFactType.PurchaseOrderQuantityMatched] = { expected: totalSKUOrdered, observed: totalSKUOrdered };
    }
    vendorShipped() {
        this.ap.setStageDiscrepancies(models_1.StageType.VendorShipped, []);
        // Get the PurchaseOrder and VendorShipped data
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const vss = this.ap.getStageDetails(models_1.StageType.VendorShipped);
        // Loop through each VendorShipped record, comparing to PurchaseOrder records
        vss.forEach((v, i, l) => {
            if (v.SKU.trim().length == 0) {
                // The Vendor shipped an item with a blank SKU that was not on the original PO (BlankSKUAtVendorShipped)
                this.createDiscrepancy(models_1.DiscrepancyType.BlankSKUAtVendorShipped, models_1.StageType.VendorShipped, v.PONumber, v.RecordID, v.SKU, 0, v.Quantity);
                return;
            }
            // Try to find the current SKU on the original PO.  Look for RDC for an exact match
            let poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.RDC; });
            if (poItemIndex == -1) {
                // If this is a homefreight situation, then we should look at the ifc
                poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.IFCDC && vp.RDC == null; });
                if (poItemIndex == -1) {
                    // Try a less exact match with only SKU
                    poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU; });
                }
            }
            const ss = v;
            let expectedQuantity = 0;
            let totalSKUShipped = 0;
            if (poItemIndex > -1) {
                const po = pos[poItemIndex];
                expectedQuantity = po.Quantity;
                if ((po.RDC != ss.RDC && po.RDC != null && po.RDC.toString().trim().length >= 4) ||
                    ((po.RDC == null || po.RDC.toString().trim().length < 4) && po.IFCDC.toString().trim().length >= 4 && po.IFCDC != ss.RDC) ||
                    (po.RDC.toString().trim().length < 4 && po.IFCDC.toString().trim().length < 4)) {
                    // The Vendor shipped to the wrong RDC (WrongRDC)
                    this.createDiscrepancy(models_1.DiscrepancyType.WrongRDC, models_1.StageType.VendorShipped, po.PONumber, ss.RecordID, ss.RDC, 0, 0);
                }
                // We need to aggregate all the quantities for the current SKU
                totalSKUShipped = vss.reduce((sp, sv, si, sl) => {
                    if (sv.SKU == po.SKU) {
                        return (sp + sv.Quantity);
                    }
                    else {
                        return sp;
                    }
                }, 0);
                if (expectedQuantity > totalSKUShipped) {
                    // The Vendor shipped less than expected (FillShortage)
                    this.createDiscrepancy(models_1.DiscrepancyType.FillShortage, models_1.StageType.VendorShipped, po.PONumber, ss.RecordID, po.SKU, expectedQuantity, totalSKUShipped);
                }
                if (expectedQuantity < totalSKUShipped) {
                    // The Vendor shipped more than expected (FillOverage)
                    this.createDiscrepancy(models_1.DiscrepancyType.FillOverage, models_1.StageType.VendorShipped, po.PONumber, ss.RecordID, po.SKU, expectedQuantity, totalSKUShipped);
                }
            }
            else {
                // The Vendor shipped a SKU that was not on the original PO (WrongSKU)
                this.createDiscrepancy(models_1.DiscrepancyType.WrongSKU, models_1.StageType.VendorShipped, ss.PONumber, ss.RecordID, ss.SKU, 0, ss.Quantity);
                totalSKUShipped = ss.Quantity;
            }
            // Update the VendorShippedQuantityMatched fact
            if (this.facts[models_1.ADRFactType.VendorShippedQuantityMatched] === undefined) {
                this.facts[models_1.ADRFactType.VendorShippedQuantityMatched] = { expected: expectedQuantity, observed: totalSKUShipped };
            }
            else {
                this.facts[models_1.ADRFactType.VendorShippedQuantityMatched].expected += expectedQuantity;
                this.facts[models_1.ADRFactType.VendorShippedQuantityMatched].observed += totalSKUShipped;
            }
        });
    }
    ifcReceived() {
        this.ap.setStageDiscrepancies(models_1.StageType.IFCReceived, []);
        // Get the PurchaseOrder, VendorShipped, and IFCReceived data
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const vss = this.ap.getStageDetails(models_1.StageType.VendorShipped);
        const irs = this.ap.getStageDetails(models_1.StageType.IFCReceived);
        // Count the pallets the Vendor shipped and the IFC received
        const shippedUCCCounts = vss.reduce((p, v, i, l) => {
            let uccIndex = p.findIndex((vi, ii, li) => { return Object.keys(vi)[0] == v.UCC128; });
            if (uccIndex == -1) {
                uccIndex = p.length;
                p[uccIndex] = {};
                p[uccIndex][v.UCC128] = [v.RecordID];
            }
            else {
                p[uccIndex][v.UCC128].push(v.RecordID);
            }
            return p;
        }, []);
        const receivedUCCCounts = irs.reduce((p, v, i, l) => {
            let uccIndex = p.findIndex((vi, ii, li) => { return Object.keys(vi)[0] == v.UCC128; });
            if (uccIndex == -1) {
                uccIndex = p.length;
                p[uccIndex] = {};
                p[uccIndex][v.UCC128] = [v.RecordID];
            }
            else {
                p[uccIndex][v.UCC128].push(v.RecordID);
            }
            return p;
        }, []);
        // Check if some shipped pallets were never received (MissingPallet)
        shippedUCCCounts.forEach((v, i, l) => {
            const currentUCC128 = Object.keys(v)[0];
            const shippedQuantity = 1;
            let receivedQuantity = 0;
            const receivedIndex = receivedUCCCounts.findIndex((sv, si, sl) => { return (currentUCC128 == Object.keys(sv)[0]); });
            if (receivedIndex > -1) {
                receivedQuantity = 1;
            }
            if (shippedQuantity > receivedQuantity) {
                // We are receiving less pallets than were shipped (MissingPallet)
                const missingPalletRecordIDs = Object.values(v)[0];
                for (let x = 0; x < missingPalletRecordIDs.length; x++) {
                    this.createDiscrepancy(models_1.DiscrepancyType.MissingPallet, models_1.StageType.IFCReceived, this.ap.PONumber, missingPalletRecordIDs[x], currentUCC128, shippedQuantity, receivedQuantity);
                }
            }
        });
        // Check if some received pallets were never shipped (AdditionalPallet)
        receivedUCCCounts.forEach((v, i, l) => {
            const currentUCC128 = Object.keys(v)[0];
            const receivedQuantity = 1; // Object.values(v)[0] as number;
            let shippedQuantity = 0;
            const shippedIndex = shippedUCCCounts.findIndex((sv, si, sl) => { return (currentUCC128 == Object.keys(sv)[0]); });
            if (shippedIndex > -1) {
                shippedQuantity = 1;
            }
            if (shippedQuantity < receivedQuantity) {
                // We are receiving less pallets than were shipped (AdditionalPallet)
                const additionalPalletRecordIDs = Object.values(v)[0];
                for (let x = 0; x < additionalPalletRecordIDs.length; x++) {
                    this.createDiscrepancy(models_1.DiscrepancyType.AdditionalPallet, models_1.StageType.IFCReceived, this.ap.PONumber, additionalPalletRecordIDs[x], currentUCC128, shippedQuantity, receivedQuantity);
                }
            }
        });
        // Loop through each IFCReceived record, comparing to PurchaseOrder records
        let expectedQuantity = 0;
        let totalSKUReceived = 0;
        irs.forEach((v, i, l) => {
            // Try to find the current SKU on the original PO.  Look for RDC for an exact match
            let poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.RDC; });
            if (poItemIndex == -1) {
                // If this is a homefreight situation, then we should look at the ifc
                poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.IFCDC && vp.RDC == null; });
                if (poItemIndex == -1) {
                    // Try a less exact match with only SKU
                    poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU; });
                }
            }
            // Determine the total amount of the current SKU on the VendorShipment.
            expectedQuantity = vss.reduce((pp, vp, ip, lb) => {
                if (v.SKU == vp.SKU) {
                    return (pp + vp.Quantity);
                }
                else {
                    return pp;
                }
            }, 0);
            const ir = v;
            // We need to aggregate all the quantities for the current SKU
            totalSKUReceived = irs.reduce((ip, iv, ii, il) => {
                if (iv.SKU == v.SKU) {
                    return (ip + iv.ReceivedQuantity);
                }
                else {
                    return ip;
                }
            }, 0);
            if (poItemIndex > -1) {
                const po = pos[poItemIndex];
                if ((po.RDC != ir.RDC && po.RDC != null && po.RDC.toString().trim().length >= 4) ||
                    ((po.RDC == null || po.RDC.toString().trim().length < 4) && po.IFCDC.toString().trim().length >= 4 && po.IFCDC != ir.RDC) ||
                    (po.RDC.toString().trim().length < 4 && po.IFCDC.toString().trim().length < 4)) {
                    // The IFC Received for the wrong RDC ()
                    this.createDiscrepancy(models_1.DiscrepancyType.WrongRDC, models_1.StageType.IFCReceived, po.PONumber, v.RecordID, ir.RDC, 0, 0);
                }
                if (expectedQuantity > totalSKUReceived) {
                    // The IFC Received less than expected (Shortage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Shortage, models_1.StageType.IFCReceived, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUReceived);
                }
                if (expectedQuantity < totalSKUReceived) {
                    // The IFC Received more than expected (Overage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Overage, models_1.StageType.IFCReceived, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUReceived);
                }
            }
            else {
                // The IFC received a SKU that was not on the original PO (WrongSKU)
                this.createDiscrepancy(models_1.DiscrepancyType.WrongSKU, models_1.StageType.IFCReceived, ir.PONumber, v.RecordID, ir.SKU, 0, totalSKUReceived);
            }
            // Update the IFCReceivedQuantityMatched fact
            if (this.facts[models_1.ADRFactType.IFCReceivedQuantityMatched] === undefined) {
                this.facts[models_1.ADRFactType.IFCReceivedQuantityMatched] = { expected: expectedQuantity, observed: totalSKUReceived };
            }
            else {
                this.facts[models_1.ADRFactType.IFCReceivedQuantityMatched].expected += expectedQuantity;
                this.facts[models_1.ADRFactType.IFCReceivedQuantityMatched].observed += totalSKUReceived;
            }
        });
    }
    ifcStaged() {
        this.ap.setStageDiscrepancies(models_1.StageType.IFCStaged, []);
        // Get the PurchaseOrder, IFCReceived, and IFCStaged data
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const vss = this.ap.getStageDetails(models_1.StageType.VendorShipped);
        const irs = this.ap.getStageDetails(models_1.StageType.IFCReceived);
        const ists = this.ap.getStageDetails(models_1.StageType.IFCStaged);
        // Count the pallets the IFC received, and then IFC staged
        const receivedUCCCounts = irs.reduce((p, v, i, l) => {
            let uccIndex = p.findIndex((vi, ii, li) => { return Object.keys(vi)[0] == v.UCC128; });
            if (uccIndex == -1) {
                uccIndex = p.length;
                p[uccIndex] = {};
                p[uccIndex][v.UCC128] = [v.RecordID];
            }
            else {
                p[uccIndex][v.UCC128].push(v.RecordID);
            }
            return p;
        }, []);
        const stagedUCCCounts = ists.reduce((p, v, i, l) => {
            let uccIndex = p.findIndex((vi, ii, li) => { return Object.keys(vi)[0] == v.UCC128; });
            if (uccIndex == -1) {
                uccIndex = p.length;
                p[uccIndex] = {};
                p[uccIndex][v.UCC128] = [v.RecordID];
            }
            else {
                p[uccIndex][v.UCC128].push(v.RecordID);
            }
            return p;
        }, []);
        // Check if some received pallets were never staged (MissingPallet)
        receivedUCCCounts.forEach((v, i, l) => {
            const currentUCC128 = Object.keys(v)[0];
            const receivedQuantity = 1;
            let stagedQuantity = 0;
            const stagedIndex = stagedUCCCounts.findIndex((sv, si, sl) => { return (currentUCC128 == Object.keys(sv)[0]); });
            if (stagedIndex > -1) {
                stagedQuantity = 1;
            }
            if (receivedQuantity > stagedQuantity) {
                // We are staging less pallets than were received (MissingPallet)
                const missingPalletRecordIDs = Object.values(v)[0];
                for (let x = 0; x < missingPalletRecordIDs.length; x++) {
                    this.createDiscrepancy(models_1.DiscrepancyType.MissingPallet, models_1.StageType.IFCStaged, this.ap.PONumber, missingPalletRecordIDs[x], currentUCC128, receivedQuantity, stagedQuantity);
                }
            }
        });
        // Check if some staged pallets were never received (AdditionalPallet)
        stagedUCCCounts.forEach((v, i, l) => {
            const currentUCC128 = Object.keys(v)[0];
            const stagedQuantity = 1;
            let receivedQuantity = 0;
            const receivedIndex = receivedUCCCounts.findIndex((sv, si, sl) => { return (currentUCC128 == Object.keys(sv)[0]); });
            if (receivedIndex > -1) {
                receivedQuantity = 1;
            }
            if (receivedQuantity < stagedQuantity) {
                // We are receiving less pallets than were shipped (AdditionalPallet)
                const additionalPalletRecordIDs = Object.values(v)[0];
                for (let x = 0; x < additionalPalletRecordIDs.length; x++) {
                    this.createDiscrepancy(models_1.DiscrepancyType.AdditionalPallet, models_1.StageType.IFCStaged, this.ap.PONumber, additionalPalletRecordIDs[x], currentUCC128, receivedQuantity, stagedQuantity);
                }
            }
        });
        // Loop through each IFCStaged record, comparing to PurchaseOrder and VendorShipped records
        let expectedQuantity = 0;
        let totalSKUStaged = 0;
        ists.forEach((v, i, l) => {
            // Try to find the current SKU on the original PO.  Look for RDC for an exact match
            let poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.RDC; });
            if (poItemIndex == -1) {
                // If this is a homefreight situation, then we should look at the ifc
                poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.IFCDC && vp.RDC == null; });
                if (poItemIndex == -1) {
                    // Try a less exact match with only SKU
                    poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU; });
                }
            }
            // Determine the total amount of the current SKU on the VendorShipment.
            expectedQuantity = vss.reduce((pp, vp, ip, lb) => {
                if (v.SKU == vp.SKU) {
                    return (pp + vp.Quantity);
                }
                else {
                    return pp;
                }
            }, 0);
            const ist = v;
            // We need to aggregate all the quantities for the current SKU
            totalSKUStaged = ists.reduce((ip, iv, ii, il) => {
                if (iv.SKU == v.SKU) {
                    return (ip + iv.Quantity);
                }
                else {
                    return ip;
                }
            }, 0);
            if (poItemIndex > -1) {
                const po = pos[poItemIndex];
                if ((po.RDC != ist.RDC && po.RDC != null && po.RDC.toString().trim().length >= 4) ||
                    ((po.RDC == null || po.RDC.toString().trim().length < 4) && po.IFCDC.toString().trim().length >= 4 && po.IFCDC != ist.RDC) ||
                    (po.RDC.toString().trim().length < 4 && po.IFCDC.toString().trim().length < 4)) {
                    // The IFC Staged for the wrong RDC ()
                    this.createDiscrepancy(models_1.DiscrepancyType.WrongRDC, models_1.StageType.IFCStaged, po.PONumber, ist.RecordID, ist.RDC, 0, 0);
                }
                if (expectedQuantity > totalSKUStaged) {
                    // The IFC Staged less than expected (Shortage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Shortage, models_1.StageType.IFCStaged, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUStaged);
                }
                if (expectedQuantity < totalSKUStaged) {
                    // The IFC Staged more than expected (Overage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Overage, models_1.StageType.IFCStaged, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUStaged);
                }
            }
            else {
                // The IFC Staged a SKU that was not on the original PO (WrongSKU)
                this.createDiscrepancy(models_1.DiscrepancyType.WrongSKU, models_1.StageType.IFCStaged, ist.PONumber, v.RecordID, ist.SKU, 0, totalSKUStaged);
            }
            // Update the IFCStagedQuantityMatched fact
            if (this.facts[models_1.ADRFactType.IFCStagedQuantityMatched] === undefined) {
                this.facts[models_1.ADRFactType.IFCStagedQuantityMatched] = { expected: expectedQuantity, observed: totalSKUStaged };
            }
            else {
                this.facts[models_1.ADRFactType.IFCStagedQuantityMatched].expected += expectedQuantity;
                this.facts[models_1.ADRFactType.IFCStagedQuantityMatched].observed += totalSKUStaged;
            }
        });
    }
    ifcShipped() {
        this.ap.setStageDiscrepancies(models_1.StageType.IFCShipped, []);
        // Get the PurchaseOrder and IFCShipped data
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const vss = this.ap.getStageDetails(models_1.StageType.VendorShipped);
        const ishs = this.ap.getStageDetails(models_1.StageType.IFCShipped);
        // Loop through each IFCShipped record, comparing to PurchaseOrder & VendorShipped records
        let expectedQuantity = 0;
        let totalSKUShipped = 0;
        ishs.forEach((v, i, l) => {
            // Try to find the current SKU on the original PO.  Look for RDC for an exact match
            let poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.RDC; });
            if (poItemIndex == -1) {
                // If this is a homefreight situation, then we should look at the ifc
                poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.IFCDC && vp.RDC == null; });
                if (poItemIndex == -1) {
                    // Try a less exact match with only SKU
                    poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU; });
                }
            }
            // Determine the total amount of the current SKU on the VendorShipment.
            expectedQuantity = vss.reduce((pp, vp, ip, lb) => {
                if (v.SKU == vp.SKU) {
                    return (pp + vp.Quantity);
                }
                else {
                    return pp;
                }
            }, 0);
            const ish = v;
            // We need to aggregate all the quantities for the current SKU
            totalSKUShipped = ishs.reduce((ip, iv, ii, il) => {
                if (iv.SKU == v.SKU) {
                    return (ip + iv.Quantity);
                }
                else {
                    return ip;
                }
            }, 0);
            if (poItemIndex > -1) {
                const po = pos[poItemIndex];
                if ((po.RDC != ish.RDC && po.RDC != null && po.RDC.toString().trim().length >= 4) ||
                    ((po.RDC == null || po.RDC.toString().trim().length < 4) && po.IFCDC.toString().trim().length >= 4 && po.IFCDC != ish.RDC) ||
                    (po.RDC.toString().trim().length < 4 && po.IFCDC.toString().trim().length < 4)) {
                    // The IFC shipped to the wrong RDC (WrongRDC)
                    this.createDiscrepancy(models_1.DiscrepancyType.WrongRDC, models_1.StageType.IFCShipped, po.PONumber, v.RecordID, ish.RDC, 0, 0);
                }
                if (expectedQuantity > totalSKUShipped) {
                    // The IFC shipped less than expected (Shortage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Shortage, models_1.StageType.IFCShipped, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUShipped);
                }
                if (expectedQuantity < totalSKUShipped) {
                    // The IFC shipped more than expected (Overage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Overage, models_1.StageType.IFCShipped, po.PONumber, v.RecordID, po.SKU, expectedQuantity, totalSKUShipped);
                }
            }
            else {
                // The IFC shipped a SKU that was not on the original PO (WrongSKU)
                this.createDiscrepancy(models_1.DiscrepancyType.WrongSKU, models_1.StageType.IFCShipped, ish.PONumber, v.RecordID, ish.SKU, 0, totalSKUShipped);
            }
            // Update the IFCShippedQuantityMatched fact
            if (this.facts[models_1.ADRFactType.IFCShippedQuantityMatched] === undefined) {
                this.facts[models_1.ADRFactType.IFCShippedQuantityMatched] = { expected: expectedQuantity, observed: totalSKUShipped };
            }
            else {
                this.facts[models_1.ADRFactType.IFCShippedQuantityMatched].expected += expectedQuantity;
                this.facts[models_1.ADRFactType.IFCShippedQuantityMatched].observed += totalSKUShipped;
            }
        });
    }
    rdcReceived() {
        this.ap.setStageDiscrepancies(models_1.StageType.RDCReceived, []);
        // Get the PurchaseOrdered and RDCReceived stages
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const vss = this.ap.getStageDetails(models_1.StageType.VendorShipped);
        const rrs = this.ap.getStageDetails(models_1.StageType.RDCReceived);
        // Loop through each RDCReceived record, comparing to PurchaseOrder & VendorShipped records
        let expectedQuantity = 0;
        let totalSKUReceived = 0;
        rrs.forEach((v, i, l) => {
            // Try to find the current SKU on the original PO.  Look for RDC for an exact match
            let poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.RDC; });
            if (poItemIndex == -1) {
                // If this is a homefreight situation, then we should look at the ifc
                poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU && v.RDC == vp.IFCDC && vp.RDC == null; });
                if (poItemIndex == -1) {
                    // Try a less exact match with only SKU
                    poItemIndex = pos.findIndex((vp, ip, lb) => { return v.SKU == vp.SKU; });
                }
            }
            // Determine the total amount of the current SKU on the VendorShipment.
            expectedQuantity = vss.reduce((pp, vp, ip, lb) => {
                if (v.SKU == vp.SKU) {
                    return (pp + vp.Quantity);
                }
                else {
                    return pp;
                }
            }, 0);
            const rr = v;
            // We need to aggregate all the quantities for the current SKU
            totalSKUReceived = rrs.reduce((ip, iv, ii, il) => {
                if (iv.SKU == v.SKU) {
                    return (ip + iv.Quantity);
                }
                else {
                    return ip;
                }
            }, 0);
            if (poItemIndex > -1) {
                const po = pos[poItemIndex];
                if ((po.RDC != rr.RDC && po.RDC != null && po.RDC.toString().trim().length >= 4) ||
                    ((po.RDC == null || po.RDC.toString().trim().length < 4) && po.IFCDC.toString().trim().length >= 4 && po.IFCDC != rr.RDC) ||
                    (po.RDC.toString().trim().length < 4 && po.IFCDC.toString().trim().length < 4)) {
                    // The RDC received for the wrong RDC (WrongRDC)
                    this.createDiscrepancy(models_1.DiscrepancyType.WrongRDC, models_1.StageType.RDCReceived, po.PONumber, rr.RecordID, rr.RDC, 0, 0);
                }
                if (expectedQuantity > totalSKUReceived) {
                    // The RDC received less than expected (Shortage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Shortage, models_1.StageType.RDCReceived, po.PONumber, rr.RecordID, po.SKU, expectedQuantity, totalSKUReceived);
                }
                if (expectedQuantity < totalSKUReceived) {
                    // The RDC received more than expected (Overage)
                    this.createDiscrepancy(models_1.DiscrepancyType.Overage, models_1.StageType.RDCReceived, po.PONumber, rr.RecordID, po.SKU, expectedQuantity, totalSKUReceived);
                }
            }
            else {
                // The RDC received a SKU that was not on the original PO (WrongSKU)
                this.createDiscrepancy(models_1.DiscrepancyType.WrongSKU, models_1.StageType.RDCReceived, rr.PONumber, rr.RecordID, rr.SKU, 0, totalSKUReceived);
            }
            // Update the RDCReceivedQuantityMatched fact
            if (this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched] === undefined) {
                this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched] = { expected: expectedQuantity, observed: totalSKUReceived };
            }
            else {
                this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched].expected += expectedQuantity;
                this.facts[models_1.ADRFactType.RDCReceivedQuantityMatched].observed += totalSKUReceived;
            }
        });
    }
    invoiced() {
        this.ap.setStageDiscrepancies(models_1.StageType.Invoiced, []);
        // Get the PurchaseOrdered and Invoiced stages
        const pos = this.ap.getStageDetails(models_1.StageType.PurchaseOrdered);
        const invs = this.ap.getStageDetails(models_1.StageType.Invoiced);
        // Loop through each Invoice record, comparing to PurchaseOrder records
        invs.forEach((v, i, l) => {
        });
    }
    createDiscrepancy(discrepancyType, stageType, poNumber, importedRecordID, itemID, expectedQuantity, observedQuantity) {
        // Only add unique discrepancies
        let existingDiscrepancies = this.ap.getStageDiscrepancies(stageType);
        if (existingDiscrepancies !== undefined && existingDiscrepancies.length > 0) {
            let existingDiscrepancyIndex = existingDiscrepancies.findIndex((v, i, l) => { return v.DiscrepancyType == discrepancyType && v.RecordID == importedRecordID; });
            // We are definitely flagging the same thing twice.  Exit without adding a new discrepancy
            if (existingDiscrepancyIndex > -1) {
                return;
            }
        }
        let newDiscrepancy = {
            DiscrepancyID: poNumber + '-' + discrepancyType.toString() + '-' + stageType.toString() + '-' + importedRecordID + '-' + itemID,
            DiscrepancyType: discrepancyType,
            StageType: stageType,
            RecordID: importedRecordID,
            ItemID: itemID,
            ExpectedQuantity: expectedQuantity,
            ObservedQuantity: observedQuantity,
            PONumber: poNumber
        };
        this.ap.addStageDiscrepancy(stageType, newDiscrepancy);
    }
}
exports.ProcessingEngine = ProcessingEngine;
//# sourceMappingURL=processing-engine.js.map