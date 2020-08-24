import { ModuleProps } from './types';

class Module {
  public name: string;
  public getModel?: Function;
  public getComponent: Function;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent } = props;
    this.name = name;
    this.getModel = getModel;
    this.getComponent = getComponent;
  }
}

export default Module;
