import * as css from './cabinet-loader.component.scss';

export class CabinetLoaderComponent extends HTMLElement {
    private component: HTMLElement;

    /**
     *
     */
    constructor() {
    
        super();

        this.innerHTML = `<style>${css.default}</style><div class="component"></div>`;
        this.component = this.querySelector('.component') as HTMLDivElement;

        // setTimeout(() => {
        //     this.showLoader();
        // }, 500);

        // setTimeout(() => {
        //     this.hideLoader();
        // }, 3000);
    }

    connectedCallback() {
        this.render();
    }

    startAnimation() {
        this.querySelector('.cabinet')?.classList.add('animate');
    }

    stopAnimation() {
        this.querySelector('.cabinet')?.classList.remove('animate');
    }

    render() {
        this.component.innerHTML = `
        <div class="container">
            <div class="loader cabinet">
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