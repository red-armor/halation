import LoadManager from 'LoadManager';
import {
  EffectNodeChildMap,
  EffectNodeEffectMap,
  AddChildrenProps,
} from './types';

class EffectNode {
  public childMap: EffectNodeChildMap;
  public effectMap: EffectNodeEffectMap;
  private _key: string;
  readonly _slugKey: string;

  constructor({ key }: { key: string }) {
    this.childMap = {};
    this.effectMap = {};
    this._key = key;
    this._slugKey = '';
  }

  getKey() {
    return this._key;
  }

  addChild(path: Array<string>, loadManager: LoadManager) {
    let childMap = this.childMap;

    const len = path.length;

    path.forEach((point, index) => {
      if (!childMap[point])
        childMap[point] = new EffectNode({
          key: point,
        });

      if (index === len - 1) {
        childMap[point].addEffect(loadManager);
      }
    });
  }

  addEffect(loadManager: LoadManager) {
    const key = loadManager.getKey();
    this.effectMap[key] = {
      loadManager,
    };
    loadManager.addTeardown(() => delete this.effectMap[key]);
  }

  addChildren({ paths, loadManager }: AddChildrenProps) {
    paths.forEach(path => {
      this.addChild(path, loadManager);
    });
  }
}

export default EffectNode;
