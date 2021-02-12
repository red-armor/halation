import React　from 'react';
import HalationLite from '../../../packages/halation-lite/src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
}, {
  name: 'plugin-b',
}, {
  name: 'plugin-a',
}]


export default () => {

  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <HalationLite
      name='super'
      enableLog
      halationState={halationState}
      registers={registers}
    />
  )
}