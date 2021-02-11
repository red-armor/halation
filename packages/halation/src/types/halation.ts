import { FC } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Record from '../data/Record';
import { Strategy } from './loadManager';
import LoadManager from '../LoadManager';
import { IStateTracker } from 'state-tracker';
import OrderedMap from '../data/OrderedMap';
import {
  RenderBlockBaseComponentProps,
  HalationBaseProps,
  ModuleGetter,
  RegisterBaseResult,
} from '@xhs/halation-core';

export type HalationEvents = {
  [key: string]: any;
};

export type HalationStateRawDataProps = {
  key: string;
  name: string;
  type: string;
  strategies?: Array<Strategy>;
  props?: object;
  parent: null | string;
  modelKey?: string;
};

export type HalationStateItem = {
  key: string;
  name: string;
  type: string;
  prevSibling: null | string;
  nextSibling: null | string;
  parent: null | string;
};

export type HalationRenderBlockProps = RenderBlockBaseComponentProps & {
  modelKey: string;
};

export type HalationRenderBlock<P> = FC<P>;

export type HalationProps = HalationBaseProps<
  HalationStateRawDataProps,
  HalationRenderBlockProps
> & {
  events?: HalationEvents;
  store: Store;
};

export type HalationContextValue = {
  store: null | Store;
  proxyEvent: null | IStateTracker;
  enableLog: boolean;
};

export type HalationClassProps = HalationProps & {
  contextValue: HalationContextValue;
};

export interface HalationState {
  nodeMap: Map<string, Record>;
  halationState: OrderedMap;
}

export type RenderBlock = React.FC<HalationRenderBlockProps>;

export interface Hooks {
  register: SyncHook;
}

export type HalationPropsAPI = ComponentPropsAPI & {
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

export type HalationModuleMap = Map<string, Module>;
export type HalationLoadManagerMap = Map<string, LoadManager>;

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

export type HalationRegister = () => RegisterResult;
export type RegisterResult = RegisterBaseResult & {
  getModel?: ModuleGetter;
  strategies?: Array<Strategy>;
};

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
