"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require('../logger');
const logger = Logger.getLogger('./decorators/property-validator.decorator.ts');
require("reflect-metadata");
const objectSerializationMap = new WeakMap();
function ValidatedObject() {
    return (constructor) => {
        logger.debug('@ValidatedObject args: Target ->' + constructor.name);
        constructor.prototype.toJSON = function () {
            let jsonResult = {};
            // First, we want to serialize all the basic properties for this instance
            const instancePropertyKeys = Object.getOwnPropertyNames(this);
            instancePropertyKeys.forEach((v, i, l) => {
                //@ts-ignore
                jsonResult[v] = this[v];
            });
            // Then add all the properties that have Validators attached to them
            const map = objectSerializationMap.get(constructor.prototype);
            const props = Object.keys(map);
            return props.reduce((previous, key) => {
                if (Object.keys(previous).findIndex((v, i, l) => { return v == key; }) > -1) {
                    return previous;
                }
                //@ts-ignore
                previous[map[key]] = this[key];
                return previous;
            }, jsonResult);
        };
    };
}
exports.ValidatedObject = ValidatedObject;
const ALL_VALIDATOR_CONFIGS = new Map();
function ListValidatorConfigs() {
    logger.debug('LIST OF ALL VALIDATOR CONFIGURATIONS');
    logger.debug('====================================');
    ALL_VALIDATOR_CONFIGS.forEach((v, k, m) => {
        logger.debug('Key = ' + k.toString());
        logger.debug('Value = ' + JSON.stringify(v));
        logger.debug('-------------------------------------');
    });
    logger.debug('====================================');
}
exports.ListValidatorConfigs = ListValidatorConfigs;
function NumberRangeValidator(config) {
    return (target, propertyKey) => {
        logger.debug('@NumberRangeValidator args:', `target -> ${target.constructor.name},`, 'propertyKey ->', propertyKey);
        if (config.defaultMinimum === undefined) {
            config.defaultMinimum = -1 * Number.MAX_VALUE;
        }
        if (config.defaultMaximum === undefined) {
            config.defaultMaximum = Number.MAX_VALUE;
        }
        // Create a key for storing the config for this instance using the target name and the propertyKey
        const key = target.constructor.name + '-' + propertyKey.toString();
        let map = objectSerializationMap.get(target);
        if (!map) {
            map = {};
            objectSerializationMap.set(target, map);
        }
        map[propertyKey] = propertyKey;
        // Store the config for this instance
        ALL_VALIDATOR_CONFIGS[key] = config;
        //ListValidatorConfigs();
        // Create the range validator using the config
        const numberIsInRange = (newPropertyValue) => {
            // Retrieve the config from storage
            const currentConfig = ALL_VALIDATOR_CONFIGS[key];
            const rangeMinimum = (currentConfig === undefined || currentConfig.minimum === undefined) ? -1 * Number.MAX_VALUE : currentConfig.minimum;
            const rangeMaximum = (currentConfig === undefined || currentConfig.maximum === undefined) ? Number.MAX_VALUE : currentConfig.maximum;
            logger.debug('numberIsInRange : value = ' + newPropertyValue + ', min = ' + rangeMinimum + ', max = ' + rangeMaximum);
            return (newPropertyValue >= rangeMinimum && newPropertyValue <= rangeMaximum);
        };
        // We need a unique key for storing the property value
        const propertyValueStorageKey = Symbol();
        // We can return a property descriptor that is used to define a property on the target given the `propertyKey`.
        return {
            get() {
                // Read the value from the target instance using the unique symbol from above
                return this[propertyValueStorageKey];
            },
            set(newPropertyValue) {
                // Retrieve the config from storage
                if (Number.isNaN(newPropertyValue)) {
                    throw new Error(`Property value provided for ${key} is not a number: ${newPropertyValue}`);
                }
                if (!numberIsInRange(newPropertyValue)) {
                    throw new Error(`Property value provided for ${key} is not in the valid range: ${newPropertyValue}, config: ${config}`);
                }
                // Save this new value because it is valid
                this[propertyValueStorageKey] = newPropertyValue;
            }
        };
    };
}
exports.NumberRangeValidator = NumberRangeValidator;
function TextValidator(config) {
    return (target, propertyKey) => {
        logger.debug('@TextValidator args:', `target -> ${target.constructor.name},`, 'propertyKey ->', propertyKey);
        if (config.minimumLength === undefined) {
            config.minimumLength = 0;
        }
        if (config.maximumLength === undefined) {
            config.maximumLength = Number.MAX_SAFE_INTEGER;
        }
        if (config.allowLeadingSpaces === undefined) {
            config.allowLeadingSpaces = true;
        }
        if (config.allowTrailingSpaces === undefined) {
            config.allowTrailingSpaces = true;
        }
        if (config.characterSetRegularExpression === undefined) {
            config.characterSetRegularExpression = /[\s\S]*/;
        }
        // Create a key for storing the config for this instance using the target name and the propertyKey
        const key = target.constructor.name + '-' + propertyKey.toString();
        let map = objectSerializationMap.get(target);
        if (!map) {
            map = {};
            objectSerializationMap.set(target, map);
        }
        map[propertyKey] = propertyKey;
        // Store the config for this instance
        ALL_VALIDATOR_CONFIGS[key] = config;
        // Create the text validator using the config
        const textIsValid = (newPropertyValue) => {
            // Retrieve the config from storage
            const currentConfig = ALL_VALIDATOR_CONFIGS[key];
            if (currentConfig.allowLeadingSpaces === false && newPropertyValue.startsWith(' ')) {
                return false;
            }
            if (currentConfig.allowTrailingSpaces === false && newPropertyValue.endsWith(' ')) {
                return false;
            }
            if (currentConfig.minimumLength > 0 && newPropertyValue.length < currentConfig.minimumLength) {
                return false;
            }
            if (currentConfig.maximumLength > 0 && newPropertyValue.length > currentConfig.maximumLength) {
                return false;
            }
            if (currentConfig.characterSetRegularExpression.exec(newPropertyValue).length !== 1) {
                return false;
            }
            logger.debug(`textIsValid : value = '${newPropertyValue}', min = ${currentConfig.minimumLength}, max = ${currentConfig.maximumLength}, leadingSpaces = ${currentConfig.allowLeadingSpaces}, trailingSpaces = ${currentConfig.allowTrailingSpaces}, characterSetRegex = ${currentConfig.characterSetRegularExpression.source}`);
            return true;
        };
        // We need a unique key for storing the property value
        const propertyValueStorageKey = Symbol();
        // We can return a property descriptor that is used to define a property on the target given the `propertyKey`.
        return {
            get() {
                // Read the value from the target instance using the unique symbol from above
                return this[propertyValueStorageKey];
            },
            set(newPropertyValue) {
                // Retrieve the config from storage
                if (!textIsValid(newPropertyValue)) {
                    throw new Error(`Property value provided for ${key} is not valid text: ${newPropertyValue}, config: ${config}`);
                }
                // Save this new value because it is valid
                this[propertyValueStorageKey] = newPropertyValue;
            }
        };
    };
}
exports.TextValidator = TextValidator;
//# sourceMappingURL=property-validator.decorator.js.map