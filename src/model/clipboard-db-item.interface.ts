import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";
import { IHasAudit, IHasId } from "../services/database/database.service";

export interface ClipboardDbItem extends IHasId, IHasAudit {
    data: ClipboardValue;
    drawer: 'junk';
}