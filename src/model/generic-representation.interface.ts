import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export interface GenericRepresentation {
    name: string;
    canRender(data: ClipboardValue): Promise<boolean>;
    render(component: HTMLElement, data: ClipboardValue): void;
    css(data: ClipboardValue): string;
    copy(data: ClipboardValue): string;
}