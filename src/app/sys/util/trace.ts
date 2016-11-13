/* tslint:disable:no-string-literal one-line no-console */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import bundle from '../type/bundle';
import window from '../type/window';

import './random';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function trace(
    flag:boolean):Function;
export function trace(
    ctor:Function):void;
export function trace(
    arg:boolean|Function):Function|void
{
    if (typeof arg === 'boolean') {
        return _trace(arg);
    } else {
        _trace(true)(<Function>arg);
    }
}

function _trace(flag:boolean):Function {
    return function (ctor:Function) {
        Object.keys(ctor.prototype).forEach((key:string) => {
            let dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach((key:string) => {
            let dtor = Object.getOwnPropertyDescriptor(ctor, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag)(ctor, key);
            }
        });
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function traceable(
    flag:boolean):Function;
export function traceable(
    target:any, key:string, dtor?:PropertyDescriptor):void;
export function traceable(
    arg:boolean|any, key?:string, dtor?:PropertyDescriptor
):Function|void {
    if (typeof arg === 'boolean') {
        return _traceable(arg);
    } else {
        _traceable(true)(<any>arg, key, dtor);
    }
}

function _traceable(flag:boolean):Function {
    let f0 = bundle.external.get('TRACE', {
        fallback: window.global<boolean>('TRACE')
    });
    return function (target:any, key:string, dtor?:PropertyDescriptor) {
        let wrap = (fn:Function, callback:Function) => {
            if (!flag) {
                (<any>fn)['_traced'] = false;
            } else {
                if ((<any>fn)['_traced'] === undefined) {
                    (<any>fn)['_traced'] = true;

                    let tn:Function = function (...args:any[]) {
                        let f1 = window.global<boolean>('TRACE');
                        if (f0 !== false && f1 !== false && (f0 || f1)) {
                            let _named = target._named || '@',
                                random = String.random(4, 16),
                                dt_beg = new Date().toISOString();

                            setTimeout(() => {
                                console.log(
                                    `[${dt_beg}]#${random} >>> ${_named}.${key}`);
                                console.log(
                                    `[${dt_beg}]#${random}`, args);
                            }, 0);

                            let result = fn.apply(this, args),
                                dt_end = new Date().toISOString();

                            setTimeout(() => {
                                console.log(
                                    `[${dt_end}]#${random} <<< ${_named}.${key}`);
                                console.log(
                                    `[${dt_end}]#${random}`, result);
                            }, 0);

                            return result;
                        } else {
                            return fn.apply(this, args);
                        }
                    };
                    for (let el in fn) {
                        if (fn.hasOwnProperty(el)) {
                            (<any>tn)[el] = (<any>fn)[el];
                        }
                    }
                    callback(tn);
                }
            }
        };
        if (dtor) {
            if (typeof dtor.value === 'function') {
                wrap(dtor.value, (tn:Function) => {
                    dtor.value = tn;
                });
            } else {
                if (typeof dtor.get === 'function') {
                    wrap(dtor.get, (tn:Function) => {
                        dtor.get = <any>tn;
                    });
                }
                if (typeof dtor.set === 'function') {
                    wrap(dtor.set, (tn:Function) => {
                        dtor.set = <any>tn;
                    });
                }
            }
        } else {
            wrap(target[key], (tn:Function) => {
                target[key] = tn;
            });
        }
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default trace;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
