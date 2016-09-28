import window from './sys/type/window';
import {named} from './sys/util/named';
import {trace} from './sys/util/trace';
import {Dizmo} from './dizmo';

@trace
@named('Language')
export class Language {
    public static template(tpl:string):string {
        if (typeof tpl === 'string') {
            return tpl.replace ('${LANGUAGE}', this.dizmo.language);
        } else {
            return tpl;
        }
    }

    private static get dizmo():Dizmo {
        return window.global<Dizmo>('DIZMO');
    }
}

export default Language;
