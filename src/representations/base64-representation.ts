import { GenericRepresentation, GenericRepresentationBase } from "../model/generic-representation.interface";
import { PastaType } from "../model/pasta-type.enum";
import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export class Base64Representation extends GenericRepresentationBase implements GenericRepresentation {
    name: string = 'Base64';
    private decodedValue: string;

    /**
     *
     */
    constructor() {
        super();
    }

    async canRender(data: ClipboardValue): Promise<boolean> {

        if (data.pastaTypes.indexOf(PastaType.base64) !== -1)
            return true;

        this.decodedValue = this.getDecodedValue(data);

        if (this.decodedValue) {
            return true;
        }

        return false;
    }
    render(component: HTMLElement, data: ClipboardValue): void {
        if (!this.decodedValue) {
            this.decodedValue = this.getDecodedValue(data);
        }

        this.setHtml(component, this.decodedValue);
    }

    css(data: ClipboardValue): string {
        return '';
    }

    async copy(data: ClipboardValue): Promise<string> {
        return this.decodedValue;
    }

    private getDecodedValue(clipboardValue: ClipboardValue) {
        const textValue: string = this.getValue(clipboardValue);

        if (!textValue) {
            return null;
        }

        try {
            const decodeValue = atob(textValue);
            return decodeValue;
        } catch (error) { }

        return null;
    }

}