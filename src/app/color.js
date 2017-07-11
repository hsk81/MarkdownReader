"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var named_1 = require("./sys/util/named");
var trace_1 = require("./sys/util/trace");
var Color = (function () {
    function Color() {
    }
    Color.adapt = function (hex_color) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                '#3d3d3d' : '#e6e6e6';
        }
        catch (ex) {
            console.error(ex);
        }
        return '#3d3d3d';
    };
    Color.invert = function (hex_color) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        }
        catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    };
    return Color;
}());
Color = __decorate([
    trace_1.trace,
    named_1.named('Color')
], Color);
exports.Color = Color;
exports.default = Color;
//# sourceMappingURL=color.js.map