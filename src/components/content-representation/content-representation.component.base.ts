import { ClipboardItemType, ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../shadow-sass-base/shadow-sass.component.base";

export class ContentRepresentationBase extends ShadowCssComponentBase {
    

    // helper methods
    getRawTextValue(data: ClipboardValue): string {
        return data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data;
    }
    
}