import React, { createElement, useContext } from 'react';
import {
  HalationBase,
  HalationClassProps,
  HalationState,
  BlockNodePreProps,
  HalationLiteStateRawDataProps,
  RenderBlockBaseProps,
  HalationContextValue,
} from '@xhs/halation-core';
import context from './context';
import BlockNode from './BlockNode';
import { HalationLiteClassProps } from './types';

class HalationLiteClass extends HalationBase<
  HalationLiteStateRawDataProps,
  RenderBlockBaseProps,
  HalationState,
  HalationClassProps<HalationLiteStateRawDataProps, RenderBlockBaseProps>
> {
  public contextValue: HalationContextValue;

  constructor(
    props: HalationClassProps<
      HalationLiteStateRawDataProps,
      RenderBlockBaseProps
    >
  ) {
    super(props);
    this.state = {
      halationState: [],
    };
    const { enableLog = false } = props;

    this.contextValue = {
      enableLog,
    };
  }

  static getDerivedStateFromProps(nextProps: { halationState: HalationState }) {
    const { halationState } = nextProps;
    if (Array.isArray(halationState)) {
      return {
        halationState,
      };
    }

    return null;
  }

  registerModules() {}

  public getPropsAPI() {
    return {
      moduleMap: this.moduleMap,
      loadManagerMap: this.loadManagerMap,
      addBlockLoadManager: this.addBlockLoadManager,
      reportRef: this.reportRef,
      getRef: this.getRef,
      watch: this.refTracker.watch,
    };
  }

  createChildren() {
    return this.state.halationState.map((block, index) =>
      createElement<BlockNodePreProps>(
        BlockNode,
        {
          block,
          key: index,
          renderBlock: this.renderBlock,
          ...this.getPropsAPI(),
        },
        []
      )
    );
  }

  render() {
    const children = this.renderCompat();
    return (
      <context.Provider value={this.contextValue}>{children}</context.Provider>
    );
  }
}

const HalationLite: React.FC<HalationLiteClassProps> = props => {
  const contextValue = useContext(context);

  return <HalationLiteClass {...props} contextValue={contextValue} />;
};

export default HalationLite;
