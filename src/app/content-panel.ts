import viewer from './sys/type/viewer';
import window from './sys/type/window';
import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Color} from './color';
import {Editor} from './editor';
import {Language} from './language';
import {MdRenderer} from './md-renderer';
import {Pager} from './pager';
import {TocPanel} from './toc-panel';
import {Scroller} from './scoller';

@trace
@named('ContentPanel')
export class ContentPanel {
    private _scroller = new Scroller('scroll1', '#content-wrap');

    public constructor() {
        this.members();
        this.events();
    }

    public get scroller():Scroller {
        return this._scroller;
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
        viewer.on(
            'settings/language', this.onLanguage.bind(this));
        dizmo.on(
            'settings/framecolor', this.onFrameColor.bind(this));
        dizmo.onShowFront(
            this.show.bind(this));

        this.show(null);
    }

    private onLanguage() {
        this.show({no_resize: true});
    }

    private onFrameColor(path:string, value:string) {
        $('#content').find(':header,p')
            .css('color', Color.adapt(value));
    }

    private show(opts:any) {
        this.init();
        this.css();
        this.md(opts);
    }

    private init() {
        $('style#css').remove();
        $('style#extra').remove();

        $('#front').empty()
            .append('<div id="md-logo" style="background-image: {0}"></div>'
                .replace('{0}', 'url(style/image/tourguide-light.svg);'))
            .append('<div id="md-toc"><div id="md-toc-items"/></div>');
    }

    private css() {
        let extraCss = this.editor.value;
        if (extraCss && extraCss.length > 0) {
            this.extraCss = extraCss;
        } else {
            this.extraCss = null;
        }

        let urlCss = $('#url-css').val();
        if (urlCss && urlCss.length > 0) {
            $.ajax({
                success: (value: string) => {
                    $('head').append(`<style id="css">${value}</style>`);
                },
                type: 'GET', url: Language.template(urlCss)
            }).always(() => {
                $('head').append(`<style id="extra">${extraCss}</style>`);
            });
            this.urlCss = urlCss;
        } else {
            $('head').append(`<style id="extra">${extraCss}</style>`);
            this.urlCss = null;
        }
    }

    private md(opts: any) {
        let urlMd = $('#url-md').val();
        if (urlMd && urlMd.length > 0) {
            setTimeout(() => {
                $.ajax({
                    success: (value: string) => {
                        this.html(value);
                        this.link();
                        this.color();

                        this.scroller.refresh(true);
                        this.tocPanel.scroller.refresh(true);
                        this.tocPanel.init(opts);
                        this.pager.init();
                    },
                    type: 'GET', url: Language.template(urlMd)
                });
                this.urlMd = urlMd;
            }, 1);
        } else {
            this.urlMd = null;
        }
    }

    private html(value: string) {
        $('#front').empty()
            .append('<div id="content-wrap"><div id="content">{0}</div></div>'
                .replace('{0}', MdRenderer.toHtml.convert(value)))
            .append('<div id="md-toc">{0}{1}</div>'
                .replace('{0}', '<div class="searchfield">{0}{1}</div>'
                    .replace('{0}', '<button id="md-toc-home" ' +
                        'data-type="dizmo-button" rel="help">&nbsp;</button>')
                    .replace('{1}', '<input ' +
                        'id="md-toc-search" ' +
                        'data-type="dizmo-searchfield" type="search" ' +
                        'class="searchinput" ' +
                        '/>'))
                .replace('{1}', '<div id="md-toc-items-wrap">' +
                    '<div id="md-toc-items"></div></div>'));
    }

    private link() {
        $('#content').find('a').click((ev: MouseEvent) => {
            let $target = $(ev.target);
            let href = $target.attr('href');
            if (href.indexOf(this.urlBundleId) === 0) {
                let bs = viewer.getBundles();
                let bid = href
                    .replace(this.urlBundleId, '');
                let bids = bs
                    .map((b) => {
                        return b.identifier;
                    });
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

    private color() {
        this.onFrameColor('settings/framecolor',
            dizmo.get<string>('settings/framecolor'));
    }

    private get extraCss():string {
        return dizmo.internal.get<string>('extraCss');
    }

    private set extraCss(value:string) {
        dizmo.internal.set('extraCss', value);
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

    private get editor():Editor {
        return window.global<Editor>('EDITOR');
    }

    private get pager():Pager {
        return window.global<Pager>('PAGER');
    }

    private get tocPanel():TocPanel {
        return window.global<TocPanel>('TOC_PANEL');
    }
}

export default ContentPanel;
