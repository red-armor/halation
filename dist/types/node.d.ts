import Node from '../Node';
import { Strategy } from './loadStrategy';
import { Refs } from './halation';
export { Node };
export interface NodeProps {
    key: string;
    name: string;
    type: string;
    prevSibling: string;
    nextSibling: string;
    data: Node;
    children: Array<string>;
    strategies?: Array<Strategy>;
}
export interface NodeRenderProps {
    key: string;
    name: string;
    type: string;
}
export interface BlockProps {
    getRefs: () => Refs;
}
