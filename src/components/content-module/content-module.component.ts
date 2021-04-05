import { container } from "tsyringe";
import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentRepresentation } from "../content-representation/content-representation";
import { ShadowCssComponentBase } from "../shadow-sass-base/shadow-sass.component.base";
import * as css from './content-module.component.scss';

export class ContentModuleComponent extends ShadowCssComponentBase {
    private contentRepresentations: ContentRepresentation[];

    /**
     *
     */
    constructor(private data: ClipboardValue) {
        super(css, false);

        this.contentRepresentations = container.resolveAll('ContentRepresentation');
    }

    connectedCallback() {
        this.render();
    }

    addTab() {

    }

    async render() {
        if (!this.data) {
            return;
        }

        const contentContainer = document.createElement('div');
        contentContainer.tabIndex = 0;
        contentContainer.className = 'content-module pre-render';
        contentContainer.innerHTML = `
        <div class="content-module__toolbar">
            <div class="content-module__tabs">
                
            </div>
            <div class="content-module__actions">
                
            </div>
        </div>
        <div class="content-module__content-representations">
            
        </div>`;

        this.initActions(contentContainer.querySelector('.content-module__actions')!);

        const tabs = contentContainer.querySelector('.content-module__tabs') as HTMLElement;
        const tabContainers = contentContainer.querySelector('.content-module__content-representations') as HTMLElement;

        // render applicable representations
        const eles: string[] = [];

        for (let i = 0; i < this.contentRepresentations.length; i++) {
            const contentRepresentation = this.contentRepresentations[i];
            if (await contentRepresentation.canRender(this.data)) {
                eles.push(contentRepresentation.element);
            }
        }
        
        for (let i = 0; i < eles.length; i++) {
            const type = eles[i];
            
            const btn = document.createElement('button');
            btn.className = 'content-module__tab';

            btn.addEventListener('click', (ev) => {
                this.component.querySelectorAll('.active').forEach((ele) => {
                    ele.classList.remove('active');
                });

                btn.classList.add('active');
                body.classList.add('active');
            });

            const body = document.createElement('div');
            body.className = 'content-module__content-representation';

            const contentRepresentation = this.getElementForType(type, this.data);
            btn.innerHTML = contentRepresentation.name;
            body.appendChild(contentRepresentation);
            tabs.appendChild(btn);

            if (i == 0) {
                btn.classList.add('active');
                body.classList.add('active');
            }

            tabContainers.appendChild(body);
        }

        setTimeout(() => {
            contentContainer.classList.remove('pre-render');
        }, 0);

        this.component.appendChild(contentContainer);
    }

    private initActions(actionsContainer: HTMLElement) {
        this.addAction(
            'delete',
            '<span class="material-icons">delete</span>',
            actionsContainer,
            (ev) => {
                // emit delete
                actionsContainer.dispatchEvent(new CustomEvent(
                    'delete',
                    {
                        detail: {
                            element: this,
                            data: this.data
                        },
                        bubbles: true,
                        composed: true
                    }));
            }
        );

        this.addAction(
            'copy',
            '<span class="material-icons">content_copy</span>',
            actionsContainer,
            async (ev) => {
                const activeRepresentation: ContentRepresentation = this.component.querySelector('.active .content-representation') as ContentRepresentation;
                const copyData = await activeRepresentation.copy();
                navigator.clipboard.writeText(copyData).then();
            }
        );
    }

    private addAction(eventName: string, eventHtml: string, container: HTMLElement, onclick: (ev: MouseEvent) => void) {
        const btn = document.createElement('button');
        btn.className = `content-module__action content-module__action--${eventName}`;
        btn.innerHTML = eventHtml;
        btn.addEventListener('click', onclick);
        container.prepend(btn);
    }

    private getElementForType(type: string, data: ClipboardValue): ContentRepresentation {
        const ele = document.createElement(type) as ContentRepresentation;
        ele.data = data;
        ele.classList.add('content-representation');
        return ele;
    }

}

customElements.define('content-module', ContentModuleComponent);