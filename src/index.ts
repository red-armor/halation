import BlockNode from './BlockNode';
import { Config } from './types';

class Halation {
  public name: string;
  public blockMap: Map<string, BlockNode>;

  constructor(config: Config) {
    const { name } = config;
    this.name = name;
    this.blockMap = new Map();
  }

  getName() {
    return this.name;
  }

  createBlockNode(list: Array<any>) {
    list.forEach(item => {
      const { key } = item;
      this.blockMap.set(key, new BlockNode(item));
    });
  }

  render() {}
}

export default Halation;

// name is the component name.
const data = [
  {
    name: 'header-bar',
    key: 'header-bar',
    parent: null,
    nextSibling: 'masonry-layout',
    prevSibling: null,
  },
  {
    name: 'masonry-layout',
    key: 'masonry-layout',
    parent: null,
    prevSibling: 'header-bar',
    nextSibling: 'shopping-cart-bar',
    children: ['carousel', 'barrage', 'main'],
  },
  {
    name: 'carousel',
    key: 'carousel',
    parent: 'masonry-layout',
    prevSibling: null,
    nextSibling: 'barrage',
    children: [],
  },
  {
    name: 'barrage',
    key: 'barrage',
    parent: 'masonry-layout',
    prevSibling: 'carousel',
    nextSibling: 'main',
    children: [],
  },
  {
    name: 'main',
    key: 'main',
    parent: 'masonry-layout',
    prevSibling: 'barrage',
    nextSibling: null,
    children: ['colorBackground'],
  },
  {},
];
