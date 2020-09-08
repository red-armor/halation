import React, {
  FC,
  useEffect,
  createElement,
  FunctionComponentElement,
  useState,
  Fragment,
  useRef,
  forwardRef,
} from 'react';
import { BlockNodeProps, BlockWrapperProps } from './types';
import { logActivity } from './logger';

const BlockWrapper: FC<BlockNodeProps> = props => {
  const { hooks, block, moduleMap, blockRenderFn } = props;
  const [wrapper, setWrapper] = useState<{
    Component: null | FC<any>;
  }>({
    Component: null,
  });
  const key = block.getKey();
  const name = block.getName();
  const blockRef = useRef();

  useEffect(() => {
    const module = moduleMap.get(name);
    if (module) {
      hooks.register.call(key, block);
      module.loadComponent().then(wrapper => {
        setWrapper({
          Component: wrapper as FC<any>,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Helper = () => {
    return null;
  };

  if (!wrapper.Component) return null;

  let blockRenderer = null;

  if (typeof blockRenderFn === 'function') {
    blockRenderer = blockRenderFn(block.getBlockProps());
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
  const { block, nodeMap, blockRenderFn, ...rest } = props;
  const children: Array<FunctionComponentElement<BlockNodeProps>> = [];
  const childKeys = block.getChildKeys();

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
