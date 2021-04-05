
import { registry } from 'tsyringe';
import { ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { ShadowCssComponentBase } from '../../shadow-sass-base/shadow-sass.component.base';
import { ContentRepresentation } from '../content-representation';
import * as css from './image-text-representation.component.scss'

const elementName = 'CHANGE_ME_ELEMENT_NAME';

@registry([
    {
        token: 'ContentRepresentation',
        useFactory: (c) => {
            return new CHANGE_ME_Component(null!)
        },
    }
])
export class CHANGE_ME_Component extends ShadowCssComponentBase implements ContentRepresentation {
    name: string = 'NAME';  // Tab value
    element: string = elementName;

    constructor(public data: ClipboardValue) {
        super(css);
    }

    connectedCallback() {
        
    }
    
    async copy(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}

customElements.define(elementName, CHANGE_ME_Component);