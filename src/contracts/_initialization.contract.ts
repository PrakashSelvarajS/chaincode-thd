import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ListValidatorConfigs } from '../decorators/property-validator.decorator';



@Info({ title: 'InitializationContract', description: 'Contract for initializing the environment for the current chaincode' })
export class InitializationContract extends Contract {

    constructor() { super("com.homedepot.procurement.InitializationContract"); }

    @Transaction(false)
    public async init(ctx: Context): Promise<void> {
        console.log('Chaincode initialization completed successfully');
    }

}