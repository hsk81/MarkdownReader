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
var dizmo_1 = require("./sys/type/dizmo");
var window_1 = require("./sys/type/window");
var trace_1 = require("./sys/util/trace");
var named_1 = require("./sys/util/named");
var Dizmo = (function () {
    function Dizmo() {
        this.attributes();
        this.events();
    }
    Dizmo.prototype.attributes = function () {
        dizmo_1.default.set('settings/usercontrols/allowresize', false);
        var h = dizmo_1.default.get('geometry/height'), w = dizmo_1.default.get('geometry/width');
        var $html = window_1.$('html');
        $html.css('height', h - 16);
        $html.css('width', w - 16);
        var $body = window_1.$('body');
        $body.css('height', h - 16);
        $body.css('width', w - 16);
    };
    Dizmo.prototype.events = function () {
        viewer_1.default.on('settings/displaymode', function (path, value) {
            dizmo_1.default.set('state/framehidden', value === 'presentation');
        });
        dizmo_1.default.canDock(false);
    };
    Object.defineProperty(Dizmo.prototype, "language", {
        get: function () {
            var lingua = viewer_1.default.get('settings/language') || 'en', linguae = dizmo_1.default.internal.get('languages', {
                fallback: { 'en': 'en' }
            });
            return linguae[lingua] || 'en';
        },
        enumerable: true,
        configurable: true
    });
    return Dizmo;
}());
Dizmo = __decorate([
    trace_1.trace,
    named_1.named('Dizmo'),
    __metadata("design:paramtypes", [])
], Dizmo);
exports.Dizmo = Dizmo;
exports.default = Dizmo;
//# sourceMappingURL=dizmo.js.map