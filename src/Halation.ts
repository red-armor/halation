import React, {
  FC,
  Fragment,
  createElement,
  PureComponent,
  FunctionComponentElement,
} from 'react';
import { SyncHook } from 'tapable';
import {
  Refs,
  Hooks,
  PropsAPI,
  Strategy,
  ModuleMap,
  HalationProps,
  BlockRenderFn,
  BlockNodeProps,
  RegisterResult,
  LoadManagerMap,
  EventValue,
} from './types';
import Node from './Node';
import Module from './Module';
import { logActivity } from './logger';
import BlockNode from './BlockNode';
import LoadManager from './LoadManager';
import EventTracker from './EventTracker';
import { isPlainObject, isString } from './commons';

class Halation extends PureComponent<HalationProps> {
  public name: string;
  public nodeMap: Map<string, Node>;
  public blockRenderFn?: BlockRenderFn;
  public halationState: Array<any>;
  public moduleMap: ModuleMap;
  public loadManagerMap: LoadManagerMap;
  public graph: Array<any>;
  private rootRenderFn?: FC<PropsAPI>;
  public hooks: Hooks;
  public runtimeRegisterModule: Map<string, any>;
  private _refs: Refs;
  public eventTracker: EventTracker;

  constructor(props: HalationProps) {
    super(props);
    const {
      name,
      events,
      registers,
      blockRenderFn,
      halationState,
      rootRenderFn,
    } = props;
    this.halationState = halationState;
    this.blockRenderFn = blockRenderFn;
    this.nodeMap = new Map();
    this.name = name;
    this.moduleMap = new Map();
    this.loadManagerMap = new Map();
    this.rootRenderFn = rootRenderFn;
    this.hooks = {
      register: new SyncHook(['block']),
    };
    this._refs = {};

    this.runtimeRegisterModule = new Map();

    this.eventTracker = new EventTracker({
      events: events || [],
    });

    this.createBlockNode(this.halationState);
    this.startListen();

    registers.forEach(register => {
      const moduleProps: RegisterResult = register.call(null);
      const { name, getModel, getComponent, strategies } = moduleProps;
      if (!this.moduleMap.get(name)) {
        const module = new Module({
          name,
          getComponent,
          getModel,
          strategies: strategies || [],
        });
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
      loadManagerMap: this.loadManagerMap,
      refs: this.getRefs(),
      addBlockLoadManager: this.addBlockLoadManager.bind(this),
    };
  }

  public addBlockLoadManager({
    blockKey,
    moduleName,
    strategies,
  }: {
    blockKey: string;
    moduleName: string;
    strategies: Array<Strategy>;
  }): boolean {
    if (this.loadManagerMap.get(blockKey)) {
      logActivity('Halation', {
        message: `Duplicated module key ${blockKey} is registered in halation application`,
      });
      return false;
    }

    this.loadManagerMap.set(
      blockKey,
      new LoadManager({
        blockKey,
        strategies,
        moduleName,
        moduleMap: this.moduleMap,
        dispatchEvent: this.dispatchEvent.bind(this),
        proxyEvent: this.eventTracker.getProxyEvent(),
        lockCurrentLoadManager: this.lockCurrentLoadManager.bind(this),
        releaseCurrentLoadManager: this.releaseCurrentLoadManager.bind(this),
      })
    );

    return true;
  }

  lockCurrentLoadManager(loadManager: LoadManager) {
    this.eventTracker.setLoadManager(loadManager);
  }

  releaseCurrentLoadManager() {
    this.eventTracker.releaseLoadManager();
  }

  dispatchEvent(event: string | object) {
    let nextValue = event;

    if (isString(event)) {
      nextValue = {
        event,
        value: true,
      };
    }

    if (isPlainObject(nextValue)) {
      this.eventTracker.updateEventValue(nextValue as EventValue);
    }
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
