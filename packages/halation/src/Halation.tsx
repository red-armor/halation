import React, {
  useContext,
  createElement,
  FunctionComponentElement,
} from 'react';
import invariant from 'invariant';
import { SyncHook } from 'tapable';
import produce, { IStateTracker, StateTrackerUtil } from 'state-tracker';
import {
  Hooks,
  Store,
  Strategy,
  HalationProps,
  HalationClassProps,
  HalationState,
  BlockNodePreProps,
  EventValue,
  HalationContextValue,
  HalationModuleMap,
  HalationLoadManagerMap,
  HalationRenderBlockProps,
  HalationStateRawDataProps,
  RegisterResult,
  HalationRegister,
} from './types';
import {
  HalationBase,
  logActivity,
  LogActivityType,
  utils,
} from '@xhs/halation-core';
import BlockNode from './BlockNode';
import LoadManager from './LoadManager';
import OrderedMap from './data/OrderedMap';
import context from './context';
import Module from './Module';

const { isPlainObject, isString, isPresent } = utils;
class HalationClass extends HalationBase<
  HalationStateRawDataProps,
  HalationRenderBlockProps,
  HalationState,
  HalationClassProps
> {
  public hooks: Hooks;
  public store: Store;
  public proxyEvent: IStateTracker;
  public enableLog: boolean;
  public contextValue: HalationContextValue;
  public moduleMap: HalationModuleMap;
  public loadManagerMap: HalationLoadManagerMap;
  public context: any;
  public registers: Array<HalationRegister>;

  constructor(props: HalationClassProps) {
    super(props);
    const { store, events, enableLog, contextValue, registers } = props;

    this.hooks = {
      register: new SyncHook(['block']),
    };

    this.moduleMap = new Map();
    this.loadManagerMap = new Map();
    this.registers = registers;

    invariant(
      !(store && contextValue.store),
      `Nested Halation should not be passing with 'store' props`
    );

    invariant(
      !(events && contextValue.proxyEvent),
      `Nested Halation should not be passing with 'events' props`
    );

    invariant(
      !(isPresent(enableLog) && isPresent(contextValue.enableLog)),
      `Nested Halation should not be passing with 'enableLog' props`
    );

    this.store = contextValue.store || store;
    this.proxyEvent = contextValue.proxyEvent || produce(events || {});
    this.enableLog = (isPresent(enableLog) ? enableLog : false) as boolean;
    this.startListen();

    this.registerModules();

    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.addBlockLoadManager = this.addBlockLoadManager.bind(this);
    this.reportRef = this.reportRef.bind(this);
    this.getRef = this.getRef.bind(this);
    this.contextValue = {
      store: this.store,
      proxyEvent: this.proxyEvent,
      enableLog: this.enableLog,
    };

    const initialState = new OrderedMap([]);

    this.state = {
      halationState: initialState,
      nodeMap: initialState.getMap(),
    };
  }

  registerModules() {
    this.registers.forEach(register => {
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

  public getPropsAPI() {
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

  public addBlockLoadManager({
    blockKey,
    moduleName,
    strategies,
    modelKey,
  }: {
    blockKey: string;
    moduleName: string;
    modelKey?: string;
    strategies: Array<Strategy>;
  }): boolean {
    if (this.loadManagerMap.get(blockKey)) {
      logActivity('Halation', {
        message: `Duplicated module key ${blockKey} is registered in halation application`,
        type: LogActivityType.WARNING,
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

  createChildren() {
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
            renderBlock: this.renderBlock,
            ...this.getPropsAPI(),
          },
          []
        )
      );
      const blockKey = block.getNextSibling();
      block = this.state.nodeMap.get(blockKey);
    }
    return children;
  }

  render() {
    const children = this.renderCompat();
    return (
      <context.Provider value={this.contextValue}>{children}</context.Provider>
    );
  }
}

const Halation: React.FC<HalationProps> = props => {
  const contextValue = useContext(context);

  return <HalationClass {...props} contextValue={contextValue} />;
};

export default Halation;
