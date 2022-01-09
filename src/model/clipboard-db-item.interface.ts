import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";

export interface ClipboardDbItem {
    id?: string;
    // data: { values: ClipboardValue[] };
    data: ClipboardValue;
    drawer: 'junk';
}