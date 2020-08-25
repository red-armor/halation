import Module from '../Module';

export { Module };

export interface ModuleProps {
  name: string;
  getModel?: Function;
  getComponent: Function;
}
