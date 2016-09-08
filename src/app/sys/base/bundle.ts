import IBaseStorage from './storage';
import IBaseDizmo from './dizmo';

import UUID from '../util/uuid';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBaseBundle {
    [arg:string]:any;
}

export interface IBaseBundle {
    identifier: string;
}

export interface IBaseBundle {
    getAttribute:<T>(path:string) => T;
    setAttribute:<T>(path:string, value:T) => void;
}

export interface IBaseBundle {
    subscribeToAttribute:<T>(
        path:string, callback:(path:string, value:T) => void
    ) => UUID;
    unsubscribeAttribute:<T>(
        uuid:UUID
    ) => void;
}

export interface IBaseBundle {
    privateStorage:IBaseStorage;
    publicStorage:IBaseStorage;
}

export interface IBaseBundle {
    getDizmos:() => Array<IBaseDizmo>;
    uninstall:() => void;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default IBaseBundle;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
