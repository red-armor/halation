const state = [
  {
    name: 'plugin-a',
    key: 'plugin-a-1',
    prevSibling: null,
    nextSibling: 'plugin-b-2',
    parent: null,
    type: 'block',
  },
  {
    name: 'plugin-b',
    key: 'plugin-b-1',
    prevSibling: 'plugin-a-1',
    nextSibling: 'plugin-c-1',
    parent: null,
    type: 'block',
  },
  {
    name: 'plugin-c',
    key: 'plugin-c-1',
    prevSibling: 'plugin-b-1',
    nextSibling: null,
    parent: null,
    type: 'block',
  },
];
