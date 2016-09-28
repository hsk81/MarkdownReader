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
var language_1 = require('./language');
var MdRenderer = (function () {
    function MdRenderer() {
    }
    Object.defineProperty(MdRenderer, "toHtml", {
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
    MdRenderer.resolve = function (href) {
        if (!href.match(/^\//) && !href.match(/^[a-z]+:\/\//i)) {
            var tpl_md = dizmo_1.default.internal.get('urlMd'), url_md = language_1.Language.template(tpl_md), idx_md = url_md.split('/').pop();
            return url_md.replace(idx_md, '') + href;
        }
        else {
            return href;
        }
    };
    MdRenderer = __decorate([
        trace_1.trace,
        named_1.named('MdRenderer'), 
        __metadata('design:paramtypes', [])
    ], MdRenderer);
    return MdRenderer;
}());
exports.MdRenderer = MdRenderer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MdRenderer;
//# sourceMappingURL=md-renderer.js.map