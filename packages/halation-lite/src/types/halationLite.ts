import {
  HalationBaseProps,
  RenderBlockBaseComponentProps,
} from '@xhs/halation-core';
import { ForwardBlockComponentProps } from '@xhs/halation-core';
import { HalationLiteState } from './createFromLiteArray';

export type HalationLiteClassProps = HalationBaseProps<
  HalationLiteRegister,
  Array<HalationLiteState>,
  RenderBlockBaseComponentProps
>;

export interface ModuleGetter {
  (): Promise<Function>;
}

export type HalationLiteRegister = () => {
  name: string;
  getComponent: () => Promise<any>;
};

export type HalationLiteRenderBlockProps = RenderBlockBaseComponentProps;

export type HalationLiteComponentProps = ForwardBlockComponentProps;
