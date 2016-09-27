import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

export declare let CodeMirror:any;

@trace
@named('Editor')
export class Editor {
    private _editor:any;

    public constructor() {
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

    public refresh() {
        if (this.editor !== undefined) {
            this.editor.refresh();
        }
    }

    public get editor():any {
        return this._editor;
    }

    public set editor(value: any) {
        this._editor = value;
    }

    public get value():string {
        if (this.editor !== undefined) {
            return this.editor.getValue();
        } else {
            return this.ta.value;
        }
    }

    public set value(value:string) {
        if (this.editor) {
            this.editor.setValue(value);
        } else {
            this.ta.value = value;
        }
    }

    private get ta():HTMLTextAreaElement {
        return document.getElementById('editor') as HTMLTextAreaElement;
    }

    private get content():string {
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
        ].join ('');
    }
}

export default Editor;
