import { ModuleProps, GetComponent, ModuleStatus } from './types';
import { isFunction } from './commons';
import { error } from './logger';

class Module {
  private _name: string;
  private _getModel?: Function;
  private _getComponent: GetComponent;
  private _status: ModuleStatus;
  private _module: null | object;
  private resolvers: Array<Function>;

  constructor(props: ModuleProps) {
    const { name, getModel, getComponent } = props;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
    this._status = ModuleStatus.Waiting;
    this._module = null;

    this.resolvers = [];
  }

  getName(): string {
    return this._name;
  }

  getModule(): null | object {
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

  loadComponent(): Promise<any> {
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
      if (isFunction(this.getComponent())) {
        const _load = this.getComponent().call(this) as PromiseLike<Function>;
        if (typeof _load === 'object' && typeof _load.then === 'function') {
          _load.then(
            module => {
              this.resolvers.forEach(resolver => resolver(module));
            },
            () => {
              error({
                type: 'module',
                message: `'loadComponent' ${this.getName} fails`,
              });
            }
          );
          return;
        }
        error({
          type: 'module',
          message: `'getComponent' function is required to output PromiseLike object`,
        });
      }
    });
  }
}

export default Module;
