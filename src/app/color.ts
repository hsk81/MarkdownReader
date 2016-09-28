import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

declare let Colors:any;

@trace
@named('Color')
export class Color {
    public static adapt(hex_color:string):string {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                '#3d3d3d' : '#e6e6e6';
        } catch (ex) {
            console.error(ex);
        }
        return '#3d3d3d';
    }

    public static invert(hex_color:string) {
        try {
            return (Colors.hex2bright(hex_color.slice(0, 7))) ?
                'invert(0.0)' : 'invert(1.0)';
        } catch (ex) {
            console.error(ex);
        }
        return 'invert(0.0)';
    }
}

export default Color;
