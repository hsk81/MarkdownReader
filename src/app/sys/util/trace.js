/* tslint:disable:no-string-literal one-line no-console */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
"use strict";
var bundle_1 = require('../type/bundle');
var window_1 = require('../type/window');
require('./random');
function trace(arg) {
    if (typeof arg === 'boolean') {
        return _trace(arg);
    }
    else {
        _trace(true)(arg);
    }
}
exports.trace = trace;
function _trace(flag) {
    return function (ctor) {
        Object.keys(ctor.prototype).forEach(function (key) {
            var dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach(function (key) {
            var dtor = Object.getOwnPropertyDescriptor(ctor, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag)(ctor, key);
            }
        });
    };
}
function traceable(arg, key, dtor) {
    if (typeof arg === 'boolean') {
        return _traceable(arg);
    }
    else {
        _traceable(true)(arg, key, dtor);
    }
}
exports.traceable = traceable;
function _traceable(flag) {
    var do_trace = bundle_1.default.external.get('TRACE', {
        fallback: window_1.default.global('TRACE')
    });
    return function (target, key, dtor) {
        var wrap = function (fn, callback) {
            if (!flag) {
                fn['_traced'] = false;
            }
            else {
                if (fn['_traced'] === undefined) {
                    fn['_traced'] = true;
                    var tn = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        if (do_trace || window_1.default.global('TRACE')) {
                            var _named_1 = target._named || '@', random_1 = String.random(4, 16), dt_beg_1 = new Date().toISOString();
                            setTimeout(function () {
                                console.log("[" + dt_beg_1 + "]#" + random_1 + " >>> " + _named_1 + "." + key);
                                console.log("[" + dt_beg_1 + "]#" + random_1, args);
                            }, 0);
                            var result_1 = fn.apply(this, args), dt_end_1 = new Date().toISOString();
                            setTimeout(function () {
                                console.log("[" + dt_end_1 + "]#" + random_1 + " <<< " + _named_1 + "." + key);
                                console.log("[" + dt_end_1 + "]#" + random_1, result_1);
                            }, 0);
                            return result_1;
                        }
                        else {
                            return fn.apply(this, args);
                        }
                    };
                    for (var el in fn) {
                        if (fn.hasOwnProperty(el)) {
                            tn[el] = fn[el];
                        }
                    }
                    callback(tn);
                }
            }
        };
        if (dtor) {
            if (typeof dtor.value === 'function') {
                wrap(dtor.value, function (tn) {
                    dtor.value = tn;
                });
            }
            else {
                if (typeof dtor.get === 'function') {
                    wrap(dtor.get, function (tn) {
                        dtor.get = tn;
                    });
                }
                if (typeof dtor.set === 'function') {
                    wrap(dtor.set, function (tn) {
                        dtor.set = tn;
                    });
                }
            }
        }
        else {
            wrap(target[key], function (tn) {
                target[key] = tn;
            });
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = trace;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//# sourceMappingURL=trace.js.map