export default function PluginComponent() {
  return {
    name: 'plugin-d',
    getComponent: () => require('./index'),
  };
}
