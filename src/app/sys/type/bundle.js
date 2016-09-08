"use strict";
///////////////////////////////////////////////////////////////////////////////
bundle.get = bundle.getAttribute;
bundle.set = bundle.setAttribute;
bundle.on = bundle.subscribeToAttribute;
bundle.un = bundle.unsubscribeAttribute;
///////////////////////////////////////////////////////////////////////////////
bundle.internal = bundle.privateStorage;
bundle.external = bundle.publicStorage;
bundle.internal.get = bundle.internal.getProperty;
bundle.external.get = bundle.external.getProperty;
bundle.internal.set = bundle.internal.setProperty;
bundle.external.set = bundle.external.setProperty;
bundle.internal.del = bundle.internal.deleteProperty;
bundle.external.del = bundle.external.deleteProperty;
bundle.internal.on = bundle.internal.subscribeToProperty;
bundle.external.on = bundle.external.subscribeToProperty;
bundle.internal.un = bundle.internal.unsubscribeProperty;
bundle.external.un = bundle.external.unsubscribeProperty;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bundle;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//# sourceMappingURL=bundle.js.map