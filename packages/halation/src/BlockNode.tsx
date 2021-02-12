import {
  FC,
  useRef,
  useMemo,
  createElement,
  FunctionComponentElement,
} from 'react';
import invariant from 'invariant';
import { BlockNodePreProps, SlotProps } from './types';
import { logActivity, BlockWrapper } from '@xhs/halation-core';

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

export default BlockNode;
