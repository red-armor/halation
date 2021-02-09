import React, {
  FC,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useCallback,
  createElement,
  FunctionComponentElement,
  useEffect,
} from 'react';
import invariant from 'invariant';
import {
  BlockNodeProps,
  BlockNodePreProps,
  BlockComponentProps,
  BlockNodeState,
  SlotProps,
} from './types';
import { logActivity, LogActivityType } from './logger';
import { isPromise, reflect } from './commons';

const BlockWrapper: FC<BlockNodeProps> = props => {
  const {
    moduleMap,
    loadManagerMap,
    renderBlock,
    reportRef,
    addBlockLoadManager,
    ...restProps
  } = props;
  const { hooks, block } = props;

  const [wrapper, setWrapper] = useState<BlockNodeState>({});
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
  const modelKey = loadManager.getDefinitelyModelKey();

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

  const forceUpdate = useCallback(componentResult => {
    const state: BlockNodeState = {};

    if (componentResult.success) {
      state.Component = componentResult.value;
    }
    setWrapper(state);
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
      hooks.register.call(blockKey, block);
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
        return createElement(wrapper.Component as FC<any>, {
          ...props,
          modelKey,
          $_modelKey: modelKey,
          forwardRef: ref,
        });
      }),
    [wrapper.Component, modelKey]
  );

  if (!wrapper.Component) return null;
  isComponentLoadRef.current = true;

  if (renderBlock) {
    return createElement(
      renderBlock,
      {
        ...restProps,
        key: blockKey,
        modelKey,
        blockProps: block.getRenderProps(),
      },
      <RefForwardingWrapper {...restProps} ref={setBlockRef} />
    );
  }

  return <RefForwardingWrapper {...restProps} ref={setBlockRef} />;
};

const BlockNode: FC<BlockNodePreProps> = props => {
  const {
    block,
    nodeMap,
    renderBlock,
    addBlockLoadManager,
    modelKey,
    ...rest
  } = props;
  const childKeys = block.getChildKeys();
  const blockKey = block.getKey();
  const moduleName = block.getName();
  const slot = block.getSlot();
  const moduleMap = props.moduleMap;
  const module = moduleMap.get(moduleName)!;
  const isMountRef = useRef(false);

  invariant(
    module,
    `module ${moduleName} is required to register first. Please check whether ` +
      `module ${moduleName} is defined in 'registers' props`
  );

  // block strategy comes first, then from module...
  const strategies = block.getStrategies() || module.getStrategies() || [];

  if (!isMountRef.current) {
    addBlockLoadManager({
      blockKey,
      modelKey,
      moduleName,
      strategies,
    });
    isMountRef.current = true;
  }

  logActivity('BlockNode', {
    message: 'render block node',
    value: block.getKey(),
  });

  const slotKeys = Object.keys(slot);
  const slotComponents = useMemo(
    () =>
      slotKeys.reduce((acc, cur) => {
        const group = ([] as Array<string>).concat(slot[cur]);
        acc[cur] = group.map(childKey => {
          const node = nodeMap.get(childKey);
          if (node) {
            return createElement(
              BlockNode,
              {
                key: childKey,
                modelKey: node.getModelKey()!,
                block: node,
                nodeMap,
                renderBlock,
                addBlockLoadManager,
                ...rest,
              },
              null
            );
          }
          return null;
        });

        return acc;
      }, {} as SlotProps),
    [slot] // eslint-disable-line
  );

  const children: Array<FunctionComponentElement<
    BlockNodePreProps
  > | null> = useMemo(() => {
    return childKeys
      .map((childKey: string) => {
        const node = nodeMap.get(childKey);
        if (node) {
          return createElement(
            BlockNode,
            {
              key: childKey,
              block: node,
              modelKey: node.getModelKey()!,
              nodeMap,
              renderBlock,
              addBlockLoadManager,
              ...rest,
            },
            null
          );
        }
        return null;
      })
      .filter(v => v);
  }, [childKeys]); // eslint-disable-line

  return createElement(
    BlockWrapper,
    {
      ...props,
      slot: slotComponents,
    },
    children
  );
};

export default BlockNode;
