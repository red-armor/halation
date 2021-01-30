import { FC, MutableRefObject } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Record from '../data/Record';
import { RenderBlockNodeProps } from './blockNode';
import { Strategy } from './loadManager';
import { GetComponent } from './module';
import LoadManager from 'LoadManager';
import { IStateTracker } from 'state-tracker';
import OrderedMap from '../data/OrderedMap';

export type HalationEvents = {
  [key: string]: any;
};

export type HalationStateItem = {
  key: string;
  name: string;
  type: string;
  prevSibling: null | string;
  nextSibling: null | string;
  parent: null | string;
};

export interface HalationProps {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  renderBlock?: RenderBlock;

  rootRenderFn?: FC;

  halationState: OrderedMap;

  registers: Array<Function>;
  events?: HalationEvents;
  store: Store;

  /** Display logger message or not. Default value is false */
  enableLog?: boolean;
}

export type HalationContextValue = {
  store: null | Store;
  proxyEvent: null | IStateTracker;
  enableLog: undefined | boolean;
};

export type HalationClassProps = HalationProps & {
  contextValue: HalationContextValue;
};

export interface HalationState {
  nodeMap: Map<string, Record>;
  halationState: OrderedMap;
}

export type RenderBlock = React.FC<RenderBlockNodeProps>;

export interface Hooks {
  register: SyncHook;
}

export type PropsAPI = ComponentPropsAPI & {
  nodeMap: Map<string, Record>;
  moduleMap: Map<string, Module>;
  loadManagerMap: Map<string, LoadManager>;
  addBlockLoadManager: AddBlockLoadManager;
  reportRef: (key: string, value: any) => void;
};

export type EventValue = {
  [key: string]: any;
};

export type DispatchEvent = (eventValue: string | EventValue) => void;

export type ComponentPropsAPI = {
  hooks: Hooks;
  dispatchEvent: DispatchEvent;
  getRef: (key: string) => any;
  watch: (fn: Function) => void;
};

export type ModuleMap = Map<string, Module>;
export type LoadManagerMap = Map<string, LoadManager>;

export type AddBlockLoadManager = ({
  blockKey,
  strategies,
  moduleName,
  modelKey,
}: {
  blockKey: string;
  modelKey?: string;
  moduleName: string;
  strategies: Array<Strategy>;
}) => boolean;

export interface Refs {
  [key: string]: MutableRefObject<FC>;
}

export interface RegisterResult {
  name: string;
  key: string;
  strategies?: Array<Strategy>;
  getComponent: GetComponent;
  getModel: Function;
}

export type LockCurrentLoadManager = (loadManager: LoadManager) => void;
export type ReleaseCurrentLoadManager = () => void;

export type Store = {
  subscribe: (subscription: Function) => Function;
  injectModel: (opt: {
    key: string;
    model: any;
    initialValue?: any;
    targetKey?: string;
  }) => void;
  transfer: (key: string) => void;
  getState: () => {
    [key: string]: any;
  };
};
