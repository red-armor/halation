import React, {
  FC,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useCallback,
  createElement,
  useEffect,
} from 'react';
import {
  BlockWrapperProps,
  BlockComponentProps,
  BlockWrapperState,
  ForwardBlockComponentProps,
  RenderBlockBaseComponentProps,
} from './types';
import { LogActivityType } from './types';
import { logActivity } from './commons/logger'
import { isPromise, reflect } from './commons/utils';

const BlockWrapper = <RBP extends RenderBlockBaseComponentProps, P extends BlockWrapperProps<RBP>>(props: P) => {
  const {
    moduleMap,
    loadManagerMap,
    renderBlock,
    reportRef,
    ...restProps
  } = props;
  const { block } = props;

  const [wrapper, setWrapper] = useState<BlockWrapperState>({});
  const blockKey = block.getKey();
  const moduleName = block.getName();
  const blockRef = useRef();
  const setBlockRef = useCallback(
    (el: any) => {
      blockRef.current = el;
      reportRef(blockKey, blockRef);
    },
    [blockKey, reportRef]
  );
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(false);
  const isComponentLoadRef = useRef(false);
  const loadManager = loadManagerMap.get(blockKey)!;

  // Why isForceUpdateCalledRef needs ?
  // If strategy has a runtime type one. `forceUpdate` will be trigger twice.
  // `update` function in `LoadManager` will call `loadRoutine` function every
  // time one strategy return a true value. But it always has one more to trigger.
  // For example, there are a `event` strategy and `runtime` strategy, if `runtime`
  // function is true on the first time,
  //   1. `shouldModuleLoad` function in LoadManager will be called first, However,
  //       this._resolverValueMap's value are all `RESOLVED`. then it will return true
  //       directly.
  //   2. After one tick, the promise function created by `startVerifyRuntime` will
  //      be called again. it will cause duplicated running of
  //      function `loadAndForceUpdate`
  const isForceUpdateCalledRef = useRef(false);

  const unsubscribeLoadRoutine = useRef<Function | null>(null);

  useEffect(() => {
    return () => {
      logActivity('BlockNode', {
        message: `Component ${blockKey} is unmounted`,
        type: LogActivityType.ERROR,
      });
    };
  }, [blockKey]);

  const loadRoutine = useCallback(() => {
    const shouldLoadModule = loadManager?.shouldModuleLoad();

    if (isPromise(shouldLoadModule)) {
      (shouldLoadModule as Promise<boolean>).then(falsy => {
        if (falsy) loadAndForceUpdate();
      });
    } else if (shouldLoadModule) {
      loadAndForceUpdate();
    }
  }, []); // eslint-disable-line

  useEffect(() => () => {
    isMountedRef.current = false
  }, [])

  const forceUpdate = useCallback(componentResult => {
    const state: BlockWrapperState = {};

    if (componentResult.success) {
      state.Component = componentResult.value;
    }

    if (isMountedRef.current) setWrapper(state);
  }, []) // eslint-disable-line

  const loadAndForceUpdate = useCallback(() => {
    if (isForceUpdateCalledRef.current) return;
    isForceUpdateCalledRef.current = true;
    logActivity('BlockNode', {
      message: `Trigger loadAndForceUpdate ${blockKey}`,
      type: LogActivityType.INFO,
    });
    if (unsubscribeLoadRoutine.current) {
      unsubscribeLoadRoutine.current?.call(null);
      unsubscribeLoadRoutine.current = null;
    }
    if (isLoadingRef.current) return;
    const module = moduleMap.get(moduleName);
    if (module) {
      const component = module.loadComponent();

      if (isPromise(component)) {
        const loadComponentTask = Promise.resolve(component);
        reflect(loadComponentTask).then(result => {
          if (!result.success) throw result.value;
          forceUpdate(result);
        });
      } else {
        logActivity('BlockNode', {
          message: `load component & model directly..`,
        });

        forceUpdate({
          success: true,
          value: component,
        });
      }

      // TODO: temp to wrapper with Promise
    }
  }, []); // eslint-disable-line

  // 在最开始的时候，判断一下是否进行module的加载；
  if (!isMountedRef.current) {
    // In a condition, when invoke loadRoutine, model and module have already loaded.
    // it will trigger forceUpdate directly. Because there is no limit on trigger forceUpdate.
    // if `isMountedRef` is putted in `useEffect`, it will never be called and lost into
    // render loop!!!
    isMountedRef.current = true;
    unsubscribeLoadRoutine.current = loadManager.bindLoadRoutine(loadRoutine);
    loadRoutine();
  }

  // should memo, or will be a new on update..
  const RefForwardingWrapper = useMemo(
    () =>
      forwardRef<any, BlockComponentProps>((props, ref) => {
        return createElement(wrapper.Component as FC<ForwardBlockComponentProps> , {
          ...props,
          forwardRef: ref,
        });
      }),
    [wrapper.Component]
  );

  if (!wrapper.Component) return null;
  isComponentLoadRef.current = true;

  if (renderBlock) {
    return createElement(
      renderBlock,
      {
        ...restProps,
        key: blockKey,
        extraProps: block.getExtraProps(),
        blockProps: block.getRenderProps(),
      } as any as RBP,
      <RefForwardingWrapper {...restProps} props={block.getProps()} ref={setBlockRef} />
    );
  }

  return <RefForwardingWrapper {...restProps} props={block.getProps()} ref={setBlockRef} />;
};

export default BlockWrapper