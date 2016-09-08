import dizmo from './sys/type/dizmo';
import {$} from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('Main')
export class Main {
    public constructor() {
        this.events();
    }

    private events() {
        this.$done
            .on('click', this.onDoneClick.bind(this));
    }

    private onDoneClick() {
        dizmo.showFront();
    }

    private get $back() {
        return $('#back');
    }

    private get $done() {
        return this.$back.find('.done');
    }
}

export default Main;
