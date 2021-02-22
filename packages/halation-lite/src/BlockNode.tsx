import {
  FC,
  createElement,
  useRef,
  useMemo,
  FunctionComponentElement,
} from 'react';
import {
  BlockWrapper,
  BlockNodePreProps,
  RenderBlockBaseComponentProps,
} from '@xhs/halation-core';
import HalationLiteRecord from './data/HalationLiteRecord';

const BlockNode: FC<BlockNodePreProps<
  RenderBlockBaseComponentProps
>> = props => {
  const { block, addBlockLoadManager, ...rest } = props;
  const recordKey = block.getKey();
  const moduleName = block.getName();
  const isMountRef = useRef(false);
  const childrenData = block.getChildren() as Array<HalationLiteRecord>;

  if (!isMountRef.current) {
    addBlockLoadManager({
      blockKey: recordKey,
      moduleName,
    });
    isMountRef.current = true;
  }

  const values = useMemo(() => {
    const slotMap = {} as {
      [key: string]: Array<FunctionComponentElement<
        BlockNodePreProps<RenderBlockBaseComponentProps>
      > | null>;
    };
    const children = [] as Array<FunctionComponentElement<
      BlockNodePreProps<RenderBlockBaseComponentProps>
    > | null>;

    childrenData.forEach((child, index) => {
      const slot = child.getSlot();
      const component = createElement(
        BlockNode,
        {
          block: child,
          key: `${index}`,
          ...rest,
          addBlockLoadManager,
        },
        null
      );

      if (slot) {
        if (!slotMap[slot]) slotMap[slot] = [];
        slotMap[slot].push(component);
      } else {
        children.push(component);
      }
    });

    return {
      children,
      slotMap,
    };
  }, [childrenData]); // eslint-disable-line

  return createElement(
    BlockWrapper,
    {
      ...rest,
      block,
      ...values.slotMap,
    },
    values.children
  );
};

export default BlockNode;
