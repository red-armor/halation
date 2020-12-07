import React, { useCallback, useRef } from 'react'
import { observe, useDispatch } from '@xhs/relinx'

export default observe((props) => {
  const { dispatchEvent } = props
  const [dispatch] = useDispatch()
  const count = useRef(0)
  const handleClickShowB = useCallback(() => {
    dispatchEvent('pluginBVisible')
  }, [])
  const handleClickShowC = useCallback(() => {
    dispatchEvent('pluginCVisible')
  }, [])

  const dispatchAction = useCallback(() => {
    dispatch({
      type: 'modal/setProps',
      payload: {
        count: count.current
      }
    })
    count.current += 1
  }, [])

  return (
    <>
      <button onClick={handleClickShowB}>
        点击显示组件B
      </button>
      <button onClick={handleClickShowC}>
        点击显示组件C
      </button>
      <button onClick={dispatchAction}>
        dispatch action
      </button>
    </>
  )
})