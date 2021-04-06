import { GenericRepresentation } from "../model/generic-representation.interface";
import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export class TestRepresentation implements GenericRepresentation {
    name: string = 'TeSt';

    async canRender(data: ClipboardValue): Promise<boolean> {
        return false;
    }
    render(component: HTMLElement, data: ClipboardValue): void {
        component.innerHTML = 'It worked!!!';
    }
    css(data: ClipboardValue): string {
        return '';
    }
    copy(data: ClipboardValue): string {
        return 'Yep, it did';
    }

}