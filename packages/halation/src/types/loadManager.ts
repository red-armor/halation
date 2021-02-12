import { IStateTracker } from 'state-tracker';
import LoadManager from '../LoadManager';
import { Store, HalationModuleMap, DispatchEvent } from './halation';

export interface LoadManagerConstructor {
  new (moduleKey: string, strategies: Array<Strategy>): LoadManager;
}

export interface LoadManagerConstructorProps {
  store: Store;
  blockKey: string;
  modelKey?: string;
  moduleName: string;
  strategies: Array<Strategy>;
  moduleMap: HalationModuleMap;
  proxyEvent: IStateTracker;
  dispatchEvent: DispatchEvent;
}

export type StrategyType = 'event' | 'runtime';

export interface Strategy {
  type: StrategyType;
  resolver: (value?: any) => boolean;
}

export enum RESOLVER_TYPE {
  'PENDING',
  'RESOLVED',
}
