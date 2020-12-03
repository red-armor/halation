import { BlockProps, BlockRenderProps, Strategy, Slot } from '../types';

class Record {
  private name: string;
  private key: string;
  private prevSibling: string;
  private nextSibling: string;
  private type: string;
  private children: Array<string>;
  private strategies?: Array<Strategy>;
  private props?: object;
  private slot: Slot;

  constructor(props: BlockProps) {
    const {
      key,
      type,
      prevSibling,
      nextSibling,
      children,
      name,
      strategies,
      slot = {},
      props: blockProps,
    } = props;
    this.key = key;
    this.slot = slot;
    this.name = name;
    this.prevSibling = prevSibling;
    this.nextSibling = nextSibling;
    this.type = type || 'block';
    this.children = children || [];
    this.strategies = strategies;
    this.props = blockProps;
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

  getStrategies(): Array<Strategy> | undefined {
    return this.strategies;
  }

  getSlot(): Slot {
    return this.slot;
  }

  getRenderProps(): BlockRenderProps {
    return {
      key: this.key,
      name: this.name,
      type: this.type,
      props: this.props,
    };
  }
}

export default Record;
