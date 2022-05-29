import Component from './index'
import model from './model';

export default function PluginComponent() {
  return {
    name: 'plugin-b',
    getModel: model,
    getComponent: Component,
    lazy: false,
  };
}
