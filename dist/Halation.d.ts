import React, { PureComponent } from 'react';
import { Refs, Hooks, Store, PropsAPI, Strategy, ModuleMap, HalationProps, BlockRenderFn, LoadManagerMap } from './types';
import Node from './Node';
import LoadManager from './LoadManager';
import EventTracker from './EventTracker';
declare class Halation extends PureComponent<HalationProps> {
    name: string;
    nodeMap: Map<string, Node>;
    blockRenderFn?: BlockRenderFn;
    halationState: Array<any>;
    moduleMap: ModuleMap;
    loadManagerMap: LoadManagerMap;
    private rootRenderFn?;
    hooks: Hooks;
    runtimeRegisterModule: Map<string, any>;
    private _refs;
    eventTracker: EventTracker;
    store: Store;
    constructor(props: HalationProps);
    startListen(): void;
    getName(): string;
    createBlockNode(list: Array<any>): void;
    getRefs(): Refs;
    getPropsAPI(): PropsAPI;
    addBlockLoadManager({ blockKey, moduleName, strategies, }: {
        blockKey: string;
        moduleName: string;
        strategies: Array<Strategy>;
    }): boolean;
    lockCurrentLoadManager(loadManager: LoadManager): void;
    releaseCurrentLoadManager(): void;
    dispatchEvent(event: string | object): void;
    render(): React.FunctionComponentElement<PropsAPI> | React.FunctionComponentElement<{}>;
}
export default Halation;
