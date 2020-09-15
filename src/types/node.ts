import Node from '../Node';
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
}

export interface NodeRenderProps {
  key: string;
  name: string;
  type: string;
}

export interface BlockProps {
  getRefs: () => Refs;
}
