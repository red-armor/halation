import {
  ModuleProps,
  GetComponent,
  ModuleStatus,
  RawModule,
  ModuleName,
  ModuleGetter,
  ESModule,
} from './types';
import { error, logActivity } from './logger';

class Module {
  private _name: string;
  private _getModel?: Function;
  private _getComponent: GetComponent;
  private _status: ModuleStatus;
  private statusMap: Map<ModuleName, ModuleStatus>;
  private resolversMap: Map<ModuleName, Array<Function>>;
  private resolvedModulesMap: Map<ModuleName, Function | null>;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent } = props;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
    this._status = ModuleStatus.Waiting;
    this.statusMap = new Map<ModuleName, ModuleStatus>([
      [ModuleName.Model, ModuleStatus.Waiting],
      [ModuleName.Component, ModuleStatus.Waiting],
    ]);
    this.resolversMap = new Map<ModuleName, Array<Function>>([
      [ModuleName.Model, [] as Array<Function>],
      [ModuleName.Component, [] as Array<Function>],
    ]);
    this.resolvedModulesMap = new Map<ModuleName, Function | null>([
      [ModuleName.Model, null],
      [ModuleName.Component, null],
    ]);
  }

  getName(): string {
    return this._name;
  }

  getComponent(): GetComponent {
    return this._getComponent;
  }

  getModel(): Function | undefined {
    return this._getModel;
  }

  getStatus(): ModuleStatus {
    return this._status;
  }

  resolveModule<T extends RawModule>(module: T): Function {
    return module && (module as ESModule).__esModule
      ? (module as ESModule).default
      : (module as Function);
  }

  load(moduleName: ModuleName, getter: ModuleGetter): Promise<Function> {
    return new Promise(resolve => {
      const currentStatus = this.statusMap.get(moduleName);

      switch (currentStatus) {
        case ModuleStatus.Loaded:
          logActivity('Module', {
            message: `load module ${this._name} ${moduleName} from cache`,
          });
          resolve(this.resolvedModulesMap.get(moduleName) as Function);
          return;
        case ModuleStatus.Waiting:
          this.resolversMap.get(moduleName)?.push(resolve);
          break;
        case ModuleStatus.Pending:
          this.resolversMap.get(moduleName)?.push(resolve);
          logActivity('Module', {
            message: `start load module ${this._name} ${moduleName}`,
          });
          break;
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
          },
          () => {
            error({
              type: 'module',
              message: `'load' ${moduleName} fails`,
            });
          }
        );
      }
    });
  }

  loadModel(): Promise<Function> {
    return this.load(ModuleName.Model, this.getModel);
  }

  loadComponent(): Promise<Function> {
    return this.load(ModuleName.Component, this.getComponent);
  }
}

export default Module;
