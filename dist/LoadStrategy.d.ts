import { LoadStrategyProps, Strategy } from './types';
declare class LoadStrategy {
    readonly _strategy: Strategy;
    readonly _resolvedValue: boolean;
    constructor(props: LoadStrategyProps);
    getResolvedValue(): boolean;
    autoRun(): void;
}
export default LoadStrategy;
