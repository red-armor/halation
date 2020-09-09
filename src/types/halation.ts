import { FC, MutableRefObject } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Node from '../Node';
import { NodeRenderProps } from './node';
import { Strategy } from './loadStrategy';
import { GetComponent } from './module';
import LoadManager from 'LoadManager';

export interface HalationProps {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  blockRenderFn?: BlockRenderFn;

  rootRenderFn?: FC;

  halationState: Array<any>;

  registers: Array<Function>;
}

export type BlockRenderFn = (
  props: NodeRenderProps
) => null | undefined | FC<any>;

export interface Hooks {
  register: SyncHook;
}

export interface PropsAPI {
  hooks: Hooks;
  nodeMap: Map<string, Node>;
  moduleMap: Map<string, Module>;
  loadManagerMap: Map<string, LoadManager>;
  refs: Refs;
  addBlockLoadManager: AddBlockLoadManager;
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
