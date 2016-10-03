import window from './sys/type/window';

import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('MdReader')
export class MdReader {
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

export default MdReader;
