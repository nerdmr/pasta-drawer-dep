import { singleton } from "tsyringe";
import { PastaDrawerComponent } from "../../components/pasta-drawer-app/pasta-drawer.component";

@singleton()
export class AppElementsService {
    public pastaDrawerComponent!: PastaDrawerComponent;
    public get document(): Document {
        return this.pastaDrawerComponent.ownerDocument;
    }

    public initialize(pastaDrawerComponent: PastaDrawerComponent) {
        this.pastaDrawerComponent = pastaDrawerComponent;
    }
}