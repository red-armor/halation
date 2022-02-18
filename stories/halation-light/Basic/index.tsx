import React, { useEffect, useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider, useDispatch, observe } from '@xhs/relinx'
import { Halation, OrderedMap, TreeOrderedMapProps, RenderBlock } from 'halation'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState: Array<TreeOrderedMapProps> = [{
  name: 'plugin-a',
  id: 'plugin-a-1',
  type: 'block',
}, {
  name: 'plugin-b',
  id: 'plugin-b-2',
  type: 'block',
}, {
  name: 'plugin-a',
  id: 'plugin-a-3',
  type: 'block',
  children: [{
    name: 'plugin-b',
    id: 'plugin-b-4',
    type: 'block',
  }, {
    name: 'plugin-b',
    id: 'plugin-b-5',
    type: 'block',
  }]
}]

const renderBlock: RenderBlock = props => {
  const {
    blockProps: { type },
    children,
  } = props

  if (type === 'block') {
    return (
      <div className="block-render-fn">
        {React.cloneElement(children, { location: 'shanghai'})}
      </div>
    )
  }

  return null
}

type Models = {}

const store = createStore<Models>({
  models: {},
}, applyMiddleware(thunk))

const Helper = () => {
  const [dispatch] = useDispatch()

  useEffect(() => {
    dispatch([{
      type: 'plugin-b-2/setProps',
      payload: {
        count: 2,
      }
    }, {
      type: 'plugin-b-4/setProps',
      payload: {
        count: 2,
      }
    }])
  }, [])

  return null
}

const ObservedHelper = observe(Helper)

export default () => {
  const [state] = useState(new OrderedMap(halationState, true))

  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <Provider
      store={store}
    >
      <ObservedHelper />
      <Halation
        name='super'
        perf
        halationState={state}
        registers={registers}
        renderBlock={renderBlock}
        store={store}
        events={{
          flags: {},
        }}
      />
    </Provider>
  )
}