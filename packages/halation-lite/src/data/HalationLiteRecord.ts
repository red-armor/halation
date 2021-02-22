import { RecordBase } from '@xhs/halation-core';
import { HalationLiteProps } from '../types';

class HalationLiteRecord extends RecordBase {
  private _slot?: string;

  constructor(props: HalationLiteProps) {
    super(props);
    const { slot } = props;

    this._slot = slot;
  }

  getSlot() {
    return this._slot;
  }
}

export default HalationLiteRecord;
