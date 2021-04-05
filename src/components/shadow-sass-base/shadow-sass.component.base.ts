import { CabinetLoaderComponent } from "../cabinet-loader/cabinet-loader.component";
import * as cssDefault from './shadow-sass.component.base.scss';

export class ShadowCssComponentBase extends HTMLElement {
    
    protected component: HTMLElement;
    private _loading: boolean = false;
    protected set loading(value: boolean) {
        if (value && !this._loading) {
            this._loading = value;
            this.showLoader();    
        } else if (!value && this._loading) {
            this._loading = value;
            this.hideLoader();
        }
    }
    protected get loading(): boolean {
        return this._loading;
    }
    private loaderElement: CabinetLoaderComponent;
    private componentWrapper: HTMLElement;

    /**
     *
     */
    constructor(css: { default: string }, useShadowDom: boolean = true) {
        super();

        if (useShadowDom) {
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.innerHTML = `<style>${css.default} ${cssDefault.default}</style><div class="component__wrapper"><div class="component"></div><cabinet-loader></cabinet-loader></div>`;
            this.component = shadowRoot.querySelector('.component') as HTMLDivElement;
            this.componentWrapper = shadowRoot.querySelector('.component__wrapper') as HTMLDivElement;
        } else {
            // TODO optimize rendering css
            this.innerHTML = `<style>${css.default} ${cssDefault.default}</style><div class="component__wrapper"><div class="component"></div><cabinet-loader></cabinet-loader></div>`;
            this.component = this.querySelector('.component') as HTMLDivElement;
            this.componentWrapper = this.querySelector('.component__wrapper') as HTMLDivElement;
        }
        
        this.loaderElement = this.component.nextElementSibling as CabinetLoaderComponent;
        
    }

    protected htmlEncode(input: string): string {
        var div = document.createElement('div');
        var text = document.createTextNode(input);
        div.appendChild(text);
        return div.innerHTML;
    }

    private showLoader() {
        this.componentWrapper.classList.add('display-loader');
        setTimeout(() => {
            this.componentWrapper.classList.add('show-loader');
        }, 0);

        this.loaderElement.startAnimation();
    }
    private hideLoader() {
        this.componentWrapper.classList.remove('show-loader');
        setTimeout(() => {
            this.loaderElement.stopAnimation();
            this.componentWrapper.classList.remove('display-loader');
            this.loaderElement.stopAnimation();
        }, 150); // transition duration
    }
}