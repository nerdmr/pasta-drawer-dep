import { registry, singleton } from "tsyringe";
import { PastaType } from "../../model/pasta-type.enum";
import { PastaTypeProvider } from "./json-pasta-type.provider";

@singleton()
@registry([{ token: 'PastaTypeProvider', useClass: Base64PastaTypeProvider }])
export class Base64PastaTypeProvider implements PastaTypeProvider {
    async isType(value: string): Promise<boolean> {
        return this.getDecodedValue(value) !== null;
    }
    async canBeType(value: string): Promise<boolean> {
        return this.isType(value);
    }
    type: PastaType = PastaType.base64;

    private getDecodedValue(textValue: string) {

        if (!textValue) {
            return null;
        }

        try {
            const decodeValue = atob(textValue);
            return decodeValue;
        } catch (error) { }

        return null;
    }
}