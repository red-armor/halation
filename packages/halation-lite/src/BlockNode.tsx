import { createElement, useRef } from 'react';
import { BlockWrapper } from '@xhs/halation-core';

const BlockNode = (props: any) => {
  const { children, record, modelKey, addBlockLoadManager, ...rest } = props;
  const recordKey = record.getKey();
  const moduleName = record.getName();
  const isMountRef = useRef(false);

  if (!isMountRef.current) {
    addBlockLoadManager({
      blockKey: recordKey,
      modelKey,
      moduleName,
    });
    isMountRef.current = true;
  }

  return createElement(
    BlockWrapper,
    {
      ...rest,
    },
    children
  );
};

export default BlockNode;
