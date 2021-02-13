import React, { FC } from 'react';
import { HalationLiteState, HalationLite, HalationLiteRenderBlockProps } from 'halation-lite'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState: Array<HalationLiteState> = [{
  name: 'plugin-a',
  extraProps: {
    style: {
      backgroundColor: '#eee',
    }
  }
}, {
  name: 'plugin-b',
}, {
  name: 'plugin-a',
}]

const renderBlock: FC<HalationLiteRenderBlockProps> = (props) => {
  const { extraProps, children } = props

  return React.cloneElement(children, { style: extraProps.style })
}

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
      renderBlock={renderBlock}
    />
  )
}