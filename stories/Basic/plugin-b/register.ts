export default function PluginComponent() {
  return {
    name: 'plugin-b',
    getModel: () => require('./model').default,
    getComponent: () => require('./index').default,
  };
}
