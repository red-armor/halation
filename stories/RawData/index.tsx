import React, { useEffect, useState } from 'react';
import { applyMiddleware, createStore, thunk, Provider, useDispatch, observe } from '@xhs/relinx'
import { Halation, OrderedMap } from '../../src'

import PluginARegister from './plugin-a/register'
import PluginBRegister from './plugin-b/register'

const halationStateRaw = JSON.stringify([{
  name: 'plugin-a',
  key: 'plugin-a-1',
  prevSibling: null,
  nextSibling: 'plugin-b-2',
  children: [],
  type: 'block',
  strategies: [{
    type: 'runtime',
    resolver: (function test(props) {
      const { shouldDisplay } = props
      return !shouldDisplay
    }).toString()
  }, {
    type: 'event',
    resolver: (function second({
      event,
      dispatchEvent
    }) {
      const { contentLoaded, flags: { ab }} = event
      setTimeout(() => dispatchEvent('imageLoaded'), 1500)
      if (contentLoaded) return true
      return true
    }).toString()
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
    resolver: (function first(props) {
      const { count } = props
      return count === 2
    }).toString()
  }, {
    type: 'event',
    resolver: (function second({ event }) {
      const { imageLoaded } = event
      if (imageLoaded) return true
      return false
    }).toString()
  }]
}, {
  name: 'plugin-a',
  key: 'plugin-a-3',
  prevSibling: 'plugin-b-2',
  nextSibling: null,
  children: ['plugin-b-4', 'plugin-b-5'],
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
}])

const halationStateJSON = JSON.parse(halationStateRaw)
const halationState = halationStateJSON.map(state => {
  const { strategies = [], ...restProps } = state
  const functionalStrategies = strategies.map(strategy => {
    const { type, resolver } = strategy

    // https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
    return {
      type,
      // resolver: (new Function('return function(){ return ' + resolver + '}'))()()
      resolver: (new Function('return ' + resolver))()
    }
  })
  return {
    ...restProps,
    strategies: functionalStrategies
  }
})

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