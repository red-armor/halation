import {
  HalationBaseProps,
  RenderBlockBaseComponentProps,
} from '@xhs/halation-core';
import { HalationLiteStateRawDataProps } from './createFromLiteArray';

export type HalationLiteClassProps = HalationBaseProps<
  HalationLiteStateRawDataProps,
  RenderBlockBaseComponentProps
>;

export interface ModuleGetter {
  (): Promise<Function>;
}

export type RegisterFunction = () => {
  name: string;
  getComponent: () => Promise<any>;
};
