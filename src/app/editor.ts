import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('Editor')
export class Editor {
    public constructor() {
        this.events();
    }

    private events() {
        // TODO: implement!
    }

    public set value(value:string) {
        // TODO: implement!
    }
}

export default Editor;
