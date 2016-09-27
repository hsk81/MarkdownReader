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
        if (typeof CodeMirror !== 'undefined') {
            this.editor = CodeMirror.fromTextArea(this.ta, {
                lineNumbers: true,
                lineWrapping: true,
                matchBrackets: true,
                mode: 'css',
                styleActiveLine: true
            });
        }
        this.value = this.content;
    }
    Editor.prototype.refresh = function () {
        if (this.editor !== undefined) {
            this.editor.refresh();
        }
    };
    Object.defineProperty(Editor.prototype, "editor", {
        get: function () {
            return this._editor;
        },
        set: function (value) {
            this._editor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "value", {
        get: function () {
            if (this.editor !== undefined) {
                return this.editor.getValue();
            }
            else {
                return this.ta.value;
            }
        },
        set: function (value) {
            if (this.editor) {
                this.editor.setValue(value);
            }
            else {
                this.ta.value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "ta", {
        get: function () {
            return document.getElementById('editor');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "content", {
        get: function () {
            return [
                '/**\n',
                ' * Extra CSS: front, content, headers etc.\n',
                ' */\n',
                '\n',
                '#front {\n',
                '  /* front side styles */\n',
                '}\n',
                '\n',
                '#content {\n',
                '  /* content styles (on front side) */\n',
                '}\n'
            ].join('');
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