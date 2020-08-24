import { PureComponent } from 'react';
import BlockNode from './BlockNode';
import { HalationProps } from './types';

class Halation extends PureComponent<HalationProps> {
  public name: string;
  public blockMap: Map<string, BlockNode>;
  public blockRenderFn: Function;
  public halationState: Array<any>;

  constructor(props: HalationProps) {
    super(props);
    const { name, blockRenderFn, halationState } = props;
    this.halationState = halationState;
    this.blockRenderFn = blockRenderFn;
    this.blockMap = new Map();
    this.name = name;
  }

  getName() {
    return this.name;
  }

  createBlockNode(list: Array<any>) {
    list.forEach(item => {
      const { key } = item;
      this.blockMap.set(key, new BlockNode(item));
    });
  }

  render() {
    return null;
  }
}

export default Halation;
