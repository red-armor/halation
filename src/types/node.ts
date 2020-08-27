import Node from '../Node';

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
