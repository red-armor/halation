import { createContext } from 'react';

export type HalationLiteContextValue = {
  enableLog: boolean | undefined;
};

export const defaultHalationState = {
  enableLog: undefined,
};

export default createContext<HalationLiteContextValue>(defaultHalationState);
