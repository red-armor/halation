import React, {
  FC,
  useRef,
  useState,
  forwardRef,
  useCallback,
  createElement,
  FunctionComponentElement,
} from 'react';
import invariant from 'invariant';
import {
  BlockNodeProps,
  BlockWrapperProps,
  BlockNodeState,
  SlotProps,
} from './types';
import { logActivity } from './logger';
import { isPromise, settledPromise } from './commons';

const BlockWrapper: FC<BlockNodeProps> = props => {
  const { hooks, block, moduleMap, loadManagerMap, blockRenderFn } = props;
  const [wrapper, setWrapper] = useState<BlockNodeState>({});
  const blockKey = block.getKey();
  const moduleName = block.getName();
  const blockRef = useRef();
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(false);
  const loadManager = loadManagerMap.get(blockKey)!;

  const unsubscribeLoadRoutine = useRef<Function | null>(null);

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

  const forceUpdate = useCallback(result => {
    const [modelResult, componentResult] = result;
    const state: BlockNodeState = {};
    if (modelResult.success) {
      state.model = modelResult.value;
    }

    if (componentResult.success) {
      state.Component = componentResult.value;
    }
    setWrapper(state);
  }, []) // eslint-disable-line

  const loadAndForceUpdate = useCallback(() => {
    logActivity('BlockNode', {
      message: `Trigger 'loadAndForceUpdate'`,
    });
    if (unsubscribeLoadRoutine.current)
      unsubscribeLoadRoutine.current?.call(null);
    if (isLoadingRef.current) return;
    const module = moduleMap.get(moduleName);
    if (module) {
      hooks.register.call(blockKey, block);
      const model = module.loadModel();
      const component = module.loadComponent();

      if (isPromise(model) || isPromise(component)) {
        const loadModelTask = Promise.resolve(module.loadModel());
        const loadComponentTask = Promise.resolve(module.loadComponent());
        settledPromise([loadModelTask, loadComponentTask]).then(result => {
          forceUpdate(result);
        });
      } else {
        logActivity('BlockNode', {
          message: `load component & model directly..`,
        });
        forceUpdate([
          {
            success: true,
            value: model,
          },
          {
            success: true,
            value: component,
          },
        ]);
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

  if (!wrapper.Component) return null;

  let blockRenderer = null;

  if (typeof blockRenderFn === 'function') {
    blockRenderer = blockRenderFn(block.getRenderProps());
  }

  const RefForwardingWrapper = forwardRef<any, BlockWrapperProps>(
    (props, ref) => {
      return createElement(wrapper.Component as FC<any>, {
        ...props,
        $_modelKey: loadManager.getKey(),
        forwardRef: ref,
      });
    }
  );

  if (blockRenderer) {
    return createElement(
      blockRenderer,
      props,
      <RefForwardingWrapper {...props} ref={blockRef} />
    );
  }

  return <RefForwardingWrapper {...props} ref={blockRef} />;
};

const BlockNode: FC<BlockNodeProps> = props => {
  const { block, nodeMap, blockRenderFn, addBlockLoadManager, ...rest } = props;
  const children: Array<FunctionComponentElement<BlockNodeProps>> = [];
  const childKeys = block.getChildKeys();
  const blockKey = block.getKey();
  const moduleName = block.getName();
  const slot = block.getSlot();
  const moduleMap = props.moduleMap;
  const module = moduleMap.get(moduleName)!;

  invariant(
    module,
    `module ${moduleName} is required to register first. Please check whether ` +
      `module ${moduleName} is defined in 'registers' props`
  );

  // block strategy comes first, then from module...
  const strategies = block.getStrategies() || module.getStrategies() || [];
  addBlockLoadManager({
    blockKey,
    moduleName,
    strategies,
  });

  logActivity('BlockNode', {
    message: 'render block node',
    value: block,
  });

  const slotKeys = Object.keys(slot);
  const slotComponents = slotKeys.reduce((acc, cur) => {
    const group = ([] as Array<string>).concat(slot[cur]);
    acc[cur] = group.map(childKey => {
      const node = nodeMap.get(childKey);
      if (node) {
        return createElement(
          BlockNode,
          {
            key: childKey,
            block: node,
            nodeMap,
            blockRenderFn,
            addBlockLoadManager,
            ...rest,
          },
          null
        );
      }
      return null;
    });

    return acc;
  }, {} as SlotProps);

  childKeys.forEach(childKey => {
    const node = nodeMap.get(childKey);
    if (node) {
      children.push(
        createElement(
          BlockNode,
          {
            key: childKey,
            block: node,
            nodeMap,
            blockRenderFn,
            addBlockLoadManager,
            ...rest,
          },
          null
        )
      );
    }
  });

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
