import {
  createElement,
  useRef,
  useMemo,
  FunctionComponentElement,
} from 'react';
import {
  BlockWrapper,
  RecordBase,
  BlockNodePreProps,
} from '@xhs/halation-core';

const BlockNode = (props: any) => {
  const { block, modelKey, addBlockLoadManager, ...rest } = props;
  const recordKey = block.getKey();
  const moduleName = block.getName();
  const isMountRef = useRef(false);
  const childrenData = block.getChildren() as Array<RecordBase>;

  if (!isMountRef.current) {
    addBlockLoadManager({
      blockKey: recordKey,
      modelKey,
      moduleName,
    });
    isMountRef.current = true;
  }

  const children: Array<FunctionComponentElement<
    BlockNodePreProps
  > | null> = useMemo(() => {
    return childrenData
      .map((child, index) => {
        return createElement(
          BlockNode,
          {
            block: child,
            key: index,
            ...rest,
            addBlockLoadManager,
          },
          null
        );
      })
      .filter(v => v);
  }, [block.getChildren()]);

  return createElement(
    BlockWrapper,
    {
      ...rest,
      block,
    },
    children
  );
};

export default BlockNode;
