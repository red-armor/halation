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
      resolver: event => {
        const { contentLoaded } = event
        if (contentLoaded) return true
      }
    }]
  };
}
