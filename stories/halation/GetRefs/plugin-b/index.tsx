import React from 'react'

const PluginB = props => {
  const { forwardRef } = props

  return <div ref={forwardRef}>plugin b</div>
}

export default PluginB