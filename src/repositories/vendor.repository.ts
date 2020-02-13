import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { Vendor, VendorList } from "../models";
import { Repository } from '../decorators/repository.decorator';




@Repository({ objectType: 'vendor', requirePDC: true })
export class VendorListRepository extends CRUDRepository<VendorList> {

    constructor(ctx : Context) {
        super(VendorList, ctx, true);
    }

    public getStorageKeyForModel(currentModel: VendorList): string {
        return this.getStorageKey();
    }

}