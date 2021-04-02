import { container, registry } from "tsyringe";
import { ContentModuleConfiguration } from "../../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../../shadow-sass-base/shadow-sass.component.base";
import { ContentRepresentation } from "../content-representation";
import * as css from './image-text-representation.component.scss'

const elementName = 'content-representation-image-text';

@registry([
    {
        token: "ContentRepresentation",
        useFactory: (c) => {
            return new ImageTextRepresentationComponent(null!)
        },
    }
])
export class ImageTextRepresentationComponent extends ShadowCssComponentBase implements ContentRepresentation {
    name: string = '🔤 Image Text';
    element: string = elementName;

    private ocrText = '';

    constructor(public configuration: ContentModuleConfiguration) {
        super(css);
    }

    connectedCallback() {
        this.getArrayBufferFromBlob(this.configuration.raw as any).then(async (value) => {
            this.ocrText = await this.ocr(value);
            this.component.innerHTML = `<pre>${this.htmlEncode(this.ocrText)}</pre>`;
        });
    }
    
    async copy(): Promise<string> {
        return this.ocrText;
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        if (value.type == 'image') {
            return true;
        }

        return false;
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

    private ocr(data: any): Promise<string> {
        
        return new Promise<string>((resolve, reject) => {
            const formData  = new FormData();

            formData.append('image', new Blob([data]));
          
            const url = 'http://localhost:5000';
            const options: RequestInit = {
                method: 'POST',
                body: formData
            };
    
            fetch(url, options)
                .then(async response => {
                    const text = (await response.json()).text;
                    resolve(text);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

customElements.define(elementName, ImageTextRepresentationComponent);