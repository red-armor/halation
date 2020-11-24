import { FC, FunctionComponentElement } from 'react';
import { PropsAPI, BlockRenderFn } from './halation';
import Block from '../Block';

export interface BlockNodeData {
  [key: string]: any;
}

export interface SlotProps {
  [key: string]: Array<FunctionComponentElement<BlockNodeProps> | null>;
}

export type BlockNodeProps = PropsAPI & {
  block: Block;
  blockRenderFn?: BlockRenderFn;
  slot: SlotProps;
};

export interface BlockWrapperProps {}

export interface PluginAPI {}

export interface BlockNodeState {
  model?: null | Function;
  Component?: null | FC<any>;
}
