import React, { useCallback } from 'react'
import { useDispatch } from '@xhs/relinx'

export default () => {
  const [dispatch] = useDispatch()
  const handleClick = useCallback(() => {
    dispatch({
      type: 'plugin-modal-1/show',
    })
  }, [])

  return (
    <button onClick={handleClick}>
      点击出弹窗
    </button>
  )
}