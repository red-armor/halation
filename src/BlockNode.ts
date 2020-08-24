import { BlockNodeProps } from './types';

class BlockNode {
  public key: string;
  public prevSibling: string;
  public nextSibling: string;
  public type: string;

  constructor(props: BlockNodeProps) {
    const { key, type, prevSibling, nextSibling } = props;
    this.key = key;
    this.prevSibling = prevSibling;
    this.nextSibling = nextSibling;
    this.type = type;
  }
}

export default BlockNode;
