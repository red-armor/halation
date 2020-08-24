export interface BlockNodeData {
  [key: string]: any;
}

export interface BlockNodeProps {
  key: string;
  type: string;
  prevSibling: string;
  nextSibling: string;
  data: BlockNodeData;
}
