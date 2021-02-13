import React, { useCallback } from 'react'
import { observe } from '@xhs/relinx'
import { HalationComponentProps } from 'halation'

export default observe((props: HalationComponentProps) => {
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