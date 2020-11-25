export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getComponent: () => require('./index'),
  };
}
