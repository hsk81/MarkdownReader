import window from './sys/type/window';
import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace, traceable} from './sys/util/trace';
import {Color} from './color';
import {Scroller} from './scoller';

@trace
@named('Pager')
export class Pager {
    private _page:number;
    private _scroller = new Scroller('scroll1', '#content-wrap');

    public get scroller():Scroller {
        return this._scroller;
    }

    public constructor() {
        this.events();
    }

    public init() {
        let $pager = $('#pager');
        if ($pager.length > 0) {
            $pager.appendTo('#front');
            $('#pager-lhs').click(
                this.onLhsClick.bind(this));
            $('#pager-rhs').click(
                this.onRhsClick.bind(this));
            $(document).keydown((ev: KeyboardEvent) => {
                let display = $('#front').css('display');
                if (display === 'block') {
                    let keyCode = ev.keyCode || ev.which;
                    if (keyCode === 37) { // left arrow
                        this.onLhsClick();
                    }
                    if (keyCode === 39) { // right arrow
                        this.onRhsClick();
                    }
                }
            });
            this.showPage(
                function (p: number, ps: number, go: Function) {
                    go.call(this, 0);
                }
            );
        }
        this.scroller.refresh(true);
    }

    public showPage(counter:Function) {
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

            let i = 0, j = 0, flag:any = {}, header;
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
                    header = head($h2s[i]).show();
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

            this.scroller.refresh();
            if (header) {
                this.scroller.to(header);
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

    private events() {
        dizmo.on(
            'settings/framecolor', this.onFrameColor.bind(this));
    }

    private onFrameColor(path:string, value:string) {
        $('#pager-idx').css(
            'color', Color.adapt(value));
        $('#pager-lhs').css(
            '-webkit-filter', Color.invert(value));
        $('#pager-rhs').css(
            '-webkit-filter', Color.invert(value));
    }

    private onLhsClick() {
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
        $(document).trigger('paged', {page: this.page});
        return false;
    }

    private onRhsClick() {
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
        $(document).trigger('paged', {page: this.page});
        return false;
    }

    @traceable(false)
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

    private get page():number {
        return this._page;
    }

    private set page(value:number) {
        this._page = value;
    }
}

export default Pager;
