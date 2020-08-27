import React, {
  PureComponent,
  FunctionComponentElement,
  FC,
  Fragment,
  createElement,
} from 'react';
import { SyncHook } from 'tapable';
import { HalationProps, Hooks, PropsAPI, BlockNodeProps } from './types';
import Node from './Node';
import Module from './Module';
import { log } from './logger';
import BlockNode from './BlockNode';

const DEBUG = false;

class Halation extends PureComponent<HalationProps> {
  public name: string;
  public nodeMap: Map<string, Node>;
  public blockRenderFn: Function;
  public halationState: Array<any>;
  public moduleMap: Map<string, Module>;
  public graph: Array<any>;
  private rootRenderFn?: FC<PropsAPI>;
  public hooks: Hooks;
  public runtimeRegisterModule: Map<string, any>;

  constructor(props: HalationProps) {
    super(props);
    const {
      name,
      blockRenderFn,
      halationState,
      registers,
      rootRenderFn,
    } = props;
    this.halationState = halationState;
    this.blockRenderFn = blockRenderFn;
    this.nodeMap = new Map();
    this.name = name;
    this.moduleMap = new Map();
    this.rootRenderFn = rootRenderFn;
    this.hooks = {
      register: new SyncHook(['block']),
    };

    this.runtimeRegisterModule = new Map();

    this.createBlockNode(this.halationState);
    this.startListen();

    registers.forEach(register => {
      const moduleProps = register.call(null);
      const module = new Module(moduleProps);
      const { name } = moduleProps;

      this.moduleMap.set(name, module);
    });

    this.graph = [];
  }

  startListen() {
    for (let key in this.hooks) {
      const hook = this.hooks[key as keyof Hooks];
      hook.tap(key, function() {});

      if (DEBUG) {
        hook.intercept({
          register: tabInfo => {
            log(tabInfo);
            return tabInfo;
          },
        });
      }
    }
  }

  getName() {
    return this.name;
  }

  createBlockNode(list: Array<any>) {
    list.forEach(item => {
      const { key } = item;
      this.nodeMap.set(key, new Node(item));
    });

    if (DEBUG) {
      log('halation state node map: ', this.nodeMap);
    }
  }

  public getPropsAPI(): PropsAPI {
    return {
      hooks: this.hooks,
      nodeMap: this.nodeMap,
      moduleMap: this.moduleMap,
    };
  }

  render() {
    const blocks = this.nodeMap.values();
    let block = blocks.next().value;
    const children: Array<FunctionComponentElement<BlockNodeProps>> = [];

    while (block) {
      children.push(
        createElement<BlockNodeProps>(
          BlockNode,
          {
            block,
            key: block.getKey(),
            ...this.getPropsAPI(),
          },
          null
        )
      );
      const blockKey = block.getNextSibling();
      block = this.nodeMap.get(blockKey);
    }

    if (typeof this.rootRenderFn === 'function') {
      return React.createElement(
        this.rootRenderFn,
        {
          ...this.getPropsAPI(),
        },
        children
      );
    }

    return React.createElement(Fragment, {}, children);
  }
}

export default Halation;
