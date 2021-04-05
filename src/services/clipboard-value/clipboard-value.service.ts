import { isValueProvider, singleton } from "tsyringe";

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

@singleton()
export class ClipboardValueService {

    public async getClipboardValue(clipboardData: DataTransfer): Promise<ClipboardValue> {
        return new Promise<ClipboardValue>((resolve, reject) => {

            const returnValue: ClipboardValue = {
                type: 'text', // This value is updated on the fly if we process an image item
                items: [],
                createdAt: new Date().toISOString(),
            }

            const numberOfItems = clipboardData.items.length;


            for (let i = 0; i < numberOfItems; i++) {
                const item: DataTransferItem = clipboardData.items[i];

                // store these since items are volatile
                const itemKind: ClipboardItemKind = item.kind as ClipboardItemKind;
                const itemType: ClipboardItemType = item.type as ClipboardItemType;

                if (item.kind === 'file') {
                    const blob = item.getAsFile();
                    
                    returnValue.type = 'file';

                    returnValue.items.push({
                        type: itemType,
                        kind: itemKind,
                        data: blob,
                    });

                } else if (item.kind === 'string') {
                    
                    this.getClipboardItemText(item).then((value) => {
                        returnValue.items.push({
                            type: itemType,
                            kind: itemKind,
                            data: value,
                        });
                        
                        if (returnValue.items.length == numberOfItems) {
                            // ready to resolve
                            resolve(returnValue);
                        }
                    });
                }
            }

            if (returnValue.items.length == numberOfItems) {
                // ready to resolve
                resolve(returnValue);
            }
            
        });
    }

    private getClipboardItemText(clipboardItem: DataTransferItem): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            clipboardItem.getAsString((data) => {
                resolve(data);
            });
        });

    }
}