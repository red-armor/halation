import HalationLiteRecord from '../data/HalationLiteRecord';

export type HalationLiteState = {
  name: string;
  slot?: string;
  key?: string;
  props?: object;
  extraProps?: object;
  children?: Array<HalationLiteState>;
};

export type HalationLiteProps = {
  name: string;
  slot?: string;
  key: string;
  props?: object;
  extraProps?: object;
  children?: Array<HalationLiteRecord>;
};
