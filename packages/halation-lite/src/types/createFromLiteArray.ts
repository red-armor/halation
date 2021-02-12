export type HalationLiteStateRawDataProps = {
  name: string;
  key?: string;
  props?: object;
  extraProps?: object;
  children?: Array<HalationLiteStateRawDataProps>;
};
