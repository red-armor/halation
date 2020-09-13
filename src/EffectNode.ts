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
    const node = path.reduce<EffectNode>((node, point) => {
      if (!node.childMap[point])
        node.childMap[point] = new EffectNode({
          key: point,
        });
      return node.childMap[point];
    }, this);

    node.addEffect(loadManager);
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

  triggerEffect(path: Array<string>) {
    const node = path.reduce<EffectNode>((node, cur) => {
      if (node && node.childMap && node.childMap[cur]) {
        return node.childMap[cur];
      }
      return node;
    }, this);

    for (let key in node.effectMap) {
      const { loadManager } = node.effectMap[key];
      loadManager.update();
    }
  }
}

export default EffectNode;
