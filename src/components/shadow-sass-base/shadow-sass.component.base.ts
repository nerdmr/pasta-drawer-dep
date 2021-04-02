

export class ShadowCssComponentBase extends HTMLElement {
    private _shadowRoot: ShadowRoot;
    protected component: HTMLElement;

    /**
     *
     */
    constructor(css: { default: string }) {
        super();

        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = `<style>${css.default}</style><div class="component"></div>`;
        this.component = this._shadowRoot.querySelector('.component') as HTMLDivElement;
    }

    protected htmlEncode(input: string): string {
        var div = document.createElement('div');
        var text = document.createTextNode(input);
        div.appendChild(text);
        return div.innerHTML;
     }
}