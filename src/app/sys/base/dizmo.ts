import IBaseStorage from './storage';
import IBaseBundle from './bundle';

import UUID from '../util/uuid';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBaseDizmo {
    [arg:string]:any;
}

export interface IBaseDizmo {
    identifier: string;
}

export interface IBaseDizmo {
    getAttribute:<T>(path:string) => T;
    setAttribute:<T>(path:string, value:T) => void;
}

export interface IBaseDizmo {
    subscribeToAttribute:<T>(
        path:string, callback:(path:string, value:T) => void
    ) => UUID;
    unsubscribeAttribute:<T>(
        uuid:UUID
    ) => void;
}

export interface IBaseDizmo {
    privateStorage:IBaseStorage;
    publicStorage:IBaseStorage;
}

export interface IBaseDizmo {
    showBack:() => void;
    onShowBack:(callback:Function) => void;
    showFront:() => void;
    onShowFront:(callback:Function) => void;
}

export interface IBaseDizmo {
    canDock:(flag:boolean|(() => boolean)) => void;
    onDock:(callback:Function) => void;
}

export interface IBaseDizmo {
    addMenuItem:(icon:string, name:string, callback:Function) => string;
    removeMenuItem:(menuId:string) => void;
}

export interface IBaseDizmo {
    getBundle:() => IBaseBundle;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default IBaseDizmo;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
