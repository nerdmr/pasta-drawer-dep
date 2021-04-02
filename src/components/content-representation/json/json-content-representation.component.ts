import { container, registry } from "tsyringe";
import { ContentModuleConfiguration } from "../../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
import * as css from './json-content-representation.component.scss'

const elementName = 'content-representation-json';

@registry([
    {
        token: "ContentRepresentation",
        useFactory: (c) => {
            return new JsonContentRepresentationComponent(null!)
        },
    }
])
export class JsonContentRepresentationComponent extends ShadowCssComponentBase implements ContentRepresentation {
    name: string = '🦋 Pretty';
    element: string = elementName;

    constructor(public configuration: ContentModuleConfiguration) {
        super(css);
    }

    async copy(): Promise<string> {
        throw new Error("Method not implemented.");
    }

    connectedCallback() {
        this.component.innerHTML = `<pre class="code">${JSON.stringify(JSON.parse(this.configuration.raw), null, 2)}</pre>`;
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        try {
            JSON.parse(value.data);
        } catch (e) {
            return false;
        }
        return true;
    }
}

customElements.define(elementName, JsonContentRepresentationComponent);