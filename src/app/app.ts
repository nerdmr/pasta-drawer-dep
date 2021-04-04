import { container, singleton } from "tsyringe";
import { PastaDrawerComponent } from "../components/pasta-drawer-app/pasta-drawer.component";
import { AppPage } from "../model/app-page.interface";
import { ContentModuleConfiguration } from "../model/content-module-configuration.interface";
import { AppElementsService } from "../services/app-elements/app-elements.service";
import { ClipboardValueService } from "../services/clipboard-value/clipboard-value.service";
import { DatabaseService } from "../services/database/database.service";
import { ContentModuleConfigurationFactory } from "../services/content-module-factory/content-module.factory";
import { AppKeyboardListenerService } from "../services/app-keyboard-listener/app-keyboard-listener.service";

@singleton()
export class PastaDrawer {
    private activePage!: AppPage;
    private pages!: AppPage[];

    /**
     *
     */
    constructor(
        private contentModuleConfigurationFactory: ContentModuleConfigurationFactory,
        private appElementsService: AppElementsService,
        private databaseService: DatabaseService,
        private clipboardValueService: ClipboardValueService,
        private appKeyboardListenerService: AppKeyboardListenerService,
    ) {
        const appComponent: PastaDrawerComponent = new PastaDrawerComponent();
        document.body.appendChild(appComponent);

        this.appElementsService.initialize(appComponent);

        this.databaseService.loadPages().then((pages) => {
            this.pages = pages;
            if (!this.pages || this.pages.length === 0) {
                this.pages = [
                    {
                        name: 'My first page',
                        modules: []
                    }
                ];
            }
    
            this.activePage = this.pages[0];
            this.renderPage(this.activePage);
        });
        

        this.listenForPaste();
        this.listenForModuleEvents();

    }

    private listenForModuleEvents() {
        this.appElementsService.pastaDrawerComponent.addEventListener('delete', (ev: any) => {
            this.activePage.modules.splice(this.activePage.modules.indexOf(ev.detail.data), 1);
            this.databaseService.savePages(this.pages);
        });
    }

    private listenForPaste() {
        document.addEventListener('paste', async (event: ClipboardEvent) => {
            if (!event.clipboardData) {
                return;
            }
            
            const clipboardValue = await this.clipboardValueService.getClipboardValue(event.clipboardData);

            const contentModuleConfiguration = await this.contentModuleConfigurationFactory.create(clipboardValue);
        
            this.insertModule(contentModuleConfiguration, true);
        });
    }

    private initKeyboardShortcuts() {
        document.addEventListener('keydown', (ev: KeyboardEvent) => {

        });

        document.addEventListener('keyup', (ev: KeyboardEvent) => {
            // up/down always navigate content-module
        });
    }

    private insertModule(module: ContentModuleConfiguration, insertAtBeginning = false) {
        this.appElementsService.pastaDrawerComponent.addContentModule(module, insertAtBeginning)?.focus();
        
        this.activePage.modules.unshift(module);
        this.databaseService.savePages(this.pages);
    }

    private renderPage(page: AppPage) {
        for (let i = 0; i < page.modules.length; i++) {
            const module = page.modules[i];
            this.appElementsService.pastaDrawerComponent.addContentModule(module);
        }
    }
    
}

const appInstance = container.resolve(PastaDrawer);
