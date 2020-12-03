import OrderedMap from './OrderedMap';

describe('basic usage', () => {
  it('parent is null', () => {
    const state = [
      {
        name: 'plugin-a',
        key: 'plugin-a-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-b',
        key: 'plugin-b-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-c-1',
        parent: null,
        type: 'block',
      },
    ];

    const orderedMap = new OrderedMap(state);
    expect(orderedMap).toMatchSnapshot();
  });

  it('has parent key', () => {
    const state = [
      {
        name: 'plugin-a',
        key: 'plugin-a-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-b',
        key: 'plugin-b-1',
        parent: 'plugin-a-1',
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-c-1',
        parent: 'plugin-a-1',
        type: 'block',
      },
    ];

    const orderedMap = new OrderedMap(state);
    expect(orderedMap).toMatchSnapshot();
  });

  it('has slot key', () => {
    const state = [
      {
        name: 'plugin-a',
        key: 'plugin-a-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-b',
        key: 'plugin-b-1',
        parent: 'plugin-a-1.slot.header',
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-c-1',
        parent: 'plugin-a-1.slot.header',
        type: 'block',
      },
    ];

    const orderedMap = new OrderedMap(state);
    expect(orderedMap).toMatchSnapshot();
  });

  it('has slot with different key', () => {
    const state = [
      {
        name: 'plugin-a',
        key: 'plugin-a-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-b',
        key: 'plugin-b-1',
        parent: 'plugin-a-1.slot.header',
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-c-1',
        parent: 'plugin-a-1.slot.content',
        type: 'block',
      },
    ];

    const orderedMap = new OrderedMap(state);
    expect(orderedMap).toMatchSnapshot();
  });

  it('multiple header and has slot with different key', () => {
    const state = [
      {
        name: 'plugin-a',
        key: 'plugin-a-1',
        parent: null,
        type: 'block',
      },
      {
        name: 'plugin-b',
        key: 'plugin-b-1',
        parent: 'plugin-a-1.slot.header',
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-c-1',
        parent: 'plugin-a-1.slot.content',
        type: 'block',
      },
      {
        name: 'plugin-c',
        key: 'plugin-d-1',
        parent: null,
        type: 'block',
      },
    ];

    const orderedMap = new OrderedMap(state);
    expect(orderedMap).toMatchSnapshot();
  });
});
