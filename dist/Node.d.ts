import { NodeProps, NodeRenderProps, Strategy } from './types';
declare class Node {
    private name;
    private key;
    private prevSibling;
    private nextSibling;
    private type;
    private children;
    private strategies?;
    constructor(props: NodeProps);
    getChildKeys(): Array<string>;
    getNextSibling(): string | null;
    getPrevSibling(): string | null;
    getName(): string;
    getKey(): string;
    getType(): string;
    getStrategies(): Array<Strategy> | undefined;
    getRenderProps(): NodeRenderProps;
}
export default Node;
