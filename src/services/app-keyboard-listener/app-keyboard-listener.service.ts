import { singleton } from "tsyringe";
import { ContentModuleComponent } from "../../components/content-module/content-module.component";
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
            
            // Arrow Up and Arrow Down
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

                return;
            }


            // Arrow Up and Arrow Down
            if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
                const activeContentModule = this.getActiveContentModule();

                if (!activeContentModule) {
                    return;
                }

                ev.preventDefault();
                ev.stopPropagation();

                // if right, select neighboring representation
                // if left, select left representation
                if (ev.key === 'ArrowRight') {
                    activeContentModule.selectNextRepresentation();
                } else {
                    activeContentModule.selectPreviousRepresentation();
                }

                return;
            }


            // Delete
            if (
                ev.key === 'Delete' &&
                this.appElementsService.document.activeElement &&
                this.appElementsService.document.activeElement.classList.contains('content-module')
            ) {
                const contentModuleComponent: ContentModuleComponent = this.findParentMatchingSelector('content-module', this.appElementsService.document.activeElement!) as ContentModuleComponent;

                if (contentModuleComponent) {
                    contentModuleComponent.delete();
                }
            }

            // Enter
            if (
                ev.key === 'Enter' &&
                this.appElementsService.document.activeElement &&
                this.appElementsService.document.activeElement.classList.contains('content-module')
            ) {
                const contentModuleComponent: ContentModuleComponent = this.findParentMatchingSelector('content-module', this.appElementsService.document.activeElement!) as ContentModuleComponent;

                if (contentModuleComponent) {
                    contentModuleComponent.copy().then();
                }
            }
        });
    }

    private getActiveContentModule(): ContentModuleComponent|null {
        // Delete
        if (
            !this.appElementsService.document.activeElement ||
            !this.appElementsService.document.activeElement.classList.contains('content-module')
        ) {
            return null;
        }

        return this.findParentMatchingSelector('content-module', this.appElementsService.document.activeElement!) as ContentModuleComponent;
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