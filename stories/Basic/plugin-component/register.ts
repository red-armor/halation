export default function PluginComponent() {
  return {
    name: 'plugin-component',
    getModel: () => require('./module').default,
    getComponent: () => require('./index').default,
  };
}
