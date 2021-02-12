import React, { useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider } from '@xhs/relinx'
import { Halation, OrderedMap } from 'halation'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  parent: null,
  type: 'block',
  strategies: [{
    type: 'event',
    resolver: ({ event, dispatchEvent }) => {
      const { abValues } = event
      if (abValues.showPluginA === 0) {
        console.log('plugin-a  dispatchEvent-displayPluginB')
        dispatchEvent('displayPluginB')
      }
      return abValues.showPluginA === 1
    }
  }]
}, {
  name: 'plugin-b',
  key: 'plugin-b-1',
  type: 'block',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { displayPluginB } = event
      console.log('plugin-b  displayPluginB', displayPluginB)
      return !!displayPluginB
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
          abValues: {
            showPluginA: 0,
          },
          displayPluginB: false,
        }}
      />
    </Provider>
  )
}