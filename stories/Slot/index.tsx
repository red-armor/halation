import React, { useEffect } from 'react';
import { applyMiddleware, createStore, thunk, Provider, useDispatch, observe } from '@xhs/relinx'
import { Halation } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
  prevSibling: null,
  nextSibling: 'plugin-b-2',
  children: [],
  type: 'block',
  strategies: [{
    type: 'runtime',
    resolver: (props) => {
      const { shouldDisplay } = props
      return !shouldDisplay
    }
  }, {
    type: 'event',
    resolver: ({
      event,
      dispatchEvent
    }) => {
      const { contentLoaded, flags: { ab }} = event
      setTimeout(() => dispatchEvent('imageLoaded'), 1500)
      if (contentLoaded) return true
      return true
    }
  }]
}, {
  name: 'plugin-b',
  key: 'plugin-b-2',
  prevSibling: 'plugin-a-1',
  nextSibling: 'plugin-a-3',
  children: [],
  type: 'block',
  strategies: [{
    type: 'runtime',
    resolver: (props) => {
      const { count } = props
      return count === 2
    }
  }, {
    type: 'event',
    resolver: ({ event }) => {
      const { imageLoaded } = event
      if (imageLoaded) return true
      return false
    }
  }]
}, {
  name: 'plugin-a',
  key: 'plugin-a-3',
  prevSibling: 'plugin-b-2',
  nextSibling: null,
  // children: ['plugin-b-4', 'plugin-b-5'],
  slot: {
    header: 'plugin-b-4',
    footer: 'plugin-b-5',
  },
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-4',
  prevSibling: null,
  nextSibling: 'plugin-b-5',
  children: [],
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-5',
  prevSibling: 'plugin-b-4',
  nextSibling: null,
  children: [],
  type: 'block',
}]

const blockRenderFn = blockProps => {
  const { type } = blockProps

  if (type === 'block') {
    return props => {
      const { children, ...rest } = props
      return (
        <div className="block-render-fn">
          {React.cloneElement(children, {...rest, location: 'shanghai'})}
        </div>
      )
    }
  }
}

const store = createStore({
  models: {},
}, applyMiddleware(thunk))

const Helper = () => {
  const [dispatch] = useDispatch()

  useEffect(() => {
    dispatch([{
      type: 'plugin-b-2/setProps',
      payload: {
        count: 2,
      }
    }, {
      type: 'plugin-b-4/setProps',
      payload: {
        count: 2,
      }
    }])
  }, [])

  return null
}

const ObservedHelper = observe(Helper)

export default () => {
  const registers = [
    PluginARegister,
    PluginBRegister,
  ]

  return (
    <Provider
      store={store}
    >
      <ObservedHelper />
      <Halation
        name='super'
        halationState={halationState}
        registers={registers}
        blockRenderFn={blockRenderFn}
        store={store}

        events={[
          'flags',
          // // 'first_image_loaded'
          // 'imageLoaded',
        ]}
      />
    </Provider>
  )
}