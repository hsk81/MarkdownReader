import IBaseBundle from './bundle';
import IBaseDizmo from './dizmo';

import UUID from '../util/uuid';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBaseViewer {
    [arg:string]:any;
}

export interface IBaseViewer {
    getAttribute:<T>(path:string) => T;
    setAttribute:<T>(path:string, value:T) => void;
}

export interface IBaseViewer {
    subscribeToAttribute:(path:string, callback:Function) => UUID;
    unsubscribeAttribute:(uuid:UUID) => void;
}

export interface IBaseViewer {
    onBundleAdded: (callback:Function) => void;
    onBundleRemoved: (callback:Function) => void;
    onDizmoAdded: (callback:Function) => void;
    onDizmoRemoved: (callback:Function) => void;
}

export interface IBaseViewer {
    getBundles:() => Array<IBaseBundle>;
    getDizmos:() => Array<IBaseDizmo>;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default IBaseViewer;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
