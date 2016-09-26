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
export declare let IScroll:any;
export declare let DizmoElements:any;

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

    private onDoneClick() {
        dizmo.showFront();
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

    private onShowBack(opts:any) {
        dizmo.set('settings/title', 'Markdown Reader');
        this.editor.refresh();

        if (this.tocFlag) {
            this.hideToc(opts);
        }
    }

    private onShowFront(opts:any) {
        $('style#css').remove();
        $('style#extra').remove();
        $('#front').empty()
            .append('<div id="md-logo" style="background-image: {0}"></div>'
                .replace('{0}', 'url(style/images/tourguide-light.svg);'))
            .append('<div id="md-toc"><div id="md-toc-items"/></div>');

        let extraCss = this.editor.value;
        if (extraCss && extraCss.length > 0) {
            this.extraCss = extraCss;
        } else {
            this.extraCss  = null;
        }

        let urlCss = $('#url-css').val();
        if (urlCss && urlCss.length > 0) {
            $.ajax({
                success: (value:string) => {
                    $('head').append(`<style id="css">${value}</style>`);
                },
                type: 'GET', url: this.language(urlCss)
            }).always(() => {
                $('head').append(`<style id="extra">${extraCss}</style>`);
            });
            this.urlCss = urlCss;
        } else {
            $('head').append(`<style id="extra">${extraCss}</style>`);
            this.urlCss = null;
        }

        let urlMd = $('#url-md').val();
        if (urlMd && urlMd.length > 0) {
            setTimeout(() => {
                $.ajax({
                    success: (value:string) => {
                        // HTML:
                        {
                            $('#front').empty()
                                .append('<div id="content-wrap"><div id="content">{0}</div></div>'
                                    .replace('{0}', this.md2html.convert(value)))
                                .append('<div id="md-toc">{0}{1}</div>'
                                    .replace('{0}', '<div class="searchfield">{0}{1}</div>'
                                        .replace('{0}', '<button id="md-toc-home" ' +
                                            'data-type="dizmo-button" rel="help">&nbsp;</button>')
                                        .replace ('{1}', '<input ' +
                                            'id="md-toc-search" ' +
                                            'data-type="dizmo-searchfield" type="search" ' +
                                            'class="searchinput" ' +
                                            '/>'))
                                    .replace('{1}', '<div id="md-toc-items-wrap">' +
                                        '<div id="md-toc-items"></div></div>'));
                        }
                        // Pager:
                        {
                            let $pager = $('#pager');
                            if ($pager.length > 0) {
                                $pager.appendTo('#front');
                                $('#pager-lhs').click(
                                    this.onLhsPagerClick.bind(this));
                                $('#pager-rhs').click(
                                    this.onRhsPagerClick.bind(this));
                                $(document).keydown((ev:KeyboardEvent) => {
                                    let display = $('#front').css('display');
                                    if (display === 'block') {
                                        let keyCode = ev.keyCode || ev.which;
                                        if (keyCode === 37) { // left arrow
                                            this.onLhsPagerClick();
                                        }
                                        if (keyCode === 39) { // right arrow
                                            this.onRhsPagerClick();
                                        }
                                    }
                                });
                                this.showPage(
                                    (page:number, pages:number, go:Function) => {
                                        go.call(this, 0);
                                    }
                                );
                            }
                        }
                        // Linking:
                        {
                            $('#content').find('a').click((ev: MouseEvent) => {
                                let $target = $(ev.target);
                                let href = $target.attr('href');
                                if (href.indexOf(this.urlBundleId) === 0) {
                                    let bs = viewer.getBundles();
                                    let bid = href
                                        .replace(this.urlBundleId, '');
                                    let bids = bs
                                        .map((b) => { return b.identifier; });
                                    let bid_index1 = bids
                                        .indexOf(bid);
                                    let bid_index2 = bids
                                        .indexOf('com.dizmo.dizmostore');
                                    if (bid_index1 > 0) {
                                        bs[bid_index1].instantiateDizmo();
                                    } else if (bid_index2 > 0) {
                                        bs[bid_index2].instantiateDizmo();
                                    }
                                    return false;
                                }
                            });
                        }
                        // Frame Color:
                        {
                            let color = dizmo.get<string>('settings/framecolor');
                            this.onFrameColor('settings/framecolor', color);
                        }
                        // Scrolling:
                        {
                            if (this.scroll1 !== undefined) {
                                this.scroll1.destroy();
                                this.scroll1 = undefined;
                            }
                            if (this.scroll2 !== undefined) {
                                this.scroll2.destroy();
                                this.scroll2 = undefined;
                            }

                            if (this.scroll1Opts) {
                                setTimeout(() => {
                                    $('#content-wrap')
                                        .addClass('no-dizmo-drag');
                                    this.scroll1 = new IScroll(
                                        '#content-wrap', this.scroll1Opts);
                                }, 200);
                            }
                            if (this.scroll2Opts) {
                                setTimeout(() => {
                                    $('#md-toc-items-wrap')
                                        .addClass('no-dizmo-drag');
                                    this.scroll2 = new IScroll(
                                        '#md-toc-items-wrap', this.scroll2Opts);
                                }, 600);
                            }
                        }
                        // TOC:
                        {
                            this.initToc(opts);
                        }
                    },
                    type: 'GET', url: this.language(urlMd)
                });
                this.urlMd = urlMd;
            }, 1);
        } else {
            this.urlMd = null;
        }
    }

    private onLhsPagerClick() {
        // TODO: implement!
    }

    private onRhsPagerClick() {
        // TODO: implement!
    }

    private showPage(counter:Function) {
        // TODO: implement!
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

    private getAdaptiveInversion(hex_color:string) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        } catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    }

    private initToc(opts:any) {
        // TODO: implement!
    }

    private hideToc(opts:any) {
        let $toc_list = DizmoElements('#md-toc'),
            $toc_item = $toc_list.find('.md-toc-item');

        setTimeout(() => {
            if (!opts || !opts.no_resize) {
                let w = dizmo.get<number>('geometry/width'),
                    h = dizmo.get<number>('geometry/height');

                dizmo.set('geometry/width', w - $toc_list.width());
                dizmo.set('geometry/height', h);
            }

            $('html, body')
                .css('width', '100%');
            $('#content-wrap')
                .css('width', 'calc(100% - 16px)');

            $toc_item.css('border-bottom', 'none');
            $toc_list.hide();
        }, 0);
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
