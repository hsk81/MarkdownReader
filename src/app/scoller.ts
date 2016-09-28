import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

declare let IScroll:any;

@trace
@named('Scroller')
export class Scroller {
    private _name:string;
    private _ref:string;
    private _scroll:any;

    constructor(name:string, ref:string) {
        this._name = name;
        this._ref = ref;
    }

    public refresh(deep:boolean = false, ms:number = 200) {
        if (deep) {
            this.destroy();
            this.setup(ms);
        } else {
            if (this._scroll !== undefined) {
                this._scroll.refresh();
            }
        }
    }

    public setup(ms:number = 200) {
        if (this.options) {
            setTimeout(() => {
                $(this._ref).addClass('no-dizmo-drag');
                this._scroll = new IScroll(this._ref, this.options);
            }, ms);
        }
    }

    public destroy() {
        if (this._scroll !== undefined) {
            this._scroll.destroy();
            this._scroll = undefined;
        }
    }

    public to($el:JQuery, dx:number = 0, dy:number = 0, dt:number = 600) {
        if (this._scroll !== undefined) {
            let id = $el.prop('id');
            if (id) {
                this._scroll.scrollToElement(
                    '#' + id, dt, dx, dy, IScroll.utils.ease.quadratic);
            }
        }
    }

    private get options():any {
        return dizmo.internal.get<any>(this._name, {
            fallback: false
        });
    }
}

export default Scroller;
