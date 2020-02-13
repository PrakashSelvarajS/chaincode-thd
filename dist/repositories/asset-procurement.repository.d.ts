import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { AssetProcurement } from "../models";
export declare class AssetProcurementRepository extends CRUDRepository<AssetProcurement> {
    constructor(ctx: Context);
    getStorageKeyForModel(currentModel: AssetProcurement): string;
}
