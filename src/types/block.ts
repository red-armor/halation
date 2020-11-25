import Block from '../Block';
import { Strategy } from './loadManager';
import { Refs } from './halation';

export { Block };
export type Slot = {
  [key: string]: Array<string>;
};

export interface BlockProps {
  key: string;
  name: string;
  type: string;
  prevSibling: string;
  nextSibling: string;
  data: Block;
  children: Array<string>;
  strategies?: Array<Strategy>;
  props?: object;
  slot?: Slot;
}

export interface BlockRenderProps {
  key: string;
  name: string;
  type: string;
  props?: object;
}

export interface BlockProps {
  getRefs: () => Refs;
}
