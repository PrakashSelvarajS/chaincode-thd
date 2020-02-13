import { Context } from "fabric-contract-api";
export declare class DocumentIndex {
    Items: string[];
    DelayIndexUpdate: boolean;
    NeedsToBePersisted: boolean;
    constructor(init?: Partial<DocumentIndex>);
}
export declare abstract class CRUDRepository<T> {
    protected objectType: string;
    protected requirePDC: boolean;
    protected pdcResolver?: (ctx: Context) => Promise<string>;
    protected defaultRecordID: string;
    private TCreator;
    protected TContext: Context;
    private Index;
    private DelayIndexUpdate;
    constructor(tcreator: {
        new (init?: Partial<T>): T;
    }, ctx: Context, delayIndexUpdate?: boolean);
    abstract getStorageKeyForModel(currentModel: T): string;
    getStorageKey(recordID?: string): string;
    exists(recordID?: string): Promise<boolean>;
    existsWithStorageKey(storageKey: string): Promise<boolean>;
    create(modelToCreate: T): Promise<T>;
    update(modelToUpdate: T): Promise<T>;
    save(modelToCreateOrUpdate: T): Promise<T>;
    saveWithStorageKey(modelToCreateOrUpdate: T, storageKey: string): Promise<T>;
    get(recordID?: string): Promise<T | undefined>;
    getWithStorageKey(storageKey: string): Promise<T | undefined>;
    find(recordIDs?: string[]): Promise<T[]>;
    delete(recordID: string): Promise<boolean>;
    deleteMany(searchKey: string): Promise<number>;
}
