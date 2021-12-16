import { GenericRepresentation, GenericRepresentationBase } from "../model/generic-representation.interface";
import { PastaType } from "../model/pasta-type.enum";
import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export class Base64EncodeRepresentation extends GenericRepresentationBase implements GenericRepresentation {
    name: string = 'B64 Encode';
    private decodedValue: string;

    /**
     *
     */
    constructor() {
        super();
    }

    async canRender(data: ClipboardValue): Promise<boolean> {
        console.log('decode',this.getValue(data));
        return (this.getValue(data).length < 200);
    }
    render(component: HTMLElement, data: ClipboardValue): void {
        if (!this.decodedValue) {
            this.decodedValue = this.getEncodedValue(data);
        }

        this.setHtml(component, this.decodedValue);
    }

    css(data: ClipboardValue): string {
        return '';
    }

    async copy(data: ClipboardValue): Promise<string> {
        return this.decodedValue;
    }

    private getEncodedValue(clipboardValue: ClipboardValue) {
        const textValue: string = this.getValue(clipboardValue);

        if (!textValue) {
            return null;
        }

        try {
            const decodeValue = btoa(textValue);
            return decodeValue;
        } catch (error) { }

        return null;
    }

}