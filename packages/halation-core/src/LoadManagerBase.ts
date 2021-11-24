import { ModuleMap, LoadManagerConstructorProps } from './types';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，
 * 可以直接对那些不需要判断的组件直接进行加载；
 */
class LoadManagerBase {
  private _key: string;
  readonly _moduleName: string;
  readonly _moduleMap: ModuleMap;
  public _loadRoutine: Function | null;

  constructor(props: LoadManagerConstructorProps) {
    const { blockKey, moduleName, moduleMap } = props;

    this._key = blockKey;
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;

    this._loadRoutine = null;

    // this.update = this.update.bind(this);
  }

  getKey() {
    return this._key;
  }

  // update(type?: StrategyType) {
  //   if (this._loadRoutine) {
  //     this._loadRoutine();
  //   }
  // }

  /**
   * 整个strategy的处理需要是一个同步的
   */
  shouldModuleLoad(): boolean | Promise<boolean> {
    return true;
  }

  bindLoadRoutine(loadRoutine: Function): Function {
    this._loadRoutine = loadRoutine;
    return () => {
      this._loadRoutine = null;
    };
  }
}

export default LoadManagerBase;
