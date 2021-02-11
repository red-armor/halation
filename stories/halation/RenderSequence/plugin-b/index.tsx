import React, { useCallback } from 'react'
import { observe } from '@xhs/relinx'

export default observe((props) => {
  const { dispatchEvent } = props
  const handleClick = useCallback(() => {
    dispatchEvent('pluginCVisible')
  }, [])

  return (
    <button onClick={handleClick}>
      trigger plugin-c render
    </button>
  )
})