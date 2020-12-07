export default function PluginComponent() {
  return {
    name: 'plugin-b',
    getComponent: () => require('./index'),
    getModel: () => require('./model'),
  };
}
