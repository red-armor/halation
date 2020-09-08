export enum StrategyType {
  flags,
  event,
  runtime,
}

export interface Strategy {
  type: StrategyType;
  resolver: (value: any) => boolean;
}

export interface LoadStrategyProps {
  strategies: Array<Strategy>;
}
