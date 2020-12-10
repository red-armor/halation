import React, { useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation, OrderedMap } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'
import PluginCRegister from './plugin-c/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  parent: null,
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-1',
  type: 'block',
  modelKey: 'modal',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { pluginBVisible } = event
      return !!pluginBVisible
    }
  }]
}, {
  name: 'plugin-c',
  key: 'plugin-c-1',
  type: 'block',
  modelKey: 'modal',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { pluginCVisible } = event
      return !!pluginCVisible
    }
  }]
}]

const renderBlock = props => {
  const {
    blockProps: { type },
    children,
    ...rest
  } = props

  if (type === 'block') {
    return (
      <div className="block-render-fn">
        {React.cloneElement(children, {...rest, location: 'shanghai'})}
      </div>
    )
  }

  return null
}

const store = createStore({
  models: {},
}, applyMiddleware(thunk))

export default () => {
  const [state] = useState(new OrderedMap(halationState))

  const registers = [
    PluginARegister,
    PluginBRegister,
    PluginCRegister,
  ]

  return (
    <Provider
      store={store}
    >

      <Halation
        name='super'
        halationState={state}
        registers={registers}
        renderBlock={renderBlock}
        store={store}
        events={{
          pluginCVisible: false,
          pluginBVisible: false,
        }}
      />
    </Provider>
  )
}