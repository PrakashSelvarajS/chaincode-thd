"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require('../logger');
const logger = Logger.getLogger('./repositories/crud.repository.ts');
class DocumentIndex {
    constructor(init) {
        this.Items = [];
        this.DelayIndexUpdate = false;
        this.NeedsToBePersisted = false;
        global.Object.assign(this, init);
    }
}
exports.DocumentIndex = DocumentIndex;
class CRUDRepository {
    constructor(tcreator, ctx, delayIndexUpdate = false) {
        this.objectType = Object.getPrototypeOf(this).objectType;
        this.requirePDC = Object.getPrototypeOf(this).requirePDC;
        this.pdcResolver = Object.getPrototypeOf(this).pdcResolver;
        this.defaultRecordID = 'DEFAULT';
        this.DelayIndexUpdate = false;
        this.TCreator = tcreator;
        this.TContext = ctx;
        this.DelayIndexUpdate = delayIndexUpdate;
    }
    getStorageKey(recordID = this.defaultRecordID) {
        return this.TContext.stub.createCompositeKey(this['objectType'], [recordID]);
    }
    async exists(recordID = this.defaultRecordID) {
        return await this.existsWithStorageKey(this.getStorageKey(recordID));
    }
    async existsWithStorageKey(storageKey) {
        try {
            const currentRecord = await this.getWithStorageKey(storageKey);
            if (currentRecord === undefined) {
                logger.debug(`---CRUD-REPO : existsWithStorageKey => failed locating record`);
                return false;
            }
            else {
                logger.debug(`---CRUD-REPO : existsWithStorageKey => success locating record`);
                return true;
            }
        }
        catch (err) {
            logger.debug(`---CRUD-REPO : existsWithStorageKey => error locating record`);
            logger.debug(`---CRUD-REPO : existsWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            return false;
        }
    }
    async create(modelToCreate) {
        // Get the storage key for the Model
        const storageKey = this.getStorageKeyForModel(modelToCreate);
        // Make sure the Model does not exist in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (exists) {
            throw new Error(`ERROR: create function in CRUDBaseContract failed.  A record already exists in the blockchain with storage key ${storageKey}`);
        }
        return await this.saveWithStorageKey(modelToCreate, storageKey);
    }
    async update(modelToUpdate) {
        // Get the storage key for the Model
        const storageKey = this.getStorageKeyForModel(modelToUpdate);
        // Make sure the Model exists in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (!exists) {
            throw new Error(`ERROR: update function in CRUDBaseContract failed.  No records exist in the blockchain with storage key ${storageKey}`);
        }
        return await this.saveWithStorageKey(modelToUpdate, storageKey);
    }
    async save(modelToCreateOrUpdate) {
        const storageKey = this.getStorageKeyForModel(modelToCreateOrUpdate);
        return await this.saveWithStorageKey(modelToCreateOrUpdate, storageKey);
    }
    async saveWithStorageKey(modelToCreateOrUpdate, storageKey) {
        // Serialize and store the provided Model
        const buffer = Buffer.from(JSON.stringify(modelToCreateOrUpdate));
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName = await this.pdcResolver(this.TContext);
            // Store the data in the PDC with the matching storageKey
            await this.TContext.stub.putPrivateData(pdcName, storageKey, buffer);
        }
        else {
            await this.TContext.stub.putState(storageKey, buffer);
        }
        // Return the stored Model
        return modelToCreateOrUpdate;
    }
    async get(recordID = this.defaultRecordID) {
        // Create the storage key
        logger.debug(`---CRUD-REPO : get => retrieving record: ${recordID}`);
        const storageKey = this.getStorageKey(recordID);
        logger.debug(`---CRUD-REPO : get => storage key: ${storageKey}`);
        // Retrieve the Model from storage using the storage key
        try {
            const currentRecord = await this.getWithStorageKey(storageKey);
            logger.debug(`---CRUD-REPO : get => success retrieving record`);
            return currentRecord;
        }
        catch (err) {
            logger.debug(`---CRUD-REPO : get => error retrieving record`);
            logger.debug(`---CRUD-REPO : get => ERROR: ${JSON.stringify(err)}`);
        }
    }
    async getWithStorageKey(storageKey) {
        // Get a list of all record IDs in the index        
        logger.debug(`---CRUD-REPO : getWithStorageKey => retrieving a record with storage key: ${storageKey}`);
        // Attempt to retrieve the Model from the blockchain 
        let buffer;
        logger.debug(`---CRUD-REPO : getWithStorageKey => record stored in PDC: ${this.requirePDC}`);
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName = await this.pdcResolver(this.TContext);
            logger.debug(`---CRUD-REPO : getWithStorageKey => PDC Name: ${pdcName}`);
            // Get the data in the PDC with the matching storageKey
            try {
                buffer = await this.TContext.stub.getPrivateData(pdcName, storageKey);
            }
            catch (err) {
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to retrieve the record from the PDC`);
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }
        }
        else {
            try {
                buffer = await this.TContext.stub.getState(storageKey);
            }
            catch (err) {
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to retrieve the record from the WorldState`);
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }
        }
        // If we did find something, then convert the value from the blockchain into a Model, otherwise return undefined
        if (!!buffer && buffer.length > 0) {
            logger.debug(`---CRUD-REPO : getWithStorageKey => Retrieved the record buffer: ${buffer.toString()}`);
            // Convert the buffer retrieved from the blockchain into the Model
            let returnModel;
            try {
                returnModel = new this.TCreator(JSON.parse(buffer.toString()));
            }
            catch (err) {
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to convert the record from the retrieved buffer`);
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }
            logger.debug(`---CRUD-REPO : getWithStorageKey => Retrieved the Model successfully`);
            return returnModel;
        }
        else {
            return;
        }
    }
    async find(recordIDs = []) {
        let returnResult = [];
        // Attempt to retrieve the Model list from the blockchain 
        let iterator;
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName = await this.pdcResolver(this.TContext);
            // Search for the data in the PDC with a matching partial storage key    
            iterator = await this.TContext.stub.getPrivateDataByPartialCompositeKey(pdcName, this['objectType'], recordIDs);
            if (iterator['iterator'] !== undefined) {
                iterator = iterator['iterator'];
            }
        }
        else {
            iterator = await this.TContext.stub.getStateByPartialCompositeKey(this['objectType'], recordIDs);
        }
        // Collect all the results from the iterator
        while (true) {
            const nextResult = await iterator.next();
            if (nextResult.value) {
                // If we did find something, then convert the value from the blockchain into a Model, otherwise return undefined
                if (nextResult.value.value.length > 0) {
                    // Convert the buffer retrieved from the blockchain into the Model
                    const returnModel = new this.TCreator(JSON.parse(nextResult.value.value.toString('utf8')));
                    returnResult.push(returnModel);
                }
            }
            // check to see if we have reached then end
            if (nextResult.done) {
                // explicitly close the iterator            
                await iterator.close();
                break;
            }
        }
        return returnResult;
    }
    async delete(recordID) {
        // Get the storage key for the Model
        const storageKey = this.getStorageKey(recordID);
        // Make sure the Model exists in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (!exists) {
            // The function succeeded, but we did not delete anything, so return false
            return false;
        }
        else {
            if (this.requirePDC) {
                // Get the PDC name
                const pdcName = await this.pdcResolver(this.TContext);
                // Delete the data in the PDC with the matching storageKey
                await this.TContext.stub.deletePrivateData(pdcName, storageKey);
            }
            else {
                await this.TContext.stub.deleteState(storageKey);
            }
            // The function succeeded, and we deleted something, so return true
            return true;
        }
    }
    async deleteMany(searchKey) {
        throw new Error('ERROR: deleteMany has not been implemented');
    }
}
exports.CRUDRepository = CRUDRepository;
//# sourceMappingURL=crud.repository.js.map