import { Context } from 'fabric-contract-api';
import { CRUDRepository } from "./crud.repository";
import { AssetProcurement } from "../models";
import { Repository } from '../decorators/repository.decorator';




@Repository({ objectType: 'ap', requirePDC: true })
export class AssetProcurementRepository extends CRUDRepository<AssetProcurement> {

    constructor(ctx : Context) {
        super(AssetProcurement, ctx);
    }

    public getStorageKeyForModel(currentModel: AssetProcurement): string {
        if (currentModel.PONumber.trim().length == 0) {
            throw new Error('ERROR: currentModel does not contain a PONumber.  StorageKeys require a PONumber.');
        } else {
            return (this.TContext.stub.createCompositeKey(this['objectType'], [currentModel.PONumber]));
        }
    }

}