import window from './sys/type/window';
import viewer from './sys/type/viewer';
import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {trace} from './sys/util/trace';
import {named} from './sys/util/named';

@trace
@named('Dizmo')
export class Dizmo {
    public constructor() {
        this.attributes();
        this.events();
    }

    private attributes() {
        dizmo.set('settings/usercontrols/allowresize', false);
        let h = dizmo.get<number>('geometry/height'),
            w = dizmo.get<number>('geometry/width');

        let $html = $('html');
        $html.css('height', h - 16);
        $html.css('width', w - 16);

        let $body = $('body');
        $body.css('height', h - 16);
        $body.css('width', w - 16);
    }

    private events() {
        dizmo.onShowBack(() => {
            $(window.global<any>('events'))
                .trigger('dizmo.turned', ['back']);
        });
        dizmo.onShowFront(() => {
            $(window.global<any>('events'))
                .trigger('dizmo.turned', ['front']);
        });
        dizmo.on('settings/framecolor', (path:string, value:string) => {
            $(window.global<any>('events'))
                .trigger('dizmo.framecolor', [value]);
        });
        viewer.on('settings/language', (path:string, value:string) => {
            $(window.global<any>('events'))
                .trigger('dizmo.onlanguagechanged', [value]);
        });
        viewer.on('settings/displaymode', (path:string, value:any) => {
            dizmo.set('state/framehidden', value === 'presentation');
        });
        dizmo.canDock(false);
    }

    public get language():string {
        let lingua = viewer.get<string>('settings/language') || 'en',
            linguae = dizmo.internal.get<any>('languages', {
                fallback: {'en': 'en'}
            });

        return linguae[lingua] || 'en';
    }
}

export default Dizmo;
