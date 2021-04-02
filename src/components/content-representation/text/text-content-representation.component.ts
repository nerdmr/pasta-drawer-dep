import { registry } from "tsyringe";
import { ContentModuleConfiguration } from "../../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
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
export class TextContentRepresentationComponent extends ShadowCssComponentBase implements ContentRepresentation {
    public name: string = 'Raw';
    public element: string = elementName;

    /**
     *
     */
    constructor(public configuration: ContentModuleConfiguration) {
        super(css);
    }
    
    async copy(): Promise<string> {
        return this.configuration.raw;
    }

    connectedCallback() {
        this.component.innerHTML = `<pre>${this.configuration.raw}</pre>`;
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        if (value.type !== 'text') {
            return false;
        }
        
        return true;
    }
}

customElements.define(elementName, TextContentRepresentationComponent);