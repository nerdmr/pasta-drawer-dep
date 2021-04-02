import { container, registry } from "tsyringe";
import { ContentModuleConfiguration } from "../../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
import * as css from './image-content-representation.component.scss'

const elementName = 'content-representation-image';

@registry([
    {
        token: "ContentRepresentation",
        useFactory: (c) => {
            return new ImageContentRepresentationComponent(null!)
        },
    }
])
export class ImageContentRepresentationComponent extends ShadowCssComponentBase implements ContentRepresentation {
    name: string = '📷 Image';
    element: string = elementName;

    constructor(public configuration: ContentModuleConfiguration) {
        super(css);
    }

    connectedCallback() {
        const imageData = this.getBase64DataFromBlob(this.configuration.raw as any).then((value) => {
            this.component.innerHTML = `<img src="${value}">`;
        });
    }
    
    async copy(): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        if (value.type == 'image') {
            return true;
        }

        return false;
    }

    private getBase64DataFromBlob(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            
            var reader = new FileReader();
            reader.onload = function (event: any) {
                resolve(event.target.result);
            };

            reader.readAsDataURL(blob as Blob);
        });
    }

    private getArrayBufferFromBlob(blob: Blob): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            
            var reader = new FileReader();
            reader.onload = function (event: any) {
                resolve(event.target.result as ArrayBuffer);
            };

            reader.readAsArrayBuffer(blob as Blob);
        });
    }
}

customElements.define(elementName, ImageContentRepresentationComponent);