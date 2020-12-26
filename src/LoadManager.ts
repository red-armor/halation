import {
  Store,
  RESOLVER_TYPE,
  Strategy,
  ModuleMap,
  StrategyType,
  DispatchEvent,
  LoadManagerConstructorProps,
} from './types';
import { isFunction, isPromise } from './commons';
import { logActivity, LogActivityType } from './logger';
import invariant from 'invariant';
import { when, IStateTracker } from 'state-tracker';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，
 * 可以直接对那些不需要判断的组件直接进行加载；
 */
class LoadManager {
  private _key: string;
  private _modelKey: string;
  readonly _store: Store;
  readonly strategies: Array<Strategy>;
  readonly _moduleName: string;
  readonly _moduleMap: ModuleMap;
  readonly _proxyEvent: IStateTracker;
  private _dispatchEvent: DispatchEvent;
  private _loadRoutine: Function | null;
  private _isModelInjected: boolean;
  private _lockPromiseLoad: boolean;
  private _resolverValueMap: Map<Function, RESOLVER_TYPE>;

  constructor(props: LoadManagerConstructorProps) {
    const {
      store,
      blockKey,
      modelKey,
      moduleName,
      strategies,
      moduleMap,
      proxyEvent,
      dispatchEvent,
    } = props;

    this._key = blockKey;
    this._modelKey = modelKey;
    this._store = store;
    this.strategies = this.sort(strategies);
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;
    this._proxyEvent = proxyEvent;
    this._dispatchEvent = dispatchEvent;
    this._loadRoutine = null;
    this._isModelInjected = false;
    this.update = this.update.bind(this);
    // 为了约束，runtime策略，如果是介入了Promise这个时候shouldModuleLoad
    // 不应该继续被执行，直到Promise真正resolve
    this._lockPromiseLoad = false;
    this._resolverValueMap = new Map();
  }

  getKey() {
    return this._key;
  }

  getModelKey() {
    return this._modelKey;
  }

  /**
   *
   * @param strategies
   * 按照event', 'runtime'的顺序进行排序；因为只有在'event'层级都加载完毕
   * 其实'runtime'层面才需要开始加载（这个时候其实单独触发的model的加载）；
   * 之所以，将flags单独放出来，因为假如说flags都没有过的话，其实runtime的
   * model都不需要进行加载的；
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

  update(type: StrategyType) {
    if (this._loadRoutine) {
      logActivity('loadManager', {
        message: `trigger ${this.getModelKey()} ${type} strategy update`,
      });
      this._loadRoutine();
    }
  }

  injectModelIntoStore(
    modelInstance: any,
    initialValue: any = {},
    falsy?: boolean
  ): boolean {
    const modelKey = this.getModelKey();
    if (this._isModelInjected) return true;
    this._store.injectModel({
      key: this._key,
      model: modelInstance,
      initialValue,
      targetKey: modelKey,
    });
    if (falsy) this._store.transfer(this._key);
    this._isModelInjected = true;
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
    if (this._resolverValueMap.get(resolver) === RESOLVER_TYPE.PENDING)
      return false;
    if (this._resolverValueMap.get(resolver) === RESOLVER_TYPE.RESOLVED)
      return true;

    const modelKey = this.getModelKey();
    // TODO: If injected model is pending with effects. base[modelKey]
    // const base = this._store.getState();
    // may get old value...

    if (!this._isModelInjected) {
      this.injectModelIntoStore(modelInstance, initialValue);
      this._isModelInjected = true;
    }

    const proxyState = (this._store as any)._application.proxyState;
    let value = false;
    when(
      proxyState,
      (state) => {
        const currentModelState = state[modelKey];
        const falsy = resolver(currentModelState);
        value = falsy;
        return falsy;
      },
      () => {
        this._resolverValueMap.set(resolver, RESOLVER_TYPE.RESOLVED);
        this.update(StrategyType.runtime);
      }
    );

    if (!value) this._resolverValueMap.set(resolver, RESOLVER_TYPE.PENDING);
    else this._resolverValueMap.set(resolver, RESOLVER_TYPE.RESOLVED);

    return value;
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

    if (this._lockPromiseLoad) return false;

    let modelInstance = null;
    if (isPromise(modelCreator)) {
      this._lockPromiseLoad = true;

      return (modelCreator as Promise<Function>)
        .then((m) => {
          modelInstance = m.call(null);
          this._lockPromiseLoad = false;
          return this.mountModel(resolver, modelInstance, {});
        })
        .catch((err) => {
          logActivity('LoadManager', {
            message: `Has error on verify runtime..${err}`,
            type: LogActivityType.ERROR,
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
          return this.injectModelIntoStore(modelInstance, {}, true);
        })
        .catch((err) => {
          logActivity('LoadManager', {
            message: `Directly inject model ${this._moduleName} failed with ${err}`,
            type: LogActivityType.ERROR,
          });
          return false;
        });
    } else if (isFunction(modelCreator)) {
      modelInstance = (modelCreator as Function).call(null);
      return this.injectModelIntoStore(modelInstance, {}, true);
    }
    return false;
  }

  /**
   * 整个strategy的处理需要是一个同步的
   */
  shouldModuleLoad(): boolean | Promise<boolean> {
    const len = this.strategies.length;

    for (let i = 0; i < len; i++) {
      const strategy = this.strategies[i];
      const { type, resolver } = strategy;

      let value: boolean = false;

      if (this._resolverValueMap.get(resolver) === RESOLVER_TYPE.PENDING)
        return false;

      if (this._resolverValueMap.get(resolver) === RESOLVER_TYPE.RESOLVED)
        continue;

      switch (type) {
        case StrategyType.event:
          when(
            this._proxyEvent,
            (state) => {
              value = !!resolver({
                event: state,
                dispatchEvent: this._dispatchEvent,
              });
              return value;
            },
            () => {
              this._resolverValueMap.set(resolver, RESOLVER_TYPE.RESOLVED);
              this.update(StrategyType.event);
            }
          );
          break;
        // 如果说是runtime的话，首先需要先加载model；运行一次resolver将需要
        // 监听的属性进行绑定。
        case StrategyType.runtime:
          return this.startVerifyRuntime(resolver);
      }

      // The previous strategy will block next if it is false..
      if (!value) {
        this._resolverValueMap.set(resolver, RESOLVER_TYPE.PENDING);
        return false;
      } else this._resolverValueMap.set(resolver, RESOLVER_TYPE.RESOLVED);
    }

    // runtime strategy is not defined..
    if (!this._isModelInjected) return this.injectModelIfNeeded();

    return true;
  }

  bindLoadRoutine(loadRoutine: Function): Function {
    this._loadRoutine = loadRoutine;
    return () => {
      this._loadRoutine = null;

      // Only if has runtime strategy
      if (this.strategies.findIndex(({ type }) => type === 'runtime') !== -1) {
        this._store.transfer(this.getKey());
      }
    };
  }
}

export default LoadManager;
