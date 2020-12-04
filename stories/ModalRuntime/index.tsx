import React from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginModalRegister from './plugin-modal/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  type: 'block',
}, {
  name: 'plugin-modal',
  key: 'plugin-modal-1',
  type: 'block',
  strategies: [{
    type: 'runtime',
    resolver: (props) => {
      const { visible } = props
      return !!visible
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
    PluginModalRegister,
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
          flags: {},
        }}
      />
    </Provider>
  )
}