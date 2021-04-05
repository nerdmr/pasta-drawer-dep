// import { injectAll, singleton } from 'tsyringe';
// import { ContentRepresentation } from '../../components/content-representation/content-representation';
// import { ContentModuleConfiguration } from '../../model/content-module-configuration.interface';
// import { ClipboardValue } from '../clipboard-value/clipboard-value.service';

// @singleton()
// export class ContentModuleConfigurationFactory {
//     /**
//      *
//      */
//     constructor(@injectAll('ContentRepresentation') private contentRepresentations: ContentRepresentation[]) {
        
//     }

//     async create(clipboardValue: ClipboardValue): Promise<ContentModuleConfiguration> {
//         // detect text type and create the module
//         const eles: string[] = [];

//         for (let i = 0; i < this.contentRepresentations.length; i++) {
//             const contentRepresentation = this.contentRepresentations[i];
//             if (await contentRepresentation.canRender(clipboardValue)) {
//                 eles.push(contentRepresentation.element);
//             }
//         }

//         // default to text for now
//         return {
//             elements: eles,
//             raw: clipboardValue.data
//         }
//     }
// }