import { LoadStrategyProps, Strategy } from './types';

class LoadStrategy {
  readonly strategies: Array<Strategy>;
  constructor(props: LoadStrategyProps) {
    this.strategies = props.strategies;
  }

  autoRun() {}
}

export default LoadStrategy;
