import { OrderedMapProps } from './block';

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
