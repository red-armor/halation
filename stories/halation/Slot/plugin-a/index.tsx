import React, { FC } from 'react'

const PluginA: FC<any> = (props) => {
  const { children, forwardRef, slot } = props

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
      {!!slot.header && slot.header}
      {!!slot.footer && slot.footer}
    </>
  )
};

export default PluginA;