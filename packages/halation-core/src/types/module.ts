export type ModuleGetter = () => Promise<Function> | ESModule;

export interface ModuleBaseProps {
  name: string;
  getComponent: ModuleGetter;
  lazy?: boolean;
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
