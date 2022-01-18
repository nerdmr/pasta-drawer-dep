import { container, registry } from "tsyringe";
import { ContentModuleConfiguration } from "../../../model/content-module-configuration.interface";
import { PastaType } from "../../../model/pasta-type.enum";
import { ClipboardItemKind, ClipboardItemType, ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBaseWithLoader } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
import { ContentRepresentationBase } from "../content-representation.component.base";
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
export class JsonContentRepresentationComponent extends ContentRepresentationBase implements ContentRepresentation {
    name: string = '🦋 Pretty';
    element: string = elementName;

    constructor(public data: ClipboardValue) {
        super(css);
    }

    async copy(): Promise<string> {
        return JSON.stringify(JSON.parse(this.data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data), null, 2);
    }

    connectedCallback() {
        const preElement = document.createElement('pre');
        preElement.className = 'code';
        preElement.innerText = JSON.stringify(JSON.parse(this.data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data), null, 2);
        
        this.component.appendChild(preElement);
    }

    async canRender(value: ClipboardValue): Promise<boolean> {


        // if (value.pastaTypes.indexOf(PastaType.json) !== -1)
        //     return true;

        // by letting it continue, we're letting it be backwards compatible
        if (value.type !== 'text') {
            return false;
        }

        const plainTextValue = value.items.find((item) => item.type === ClipboardItemType.textPlain);

        if (!plainTextValue) {
            return false;
        }

        try {
            JSON.parse(plainTextValue.data);
        } catch (e) {
            return false;
        }
        return true;
    }

    // public isJson(value: string): boolean {
    //     try {
    //         JSON.parse(value);
    //     } catch (e) {
    //         return false;
    //     }
    //     return true;
    // }
}

customElements.define(elementName, JsonContentRepresentationComponent);