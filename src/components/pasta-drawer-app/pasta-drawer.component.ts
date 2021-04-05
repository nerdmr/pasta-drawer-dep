import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentModuleComponent } from "../content-module/content-module.component";

import * as css from './pasta-drawer.component.scss';

export class PastaDrawerComponent extends HTMLElement {
    private modulesElement?: HTMLElement;
    private preRenderQueue: ClipboardValue[] = [];

    connectedCallback() {
        this.innerHTML = `<style>${css.default}</style>
        <header>
            <div class="logo"><img src="img/192.png"><h1>Pasta Drawer</h1></div>
            <textarea id="mobile-dropzone" class="dropzone"></textarea>
        </header><div class="pasta-drawer__modules"></div>`;
        this.modulesElement = this.querySelector('.pasta-drawer__modules') as HTMLElement;

        while (this.preRenderQueue.length > 0) {
            this.addContentModule(this.preRenderQueue.pop()!);
        }

        this.addEventListener('delete', (ev: any) => {
            const moduleComponents = this.querySelectorAll('content-module') as NodeListOf<ContentModuleComponent>;

            for (let i = 0; i < moduleComponents.length; i++) {
                const module = moduleComponents[i];
                if (module == ev.detail.element) {
                    module.parentNode?.removeChild(module);
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
        } else {
            this.modulesElement.appendChild(contentModuleComponent);
        }

        return contentModuleComponent;
    }
}

customElements.define('pasta-drawer', PastaDrawerComponent);