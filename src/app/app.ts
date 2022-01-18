import { container, singleton } from "tsyringe";
import { PastaDrawerComponent } from "../components/pasta-drawer-app/pasta-drawer.component";
import { AppElementsService } from "../services/app-elements/app-elements.service";
import { ClipboardValue, ClipboardValueService } from "../services/clipboard-value/clipboard-value.service";
import { AppKeyboardListenerService } from "../services/app-keyboard-listener/app-keyboard-listener.service";
import * as helpTextJsonModule from '../json/help-text-module.json';
import { ClipboardStorageRepository } from "../services/database/clipboard-storage.repository";
import { ClipboardDbItem } from "../model/clipboard-db-item.interface";

@singleton()
export class PastaDrawer {
    // private activePage!: AppPage;
    // private pages!: AppPage[];

    private items: ClipboardDbItem[];

    /**
     *
     */
    constructor(
        private appElementsService: AppElementsService,
        private clipboardStorageRepository: ClipboardStorageRepository,
        private clipboardValueService: ClipboardValueService,
        private appKeyboardListenerService: AppKeyboardListenerService,
    ) {
        const appComponent: PastaDrawerComponent = new PastaDrawerComponent();
        document.body.appendChild(appComponent);

        this.appElementsService.initialize(appComponent);

        this.clipboardStorageRepository.read().then((items) => {
            this.items = items;
    
            // this.activePage = this.pages[0];
            this.renderPage(this.items);

            if (this.items.length === 0) {
                this.addHelpModule();
            }
        });

        this.listenForPaste();
        this.listenForModuleEvents();

        document.querySelector('.pasta-drawer__logo')?.addEventListener('click', (ev) => {
            this.addHelpModule();
        });
    }

    private addHelpModule() {
        const helpModule = helpTextJsonModule;
        this.insertModule(helpModule);
    }

    private listenForModuleEvents() {
        this.appElementsService.pastaDrawerComponent.addEventListener('delete', (ev: any) => {

            // find matching item in items
            const matchingItem = this.items.find(x => x.data === ev.detail.data);

            if (!matchingItem || !matchingItem.id) {
                throw new Error('Could not find matching element to delete: ' + JSON.stringify(ev.detail.data));
            }

            // delete the matching item
            this.clipboardStorageRepository.delete(matchingItem.id);
        });
    }

    private listenForPaste() {
        document.addEventListener('paste', async (event: ClipboardEvent) => {
            if (!event.clipboardData) {
                return;
            }
            
            const clipboardValue = await this.clipboardValueService.getClipboardValue(event.clipboardData);

            this.insertModule(clipboardValue, true);
        });
    }

    private async insertModule(module: ClipboardValue, insertAtBeginning = false) {
        
        const insertedModule = await this.clipboardStorageRepository.create({
            data: module,
            drawer: 'junk'
        });

        this.appElementsService.pastaDrawerComponent.addContentModule(insertedModule, insertAtBeginning);

        this.items.unshift(insertedModule);

        // this.activePage.modules.unshift(module);
        // this.databaseService.savePages(this.pages);
    }

    private renderPage(items: ClipboardDbItem[]) {
        for (let i = 0; i < items.length; i++) {
            const module = items[i];
            this.appElementsService.pastaDrawerComponent.addContentModule(module);
        }
    }
}

const appInstance = container.resolve(PastaDrawer);
