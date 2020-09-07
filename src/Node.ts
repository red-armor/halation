import { NodeProps, BlockProps } from './types';

class Node {
  private name: string;
  private key: string;
  private prevSibling: string;
  private nextSibling: string;
  private type: string;
  private children: Array<string>;

  constructor(props: NodeProps) {
    const { key, type, prevSibling, nextSibling, children, name } = props;
    this.key = key;
    this.name = name;
    this.prevSibling = prevSibling;
    this.nextSibling = nextSibling;
    this.type = type || 'block';
    this.children = children;
  }

  getChildKeys(): Array<string> {
    return this.children;
  }

  getNextSibling(): string | null {
    return this.nextSibling;
  }

  getPrevSibling(): string | null {
    return this.prevSibling;
  }

  getName(): string {
    return this.name;
  }

  getKey(): string {
    return this.key;
  }

  getType(): string {
    return this.type;
  }

  getBlockProps(): BlockProps {
    return {
      key: this.key,
      name: this.name,
      type: this.type,
    };
  }
}

export default Node;
