import { registry, singleton } from "tsyringe";
import { PastaType } from "../../model/pasta-type.enum";

export interface PastaTypeProvider {
    type: PastaType;
    isType(value: string): Promise<boolean>;
    canBeType(value: string): Promise<boolean>;
}

@singleton()
@registry([{ token: 'PastaTypeProvider', useClass: JsonPastaTypeProvider }])
export class JsonPastaTypeProvider implements PastaTypeProvider {
    async isType(value: string): Promise<boolean> {
        return this.isJson(value);
    }
    async canBeType(value: string): Promise<boolean> {
        return this.isJson(value) || this.isJsonLike(value);
    }
    type: PastaType = PastaType.json;

    private isJson(value: string): boolean {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    }

    private isJsonLike(value: string): boolean {
        return false;
    }
}