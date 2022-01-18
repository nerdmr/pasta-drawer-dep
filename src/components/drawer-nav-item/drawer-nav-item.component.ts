import { ShadowCssComponentBase } from '../shadow-sass-base/shadow-sass.component.base';
import * as css from './drawer-nav-item.component.scss';

export class DrawerNavItemComponent extends ShadowCssComponentBase {
    
    public get drawer(): string {
        return this.getAttribute('drawer');
    }

    public set active(value: boolean) {
        if (value) {
            this.component.querySelector('.drawer-nav-item__inner').classList.add('active');
        } else {
            this.component.querySelector('.drawer-nav-item__inner').classList.remove('active');
        }
    }

    /**
     *
     */
    constructor() {
        super(css, false);
    }

    connectedCallback() {
        this.render();
    }

    

    private render() {
        console.log(this.drawer, 'is set?');
        this.component.innerHTML = `
            <div class="drawer-nav-item">
                <div class="drawer-nav-item__inner">
                    <div class="drawer-nav-item__front"></div>
                    <div class="drawer-nav-item__back"></div>
                    <div class="drawer-nav-item__right"></div>
                    <div class="drawer-nav-item__left"></div>
                    <div class="drawer-nav-item__top"></div>
                    <div class="drawer-nav-item__bottom"></div>
                </div>    
            </div>
        `;
    }

}

customElements.define('drawer-nav-item', DrawerNavItemComponent);