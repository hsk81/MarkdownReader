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
var dizmo_1 = require('./sys/type/dizmo');
var after_1 = require('./sys/util/after');
var named_1 = require('./sys/util/named');
var trace_1 = require('./sys/util/trace');
var i18n_1 = require('./i18n');
var reader_1 = require('./reader');
var dizmo_2 = require('./dizmo');
var main_1 = require('./main');
var App = (function () {
    function App() {
        this.globals();
        this.events();
    }
    App.prototype.globals = function () {
        window_1.default.global('READER', new reader_1.Reader());
        window_1.default.global('DIZMO', new dizmo_2.Dizmo());
        window_1.default.global('MAIN', new main_1.Main());
    };
    App.prototype.events = function () {
        window_1.default.showBack = function () {
            dizmo_1.default.showBack();
        };
        window_1.default.showFront = function () {
            dizmo_1.default.showFront();
        };
    };
    App = __decorate([
        trace_1.trace,
        named_1.named('App'), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}());
exports.App = App;
document.addEventListener('dizmoready', function () {
    if (window_1.default.global('I18N') === undefined) {
        var on_i18n = function (T) {
            window_1.default.global('T', T);
        };
        window_1.default.global('I18N', new i18n_1.I18N(after_1.after(on_i18n, function () {
            window_1.default.global('APP', new App());
        })));
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
//# sourceMappingURL=app.js.map