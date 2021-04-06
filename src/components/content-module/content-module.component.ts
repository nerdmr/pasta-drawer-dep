import { container } from "tsyringe";
import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { GenericRepresentation } from "../../model/generic-representation.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentRepresentation } from "../content-representation/content-representation";
import { GenericRepresentationComponent } from "../generic-representation/generic-representation.component";
import { ShadowCssComponentBase } from "../shadow-sass-base/shadow-sass.component.base";
import * as css from './content-module.component.scss';

interface Represenation {
    button: HTMLElement;
    body: HTMLElement;
    representationElement: ContentRepresentation;
}

export class ContentModuleComponent extends ShadowCssComponentBase {
    private contentRepresentationComponents: ContentRepresentation[];
    private contentRepresentations: Represenation[] = [];
    private activeRepresentationIndex: number = -1;

    /**
     *
     */
    constructor(private data: ClipboardValue) {
        super(css, false);

        this.contentRepresentationComponents = container.resolveAll('ContentRepresentation');
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

        for (let i = 0; i < this.contentRepresentationComponents.length; i++) {
            const contentRepresentationComponent = this.contentRepresentationComponents[i];
            if (await contentRepresentationComponent.canRender(this.data)) {
                
                const type = contentRepresentationComponent.element;
                
                const btn = document.createElement('button');
                btn.className = 'content-module__tab';

                const body = document.createElement('div');
                body.className = 'content-module__content-representation';

                let representationElement: ContentRepresentation;
                if (type === 'generic-representation') {
                    const genericComponent = contentRepresentationComponent as GenericRepresentationComponent;
                    representationElement = new GenericRepresentationComponent(this.data, genericComponent.representationClass);
                } else {
                    representationElement = this.getElementForType(type, this.data);
                }
                
                btn.innerHTML = representationElement.name;
                body.appendChild(representationElement);
                tabs.appendChild(btn);

                tabContainers.appendChild(body);

                const contentRepresentation: Represenation = {
                    button: btn,
                    body: body,
                    representationElement: representationElement,
                };

                this.contentRepresentations.push(contentRepresentation);

                btn.addEventListener('click', (ev) => {
                    this.selectRepresenation(contentRepresentation);
                });
            }
        };

        // Select first representation
        this.selectRepresenation(this.contentRepresentations[0]);
            

        setTimeout(() => {
            contentContainer.classList.remove('pre-render');
        }, 0);

        this.component.appendChild(contentContainer);
    }

    public delete() {
        // emit delete
        this.component.dispatchEvent(new CustomEvent(
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

    public async copy() {
        const activeRepresentation: ContentRepresentation = this.component.querySelector('.active .content-representation') as ContentRepresentation;
        const copyData = await activeRepresentation.copy();
        navigator.clipboard.writeText(copyData).then();

        // flash copy graphic
        activeRepresentation.classList.add('copy-overlay');
        setTimeout(() => {
            activeRepresentation.classList.add('show');

            setTimeout(() => {
                activeRepresentation.classList.remove('show');

                setTimeout(() => {
                    activeRepresentation.classList.remove('copy-overlay');
                }, 150);

            }, 150); // transition duration in css
        }, 0);
    }

    public selectNextRepresentation() {
        this.selectRepresenationIndex((this.activeRepresentationIndex === this.contentRepresentations.length - 1) ? 0 : this.activeRepresentationIndex + 1);
    }

    public selectPreviousRepresentation() {
        this.selectRepresenationIndex((this.activeRepresentationIndex === 0) ? this.contentRepresentations.length - 1 : this.activeRepresentationIndex - 1);
    }

    private selectRepresenation(representation: Represenation) {
        this.component.querySelectorAll('.active').forEach((ele) => {
            ele.classList.remove('active');
        });

        representation.button.classList.add('active');
        representation.body.classList.add('active');

        this.activeRepresentationIndex = this.contentRepresentations.indexOf(representation);
    }

    private selectRepresenationIndex(representationIndex: number) {
        this.selectRepresenation(this.contentRepresentations[representationIndex]);
    }

    private initActions(actionsContainer: HTMLElement) {
        this.addAction(
            'delete',
            '<span class="material-icons">delete</span>',
            actionsContainer,
            (ev) => {
                this.delete();
            }
        );

        this.addAction(
            'copy',
            '<span class="material-icons">content_copy</span>',
            actionsContainer,
            async (ev) => {
                this.copy()
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