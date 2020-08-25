import { FC } from 'react';
import { SyncHook } from 'tapable';
import { Node, Module } from './';

export interface HalationProps {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  blockRenderFn: Function;

  rootRenderFn?: FC;

  halationState: Array<any>;

  registers: Array<Function>;
}

export interface Hooks {
  register: SyncHook;
}

export interface PropsAPI {
  hooks: Hooks;
  nodeMap: Map<string, Node>;
  moduleMap: Map<string, Module>;
}
