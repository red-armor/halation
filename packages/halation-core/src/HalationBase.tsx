import { FC, PureComponent, FunctionComponentElement } from 'react';
import invariant from 'invariant';
import {
  ModuleMap,
  HalationClassProps,
  RenderBlock,
  LoadManagerMap,
  HalationContextValue,
  LogActivityType,
  RenderBlockBaseProps,
} from './types';
import { logActivity, setLoggerContext } from './commons/logger'
import LoadManager from './LoadManagerBase';
import RefTracker from './RefTracker';
import { isPresent } from './commons/utils';

abstract class HalationBaseClass<
  HS,
  RBP extends RenderBlockBaseProps,
  S,
  P extends HalationClassProps<HS, RBP> = HalationClassProps<HS, RBP>,
> extends PureComponent<P, S>
{
  public name: string;
  public renderBlock?: RenderBlock<RBP>;
  public moduleMap: ModuleMap;
  public loadManagerMap: LoadManagerMap;
  public refTracker: RefTracker;
  public enableLog: boolean;
  public abstract contextValue: HalationContextValue;
  public rootRenderFn?: FC<any>;
  private clearLoggerContext: Function;
  public registers: Array<Function>

  constructor(props: P) {
    super(props);
    const {
      name,
      enableLog,
      registers,
      renderBlock,
      rootRenderFn,
      contextValue,
    } = props;

    this.renderBlock = renderBlock;
    this.name = name;
    this.moduleMap = new Map();
    this.loadManagerMap = new Map();
    this.rootRenderFn = rootRenderFn;
    this.registers = registers

    invariant(
      !(isPresent(enableLog) && isPresent(contextValue.enableLog)),
      `Nested Halation should not be passing with 'enableLog' props`
    );

    this.enableLog = (isPresent(enableLog) ? enableLog : false) as boolean;
    this.clearLoggerContext = setLoggerContext({ enableLog: this.enableLog });

    this.refTracker = new RefTracker();

    this.addBlockLoadManager = this.addBlockLoadManager.bind(this);
    this.reportRef = this.reportRef.bind(this);
    this.getRef = this.getRef.bind(this);
  }

  abstract registerModules(): void

  componentWillUmount() {
    this.clearLoggerContext();
  }

  getName() {
    return this.name;
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

  public reportRef(key: string, ref: any) {
    this.refTracker.setRef(key, ref);
  }

  public getRef(key: string) {
    return this.refTracker.getRef(key);
  }

  public addBlockLoadManager({
    blockKey,
    moduleName,
  }: {
    blockKey: string;
    moduleName: string;
    modelKey?: string;
  }): boolean {
    if (this.loadManagerMap.get(blockKey)) {
      logActivity('Halation', {
        message: `Duplicated module key ${blockKey} is registered in halation application`,
        type: LogActivityType.WARNING,
      });
      return false;
    }

    this.loadManagerMap.set(
      blockKey,
      new LoadManager({
        blockKey,
        moduleName,
        moduleMap: this.moduleMap,
      })
    );

    return true;
  }

  abstract createChildren(): Array<FunctionComponentElement<any>>

  // render() {
  //   const children = this.createChildren()

  //   if (typeof this.rootRenderFn === 'function') {
  //     return React.createElement(
  //       this.rootRenderFn,
  //       {
  //         ...this.getPropsAPI(),
  //       },
  //       children
  //     );
  //   }

  //   return (
  //     <context.Provider value={this.contextValue}>{children}</context.Provider>
  //   );
  // }
}

export default HalationBaseClass