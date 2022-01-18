import { container } from "tsyringe";
import { PastaDrawer } from "../../app/app";
import { ClipboardDbItem } from "../../model/clipboard-db-item.interface";
import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentModuleComponent } from "../content-module/content-module.component";
import { DrawerNavItemComponent } from "../drawer-nav-item/drawer-nav-item.component";

import * as css from './pasta-drawer.component.scss';

interface ContentModuleElements {
    component: HTMLElement;
    contentModuleElement: HTMLElement;
}

export class PastaDrawerComponent extends HTMLElement {
    private modulesElement?: HTMLElement;
    // private preRenderQueue: ClipboardValue[] = [];
    private preRenderQueue: ClipboardDbItem[] = [];
    private contentModuleElements: ContentModuleElements[] = [];

    private loadedHandler!: () => void;

    connectedCallback() {
        this.innerHTML = `
        <style>${css.default}</style>
        <div class="pasta-drawer">
            <header class="pasta-drawer__header">
                <div class="pasta-drawer__logo">
                    <img src="img/192.png"><h1>Pasta Drawer</h1>
                </div>
                <textarea id="mobile-dropzone" class="pasta-drawer__dropzone"></textarea>
            </header>
            <div class="flex flex-row">
                <div class="pasta-drawer__modules flex-1">

                </div>
                <div class="pasta-drawer__sidenav flex-none ml-16">
                    ${[1].map(() => `
                        <drawer-nav-item drawer="test"></drawer-nav-item>
                    `)}
                </div>
            </div>
        </div>
        `;

        setTimeout(() => {
            [...this.querySelectorAll('drawer-nav-item')].map((drawerNavItem) => this.dragDropInitTarget(drawerNavItem as HTMLElement));
        }, 0);

        

        this.modulesElement = this.querySelector('.pasta-drawer__modules') as HTMLElement;

        while (this.preRenderQueue.length > 0) {
            this.addContentModule(this.preRenderQueue.pop()!);
        }

        this.addEventListener('delete', (ev: any) => {
            // const moduleComponents = this.querySelectorAll('content-module') as NodeListOf<ContentModuleComponent>;

            for (let i = 0; i < this.contentModuleElements.length; i++) {
                const module = this.contentModuleElements[i];
                if (module.component == ev.detail.element) {
                    this.selectNextContentModule();
                    module.component.parentNode?.removeChild(module.component);
                    this.contentModuleElements.splice(i, 1);
                    break;
                }
            }
        });

        // wire up the mobile dropzone
        const mobileDropzone = this.querySelector('#mobile-dropzone') as HTMLTextAreaElement;
        mobileDropzone.addEventListener('paste', (e) => {
            setTimeout(() => {
                mobileDropzone.value = '';
            }, 0);
        });

        this.loadedHandler = () => {
            this.selectContentModuleIndex(0);
        };
    }

    addContentModule(item: ClipboardDbItem, insertAtBeginning = false): HTMLElement {
        const contentModuleComponent: ContentModuleComponent = container.resolve(ContentModuleComponent);
        contentModuleComponent.data = item;

        if (!this.modulesElement) {
            if (insertAtBeginning) {
                this.preRenderQueue.unshift(item);
            } else {
                this.preRenderQueue.push(item);
            }
            
            return contentModuleComponent;
        }

        if (insertAtBeginning) {
            this.modulesElement.prepend(contentModuleComponent);
            setTimeout(() => {
                this.contentModuleElements.unshift({
                    component: contentModuleComponent,
                    contentModuleElement: contentModuleComponent.querySelector('.content-module')!
                });

                if (this.modulesElement?.childElementCount === this.contentModuleElements.length) {
                    this.loadedHandler();
                }
            }, 0);
        } else {
            this.modulesElement.appendChild(contentModuleComponent);
            setTimeout(() => {
                this.contentModuleElements.push({
                    component: contentModuleComponent,
                    contentModuleElement: contentModuleComponent.querySelector('.content-module')!
                });

                if (this.modulesElement?.childElementCount === this.contentModuleElements.length) {
                    this.loadedHandler();
                }
            }, 0);
        }

        this.dragDropInitSource(contentModuleComponent);

        return contentModuleComponent;
    }

