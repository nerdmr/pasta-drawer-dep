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

export abstract class DatabaseService<T extends IHasId> {

    private  dbInitPromise: Promise<void>;
    private db!: IDBDatabase;

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
                let objectStore = db.createObjectStore(this.tableName, { keyPath: 'id', autoIncrement: true });
    
                // Define what data items the objectStore will contain
                this.createObjectStoreIndices(objectStore);
            };

        });
    }

    protected abstract createObjectStoreIndices(objectStore: IDBObjectStore);


    public async create(item: T): Promise<T> {

        await this.dbInitPromise;

        item.id = this.generateUUID();

        let transaction = this.db.transaction([this.tableName], 'readwrite');
        let objectStore = transaction.objectStore(this.tableName);

        let request = objectStore.add(item);
        request.onsuccess = () => { };

        try {
            await this.transaction(transaction);
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

        let transaction = this.db.transaction([this.tableName], 'readwrite');
        let objectStore = transaction.objectStore(this.tableName);

        let request = objectStore.put(item, item.id);
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

    private generateUUID(): string { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}