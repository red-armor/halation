export default function PluginComponent() {
  return {
    name: 'plugin-b',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),

    strategies: [{
      type: 'runtime',
      resolver: (props) => {
        const { shouldDisplay } = props
        return !shouldDisplay
      }
    }, {
      type: 'event',
      resolver: ({ event }) => {
        const { imageLoaded } = event
        console.log('event ', event)
        if (imageLoaded) return true
        // return true
      }
    }]
  };
}
