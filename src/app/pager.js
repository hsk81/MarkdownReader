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
var window_1 = require('./sys/type/window');
var dizmo_1 = require('./sys/type/dizmo');
var window_2 = require('./sys/type/window');
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var color_1 = require('./color');
var Pager = (function () {
    function Pager() {
        this.events();
    }
    Pager.prototype.init = function () {
        var _this = this;
        var $pager = window_2.$('#pager');
        if ($pager.length > 0) {
            $pager.appendTo('#front');
            window_2.$('#pager-lhs').click(this.onLhsClick.bind(this));
            window_2.$('#pager-rhs').click(this.onRhsClick.bind(this));
            window_2.$(document).keydown(function (ev) {
                var display = window_2.$('#front').css('display');
                if (display === 'block') {
                    var keyCode = ev.keyCode || ev.which;
                    if (keyCode === 37) {
                        _this.onLhsClick();
                    }
                    if (keyCode === 39) {
                        _this.onRhsClick();
                    }
                }
            });
            this.showPage(function (p, ps, go) {
                go.call(this, 0);
            });
        }
    };
    Pager.prototype.showPage = function (counter) {
        var $items = window_2.$('#content > *'), $pages = window_2.$('#content').find('> h3'), $pager = window_2.$('#pager');
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
                window_2.$('#pager-lhs').attr('disabled', 'disabled');
            }
            else {
                window_2.$('#pager-lhs').removeAttr('disabled');
            }
            var max_page = $pages.length - 1;
            if (max_page === new_page) {
                window_2.$('#pager-rhs').attr('disabled', 'disabled');
            }
            else {
                window_2.$('#pager-rhs').removeAttr('disabled');
            }
            var head = function (h2s) {
                return window_2.$(h2s).first('h2').nextUntil('h3').addBack();
            };
            var i = 0, j = 0, flag = {};
            for (var page = 0; page < $pages.length; page++) {
                if ($h2s[i].$h3s[j] === undefined) {
                    i += 1;
                    j = 0;
                }
                if (page === new_page) {
                    var h1_text = $items.first('h1').text(), h2_text = window_2.$($h2s[i]).first('h2').text();
                    if (h2_text.length > 0 && h2_text !== ' ') {
                        dizmo_1.default.setAttribute('settings/title', h1_text + ": " + h2_text);
                    }
                    else {
                        dizmo_1.default.setAttribute('settings/title', "" + h1_text);
                    }
                    flag[i] = true;
                    head($h2s[i]).show();
                    window_2.$($h2s[i].$h3s[j]).show();
                }
                else {
                    if (!flag[i]) {
                        head($h2s[i]).hide();
                    }
                    window_2.$($h2s[i].$h3s[j]).hide();
                }
                j += 1;
            }
            if ($pager.length > 0 && new_page !== old_page) {
                $pager.trigger('turn:after', [
                    new_page, old_page, $pages.length
                ]);
            }
            if (this.scroll !== undefined) {
                this.scroll.refresh();
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
    Pager.prototype.events = function () {
        dizmo_1.default.on('settings/framecolor', this.onFrameColor.bind(this));
    };
    Pager.prototype.onFrameColor = function (path, value) {
        window_2.$('#pager-idx').css('color', color_1.Color.adapt(value));
        window_2.$('#pager-lhs').css('-webkit-filter', color_1.Color.invert(value));
        window_2.$('#pager-rhs').css('-webkit-filter', color_1.Color.invert(value));
    };
    Pager.prototype.onLhsClick = function () {
        var MarkdownReader = window_1.default.global('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.lhsPageTo === 'function') {
            this.showPage(MarkdownReader.my.lhsPageTo);
        }
        else {
            this.showPage(function (p, ps, go) {
                if (window_2.$('#pager-lhs').attr('disabled') !== 'disabled') {
                    go.call(this, (p - 1 >= 0) ? p - 1 : 0, p);
                }
            });
        }
        window_2.$('#content').animate({
            scrollTop: 0
        }, 0);
        window_2.$(document).trigger('paged', { page: this.page });
        return false;
    };
    Pager.prototype.onRhsClick = function () {
        var MarkdownReader = window_1.default.global('MarkdownReader');
        if (MarkdownReader && MarkdownReader.my &&
            typeof MarkdownReader.my.rhsPageTo === 'function') {
            this.showPage(MarkdownReader.my.rhsPageTo);
        }
        else {
            this.showPage(function (p, ps, go) {
                if (window_2.$('#pager-rhs').attr('disabled') !== 'disabled') {
                    go.call(this, (p + 1 < ps) ? p + 1 : p, p);
                }
            });
        }
        window_2.$('#content').animate({
            scrollTop: 0
        }, 0);
        window_2.$(document).trigger('paged', { page: this.page });
        return false;
    };
    Pager.prototype.group = function (array, by) {
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
        return window_2.$(groups);
    };
    Object.defineProperty(Pager.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (value) {
            this._page = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        trace_1.traceable(false), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Function]), 
        __metadata('design:returntype', Object)
    ], Pager.prototype, "group", null);
    Pager = __decorate([
        trace_1.trace,
        named_1.named('Pager'), 
        __metadata('design:paramtypes', [])
    ], Pager);
    return Pager;
}());
exports.Pager = Pager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pager;
//# sourceMappingURL=pager.js.map