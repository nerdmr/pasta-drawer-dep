import { ClipboardItemKind, ClipboardItemType, ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export abstract class GenericRepresentation {
    abstract name: string;
    abstract canRender(data: ClipboardValue): Promise<boolean>;
    abstract render(component: HTMLElement, data: ClipboardValue): Promise<void>;
    abstract css(data: ClipboardValue): string;
    abstract copy(data: ClipboardValue): Promise<string>;

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