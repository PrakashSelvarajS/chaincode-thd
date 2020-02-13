import 'reflect-metadata';
import { Context } from 'fabric-contract-api';
export interface RepositoryConfig {
    objectType: string;
    requirePDC: boolean;
    pdcResolver?: (ctx: Context) => Promise<string>;
}
export declare function Repository(config?: RepositoryConfig): (constructor: Function) => void;
