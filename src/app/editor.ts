import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

@trace
@named('Editor')
export class Editor {
    public constructor() {
        this.events();
    }

    public refresh() {
        // TODO: implement!
    }

    private events() {
        // TODO: implement!
    }

    public get value():string {
        return ''; // TODO: implement!
    }

    public set value(value:string) {
        // TODO: implement!
    }

}

export default Editor;
