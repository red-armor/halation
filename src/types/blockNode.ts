import { PropsAPI, BlockRenderFn } from './halation';
import Node from '../Node';

export interface BlockNodeData {
  [key: string]: any;
}

export type BlockNodeProps = PropsAPI & {
  block: Node;
  blockRenderFn?: BlockRenderFn;
};

export interface BlockWrapperProps {}

export interface PluginAPI {}
