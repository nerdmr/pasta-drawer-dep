import { registry } from 'tsyringe';
import { ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { ShadowCssComponentBase } from '../../shadow-sass-base/shadow-sass.component.base';
import { ContentRepresentation } from '../content-representation';
import { ContentRepresentationBase } from '../content-representation.component.base';
import * as css from './webpage-representation.component.scss'

const elementName = 'webpage-representation';

@registry([
    {
        token: 'ContentRepresentation',
        useFactory: (c) => {
            return new WebpageRepresentationComponent(null!)
        },
    }
])
export class WebpageRepresentationComponent extends ContentRepresentationBase implements ContentRepresentation {
    name: string = 'Webpage';  // Tab value
    element: string = elementName;

    constructor(public data: ClipboardValue) {
        super(css);
    }

    connectedCallback() {
        // render it
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.component.innerHTML = `<p>Web link representation not yet enabled, but might be soone.</p>`;
        }, 3000);
    }

    async copy(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        const rawText = this.getRawTextValue(value);
        return this.isValidHttpUrl(rawText);
    }

    private isValidHttpUrl(potentialUrl: string): boolean {
        try {
            const url = new URL(potentialUrl);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (e) {
            return false;
        }
    }
}

customElements.define(elementName, WebpageRepresentationComponent);