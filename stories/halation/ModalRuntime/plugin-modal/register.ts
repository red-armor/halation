export default function PluginComponent() {
  return {
    name: 'plugin-modal',
    getComponent: () => require('./index'),
    getModel: () => require('./model')
  };
}
