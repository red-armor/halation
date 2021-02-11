import {
  ModuleProps,
} from './types';
import { logActivity } from './commons/logger'

class ModuleBase {
  private _name: string;

  constructor(props: ModuleProps) {
    const { name } = props;
    this._name = name;

    logActivity('Module', {
      message: `create ${name} Module`,
    });
  }

  getName(): string {
    return this._name;
  }

  public loadComponent() {}
}

export default ModuleBase;
