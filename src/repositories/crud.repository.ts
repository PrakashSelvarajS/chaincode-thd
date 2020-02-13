

import { Context } from "fabric-contract-api";
import { Iterators } from "fabric-shim";

const Logger = require('../logger');
const logger = Logger.getLogger('./repositories/crud.repository.ts');


export class DocumentIndex {
    public Items : string[] = [];
    public DelayIndexUpdate : boolean = false;
    public NeedsToBePersisted : boolean = false;
    constructor(init?:Partial<DocumentIndex>) {
        global.Object.assign(this, init);
    }
}



export abstract class CRUDRepository<T> {

    protected objectType: string = Object.getPrototypeOf(this).objectType;
    protected requirePDC: boolean = Object.getPrototypeOf(this).requirePDC;
    protected pdcResolver?: (ctx:Context)=>Promise<string> = Object.getPrototypeOf(this).pdcResolver;
    protected defaultRecordID: string = 'DEFAULT';
    
    private TCreator : { new (init?:Partial<T>) : T };
    protected TContext : Context;

    private Index : DocumentIndex | undefined;
    private DelayIndexUpdate : boolean = false;

    constructor(tcreator : { new (init?:Partial<T>) : T }, ctx : Context, delayIndexUpdate : boolean = false) { 
        this.TCreator = tcreator;
        this.TContext = ctx;
        this.DelayIndexUpdate = delayIndexUpdate;
    }




    public abstract getStorageKeyForModel(currentModel : T) : string;





    public getStorageKey(recordID : string = this.defaultRecordID) : string {
        return this.TContext.stub.createCompositeKey(this['objectType'], [recordID]);
    }

