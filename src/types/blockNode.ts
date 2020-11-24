import { FC } from 'react';
import { PropsAPI, BlockRenderFn } from './halation';
import Block from '../Block';

export interface BlockNodeData {
  [key: string]: any;
}

export type BlockNodeProps = PropsAPI & {
  block: Block;
  blockRenderFn?: BlockRenderFn;
};

export interface BlockWrapperProps {}

export interface PluginAPI {}

export interface BlockNodeState {
  model?: null | Function;
  Component?: null | FC<any>;
}
