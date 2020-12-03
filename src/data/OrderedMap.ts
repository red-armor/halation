import invariant from 'invariant';
import { OrderedMapProps, Predicate, Iterator } from '../types';
import Record from './Record';

class OrderedMap {
  private _map: Map<string, Record>;
  private _list: Array<OrderedMapProps>;

  constructor(list: Array<OrderedMapProps>) {
    this._list = list;
    this._map = new Map<string, Record>();
    this.build();
  }

  updateNullParentLinks(keys?: Array<string>) {
    const nextKeys = keys || [];
    const len = nextKeys.length;
    for (let index = 0; index < len; index++) {
      const currentKey = nextKeys[index];
      const nextKey = nextKeys[index + 1];
      const current = this._map.get(currentKey);
      const next = this._map.get(nextKey);

      if (current && next) {
        current.updateSibling({
          nextSibling: next.getKey(),
        });
        next.updateSibling({
          prevSibling: current.getKey(),
        });

        continue;
      }
    }
  }

  build() {
    if (this._list.length) this.createFromArray(this._list);
  }

  createFromArray(list: Array<OrderedMapProps>) {
    const len = list.length;
    const keysWithNullParent = [];
    for (let index = 0; index < len; index++) {
      const currentItem = list[index];
      const { parent, key } = currentItem;
      if (this._map.has(key)) {
        throw new Error(`Duplicated key '${key}' is not allowed`);
      }
      const record = new Record(currentItem, this._map);
      this._map.set(key, record);

      if (!parent) {
        keysWithNullParent.push(key);
        continue;
      }
      this.validateParentKey(parent);
      const parts = parent.split('.');
      const [parentKey, , slotProperty] = parts;
      const parentItem = this._map.get(parentKey);
      invariant(
        parentItem,
        `Parent with key '${parentKey}' should be defined first`
      );

      // 当前的item是slot property
      if (slotProperty) {
        parentItem.appendSlot({ slotProperty, record });
      } else {
        parentItem.appendChildren({ record });
      }
    }

    this.updateNullParentLinks(keysWithNullParent);
  }

  get(key: string) {
    return this._map.get(key);
  }

  validateChildren() {}

  validateSlots() {}

  validateParentKey(parent: any) {
    if (!parent) return true;
    if (typeof parent === 'string') {
      const parts = parent.split('.');
      if (parts.length > 3)
        throw new Error(
          'Parent key only support two level access. and' +
            "the second key should be 'slot'"
        );
      if (parts.length === 3 && parts[1] !== 'slot')
        throw new Error("The second parent key should be 'slot'");
      return true;
    }

    throw new Error(`parent should be a string or null value`);
  }

  find(predicate: Predicate, notSetValue: any) {
    const index = this.each(predicate);
    if (index === -1) {
      return notSetValue;
    }
    return this._list[index];
  }

  findIndex(predicate: Predicate) {
    return this.each(predicate);
  }

  each(fn: Iterator) {
    const len = this._list.length;
    for (let index = 0; index < len; index++) {
      const value = this._list[index];
      const { key } = value;

      if (fn(value, key, this._list)) return index;
    }
    return -1;
  }

  skipUntil() {}

  takeUntil() {}

  insertBefore() {}

  updateLinks() {}
}

export default OrderedMap;
