import React, {
  useContext,
  createElement,
  FunctionComponentElement,
} from 'react';
import invariant from 'invariant';
import { SyncHook } from 'tapable';
import { produce, IStateTracker, StateTrackerUtil } from 'state-tracker';
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
  RegisterResult,
  HalationRegister,
} from './types';
import {
  HalationBase,
  logActivity,
  utils,
  initializeTimer,
} from '@xhs/halation-core';
import BlockNode from './BlockNode';
import LoadManager from './LoadManager';
import OrderedMap from './data/OrderedMap';
import context from './context';
import Module from './Module';

const { isPlainObject, isString, generateLoadManagerKey } = utils;
class HalationClass extends HalationBase<
  HalationRegister,
  OrderedMap,
  HalationRenderBlockProps,
  HalationState,
  HalationClassProps
> {
  public hooks: Hooks;
  public store: Store;
  public proxyEvent: IStateTracker;
  public contextValue: HalationContextValue;
  public moduleMap: HalationModuleMap;
  public loadManagerMap: HalationLoadManagerMap;
  public context: any;
  public registers: Array<HalationRegister>;

  constructor(props: HalationClassProps) {
    super(props);
    const { store, events, contextValue, registers, halationState } = props;

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

    initializeTimer(props.perf || false);

    this.store = contextValue.store || store;
    this.proxyEvent = contextValue.proxyEvent || produce(events || {});
    this.startListen();

    this.registerModules();

    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.addBlockLoadManager = this.addBlockLoadManager.bind(this);
    this.reportRef = this.reportRef.bind(this);
    this.getRef = this.getRef.bind(this);
    this.contextValue = {
      store: this.store,
      proxyEvent: this.proxyEvent,
      enableLog: this.nextEnableLog,
    };

    // const initialState = new OrderedMap([]);

    this.state = {
      halationState: halationState,
      nodeMap: halationState.getMap(),
    };
  }

  registerModules() {
    this.registers.forEach(register => {
      const moduleProps: RegisterResult = register.call(null);
      const { name, getModel, getComponent, strategies, lazy } = moduleProps;
      if (!this.moduleMap.get(name)) {
        const module = new Module({
          name,
          getComponent,
          getModel,
          lazy,
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
      addBlockLoadManager: this.addBlockLoadManager as any,
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
    const loadManagerKey = generateLoadManagerKey(moduleName, blockKey);

    if (this.loadManagerMap.get(loadManagerKey)) {
      // logActivity('Halation', {
      //   message: `Duplicated module key ${blockKey} is registered in halation application`,
      //   type: LogActivityType.WARNING,
      // });
      return false;
    }

    this.loadManagerMap.set(
      loadManagerKey,
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
      StateTrackerUtil.perform(
        this.proxyEvent,
        {
          ...this.proxyEvent,
          [event as string]: true,
        },
        {
          afterCallback: () => (this.proxyEvent[event as string] = true),
        }
      );
    }

    if (isPlainObject(event)) {
      StateTrackerUtil.perform(
        this.proxyEvent,
        {
          ...this.proxyEvent,
          ...(event as EventValue),
        },
        {
          afterCallback: () => {
            for (const key in event as EventValue) {
              const value = (event as EventValue)[key];
              this.proxyEvent[key] = value;
            }
          },
        }
      );
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
            key: `${block.getKey()}_${block.getName()}`,
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
