import React, { useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation, OrderedMap } from 'halation'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'
import PluginCRegister from './plugin-c/register'
import PluginDRegister from './plugin-d/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-1',
  type: 'block',
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
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { pluginCVisible } = event
      return !!pluginCVisible
    }
  }]
}, {
  name: 'plugin-d',
  key: 'plugin-d-1',
  type: 'block',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { pluginDVisible } = event
      return !!pluginDVisible
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
    PluginDRegister
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
          pluginAVisible: true,
          pluginBVisible: false,
          pluginCVisible: false,
          pluginDVisible: false,
        }}
      />
    </Provider>
  )
}