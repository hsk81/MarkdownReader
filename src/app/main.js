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
    Main.prototype.getAdaptiveColor = function (hex_color) {
        try {
            return (exports.Colors.hex2bright(hex_color.slice(0, 7))) ?
                '#3d3d3d' : '#e6e6e6';
        }
        catch (ex) {
            console.error(ex);
        }
        return '#3d3d3d';
    };
    Main.prototype.getAdaptiveInversion = function (hex_color) {
        try {
            return (exports.Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        }
        catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    };
    Main.prototype.onShowBack = function (opts) {
        // TODO: implement!
    };
    Main.prototype.onShowFront = function (opts) {
        // TODO: implement!
    };
    Main.prototype.onDoneClick = function () {
        dizmo_1.default.showFront();
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
                    return window_2.marked(mdValue, { renderer: renderer });
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