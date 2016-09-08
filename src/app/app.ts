import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {after} from './sys/util/after';
import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {I18N, TranslationFunction} from './i18n';
import {Dizmo} from './dizmo';
import {Main} from './main';

@trace
@named('App')
export class App {
    public constructor() {
        this.globals();
        this.events();
    }

    private globals() {
        window.global('DIZMO', new Dizmo());
        window.global('MAIN', new Main());
    }

    private events() {
        window.showBack = () => {
            dizmo.showBack();
        };
        window.showFront = () => {
            dizmo.showFront();
        };
    }
}

document.addEventListener('dizmoready', () => {
    if (window.global('I18N') === undefined) {
        let on_i18n = (T:TranslationFunction) => {
            window.global('T', T);
        };

        window.global('I18N', new I18N(after(on_i18n, () => {
            window.global('APP', new App());
        })));
    }
});

export default App;