    public async exists(recordID: string = this.defaultRecordID) : Promise<boolean> {
        return await this.existsWithStorageKey(this.getStorageKey(recordID));
    }
    public async existsWithStorageKey(storageKey : string) : Promise<boolean> {        
        try {
            const currentRecord : T = await this.getWithStorageKey(storageKey);
            if (currentRecord === undefined) {
                logger.debug(`---CRUD-REPO : existsWithStorageKey => failed locating record`);
                return false;
            } else {
                logger.debug(`---CRUD-REPO : existsWithStorageKey => success locating record`);
                return true;
            }
        } catch (err) {                
            logger.debug(`---CRUD-REPO : existsWithStorageKey => error locating record`);                  
            logger.debug(`---CRUD-REPO : existsWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            return false;
        }
    }

    public async create(modelToCreate: T) : Promise<T> {
        // Get the storage key for the Model
        const storageKey : string = this.getStorageKeyForModel(modelToCreate);

        // Make sure the Model does not exist in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (exists) {
            throw new Error(`ERROR: create function in CRUDBaseContract failed.  A record already exists in the blockchain with storage key ${storageKey}`);
        }

        return await this.saveWithStorageKey(modelToCreate, storageKey);
    }

    public async update(modelToUpdate: T) : Promise<T> {
        // Get the storage key for the Model
        const storageKey : string = this.getStorageKeyForModel(modelToUpdate);

        // Make sure the Model exists in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (!exists) {
            throw new Error(`ERROR: update function in CRUDBaseContract failed.  No records exist in the blockchain with storage key ${storageKey}`);
        }

        return await this.saveWithStorageKey(modelToUpdate, storageKey);
    }

    public async save(modelToCreateOrUpdate: T) : Promise<T> {
        const storageKey : string = this.getStorageKeyForModel(modelToCreateOrUpdate);
        return await this.saveWithStorageKey(modelToCreateOrUpdate, storageKey);
    }
    public async saveWithStorageKey(modelToCreateOrUpdate: T, storageKey : string) : Promise<T> {
        // Serialize and store the provided Model
        const buffer = Buffer.from(JSON.stringify(modelToCreateOrUpdate));
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName : string = await this.pdcResolver(this.TContext);

            // Store the data in the PDC with the matching storageKey
            await this.TContext.stub.putPrivateData(pdcName, storageKey, buffer);
        } else {
            await this.TContext.stub.putState(storageKey, buffer);
        }

        // Return the stored Model
        return modelToCreateOrUpdate;
    }

    
    public async get(recordID: string = this.defaultRecordID) : Promise<T | undefined> {
        // Create the storage key
        logger.debug(`---CRUD-REPO : get => retrieving record: ${recordID}`);
        const storageKey : string = this.getStorageKey(recordID); 
        logger.debug(`---CRUD-REPO : get => storage key: ${storageKey}`);

        // Retrieve the Model from storage using the storage key
        try {
            const currentRecord : T = await this.getWithStorageKey(storageKey);
            logger.debug(`---CRUD-REPO : get => success retrieving record`);
            return currentRecord;
        } catch (err) {                
            logger.debug(`---CRUD-REPO : get => error retrieving record`);                  
            logger.debug(`---CRUD-REPO : get => ERROR: ${JSON.stringify(err)}`);
        }
    }
    public async getWithStorageKey(storageKey : string) : Promise<T | undefined> {    
        // Get a list of all record IDs in the index        
        logger.debug(`---CRUD-REPO : getWithStorageKey => retrieving a record with storage key: ${storageKey}`); 
    
        // Attempt to retrieve the Model from the blockchain 
        let buffer : Buffer; 
        logger.debug(`---CRUD-REPO : getWithStorageKey => record stored in PDC: ${this.requirePDC}`);
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName : string = await this.pdcResolver(this.TContext);
            logger.debug(`---CRUD-REPO : getWithStorageKey => PDC Name: ${pdcName}`);

            // Get the data in the PDC with the matching storageKey
            try {
                buffer = await this.TContext.stub.getPrivateData(pdcName, storageKey);
            } catch (err) {                
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to retrieve the record from the PDC`);                   
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }
        } else {
            try {
                buffer = await this.TContext.stub.getState(storageKey);
            } catch (err) {                
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to retrieve the record from the WorldState`);                   
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }
        }

        // If we did find something, then convert the value from the blockchain into a Model, otherwise return undefined
        if (!!buffer && buffer.length > 0) {
            logger.debug(`---CRUD-REPO : getWithStorageKey => Retrieved the record buffer: ${buffer.toString()}`);    
            
            // Convert the buffer retrieved from the blockchain into the Model
            let returnModel : T;
            try {
                returnModel = new this.TCreator(JSON.parse(buffer.toString()) as T);
            } catch (err) {
                logger.debug(`---CRUD-REPO : getWithStorageKey => Failed to convert the record from the retrieved buffer`);                   
                logger.debug(`---CRUD-REPO : getWithStorageKey => ERROR: ${JSON.stringify(err)}`);
            }

            logger.debug(`---CRUD-REPO : getWithStorageKey => Retrieved the Model successfully`);  
            return returnModel;
        } else {
            return;
        }
    }

    public async find(recordIDs: string[] = []) : Promise<T[]> { 
        let returnResult : T[] = [];
        
        // Attempt to retrieve the Model list from the blockchain 
        let iterator : Iterators.StateQueryIterator; 
        if (this.requirePDC) {
            // Get the PDC name
            const pdcName : string = await this.pdcResolver(this.TContext);

            // Search for the data in the PDC with a matching partial storage key    
            iterator = await this.TContext.stub.getPrivateDataByPartialCompositeKey(pdcName, this['objectType'], recordIDs);
            if (iterator['iterator'] !== undefined) { iterator = iterator['iterator']; }
        } else {
            iterator = await this.TContext.stub.getStateByPartialCompositeKey(this['objectType'], recordIDs);
        }

        // Collect all the results from the iterator
        while (true) {
            const nextResult : Iterators.NextResult = await iterator.next();
            if (nextResult.value) {
                // If we did find something, then convert the value from the blockchain into a Model, otherwise return undefined
                if (nextResult.value.value.length > 0) {
                    // Convert the buffer retrieved from the blockchain into the Model
                    const returnModel : T = new this.TCreator(JSON.parse(nextResult.value.value.toString('utf8')) as T);
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

    public async delete(recordID: string) : Promise<boolean> {
        // Get the storage key for the Model
        const storageKey : string = this.getStorageKey(recordID);

        // Make sure the Model exists in the blockchain
        const exists = await this.existsWithStorageKey(storageKey);
        if (!exists) {
            // The function succeeded, but we did not delete anything, so return false
            return false;
        } else {
            if (this.requirePDC) {
                // Get the PDC name
                const pdcName : string = await this.pdcResolver(this.TContext);

                // Delete the data in the PDC with the matching storageKey
                await this.TContext.stub.deletePrivateData(pdcName, storageKey);
            } else {
                await this.TContext.stub.deleteState(storageKey);
            }

            // The function succeeded, and we deleted something, so return true
            return true;
        }
    }

    public async deleteMany(searchKey: string) : Promise<number> {
        throw new Error('ERROR: deleteMany has not been implemented');
    }

    
}