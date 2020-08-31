import { ModuleProps, GetComponent, ModuleStatus, RawModule } from './types';
import { error } from './logger';
import { noop } from './commons';

class Module {
  private _name: string;
  private _getModel?: Function;
  private _getComponent: GetComponent;
  private _status: ModuleStatus;
  private _module: Function;
  private resolvers: Array<Function>;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent } = props;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
    this._status = ModuleStatus.Waiting;
    this._module = noop;

    this.resolvers = [];
  }

  getName(): string {
    return this._name;
  }

  getModule(): Function {
    return this._module;
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

  resolveModule(module: RawModule) {
    return module && module.__esModule ? module.default : module;
  }

  loadComponent(): Promise<Function> {
    return new Promise(resolve => {
      const currentStatus = this.getStatus();

      switch (currentStatus) {
        case ModuleStatus.Loaded:
          resolve(this.getModule());
          return;
        case ModuleStatus.Waiting:
        case ModuleStatus.Pending:
          this.resolvers.push(resolve);
          break;
      }

      if (this.getComponent()) {
        // __webpack_require__ will not return a Promise, so it need to wrapped
        // with Promise.resolve.
        Promise.resolve(this.getComponent().call(this)).then(
          rawModule => {
            const module = this.resolveModule(rawModule as RawModule);
            this.resolvers.forEach(resolver => resolver(module));
          },
          () => {
            error({
              type: 'module',
              message: `'loadComponent' ${this.getName} fails`,
            });
          }
        );
      }
    });
  }
}

export default Module;
