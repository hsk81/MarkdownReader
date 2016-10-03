import window from './sys/type/window';
import bundle from './sys/type/bundle';
import dizmo from './sys/type/dizmo';

import {$} from './sys/type/window';

import {after} from './sys/util/after';
import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {I18N, TranslationFunction} from './i18n';
import {ContentPanel} from './content-panel';
import {TocPanel} from './toc-panel';
import {MdReader} from './md-reader';
import {MdRenderer} from './md-renderer';
import {Dizmo} from './dizmo';
import {Main} from './main';
import {Pager} from './pager';
import {Editor} from './editor';

@trace
@named('App')
export class App {
    public constructor() {
        this.globals();
    }

    private globals() {
        window.global('MD_RENDERER', new MdRenderer());
        window.global('MD_READER', new MdReader());
        window.global('DIZMO', new Dizmo());
        window.global('EDITOR', new Editor());
        window.global('CONTENT_PANEL', new ContentPanel());
        window.global('TOC_PANEL', new TocPanel());
        window.global('PAGER', new Pager());
        window.global('MAIN', new Main());
    }
}

document.addEventListener('dizmoready', () => {
    if (window.global('I18N') === undefined) {
        let on_i18n = (T:TranslationFunction) => {
            window.global('T', T);
        };

        window.global('I18N', new I18N(after(on_i18n, () => {
            $.get('assets/settings.json').done((json:string|any) => {
                if ($.isPlainObject(json) === false) {
                    json = JSON.parse(json);
                }

                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let value = dizmo.internal.get(key);
                        if (value !== undefined && value !== null) {
                            if (typeof value === 'object') {
                                json[key] = $.extend(true, json[key], value);
                            } else {
                                json[key] = value;
                            }
                        }
                        dizmo.internal.set(key, json[key]);
                    }
                }

                if (dizmo.internal.get('showBack') === true) {
                    window.showBack = function () {
                        dizmo.showBack();
                    };
                }
                if (dizmo.internal.get('showFront') === true) {
                    window.showFront = function () {
                        dizmo.showFront();
                    };
                }

                let width = bundle.get('width');
                if (typeof width === 'number') {
                    dizmo.set('geometry/width', width);
                }
                let height = bundle.get('height');
                if (typeof height === 'number') {
                    dizmo.set('geometry/height', height);
                }

                window.global('APP', new App());
            });

            window.global('EVAL', eval);
        })));
    }
});

export default App;
