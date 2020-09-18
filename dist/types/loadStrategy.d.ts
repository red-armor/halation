export declare enum StrategyType {
    flags = "flags",
    event = "event",
    runtime = "runtime"
}
export interface Strategy {
    type: StrategyType;
    resolver: (value?: any) => boolean;
}
export interface LoadStrategyProps {
    strategy: Strategy;
}
