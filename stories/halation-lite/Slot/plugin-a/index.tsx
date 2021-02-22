import React, { FC } from 'react'
import { HalationLiteComponentProps } from 'halation-lite'

const PluginA: FC<HalationLiteComponentProps> = (props) => {
  const { children, forwardRef, footer = [], header = [] } = props

  const hasChildren = !!children.length
  const count = children.length
  let text = hasChildren ? `(with ${count} ${count > 1 ? 'children' : 'child'}` : ''
  if (header.length) text += ` ; ${header.length} header `
  if (footer.length) text += ` ; ${footer.length} footer `
  text += ')'

  return (
    <>
      <div ref={forwardRef}>{`plugin a ${hasChildren ? text : ''}`}</div>
      {!!header.length && (
        <div style={{ marginLeft: '25px', backgroundColor: 'red' }}>
          {header}
        </div>
      )}
      {hasChildren && (
        <div style={{ marginLeft: '25px', backgroundColor: 'green' }}>
          {props.children}
        </div>
      )}
      {!!footer.length && (
        <div style={{ marginLeft: '25px', backgroundColor: 'blue' }}>
          {footer}
          </div>
      )}
    </>
  )
};

export default PluginA;