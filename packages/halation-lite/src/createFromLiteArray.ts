import { HalationLiteStateRawDataProps } from './types';
import { generateRandomKey } from './commons/key';
import { RecordBase } from '@xhs/halation-core';

const createFromLiteArray = (
  data: Array<HalationLiteStateRawDataProps>
): Array<RecordBase> => {
  if (Array.isArray(data)) {
    try {
      return data.map(props => {
        const key = generateRandomKey();
        const { children } = props;
        let nextChildren = [] as Array<RecordBase>;
        if (Array.isArray(children) && children.length) {
          nextChildren = createFromLiteArray(children);
        }
        const item = new RecordBase({
          ...props,
          children: nextChildren || [],
          key,
        });
        return item;
      });
    } catch (err) {
      console.error('');
    }
  }

  return [];
};

export default createFromLiteArray;
