export default function PluginComponent() {
  return {
    name: 'plugin-component',
    getModel: () => require('./model').default,
    getComponent: () => require('./index').default,
  };
}
