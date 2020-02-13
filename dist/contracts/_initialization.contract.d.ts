import { Context, Contract } from 'fabric-contract-api';
export declare class InitializationContract extends Contract {
    constructor();
    init(ctx: Context): Promise<void>;
}
