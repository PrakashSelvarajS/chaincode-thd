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
let ADRRuleContract = class ADRRuleContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.ADRRuleContract"); }
    async retrieveADRRules(ctx) {
        let repo = new repositories_1.ADRRuleListRepository(ctx);
        const ruleList = await repo.get();
        if (ruleList === undefined || ruleList.Items === undefined || ruleList.Items.length == 0) {
            throw new Error(`ERROR: No ADRRules exist in the blockchain for this Vendor`);
        }
        else {
            return ruleList.Items;
        }
    }
    // Used to merge new ADR Rules with existing ADR Rules
    async saveADRRules(ctx, newADRRules) {
        // Check if there are existing ADR rules
        let repo = new repositories_1.ADRRuleListRepository(ctx);
        let existingADRRuleslist = await repo.get();
        let savedADRRules = [];
        if (existingADRRuleslist === undefined || existingADRRuleslist.Items === undefined || existingADRRuleslist.Items.length === 0) {
            //There are no existing ADRRules, create it
            console.log('No ADRRules, adding all the provided ADRRules to the ledger');
            let newADRRuleslist = new models_1.ADRRuleList();
            newADRRuleslist.Items = newADRRules;
            newADRRuleslist = await repo.create(newADRRuleslist);
            savedADRRules = newADRRuleslist.Items;
        }
        else {
            for (let currentADRRule of newADRRules) {
                const existingitemindex = existingADRRuleslist.Items.findIndex((v, i, l) => { return currentADRRule.RuleID == v.RuleID; });
                if (existingitemindex > -1) {
                    //Replace existing ADR rule with the matching recieved ADR rule
                    existingADRRuleslist.Items[existingitemindex] = currentADRRule;
                    savedADRRules.push(currentADRRule);
                }
            }
            // Get a list of ADRRules that are in the new list, but not in the existing list
            let newADRRulesNotInExistingList = newADRRules.filter((v, i, l) => { return (existingADRRuleslist.Items.findIndex((vv, ii, ll) => { return v.RuleID == vv.RuleID; }) == -1); });
            if (newADRRulesNotInExistingList.length > 0) {
                existingADRRuleslist.Items.push(...newADRRulesNotInExistingList);
                savedADRRules.push(...newADRRulesNotInExistingList);
            }
            existingADRRuleslist = await repo.update(existingADRRuleslist);
        }
        return savedADRRules;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('ADRRule[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], ADRRuleContract.prototype, "retrieveADRRules", null);
__decorate([
    fabric_contract_api_1.Transaction(true),
    fabric_contract_api_1.Param("newADRRules", "ADRRule[]"),
    fabric_contract_api_1.Returns('UnitOfMeasure[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array]),
    __metadata("design:returntype", Promise)
], ADRRuleContract.prototype, "saveADRRules", null);
ADRRuleContract = __decorate([
    fabric_contract_api_1.Info({ title: 'ADRRuleContract', description: 'Contract for managing the "Automated Dispute Resolution Rule" data for a Vendor' }),
    __metadata("design:paramtypes", [])
], ADRRuleContract);
exports.ADRRuleContract = ADRRuleContract;
//# sourceMappingURL=adr-rule.contract.js.map