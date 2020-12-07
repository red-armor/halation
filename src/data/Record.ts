import { OrderedMapProps, BlockRenderProps, Strategy, Slot } from '../types';
import invariant from 'invariant';

class Record {
  private name: string;
  private key: string;
  private prevSibling: string | null;
  private nextSibling: string | null;
  private type: string;
  private children: Array<string>;
  private strategies?: Array<Strategy>;
  private props?: object;
  private _slot: Slot;
  readonly _map: Map<string, Record>;
  private parent: string | null;
  private _modelKey: string;

  constructor(props: OrderedMapProps, _map: Map<string, Record>) {
    const {
      key,
      type,
      name,
      strategies,
      props: blockProps,
      parent,
      modelKey,
    } = props;
    this.key = key;
    this._modelKey = modelKey || key;
    this._slot = {};
    this.name = name;
    this.prevSibling = null;
    this.nextSibling = null;
    this.type = type || 'block';
    this.children = [];
    this.strategies = strategies || [];
    this.props = blockProps || {};
    this._map = _map;
    this.parent = parent;
  }

  getChildKeys(): Array<string> {
    return this.children;
  }

  getNextSibling(): string | null {
    return this.nextSibling;
  }

  getPrevSibling(): string | null {
    return this.prevSibling;
  }

  getName(): string {
    return this.name;
  }

  getKey(): string {
    return this.key;
  }

  getModelKey(): string {
    return this._modelKey;
  }

  getParent(): string | null {
    return this.parent;
  }

  getType(): string {
    return this.type;
  }

  getStrategies(): Array<Strategy> | undefined {
    return this.strategies;
  }

  getSlot(): Slot {
    return this._slot;
  }

  getRenderProps(): BlockRenderProps {
    return {
      key: this.key,
      name: this.name,
      type: this.type,
      props: this.props,
    };
  }

  insertChildren(options: {
    record: Record;
    targetKey: string;
    before: boolean;
  }) {
    const { targetKey, before, record } = options;
    const list = this.children;
    this.updateList({
      list,
      record,
      targetKey,
      before,
    });
  }

  createSlotPropertyIfNeeded(slotProperty: string) {
    if (!this._slot[slotProperty]) this._slot[slotProperty] = [];
  }

  appendChildren(options: { record: Record }) {
    const { record } = options;
    const list = this.children;
    if (!list.length) {
      this.children.push(record.getKey());
      return;
    }
    const len = list.length;
    const lastKey = list[len - 1];

    this.updateList({
      list,
      record,
      targetKey: lastKey,
      before: false,
    });
  }

  insertIntoChildren(options: {
    record: Record;
    targetKey: string | null;
    before: boolean;
  }) {
    const { record, targetKey, before } = options;
    const list = this.children;
    if (!list.length) {
      this.children.push(record.getKey());
      return;
    }
    invariant(targetKey, `targetKey is required for insertIntoSlot function`);
    this.updateList({
      list,
      record,
      targetKey,
      before,
    });
  }

  appendSlot(options: { record: Record; slotProperty: string }) {
    const { record, slotProperty } = options;
    this.createSlotPropertyIfNeeded(slotProperty);
    const list = this._slot[slotProperty];

    if (!list.length) {
      list.push(record.getKey());
      return;
    }
    const len = list.length;
    const lastKey = list[len - 1];
    this.updateList({
      list,
      record,
      targetKey: lastKey,
      before: false,
    });
  }

  insertIntoSlot(options: {
    record: Record;
    slotProperty: string;
    targetKey: string | null;
    before: boolean;
  }) {
    const { record, slotProperty, targetKey, before } = options;
    this.createSlotPropertyIfNeeded(slotProperty);
    const list = this._slot[slotProperty];
    if (!list.length) {
      list.push(record.getKey());
      return;
    }
    invariant(targetKey, `targetKey is required for insertIntoSlot function`);
    this.updateList({
      list,
      record,
      targetKey,
      before,
    });
  }

  updateSibling({
    prevSibling,
    nextSibling,
  }: {
    prevSibling?: string | null;
    nextSibling?: null | string;
  }) {
    if (typeof prevSibling !== 'undefined') {
      this.prevSibling = prevSibling;
    }

    if (typeof nextSibling !== 'undefined') {
      this.nextSibling = nextSibling;
    }
  }

  updateParent(parent: string | null) {
    if (typeof parent !== 'undefined') this.parent = parent;
  }

  updateList(options: {
    list: Array<string>;
    record: Record;
    targetKey: string;
    before: boolean;
  }) {
    const { list, record, targetKey, before } = options;

    const { key } = record;

    if (!list.length) {
      list.push(key);
      return;
    }

    const targetItem = this._map.get(targetKey);

    invariant(
      targetItem,
      `UpdateList Error: targetItem ${targetKey} is used before created`
    );

    if (before) {
      const targetItemPrevSibling = targetItem.prevSibling;
      if (targetItemPrevSibling) {
        const targetItemPrevSiblingEntry = this._map.get(targetItemPrevSibling);
        targetItemPrevSiblingEntry?.updateSibling({
          nextSibling: record.getKey(),
        });
      }
      const targetItemParent = targetItem.getParent();
      record.updateSibling({
        prevSibling: targetItemPrevSibling,
        nextSibling: targetItem.getKey(),
      });
      targetItem.updateSibling({
        prevSibling: record.getKey(),
      });

      targetItem.updateParent(targetItemParent);
      const targetKeyIndex = list.findIndex((item) => item === targetKey);
      list.splice(targetKeyIndex - 1, 0, record.getKey());
    } else {
      const targetItemNextSibling = targetItem.nextSibling;
      if (targetItemNextSibling) {
        const targetItemNextSiblingEntry = this._map.get(targetItemNextSibling);
        targetItemNextSiblingEntry?.updateSibling({
          prevSibling: record.getKey(),
        });
      }
      const targetItemParent = targetItem.parent;
      record.updateSibling({
        prevSibling: targetItem.getKey(),
        nextSibling: targetItemNextSibling,
      });
      targetItem.updateSibling({
        nextSibling: record.getKey(),
      });
      targetItem.updateParent(targetItemParent);
      const targetKeyIndex = list.findIndex((item) => item === targetKey);
      list.splice(targetKeyIndex + 1, 0, record.getKey());
    }
  }
}

export default Record;
