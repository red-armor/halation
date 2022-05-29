import { ModuleBaseProps } from './types';
import { logActivity } from './commons/logger';
import Loader from './Loader';

class ModuleBase {
  private _name: string;
  private _lazy: boolean;
  private componentLoader: Loader;

  constructor(props: ModuleBaseProps) {
    const { name, getComponent, lazy = true } = props;
    this._name = name;
    this._lazy = lazy

    logActivity('Module', {
      message: `create ${name} Module`,
    });

    this.componentLoader = new Loader({
      name: this.getName(),
      type: 'component',
      getModule: getComponent,
      lazy: this._lazy,
    });
  }

  getName(): string {
    return this._name;
  }

  isLazy() {
    return this._lazy
  }

  loadComponent() {
    return this.componentLoader.load();
  }
}

export default ModuleBase;
