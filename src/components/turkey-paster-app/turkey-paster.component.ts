import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ContentModuleComponent } from "../content-module/content-module.component";

import * as css from './turkey-paster.component.scss';

export class TurkeyPasterComponent extends HTMLElement {
    private modulesElement?: HTMLElement;
    private preRenderQueue: ContentModuleConfiguration[] = [];

    connectedCallback() {
        this.innerHTML = `<style>${css.default}</style><h1>Pasta Droorwer 🍝</h1><div class="turkey-paster__modules"></div>`;
        this.modulesElement = this.querySelector('.turkey-paster__modules') as HTMLElement;

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

    addContentModule(configuration: ContentModuleConfiguration, insertAtBeginning = false) {
        const contentModuleComponent: ContentModuleComponent = new ContentModuleComponent(configuration);

        if (!this.modulesElement) {
            if (insertAtBeginning) {
                this.preRenderQueue.unshift(configuration);
            } else {
                this.preRenderQueue.push(configuration);
            }
            
            return;
        }

        if (insertAtBeginning) {
            this.modulesElement.prepend(contentModuleComponent);
        } else {
            this.modulesElement.appendChild(contentModuleComponent);
        }
    }
}

customElements.define('turkey-paster', TurkeyPasterComponent);