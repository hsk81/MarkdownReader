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
var Main = (function () {
    function Main() {
        this.events();
    }
    Main.prototype.events = function () {
        window_2.$('#back').find('.done').on('click', this.onDoneClick.bind(this));
        dizmo_1.default.onShowBack(this.onShowBack.bind(this));
    };
    Main.prototype.onDoneClick = function () {
        dizmo_1.default.showFront();
    };
    Main.prototype.onShowBack = function (opts) {
        dizmo_1.default.set('settings/title', 'Markdown Reader');
        this.editor.refresh();
        if (this.tocPanel.hidden) {
            this.tocPanel.hide(opts);
        }
    };
    Object.defineProperty(Main.prototype, "editor", {
        get: function () {
            return window_1.default.global('EDITOR');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "tocPanel", {
        get: function () {
            return window_1.default.global('TOC_PANEL');
        },
        enumerable: true,
        configurable: true
    });
    return Main;
}());
Main = __decorate([
    trace_1.trace,
    named_1.named('Main'),
    __metadata("design:paramtypes", [])
], Main);
exports.Main = Main;
exports.default = Main;
//# sourceMappingURL=main.js.map