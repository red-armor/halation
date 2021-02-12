import React, { useEffect } from 'react'

export default () => {
  useEffect(() => {
    console.log('plugin-b mount')
    return () => console.log('plugin-b unmount')
  }, [])
  return (
    <div className="modal">hello</div>
  )
}