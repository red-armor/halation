import { ModuleProps, GetComponent, RawModule, ModuleName, ModuleGetter, Strategy } from './types';
declare class Module {
    private _name;
    private _getModel?;
    private _getComponent;
    private statusMap;
    private resolversMap;
    private resolvedModulesMap;
    private _strategies;
    constructor(props: ModuleProps);
    getName(): string;
    getComponent(): GetComponent;
    getStrategies(): Array<Strategy>;
    getModel(): Function | undefined;
    resolveModule<T extends RawModule>(module: T): Function;
    load(moduleName: ModuleName, getter: ModuleGetter): Promise<Function> | Function;
    loadModel(): Promise<Function> | Function;
    loadComponent(): Promise<Function> | Function;
}
export default Module;
