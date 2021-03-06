import {
  Strategy,
  StrategyType,
  ModuleMap,
  LockCurrentLoadManager,
  ReleaseCurrentLoadManager,
  ProxyEvent,
  DispatchEvent,
  LoadManagerConstructorProps,
} from './types';
import { isFunction, isPromise } from './commons';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
class LoadManager {
  private _key: string;
  readonly strategies: Array<Strategy>;
  readonly _moduleName: string;
  readonly _moduleMap: ModuleMap;
  readonly _lockCurrentLoadManager: LockCurrentLoadManager;
  readonly _releaseCurrentLoadManager: ReleaseCurrentLoadManager;
  readonly _proxyEvent: ProxyEvent;
  private _dispatchEvent: DispatchEvent;
  private teardownEffects: Array<Function>;

  constructor(props: LoadManagerConstructorProps) {
    const {
      blockKey,
      moduleName,
      strategies,
      moduleMap,
      proxyEvent,
      dispatchEvent,
      lockCurrentLoadManager,
      releaseCurrentLoadManager,
    } = props;

    this._key = blockKey;
    this.strategies = this.sort(strategies);
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;
    this._lockCurrentLoadManager = lockCurrentLoadManager;
    this._releaseCurrentLoadManager = releaseCurrentLoadManager;
    this._proxyEvent = proxyEvent;
    this._dispatchEvent = dispatchEvent;
    this.teardownEffects = [];
  }

  getKey() {
    return this._key;
  }

  addTeardown(fn: Function) {
    this.teardownEffects.push(fn);
  }

  teardown() {
    this.teardownEffects.forEach(fn => fn());
  }

  /**
   *
   * @param strategies
   * 按照'flags', 'event', 'runtime'的顺序进行排序；因为只有在'flags'和'event'
   * 层级都加载完毕其实'runtime'层面才需要开始加载（这个时候其实单独触发的model的加载）；
   * 之所以，将flags单独放出来，因为假如说flags都没有过的话，其实runtime的model都
   * 不需要进行加载的；
   */
  sort(strategies: Array<Strategy>): Array<Strategy> {
    const typeMap = {
      flags: 0,
      event: 1,
      runtime: 2,
    };
    return strategies.sort((a, b) => {
      return typeMap[a.type] - typeMap[b.type];
    });
  }

  update() {
    this.teardown();
    this.shouldModuleLoad();
  }

  /**
   * 整个strategy的处理需要是一个同步的
   */
  shouldModuleLoad(): boolean {
    const len = this.strategies.length;
    const state = {};
    this._lockCurrentLoadManager(this);

    for (let i = 0; i < len; i++) {
      const strategy = this.strategies[i];
      const { type, resolver } = strategy;
      let value: boolean = false;

      switch (type) {
        case StrategyType.event:
          value = !!resolver({
            event: this._proxyEvent,
            dispatchEvent: this._dispatchEvent,
          });
          break;
        // 如果说是runtime的话，首先需要先加载model；运行一次resolver将需要
        // 监听的属性进行绑定。
        case StrategyType.runtime:
          console.log('module map ', this._moduleMap, this._moduleName);
          const modelCreator = this._moduleMap
            .get(this._moduleName)
            ?.loadModel();
          let modelInstance = null;
          if (isPromise(modelCreator)) {
            (modelCreator as PromiseLike<Function>).then(m => {
              const modelInstance = m.call(null);
            });
          } else if (isFunction(modelCreator)) {
            modelInstance = (modelCreator as Function).call(null);
          }
          this.startVerifyRuntime();
          value = !!resolver(state);
          break;
      }
      // TODO: 临时注释掉
      if (!value) {
        // should release current load manager before return
        this._releaseCurrentLoadManager();
        return false;
      }
    }
    this._releaseCurrentLoadManager();

    return true;
  }

  startVerifyRuntime() {
    // const module = this._moduleMap.get(this._moduleName);
    // const model = module?.getModel();
  }

  subscribe() {}
}

export default LoadManager;
