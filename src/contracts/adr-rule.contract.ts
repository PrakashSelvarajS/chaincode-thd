import { Context, Contract, Info, Returns, Transaction, Param } from 'fabric-contract-api';
import { ADRRule, ADRRuleList } from "../models";
import { ADRRuleListRepository } from '../repositories';



@Info({ title: 'ADRRuleContract', description: 'Contract for managing the "Automated Dispute Resolution Rule" data for a Vendor' })
export class ADRRuleContract extends Contract {


    constructor() { super("com.homedepot.procurement.ADRRuleContract"); }


    @Transaction(false)
    @Returns('ADRRule[]')
    public async retrieveADRRules(ctx: Context): Promise<ADRRule[]> {
        let repo: ADRRuleListRepository = new ADRRuleListRepository(ctx);
        const ruleList: ADRRuleList = await repo.get();
        if (ruleList === undefined || ruleList.Items === undefined || ruleList.Items.length == 0) {
            throw new Error(`ERROR: No ADRRules exist in the blockchain for this Vendor`);
        } else {
            return ruleList.Items;
        }
    }


    // Used to merge new ADR Rules with existing ADR Rules
    @Transaction(true)
    @Param("newADRRules", "ADRRule[]")
    @Returns('UnitOfMeasure[]')
    public async saveADRRules(ctx: Context, newADRRules: ADRRule[]): Promise<ADRRule[]> {
        // Check if there are existing ADR rules
        let repo: ADRRuleListRepository = new ADRRuleListRepository(ctx);
        let existingADRRuleslist: ADRRuleList = await repo.get();

        let savedADRRules: ADRRule[] = [];

        if (existingADRRuleslist === undefined || existingADRRuleslist.Items === undefined || existingADRRuleslist.Items.length === 0) {
            //There are no existing ADRRules, create it
            console.log('No ADRRules, adding all the provided ADRRules to the ledger');

            let newADRRuleslist: ADRRuleList = new ADRRuleList();
            newADRRuleslist.Items = newADRRules;
            newADRRuleslist = await repo.create(newADRRuleslist);
            savedADRRules = newADRRuleslist.Items;
        } else {
            for (let currentADRRule of newADRRules) {
                const existingitemindex = existingADRRuleslist.Items.findIndex((v, i, l) => { return currentADRRule.RuleID == v.RuleID });

                if (existingitemindex > -1) {
                    //Replace existing ADR rule with the matching recieved ADR rule
                    existingADRRuleslist.Items[existingitemindex] = currentADRRule;
                    savedADRRules.push(currentADRRule);
                }
            }

            // Get a list of ADRRules that are in the new list, but not in the existing list
            let newADRRulesNotInExistingList: ADRRule[] = newADRRules.filter((v, i, l) => { return (existingADRRuleslist.Items.findIndex((vv, ii, ll) => { return v.RuleID == vv.RuleID; }) == -1); });
            if (newADRRulesNotInExistingList.length > 0) {
                existingADRRuleslist.Items.push(...newADRRulesNotInExistingList);
                savedADRRules.push(...newADRRulesNotInExistingList)
            }

            existingADRRuleslist = await repo.update(existingADRRuleslist);
        }

        return savedADRRules;
    }

}