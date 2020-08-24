export interface HalationProps {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  blockRenderFn: Function;

  halationState: Array<any>;

  registers: Array<Function>;
}
