import { PureComponent } from 'react';
import { HalationProps } from './types';
import BlockNode from './BlockNode';
import Module from './Module';

class Halation extends PureComponent<HalationProps> {
  public name: string;
  public blockMap: Map<string, BlockNode>;
  public blockRenderFn: Function;
  public halationState: Array<any>;
  public moduleMap: Map<string, Module>;
  public graph: Array<any>;

  constructor(props: HalationProps) {
    super(props);
    const { name, blockRenderFn, halationState, registers } = props;
    this.halationState = halationState;
    this.blockRenderFn = blockRenderFn;
    this.blockMap = new Map();
    this.name = name;
    this.moduleMap = new Map();

    registers.forEach(register => {
      const moduleProps = register.call(null);
      const module = new Module(moduleProps);
      const { name } = moduleProps;
      this.moduleMap.set(name, module);
    });

    this.graph = [];

    console.log('this module ', this.moduleMap);
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
