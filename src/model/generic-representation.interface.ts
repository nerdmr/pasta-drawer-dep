import { ClipboardItemKind, ClipboardItemType, ClipboardValue, ClipboardValueService } from "../services/clipboard-value/clipboard-value.service";

export interface GenericRepresentation {
    name: string;
    canRender(data: ClipboardValue): Promise<boolean>;
    render(component: HTMLElement, data: ClipboardValue): void;
    css(data: ClipboardValue): string;
    copy(data: ClipboardValue): Promise<string>;
}

export class GenericRepresentationBase {
    getValue(clipboardValue: ClipboardValue): string {
        const plainTextValue = clipboardValue.items.find(x => x.type === ClipboardItemType.textPlain);

        if (plainTextValue != null) {
            return (plainTextValue.data as string).trim();
        }

        const stringValue = clipboardValue.items.find(x => x.kind === ClipboardItemKind.string);

        if (stringValue) {
            return (stringValue.data as string).trim();
        }

        return null;
    }

    setHtml(component: HTMLElement, html: string) {
        component.innerHTML = `<pre>${html}</pre>`;
    }
}