// tslint:disable:no-string-literal

import IBaseDizmo from '../base/dizmo';
import IStorage from './storage';
import UUID from '../util/uuid';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

declare let dizmo:IDizmo;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IDizmo extends IBaseDizmo {
    get:<T>(path:string) => T;
    set:<T>(path:string, value:T) => void;
}

export interface IDizmo extends IBaseDizmo {
    on:(path:string, callback:Function) => UUID;
    un:(uuid:UUID) => void;
}

export interface IDizmo extends IBaseDizmo {
    children:(path:string) => Array<string>;
}

///////////////////////////////////////////////////////////////////////////////

dizmo.get = dizmo.getAttribute;
dizmo.set = dizmo.setAttribute;

dizmo.on = dizmo.subscribeToAttribute;
dizmo.un = dizmo.unsubscribeAttribute;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IDizmo extends IBaseDizmo {
    internal:IStorage;
    external:IStorage;
}

///////////////////////////////////////////////////////////////////////////////

dizmo.internal = <IStorage>dizmo.privateStorage;
dizmo.external = <IStorage>dizmo.publicStorage;

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

dizmo.internal.load = <T>(path:string, value?:T):T => {
    return dizmo.internal.get(encodeURI(path), {
        fallback: value
    });
};

dizmo.external.load = <T>(path:string, value?:T):T => {
    return dizmo.external.get(encodeURI(path), {
        fallback: value
    });
};

dizmo.internal.save = <T>(path:string, value:T, timeout:number = 512) => {
    dizmo.internal.set(encodeURI(path), value, {
        file: true, timeout: timeout
    });
};

dizmo.external.save = <T>(path:string, value:T, timeout:number = 512) => {
    dizmo.external.set(encodeURI(path), value, {
        file: true, timeout: timeout
    });
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default dizmo;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
