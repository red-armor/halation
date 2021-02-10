import {
  HalationBaseProps,
  HalationLiteStateRawDataProps,
  RenderBlockBaseProps,
} from '@xhs/halation-core';

export type HalationLiteClassProps = HalationBaseProps<
  HalationLiteStateRawDataProps,
  RenderBlockBaseProps
>;

export interface GetComponent {
  (): Promise<Function>;
}

export type RegisterFunction = () => {
  name: string;
  getComponent: () => Promise<any>;
};
export type HalationLiteRegister = () => GetComponent;
export interface HalationLiteRegisterResult {
  name: string;
  getComponent: GetComponent;
}
