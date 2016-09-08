import {TranslationFunction} from './sys/type/window';
import {TranslationOptions} from './sys/type/window';
import {i18n, $} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('I18N')
export class I18N {
    public constructor(callback:(T:TranslationFunction) => void) {
        i18n((err:any, t:TranslationFunction):void => {
            let T:TranslationFunction =
                (key:string, options:TranslationOptions = {}):string => {
                    return t(key, $.extend({keySeparator: '/'}, options));
                };
            if (typeof callback === 'function') {
                callback(T);
            }
            this.translate(T);
        });
    }

    private translate(T:TranslationFunction) {
        this.$back.find('.footer>.done')
            .html(T('#back/.footer/.done'));
    }

    private get $back():JQuery {
        return $('#back');
    }
}

export {TranslationFunction};
export {TranslationOptions};

export default I18N;
