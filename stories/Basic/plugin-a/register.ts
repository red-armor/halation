export default function PluginComponent() {
  return {
    name: 'plugin-a',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),

    // loader: {
    //   strategy: [{
    //     type: 'ban',
    //     resolver: () => {}
    //   },{
    //     type: 'flags',
    //     resolver: () => {}
    //   }, {
    //     type: 'event',
    //     resolver: () => {}
    //   }, {
    //     type: 'runtime',
    //     resolver: () => {}
    //   }],
    //   module: {
    //     getComponent: () => require('./index'),
    //     getModel: () => require('./model')
    //   },
    // },

    // event: [
    //   'main-image',
    //   'content-loaded',

    // ],

    // // state is observable, 'first' is a reactive variable
    // resolveRender: (state) => {
    //   if (!state['first']) return false
    //   return true
    // },

    // loadStrategy: {
    //   // flags...
    //   // runtime value...
    //   // renderState
    // },

    // // if return true, continue to get


    // subscribe() {

    // },
  };
}

// 1. register.name should not duplicate
// 2. model support name property to override outside name

// 约束总共有多少类型的唤起事件

// Hydrate renderEvents to component...
// How to make it clear, what current phrase is.

