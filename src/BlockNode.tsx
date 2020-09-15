import React, {
  FC,
  useRef,
  useState,
  Fragment,
  useEffect,
  forwardRef,
  useCallback,
  createElement,
  FunctionComponentElement,
} from 'react';
import { BlockNodeProps, BlockWrapperProps, BlockNodeState } from './types';
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

  const loadAndForceUpdate = useCallback(() => {
    if (unsubscribeLoadRoutine.current)
      unsubscribeLoadRoutine.current?.call(null);
    if (isLoadingRef.current) return;
    const module = moduleMap.get(moduleName);
    if (module) {
      hooks.register.call(blockKey, block);
      // TODO: temp to wrapper with Promise
      const loadModelTask = Promise.resolve(module.loadModel());
      const loadComponentTask = Promise.resolve(module.loadComponent());
      settledPromise([loadModelTask, loadComponentTask]).then(result => {
        const [modelResult, componentResult] = result;
        const state: BlockNodeState = {};
        if (modelResult.success) {
          state.model = modelResult.value;
        }

        if (componentResult.success) {
          state.Component = componentResult.value;
        }
        setWrapper(state);
      });
    }
  }, []); // eslint-disable-line

  // 在最开始的时候，判断一下是否进行module的加载；
  if (!isMountedRef.current) {
    unsubscribeLoadRoutine.current = loadManager.bindLoadRoutine(loadRoutine);

    loadRoutine();
  }

  useEffect(() => {
    isMountedRef.current = true;
  }, []); // eslint-disable-line

  const Helper = () => {
    return null;
  };

  if (!wrapper.Component) return null;

  let blockRenderer = null;

  if (typeof blockRenderFn === 'function') {
    blockRenderer = blockRenderFn(block.getRenderProps());
  }

  const RefForwardingWrapper = forwardRef<any, BlockWrapperProps>(
    (props, ref) => {
      return createElement(wrapper.Component as FC<any>, {
        ...props,
        forwardRef: ref,
      });
    }
  );

  if (blockRenderer) {
    return (
      <Fragment>
        {createElement(
          blockRenderer,
          props,
          <RefForwardingWrapper {...props} ref={blockRef} />
        )}
        <Helper />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <RefForwardingWrapper {...props} ref={blockRef} />
      <Helper />
    </Fragment>
  );
};

const BlockNode: FC<BlockNodeProps> = props => {
  const { block, nodeMap, blockRenderFn, addBlockLoadManager, ...rest } = props;
  const children: Array<FunctionComponentElement<BlockNodeProps>> = [];
  const childKeys = block.getChildKeys();

  const blockKey = block.getKey();
  const moduleName = block.getName();
  const moduleMap = props.moduleMap;
  const module = moduleMap.get(moduleName);
  const strategies = module?.getStrategies() || [];
  addBlockLoadManager({
    blockKey,
    moduleName,
    strategies,
  });

  logActivity('BlockNode', {
    message: 'render block node',
    value: block,
  });

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

  return createElement(BlockWrapper, props, children);
};

export default BlockNode;
