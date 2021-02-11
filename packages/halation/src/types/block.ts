import { Strategy } from './loadManager';

export type Slot = {
  [key: string]: Array<string>;
};

export interface OrderedMapProps {
  key: string;
  name: string;
  type: string;
  strategies?: Array<Strategy>;
  props?: object;
  slot?: Slot;
  parent: null | string;
  modelKey?: string;
}
