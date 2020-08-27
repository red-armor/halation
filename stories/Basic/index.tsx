import React from 'react';
import { Halation } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  prevSibling: null,
  nextSibling: 'plugin-b-2',
  children: [],
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-2',
  prevSibling: 'plugin-a-1',
  nextSibling: 'plugin-a-3',
  children: [],
  type: 'block',
}, {
  name: 'plugin-a',
  key: 'plugin-a-3',
  prevSibling: 'plugin-b-2',
  nextSibling: null,
  children: ['plugin-b-4', 'plugin-b-5'],
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-4',
  prevSibling: null,
  nextSibling: 'plugin-b-5',
  children: [],
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-5',
  prevSibling: 'plugin-b-4',
  nextSibling: null,
  children: [],
  type: 'block',
}]

export default () => {
  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <Halation
      halationState={halationState}
      registers={registers}
    />
  )
}