import { singleton } from "tsyringe";
import { AppElementsService } from "../app-elements/app-elements.service";


@singleton()
export class AppKeyboardListenerService {
    /**
     *
     */
    constructor(private appElementsService: AppElementsService) {
        document.addEventListener('keyup', (ev: KeyboardEvent) => {

        });

        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            
            if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
                const contentModules = [...this.appElementsService.document.querySelectorAll('.content-module')] as HTMLElement[];
                if (contentModules.length === 0) {
                    return;
                }

                ev.preventDefault();
                ev.stopPropagation();

                if (!this.appElementsService.document.activeElement) {
                    // select the first one
                    contentModules[0].focus();
                    return;
                }

                // figure out which content module to select
                const matchingParent: HTMLElement|null = this.findParentMatchingSelector('.content-module', this.appElementsService.document.activeElement, contentModules) as HTMLElement|null;

                if (!matchingParent) {
                    contentModules[0].focus();
                    return;
                }

                const matchingEleIndex = contentModules.indexOf(matchingParent);

                if (ev.key === 'ArrowDown') {
                    contentModules[(matchingEleIndex === contentModules.length - 1) ? 0 : matchingEleIndex + 1].focus();
                } else {
                    contentModules[(matchingEleIndex === 0 ? contentModules.length - 1 : matchingEleIndex - 1)].focus();
                }
            }
        });
    }

    private findParentMatchingSelector(selector: string, relativeElement: Element, matchingElements?: Element[]): Element|null {
        if (!matchingElements) {
            matchingElements = [...this.appElementsService.document.querySelectorAll(selector)];
        }

        const matchingElementIndex = matchingElements.indexOf(relativeElement);
        if (matchingElementIndex !== -1) {
            return matchingElements[matchingElementIndex];
        } else if (!relativeElement.parentElement) {
            return null;
        } else {
            return this.findParentMatchingSelector(selector, relativeElement.parentElement, matchingElements);
        }
    }


}