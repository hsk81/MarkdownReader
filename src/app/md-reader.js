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
var named_1 = require("./sys/util/named");
var trace_1 = require("./sys/util/trace");
var MdReader = (function () {
    function MdReader() {
        this.globals();
    }
    MdReader.prototype.globals = function () {
        var MarkdownReader = window_1.default.global('MarkdownReader');
        if (MarkdownReader === undefined) {
            window_1.default.global('MarkdownReader', {
                my: {
                    lhsPageTo: undefined,
                    rhsPageTo: undefined
                }
            });
        }
    };
    return MdReader;
}());
MdReader = __decorate([
    trace_1.trace,
    named_1.named('MdReader'),
    __metadata("design:paramtypes", [])
], MdReader);
exports.MdReader = MdReader;
exports.default = MdReader;
//# sourceMappingURL=md-reader.js.map