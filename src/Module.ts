import { ModuleProps, GetComponent } from './types';

class Module {
  private _name: string;
  private _getModel?: Function;
  private _getComponent: GetComponent;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent } = props;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
  }

  getName(): string {
    return this._name;
  }

  getComponent(): GetComponent {
    return this._getComponent;
  }

  getModel(): Function | undefined {
    return this._getModel;
  }
}

export default Module;
