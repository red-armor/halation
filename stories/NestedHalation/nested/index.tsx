import React, { useState } from 'react';
import { Halation, OrderedMap } from '../../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  parent: null,
  type: 'block',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { imageLoaded } = event
      if (imageLoaded) return true
      return false
    }
  }]
}, {
  name: 'plugin-b',
  key: 'plugin-b-1',
  type: 'block',
  strategies: [{
    type: 'event',
    resolver: ({ event }) => {
      const { visible } = event
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

export default () => {
  const [state] = useState(new OrderedMap(halationState))

  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <Halation
      name='super'
      halationState={state}
      registers={registers}
      blockRenderFn={blockRenderFn}
    />
  )
}