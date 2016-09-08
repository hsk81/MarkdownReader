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
var dizmo_1 = require('./sys/type/dizmo');
var trace_1 = require('./sys/util/trace');
var named_1 = require('./sys/util/named');
var Dizmo = (function () {
    function Dizmo() {
        this.attributes();
        this.events();
    }
    Dizmo.prototype.attributes = function () {
        dizmo_1.default.set('settings/usercontrols/allowresize', false);
    };
    Dizmo.prototype.events = function () {
        viewer_1.default.on('settings/displaymode', function (path, value) {
            dizmo_1.default.set('state/framehidden', value === 'presentation');
        });
        dizmo_1.default.canDock(false);
    };
    Dizmo = __decorate([
        trace_1.trace,
        named_1.named('Dizmo'), 
        __metadata('design:paramtypes', [])
    ], Dizmo);
    return Dizmo;
}());
exports.Dizmo = Dizmo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dizmo;
//# sourceMappingURL=dizmo.js.map