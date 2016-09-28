import viewer from './sys/type/viewer';
import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {TranslationFunction} from './sys/type/window';
import {marked} from './sys/type/window';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Dizmo} from './dizmo';
import {Editor} from './editor';

declare let Colors:any;
declare let IScroll:any;
declare let DizmoElements:any;

@trace
@named('Main')
export class Main {
    private _editor = new Editor();
    private _scroll1:any;
    private _scroll2:any;
    private _page:number;

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
                .replace('{0}', 'url(style/image/tourguide-light.svg);'))
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
                                    function (p:number, ps:number, go:Function) {
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
        let MarkdownReader = window.global<any>('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.lhsPageTo === 'function')
        {
            this.showPage(MarkdownReader.my.lhsPageTo);
        } else {
            this.showPage(function (p:number, ps:number, go:Function) {
                if ($('#pager-lhs').attr('disabled') !== 'disabled') {
                    go.call(this, (p - 1 >= 0) ? p - 1 : 0, p);
                }
            });
        }

        $('#content').animate({
            scrollTop: 0
        }, 0);

        let $toc_item = $($('.md-toc-h3')[this.page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);

        return false;
    }

    private onRhsPagerClick() {
        let MarkdownReader = window.global<any>('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.rhsPageTo === 'function')
        {
            this.showPage(MarkdownReader.my.rhsPageTo);
        } else {
            this.showPage(function (p:number, ps:number, go:Function) {
                if ($('#pager-rhs').attr('disabled') !== 'disabled') {
                    go.call (this, (p + 1 < ps) ? p + 1 : p, p);
                }
            });
        }

        $('#content').animate({
            scrollTop: 0
        }, 0);

        let $toc_item = $($('.md-toc-h3')[this.page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);

        return false;
    }

    private onTocItemClick(ev:MouseEvent) {
        let $content = $('#content'),
            $pager = $('#pager');

        let ref = $(ev.target).attr('ref');
        if (ref) {
            let $el = $(ref), $header:JQuery;
            if ($el.length > 0) {
                switch ($el[0].tagName) {
                    case 'H1':
                    case 'H2':
                        $header = $el.nextAll('h3:first');
                        break;
                    case 'H3':
                        $header = $el;
                        break;
                    default:
                        $header = $el.prevAll('h3:first');
                }

                if ($pager.length > 0) {
                    this.showPage(function (p:number, ps:number, go:Function) {
                        let new_page = $content.find('> h3').index($header);
                        go.call(this, new_page, p);
                    });
                }

                $content.animate({
                    scrollTop: $el.offset().top
                }, 375);

                this.highlight($(ev.target).parent());
            }
        }

        return false;
    }

    private showPage(counter:Function) {
        let $items = $('#content > *'),
            $pages = $('#content').find('> h3'),
            $pager = $('#pager');

        let $h2s = this.group($items.not('#pager'), (item: HTMLElement) => {
            return item.tagName === 'H2';
        });

        let is_h3 = function (item: HTMLElement) {
            return item.tagName === 'H3';
        };

        for (let z = 0; z < $h2s.length; z++) {
            ($h2s[z] as any).$h3s = this.group($h2s[z] as any, is_h3);
        }

        let go = function (new_page:number, old_page:number) {
            if ($pager.length > 0 && new_page !== old_page) {
                $pager.trigger('turn:before', [
                    new_page, old_page, $pages.length
                ]);
            }

            let min_page = 0;
            if (min_page === new_page) {
                $('#pager-lhs').attr('disabled', 'disabled');
            } else {
                $('#pager-lhs').removeAttr('disabled');
            }
            let max_page = $pages.length - 1;
            if (max_page === new_page) {
                $('#pager-rhs').attr('disabled', 'disabled');
            } else {
                $('#pager-rhs').removeAttr('disabled');
            }

            let head = (h2s:HTMLElement) => {
                return ($(h2s) as any).first('h2').nextUntil('h3').addBack();
            };

            let i = 0, j = 0, flag:any = {};
            for (let page = 0; page < $pages.length; page++) {
                if (($h2s[i] as any).$h3s[j] === undefined) {
                    i += 1; j = 0;
                }

                if (page === new_page) {
                    let h1_text = ($items as any).first('h1').text(),
                        h2_text = ($($h2s[i]) as any).first('h2').text();

                    if (h2_text.length > 0 && h2_text !== ' ') {
                        dizmo.setAttribute(
                            'settings/title', `${h1_text}: ${h2_text}`);
                    } else {
                        dizmo.setAttribute(
                            'settings/title', `${h1_text}`);
                    }

                    flag[i] = true;
                    head($h2s[i]).show();
                    $(($h2s[i] as any).$h3s[j]).show();
                } else {
                    if (!flag[i]) {
                        head($h2s[i]).hide();
                    }
                    $(($h2s[i] as any).$h3s[j]).hide();
                }

                j += 1;
            }

            if ($pager.length > 0 && new_page !== old_page) {
                $pager.trigger('turn:after', [
                    new_page, old_page, $pages.length
                ]);
            }

            if (this.scroll1 !== undefined) {
                this.scroll1.refresh();
            }

            this.page = new_page;
            return this.page;
        };

        if (typeof counter === 'function') {
            counter.call(this, this.page || 0, $pages.length, go);
        } else {
            go(this.page || 0, this.page);
        }
    }

    private highlight($tocItem:JQuery) {
        $('.md-toc-item').removeClass('highlight');
        $tocItem.addClass('highlight');
    }

    private scrollTo($tocItem:JQuery) {
        if (this.scroll2 !== undefined) {
            let id = $tocItem.prop('id');
            if (id) {
                let dt = 600, dx = 0, dy = -3 * $tocItem.height() - 6,
                    fn = IScroll.utils.ease.quadratic;

                this.scroll2.scrollToElement('#' + id, dt, dx, dy, fn);
            }
        }
    }

    private group(array:JQuery, by:Function):JQuery {
        let groups:Array<any> = [],
            index:number = null;

        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (by(item, index, i)) {
                index = (index !== null) ? index + 1 : 0;
            }
            if (index !== null) {
                if (groups[index] === undefined) {
                    groups[index] = [];
                }
                groups[index].push(item);
            }
        }

        return $(groups);
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
        let tocs = $('#md-toc-items'),
            array = $('#content > *').not('#pager');

        for (let i = 0; i < array.length; i++) {
            let el = array[i];
            switch (el.tagName) {
                case 'H1':
                case 'H2':
                case 'H3':
                case 'H4':
                case 'H5':
                    tocs.append(`<div id="${'toc-' + i}" 
                        class="md-toc-item md-toc-${el.tagName.toLowerCase()}">
                            <p ref="#${el.id}">${el.textContent}</p>
                        </div>`);
                    break;
                default:
                    break;
            }
        }

        if (this.tocFlag !== null) {
            dizmo.addMenuItem(
                '/style/image/toc.svg', this.T('#dizmo/menu/toc'), () => {
                    if ($('#front').css('display') !== 'none') {
                        if (this.tocFlag !== true) {
                            this.showToc(opts);
                        } else {
                            this.hideToc(opts);
                        }
                        this.tocFlag = !this.tocFlag;
                    }
                }
            );
        }

        let $toc_home = $('#md-toc-home');
        $toc_home.on('click', () => {
            this.showPage(function (p:number, ps:number, go:Function) {
                go.call(this, 0);
            });

            this.highlight($('.md-toc-item:first-of-type'));
        });

        let $toc_search = $('#md-toc-search');
        $toc_search.on('input', () => {
            if ($('#md-toc-search').val() === '') {
                $('.md-toc-item:has(p:not(:empty))').each(function () {
                    $(this).show();
                });
                if (this.scroll2 !== undefined) {
                    this.scroll2.refresh();
                }
            }
        });

        $toc_search.keyup(function (ev) {
            let keyCode = ev.keyCode || ev.which;
            if (keyCode === 27) { // escape
                $('.md-toc-item:has(p:not(:empty))').each(function () {
                    $(this).show();
                });

                $('#md-toc-search').val('');
            } else {
                let rx = new RegExp($('#md-toc-search').val(), 'i');
                $('.md-toc-item:has(p:not(:empty))').each(function (i) {
                    let $item = $(this);
                    if (rx.source.length > 0 && i > 0) {
                        let text = $item.find('p').text();
                        if (text.match(rx)) {
                            $item.show();
                        } else {
                            $item.hide();
                        }
                    } else {
                        $item.show();
                    }
                });

                if (this.scroll2 !== undefined) {
                    this.scroll2.refresh();
                }
            }
        });

        let $tocItems = $('.md-toc-item');
        $tocItems.click(this.onTocItemClick.bind(this)).each(function () {
            if ($(this).find('p:empty').length > 0) {
                $(this).hide();
            }
        });

        this.highlight($tocItems.first());
        if (this.tocFlag) {
            this.showToc(opts);
        }
    }

    private showToc(opts:any) {
        let $toc_list = DizmoElements('#md-toc'),
            $toc_item = $toc_list.find('.md-toc-item');

        setTimeout(() => {
            if (!opts || !opts.no_resize) {
                let w = dizmo.get<number>('geometry/width'),
                    h = dizmo.get<number>('geometry/height');

                dizmo.set('geometry/width', w + $toc_list.width());
                dizmo.set('geometry/height', h);
            }

            $('html, body').css('width', '100%');
            $('#content-wrap').css('width', 'calc(100% - 270px)');

            $toc_item.css('border-bottom', 'lightgray solid 1px');
            $toc_list.show();
        }, 0);

        let $toc_home = $toc_list.find('#md-toc-home');
        $toc_home.dbutton();

        let $toc_search = $toc_list.find('#md-toc-search');
        $toc_search.dsearchfield();
        $toc_search.focus();
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

    private get page():number {
        return this._page;
    }

    private set page(value:number) {
        this._page = value;
    }

    private get scroll1():any {
        return this._scroll1;
    }

    private set scroll1(value:any) {
        this._scroll1 = value;
    }

    private get scroll1Opts():any {
        return dizmo.internal.get<any>('scroll1', {
            fallback: false
        });
    }

    private get scroll2():any {
        return this._scroll2;
    }

    private set scroll2(value:any) {
        this._scroll2 = value;
    }

    private get scroll2Opts():any {
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
                let html:string = marked(mdValue, {renderer: renderer});
                window.global('HTML', html);
                return html;
            }
        };
    }

    private get T():TranslationFunction {
        return window.global<TranslationFunction>('T');
    }
}

export default Main;
