import { registry } from 'tsyringe';
import { PastaType } from '../../../model/pasta-type.enum';
import { ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { ShadowCssComponentBase } from '../../shadow-sass-base/shadow-sass.component.base';
import { ContentRepresentation } from '../content-representation';
import { ContentRepresentationBase } from '../content-representation.component.base';
import * as css from './webpage-representation.component.scss';

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

    async connectedCallback() {
        // render it
        this.loading = true;


        // get html
        const url = this.getRawTextValue(this.data);
        const options: RequestInit = {
            method: 'GET'
        };

        try {
            const response = await fetch(url);
            const responseBody = await response.text();
            

        } catch (err) {
            console.log('err', err);
        }


        setTimeout(() => {
            this.loading = false;
            this.component.innerHTML = `<p>Web link representation not yet enabled, but might be soone.</p>`;
        }, 3000);
    }

    async copy(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        return value.pastaTypes.indexOf(PastaType.link) > -1;

        // const rawText = this.getRawTextValue(value);
        // return this.isValidHttpUrl(rawText);
    }
}

customElements.define(elementName, WebpageRepresentationComponent);