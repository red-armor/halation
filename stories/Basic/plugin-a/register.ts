export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),

    strategies: [{
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