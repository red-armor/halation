import { createContext } from 'react';

export type HalationLiteContextValue = {
  enableLog: boolean;
};

export const defaultHalationState = {
  enableLog: false,
};

export default createContext<HalationLiteContextValue>(defaultHalationState);
