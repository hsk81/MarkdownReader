import IBaseBundle from '../base/bundle';
import IStorage from './storage';
import UUID from '../util/uuid';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

declare let bundle:IBundle;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBundle extends IBaseBundle {
    get:<T>(path:string) => T;
    set:<T>(path:string, value:T) => void;
}

export interface IBundle extends IBaseBundle {
    on:(path:string, callback:Function) => UUID;
    un:(uuid:UUID) => void;
}

///////////////////////////////////////////////////////////////////////////////

bundle.get = bundle.getAttribute;
bundle.set = bundle.setAttribute;

bundle.on = bundle.subscribeToAttribute;
bundle.un = bundle.unsubscribeAttribute;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBundle extends IBaseBundle {
    internal:IStorage;
    external:IStorage;
}

///////////////////////////////////////////////////////////////////////////////

bundle.internal = <IStorage>bundle.privateStorage;
bundle.external = <IStorage>bundle.publicStorage;

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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default bundle;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
