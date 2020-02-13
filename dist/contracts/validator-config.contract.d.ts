import { Context, Contract } from 'fabric-contract-api';
export declare class ValidatorConfigContract extends Contract {
    constructor();
    logCurrentValidationConfig(ctx: Context): Promise<void>;
}
