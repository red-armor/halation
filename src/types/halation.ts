import { FC } from 'react';
import { SyncHook } from 'tapable';
import Module from '../Module';
import Node from '../Node';
import { BlockProps } from './node';

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

export type BlockRenderFn = (props: BlockProps) => null | undefined | FC<any>;

export interface Hooks {
  register: SyncHook;
}

export interface PropsAPI {
  hooks: Hooks;
  nodeMap: Map<string, Node>;
  moduleMap: Map<string, Module>;
}
