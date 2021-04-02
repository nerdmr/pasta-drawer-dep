import { singleton } from "tsyringe";

export interface ClipboardValue {
    type: 'text' | 'image';
    data: any;
}

@singleton()
export class ClipboardValueService {

    public async getClipboardValue(clipboardData: DataTransfer): Promise<ClipboardValue> {
        return new Promise<ClipboardValue>((resolve, reject) => {
            let handledAsynchronously = false;
            

            for (let i = 0; i < clipboardData.items.length; i++) {
                const item: DataTransferItem = clipboardData.items[i];
                
                if (item.kind === 'file') {
                    const blob = item.getAsFile();
                    resolve({
                        type: 'image',
                        data: blob
                    });
                    
                    // handledAsynchronously = true;

                    // const blob = item.getAsFile();
                    // var reader = new FileReader();
                    // reader.onload = function(event: any) {
                    //     resolve({
                    //         type: 'image',
                    //         data: event.target.result
                    //     });
                    // };
                 
                    // reader.readAsDataURL(blob as Blob);
                    // // reader.readAsDataURL
                    
                }
            }

            if (!handledAsynchronously) {
                const clipboardValue = clipboardData?.getData('text');
                resolve({
                    type: 'text',
                    data: clipboardValue
                });
            }
            
        });
    }
}