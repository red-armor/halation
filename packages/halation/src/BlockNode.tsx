import React, {
  FC,
  useMemo,
  createElement,
  FunctionComponentElement,
} from 'react';
import { BlockNodePreProps, SlotComponents } from './types';
import {
  logActivity,
  LogActivityType,
  BlockWrapper,
  timeElapse,
  utils,
} from '@xhs/halation-core';

const { generateLoadManagerKey } = utils;

const BlockNodeWithoutNull: FC<BlockNodePreProps> = props => {
  const {
    block,
    nodeMap,
    renderBlock,
    addBlockLoadManager,
    modelKey,
    loadManagerMap,
    ...rest
  } = props;
  const childKeys = block.getChildKeys();
  const blockKey = block.getKey();
  const moduleName = block.getName();
  const slot = block.getSlot();
  const moduleMap = props.moduleMap;
  const module = moduleMap.get(moduleName)!;
  const loadManagerKey = generateLoadManagerKey(moduleName, blockKey);

  // block strategy comes first, then from module...
  const strategies = block.getStrategies() || module?.getStrategies() || [];

  if (!loadManagerMap.get(loadManagerKey)) {
    addBlockLoadManager({
      blockKey,
      modelKey,
      moduleName,
      strategies,
    });
  }

  logActivity('BlockNode', {
    message: 'render block node',
    value: block.getKey(),
  });

  timeElapse(`render ${block.getKey()}`);

  const slotKeys = Object.keys(slot);
  const slotComponents = useMemo(
    () =>
      slotKeys.reduce((acc, cur) => {
        const group = ([] as Array<string>).concat(slot[cur]);
        acc[cur] = group
          .map(childKey => {
            const node = nodeMap.get(childKey);
            const name = node?.getName();
            if (node) {
              return createElement(
                BlockNode,
                {
                  key: `${childKey}_${name}`,
                  modelKey: node.getModelKey()!,
                  block: node,
                  nodeMap,
                  renderBlock,
                  addBlockLoadManager,
                  loadManagerMap,
                  ...rest,
                },
                null
              );
            }
            return null;
          })
          .filter(v => v);

        return acc;
      }, {} as SlotComponents),
    [slot] // eslint-disable-line
  );

  const children: Array<FunctionComponentElement<
    BlockNodePreProps
  > | null> = useMemo(() => {
    return childKeys
      .map((childKey: string) => {
        const node = nodeMap.get(childKey);
        const name = node?.getName();
        if (node) {
          return createElement(
            BlockNode,
            {
              key: `${childKey}_${name}`,
              block: node,
              modelKey: node.getModelKey()!,
              nodeMap,
              renderBlock,
              addBlockLoadManager,
              loadManagerMap,
              ...rest,
            },
            null
          );
        }
        return null;
      })
      .filter(v => v);
    }, [childKeys]); // eslint-disable-line

  return createElement<any>(
    BlockWrapper,
    {
      ...props,
      modelKey: block.getDefinitelyModelKey(),
      $_modelKey: block.getDefinitelyModelKey(),
      slot: slotComponents,
    },
    children
  );
};

const BlockNode: FC<BlockNodePreProps> = props => {
  const { block } = props;
  const moduleName = block.getName();
  const moduleMap = props.moduleMap;
  const module = moduleMap.get(moduleName)!;

  if (!module) {
    logActivity('BlockNode', {
      message:
        `module ${moduleName} is required to register first. Please check whether ` +
        `module ${moduleName} is defined in 'registers' props`,
      type: LogActivityType.ERROR,
    });

    return null;
  }

  return <BlockNodeWithoutNull {...props} />;
};

export default BlockNode;
