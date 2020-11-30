import React, {
  FC,
  Fragment,
  createElement,
  PureComponent,
  FunctionComponentElement,
} from 'react';
import { SyncHook } from 'tapable';
import {
  Hooks,
  Store,
  PropsAPI,
  Strategy,
  ModuleMap,
  HalationProps,
  HalationState,
  BlockRenderFn,
  BlockNodePreProps,
  RegisterResult,
  LoadManagerMap,
  EventValue,
} from './types';
import Block from './Block';
import Module from './Module';
import { logActivity } from './logger';
import BlockNode from './BlockNode';
import LoadManager from './LoadManager';
import EventTracker from './EventTracker';
import RefTracker from './RefTracker';
import { isPlainObject, isString } from './commons';

class Halation extends PureComponent<HalationProps, HalationState> {
  public name: string;
  public blockRenderFn?: BlockRenderFn;
  public moduleMap: ModuleMap;
  public loadManagerMap: LoadManagerMap;
  private rootRenderFn?: FC<PropsAPI>;
  public hooks: Hooks;
  public runtimeRegisterModule: Map<string, any>;
  public eventTracker: EventTracker;
  public store: Store;
  public refTracker: RefTracker;

  constructor(props: HalationProps) {
    super(props);
    const {
      name,
      store,
      events,
      registers,
      blockRenderFn,
      halationState,
      rootRenderFn,
    } = props;
    this.state = {
      nodeMap: Halation.createBlockNode(halationState),
      halationState: halationState,
    };
    this.blockRenderFn = blockRenderFn;
    this.name = name;
    this.moduleMap = new Map();
    this.loadManagerMap = new Map();
    this.rootRenderFn = rootRenderFn;
    this.hooks = {
      register: new SyncHook(['block']),
    };

    this.runtimeRegisterModule = new Map();

    this.eventTracker = new EventTracker({
      events: events || [],
    });

    this.startListen();
    this.store = store;
    this.refTracker = new RefTracker();

    registers.forEach((register) => {
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
    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.addBlockLoadManager = this.addBlockLoadManager.bind(this);
    this.reportRef = this.reportRef.bind(this);
    this.getRef = this.getRef.bind(this);
  }

  static getDerivedStateFromProps(props: HalationProps, state: HalationState) {
    const { halationState } = props;
    if (halationState !== state.halationState) {
      return {
        nodeMap: Halation.createBlockNode(halationState),
        halationState: halationState,
      };
    }
    // 默认不改动 state
    return null;
  }

  startListen() {
    for (let key in this.hooks) {
      const hook = this.hooks[key as keyof Hooks];
      hook.tap(key, function () {});

      hook.intercept({
        register: (tabInfo) => {
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

  static createBlockNode(list: Array<any>): Map<string, Block> {
    const nodeMap = new Map();
    list.forEach((item) => {
      const { key } = item;
      nodeMap.set(key, new Block(item));
    });

    logActivity('Halation', {
      message: 'finish to create nodes ',
      value: nodeMap,
    });

    return nodeMap;
  }

  public getPropsAPI(): PropsAPI {
    return {
      hooks: this.hooks,
      nodeMap: this.state.nodeMap,
      moduleMap: this.moduleMap,
      loadManagerMap: this.loadManagerMap,
      addBlockLoadManager: this.addBlockLoadManager,
      dispatchEvent: this.dispatchEvent,
      reportRef: this.reportRef,
      getRef: this.getRef,
      watch: this.refTracker.watch,
    };
  }

  public reportRef(key: string, ref: any) {
    this.refTracker.setRef(key, ref);
  }

  public getRef(key: string) {
    return this.refTracker.getRef(key);
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
        store: this.store,
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
    const blocks = this.state.nodeMap.values();
    let block = blocks.next().value;
    const children: Array<FunctionComponentElement<BlockNodePreProps>> = [];

    while (block) {
      children.push(
        createElement<BlockNodePreProps>(
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
      block = this.state.nodeMap.get(blockKey);
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
