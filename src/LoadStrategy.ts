import { LoadStrategyProps, Strategy } from './types';

class LoadStrategy {
  readonly _strategy: Strategy;
  readonly _resolvedValue: boolean;

  constructor(props: LoadStrategyProps) {
    const { strategy } = props;
    this._strategy = strategy;
    this._resolvedValue = false;
  }

  getResolvedValue() {
    return this._resolvedValue;
  }

  autoRun() {}
}

export default LoadStrategy;
