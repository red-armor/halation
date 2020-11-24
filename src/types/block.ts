import Block from '../Block';
import { Strategy } from './loadStrategy';
import { Refs } from './halation';

export { Block };

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
