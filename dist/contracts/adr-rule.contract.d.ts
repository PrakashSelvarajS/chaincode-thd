import { Context, Contract } from 'fabric-contract-api';
import { ADRRule } from "../models";
export declare class ADRRuleContract extends Contract {
    constructor();
    retrieveADRRules(ctx: Context): Promise<ADRRule[]>;
    saveADRRules(ctx: Context, newADRRules: ADRRule[]): Promise<ADRRule[]>;
}
