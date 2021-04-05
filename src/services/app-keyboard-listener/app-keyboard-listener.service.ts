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

                if (ev.key === 'ArrowDown') {
                    this.appElementsService.pastaDrawerComponent.selectNextContentModule();
                } else {
                    this.appElementsService.pastaDrawerComponent.selectPreviousContentModule();
                }
                
                return;
            }


            // Arrow Up and Arrow Down
            if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
                let activeContentModule = this.appElementsService.pastaDrawerComponent.getActiveContentModule(this.appElementsService.document);

                if (!activeContentModule) {
                    // try once to select the closest, then go
                    this.appElementsService.pastaDrawerComponent.selectNextContentModule();
                    activeContentModule = this.appElementsService.pastaDrawerComponent.getActiveContentModule(this.appElementsService.document);
                }

                if (!activeContentModule) {
                    // Okay, now we can quit early
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

    private findParentMatchingSelector(selector: string, relativeElement: Element, matchingElements?: Element[]): Element|null {
        const modulesDocument: Document = relativeElement.ownerDocument;

        if (!matchingElements) {
            matchingElements = [...modulesDocument.querySelectorAll(selector)];
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