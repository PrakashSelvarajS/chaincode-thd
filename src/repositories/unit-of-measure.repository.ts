import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { UnitOfMeasureList } from "../models";
import { Repository } from '../decorators/repository.decorator';





@Repository({ objectType: 'uom', requirePDC: true })
export class UnitOfMeasureListRepository extends CRUDRepository<UnitOfMeasureList> {

    constructor(ctx : Context) {
        super(UnitOfMeasureList, ctx, true);
    }

    public getStorageKeyForModel(currentModel: UnitOfMeasureList): string {
        return this.getStorageKey();
    }

}