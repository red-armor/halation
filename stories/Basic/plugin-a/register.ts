export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),

    loadStrategy: [{
      type: 'flags',
      resolver: flags => {
        const { a } = flags
        if (a === 1) return true
      },
    }, {
      type: 'event',
      resolver: event => {
        const { imageLoaded } = event
        if (imageLoaded) return true
      }
    }, {
      type: 'runtime',
      resolver: (props) => {
        const { shouldDisplay } = props
        return !shouldDisplay
      }
    }]
  };
}

// 1. register.name should not duplicate
// 2. model support name property to override outside name

// 约束总共有多少类型的唤起事件

// Hydrate renderEvents to component...
// How to make it clear, what current phrase is.

