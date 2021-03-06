

const Logger = require('../logger');
const logger = Logger.getLogger('./decorators/repository.decorator.ts');
import 'reflect-metadata';
import { Context } from 'fabric-contract-api';


const ALL_REPOSITORY_CONFIGS : Map<Symbol, RepositoryConfig> = new Map<Symbol, RepositoryConfig>();


export interface RepositoryConfig {
    objectType: string;
    requirePDC: boolean;
    pdcResolver?: (ctx:Context)=>Promise<string>;
}

export function Repository(config : RepositoryConfig = { objectType: '', requirePDC: false, pdcResolver: null }) {
    return (constructor : Function) => {
        logger.debug('@Repository args:', `config -> ${config},`, 'Target ->', constructor.name);

        // Sanity checks for the provided config
        if (config.objectType === undefined || config.objectType === null) {
            logger.debug('DECORATOR: target.name =' + constructor.name);
            config.objectType = constructor.name;
        }
        if (config.requirePDC === undefined || config.requirePDC === null) {
            config.requirePDC = false;
        }
        if (config.requirePDC === true && (config.pdcResolver === undefined || config.pdcResolver === null)) {
            config.pdcResolver = getCurrentPDCName;
        }

        // Create a key for storing the config for this instance using the target name and the propertyKey
        const key = constructor.name;

        // Store the config for this instance
        ALL_REPOSITORY_CONFIGS[key] = config;

        // Store the individual config values as part of the class prototype
        constructor.prototype.objectType = config.objectType;
        constructor.prototype.requirePDC = config.requirePDC;
        constructor.prototype.pdcResolver = config.pdcResolver;
    };
};



async function getCurrentPDCName(ctx:Context) : Promise<string> {
    return 'collection_' + ctx.clientIdentity.getMSPID();
}