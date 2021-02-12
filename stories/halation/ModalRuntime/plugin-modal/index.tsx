import React, { useCallback, useEffect, useRef, FC } from 'react'
import ReactDOM from 'react-dom'
import { useRelinx, observe } from '@xhs/relinx'
import { HalationComponentProps } from 'halation'
import './style.css'

const root = document.body

const Modal: FC<any> = props => {
  const elRef = useRef(document.createElement('div'))

  useEffect(() => {
    root.appendChild(elRef.current)
  }, [])

  return (
    ReactDOM.createPortal(props.children, elRef.current)
  )
}

export default observe((props: HalationComponentProps) => {
  const [state, dispatch] = useRelinx()
  const { block } = props
  const modelKey = block.getKey()

  const { visible } = state

  const dismiss = useCallback(() => {
    if (visible) dispatch({
      type: `${modelKey}/setProps`,
      payload: { visible: false },
    })
  }, [visible])

  if (!visible) return null

  return (
    <Modal>
      <div className="container" onClick={dismiss}>
        <div className="modal">hello</div>
      </div>
    </Modal>
  )
})