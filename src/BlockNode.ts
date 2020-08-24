import { BlockNodeProps } from './types';

class BlockNode {
  public key: string;
  public prevSibling: string;
  public nextSibling: string;

  constructor(props: BlockNodeProps) {
    const { key, prevSibling, nextSibling } = props;
    this.key = key;
    this.prevSibling = prevSibling;
    this.nextSibling = nextSibling;
  }
}

export default BlockNode;
