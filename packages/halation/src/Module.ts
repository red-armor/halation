import {
  ModuleProps,
  GetComponent,
  ModuleStatus,
  RawModule,
  ModuleName,
  ModuleGetter,
  ESModule,
  Strategy,
} from './types';
import { logActivity, LogActivityType } from '@xhs/halation-core';

class Module {
  private _name: string;
  private _getModel?: Function;
  private _getComponent: GetComponent;
  private statusMap: Map<ModuleName, ModuleStatus>;
  private resolversMap: Map<ModuleName, Array<Function>>;
  private resolvedModulesMap: Map<ModuleName, Function | null>;
  private _strategies: Array<Strategy>;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent, strategies } = props;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
    this.statusMap = new Map<ModuleName, ModuleStatus>([
      [ModuleName.Model, ModuleStatus.Idle],
      [ModuleName.Component, ModuleStatus.Idle],
    ]);
    this.resolversMap = new Map<ModuleName, Array<Function>>([
      [ModuleName.Model, [] as Array<Function>],
      [ModuleName.Component, [] as Array<Function>],
    ]);
    this.resolvedModulesMap = new Map<ModuleName, Function | null>([
      [ModuleName.Model, null],
      [ModuleName.Component, null],
    ]);
    this._strategies = strategies || [];

    logActivity('Module', {
      message: `create ${name} Module`,
    });
  }

  getName(): string {
    return this._name;
  }

  getComponent(): GetComponent {
    return this._getComponent;
  }

  getStrategies(): Array<Strategy> {
    return this._strategies;
  }

  getModel(): Function | undefined {
    return this._getModel;
  }

  resolveModule<T extends RawModule>(module: T): Function {
    return module && (module as ESModule).__esModule
      ? (module as ESModule).default
      : (module as Function);
  }

  load(
    moduleName: ModuleName,
    getter: ModuleGetter
  ): Promise<Function> | Function {
    const currentStatus = this.statusMap.get(moduleName);
    // If module has been loaded already, then return directly.
    if (currentStatus === ModuleStatus.Loaded) {
      logActivity('Module', {
        message: `load module ${this._name} ${moduleName} from cache`,
      });
      return this.resolvedModulesMap.get(moduleName) as Function;
    }

    return new Promise(resolve => {
      switch (currentStatus) {
        case ModuleStatus.Idle:
          this.resolversMap.get(moduleName)?.push(resolve);
          logActivity('Module', {
            message: `start load module ${this._name} ${moduleName}`,
          });
          this.statusMap.set(moduleName, ModuleStatus.Pending);
          break;
        case ModuleStatus.Pending:
          this.resolversMap.get(moduleName)?.push(resolve);
          return;
      }

      const fn = getter.call(this);

      if (fn) {
        // __webpack_require__ will not return a Promise, so it need to wrapped
        // with Promise.resolve.
        Promise.resolve(fn.call(this)).then(
          rawModule => {
            const module = this.resolveModule(rawModule as RawModule);
            const resolvers = this.resolversMap.get(moduleName) || [];
            resolvers.forEach(resolver => resolver(module));
            this.resolvedModulesMap.set(moduleName, module);
            logActivity('Module', {
              message: `finish load module ${this._name} ${moduleName}`,
            });
            this.resolversMap.set(moduleName, []);
            this.statusMap.set(moduleName, ModuleStatus.Loaded);
          },
          () => {
            logActivity('Module', {
              type: LogActivityType.ERROR,
              message: `'load' ${moduleName} fails`,
            });
          }
        );
      }
    });
  }

  loadModel(): Promise<Function> | Function | null {
    if (this.getModel()) {
      return this.load(ModuleName.Model, this.getModel);
    }
    return null;
  }

  loadComponent(): Promise<Function> | Function {
    return this.load(ModuleName.Component, this.getComponent);
  }
}

export default Module;
