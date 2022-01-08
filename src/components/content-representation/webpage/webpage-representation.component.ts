import { GenericRepresentation } from '../../../model/generic-representation.interface';
import { ClipboardValue } from '../../../services/clipboard-value/clipboard-value.service';
import { LinkPreviewService } from '../../../services/link-preview/link-preview.service';
import * as css from './webpage-representation.component.scss';

const elementName = 'webpage-representation';



export class WebpageRepresentationComponent extends GenericRepresentation {
    name: string = 'Webpage';  // Tab value
    element: string = elementName;

    constructor(private linkPreviewService: LinkPreviewService) {
        super();
    }

    async render(component: HTMLElement, data: ClipboardValue): Promise<void> {
        try {
            const link = this.getValue(data);
            const linkPreview = await this.linkPreviewService.get(link);

            component.innerHTML = `
                <div class="webpage-preview">
                    <h3 class="webpage-preview__title">${linkPreview.description}</h3>
                    <p class="webpage-preview__description">${linkPreview.description}</p>
                    ${ (linkPreview.images?.length) ? `
                    <img src="${linkPreview.images[0]}"/>
                    ` : `` }                    
                </div>
            `;

        } catch (err) {
            console.log('err', err);
        }
    };

    css(data: ClipboardValue): string {
        return css.default;
    }

    async copy(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async canRender(value: ClipboardValue): Promise<boolean> {
        const rawText = this.getValue(value);
        return this.isValidHttpUrl(rawText);
    }

    private isValidHttpUrl(potentialUrl: string): boolean {
        try {
            const url = new URL(potentialUrl);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (e) {
            return false;
        }
    }
}