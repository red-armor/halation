import { Strategy } from './loadStrategy';
export declare enum ModuleName {
    Model = "model",
    Component = "component"
}
export declare type ModuleGetter = () => Function | undefined;
export interface GetComponent {
    (): Promise<Function>;
}
export interface ModuleProps {
    name: string;
    getModel?: Function;
    getComponent: GetComponent;
    strategies: Array<Strategy>;
}
export declare enum ModuleStatus {
    Idle = 0,
    Pending = 1,
    Loaded = 2,
    Error = 3
}
export interface ESModule {
    ['__esModule']: boolean;
    default: Function;
}
export declare type RawModule = ESModule | Function;
export declare type ResolvedModule<T extends RawModule> = T extends ESModule ? T['default'] : T;
