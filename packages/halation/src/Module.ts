import { ModuleProps, Strategy } from './types';
import { ModuleBase, Loader } from '@xhs/halation-core';

class Module extends ModuleBase {
  private _strategies: Array<Strategy>;
  public modelLoader?: Loader;

  constructor(props: ModuleProps) {
    super(props);
    const { name, getModel, strategies } = props;

    this._strategies = strategies || [];

    if (getModel) {
      this.modelLoader = new Loader({
        name,
        type: 'model',
        lazy: this.isLazy(),
        getModule: getModel,
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
}

export default Module;
