import { FC, MutableRefObject } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Block from '../Block';
import { BlockRenderProps } from './block';
import { Strategy } from './loadManager';
import { GetComponent } from './module';
import LoadManager from 'LoadManager';
import { EventValue } from './eventTracker';

export type HalationEvents = Array<string>;

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
  nodeMap: Map<string, Block>;
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
  nodeMap: Map<string, Block>;
  moduleMap: Map<string, Module>;
  loadManagerMap: Map<string, LoadManager>;
  refs: Refs;
  addBlockLoadManager: AddBlockLoadManager;
  dispatchEvent: (event: string) => void;
}

export type ModuleMap = Map<string, Module>;
export type LoadManagerMap = Map<string, LoadManager>;

export type AddBlockLoadManager = ({
  blockKey,
  strategies,
  moduleName,
}: {
  blockKey: string;
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

export type ProxyEvent = {
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