    private dragDropInitSource(source: HTMLElement) {
        // support drag and drop
        source.draggable = true;
        source.ondragstart = (ev: DragEvent) => {
            console.log('drag start');

            // drag data
            ev.dataTransfer.setData("text/plain", JSON.stringify({ id: 123 }));

            // drag image
            let img = new Image();
            // img.src = `data:image/png;base64,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`;
            img.src = 'data:image/png;base64,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';
            ev.dataTransfer.setDragImage(img, 0, 0);

            // drop effect
            ev.dataTransfer.dropEffect = 'move';
        };
    }

    private dragDropInitTarget(target: HTMLElement) {
        
        target.ondragover = (ev: DragEvent) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'move';
        }

        target.ondragenter = () => {
            (target as DrawerNavItemComponent).active = true;
        }

        target.ondragleave = () => {
            (target as DrawerNavItemComponent).active = false;
        }

        target.ondragend = () => {
            (target as DrawerNavItemComponent).active = false;
        }
        
        target.ondrop = (ev: DragEvent) => {
            ev.preventDefault();
            // Get the id of the target and add the moved element to the target's DOM
            const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
            console.log('dropping data', data);
        }
    }

    private selectContentModuleIndex(contentModuleIndex: number) {
        if (!this.contentModuleElements || this.contentModuleElements.length === 0) {
            return;
        }

        this.contentModuleElements[0].contentModuleElement.focus();
    }

    public selectNextContentModule() {
        const currentActiveModule = this.contentModuleElements.find(item => item.contentModuleElement === this.ownerDocument.activeElement);
        if (currentActiveModule != null) {
            // let's choose the next one
            const selectedIndex = this.contentModuleElements.indexOf(currentActiveModule);
            this.contentModuleElements[(selectedIndex === this.contentModuleElements.length - 1) ? 0 : selectedIndex + 1].contentModuleElement.focus();
            return;
        }

        this.selectClosestContentModule(0);
    }

    public selectPreviousContentModule() {
        const currentActiveModule = this.contentModuleElements.find(item => item.contentModuleElement === this.ownerDocument.activeElement);
        if (currentActiveModule != null) {
            // let's choose the next one
            const selectedIndex = this.contentModuleElements.indexOf(currentActiveModule);
            this.contentModuleElements[(selectedIndex === 0) ? this.contentModuleElements.length - 1 : selectedIndex - 1].contentModuleElement.focus();
            return;
        }

        this.selectClosestContentModule(this.contentModuleElements.length - 1);
    }

    public selectClosestContentModule(indexOnFail: number) {
        const matchingParent: HTMLElement|null = this.findParentMatchingSelector('.content-module', this.ownerDocument.activeElement!) as HTMLElement|null;
        if (matchingParent) {
            matchingParent.focus();
        } else {
            this.contentModuleElements[indexOnFail].contentModuleElement.focus();
        }
    }

    public getActiveContentModule(modulesDocument: Document): ContentModuleComponent|null {
        if (
            !modulesDocument.activeElement ||
            !modulesDocument.activeElement.classList.contains('content-module')
        ) {
            return null;
        }

        return this.findParentMatchingSelector('content-module', modulesDocument.activeElement!) as ContentModuleComponent;
    }

    private findParentMatchingSelector(selector: string, relativeElement: Element, matchingElements?: Element[]): Element|null {
        const modulesDocument: Document = relativeElement.ownerDocument;

        if (!matchingElements) {
            matchingElements = this.getArray(modulesDocument.querySelectorAll(selector));
        }

        const matchingElementIndex = matchingElements.indexOf(relativeElement);
        if (matchingElementIndex !== -1) {
            return matchingElements[matchingElementIndex];
        } else if (!relativeElement.parentElement) {
            return null;
        } else {
            return this.findParentMatchingSelector(selector, relativeElement.parentElement, matchingElements);
        }
    }

    private getArray(nodeList: NodeListOf<any>) {
        const arr = [];
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            arr.push(node);
        }
        return arr;
    }
}

customElements.define('pasta-drawer', PastaDrawerComponent);