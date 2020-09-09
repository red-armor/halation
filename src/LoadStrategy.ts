import { LoadStrategyProps, Strategy } from './types';

class LoadStrategy {
  readonly _strategy: Strategy;
  constructor(props: LoadStrategyProps) {
    const { strategy } = props;
    this._strategy = strategy;
  }

  autoRun() {}
}

export default LoadStrategy;
