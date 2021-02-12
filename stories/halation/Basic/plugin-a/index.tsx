import React, { FC } from 'react'
import { HalationComponentProps } from '../../../../packages/halation/src'

const PluginA: FC<HalationComponentProps> = (props) => {
  const { children, forwardRef } = props

  const hasChildren = !!children.length
  const count = children.length
  const text = hasChildren ? `(with ${count} ${count > 1 ? 'children' : 'child'})` : ''

  return (
    <>
      <div ref={forwardRef}>{`plugin a ${hasChildren ? text : ''}`}</div>
      {hasChildren && (
        <div style={{ marginLeft: '25px' }}>
          {props.children}
        </div>
      )}
    </>
  )
};

export default PluginA;