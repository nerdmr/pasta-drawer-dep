import { singleton } from "tsyringe";
import { ClipboardDbItem, ClipboardDrawer } from "../../model/clipboard-db-item.interface";
import { ClipboardStorageRepository } from "../database/clipboard-storage.repository";


@singleton()
export class ClipboardStorageService {
    /**
     *
     */
    constructor(private clipboardStorageRepository: ClipboardStorageRepository) {
        
    }

    putInDrawer(item: ClipboardDbItem, drawer: ClipboardDrawer) {
        item.drawer = drawer;
        this.clipboardStorageRepository.update(item);
    }
}