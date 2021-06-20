import { GenericRepresentation, GenericRepresentationBase } from "../model/generic-representation.interface";
import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export class TestRepresentation extends GenericRepresentationBase implements GenericRepresentation {
    name: string = 'Base64';
    private decodedValue: string;

    async canRender(data: ClipboardValue): Promise<boolean> {
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

    copy(data: ClipboardValue): string {
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