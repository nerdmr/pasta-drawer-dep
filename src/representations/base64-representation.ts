import { GenericRepresentation } from "../model/generic-representation.interface";
import { PastaType } from "../model/pasta-type.enum";
import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export class Base64Representation extends GenericRepresentation {
    name: string = 'Base64';
    private decodedValue: string;

    /**
     *
     */
    constructor() {
        super();
    }

    async canRender(data: ClipboardValue): Promise<boolean> {

        this.decodedValue = this.getDecodedValue(data);

        if (this.decodedValue) {
            return true;
        }

        return false;
    }

    async render(component: HTMLElement, data: ClipboardValue): Promise<void> {
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