import { singleton } from "tsyringe";
import { AppPage } from "../../model/app-page.interface";

interface PageDbItem {
    id?: number;
    name: string;
    modules: any;
}

export interface DbResult {
    success: boolean;
    errors?: any[];
    data?: any;
}

export interface IHasId {
    id?: string;
}

export interface IHasAudit {
    created?: Date;
    modified?: Date;
}

export abstract class DatabaseService<T extends IHasId & IHasAudit> {

    private  dbInitPromise: Promise<void>;
    private db!: IDBDatabase;

    private key: string = 'id';

    // private dbName: string;
    // private tableName: string;

    /**
     *
     */
    constructor(private dbName: string, private tableName: string) {
        this.dbInitPromise = new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.open(this.dbName, 1);

            // onerror handler signifies that the database didn't open successfully
            request.onerror = (error) => {
                reject(error);
            };
            
            // onsuccess handler signifies that the database opened successfully
            request.onsuccess = () => {
                // Store the opened database object in the db variable. This is used a lot below
                this.db = request.result;
                resolve();
            };
    
            // Setup the database tables if this has not already been done
            request.onupgradeneeded = (e: IDBVersionChangeEvent | any) => {
                // Grab a reference to the opened database
                let db = e.target.result as IDBDatabase;
    
                // Create an objectStore to store our notes in (basically like a single table)
                // including a auto-incrementing key
                let objectStore = db.createObjectStore(this.tableName, { keyPath: this.key, autoIncrement: true });
    
                // Define what data items the objectStore will contain
                this.createObjectStoreIndices(objectStore);
            };

        });
    }

    protected abstract createObjectStoreIndices(objectStore: IDBObjectStore);


    public async create(item: T): Promise<T> {

        await this.dbInitPromise;

        item.created = new Date();
        item.modified = new Date();

        let transaction = this.db.transaction([this.tableName], 'readwrite');
        let objectStore = transaction.objectStore(this.tableName);

        let request = objectStore.add(item);
        request.onsuccess = () => { };

        try {
            await this.transaction(transaction);
            item.id = request.result.toString();
            return item;
        } catch (error) {
            throw error;
        }

    }

    private transaction(transaction: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve();
            };
    
            transaction.onerror = (error) => {
                reject(error);
            };
        });
    }

    private request<TRequest>(request: IDBRequest<TRequest>): Promise<TRequest> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                // If the result exists in the database (is not undefined)
                if (request.result) {
                    resolve(request.result);
                } else {
                    // Fetch the videos from the network
                    resolve(null);
                }
            };
            request.onerror = (error) => {
                reject(error);
            }
        })
    }

    public async read(id?: string): Promise<T[]> {

        await this.dbInitPromise;

        let objectStore = this.db.transaction(this.tableName).objectStore(this.tableName);

        try {
            if (!id) {
                // get all
                let request: IDBRequest<T[]> = objectStore.getAll();
                const result = await this.request(request);
                return result;
            } else {
                let request: IDBRequest<T> = objectStore.get(id);
                const result = await this.request(request);
                return [result];
            }    
        } catch (error) {
            throw error;
        }
    }

    public async update(item: T): Promise<T> {
        
        await this.dbInitPromise;

        item.modified = new Date();

        let transaction = this.db.transaction([this.tableName], 'readwrite');
        let objectStore = transaction.objectStore(this.tableName);

        let request = objectStore.put(item);
        // objectStore.put()
        request.onsuccess = () => { };

        try {
            await this.transaction(transaction);
            return item;
        } catch (error) {
            throw error;
        }
    }

    public delete(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let transaction = this.db.transaction([this.tableName], 'readwrite');
            let objectStore = transaction.objectStore(this.tableName);

            let request = objectStore.delete(id);
            
            request.onsuccess = () => { };
    
            transaction.oncomplete = function () {
                resolve(true);
            };
    
            transaction.onerror = (error) => {
                reject(error);
            };
        });
    }
}