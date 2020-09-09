import { Strategy, StrategyType, ModuleMap } from './types';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
class LoadManager {
  readonly key: string;
  readonly strategies: Array<Strategy>;
  readonly _moduleName: string;
  readonly _moduleMap: ModuleMap;

  constructor(props: {
    blockKey: string;
    moduleName: string;
    strategies: Array<Strategy>;
    moduleMap: ModuleMap;
  }) {
    const { blockKey, moduleName, strategies, moduleMap } = props;

    this.key = blockKey;
    this.strategies = this.sort(strategies);
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;
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

  shouldModuleLoad(): boolean {
    const len = this.strategies.length;
    const flags = {};
    const event = {};
    const state = {};

    for (let i = 0; i < len; i++) {
      const strategy = this.strategies[i];
      const { type, resolver } = strategy;
      let value: boolean = false;

      switch (type) {
        case StrategyType.flags:
          value = !!resolver(flags);
          break;
        case StrategyType.event:
          value = !!resolver(event);
          break;
        // 如果说是runtime的话，首先需要先加载model；运行一次resolver将需要
        // 监听的属性进行绑定。
        case StrategyType.runtime:
          this.startVerifyRuntime();
          value = !!resolver(state);
          break;
      }
      // TODO: 临时注释掉
      // if (!value) return false;
    }

    return true;
  }

  startVerifyRuntime() {
    const module = this._moduleMap.get(this._moduleName);
    const model = module?.getModel();
    console.log('model ', model);
  }

  subscribe() {}
}

export default LoadManager;
