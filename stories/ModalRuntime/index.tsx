import React, { useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation, OrderedMap } from '../../src'

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
    PluginModalRegister,
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
          flags: {},
        }}
      />
    </Provider>
  )
}