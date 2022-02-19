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

export type DSL = {
  name: string;
  props?: object;
}

export type OrderedMapProps = {
  key: string;
  type?: string;
  strategies?: Array<Strategy>;
  parent?: null | string;
  modelKey?: string;
} & DSL;

export type TreeOrderedMapProps = DSL & {
  id: string;
  slot?: string;
  modelKey?: string;
  type?: string;
  // extraProps?: {
  //   [key: string]: any
  // }
  extraProps?: object
  children?: Array<TreeOrderedMapProps>

  parent?: null | string
  strategies?: Array<Strategy>;
}