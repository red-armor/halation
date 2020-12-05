import React, { useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider, } from '@xhs/relinx'
import { Halation, OrderedMap } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-2',
  type: 'block',
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
  const [state] = useState(new OrderedMap(halationState))

  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <Provider
      store={store}
    >
      <Halation
        name='super'
        halationState={state}
        registers={registers}
        blockRenderFn={blockRenderFn}
        store={store}

        events={{
          flags: {},
        }}
      />
    </Provider>
  )
}