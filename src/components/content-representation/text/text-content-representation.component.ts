import { registry } from "tsyringe";
import { ClipboardItemType, ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
import { ContentRepresentationBase } from "../content-representation.component.base";
import * as css from './text-content-representation.component.scss';

const elementName = 'content-representation-raw';

@registry([
    {
        token: "ContentRepresentation",
        useFactory: (c) => {
            return new TextContentRepresentationComponent(null!)
        },
    }
])
export class TextContentRepresentationComponent extends ContentRepresentationBase implements ContentRepresentation {
    public name: string = 'Plain text';
    public element: string = elementName;

    /**
     *
     */
    constructor(public data: ClipboardValue) {
        super(css);
    }
    
    async copy(): Promise<string> {
        return this.data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data;
    }

    connectedCallback() {
        this.component.innerHTML = `<pre>${this.data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data}</pre>`;
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        if (value.type !== 'text') {
            return false;
        }
        
        return true;
    }
}

customElements.define(elementName, TextContentRepresentationComponent);