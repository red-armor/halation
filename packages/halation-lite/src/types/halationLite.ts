import {
  HalationBaseProps,
  RenderBlockBaseComponentProps,
} from '@xhs/halation-core';
import { ForwardBlockComponentProps } from '@xhs/halation-core';
import { HalationLiteStateRawDataProps } from './createFromLiteArray';

export type HalationLiteClassProps = HalationBaseProps<
  HalationLiteRegister,
  Array<HalationLiteStateRawDataProps>,
  RenderBlockBaseComponentProps
>;

export interface ModuleGetter {
  (): Promise<Function>;
}

export type HalationLiteRegister = () => {
  name: string;
  getComponent: () => Promise<any>;
};

export type HalationLiteComponentProps = ForwardBlockComponentProps;
