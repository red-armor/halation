export default function PluginComponent() {
  return {
    name: 'nested-halation',
    getComponent: () => require('./index'),
  };
}
