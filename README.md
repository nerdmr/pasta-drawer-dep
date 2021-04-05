

## Technology keywords

- TypeScript
- Rollup
- Web Components
- IndexedDB API
- Docker
- PWA

## Creating a new template



### Representation template

```
import { registry } from 'tsyringe';
import { ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { ContentRepresentation } from '../content-representation';
import { ContentRepresentationBase } from '../content-representation.component.base';
import * as css from './CHANGE_ME.component.scss';

const elementName = 'CHANGE_ME_ELEMENT_NAME';

@registry([
    {
        token: 'ContentRepresentation',
        useFactory: (c) => {
            return new CHANGE_ME_Component(null!)
        },
    }
])
export class CHANGE_ME_Component extends ContentRepresentationBase implements ContentRepresentation {
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
```

## What is this?

Pasta Drawer is a place to put text or images from your clipboard. Content that is pasted can be viewed natively (text/image) or through qualified representations. For example, if JSON is pasted to the page, you have an option to see pretty-printed JSON.

Mobile users can find a dropzone in the region to the right of the header. Long press to get the option to paste content.

You can always recover this help text by clicking the logo.

Happy pasting!
