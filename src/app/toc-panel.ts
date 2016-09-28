import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {TranslationFunction} from './sys/type/window';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Color} from './color';
import {Pager} from './pager';
import {Scroller} from './scoller';

declare let DizmoElements:any;

@trace
@named('TocPanel')
export class TocPanel {
    private _scroller = new Scroller('scroll2', '#md-toc-items-wrap');

    public constructor() {
        this.events();
    }

    public init(opts:any) {
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

        if (this.flag !== null) {
            dizmo.addMenuItem(
                '/style/image/toc.svg', this.T('#dizmo/menu/toc'), () => {
                    if ($('#front').css('display') !== 'none') {
                        if (this.flag !== true) {
                            this.show(opts);
                        } else {
                            this.hide(opts);
                        }
                        this.flag = !this.flag;
                    }
                }
            );
        }

        let $toc_home = $('#md-toc-home');
        $toc_home.on('click', () => {
            this.pager.showPage(function (p:number, ps:number, go:Function) {
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
                this.scroller.refresh();
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

                if (this.scroll !== undefined) {
                    this.scroll.refresh();
                }
            }
        });

        let $tocItems = $('.md-toc-item');
        $tocItems.click(this.onItemClick.bind(this)).each(function () {
            if ($(this).find('p:empty').length > 0) {
                $(this).hide();
            }
        });

        this.highlight($tocItems.first());
        if (this.flag) {
            this.show(opts);
        }
    }

    public show(opts:any) {
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

    public hide(opts:any) {
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

    public activate(page:number) {
        let $toc_item = $($('.md-toc-h3')[page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);
    }

    public get hidden():boolean {
        return this.flag;
    }

    public get scroller():Scroller {
        return this._scroller;
    }

    private events() {
        dizmo.on(
            'settings/framecolor', this.onFrameColor.bind(this));
        $(document).on(
            'paged', this.onPaged.bind(this));
    }

    private onFrameColor(path:string, value:string) {
        $('#md-toc').css('color', Color.adapt(value));
    }

    private onPaged(ev:Event, info:any) {
        if (info) {
            this.activate(info.page);
        }
    }

    private onItemClick(ev:MouseEvent) {
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
                    this.pager.showPage(function (p:number, ps:number, go:Function) {
                        let new_page = $content.find('>h3').index($header);
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

    private scrollTo($item:JQuery) {
        this.scroller.to($item, 0, -3 * $item.height() - 6);
    }

    private highlight($item:JQuery) {
        $('.md-toc-item').removeClass('highlight');
        $item.addClass('highlight');
    }

    private get pager():Pager {
        return window.global<Pager>('PAGER');
    }

    private get flag():boolean {
        return dizmo.internal.get<boolean>('tocFlag');
    }

    private set flag(value:boolean) {
        dizmo.internal.set('tocFlag', value);
    }

    private get T():TranslationFunction {
        return window.global<TranslationFunction>('T');
    }
}

export default TocPanel;
