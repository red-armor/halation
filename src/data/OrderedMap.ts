import invariant from 'invariant';
import { OrderedMapProps, Predicate, Iterator } from '../types';
import Record from './Record';

class OrderedMap {
  private _map: Map<string, Record>;
  private _list: Array<OrderedMapProps>;
  private _nullParentKeys: Array<string>;

  constructor(list: Array<OrderedMapProps>) {
    this._list = list;
    this._map = new Map<string, Record>();
    this._nullParentKeys = [];
    this.build();
  }

  getMap() {
    return this._map;
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

  assertParentKey(options: {
    currentParentKey: string | null;
    currentKey: string | null;
    nextParentKey: string | null;
  }) {
    const { currentParentKey, currentKey, nextParentKey } = options;

    if (currentParentKey === nextParentKey) return true;

    if (!currentParentKey && !nextParentKey) return true;
    if (!currentParentKey && nextParentKey) {
      const parts = nextParentKey.split('.');
      if (parts[0] === currentKey) return true;
    }
    if (!currentKey) return true;

    if (currentParentKey && !nextParentKey) return true;

    const currentParts = (currentParentKey || '')!.split('.');
    const nextParts = (nextParentKey || '').split('.');

    if (currentParts.length === nextParts.length) {
      if (currentParts.length === 1) {
        if (this._map.get(nextParts[0]))
          throw new Error(
            `${nextParts[0]} has been used before, please put current item on correct position`
          );
      }

      if (currentParts.length === 3) {
        if (nextParts[0] !== currentParts[0])
          throw new Error(
            `${nextParts[0]} has been used before, please put current item on correct position`
          );
        const slotKey = nextParts[2];
        if (this._map.get(nextParts[0])?.getSlot()[slotKey])
          throw new Error(
            `${nextParts[0]} has been used before, please put current item on correct position`
          );
      }
    }

    if (currentParts.length !== nextParts.length) {
      if (currentParts.length === 1) {
        if (nextParts[0] !== currentParts[0])
          throw new Error(`You should create ${nextParts[0]} first`);
      }

      if (currentParts.length === 3) {
        if (this._map.get(nextParts[0]))
          throw new Error(
            `${nextParts[0]} has been used before, please put current item on correct position`
          );
      }
    }

    return true;
  }

  createFromArray(list: Array<OrderedMapProps>) {
    const len = list.length;
    const keysWithNullParent = [];
    let currentParentKey = null;
    // let currentKey = null;

    for (let index = 0; index < len; index++) {
      const currentItem = list[index];
      const { parent, key } = currentItem;
      if (this._map.has(key)) {
        throw new Error(`Duplicated key '${key}' is not allowed`);
      }

      if (currentParentKey !== parent) {
        // this.assertParentKey({
        //   currentParentKey,
        //   currentKey,
        //   nextParentKey: parent,
        // });
        currentParentKey = parent;
      }
      // currentKey = key;

      const record = new Record(currentItem, this._map);
      this._map.set(key, record);

      if (!parent) {
        keysWithNullParent.push(key);
        continue;
      }
      this.validateParentKey(parent);
      const parts = parent.split('.');
      const [parentKey, , slotProperty] = parts as Array<string>;
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

    this._nullParentKeys = keysWithNullParent.slice();
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

  insertBefore(list: Array<OrderedMapProps>, targetKey: string) {
    this.insert({
      list,
      targetKey,
      before: true,
    });
  }
  insertAfter(list: Array<OrderedMapProps>, targetKey: string) {
    this.insert({
      list,
      targetKey,
      before: false,
    });
  }

  insert(options: {
    list: Array<OrderedMapProps>;
    targetKey: string;
    before: boolean;
  }) {
    const { list, targetKey, before } = options;
    const baseItem = this._map.get(targetKey);
    if (!baseItem)
      throw new Error(
        `[insertBefore] ${targetKey} should be created before use`
      );
    const baseParent = baseItem.getParent();

    const len = list.length;
    const keysWithNullParent = [];
    let currentParentKey = baseParent;
    // let currentKey = null;
    const nextList = before ? list : list.reverse();

    for (let index = 0; index < len; index++) {
      const currentItem = nextList[index];
      const { parent, key } = currentItem;
      if (this._map.has(key)) {
        throw new Error(`Duplicated key '${key}' is not allowed`);
      }
      const record = new Record(currentItem, this._map);
      this._map.set(key, record);

      if (!baseParent) {
        if (currentParentKey !== parent) {
          // this.assertParentKey({
          //   currentParentKey,
          //   currentKey,
          //   nextParentKey: parent,
          // });
          currentParentKey = parent;
          // currentKey = key;
        }
      } else {
        if (!currentParentKey)
          throw new Error(`currentParentKey should not be null`);
        const baseParentParts = baseParent.split('.');
        const currentParentParts = currentParentKey.split('.');

        if (baseParentParts[0] !== currentParentParts[0])
          throw new Error(
            `${currentParentKey} should start with ${baseParentParts[0]}`
          );
      }

      if (!parent) {
        keysWithNullParent.push(key);
        continue;
      }
      this.validateParentKey(parent);
      const parts = parent.split('.');
      const [parentKey, , slotProperty] = parts as Array<string>;
      const parentItem = this._map.get(parentKey);
      invariant(
        parentItem,
        `Parent with key '${parentKey}' should be defined first`
      );

      // 当前的item是slot property
      if (slotProperty) {
        parentItem.insertIntoSlot({ slotProperty, record, before, targetKey });
      } else {
        parentItem.insertIntoChildren({ record, targetKey, before });
      }
    }

    if (!baseParent) {
      const targetIndex = this._nullParentKeys.findIndex(
        (key) => key === targetKey
      );
      if (targetIndex !== -1) {
        this._nullParentKeys = ([] as Array<string>).concat(
          this._nullParentKeys.slice(0, targetIndex),
          keysWithNullParent,
          this._nullParentKeys.slice(targetIndex)
        );

        this.updateNullParentLinks(this._nullParentKeys);
      }
    }
  }
}

export default OrderedMap;
