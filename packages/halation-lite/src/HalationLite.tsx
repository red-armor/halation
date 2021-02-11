import React, { createElement, useContext } from 'react';
import {
  HalationBase,
  HalationClassProps,
  HalationState,
  BlockNodePreProps,
  RenderBlockBaseProps,
  HalationContextValue,
} from '@xhs/halation-core';
import context from './context';
import BlockNode from './BlockNode';
import {
  HalationLiteClassProps,
  RegisterFunction,
  HalationLiteRegisterResult,
  HalationLiteStateRawDataProps,
} from './types';
import createFromLiteArray from './createFromLiteArray';
import Module from './Module';
class HalationLiteClass extends HalationBase<
  HalationLiteStateRawDataProps,
  RenderBlockBaseProps,
  HalationState,
  HalationClassProps<HalationLiteStateRawDataProps, RenderBlockBaseProps>
> {
  public contextValue: HalationContextValue;
  public registers: Array<RegisterFunction>;

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
    const { enableLog = false, registers } = props;

    this.contextValue = {
      enableLog,
    };
    this.registers = registers;
    this.registerModules();
  }

  static getDerivedStateFromProps(nextProps: {
    halationState: HalationLiteStateRawDataProps;
  }) {
    const { halationState } = nextProps;
    if (Array.isArray(halationState)) {
      return {
        halationState: createFromLiteArray(halationState),
      };
    }

    return null;
  }

  registerModules() {
    this.registers.forEach(register => {
      const moduleProps: HalationLiteRegisterResult = register.call(null);
      const { name, getComponent } = moduleProps;
      if (!this.moduleMap.get(name)) {
        const module = new Module({
          name,
          getComponent,
        });

        this.moduleMap.set(name, module);
      }
    });
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
