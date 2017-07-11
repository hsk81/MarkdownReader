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
Object.defineProperty(exports, "__esModule", { value: true });
var window_1 = require("./sys/type/window");
var dizmo_1 = require("./sys/type/dizmo");
var window_2 = require("./sys/type/window");
var named_1 = require("./sys/util/named");
var trace_1 = require("./sys/util/trace");
var color_1 = require("./color");
var scoller_1 = require("./scoller");
var TocPanel = (function () {
    function TocPanel() {
        this._scroller = new scoller_1.Scroller('scroll2', '#md-toc-items-wrap');
        this._menu_hide = null;
        this._menu_show = null;
        this._menu_id = null;
        this.events();
    }
    TocPanel.prototype.init = function (opts) {
        var _this = this;
        var tocs = window_2.$('#md-toc-items'), array = window_2.$('#content > *').not('#pager');
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
        this._menu_hide = function () {
            if (_this._menu_id) {
                dizmo_1.default.removeMenuItem(_this._menu_id);
                _this._menu_id = null;
            }
        };
        this._menu_show = function () {
            if (_this._menu_id === null) {
                _this._menu_id = dizmo_1.default.addMenuItem('/style/image/toc.svg', _this.T('#dizmo/menu/toc'), function () {
                    if (window_2.$('#front').css('display') !== 'none') {
                        if (_this.flag !== true) {
                            _this.show(opts);
                        }
                        else {
                            _this.hide(opts);
                        }
                        _this.flag = !_this.flag;
                    }
                });
            }
        };
        if (this.flag !== null) {
            this._menu_show();
        }
        var $toc_home = window_2.$('#md-toc-home');
        $toc_home.on('click', function () {
            _this.pager.showPage(function (p, ps, go) {
                go.call(this, 0);
            });
            _this.highlight(window_2.$('.md-toc-item:first-of-type'));
        });
        var $toc_search = window_2.$('#md-toc-search');
        $toc_search.on('input', function () {
            if (window_2.$('#md-toc-search').val() === '') {
                window_2.$('.md-toc-item:has(p:not(:empty))').each(function () {
                    window_2.$(this).show();
                });
                _this.scroller.refresh();
            }
        });
        $toc_search.keyup(function (ev) {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27) {
                window_2.$('.md-toc-item:has(p:not(:empty))').each(function () {
                    window_2.$(this).show();
                });
                window_2.$('#md-toc-search').val('');
            }
            else {
                var rx_1 = new RegExp(window_2.$('#md-toc-search').val(), 'i');
                window_2.$('.md-toc-item:has(p:not(:empty))').each(function (i) {
                    var $item = window_2.$(this);
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
                this.scroller.refresh();
            }
        });
        var $tocItems = window_2.$('.md-toc-item');
        $tocItems.click(this.onItemClick.bind(this)).each(function () {
            if (window_2.$(this).find('p:empty').length > 0) {
                window_2.$(this).hide();
            }
        });
        this.highlight($tocItems.first());
        if (this.flag) {
            this.show(opts);
        }
        this.scroller.refresh(true);
    };
    TocPanel.prototype.hideMenu = function () {
        if (this._menu_hide) {
            this._menu_hide();
        }
    };
    TocPanel.prototype.showMenu = function () {
        if (this._menu_show) {
            this._menu_show();
        }
    };
    TocPanel.prototype.show = function (opts) {
        var $toc_list = DizmoElements('#md-toc'), $toc_item = $toc_list.find('.md-toc-item');
        setTimeout(function () {
            if (!opts || !opts.no_resize) {
                var w = dizmo_1.default.get('geometry/width'), h = dizmo_1.default.get('geometry/height');
                dizmo_1.default.set('geometry/width', w + $toc_list.width());
                dizmo_1.default.set('geometry/height', h);
            }
            window_2.$('html, body').css('width', '100%');
            window_2.$('#content-wrap').css('width', 'calc(100% - 270px)');
            $toc_item.css('border-bottom', 'lightgray solid 1px');
            $toc_list.show();
        }, 0);
        var $toc_home = $toc_list.find('#md-toc-home');
        $toc_home.dbutton();
        var $toc_search = $toc_list.find('#md-toc-search');
        $toc_search.dsearchfield();
        $toc_search.focus();
    };
    TocPanel.prototype.hide = function (opts) {
        var $toc_list = DizmoElements('#md-toc'), $toc_item = $toc_list.find('.md-toc-item');
        setTimeout(function () {
            if (!opts || !opts.no_resize) {
                var w = dizmo_1.default.get('geometry/width'), h = dizmo_1.default.get('geometry/height');
                dizmo_1.default.set('geometry/width', w - $toc_list.width());
                dizmo_1.default.set('geometry/height', h);
            }
            window_2.$('html, body')
                .css('width', '100%');
            window_2.$('#content-wrap')
                .css('width', 'calc(100% - 16px)');
            $toc_item.css('border-bottom', 'none');
            $toc_list.hide();
        }, 0);
    };
    TocPanel.prototype.activate = function (page) {
        var $toc_item = window_2.$(window_2.$('.md-toc-h3')[page]);
        this.scrollTo($toc_item);
        this.highlight($toc_item);
    };
    Object.defineProperty(TocPanel.prototype, "hidden", {
        get: function () {
            return this.flag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TocPanel.prototype, "scroller", {
        get: function () {
            return this._scroller;
        },
        enumerable: true,
        configurable: true
    });
    TocPanel.prototype.events = function () {
        dizmo_1.default.on('settings/framecolor', this.onFrameColor.bind(this));
        window_2.$(document).on('paged', this.onPaged.bind(this));
    };
    TocPanel.prototype.onFrameColor = function (path, value) {
        window_2.$('#md-toc').css('color', color_1.Color.adapt(value));
    };
    TocPanel.prototype.onPaged = function (ev, info) {
        if (info) {
            this.activate(info.page);
        }
    };
    TocPanel.prototype.onItemClick = function (ev) {
        var $content = window_2.$('#content'), $pager = window_2.$('#pager');
        var ref = window_2.$(ev.target).attr('ref');
        if (ref) {
            var $el = window_2.$(ref), $header_1;
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
                    this.pager.showPage(function (p, ps, go) {
                        var new_page = $content.find('>h3').index($header_1);
                        go.call(this, new_page, p);
                    });
                }
                $content.animate({
                    scrollTop: $el.offset().top
                }, 375);
                this.highlight(window_2.$(ev.target).parent());
            }
        }
        return false;
    };
    TocPanel.prototype.scrollTo = function ($item) {
        this.scroller.to($item, 0, -3 * $item.height() - 6);
    };
    TocPanel.prototype.highlight = function ($item) {
        window_2.$('.md-toc-item').removeClass('highlight');
        $item.addClass('highlight');
    };
    Object.defineProperty(TocPanel.prototype, "pager", {
        get: function () {
            return window_1.default.global('PAGER');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TocPanel.prototype, "flag", {
        get: function () {
            return dizmo_1.default.internal.get('tocFlag');
        },
        set: function (value) {
            dizmo_1.default.internal.set('tocFlag', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TocPanel.prototype, "T", {
        get: function () {
            return window_1.default.global('T');
        },
        enumerable: true,
        configurable: true
    });
    return TocPanel;
}());
TocPanel = __decorate([
    trace_1.trace,
    named_1.named('TocPanel'),
    __metadata("design:paramtypes", [])
], TocPanel);
exports.TocPanel = TocPanel;
exports.default = TocPanel;
//# sourceMappingURL=toc-panel.js.map