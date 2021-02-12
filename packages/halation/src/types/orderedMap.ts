import { Strategy } from './loadManager';

export type Predicate = (
  v: OrderedMapProps,
  k: string,
  context: Array<OrderedMapProps>
) => boolean;

export type Iterator = (
  v: OrderedMapProps,
  k: string,
  context: Array<OrderedMapProps>
) => boolean | void;

export type OrderedMapSlot = {
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
