import { FC, MutableRefObject } from 'react';
import Module from '../ModuleBase';
import { GetComponent } from './module';
import LoadManager from '../LoadManagerBase';
import RecordBase from '../data/RecordBase'

export interface HalationBaseProps<HS, RBP> {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  renderBlock?: RenderBlock<RBP>;

  rootRenderFn?: FC;

  halationState: HS,

  registers: Array<Function>;

  /** Display logger message or not. Default value is false */
  enableLog?: boolean;
}

export type HalationContextValue = {
  enableLog: boolean;
};

export type HalationClassProps<HS, RBP> = HalationBaseProps<HS, RBP> & {
  contextValue: HalationContextValue;
};

export type HalationState = {
  halationState: Array<RecordBase>;
}

export type RenderBlock<P> = React.FC<P>;

export type PropsAPI = ComponentPropsAPI & {
  moduleMap: Map<string, Module>;
  loadManagerMap: Map<string, LoadManager>;
  addBlockLoadManager: AddBlockLoadManager;
  reportRef: (key: string, value: any) => void;
};

export type EventValue = {
  [key: string]: any;
};

export type ComponentPropsAPI = {
  getRef: (key: string) => any;
  watch: (fn: Function) => void;
};

export type ModuleMap = Map<string, Module>;
export type LoadManagerMap = Map<string, LoadManager>;

export type AddBlockLoadManager = ({
  blockKey,
  moduleName,
  modelKey,
}: {
  blockKey: string;
  modelKey?: string;
  moduleName: string;
}) => boolean;

export interface Refs {
  [key: string]: MutableRefObject<FC>;
}

export interface RegisterResult {
  name: string;
  getComponent: GetComponent;
}

export type LockCurrentLoadManager = (loadManager: LoadManager) => void;
export type ReleaseCurrentLoadManager = () => void;