import { FC } from 'react';
import { BlockNodeBaseProps, RenderBlock, ComponentPropsAPI } from './halation';
import RecordBase from '../data/RecordBase'
export interface BlockNodeData {
  [key: string]: any;
}
export interface RenderBlockBlockProps {
  key: string;
  name: string;
  type?: string;
  props?: object;
}

export type BlockNodePreProps<RBP extends RenderBlockBaseComponentProps> = BlockNodeBaseProps & {
  block: RecordBase;
  renderBlock?: RenderBlock<RBP>;
};

export type BlockWrapperProps<RBP extends RenderBlockBaseComponentProps> = BlockNodePreProps<RBP>

export type RenderBlockBaseComponentProps = {
  blockProps: RenderBlockBlockProps;
  block: RecordBase;
}

export type BlockComponentProps = ComponentPropsAPI & {
  block: RecordBase;
};

export type ForwardBlockComponentProps = BlockComponentProps & {
  forwardRef: any
}

export interface BlockWrapperState {
  Component?: null | FC<any>;
}
