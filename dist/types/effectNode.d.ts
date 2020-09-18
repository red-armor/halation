import LoadManager from 'LoadManager';
import EffectNode from '../EffectNode';
export interface EffectNodeChildMap {
    [key: string]: EffectNode;
}
export interface EffectNodeEffectMap {
    [key: string]: {
        loadManager: LoadManager;
    };
}
export declare type AddChildrenProps = {
    paths: Array<Array<string>>;
    loadManager: LoadManager;
};
export declare type AddChildren = ({ paths, loadManager }: AddChildrenProps) => void;
