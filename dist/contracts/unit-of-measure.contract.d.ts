import { Context, Contract } from 'fabric-contract-api';
import { UnitOfMeasure } from "../models";
export declare class UnitOfMeasureContract extends Contract {
    constructor();
    saveUnitOfMeasure(ctx: Context, newUOMs: UnitOfMeasure[]): Promise<UnitOfMeasure[]>;
    deleteUnitOfMeasure(ctx: Context, sku: string): Promise<boolean>;
    retrieveUnitOfMeasure(ctx: Context): Promise<UnitOfMeasure[]>;
}
