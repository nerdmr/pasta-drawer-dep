import { ContentModuleConfiguration } from "./content-module-configuration.interface";

/**
 * Collection of modules
 */
export interface AppPage {
    id?: number;
    name: string;
    modules: ContentModuleConfiguration[];
}