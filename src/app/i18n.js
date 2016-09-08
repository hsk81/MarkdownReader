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
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var I18N = (function () {
    function I18N(callback) {
        var _this = this;
        window_1.i18n(function (err, t) {
            var T = function (key, options) {
                if (options === void 0) { options = {}; }
                return t(key, window_1.$.extend({ keySeparator: '/' }, options));
            };
            if (typeof callback === 'function') {
                callback(T);
            }
            _this.translate(T);
        });
    }
    I18N.prototype.translate = function (T) {
        this.$back.find('.footer>.done')
            .html(T('#back/.footer/.done'));
    };
    Object.defineProperty(I18N.prototype, "$back", {
        get: function () {
            return window_1.$('#back');
        },
        enumerable: true,
        configurable: true
    });
    I18N = __decorate([
        trace_1.trace,
        named_1.named('I18N'), 
        __metadata('design:paramtypes', [Function])
    ], I18N);
    return I18N;
}());
exports.I18N = I18N;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = I18N;
//# sourceMappingURL=i18n.js.map