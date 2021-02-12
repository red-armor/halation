import {
  FC,
  createElement,
  useRef,
  useMemo,
  FunctionComponentElement,
} from 'react';
import {
  BlockWrapper,
  RecordBase,
  BlockNodePreProps,
  RenderBlockBaseComponentProps,
} from '@xhs/halation-core';

const BlockNode: FC<BlockNodePreProps<
  RenderBlockBaseComponentProps
>> = props => {
  const { block, addBlockLoadManager, ...rest } = props;
  const recordKey = block.getKey();
  const moduleName = block.getName();
  const isMountRef = useRef(false);
  const childrenData = block.getChildren() as Array<RecordBase>;

  if (!isMountRef.current) {
    addBlockLoadManager({
      blockKey: recordKey,
      moduleName,
    });
    isMountRef.current = true;
  }

  const children: Array<FunctionComponentElement<
    BlockNodePreProps<RenderBlockBaseComponentProps>
  > | null> = useMemo(() => {
    return childrenData
      .map((child, index) => {
        return createElement(
          BlockNode,
          {
            block: child,
            key: `${index}`,
            ...rest,
            addBlockLoadManager,
          },
          null
        );
      })
      .filter(v => v);
  }, [childrenData]); // eslint-disable-line

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
