import { Strategy } from './loadManager';

export type Slot = {
  [key: string]: Array<string>;
};

export type OrderedMapProps = {
  key: string;
  name: string;
  type?: string;
  strategies?: Array<Strategy>;
  props?: object;
  parent?: null | string;
  modelKey?: string;
};
