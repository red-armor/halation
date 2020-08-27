export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getModel: () => require('./model').default,
    getComponent: () => require('./index').default,
  };
}
