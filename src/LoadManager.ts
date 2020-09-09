import { Strategy } from 'types';

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
class LoadManager {
  readonly key: string;
  readonly strategies: Array<any>;

  constructor(moduleKey: string, strategies: Array<Strategy>) {
    this.key = moduleKey;
    this.strategies = strategies;
  }

  subscribe() {}
}

export default LoadManager;
