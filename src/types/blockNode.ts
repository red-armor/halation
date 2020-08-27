import { Node, PropsAPI } from './';

export interface BlockNodeData {
  [key: string]: any;
}

export type BlockNodeProps = PropsAPI & {
  block: Node;
};

export interface BlockWrapperProps {}
