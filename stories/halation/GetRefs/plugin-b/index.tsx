import React from 'react'
import { HalationComponentProps } from 'halation'

const PluginB = (props: HalationComponentProps) => {
  const { forwardRef } = props

  return <div ref={forwardRef}>plugin b</div>
}

export default PluginB