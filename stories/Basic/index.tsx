import React from 'react';
import { Halation } from '../../src'

import PluginARegister from './plugin-a/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  prevSibling: null,
  nextSibling: null,
  children: [],
  type: 'block',
}]

export default () => {
  const registers = [
    PluginARegister,
  ]

  return (
    <Halation
      halationState={halationState}
      registers={registers}
    />
  )
}