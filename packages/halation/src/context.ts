import { createContext } from 'react';
import { HalationContextValue } from './types';

export const defaultHalationState = {
  store: null,
  proxyEvent: null,
  enableLog: undefined,
};

export default createContext<HalationContextValue>(defaultHalationState);
