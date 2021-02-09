import { Strategy } from './loadManager';

export enum ModuleName {
  Model = 'model',
  Component = 'component',
}

export type ModuleGetter = () => Function | undefined;

export interface GetComponent {
  (): Promise<Function>;
}

export interface ModuleProps {
  name: string;
  getModel?: Function;
  getComponent: GetComponent;
  strategies: Array<Strategy>;
}

export enum ModuleStatus {
  Idle,
  Pending,
  Loaded,
  Error,
}

export interface ESModule {
  ['__esModule']: boolean;
  default: Function;
}

export type RawModule = ESModule | Function;

export type ResolvedModule<T extends RawModule> = T extends ESModule
  ? T['default']
  : T;
