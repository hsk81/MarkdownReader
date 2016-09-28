import window from './sys/type/window';
import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Editor} from './editor';
import {TocPanel} from './toc-panel';

@trace
@named('Main')
export class Main {
    public constructor() {
        this.events();
    }

    private events() {
        $('#back').find('.done').on(
            'click', this.onDoneClick.bind(this));
        dizmo.onShowBack(
            this.onShowBack.bind(this));
    }

    private onDoneClick() {
        dizmo.showFront();
    }

    private onShowBack(opts:any) {
        dizmo.set('settings/title', 'Markdown Reader');
        this.editor.refresh();

        if (this.tocPanel.hidden) {
            this.tocPanel.hide(opts);
        }
    }

    private get editor():Editor {
        return window.global<Editor>('EDITOR');
    }

    private get tocPanel():TocPanel {
        return window.global<TocPanel>('TOC_PANEL');
    }
}

export default Main;
