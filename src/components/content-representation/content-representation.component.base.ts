import { ClipboardItemType, ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";
import { ShadowCssComponentBase } from "../shadow-sass-base/shadow-sass.component.base";
import * as baseCss from './content-representation.component.base.scss';

export class ContentRepresentationBase extends ShadowCssComponentBase {
    /**
     *
     */
    constructor(css: { default: string }) {
        super({
            default: (css.default !== undefined) ? css.default + baseCss.default : baseCss.default
        });
    }

    // helper methods
    getRawTextValue(data: ClipboardValue): string {
        return data.items.find((item) => item.type === ClipboardItemType.textPlain)?.data;
    }
    
}