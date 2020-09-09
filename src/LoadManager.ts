import { Strategy, StrategyType } from './types';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
class LoadManager {
  readonly key: string;
  readonly strategies: Array<Strategy>;

  constructor(moduleKey: string, strategies: Array<Strategy>) {
    this.key = moduleKey;
    this.strategies = strategies;
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
          value = !!resolver(state);
          break;
      }
      if (!value) return false;
    }

    return true;
  }

  subscribe() {}
}

export default LoadManager;
