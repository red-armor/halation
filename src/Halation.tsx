import React, {
  FC,
  useContext,
  createElement,
  PureComponent,
  FunctionComponentElement,
} from 'react';
import invariant from 'invariant';
import { SyncHook } from 'tapable';
import produce, { IStateTracker, StateTrackerUtil } from 'state-tracker';
import {
  Hooks,
  Store,
  PropsAPI,
  Strategy,
  ModuleMap,
  HalationProps,
  HalationClassProps,
  HalationState,
  BlockRenderFn,
  BlockNodePreProps,
  RegisterResult,
  LoadManagerMap,
  EventValue,
  HalationContextValue,
} from './types';
import Module from './Module';
import { logActivity } from './logger';
import BlockNode from './BlockNode';
import LoadManager from './LoadManager';
import RefTracker from './RefTracker';
import { isPlainObject, isString } from './commons';
import OrderedMap from './data/OrderedMap';
import context from './context';

class HalationClass extends PureComponent<HalationClassProps, HalationState> {
  public name: string;
  public blockRenderFn?: BlockRenderFn;
  public moduleMap: ModuleMap;
  public loadManagerMap: LoadManagerMap;
  private rootRenderFn?: FC<PropsAPI>;
  public hooks: Hooks;
  public store: Store;
  public refTracker: RefTracker;
  public proxyEvent: IStateTracker;
  private contextValue: HalationContextValue;

  constructor(props: HalationClassProps) {
    super(props);
    const {
      name,
      store,
      events,
      registers,
      blockRenderFn,
      rootRenderFn,
      contextValue,
    } = props;

    this.blockRenderFn = blockRenderFn;
    this.name = name;
    this.moduleMap = new Map();
    this.loadManagerMap = new Map();
    this.rootRenderFn = rootRenderFn;
    this.hooks = {
      register: new SyncHook(['block']),
    };

    invariant(
      !(store && contextValue.store),
      `Nested Halation should not be passing with 'store' props`
    );

    invariant(
      !(events && contextValue.proxyEvent),
      `Nested Halation should not be passing with 'events' props`
    );

    this.store = contextValue.store || store;
    this.proxyEvent = contextValue.proxyEvent || produce(events || {});
    this.startListen();

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
    this.state = {
      nodeMap: new Map(),
      halationState: [],
    };
    this.contextValue = {
      store: this.store,
      proxyEvent: this.proxyEvent,
    };
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

  static getDerivedStateFromProps(nextProps: any) {
    const { halationState } = nextProps;
    if (halationState instanceof OrderedMap) {
      return {
        halationState,
        nodeMap: halationState.getMap(),
      };
    }

    return null;
  }

  getName() {
    return this.name;
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
    modelKey,
  }: {
    blockKey: string;
    moduleName: string;
    modelKey: string;
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
        modelKey,
        strategies,
        moduleName,
        moduleMap: this.moduleMap,
        dispatchEvent: this.dispatchEvent.bind(this),
        proxyEvent: this.proxyEvent,
      })
    );

    return true;
  }

  dispatchEvent(event: string | EventValue) {
    if (isString(event)) {
      StateTrackerUtil.relink(this.proxyEvent, [event as string], true);
    }

    if (isPlainObject(event)) {
      const keys = Object.keys(event);
      const len = keys.length;
      for (let index = 0; index < len; index++) {
        const key = keys[index];
        StateTrackerUtil.relink(
          this.proxyEvent,
          [key],
          (event as EventValue)[key]
        );
      }
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
            modelKey: block.getModelKey(),
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

    return (
      <context.Provider value={this.contextValue}>{children}</context.Provider>
    );
  }
}

const Halation: React.FC<HalationProps> = (props) => {
  const contextValue = useContext(context);

  return <HalationClass {...props} contextValue={contextValue} />;
};

export default Halation;
