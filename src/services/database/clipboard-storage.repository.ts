import { singleton } from "tsyringe";
import { ClipboardDbItem } from "../../model/clipboard-db-item.interface";
import { DatabaseService } from "./database.service";


@singleton()
export class ClipboardStorageRepository extends DatabaseService<ClipboardDbItem> {
    
    // protected dbName: string = 'pasta-drawer';
    // protected tableName: string = 'items';

    /**
     *
     */
    constructor() {
        super('pasta-drawer', 'items');
    }

    protected createObjectStoreIndices(objectStore: IDBObjectStore) {
        // Define what data items the objectStore will contain
        // objectStore.createIndex('data', 'data', { unique: false });
        objectStore.createIndex('drawer', 'drawer', { unique: false });
    }

    // public create(item: ClipboardDbItem) {

    // }

    public override async read(id?: string): Promise<ClipboardDbItem[]> {
        return (await super.read(id)).reverse();
    }

    // public update(item: ClipboardDbItem) {

    // }

    // public delete(id: string) {

    // }


}