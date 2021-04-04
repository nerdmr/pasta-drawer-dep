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

@singleton()
export class DatabaseService {
    private appPagesKey = 'pasta-drawer-pages';
    private dbInitPromise: Promise<void>;

    /**
     *
     */
    constructor() {
        this.dbInitPromise = new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.open(this.dbName, 1);

            // onerror handler signifies that the database didn't open successfully
            request.onerror = (error) => {
                // console.log('Database failed to open');
                reject(error);
            };
            
            // onsuccess handler signifies that the database opened successfully
            request.onsuccess = () => {
                // console.log('Database opened successfully');
            
                // Store the opened database object in the db variable. This is used a lot below
                this.db = request.result;
                resolve();
            };
    
            // Setup the database tables if this has not already been done
            request.onupgradeneeded = (e: IDBVersionChangeEvent | any) => {
                // Grab a reference to the opened database
                let db = e.target.result;
    
                // Create an objectStore to store our notes in (basically like a single table)
                // including a auto-incrementing key
                let objectStore = db.createObjectStore(this.tableName, { keyPath: 'id', autoIncrement: true });
    
                // Define what data items the objectStore will contain
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('modules', 'modules', { unique: false });
            };

        });
    }

    public async loadPages(): Promise<AppPage[]> {
        await this.dbInitPromise;

        return await this.getPages();
    }

    public async savePages(pages: AppPage[]): Promise<void> {
        const promises = [];
        for (let i = 0; i < pages.length; i++) {
            promises.push(this.savePage(pages[i]));
        }
        await Promise.all(promises);
    }

    private savePage(page: AppPage): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
    
            let item = await this.getPage(page.id);

            if (!item) {
                item = {
                    // id: page.id,
                    name: page.name,
                    modules: page.modules,
                };
            }

            item.modules = page.modules;

            let transaction = this.db.transaction([this.tableName], 'readwrite');
            let objectStore = transaction.objectStore(this.tableName);

            let request = objectStore.put(item);
            request.onsuccess = () => { };
    
            transaction.oncomplete = function () {
                resolve(true);
            };
    
            transaction.onerror = (error) => {
                reject(error);
            };
        });
    }

    private getPages(): Promise<AppPage[]> {
        return new Promise<AppPage[]>((resolve, reject) => {
    
            let objectStore = this.db.transaction(this.tableName).objectStore(this.tableName);
            let request = objectStore.getAll();
    
            request.onsuccess = () => {
                // If the result exists in the database (is not undefined)
                if (request.result) {
                    resolve(request.result);
                } else {
                    resolve([]);
                }
            };
            request.onerror = (error) => {
                reject(error);
            }
        });
    }

    private getPage(id?: number): Promise<AppPage|null> {
        return new Promise<AppPage|null>((resolve, reject) => {
            if (!id) {
                resolve(null);
                return;
            }

            let objectStore = this.db.transaction(this.tableName).objectStore(this.tableName);
            let request = objectStore.get(id);
    
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
        });
    }

    private dbName = 'pasta-drawer';
    private tableName = 'pages';
    private db!: IDBDatabase;

}