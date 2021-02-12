export type HalationLiteState = {
  name: string;
  key?: string;
  props?: object;
  extraProps?: object;
  children?: Array<HalationLiteState>;
};
