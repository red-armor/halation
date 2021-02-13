import React, { useCallback } from 'react'
import { observe } from '@xhs/relinx'
import { HalationComponentProps } from 'halation'

export default observe((props: HalationComponentProps) => {
  const { dispatchEvent } = props
  const handleClick = useCallback(() => {
    dispatchEvent('visible')
  }, [])

  return (
    <button onClick={handleClick}>
      点击显示新组件
    </button>
  )
})