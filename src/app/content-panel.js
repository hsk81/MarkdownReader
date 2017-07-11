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
var viewer_1 = require("./sys/type/viewer");
var window_1 = require("./sys/type/window");
var dizmo_1 = require("./sys/type/dizmo");
var window_2 = require("./sys/type/window");
var named_1 = require("./sys/util/named");
var trace_1 = require("./sys/util/trace");
var color_1 = require("./color");
var language_1 = require("./language");
var md_renderer_1 = require("./md-renderer");
var ContentPanel = (function () {
    function ContentPanel() {
        this.members();
        this.events();
    }
    ContentPanel.prototype.members = function () {
        if (this.urlMd) {
            window_2.$('#url-md').val(this.urlMd);
        }
        if (this.urlCss) {
            window_2.$('#url-css').val(this.urlCss);
        }
        if (this.extraCss) {
            this.editor.value = this.extraCss;
        }
    };
    ContentPanel.prototype.events = function () {
        viewer_1.default.on('settings/language', this.onLanguage.bind(this));
        dizmo_1.default.on('settings/framecolor', this.onFrameColor.bind(this));
        dizmo_1.default.onShowFront(this.show.bind(this));
        this.show(null);
    };
    ContentPanel.prototype.onLanguage = function () {
        this.show({ no_resize: true });
    };
    ContentPanel.prototype.onFrameColor = function (path, value) {
        window_2.$('#content').find(':header,p')
            .css('color', color_1.Color.adapt(value));
    };
    ContentPanel.prototype.show = function (opts) {
        this.init();
        this.css();
        this.md(opts);
    };
    ContentPanel.prototype.init = function () {
        window_2.$('style#css').remove();
        window_2.$('style#extra').remove();
        window_2.$('#front').empty()
            .append('<div id="md-logo" style="background-image: {0}"></div>'
            .replace('{0}', 'url(style/image/tourguide-light.svg);'))
            .append('<div id="md-toc"><div id="md-toc-items"/></div>');
    };
    ContentPanel.prototype.css = function () {
        var extraCss = this.editor.value;
        if (extraCss && extraCss.length > 0) {
            this.extraCss = extraCss;
        }
        else {
            this.extraCss = null;
        }
        var urlCss = window_2.$('#url-css').val();
        if (urlCss && urlCss.length > 0) {
            window_2.$.ajax({
                success: function (value) {
                    window_2.$('head').append("<style id=\"css\">" + value + "</style>");
                },
                type: 'GET', url: language_1.Language.template(urlCss)
            }).always(function () {
                window_2.$('head').append("<style id=\"extra\">" + extraCss + "</style>");
            });
            this.urlCss = urlCss;
        }
        else {
            window_2.$('head').append("<style id=\"extra\">" + extraCss + "</style>");
            this.urlCss = null;
        }
    };
    ContentPanel.prototype.md = function (opts) {
        var _this = this;
        var urlMd = window_2.$('#url-md').val();
        if (urlMd && urlMd.length > 0) {
            setTimeout(function () {
                window_2.$.ajax({
                    success: function (value) {
                        _this.html(value);
                        _this.link();
                        _this.color();
                        _this.tocPanel.init(opts);
                        _this.pager.init();
                    },
                    type: 'GET', url: language_1.Language.template(urlMd)
                });
                _this.urlMd = urlMd;
            }, 1);
        }
        else {
            this.urlMd = null;
        }
    };
    ContentPanel.prototype.html = function (value) {
        window_2.$('#front').empty()
            .append('<div id="content-wrap"><div id="content">{0}</div></div>'
            .replace('{0}', md_renderer_1.MdRenderer.toHtml.convert(value)))
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
    };
    ContentPanel.prototype.link = function () {
        var _this = this;
        window_2.$('#content').find('a').click(function (ev) {
            var $target = window_2.$(ev.target);
            var href = $target.attr('href');
            if (href.indexOf(_this.urlBundleId) === 0) {
                var bs = viewer_1.default.getBundles();
                var bid = href
                    .replace(_this.urlBundleId, '');
                var bids = bs
                    .map(function (b) {
                    return b.identifier;
                });
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
    };
    ContentPanel.prototype.color = function () {
        this.onFrameColor('settings/framecolor', dizmo_1.default.get('settings/framecolor'));
    };
    Object.defineProperty(ContentPanel.prototype, "extraCss", {
        get: function () {
            return dizmo_1.default.internal.get('extraCss');
        },
        set: function (value) {
            dizmo_1.default.internal.set('extraCss', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "urlCss", {
        get: function () {
            return dizmo_1.default.internal.get('urlCss');
        },
        set: function (value) {
            dizmo_1.default.internal.set('urlCss', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "urlBundleId", {
        get: function () {
            return dizmo_1.default.internal.get('urlBundleId', {
                fallback: 'http://store.dizmo.com/?bid='
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "urlMd", {
        get: function () {
            return dizmo_1.default.internal.get('urlMd');
        },
        set: function (value) {
            dizmo_1.default.internal.set('urlMd', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "editor", {
        get: function () {
            return window_1.default.global('EDITOR');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "pager", {
        get: function () {
            return window_1.default.global('PAGER');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentPanel.prototype, "tocPanel", {
        get: function () {
            return window_1.default.global('TOC_PANEL');
        },
        enumerable: true,
        configurable: true
    });
    return ContentPanel;
}());
ContentPanel = __decorate([
    trace_1.trace,
    named_1.named('ContentPanel'),
    __metadata("design:paramtypes", [])
], ContentPanel);
exports.ContentPanel = ContentPanel;
exports.default = ContentPanel;
//# sourceMappingURL=content-panel.js.map