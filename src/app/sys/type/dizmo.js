"use strict";
// tslint:disable:no-string-literal
Object.defineProperty(exports, "__esModule", { value: true });
///////////////////////////////////////////////////////////////////////////////
dizmo.get = dizmo.getAttribute;
dizmo.set = dizmo.setAttribute;
dizmo.on = dizmo.subscribeToAttribute;
dizmo.un = dizmo.unsubscribeAttribute;
///////////////////////////////////////////////////////////////////////////////
dizmo.internal = dizmo.privateStorage;
dizmo.external = dizmo.publicStorage;
dizmo.internal.get = dizmo.internal.getProperty;
dizmo.external.get = dizmo.external.getProperty;
dizmo.internal.set = dizmo.internal.setProperty;
dizmo.external.set = dizmo.external.setProperty;
dizmo.internal.del = dizmo.internal.deleteProperty;
dizmo.external.del = dizmo.external.deleteProperty;
dizmo.internal.on = dizmo.internal.subscribeToProperty;
dizmo.external.on = dizmo.external.subscribeToProperty;
dizmo.internal.un = dizmo.internal.unsubscribeProperty;
dizmo.external.un = dizmo.external.unsubscribeProperty;
///////////////////////////////////////////////////////////////////////////////
dizmo.internal.load = function (path, value) {
    return dizmo.internal.get(encodeURI(path), {
        fallback: value
    });
};
dizmo.external.load = function (path, value) {
    return dizmo.external.get(encodeURI(path), {
        fallback: value
    });
};
dizmo.internal.save = function (path, value, timeout) {
    if (timeout === void 0) { timeout = 512; }
    dizmo.internal.set(encodeURI(path), value, {
        file: true, timeout: timeout
    });
};
dizmo.external.save = function (path, value, timeout) {
    if (timeout === void 0) { timeout = 512; }
    dizmo.external.set(encodeURI(path), value, {
        file: true, timeout: timeout
    });
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
exports.default = dizmo;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//# sourceMappingURL=dizmo.js.map