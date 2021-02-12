import React, { useEffect, useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider, useDispatch, observe } from '@xhs/relinx'
import { Halation, OrderedMap } from 'halation'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'
import NestedRegister from './nested/register'

const halationState = [{
  name: 'plugin-a',
  key: 'plugin-a-1',
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
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-4',
  parent: 'plugin-a-3',
  type: 'block',
}, {
  name: 'plugin-b',
  key: 'plugin-b-5',
  parent: 'plugin-a-3',
  type: 'block',
}, {
  name: 'nested-halation',
  key: 'nested-halation',
  type: 'block',
}]

const renderBlock = props => {
  const {
    blockProps: { type },
    children,
    ...rest
  } = props

  if (type === 'block') {
    return (
      <div className="block-render-fn">
        {React.cloneElement(children, {...rest, location: 'shanghai'})}
      </div>
    )
  }

  return null
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
  const [state] = useState(new OrderedMap(halationState))

  const registers = [
    PluginARegister,
    PluginBRegister,
    NestedRegister,
  ]

  return (
    <Provider
      store={store}
    >
      <ObservedHelper />
      <Halation
        name='super'
        halationState={state}
        registers={registers}
        renderBlock={renderBlock}
        store={store}

        events={{
          flags: {},
        }}
      />
    </Provider>
  )
}