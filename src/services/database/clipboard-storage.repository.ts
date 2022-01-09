import { singleton } from "tsyringe";
import { ClipboardDbItem } from "../../model/clipboard-db-item.interface";
import { DatabaseService } from "./database.service";


@singleton()
export class ClipboardStorageRepository extends DatabaseService<ClipboardDbItem> {

    /**
     *
     */
    constructor() {
        super('pasta-drawer', 'items');
    }

    protected createObjectStoreIndices(objectStore: IDBObjectStore) {
        // Define what data items the objectStore will contain
        objectStore.createIndex('drawer', 'drawer', { unique: false });
    }

    public override async read(id?: string): Promise<ClipboardDbItem[]> {
        return (await super.read(id)).reverse();
    }

}