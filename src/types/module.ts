import Module from '../Module';

export { Module };

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

export interface RawModule {
  ['__esModule']?: boolean;
  default?: Function;
}
