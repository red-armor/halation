import { HalationLiteState } from './types';
import { generateRandomKey } from './commons/key';
import HalationLiteRecord from './data/HalationLiteRecord';

const createFromLiteArray = (
  data: Array<HalationLiteState>
): Array<HalationLiteRecord> => {
  if (Array.isArray(data)) {
    try {
      return data.map((props, index) => {
        const key = generateRandomKey();
        const { children } = props;
        let nextChildren = [] as Array<HalationLiteRecord>;
        if (Array.isArray(children) && children.length) {
          nextChildren = createFromLiteArray(children);
        }
        const item = new HalationLiteRecord({
          ...props,
          children: nextChildren || [],
          key: `${props.name}_${index}_${key}`,
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
