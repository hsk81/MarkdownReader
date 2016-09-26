import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {marked} from './sys/type/window';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Dizmo} from './dizmo';
import {Editor} from './editor';

@trace
@named('Main')
export class Main {
    private _editor = new Editor();
    private _scroll1:any;
    private _scroll2:any;

    public constructor() {
        this.events();
    }

    private events() {
        this.$done
            .on('click', this.onDoneClick.bind(this));
    }

    private onDoneClick() {
        dizmo.showFront();
    }

    private language(tpl:string|any):string|any {
        if (typeof tpl === 'string') {
            return tpl.replace ('${LANGUAGE}', this.dizmo.language);
        } else {
            return tpl;
        }
    }

    private resolve(href:string):string {
        if (!href.match(/^\//) && !href.match(/^[a-z]+:\/\//i)) {
            let tpl_md = dizmo.internal.get<string>('urlMd'),
                url_md = this.language(tpl_md) as string,
                idx_md = url_md.split('/').pop();

            return url_md.replace(idx_md, '') + href;
        } else {
            return href;
        }
    }

    public get scroll1():any {
        return this._scroll1;
    }

    public set scroll1(value:any) {
        this._scroll1 = value;
    }

    public get scroll1Opts():any {
        return dizmo.internal.get<any>('scroll1', {
            fallback: false
        });
    }

    public get scroll2():any {
        return this._scroll2;
    }

    public set scroll2(value:any) {
        this._scroll2 = value;
    }

    public get scroll2Opts():any {
        return dizmo.internal.get<any>('scroll2', {
            fallback: false
        });
    }

    private get extraCss():string {
        return dizmo.internal.get<string>('extraCss');
    }

    private set extraCss(value:string) {
        dizmo.internal.set('extraCss', value);
    }

    private get height():string {
        return dizmo.internal.get<string>('height');
    }

    private get urlCss():string {
        return dizmo.internal.get<string>('urlCss');
    }

    private set urlCss(value:string) {
        dizmo.internal.set('urlCss', value);
    }

    private get urlBundleId():string {
        return dizmo.internal.get<string>('urlBundleId', {
            fallback: 'http://store.dizmo.com/?bid='
        });
    }

    private get urlMd():string {
        return dizmo.internal.get<string>('urlMd');
    }

    private set urlMd(value:string) {
        dizmo.internal.set('urlMd', value);
    }

    private get tocFlag():boolean {
        return dizmo.internal.get<boolean>('tocFlag');
    }

    private set tocFlag(value:boolean) {
        dizmo.internal.set('tocFlag', value);
    }

    private get width():string {
        return dizmo.internal.get<string>('width');
    }

    private get dizmo():Dizmo {
        return window.global<Dizmo>('DIZMO');
    }

    private get editor():Editor {
        return this._editor;
    }

    private get md2html(): {
        convert: (mdValue:string) => string;
    } {
        let renderer = new marked.Renderer();
        renderer.heading = (text:string, level:number, raw:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            if (level === 1) {
                dizmo.setAttribute('settings/title', text);
            }
            return defaults.renderer.heading.call({
                options: defaults
            }, text, level, raw);
        };
        renderer.html = (html:string) => {
            return html;
        };
        renderer.image = (href:string, title:string, text:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            return defaults.renderer.image.call({
                options: defaults
            }, this.resolve(href), title, text);
        };
        renderer.link = (href:string, title:string, text:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            return defaults.renderer.link.call({
                options: defaults
            }, this.resolve(href), title, text);
        };
        return {
            convert: function (mdValue:string) {
                return marked(mdValue, {renderer: renderer});
            }
        };
    }

    private get $back() {
        return $('#back');
    }

    private get $done() {
        return this.$back.find('.done');
    }
}

export default Main;
