import {
  ModuleStatus,
  RawModule,
  ESModule,
  ModuleGetter,
  LogActivityType,
} from './types';
import { logActivity } from './commons/logger';
import { timeStart, timeEnd } from './commons/Timer';

class Loader {
  public name: string;
  public type: string;
  public getModule: ModuleGetter;
  private status: ModuleStatus;
  private resolvers: Array<Function>;
  private resolvedModules: Function | null;

  constructor({
    type,
    name,
    getModule,
  }: {
    name: string;
    type: string;
    getModule: ModuleGetter;
  }) {
    this.name = name;
    this.type = type;
    this.getModule = getModule;

    this.status = ModuleStatus.Idle;
    this.resolvers = [];
    this.resolvedModules = null;
  }

  resolveModule<T extends RawModule>(module: T): Function {
    return module && (module as ESModule).__esModule
      ? (module as ESModule).default
      : (module as Function);
  }

  load(): Promise<Function> | Function {
    const currentStatus = this.status;
    // If module has been loaded already, then return directly.
    if (currentStatus === ModuleStatus.Loaded) {
      logActivity('Loader', {
        message: `load module ${this.name} ${this.type} from cache`,
      });
      return this.resolvedModules as Function;
    }

    // if a require Module
    timeStart(`load esmodule ${this.name} ${this.type}`);
    const module = this.getModule.call(this);

    if (module && (module as ESModule).__esModule) {
      let loadedModule = this.resolveModule(module as RawModule);
      this.resolvedModules = loadedModule;
      this.resolvers = [];
      this.status = ModuleStatus.Loaded;
      timeEnd(`load esmodule ${this.name} ${this.type}`);
      return this.resolvedModules;
    }

    return new Promise((resolve) => {
      switch (currentStatus) {
        case ModuleStatus.Idle:
          this.resolvers.push(resolve);
          timeStart(`load module ${this.name} ${this.type}`);
          logActivity('Loader', {
            message: `start load module ${this.name} ${this.type}`,
          });
          this.status = ModuleStatus.Pending;
          break;
        case ModuleStatus.Pending:
          this.resolvers.push(resolve);
          return;
      }

      if (this.getModule) {
        // __webpack_require__ will not return a Promise, so it need to wrapped
        // with Promise.resolve.
        Promise.resolve(this.getModule.call(this) as Promise<Function>).then(
          (rawModule) => {
            const module = this.resolveModule(rawModule as RawModule);
            const resolvers = this.resolvers;
            resolvers.forEach((resolver) => resolver(module));
            this.resolvedModules = module;
            logActivity('Loader', {
              message: `finish load module ${this.name} ${this.type}`,
            });
            timeEnd(`load module ${this.name} ${this.type}`);
            this.resolvers = [];
            this.status = ModuleStatus.Loaded;
          },
          () => {
            logActivity('Loader', {
              type: LogActivityType.ERROR,
              message: `'load' ${this.type} fails`,
            });
          }
        );
      }
    });
  }
}

export default Loader;
