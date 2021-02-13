import React, { FC } from 'react'
import { HalationLiteComponentProps } from 'halation-lite'

const PluginA: FC<HalationLiteComponentProps> = (PluginAProps) => {
  const { children, forwardRef, props } = PluginAProps
  const style = props.style

  const hasChildren = !!children.length
  const count = children.length
  const text = hasChildren ? `(with ${count} ${count > 1 ? 'children' : 'child'})` : ''

  return (
    <>
      <div ref={forwardRef} style={style}>{`plugin a ${hasChildren ? text : ''}`}</div>
      {hasChildren && (
        <div style={{ marginLeft: '25px' }}>
          {children}
        </div>
      )}
    </>
  )
};
export default PluginA;