export enum StrategyType {
  event = 'event',
  runtime = 'runtime',
}

export interface Strategy {
  type: StrategyType;
  resolver: (value?: any) => boolean;
}

export interface LoadStrategyProps {
  strategy: Strategy;
}
