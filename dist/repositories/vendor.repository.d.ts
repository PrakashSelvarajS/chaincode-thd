import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { VendorList } from "../models";
export declare class VendorListRepository extends CRUDRepository<VendorList> {
    constructor(ctx: Context);
    getStorageKeyForModel(currentModel: VendorList): string;
}
