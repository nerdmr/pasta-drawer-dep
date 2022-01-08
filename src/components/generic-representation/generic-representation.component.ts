import { container } from "tsyringe";
import { GenericRepresentation } from "../../model/generic-representation.interface";
// import { GenericRepresentation } from "../../model/generic-representation.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ContentRepresentation } from "../content-representation/content-representation";
import { ContentRepresentationBase } from "../content-representation/content-representation.component.base";


export class GenericRepresentationComponent extends ContentRepresentationBase implements ContentRepresentation {
    // public representationClass!: GenericRepresentation;

    get name(): string {
        return this.representationClass.name;
    }

    element: string = 'generic-representation';

    constructor(public data: ClipboardValue, public representationClass: GenericRepresentation, public newRepresentationInstance: () => GenericRepresentation = null) {
        super({ default: (representationClass).css(data) });
    }

    async connectedCallback() {

        this.loading = true;
        await this.representationClass.render(this.component, this.data);
        this.loading = false;
        
    }
    
    async copy(): Promise<string> {
        return this.representationClass.copy(this.data);
    }

    canRender(value: ClipboardValue): Promise<boolean> {
        return this.representationClass.canRender(value);
    }


}

customElements.define('generic-representation', GenericRepresentationComponent);