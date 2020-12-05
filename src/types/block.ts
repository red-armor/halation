import { Strategy } from './loadManager';
import { Refs } from './halation';

export type Slot = {
  [key: string]: Array<string>;
};

export interface BlockProps {
  key: string;
  name: string;
  type: string;
  prevSibling: string | null;
  nextSibling: string | null;
  children: Array<string>;
  strategies?: Array<Strategy>;
  props?: object;
  slot?: Slot;
  parent: null | string;
}

export interface OrderedMapProps {
  key: string;
  name: string;
  type: string;
  strategies?: Array<Strategy>;
  props?: object;
  slot?: Slot;
  parent: null | string;
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
