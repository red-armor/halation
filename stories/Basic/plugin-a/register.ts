export default function PluginComponent() {
  return {
    name: 'plugin-a',
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
      resolver: ({
        event,
        dispatchEvent
      }) => {
        const { contentLoaded, flags: { ab }} = event
        if (contentLoaded) return true
        // dispatchEvent('imageLoaded')
        return true
      }
    }]
  };
}
