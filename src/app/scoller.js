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
var dizmo_1 = require('./sys/type/dizmo');
var window_1 = require('./sys/type/window');
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var Scroller = (function () {
    function Scroller(name, ref) {
        this._name = name;
        this._ref = ref;
    }
    Scroller.prototype.refresh = function (deep, ms) {
        if (deep === void 0) { deep = false; }
        if (ms === void 0) { ms = 200; }
        if (deep) {
            this.destroy();
            this.setup(ms);
        }
        else {
            if (this._scroll !== undefined) {
                this._scroll.refresh();
            }
        }
    };
    Scroller.prototype.setup = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = 200; }
        if (this.options) {
            setTimeout(function () {
                window_1.$(_this._ref).addClass('no-dizmo-drag');
                _this._scroll = new IScroll(_this._ref, _this.options);
            }, ms);
        }
    };
    Scroller.prototype.destroy = function () {
        if (this._scroll !== undefined) {
            this._scroll.destroy();
            this._scroll = undefined;
        }
    };
    Scroller.prototype.to = function ($el, dx, dy, dt) {
        if (dx === void 0) { dx = 0; }
        if (dy === void 0) { dy = 0; }
        if (dt === void 0) { dt = 600; }
        if (this._scroll !== undefined) {
            var id = $el.prop('id');
            if (id) {
                this._scroll.scrollToElement('#' + id, dt, dx, dy, IScroll.utils.ease.quadratic);
            }
        }
    };
    Object.defineProperty(Scroller.prototype, "options", {
        get: function () {
            return dizmo_1.default.internal.get(this._name, {
                fallback: false
            });
        },
        enumerable: true,
        configurable: true
    });
    Scroller = __decorate([
        trace_1.trace,
        named_1.named('Scroller'), 
        __metadata('design:paramtypes', [String, String])
    ], Scroller);
    return Scroller;
}());
exports.Scroller = Scroller;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Scroller;
//# sourceMappingURL=scoller.js.map