import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ContentModuleComponent } from "../content-module/content-module.component";

import * as css from './pasta-drawer.component.scss';

export class PastaDrawerComponent extends HTMLElement {
    private modulesElement?: HTMLElement;
    private preRenderQueue: ContentModuleConfiguration[] = [];

    connectedCallback() {
        this.innerHTML = `<style>${css.default}</style><header><img src="img/192.png"><h1>Pasta Drawer</h1></header><div class="pasta-drawer__modules"></div>`;
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
    }

    addContentModule(configuration: ContentModuleConfiguration, insertAtBeginning = false): HTMLElement {
        const contentModuleComponent: ContentModuleComponent = new ContentModuleComponent(configuration);

        if (!this.modulesElement) {
            if (insertAtBeginning) {
                this.preRenderQueue.unshift(configuration);
            } else {
                this.preRenderQueue.push(configuration);
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