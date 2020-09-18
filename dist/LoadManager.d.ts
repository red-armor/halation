import { Store, Strategy, ModuleMap, ProxyEvent, LockCurrentLoadManager, ReleaseCurrentLoadManager, LoadManagerConstructorProps } from './types';
/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */
declare class LoadManager {
    private _key;
    readonly _store: Store;
    readonly strategies: Array<Strategy>;
    readonly _moduleName: string;
    readonly _moduleMap: ModuleMap;
    readonly _lockCurrentLoadManager: LockCurrentLoadManager;
    readonly _releaseCurrentLoadManager: ReleaseCurrentLoadManager;
    readonly _proxyEvent: ProxyEvent;
    private _dispatchEvent;
    private teardownEffects;
    private _runtimeVerifyEffect;
    private _loadRoutine;
    constructor(props: LoadManagerConstructorProps);
    getKey(): string;
    addTeardown(fn: Function): void;
    teardown(): void;
    /**
     *
     * @param strategies
     * 按照'flags', 'event', 'runtime'的顺序进行排序；因为只有在'flags'和'event'
     * 层级都加载完毕其实'runtime'层面才需要开始加载（这个时候其实单独触发的model的加载）；
     * 之所以，将flags单独放出来，因为假如说flags都没有过的话，其实runtime的model都
     * 不需要进行加载的；
     */
    sort(strategies: Array<Strategy>): Array<Strategy>;
    update(): void;
    mountModel(resolver: Function, modelInstance: any, initialValue?: any): boolean;
    startVerifyRuntime(resolver: Function): Promise<boolean> | boolean;
    /**
     * 整个strategy的处理需要是一个同步的
     */
    shouldModuleLoad(): boolean | Promise<boolean>;
    bindLoadRoutine(loadRoutine: Function): Function;
}
export default LoadManager;
