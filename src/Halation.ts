import React, {
  PureComponent,
  FunctionComponentElement,
  FC,
  Fragment,
  createElement,
} from 'react';
import { SyncHook } from 'tapable';
import {
  HalationProps,
  Hooks,
  PropsAPI,
  BlockNodeProps,
  BlockRenderFn,
  Refs,
} from './types';
import Node from './Node';
import Module from './Module';
import { logActivity } from './logger';
import BlockNode from './BlockNode';

class Halation extends PureComponent<HalationProps> {
  public name: string;
  public nodeMap: Map<string, Node>;
  public blockRenderFn?: BlockRenderFn;
  public halationState: Array<any>;
  public moduleMap: Map<string, Module>;
  public graph: Array<any>;
  private rootRenderFn?: FC<PropsAPI>;
  public hooks: Hooks;
  public runtimeRegisterModule: Map<string, any>;
  private _refs: Refs;

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
    this._refs = {};

    this.runtimeRegisterModule = new Map();

    this.createBlockNode(this.halationState);
    this.startListen();

    registers.forEach(register => {
      const moduleProps = register.call(null);
      const { name } = moduleProps;
      if (!this.moduleMap.get(name)) {
        const module = new Module(moduleProps);
        this.moduleMap.set(name, module);
      }
    });

    this.graph = [];
  }

  startListen() {
    for (let key in this.hooks) {
      const hook = this.hooks[key as keyof Hooks];
      hook.tap(key, function() {});

      hook.intercept({
        register: tabInfo => {
          logActivity('Halation', {
            message: 'register info',
            value: tabInfo,
          });
          return tabInfo;
        },
      });
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

    logActivity('Halation', {
      message: 'finish to create nodes ',
      value: this.nodeMap,
    });
  }

  public getRefs(): Refs {
    return this._refs;
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
            blockRenderFn: this.blockRenderFn,
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
