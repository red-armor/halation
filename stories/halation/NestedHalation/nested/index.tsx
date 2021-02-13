import React, { useState } from 'react';
import { Halation, OrderedMap, OrderedMapProps } from 'halation'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState: Array<OrderedMapProps> = [{
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
    />
  )
}