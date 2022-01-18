import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";
import { IHasAudit, IHasId } from "../services/database/database.service";

export enum ClipboardDrawer {
    junk = 'junk',
    links = 'links',
}

export interface ClipboardDbItem extends IHasId, IHasAudit {
    data: ClipboardValue;
    drawer: 'junk' | 'links';
}