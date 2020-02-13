import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ListValidatorConfigs } from '../decorators/property-validator.decorator';
import { Vendor } from "../models";
import { VendorListRepository } from '../repositories';



@Info({ title: 'ValidatorConfigContract', description: 'Contract for managing the configuration of the DataModel Validators' })
export class ValidatorConfigContract extends Contract {

    constructor() { super("com.homedepot.procurement.ValidatorConfigContract"); }

    @Transaction(false)
    public async logCurrentValidationConfig(ctx: Context): Promise<void> {
        ListValidatorConfigs();
    }

}