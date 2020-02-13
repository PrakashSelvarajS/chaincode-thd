"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require('../logger');
const logger = Logger.getLogger('./decorators/repository.decorator.ts');
require("reflect-metadata");
const ALL_REPOSITORY_CONFIGS = new Map();
function Repository(config = { objectType: '', requirePDC: false, pdcResolver: null }) {
    return (constructor) => {
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
}
exports.Repository = Repository;
;
async function getCurrentPDCName(ctx) {
    return 'collection_' + ctx.clientIdentity.getMSPID();
}
//# sourceMappingURL=repository.decorator.js.map