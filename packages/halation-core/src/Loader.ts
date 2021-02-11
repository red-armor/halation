import { ModuleStatus, RawModule, ESModule, ModuleGetter, LogActivityType } from './types'
import { logActivity } from './commons/logger'

class Loader {
  public name: string
  public type: string
  public getModule: ModuleGetter
  private status: ModuleStatus;
  private resolvers: Array<Function>;
  private resolvedModules: Function | null;

  constructor({
    type,
    name,
    getModule
  }: {
    name: string
    type: string
    getModule: ModuleGetter
  }) {
    this.name = name
    this.type = type
    this.getModule = getModule

    this.status = ModuleStatus.Idle
    this.resolvers = []
    this.resolvedModules = null
  }

  resolveModule<T extends RawModule>(module: T): Function {
    return module && (module as ESModule).__esModule
      ? (module as ESModule).default
      : (module as Function);
  }

  load(): Promise<Function> | Function {
    const currentStatus = this.status
    // If module has been loaded already, then return directly.
    if (currentStatus === ModuleStatus.Loaded) {
      logActivity('Loader', {
        message: `load module ${this.name} ${this.type} from cache`,
      });
      return this.resolvedModules as Function;
    }

    return new Promise(resolve => {
      switch (currentStatus) {
        case ModuleStatus.Idle:
          this.resolvers.push(resolve);
          logActivity('Loader', {
            message: `start load module ${this.name} ${this.type}`,
          });
          this.status = ModuleStatus.Pending
          break;
        case ModuleStatus.Pending:
          this.resolvers.push(resolve);
          return;
      }

      if (this.getModule) {
        // __webpack_require__ will not return a Promise, so it need to wrapped
        // with Promise.resolve.
        Promise.resolve(this.getModule.call(this)).then(
          rawModule => {
            const module = this.resolveModule(rawModule as RawModule);
            const resolvers = this.resolvers
            resolvers.forEach(resolver => resolver(module));
            this.resolvedModules = module
            logActivity('Loader', {
              message: `finish load module ${this.name} ${this.type}`,
            });
            this.resolvers = []
            this.status = ModuleStatus.Loaded
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

export default Loader