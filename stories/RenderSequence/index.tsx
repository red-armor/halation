import React from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation } from '../../src'

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

const blockRenderFn = blockProps => {
  const { type } = blockProps

  if (type === 'block') {
    return props => {
      const { children, ...rest } = props
      return (
        <div className="block-render-fn">
          {React.cloneElement(children, {...rest, location: 'shanghai'})}
        </div>
      )
    }
  }
}

const store = createStore({
  models: {},
}, applyMiddleware(thunk))

export default () => {
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
        halationState={halationState}
        registers={registers}
        blockRenderFn={blockRenderFn}
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