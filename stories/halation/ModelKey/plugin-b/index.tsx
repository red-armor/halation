import React from 'react'
import { useRelinx, observe } from '@xhs/relinx'

export default observe(() => {
  const [state] = useRelinx()
  const count = state.count
  return (
    <div className="modal">{`hello plugin-b ${count}`}</div>
  )
})