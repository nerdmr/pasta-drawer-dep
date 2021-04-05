import { ClipboardValue } from "../services/clipboard-value/clipboard-value.service";
import { ContentModuleConfiguration } from "./content-module-configuration.interface";

/**
 * Collection of modules
 */
export interface AppPage {
    id?: number;
    name: string;
    modules: ClipboardValue[];
}