import React, { FC, useEffect, useState } from 'react'

const PluginA: FC<any> = (props) => {
  const { forwardRef, getRef, watch } = props
  const [height, setHeight] = useState(0)

  useEffect(() => {
    return watch(() => {
      const ref = getRef('plugin-b-2')
      if (ref) {
        setHeight(ref.current.clientHeight)
      }
    })
  }, [])

  const text = 'plugin a' + (height ? ` with b's height ${height}` : '')

  return <div ref={forwardRef}>{text}</div>
};

export default PluginA;