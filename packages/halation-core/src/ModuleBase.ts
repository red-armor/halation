import { ModuleBaseProps } from './types';
import { logActivity } from './commons/logger'
import Loader from './Loader'

class ModuleBase {
  private _name: string;
  private componentLoader: Loader;

  constructor(props: ModuleBaseProps) {
    const { name, getComponent } = props;
    this._name = name;

    logActivity('Module', {
      message: `create ${name} Module`,
    });

    this.componentLoader = new Loader({
      name: this.getName(),
      type: 'component',
      getModule: getComponent,
    });
  }

  getName(): string {
    return this._name;
  }

  loadComponent() {
    return this.componentLoader.load();
  }
}

export default ModuleBase;
