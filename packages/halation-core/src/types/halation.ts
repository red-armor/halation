import { FC } from 'react';
import Module from '../ModuleBase';
import { ModuleGetter } from './module';
import LoadManager from '../LoadManagerBase';
import RecordBase from '../data/RecordBase'
import { RenderBlockBaseComponentProps } from './blockNode'

export interface HalationBaseProps<
  RegisterFunction,
  HS,
  RBP extends RenderBlockBaseComponentProps
> {
  name: string;

  /**
   * According to block type to render component with wrapper
   */
  renderBlock?: RenderBlock<RBP>;

  rootRenderFn?: FC;

  halationState: HS,

  registers: Array<RegisterFunction>;

  /** Display logger message or not. Default value is false */
  enableLog: boolean | undefined;
}

export type HalationContextValue = {
  enableLog: boolean | undefined;
};

export type HalationClassProps<RegisterFunction, HS, RBP extends RenderBlockBaseComponentProps> = HalationBaseProps<RegisterFunction, HS, RBP> & {
  contextValue: HalationContextValue;
};

export type HalationState = {
  halationState: Array<RecordBase>;
}

export type RenderBlock<RBP extends RenderBlockBaseComponentProps> = React.FC<RBP>;

export type ComponentPropsAPI = {
  getRef: (key: string) => any;
  watch: (fn: Function) => void;
};

export type ModuleMap = Map<string, Module>;
export type LoadManagerMap = Map<string, LoadManager>;

export type AddBlockLoadManager = ({
  blockKey,
  moduleName,
}: {
  blockKey: string;
  moduleName: string;
}) => boolean;

export type BlockWrapperProps<RBP extends RenderBlockBaseComponentProps> = ComponentPropsAPI & {
  moduleMap: ModuleMap,
  loadManagerMap: LoadManagerMap,
  reportRef: (key: string, value: any) => void;
  renderBlock?: RenderBlock<RBP>
  block: RecordBase,
}

export type BlockNodeBaseProps<RBP extends RenderBlockBaseComponentProps> = BlockWrapperProps<RBP> & {
  addBlockLoadManager: AddBlockLoadManager;
}

export interface RegisterBaseResult {
  name: string;
  getComponent: ModuleGetter;
}