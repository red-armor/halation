import { BlockProps } from './block';

export type Predicate = (
  v: BlockProps,
  k: string,
  context: Array<BlockProps>
) => boolean;

export type Iterator = (
  v: BlockProps,
  k: string,
  context: Array<BlockProps>
) => boolean | void;
