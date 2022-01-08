import { injectAll, isValueProvider, singleton } from "tsyringe";
import { PastaType } from "../../model/pasta-type.enum";
import { PastaTypeProvider } from "../../providers/pasta-type-providers/json-pasta-type.provider";

export enum ClipboardItemType {
    textPlain = 'text/plain',
    textHtml = 'text/html',
    imagePng = 'image/png',
}
export enum ClipboardItemKind {
    file = 'file',
    string = 'string',
}

export interface ClipboardItem {
    type: ClipboardItemType;
    kind: ClipboardItemKind;
    data: any;
}

export interface ClipboardValue {
    type: 'text' | 'file' | 'image';
    items: ClipboardItem[];
    createdAt: string;
}

interface StaticDataTransferItem extends DataTransferItem {
    asText?: string;
    asFile?: File;
}

@singleton()
export class ClipboardValueService {

    /**
     *
     */
    constructor(@injectAll('PastaTypeProvider') private pastaTypeProviders: PastaTypeProvider[]) { }

    public async getClipboardValue(clipboardData: DataTransfer): Promise<ClipboardValue> {

        const result: ClipboardValue = {
            type: 'text', // This value is updated on the fly if we process an image item
            items: [],
            createdAt: new Date().toISOString(),
        }

        const staticClipboardItems = await this.getClipboardData(clipboardData.items);

        for (let i = 0; i < staticClipboardItems.length; i++) {
            const item = staticClipboardItems[i];
            const itemKind: ClipboardItemKind = item.kind as ClipboardItemKind;
            const itemType: ClipboardItemType = item.type as ClipboardItemType;

            let clipboardItem: ClipboardItem;

            if (item.kind === 'file') {
                
                result.type = 'file';
                clipboardItem = {
                    type: itemType,
                    kind: itemKind,
                    data: item.asFile,
                }
                result.items.push(clipboardItem);

            } else if (item.kind === 'string') {
                clipboardItem = {
                    type: itemType,
                    kind: itemKind,
                    data: item.asText,
                }
                result.items.push(clipboardItem);
            }
        }

        return result;
    }

    private getClipboardData(dataTransferItemList: DataTransferItemList): Promise<StaticDataTransferItem[]> {
        return new Promise<DataTransferItem[]>((resolve, reject) => {
            const numberOfItems = dataTransferItemList.length;
            const result: StaticDataTransferItem[] = [];
            for (let i = 0; i < numberOfItems; i++) {
                const dataTransferItem = dataTransferItemList[i];

                const derivedItem: StaticDataTransferItem = {
                    kind: dataTransferItem.kind,
                    type: dataTransferItem.type,                                        
                } as any;

                if (dataTransferItem.kind === 'file') {
                    const blob = dataTransferItem.getAsFile();
                    derivedItem.asFile = blob;    
                    result.push(derivedItem);
                } else {
                    dataTransferItem.getAsString((data) => {
                        derivedItem.asText = data;
                        result.push(derivedItem);

                        if (result.length === numberOfItems)
                            resolve(result);
                    });
                }
            }

            if (result.length === numberOfItems)
                resolve(result);

        });
    };
}