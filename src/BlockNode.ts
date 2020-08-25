import { FC, useEffect, createElement, FunctionComponentElement } from 'react';
import { BlockNodeProps } from './types';

const BlockWrapper: FC<BlockNodeProps> = props => {
  const { hooks, block, moduleMap } = props;
  const key = block.getKey();
  const name = block.getName();

  useEffect(() => {
    const module = moduleMap.get(name);
    hooks.register.call(key, block);
  }, [key]);

  return null;
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
