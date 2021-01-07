import { FC, FunctionComponentElement } from 'react';
import { PropsAPI, RenderBlock, ComponentPropsAPI } from './halation';
import { BlockRenderProps } from './block';
import Record from '../data/Record';

export interface BlockNodeData {
  [key: string]: any;
}

export interface SlotProps {
  [key: string]: Array<FunctionComponentElement<BlockNodePreProps> | null>;
}

export type BlockNodePreProps = PropsAPI & {
  block: Record;
  modelKey: string | undefined;
  renderBlock?: RenderBlock;
};

export type BlockNodeProps = BlockNodePreProps & {
  slot: SlotProps;
};

export type RenderBlockNodeProps = ComponentPropsAPI & {
  blockProps: BlockRenderProps;
  block: Record;
  modelKey: string;
  renderBlock?: RenderBlock;
  slot: SlotProps;
};

export interface BlockWrapperProps {}

export interface PluginAPI {}

export interface BlockNodeState {
  // model?: null | Function;
  Component?: null | FC<any>;
}
