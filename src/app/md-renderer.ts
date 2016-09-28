import window from './sys/type/window';
import dizmo from './sys/type/dizmo';

import {marked} from './sys/type/window';
import {named} from './sys/util/named';
import {trace} from './sys/util/trace';

import {Language} from './language';

@trace
@named('MdRenderer')
export class MdRenderer {
    public static get toHtml(): {
        convert: (mdValue:string) => string;
    } {
        let renderer = new marked.Renderer();
        renderer.heading = (text:string, level:number, raw:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            if (level === 1) {
                dizmo.setAttribute('settings/title', text);
            }
            return defaults.renderer.heading.call({
                options: defaults
            }, text, level, raw);
        };
        renderer.html = (html:string) => {
            return html;
        };
        renderer.image = (href:string, title:string, text:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            return defaults.renderer.image.call({
                options: defaults
            }, this.resolve(href), title, text);
        };
        renderer.link = (href:string, title:string, text:string) => {
            let defaults = (marked as any).defaults as {
                renderer: MarkedRenderer
            };
            return defaults.renderer.link.call({
                options: defaults
            }, this.resolve(href), title, text);
        };
        return {
            convert: function (mdValue:string) {
                let html:string = marked(mdValue, {renderer: renderer});
                window.global('HTML', html);
                return html;
            }
        };
    }

    private static resolve(href:string):string {
        if (!href.match(/^\//) && !href.match(/^[a-z]+:\/\//i)) {
            let tpl_md = dizmo.internal.get<string>('urlMd'),
                url_md = Language.template(tpl_md) as string,
                idx_md = url_md.split('/').pop();

            return url_md.replace(idx_md, '') + href;
        } else {
            return href;
        }
    }
}

export default MdRenderer;
