import {
  FC,
  useEffect,
  createElement,
  FunctionComponentElement,
  useState,
} from 'react';
import { BlockNodeProps } from './types';

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
  }, [key]);

  if (!wrapper.Component) return null;

  return createElement(wrapper.Component);
};

const BlockNode: FC<BlockNodeProps> = props => {
  const { block, nodeMap, ...rest } = props;
  const children: Array<FunctionComponentElement<BlockNodeProps>> = [];
  const childKeys = block.getChildKeys();

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
