import { registry } from 'tsyringe';
import { ClipboardItemType, ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { ContentRepresentation } from '../content-representation';
import { ContentRepresentationBase } from '../content-representation.component.base';
import * as css from './html-clipboard-representation.component.scss';

/**
 * 1. Update css reference above
 * 2. Set element name
 * 3. Set component class name and the references to it
 * 4. Add to import list in index.ts
 * 5. Implement interfaces
 */

const elementName = 'html-clipboard-representation';

@registry([
    {
        token: 'ContentRepresentation',
        useFactory: (c) => {
            return new HtmlClipboardRepresentation(null!)
        },
    }
])
export class HtmlClipboardRepresentation extends ContentRepresentationBase implements ContentRepresentation {
    name: string = 'HTML';  // Tab value
    element: string = elementName;

    constructor(public data: ClipboardValue) {
        super(css);
    }

    connectedCallback() {
        this.component.innerHTML = this.data.items.find((item) => item.type === ClipboardItemType.textHtml)?.data;
    }
    
    async copy(): Promise<string> {
        return this.data.items.find((item) => item.type === ClipboardItemType.textHtml)?.data;
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        return value.items.find((item) => item.type === ClipboardItemType.textHtml) !== undefined;
    }
}

customElements.define(elementName, HtmlClipboardRepresentation);