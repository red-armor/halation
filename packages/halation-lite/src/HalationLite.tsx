import React, { createElement, useContext } from 'react';
import {
  HalationBase,
  HalationClassProps,
  HalationState,
  BlockNodePreProps,
  RenderBlockBaseComponentProps,
  HalationContextValue,
  RegisterBaseResult,
  ModuleBase,
} from '@xhs/halation-core';
import context from './context';
import BlockNode from './BlockNode';
import {
  HalationLiteClassProps,
  HalationLiteRegister,
  HalationLiteState,
} from './types';
import createFromLiteArray from './createFromLiteArray';

class HalationLiteClass extends HalationBase<
  HalationLiteRegister,
  Array<HalationLiteState>,
  RenderBlockBaseComponentProps,
  HalationState,
  HalationClassProps<
    HalationLiteRegister,
    Array<HalationLiteState>,
    RenderBlockBaseComponentProps
  >
> {
  public contextValue: HalationContextValue;

  constructor(
    props: HalationClassProps<
      HalationLiteRegister,
      Array<HalationLiteState>,
      RenderBlockBaseComponentProps
    >
  ) {
    super(props);
    this.state = {
      halationState: [],
    };

    this.contextValue = {
      enableLog: this.nextEnableLog,
    };
    this.registerModules();
  }

  static getDerivedStateFromProps(nextProps: {
    halationState: HalationLiteState;
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
      const moduleProps: RegisterBaseResult = register.call(null);
      const { name, getComponent } = moduleProps;
      if (!this.moduleMap.get(name)) {
        const module = new ModuleBase({
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
      createElement<BlockNodePreProps<RenderBlockBaseComponentProps>>(
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
