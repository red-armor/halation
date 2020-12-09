export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),
  };
}
