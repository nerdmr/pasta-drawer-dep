import { singleton } from "tsyringe";
import { TurkeyPasterComponent } from "../../components/turkey-paster-app/turkey-paster.component";

@singleton()
export class AppElementsService {
    public turkeyPasterComponent!: TurkeyPasterComponent;

    public initialize(turkeyPasterComponent: TurkeyPasterComponent) {
        this.turkeyPasterComponent = turkeyPasterComponent;
    }
}