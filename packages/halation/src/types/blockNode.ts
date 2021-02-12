import { FunctionComponentElement } from 'react';
import { HalationPropsAPI, RenderBlock } from './halation';
import Record from '../data/Record';

export interface SlotProps {
  [key: string]: Array<FunctionComponentElement<BlockNodePreProps> | null>;
}

export type BlockNodePreProps = HalationPropsAPI & {
  block: Record;
  modelKey: string;
  renderBlock?: RenderBlock;
};
