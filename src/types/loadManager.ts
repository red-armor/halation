import { Strategy } from './loadStrategy';
import LoadManager from '../LoadManager';
import {
  Store,
  ModuleMap,
  ProxyEvent,
  DispatchEvent,
  LockCurrentLoadManager,
  ReleaseCurrentLoadManager,
} from './halation';

export interface LoadManagerConstructor {
  new (moduleKey: string, strategies: Array<Strategy>): LoadManager;
}

export interface LoadManagerConstructorProps {
  store: Store;
  blockKey: string;
  moduleName: string;
  strategies: Array<Strategy>;
  moduleMap: ModuleMap;
  proxyEvent: ProxyEvent;
  dispatchEvent: DispatchEvent;
  lockCurrentLoadManager: LockCurrentLoadManager;
  releaseCurrentLoadManager: ReleaseCurrentLoadManager;
}
