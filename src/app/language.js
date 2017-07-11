"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var window_1 = require("./sys/type/window");
var named_1 = require("./sys/util/named");
var trace_1 = require("./sys/util/trace");
var Language = (function () {
    function Language() {
    }
    Language.template = function (tpl) {
        if (typeof tpl === 'string') {
            return tpl.replace('${LANGUAGE}', this.dizmo.language);
        }
        else {
            return tpl;
        }
    };
    Object.defineProperty(Language, "dizmo", {
        get: function () {
            return window_1.default.global('DIZMO');
        },
        enumerable: true,
        configurable: true
    });
    return Language;
}());
Language = __decorate([
    trace_1.trace,
    named_1.named('Language')
], Language);
exports.Language = Language;
exports.default = Language;
//# sourceMappingURL=language.js.map