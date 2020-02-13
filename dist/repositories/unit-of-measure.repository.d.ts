import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { UnitOfMeasureList } from "../models";
export declare class UnitOfMeasureListRepository extends CRUDRepository<UnitOfMeasureList> {
    constructor(ctx: Context);
    getStorageKeyForModel(currentModel: UnitOfMeasureList): string;
}
