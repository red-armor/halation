import React　from 'react';
import { HalationLiteState, HalationLite } from 'halation-lite'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState: Array<HalationLiteState> = [{
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
      halationState={halationState}
      registers={registers}
    />
  )
}