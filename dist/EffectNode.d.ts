import LoadManager from 'LoadManager';
import { EffectNodeChildMap, EffectNodeEffectMap, AddChildrenProps } from './types';
declare class EffectNode {
    childMap: EffectNodeChildMap;
    effectMap: EffectNodeEffectMap;
    private _key;
    readonly _slugKey: string;
    constructor({ key }: {
        key: string;
    });
    getKey(): string;
    addChild(path: Array<string>, loadManager: LoadManager): void;
    addEffect(loadManager: LoadManager): void;
    addChildren({ paths, loadManager }: AddChildrenProps): void;
    triggerEffect(path: Array<string>): void;
}
export default EffectNode;
