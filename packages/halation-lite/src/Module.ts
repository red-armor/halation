import { ModuleBase, Loader, ModuleGetter } from '@xhs/halation-core';

class Module extends ModuleBase {
  private componentLoader: Loader;

  constructor(props: { name: string; getComponent: ModuleGetter }) {
    super(props);
    const { getComponent } = props;

    this.componentLoader = new Loader({
      name: this.getName(),
      type: 'component',
      getModule: getComponent,
    });
  }

  loadComponent() {
    return this.componentLoader.load();
  }
}

export default Module;
