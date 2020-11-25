import { FC, FunctionComponentElement } from 'react';
import { PropsAPI, BlockRenderFn } from './halation';
import Block from '../Block';

export interface BlockNodeData {
  [key: string]: any;
}

export interface SlotProps {
  [key: string]: Array<FunctionComponentElement<BlockNodePreProps> | null>;
}

export type BlockNodePreProps = PropsAPI & {
  block: Block;
  blockRenderFn?: BlockRenderFn;
};

export type BlockNodeProps = BlockNodePreProps & {
  slot: SlotProps;
};

export interface BlockWrapperProps {}

export interface PluginAPI {}

export interface BlockNodeState {
  // model?: null | Function;
  Component?: null | FC<any>;
}
