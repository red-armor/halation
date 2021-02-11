import { Strategy } from './loadManager';
import { ModuleGetter, ModuleBaseProps } from '@xhs/halation-core';

export type ModuleProps = ModuleBaseProps & {
  getModel?: ModuleGetter;
  strategies?: Array<Strategy>;
};
