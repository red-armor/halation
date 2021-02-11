import React, { useEffect, useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider, useDispatch, observe } from '@xhs/relinx'
import HalationLite from 'halation-lite'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  type: 'block',
}, {
  name: 'plugin-b',
  type: 'block',
}, {
  name: 'plugin-a',
  type: 'block',
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