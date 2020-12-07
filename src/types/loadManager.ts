import { IStateTracker } from 'state-tracker';
import LoadManager from '../LoadManager';
import { Store, ModuleMap, DispatchEvent } from './halation';

export interface LoadManagerConstructor {
  new (moduleKey: string, strategies: Array<Strategy>): LoadManager;
}

export interface LoadManagerConstructorProps {
  store: Store;
  blockKey: string;
  modelKey: string;
  moduleName: string;
  strategies: Array<Strategy>;
  moduleMap: ModuleMap;
  proxyEvent: IStateTracker;
  dispatchEvent: DispatchEvent;
}

export enum StrategyType {
  event = 'event',
  runtime = 'runtime',
}

export interface Strategy {
  type: StrategyType;
  resolver: (value?: any) => boolean;
}

export enum RESOLVER_TYPE {
  'PENDING',
  'RESOLVED',
}
