"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var viewer_1 = require('./sys/type/viewer');
var window_1 = require('./sys/type/window');
var dizmo_1 = require('./sys/type/dizmo');
var window_2 = require('./sys/type/window');
var window_3 = require('./sys/type/window');
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var editor_1 = require('./editor');
var Main = (function () {
    function Main() {
        this._editor = new editor_1.Editor();
        this.members();
        this.events();
    }
    Main.prototype.members = function () {
        if (this.urlMd) {
            window_3.$('#url-md').val(this.urlMd);
        }
        if (this.urlCss) {
            window_3.$('#url-css').val(this.urlCss);
        }
        if (this.extraCss) {
            this.editor.value = this.extraCss;
        }
    };
    Main.prototype.events = function () {
        window_3.$('#back').find('.done').on('click', this.onDoneClick.bind(this));
        viewer_1.default.on('settings/language', this.onLanguage.bind(this));
        dizmo_1.default.on('settings/framecolor', this.onFrameColor.bind(this));
        dizmo_1.default.onShowBack(this.onShowBack.bind(this));
        dizmo_1.default.onShowFront(this.onShowFront.bind(this));
        this.onShowFront(null);
    };
    Main.prototype.onDoneClick = function () {
        dizmo_1.default.showFront();
    };
    Main.prototype.onLanguage = function () {
        this.onShowFront({ no_resize: true });
    };
    Main.prototype.onFrameColor = function (path, value) {
        window_3.$('#md-toc').css('color', this.getAdaptiveColor(value));
        window_3.$('#content').find(':header,p').css('color', this.getAdaptiveColor(value));
        window_3.$('#pager-idx').css('color', this.getAdaptiveColor(value));
        window_3.$('#pager-lhs').css('-webkit-filter', this.getAdaptiveInversion(value));
        window_3.$('#pager-rhs').css('-webkit-filter', this.getAdaptiveInversion(value));
    };
    Main.prototype.onShowBack = function (opts) {
        dizmo_1.default.set('settings/title', 'Markdown Reader');
        this.editor.refresh();
        if (this.tocFlag) {
            this.hideToc(opts);
        }
    };
    Main.prototype.onShowFront = function (opts) {
        var _this = this;
        window_3.$('style#css').remove();
        window_3.$('style#extra').remove();
        window_3.$('#front').empty()
            .append('<div id="md-logo" style="background-image: {0}"></div>'
            .replace('{0}', 'url(style/image/tourguide-light.svg);'))
            .append('<div id="md-toc"><div id="md-toc-items"/></div>');
        var extraCss = this.editor.value;
        if (extraCss && extraCss.length > 0) {
            this.extraCss = extraCss;
        }
        else {
            this.extraCss = null;
        }
        var urlCss = window_3.$('#url-css').val();
        if (urlCss && urlCss.length > 0) {
            window_3.$.ajax({
                success: function (value) {
                    window_3.$('head').append("<style id=\"css\">" + value + "</style>");
                },
                type: 'GET', url: this.language(urlCss)
            }).always(function () {
                window_3.$('head').append("<style id=\"extra\">" + extraCss + "</style>");
            });
            this.urlCss = urlCss;
        }
        else {
            window_3.$('head').append("<style id=\"extra\">" + extraCss + "</style>");
            this.urlCss = null;
        }
        var urlMd = window_3.$('#url-md').val();
        if (urlMd && urlMd.length > 0) {
            setTimeout(function () {
                window_3.$.ajax({
                    success: function (value) {
                        // HTML:
                        {
                            window_3.$('#front').empty()
                                .append('<div id="content-wrap"><div id="content">{0}</div></div>'
                                .replace('{0}', _this.md2html.convert(value)))
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
                        // Pager:
                        {
                            var $pager = window_3.$('#pager');
                            if ($pager.length > 0) {
                                $pager.appendTo('#front');
                                window_3.$('#pager-lhs').click(_this.onLhsPagerClick.bind(_this));
                                window_3.$('#pager-rhs').click(_this.onRhsPagerClick.bind(_this));
                                window_3.$(document).keydown(function (ev) {
                                    var display = window_3.$('#front').css('display');
                                    if (display === 'block') {
                                        var keyCode = ev.keyCode || ev.which;
                                        if (keyCode === 37) {
                                            _this.onLhsPagerClick();
                                        }
                                        if (keyCode === 39) {
                                            _this.onRhsPagerClick();
                                        }
                                    }
                                });
                                _this.showPage(function (p, ps, go) {
                                    go.call(this, 0);
                                });
                            }
                        }
                        // Linking:
                        {
                            window_3.$('#content').find('a').click(function (ev) {
                                var $target = window_3.$(ev.target);
                                var href = $target.attr('href');
                                if (href.indexOf(_this.urlBundleId) === 0) {
                                    var bs = viewer_1.default.getBundles();
                                    var bid = href
                                        .replace(_this.urlBundleId, '');
                                    var bids = bs
                                        .map(function (b) { return b.identifier; });
                                    var bid_index1 = bids
                                        .indexOf(bid);
                                    var bid_index2 = bids
                                        .indexOf('com.dizmo.dizmostore');
                                    if (bid_index1 > 0) {
                                        bs[bid_index1].instantiateDizmo();
                                    }
                                    else if (bid_index2 > 0) {
                                        bs[bid_index2].instantiateDizmo();
                                    }
                                    return false;
                                }
                            });
                        }
                        // Frame Color:
                        {
                            var color = dizmo_1.default.get('settings/framecolor');
                            _this.onFrameColor('settings/framecolor', color);
                        }
                        // Scrolling:
                        {
                            if (_this.scroll1 !== undefined) {
                                _this.scroll1.destroy();
                                _this.scroll1 = undefined;
                            }
                            if (_this.scroll2 !== undefined) {
                                _this.scroll2.destroy();
                                _this.scroll2 = undefined;
                            }
                            if (_this.scroll1Opts) {
                                setTimeout(function () {
                                    window_3.$('#content-wrap')
                                        .addClass('no-dizmo-drag');
                                    _this.scroll1 = new IScroll('#content-wrap', _this.scroll1Opts);
                                }, 200);
                            }
                            if (_this.scroll2Opts) {
                                setTimeout(function () {
                                    window_3.$('#md-toc-items-wrap')
                                        .addClass('no-dizmo-drag');
                                    _this.scroll2 = new IScroll('#md-toc-items-wrap', _this.scroll2Opts);
                                }, 600);
                            }
                        }
                        // TOC:
                        {
                            _this.initToc(opts);
                        }
                    },
                    type: 'GET', url: _this.language(urlMd)
                });
                _this.urlMd = urlMd;
            }, 1);
        }
        else {
            this.urlMd = null;
        }
    };
    Main.prototype.onLhsPagerClick = function () {
        var MarkdownReader = window_1.default.global('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.lhsPageTo === 'function') {
            this.showPage(MarkdownReader.my.lhsPageTo);
        }
        else {
            this.showPage(function (p, ps, go) {
                if (window_3.$('#pager-lhs').attr('disabled') !== 'disabled') {
                    go.call(this, (p - 1 >= 0) ? p - 1 : 0, p);
                }
            });
        }
        window_3.$('#content').animate({
            scrollTop: 0
        }, 0);
        var $toc_item = window_3.$(window_3.$('.md-toc-h3')[this.page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);
        return false;
    };
    Main.prototype.onRhsPagerClick = function () {
        var MarkdownReader = window_1.default.global('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.rhsPageTo === 'function') {
            this.showPage(MarkdownReader.my.rhsPageTo);
        }
        else {
            this.showPage(function (p, ps, go) {
                if (window_3.$('#pager-rhs').attr('disabled') !== 'disabled') {
                    go.call(this, (p + 1 < ps) ? p + 1 : p, p);
                }
            });
        }
        window_3.$('#content').animate({
            scrollTop: 0
        }, 0);
        var $toc_item = window_3.$(window_3.$('.md-toc-h3')[this.page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);
        return false;
    };
    Main.prototype.onTocItemClick = function (ev) {
        var $content = window_3.$('#content'), $pager = window_3.$('#pager');
        var ref = window_3.$(ev.target).attr('ref');
        if (ref) {
            var $el = window_3.$(ref), $header_1;
            if ($el.length > 0) {
                switch ($el[0].tagName) {
                    case 'H1':
                    case 'H2':
                        $header_1 = $el.nextAll('h3:first');
                        break;
                    case 'H3':
                        $header_1 = $el;
                        break;
                    default:
                        $header_1 = $el.prevAll('h3:first');
                }
                if ($pager.length > 0) {
                    this.showPage(function (p, ps, go) {
                        var new_page = $content.find('> h3').index($header_1);
                        go.call(this, new_page, p);
                    });
                }
                $content.animate({
                    scrollTop: $el.offset().top
                }, 375);
                this.highlight(window_3.$(ev.target).parent());
            }
        }
        return false;
    };
    Main.prototype.showPage = function (counter) {
        var $items = window_3.$('#content > *'), $pages = window_3.$('#content').find('> h3'), $pager = window_3.$('#pager');
        var $h2s = this.group($items.not('#pager'), function (item) {
            return item.tagName === 'H2';
        });
        var is_h3 = function (item) {
            return item.tagName === 'H3';
        };
        for (var z = 0; z < $h2s.length; z++) {
            $h2s[z].$h3s = this.group($h2s[z], is_h3);
        }
        var go = function (new_page, old_page) {
            if ($pager.length > 0 && new_page !== old_page) {
                $pager.trigger('turn:before', [
                    new_page, old_page, $pages.length
                ]);
            }
            var min_page = 0;
            if (min_page === new_page) {
                window_3.$('#pager-lhs').attr('disabled', 'disabled');
            }
            else {
                window_3.$('#pager-lhs').removeAttr('disabled');
            }
            var max_page = $pages.length - 1;
            if (max_page === new_page) {
                window_3.$('#pager-rhs').attr('disabled', 'disabled');
            }
            else {
                window_3.$('#pager-rhs').removeAttr('disabled');
            }
            var head = function (h2s) {
                return window_3.$(h2s).first('h2').nextUntil('h3').addBack();
            };
            var i = 0, j = 0, flag = {};
            for (var page = 0; page < $pages.length; page++) {
                if ($h2s[i].$h3s[j] === undefined) {
                    i += 1;
                    j = 0;
                }
                if (page === new_page) {
                    var h1_text = $items.first('h1').text(), h2_text = window_3.$($h2s[i]).first('h2').text();
                    if (h2_text.length > 0 && h2_text !== ' ') {
                        dizmo_1.default.setAttribute('settings/title', h1_text + ": " + h2_text);
                    }
                    else {
                        dizmo_1.default.setAttribute('settings/title', "" + h1_text);
                    }
                    flag[i] = true;
                    head($h2s[i]).show();
                    window_3.$($h2s[i].$h3s[j]).show();
                }
                else {
                    if (!flag[i]) {
                        head($h2s[i]).hide();
                    }
                    window_3.$($h2s[i].$h3s[j]).hide();
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
        }
        else {
            go(this.page || 0, this.page);
        }
    };
    Main.prototype.highlight = function ($tocItem) {
        window_3.$('.md-toc-item').removeClass('highlight');
        $tocItem.addClass('highlight');
    };
    Main.prototype.scrollTo = function ($tocItem) {
        if (this.scroll2 !== undefined) {
            var id = $tocItem.prop('id');
            if (id) {
                var dt = 600, dx = 0, dy = -3 * $tocItem.height() - 6, fn = IScroll.utils.ease.quadratic;
                this.scroll2.scrollToElement('#' + id, dt, dx, dy, fn);
            }
        }
    };
    Main.prototype.group = function (array, by) {
        var groups = [], index = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
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
        return window_3.$(groups);
    };
    Main.prototype.getAdaptiveColor = function (hex_color) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                '#3d3d3d' : '#e6e6e6';
        }
        catch (ex) {
            console.error(ex);
        }
        return '#3d3d3d';
    };
    Main.prototype.getAdaptiveInversion = function (hex_color) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        }
        catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    };
    Main.prototype.initToc = function (opts) {
        var _this = this;
        var tocs = window_3.$('#md-toc-items'), array = window_3.$('#content > *').not('#pager');
        for (var i = 0; i < array.length; i++) {
            var el = array[i];
            switch (el.tagName) {
                case 'H1':
                case 'H2':
                case 'H3':
                case 'H4':
                case 'H5':
                    tocs.append("<div id=\"" + ('toc-' + i) + "\" \n                        class=\"md-toc-item md-toc-" + el.tagName.toLowerCase() + "\">\n                            <p ref=\"#" + el.id + "\">" + el.textContent + "</p>\n                        </div>");
                    break;
                default:
                    break;
            }
        }
        if (this.tocFlag !== null) {
            dizmo_1.default.addMenuItem('/style/image/toc.svg', 'Table of Contents', function () {
                if (window_3.$('#front').css('display') !== 'none') {
                    if (_this.tocFlag !== true) {
                        _this.showToc(opts);
                    }
                    else {
                        _this.hideToc(opts);
                    }
                    _this.tocFlag = !_this.tocFlag;
                }
            });
        }
        var $toc_home = window_3.$('#md-toc-home');
        $toc_home.on('click', function () {
            _this.showPage(function (p, ps, go) {
                go.call(this, 0);
            });
            _this.highlight(window_3.$('.md-toc-item:first-of-type'));
        });
        var $toc_search = window_3.$('#md-toc-search');
        $toc_search.on('input', function () {
            if (window_3.$('#md-toc-search').val() === '') {
                window_3.$('.md-toc-item:has(p:not(:empty))').each(function () {
                    window_3.$(this).show();
                });
                if (_this.scroll2 !== undefined) {
                    _this.scroll2.refresh();
                }
            }
        });
        $toc_search.keyup(function (ev) {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27) {
                window_3.$('.md-toc-item:has(p:not(:empty))').each(function () {
                    window_3.$(this).show();
                });
                window_3.$('#md-toc-search').val('');
            }
            else {
                var rx_1 = new RegExp(window_3.$('#md-toc-search').val(), 'i');
                window_3.$('.md-toc-item:has(p:not(:empty))').each(function (i) {
                    var $item = window_3.$(this);
                    if (rx_1.source.length > 0 && i > 0) {
                        var text = $item.find('p').text();
                        if (text.match(rx_1)) {
                            $item.show();
                        }
                        else {
                            $item.hide();
                        }
                    }
                    else {
                        $item.show();
                    }
                });
                if (this.scroll2 !== undefined) {
                    this.scroll2.refresh();
                }
            }
        });
        var $tocItems = window_3.$('.md-toc-item');
        $tocItems.click(this.onTocItemClick.bind(this)).each(function () {
            if (window_3.$(this).find('p:empty').length > 0) {
                window_3.$(this).hide();
            }
        });
        this.highlight($tocItems.first());
        if (this.tocFlag) {
            this.showToc(opts);
        }
    };
    Main.prototype.showToc = function (opts) {
        var $toc_list = DizmoElements('#md-toc'), $toc_item = $toc_list.find('.md-toc-item');
        setTimeout(function () {
            if (!opts || !opts.no_resize) {
                var w = dizmo_1.default.get('geometry/width'), h = dizmo_1.default.get('geometry/height');
                dizmo_1.default.set('geometry/width', w + $toc_list.width());
                dizmo_1.default.set('geometry/height', h);
            }
            window_3.$('html, body').css('width', '100%');
            window_3.$('#content-wrap').css('width', 'calc(100% - 270px)');
            $toc_item.css('border-bottom', 'lightgray solid 1px');
            $toc_list.show();
        }, 0);
        var $toc_home = $toc_list.find('#md-toc-home');
        $toc_home.dbutton();
        var $toc_search = $toc_list.find('#md-toc-search');
        $toc_search.dsearchfield();
        $toc_search.focus();
    };
    Main.prototype.hideToc = function (opts) {
        var $toc_list = DizmoElements('#md-toc'), $toc_item = $toc_list.find('.md-toc-item');
        setTimeout(function () {
            if (!opts || !opts.no_resize) {
                var w = dizmo_1.default.get('geometry/width'), h = dizmo_1.default.get('geometry/height');
                dizmo_1.default.set('geometry/width', w - $toc_list.width());
                dizmo_1.default.set('geometry/height', h);
            }
            window_3.$('html, body')
                .css('width', '100%');
            window_3.$('#content-wrap')
                .css('width', 'calc(100% - 16px)');
            $toc_item.css('border-bottom', 'none');
            $toc_list.hide();
        }, 0);
    };
    Main.prototype.language = function (tpl) {
        if (typeof tpl === 'string') {
            return tpl.replace('${LANGUAGE}', this.dizmo.language);
        }
        else {
            return tpl;
        }
    };
    Main.prototype.resolve = function (href) {
        if (!href.match(/^\//) && !href.match(/^[a-z]+:\/\//i)) {
            var tpl_md = dizmo_1.default.internal.get('urlMd'), url_md = this.language(tpl_md), idx_md = url_md.split('/').pop();
            return url_md.replace(idx_md, '') + href;
        }
        else {
            return href;
        }
    };
    Object.defineProperty(Main.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (value) {
            this._page = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "scroll1", {
        get: function () {
            return this._scroll1;
        },
        set: function (value) {
            this._scroll1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "scroll1Opts", {
        get: function () {
            return dizmo_1.default.internal.get('scroll1', {
                fallback: false
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "scroll2", {
        get: function () {
            return this._scroll2;
        },
        set: function (value) {
            this._scroll2 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "scroll2Opts", {
        get: function () {
            return dizmo_1.default.internal.get('scroll2', {
                fallback: false
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "extraCss", {
        get: function () {
            return dizmo_1.default.internal.get('extraCss');
        },
        set: function (value) {
            dizmo_1.default.internal.set('extraCss', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "height", {
        get: function () {
            return dizmo_1.default.internal.get('height');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "urlCss", {
        get: function () {
            return dizmo_1.default.internal.get('urlCss');
        },
        set: function (value) {
            dizmo_1.default.internal.set('urlCss', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "urlBundleId", {
        get: function () {
            return dizmo_1.default.internal.get('urlBundleId', {
                fallback: 'http://store.dizmo.com/?bid='
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "urlMd", {
        get: function () {
            return dizmo_1.default.internal.get('urlMd');
        },
        set: function (value) {
            dizmo_1.default.internal.set('urlMd', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "tocFlag", {
        get: function () {
            return dizmo_1.default.internal.get('tocFlag');
        },
        set: function (value) {
            dizmo_1.default.internal.set('tocFlag', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "width", {
        get: function () {
            return dizmo_1.default.internal.get('width');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "dizmo", {
        get: function () {
            return window_1.default.global('DIZMO');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "editor", {
        get: function () {
            return this._editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "md2html", {
        get: function () {
            var _this = this;
            var renderer = new window_2.marked.Renderer();
            renderer.heading = function (text, level, raw) {
                var defaults = window_2.marked.defaults;
                if (level === 1) {
                    dizmo_1.default.setAttribute('settings/title', text);
                }
                return defaults.renderer.heading.call({
                    options: defaults
                }, text, level, raw);
            };
            renderer.html = function (html) {
                return html;
            };
            renderer.image = function (href, title, text) {
                var defaults = window_2.marked.defaults;
                return defaults.renderer.image.call({
                    options: defaults
                }, _this.resolve(href), title, text);
            };
            renderer.link = function (href, title, text) {
                var defaults = window_2.marked.defaults;
                return defaults.renderer.link.call({
                    options: defaults
                }, _this.resolve(href), title, text);
            };
            return {
                convert: function (mdValue) {
                    var html = window_2.marked(mdValue, { renderer: renderer });
                    window_1.default.global('HTML', html);
                    return html;
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Main = __decorate([
        trace_1.trace,
        named_1.named('Main'), 
        __metadata('design:paramtypes', [])
    ], Main);
    return Main;
}());
exports.Main = Main;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
//# sourceMappingURL=main.js.map