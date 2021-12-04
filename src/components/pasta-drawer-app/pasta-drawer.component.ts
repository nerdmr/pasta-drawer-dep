import { container } from "tsyringe";
import { PastaDrawer } from "../../app/app";
import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentModuleComponent } from "../content-module/content-module.component";

import * as css from './pasta-drawer.component.scss';

interface ContentModuleElements {
    component: HTMLElement;
    contentModuleElement: HTMLElement;
}

export class PastaDrawerComponent extends HTMLElement {
    private modulesElement?: HTMLElement;
    private preRenderQueue: ClipboardValue[] = [];
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
            <div class="pasta-drawer__modules"></div>
        </div>
        `;
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

    addContentModule(item: ClipboardValue, insertAtBeginning = false): HTMLElement {
        const contentModuleComponent: ContentModuleComponent = new ContentModuleComponent(item);

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

        return contentModuleComponent;
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