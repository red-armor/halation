import {
  Store,
  Strategy,
  ModuleMap,
  StrategyType,
  ProxyEvent,
  DispatchEvent,
  LockCurrentLoadManager,
  ReleaseCurrentLoadManager,
  LoadManagerConstructorProps,
} from './types';
import { isFunction, isPromise } from './commons';
import { logActivity } from './logger';
import invariant from 'invariant';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
class LoadManager {
  private _key: string;
  readonly _store: Store;
  readonly strategies: Array<Strategy>;
  readonly _moduleName: string;
  readonly _moduleMap: ModuleMap;
  readonly _lockCurrentLoadManager: LockCurrentLoadManager;
  readonly _releaseCurrentLoadManager: ReleaseCurrentLoadManager;
  readonly _proxyEvent: ProxyEvent;
  private _dispatchEvent: DispatchEvent;
  private teardownEffects: Array<Function>;
  private _loadRoutine: Function | null;
  private _isModelInjected: boolean;

  constructor(props: LoadManagerConstructorProps) {
    const {
      store,
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
    this._store = store;
    this.strategies = this.sort(strategies);
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;
    this._lockCurrentLoadManager = lockCurrentLoadManager;
    this._releaseCurrentLoadManager = releaseCurrentLoadManager;
    this._proxyEvent = proxyEvent;
    this._dispatchEvent = dispatchEvent;
    this.teardownEffects = [];
    this._loadRoutine = null;
    this._isModelInjected = false;
  }

  getKey() {
    return this._key;
  }

  addTeardown(fn: Function) {
    this.teardownEffects.push(fn);
  }

  teardown() {
    this.teardownEffects.forEach((fn) => fn());
  }

  /**
   *
   * @param strategies
   * 按照event', 'runtime'的顺序进行排序；因为只有在'event'层级都加载完毕
   * 其实'runtime'层面才需要开始加载（这个时候其实单独触发的model的加载）；
   * 之所以，将flags单独放出来，因为假如说flags都没有过的话，其实runtime的model都
   * 不需要进行加载的；
   */
  sort(strategies: Array<Strategy>): Array<Strategy> {
    const typeMap = {
      event: 1,
      runtime: 2,
    };
    return strategies.sort((a, b) => {
      return typeMap[a.type] - typeMap[b.type];
    });
  }

  update() {
    this.teardown();
    if (this._loadRoutine) this._loadRoutine();
  }

  injectModelIntoStore(modelInstance: any, initialValue: any = {}): boolean {
    const modelKey = this._key;
    this._store.injectModel(modelKey, modelInstance, initialValue);

    logActivity('LoadManager', {
      message: `inject model ${modelKey} into store`,
    });
    return true;
  }

  mountModel(
    resolver: Function,
    modelInstance: any,
    initialValue: any = {}
  ): boolean {
    const modelKey = this._key;
    this.injectModelIntoStore(modelInstance, initialValue);

    const base = this._store.getState();

    // TODO: If injected model is pending with effects. base[modelKey]
    // may get old value...
    const currentModelState = base[modelKey];
    const falsy = resolver(currentModelState);

    if (!falsy) {
      this._store.subscribe(this.update.bind(this));
    }

    return !!falsy;
  }

  getModelCreator(strict: boolean = false) {
    const modelCreator = this._moduleMap.get(this._moduleName)?.loadModel();

    invariant(
      strict ? modelCreator : true,
      `${this._moduleName} model is required to defined if attempt to use runtime load strategy`
    );
    return modelCreator;
  }

  startVerifyRuntime(resolver: Function): Promise<boolean> | boolean {
    logActivity('LoadManager', {
      message: 'start verify runtime strategy',
    });
    const modelCreator = this.getModelCreator(true);

    let modelInstance = null;
    if (isPromise(modelCreator)) {
      return (modelCreator as Promise<Function>)
        .then((m) => {
          modelInstance = m.call(null);
          return this.mountModel(resolver, modelInstance, {});
        })
        .catch((err) => {
          logActivity('LoadManager', {
            message: `Has error on verify runtime..${err}`,
          });
          return false;
        });
    } else if (isFunction(modelCreator)) {
      modelInstance = (modelCreator as Function).call(null);
      return this.mountModel(resolver, modelInstance, {});
    }

    return false;
  }

  injectModelIfNeeded() {
    if (this._isModelInjected) return true;
    let modelInstance = null;
    const modelCreator = this.getModelCreator();
    if (!modelCreator) return true;

    if (isPromise(modelCreator)) {
      return (modelCreator as Promise<Function>)
        .then((m) => {
          modelInstance = m.call(null);
          return this.injectModelIntoStore(modelInstance, {});
        })
        .catch((err) => {
          logActivity('LoadManager', {
            message: `Directly inject model ${this._moduleName} failed with ${err}`,
          });
          return false;
        });
    } else if (isFunction(modelCreator)) {
      modelInstance = (modelCreator as Function).call(null);
      return this.injectModelIntoStore(modelInstance, {});
    }
    return false;
  }

  /**
   * 整个strategy的处理需要是一个同步的
   */
  shouldModuleLoad(): boolean | Promise<boolean> {
    const len = this.strategies.length;
    this._lockCurrentLoadManager(this);

    for (let i = 0; i < len; i++) {
      const strategy = this.strategies[i];
      const { type, resolver } = strategy;

      let value: boolean = false;

      switch (type) {
        case StrategyType.event:
          this._proxyEvent.strictEnter('event');
          value = !!resolver({
            event: this._proxyEvent,
            dispatchEvent: this._dispatchEvent,
          });
          this._releaseCurrentLoadManager();
          this._proxyEvent.leave();
          break;
        // 如果说是runtime的话，首先需要先加载model；运行一次resolver将需要
        // 监听的属性进行绑定。
        case StrategyType.runtime:
          return this.startVerifyRuntime(resolver);
      }

      // The previous strategy will block next if it is false..
      if (!value) return false;
    }

    // runtime strategy is not defined..
    if (!this._isModelInjected) return this.injectModelIfNeeded();

    return true;
  }

  bindLoadRoutine(loadRoutine: Function): Function {
    this._loadRoutine = loadRoutine;
    return () => (this._loadRoutine = null);
  }
}

export default LoadManager;
