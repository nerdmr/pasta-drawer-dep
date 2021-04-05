import * as css from './cabinet-loader.component.scss';

export class CabinetLoaderComponent extends HTMLElement {
    private component: HTMLElement;
    private cabinetElement: HTMLElement | null = null;
    private loading: boolean = false;

    /**
     *
     */
    constructor() {
    
        super();

        this.innerHTML = `<style>${css.default}</style><div class="component"></div>`;
        this.component = this.querySelector('.component') as HTMLDivElement;
    }

    connectedCallback() {
        this.render();
        this.cabinetElement = this.component.querySelector('.cabinet');
    }

    startAnimation() {
        this.loading = true;
        
        if (!this.cabinetElement) {
            return;
        }

        this.component.querySelector('.cabinet')?.classList.add('animate');
    }

    stopAnimation() {
        this.loading = false;

        if (!this.cabinetElement) {
            return;
        }

        this.component.querySelector('.cabinet')?.classList.remove('animate');
    }

    render() {
        this.component.innerHTML = `
        <div class="container">
            <div class="loader cabinet ${(this.loading) ? 'animate' : ''}">
                <div class="cabinet-drawer">
                    <div class="cabinet-drawer__bottom"></div>
                    <div class="cabinet-drawer__back"></div>
                    <div class="cabinet-drawer__side-1"></div>
                    <div class="cabinet-drawer__side-2"></div>
                    <div class="cabinet-drawer__front"></div>
                </div>
                <div class="cabinet-drawer">
                    <div class="cabinet-drawer__bottom"></div>
                    <div class="cabinet-drawer__back"></div>
                    <div class="cabinet-drawer__side-1"></div>
                    <div class="cabinet-drawer__side-2"></div>
                    <div class="cabinet-drawer__front"></div>
                </div>
                <div class="cabinet-drawer">
                    <div class="cabinet-drawer__bottom"></div>
                    <div class="cabinet-drawer__back"></div>
                    <div class="cabinet-drawer__side-1"></div>
                    <div class="cabinet-drawer__side-2"></div>
                    <div class="cabinet-drawer__front"></div>
                </div>
                <div class="cabinet__top"></div>
                <div class="cabinet__side"></div>
                <div class="cabinet__front"></div>
            </div>
        </div>
        `;
    }
}

customElements.define('cabinet-loader', CabinetLoaderComponent);