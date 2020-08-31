import Module from '../Module';

export { Module };

export enum ModuleName {
  Model = 'model',
  Component = 'component',
}

export type ModuleGetter = () => Function | undefined;

export interface GetComponent {
  (): PromiseLike<Function>;
}

export interface ModuleProps {
  name: string;
  getModel?: Function;
  getComponent: GetComponent;
}

export enum ModuleStatus {
  Waiting,
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
