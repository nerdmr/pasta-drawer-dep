import { ContentModuleConfiguration } from "../../model/content-module-configuration.interface";
import { ClipboardValue } from "../../services/clipboard-value/clipboard-value.service";


export interface ContentRepresentation extends HTMLElement {
    name: string;
    element: string;
    configuration: ContentModuleConfiguration;
    canRender(value: ClipboardValue): Promise<boolean>;
    copy(): Promise<string>;
}