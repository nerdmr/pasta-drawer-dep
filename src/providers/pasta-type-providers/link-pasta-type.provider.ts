import { registry, singleton } from "tsyringe";
import { PastaType } from "../../model/pasta-type.enum";
import { PastaTypeProvider } from "./json-pasta-type.provider";

@singleton()
@registry([{ token: 'PastaTypeProvider', useClass: LinkPastaTypeProvider }])
export class LinkPastaTypeProvider implements PastaTypeProvider {
    type: PastaType = PastaType.link;
    async isType(value: string): Promise<boolean> {
        console.log('return checking url', value, this.isValidHttpUrl(value));
        return this.isValidHttpUrl(value);
    }
    async canBeType(value: string): Promise<boolean> {
        return this.isValidHttpUrl(value);
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