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
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var Editor = (function () {
    function Editor() {
        this.events();
    }
    Editor.prototype.refresh = function () {
        // TODO: implement!
    };
    Editor.prototype.events = function () {
        // TODO: implement!
    };
    Object.defineProperty(Editor.prototype, "value", {
        get: function () {
            return ''; // TODO: implement!
        },
        set: function (value) {
            // TODO: implement!
        },
        enumerable: true,
        configurable: true
    });
    Editor = __decorate([
        trace_1.trace,
        named_1.named('Editor'), 
        __metadata('design:paramtypes', [])
    ], Editor);
    return Editor;
}());
exports.Editor = Editor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Editor;
//# sourceMappingURL=editor.js.map