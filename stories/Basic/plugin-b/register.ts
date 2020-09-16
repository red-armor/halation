export default function PluginComponent() {
  return {
    name: 'plugin-b',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),
  };
}
