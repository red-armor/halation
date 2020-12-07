import { FC, MutableRefObject } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Record from '../data/Record';
import { BlockRenderProps } from './block';
import { Strategy } from './loadManager';
import { GetComponent } from './module';
import LoadManager from 'LoadManager';

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
  blockRenderFn?: BlockRenderFn;

  rootRenderFn?: FC;

  halationState: Array<any>;

  registers: Array<Function>;
  events?: HalationEvents;
  store: Store;
}

export interface HalationState {
  nodeMap: Map<string, Record>;
  halationState: Array<any>;
}

export type BlockRenderFn = (
  props: BlockRenderProps
) => null | undefined | FC<any>;

export interface Hooks {
  register: SyncHook;
}

export interface PropsAPI {
  hooks: Hooks;
  nodeMap: Map<string, Record>;
  moduleMap: Map<string, Module>;
  loadManagerMap: Map<string, LoadManager>;
  addBlockLoadManager: AddBlockLoadManager;
  dispatchEvent: (event: string) => void;
  reportRef: (key: string, value: any) => void;
  getRef: (key: string) => any;
  watch: (fn: Function) => void;
}

export type ModuleMap = Map<string, Module>;
export type LoadManagerMap = Map<string, LoadManager>;

export type AddBlockLoadManager = ({
  blockKey,
  strategies,
  moduleName,
  modelKey,
}: {
  blockKey: string;
  modelKey: string;
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
export type EventValue = {
  [key: string]: any;
};

export type DispatchEvent = (eventValue: string | EventValue) => void;
export type Store = {
  subscribe: (subscription: Function) => Function;
  injectModel: (key: string, model: any, initialValue: any) => void;
  getState: () => {
    [key: string]: any;
  };
};
