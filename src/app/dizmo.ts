import viewer from './sys/type/viewer';
import dizmo from './sys/type/dizmo';

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
    }

    private events() {
        viewer.on('settings/displaymode', (path:string, value:any) => {
            dizmo.set('state/framehidden', value === 'presentation');
        });
        dizmo.canDock(false);
    }
}

export default Dizmo;
