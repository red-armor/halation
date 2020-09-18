import { FC } from 'react';
import { PropsAPI, BlockRenderFn } from './halation';
import Node from '../Node';
export interface BlockNodeData {
    [key: string]: any;
}
export declare type BlockNodeProps = PropsAPI & {
    block: Node;
    blockRenderFn?: BlockRenderFn;
};
export interface BlockWrapperProps {
}
export interface PluginAPI {
}
export interface BlockNodeState {
    model?: null | Function;
    Component?: null | FC<any>;
}
