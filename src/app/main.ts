import viewer from './sys/type/viewer';
import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {marked} from './sys/type/window';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Dizmo} from './dizmo';
import {Editor} from './editor';

export declare let Colors:any;

@trace
@named('Main')
export class Main {
    private _editor = new Editor();
    private _scroll1:any;
    private _scroll2:any;

    public constructor() {
        this.members();
        this.events();
    }

    private members() {
        if (this.urlMd) {
            $('#url-md').val(this.urlMd);
        }
        if (this.urlCss) {
            $('#url-css').val(this.urlCss);
        }
        if (this.extraCss) {
            this.editor.value = this.extraCss;
        }
    }

    private events() {
        $('#back').find('.done').on(
            'click', this.onDoneClick.bind(this));
        viewer.on(
            'settings/language', this.onLanguage.bind(this));
        dizmo.on(
            'settings/framecolor', this.onFrameColor.bind(this));
        dizmo.onShowBack(
            this.onShowBack.bind(this));
        dizmo.onShowFront(
            this.onShowFront.bind(this));

        this.onShowFront(null);
    }

    private onLanguage() {
        this.onShowFront({no_resize: true});
    }

    private onFrameColor(path:string, value:string) {
        $('#md-toc').css(
            'color', this.getAdaptiveColor(value));
        $('#content').find(':header,p').css(
            'color', this.getAdaptiveColor(value));
        $('#pager-idx').css(
            'color', this.getAdaptiveColor(value));
        $('#pager-lhs').css(
            '-webkit-filter', this.getAdaptiveInversion(value));
        $('#pager-rhs').css(
            '-webkit-filter', this.getAdaptiveInversion(value));
    }

    private getAdaptiveColor(hex_color:string):string {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                '#3d3d3d' : '#e6e6e6';
        } catch (ex) {
            console.error(ex);
        }
        return '#3d3d3d';
    }

    private getAdaptiveInversion(hex_color: string) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        } catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    }

    private onShowBack(opts:any) {
        // TODO: implement!
    }

    private onShowFront(opts:any) {
        // TODO: implement!
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
}

export default Main;
