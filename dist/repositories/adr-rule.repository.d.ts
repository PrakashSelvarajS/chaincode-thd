import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { ADRRuleList } from "../models";
export declare class ADRRuleListRepository extends CRUDRepository<ADRRuleList> {
    constructor(ctx: Context);
    getStorageKeyForModel(currentModel: ADRRuleList): string;
}
