import React, { useCallback } from 'react'
import { observe } from '@xhs/relinx'

export default observe(() => {
  const handleClick = useCallback(() => {
    alert('finish')
  }, [])

  return (
    <button onClick={handleClick}>
      finish
    </button>
  )
})