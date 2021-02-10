import { FC } from 'react';
import { PropsAPI, RenderBlock, ComponentPropsAPI } from './halation';
import { BlockRenderProps } from './block';
import RecordBase from '../data/RecordBase'
export interface BlockNodeData {
  [key: string]: any;
}

export type BlockNodePreProps = PropsAPI & {
  block: RecordBase;
  renderBlock?: RenderBlock;
};

export type BlockNodeProps = BlockNodePreProps & {
  // slot: SlotProps;
};

export type RenderBlockNodeProps = ComponentPropsAPI & {
  blockProps: BlockRenderProps;
  block: RecordBase;
  // modelKey: string;
  renderBlock?: RenderBlock;
  // slot: SlotProps;
};

export type RenderBlockBaseProps = {
  blockProps: BlockRenderProps;
  block: RecordBase;
}

export type BlockComponentProps = ComponentPropsAPI & {
  block: RecordBase;
};

export type ForwardBlockComponentProps = BlockComponentProps & {
  forwardRef: any
}

export interface PluginAPI {}

export interface BlockNodeState {
  // model?: null | Function;
  Component?: null | FC<any>;
}
