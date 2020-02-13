import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { ADRRule, ADRRuleList } from "../models";
import { Repository } from '../decorators/repository.decorator';




@Repository({ objectType: 'adr', requirePDC: true })
export class ADRRuleListRepository extends CRUDRepository<ADRRuleList> {

    constructor(ctx : Context) {
        super(ADRRuleList, ctx);
    }

    public getStorageKeyForModel(currentModel: ADRRuleList): string {
        return this.getStorageKey();
    }

}