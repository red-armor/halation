import React from 'react';
import { Halation } from '../../src'

import PluginARegister from './plugin-a/register'

export default () => {
  const registers = [
    PluginARegister,
  ]

  return (
    <Halation
      registers={registers}
    />
  )
}