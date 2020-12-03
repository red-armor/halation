import { BlockProps, Predicate, Iterator } from '../types';
import Record from './Record';

class OrderedMap {
  private _map: Map<string, Record>;
  private _list: Array<BlockProps>;

  constructor(list: Array<BlockProps>) {
    this._list = list;
    this.convert(list);
    this._map = new Map<string, Record>();
  }

  convert(list: Array<BlockProps>) {
    list.reduce(
      (result, cur) => {
        const { prevItem, nextItem, listMap } = result;
        const { prevSibling, nextSibling, parent } = cur;
        const {
          prevSibling: prevItemPrevSibling,
          nextSibling: prevItemNextSibling,
          parent: prevItemParent,
        } = prevItem;

        if (parent !== prevItemParent) {
        }
      },
      {
        prevItem: {},
        nextItem: {},
        listMap: new Map(),
      }
    );
  }

  validateChildren() {}

  validateSlots() {}

  validateParentKey(parent: any) {
    if (!parent) return true;
    if (typeof parent === 'string') {
      const parts = parent.split('.');
      if (parts.length >= 3)
        throw new Error(
          'Parent key only support two level access. and' +
            "the second key should be 'slot'"
        );
      if (parts.length === 2 && parts[1] !== 'slot')
        throw new Error("The second parent key should be 'slot'");
      return true;
    }

    throw new Error(`parent should be a string or null value`);
  }

  validateLinks() {}

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

      if (!fn(value, key, this._list)) return index;
    }
    return -1;
  }

  skipUntil(predicate: Predicate) {}

  takeUntil() {}

  insertBefore() {}

  updateLinks() {}
}

export default OrderedMap;
