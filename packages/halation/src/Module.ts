import { ModuleProps, Strategy } from './types';
import { ModuleBase, Loader } from '@xhs/halation-core';

class Module extends ModuleBase {
  private _strategies: Array<Strategy>;
  public modelLoader?: Loader;
  public componentLoader?: Loader;

  constructor(props: ModuleProps) {
    super(props);
    const { name, getModel, strategies, getComponent } = props;

    this._strategies = strategies || [];

    if (getModel) {
      this.modelLoader = new Loader({
        name,
        type: 'model',
        getModule: getModel,
      });
    }

    if (getComponent) {
      this.componentLoader = new Loader({
        name,
        type: 'component',
        getModule: getComponent,
      });
    }
  }

  getStrategies(): Array<Strategy> {
    return this._strategies;
  }

  loadModel(): Promise<Function> | Function | null {
    if (this.modelLoader) return this.modelLoader.load();
    return null;
  }

  loadComponent(): Promise<Function> | Function | null {
    if (this.componentLoader) return this.componentLoader.load();
    return null;
  }
}

export default Module;
