export default function PluginComponent() {
  return {
    name: 'plugin-c',
    getComponent: () => require('./index'),
  };
}
