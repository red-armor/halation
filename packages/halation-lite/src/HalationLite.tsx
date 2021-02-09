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
    const { enableLog } = props;

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
}

const HalationLite: React.FC<HalationLiteClassProps> = props => {
  const contextValue = useContext(context);

  return <HalationLiteClass {...props} contextValue={contextValue} />;
};

export default HalationLite;
