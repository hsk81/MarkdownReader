import window from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('Reader')
export class Reader {
    public constructor() {
        this.globals();
    }

    private globals() {
        let MarkdownReader = window.global<any>('MarkdownReader');
        if (MarkdownReader === undefined) {
            window.global('MarkdownReader', { // for hooks.js!
                my: {
                    lhsPageTo: undefined,
                    rhsPageTo: undefined
                }
            });
        }
    }

}

export default Reader;
