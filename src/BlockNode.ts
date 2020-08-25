import {
  FC,
  useEffect,
  createElement,
  FunctionComponentElement,
  useState,
} from 'react';
import { BlockNodeProps } from './types';
import { log } from './logger';

const DEBUG = false;

const BlockWrapper: FC<BlockNodeProps> = props => {
  const { hooks, block, moduleMap } = props;
  const [wrapper, setWrapper] = useState<{
    Component: null | FC<any>;
  }>({
    Component: null,
  });
  const key = block.getKey();
  const name = block.getName();

  useEffect(() => {
    const module = moduleMap.get(name);
    if (module) {
      hooks.register.call(key, block);
      const getComponent = module.getComponent();
      Promise.resolve(getComponent()).then(wrapper => {
        setWrapper({
          Component: wrapper,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!wrapper.Component) return null;

  return createElement(wrapper.Component, props);
};

const BlockNode: FC<BlockNodeProps> = props => {
  const { block, nodeMap, ...rest } = props;
  const children: Array<FunctionComponentElement<BlockNodeProps>> = [];
  const childKeys = block.getChildKeys();

  if (DEBUG) {
    log('render block ', block);
  }

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
