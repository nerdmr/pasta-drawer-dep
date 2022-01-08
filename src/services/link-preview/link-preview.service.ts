import { singleton } from "tsyringe";

export interface LinkPreview {
    url:         string;
    title:       string;
    siteName:    string;
    description: string;
    images:      string[];
    mediaType:   string;
    contentType: string;
    videos:      any[];
    favicons:    string[];
}

@singleton()
export class LinkPreviewService {

    previewUrlBase: string;

    /**
     *
     */
    constructor() {
        this.previewUrlBase = process.env.LINK_PREVIEW_PATH;
    }

    async get(url: string): Promise<LinkPreview> {

        const previewServiceUrl = `${this.previewUrlBase}/preview?url=${url}`;
        const options: RequestInit = {
            method: 'GET'
        };

        try {
            const response = await fetch(previewServiceUrl!, options);
            const result = (await response.json());
            return result;
        } catch (err) {
            throw new Error('Could not get url preview');
        }
    }
}