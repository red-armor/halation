'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var tapable = require('tapable');
var invariant = _interopDefault(require('invariant'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var Node = /*#__PURE__*/function () {
  function Node(props) {
    var key = props.key,
        type = props.type,
        prevSibling = props.prevSibling,
        nextSibling = props.nextSibling,
        children = props.children,
        name = props.name,
        strategies = props.strategies;
    this.key = key;
    this.name = name;
    this.prevSibling = prevSibling;
    this.nextSibling = nextSibling;
    this.type = type || 'block';
    this.children = children;
    this.strategies = strategies;
  }

  var _proto = Node.prototype;

  _proto.getChildKeys = function getChildKeys() {
    return this.children;
  };

  _proto.getNextSibling = function getNextSibling() {
    return this.nextSibling;
  };

  _proto.getPrevSibling = function getPrevSibling() {
    return this.prevSibling;
  };

  _proto.getName = function getName() {
    return this.name;
  };

  _proto.getKey = function getKey() {
    return this.key;
  };

  _proto.getType = function getType() {
    return this.type;
  };

  _proto.getStrategies = function getStrategies() {
    return this.strategies;
  };

  _proto.getRenderProps = function getRenderProps() {
    return {
      key: this.key,
      name: this.name,
      type: this.type
    };
  };

  return Node;
}();

(function (ModuleName) {
  ModuleName["Model"] = "model";
  ModuleName["Component"] = "component";
})(exports.ModuleName || (exports.ModuleName = {}));

(function (ModuleStatus) {
  ModuleStatus[ModuleStatus["Idle"] = 0] = "Idle";
  ModuleStatus[ModuleStatus["Pending"] = 1] = "Pending";
  ModuleStatus[ModuleStatus["Loaded"] = 2] = "Loaded";
  ModuleStatus[ModuleStatus["Error"] = 3] = "Error";
})(exports.ModuleStatus || (exports.ModuleStatus = {}));

(function (StrategyType) {
  StrategyType["flags"] = "flags";
  StrategyType["event"] = "event";
  StrategyType["runtime"] = "runtime";
})(exports.StrategyType || (exports.StrategyType = {}));

var error = function error(props) {
  var message = props.message,
      type = props.type;
  console.error(message, type);
};
var logActivity = function logActivity(moduleName, _ref) {
  var message = _ref.message,
      value = _ref.value;
  var title = "[" + moduleName + "]";
  var titleStyle = 'color: #7cb305; font-weight: bold';
  var messageStyle = 'color: #ff4d4f; font-weight: bold';

  if (process && "development" !== 'production') {
    console.log.apply(null, ['%c' + title + ' %c' + message, titleStyle, messageStyle, value ? value : '', Date.now()]);
  }
};

var Module = /*#__PURE__*/function () {
  function Module(props) {
    var name = props.name,
        getModel = props.getModel,
        getComponent = props.getComponent,
        strategies = props.strategies;
    this._name = name;
    this._getModel = getModel;
    this._getComponent = getComponent;
    this.statusMap = new Map([[exports.ModuleName.Model, exports.ModuleStatus.Idle], [exports.ModuleName.Component, exports.ModuleStatus.Idle]]);
    this.resolversMap = new Map([[exports.ModuleName.Model, []], [exports.ModuleName.Component, []]]);
    this.resolvedModulesMap = new Map([[exports.ModuleName.Model, null], [exports.ModuleName.Component, null]]);
    this._strategies = strategies || [];
    logActivity('Module', {
      message: "create " + name + " Module"
    });
  }

  var _proto = Module.prototype;

  _proto.getName = function getName() {
    return this._name;
  };

  _proto.getComponent = function getComponent() {
    return this._getComponent;
  };

  _proto.getStrategies = function getStrategies() {
    return this._strategies;
  };

  _proto.getModel = function getModel() {
    return this._getModel;
  };

  _proto.resolveModule = function resolveModule(module) {
    return module && module.__esModule ? module["default"] : module;
  };

  _proto.load = function load(moduleName, getter) {
    var _this = this;

    var currentStatus = this.statusMap.get(moduleName); // If module has been loaded already, then return directly.

    if (currentStatus === exports.ModuleStatus.Loaded) {
      logActivity('Module', {
        message: "load module " + this._name + " " + moduleName + " from cache"
      });
      return this.resolvedModulesMap.get(moduleName);
    }

    return new Promise(function (resolve) {
      var _this$resolversMap$ge, _this$resolversMap$ge2;

      switch (currentStatus) {
        case exports.ModuleStatus.Idle:
          (_this$resolversMap$ge = _this.resolversMap.get(moduleName)) === null || _this$resolversMap$ge === void 0 ? void 0 : _this$resolversMap$ge.push(resolve);
          logActivity('Module', {
            message: "start load module " + _this._name + " " + moduleName
          });

          _this.statusMap.set(moduleName, exports.ModuleStatus.Pending);

          break;

        case exports.ModuleStatus.Pending:
          (_this$resolversMap$ge2 = _this.resolversMap.get(moduleName)) === null || _this$resolversMap$ge2 === void 0 ? void 0 : _this$resolversMap$ge2.push(resolve);
          return;
      }

      var fn = getter.call(_this);

      if (fn) {
        // __webpack_require__ will not return a Promise, so it need to wrapped
        // with Promise.resolve.
        Promise.resolve(fn.call(_this)).then(function (rawModule) {
          var module = _this.resolveModule(rawModule);

          var resolvers = _this.resolversMap.get(moduleName) || [];
          resolvers.forEach(function (resolver) {
            return resolver(module);
          });

          _this.resolvedModulesMap.set(moduleName, module);

          logActivity('Module', {
            message: "finish load module " + _this._name + " " + moduleName
          });

          _this.resolversMap.set(moduleName, []);

          _this.statusMap.set(moduleName, exports.ModuleStatus.Loaded);
        }, function () {
          error({
            type: 'module',
            message: "'load' " + moduleName + " fails"
          });
        });
      }
    });
  };

  _proto.loadModel = function loadModel() {
    return this.load(exports.ModuleName.Model, this.getModel);
  };

  _proto.loadComponent = function loadComponent() {
    return this.load(exports.ModuleName.Component, this.getComponent);
  };

  return Module;
}();

var toString = /*#__PURE__*/Function.call.bind(Object.prototype.toString);
var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};
var isString = function isString(o) {
  return toString(o) === '[object String]';
};
var isPlainObject = function isPlainObject(o) {
  return toString(o) === '[object Object]';
};
var isPromise = function isPromise(o) {
  return typeof o === 'object' && typeof o.then === 'function';
};
var reflect = function reflect(p) {
  return p.then(function (value) {
    return {
      value: value,
      success: true
    };
  }, function (value) {
    return {
      value: value,
      success: false
    };
  });
};
var settledPromise = function settledPromise(ps) {
  return Promise.all(ps.map(function (p) {
    return reflect(p);
  }));
};
var createHiddenProperty = function createHiddenProperty(target, prop, value) {
  Object.defineProperty(target, prop, {
    value: value,
    enumerable: false,
    writable: true
  });
};
var hasSymbol = typeof Symbol !== 'undefined';
var TRACKER = hasSymbol ? /*#__PURE__*/Symbol('tracker') : '__tracker__';
var isTrackable = function isTrackable(o) {
  return ['[object Object]', '[object Array]'].indexOf(toString(o)) !== -1;
};

var BlockWrapper = function BlockWrapper(props) {
  var hooks = props.hooks,
      block = props.block,
      moduleMap = props.moduleMap,
      loadManagerMap = props.loadManagerMap,
      blockRenderFn = props.blockRenderFn;

  var _useState = React.useState({}),
      wrapper = _useState[0],
      setWrapper = _useState[1];

  var blockKey = block.getKey();
  var moduleName = block.getName();
  var blockRef = React.useRef();
  var isLoadingRef = React.useRef(false);
  var isMountedRef = React.useRef(false);
  var loadManager = loadManagerMap.get(blockKey);
  var unsubscribeLoadRoutine = React.useRef(null);
  var loadRoutine = React.useCallback(function () {
    var shouldLoadModule = loadManager === null || loadManager === void 0 ? void 0 : loadManager.shouldModuleLoad();

    if (isPromise(shouldLoadModule)) {
      shouldLoadModule.then(function (falsy) {
        if (falsy) loadAndForceUpdate();
      });
    } else if (shouldLoadModule) {
      loadAndForceUpdate();
    }
  }, []); // eslint-disable-line

  var forceUpdate = React.useCallback(function (result) {
    var modelResult = result[0],
        componentResult = result[1];
    var state = {};

    if (modelResult.success) {
      state.model = modelResult.value;
    }

    if (componentResult.success) {
      state.Component = componentResult.value;
    }

    setWrapper(state);
  }, []); // eslint-disable-line

  var loadAndForceUpdate = React.useCallback(function () {
    var _unsubscribeLoadRouti;

    logActivity('BlockNode', {
      message: "Trigger 'loadAndForceUpdate'"
    });
    if (unsubscribeLoadRoutine.current) (_unsubscribeLoadRouti = unsubscribeLoadRoutine.current) === null || _unsubscribeLoadRouti === void 0 ? void 0 : _unsubscribeLoadRouti.call(null);
    if (isLoadingRef.current) return;
    var module = moduleMap.get(moduleName);

    if (module) {
      hooks.register.call(blockKey, block);
      var model = module.loadModel();
      var component = module.loadComponent();

      if (isPromise(model) || isPromise(component)) {
        var loadModelTask = Promise.resolve(module.loadModel());
        var loadComponentTask = Promise.resolve(module.loadComponent());
        settledPromise([loadModelTask, loadComponentTask]).then(function (result) {
          forceUpdate(result);
        });
      } else {
        logActivity('BlockNode', {
          message: "load component & model directly.."
        });
        forceUpdate([{
          success: true,
          value: model
        }, {
          success: true,
          value: component
        }]);
      } // TODO: temp to wrapper with Promise

    }
  }, []); // eslint-disable-line
  // 在最开始的时候，判断一下是否进行module的加载；

  if (!isMountedRef.current) {
    // In a condition, when invoke loadRoutine, model and module have already loaded.
    // it will trigger forceUpdate directly. Because there is no limit on trigger forceUpdate.
    // if `isMountedRef` is putted in `useEffect`, it will never be called and lost into
    // render loop!!!
    isMountedRef.current = true;
    unsubscribeLoadRoutine.current = loadManager.bindLoadRoutine(loadRoutine);
    loadRoutine();
  }

  var Helper = function Helper() {
    return null;
  };

  if (!wrapper.Component) return null;
  var blockRenderer = null;

  if (typeof blockRenderFn === 'function') {
    blockRenderer = blockRenderFn(block.getRenderProps());
  }

  var RefForwardingWrapper = React.forwardRef(function (props, ref) {
    return React.createElement(wrapper.Component, _extends({}, props, {
      $_modelKey: loadManager.getKey(),
      forwardRef: ref
    }));
  });

  if (blockRenderer) {
    return React__default.createElement(React.Fragment, null, React.createElement(blockRenderer, props, React__default.createElement(RefForwardingWrapper, Object.assign({}, props, {
      ref: blockRef
    }))), React__default.createElement(Helper, null));
  }

  return React__default.createElement(React.Fragment, null, React__default.createElement(RefForwardingWrapper, Object.assign({}, props, {
    ref: blockRef
  })), React__default.createElement(Helper, null));
};

var BlockNode = function BlockNode(props) {
  var block = props.block,
      nodeMap = props.nodeMap,
      blockRenderFn = props.blockRenderFn,
      addBlockLoadManager = props.addBlockLoadManager,
      rest = _objectWithoutPropertiesLoose(props, ["block", "nodeMap", "blockRenderFn", "addBlockLoadManager"]);

  var children = [];
  var childKeys = block.getChildKeys();
  var blockKey = block.getKey();
  var moduleName = block.getName();
  var moduleMap = props.moduleMap;
  var module = moduleMap.get(moduleName);
  !module ?  invariant(false, "module " + moduleName + " is required to register first. Please check whether " + ("module " + moduleName + " is defined in 'registers' props"))  : void 0; // block strategy comes first, then from module...

  var strategies = block.getStrategies() || module.getStrategies() || [];
  addBlockLoadManager({
    blockKey: blockKey,
    moduleName: moduleName,
    strategies: strategies
  });
  logActivity('BlockNode', {
    message: 'render block node',
    value: block
  });
  childKeys.forEach(function (childKey) {
    var node = nodeMap.get(childKey);

    if (node) {
      children.push(React.createElement(BlockNode, _extends({
        key: childKey,
        block: node,
        nodeMap: nodeMap,
        blockRenderFn: blockRenderFn,
        addBlockLoadManager: addBlockLoadManager
      }, rest), null));
    }
  });
  return React.createElement(BlockWrapper, props, children);
};

/**
 * loadManager需要在进行渲染之前就要处理一直，这样在`BlockNode`渲染的时候，可以直接对那些不需要判断的
 * 组件直接进行加载；
 */

var LoadManager = /*#__PURE__*/function () {
  function LoadManager(props) {
    var store = props.store,
        blockKey = props.blockKey,
        moduleName = props.moduleName,
        strategies = props.strategies,
        moduleMap = props.moduleMap,
        proxyEvent = props.proxyEvent,
        dispatchEvent = props.dispatchEvent,
        lockCurrentLoadManager = props.lockCurrentLoadManager,
        releaseCurrentLoadManager = props.releaseCurrentLoadManager;
    this._key = blockKey;
    this._store = store;
    this.strategies = this.sort(strategies);
    this._moduleName = moduleName;
    this._moduleMap = moduleMap;
    this._lockCurrentLoadManager = lockCurrentLoadManager;
    this._releaseCurrentLoadManager = releaseCurrentLoadManager;
    this._proxyEvent = proxyEvent;
    this._dispatchEvent = dispatchEvent;
    this.teardownEffects = [];
    this._runtimeVerifyEffect = null;
    this._loadRoutine = null;
  }

  var _proto = LoadManager.prototype;

  _proto.getKey = function getKey() {
    return this._key;
  };

  _proto.addTeardown = function addTeardown(fn) {
    this.teardownEffects.push(fn);
  };

  _proto.teardown = function teardown() {
    this.teardownEffects.forEach(function (fn) {
      return fn();
    });
  }
  /**
   *
   * @param strategies
   * 按照'flags', 'event', 'runtime'的顺序进行排序；因为只有在'flags'和'event'
   * 层级都加载完毕其实'runtime'层面才需要开始加载（这个时候其实单独触发的model的加载）；
   * 之所以，将flags单独放出来，因为假如说flags都没有过的话，其实runtime的model都
   * 不需要进行加载的；
   */
  ;

  _proto.sort = function sort(strategies) {
    var typeMap = {
      flags: 0,
      event: 1,
      runtime: 2
    };
    return strategies.sort(function (a, b) {
      return typeMap[a.type] - typeMap[b.type];
    });
  };

  _proto.update = function update() {
    this.teardown();
    if (this._loadRoutine) this._loadRoutine();
  };

  _proto.mountModel = function mountModel(resolver, modelInstance, initialValue) {
    if (initialValue === void 0) {
      initialValue = {};
    }

    var modelKey = this._key;

    this._store.injectModel(modelKey, modelInstance, initialValue);

    var base = this._store.getState(); // TODO: If injected model is pending with effects. base[modelKey]
    // may get old value...


    var currentModelState = base[modelKey];
    var falsy = resolver(currentModelState);

    if (!falsy) {
      this._store.subscribe(this.update.bind(this));
    }

    return !!falsy;
  };

  _proto.startVerifyRuntime = function startVerifyRuntime(resolver) {
    var _this$_moduleMap$get,
        _this = this;

    if (typeof this._runtimeVerifyEffect === 'function') {
      this._runtimeVerifyEffect();

      this._runtimeVerifyEffect = null;
    }

    logActivity('LoadManager', {
      message: 'start verify runtime strategy'
    });
    var modelCreator = (_this$_moduleMap$get = this._moduleMap.get(this._moduleName)) === null || _this$_moduleMap$get === void 0 ? void 0 : _this$_moduleMap$get.loadModel();
    var modelInstance = null;

    if (isPromise(modelCreator)) {
      return modelCreator.then(function (m) {
        var modelInstance = m.call(null);
        return _this.mountModel(resolver, modelInstance, {});
      })["catch"](function (err) {
        logActivity('LoadManager', {
          message: "Has error on verify runtime.." + err
        });
        return false;
      });
    } else if (isFunction(modelCreator)) {
      modelInstance = modelCreator.call(null);
      return this.mountModel(resolver, modelInstance, {});
    }

    return false;
  }
  /**
   * 整个strategy的处理需要是一个同步的
   */
  ;

  _proto.shouldModuleLoad = function shouldModuleLoad() {
    var len = this.strategies.length;

    this._lockCurrentLoadManager(this); // debugger


    for (var i = 0; i < len; i++) {
      var strategy = this.strategies[i];
      var type = strategy.type,
          resolver = strategy.resolver;
      var value = false;

      switch (type) {
        case exports.StrategyType.event:
          value = !!resolver({
            event: this._proxyEvent,
            dispatchEvent: this._dispatchEvent
          });
          break;
        // 如果说是runtime的话，首先需要先加载model；运行一次resolver将需要
        // 监听的属性进行绑定。

        case exports.StrategyType.runtime:
          return this.startVerifyRuntime(resolver);
      } // TODO: 临时注释掉


      if (!value) {
        // should release current load manager before return
        this._releaseCurrentLoadManager();

        return false;
      }
    }

    this._releaseCurrentLoadManager();

    return true;
  };

  _proto.bindLoadRoutine = function bindLoadRoutine(loadRoutine) {
    var _this2 = this;

    this._loadRoutine = loadRoutine;
    return function () {
      return _this2._loadRoutine = null;
    };
  };

  return LoadManager;
}();

var Tracker = function Tracker(_ref) {
  var base = _ref.base,
      _ref$path = _ref.path,
      path = _ref$path === void 0 ? [] : _ref$path,
      reportAccessPaths = _ref.reportAccessPaths;
  var tracker = base;

  if (isTrackable(base)) {
    // base should be destructed, or will be the same object.
    tracker = new Proxy(_extends({}, base), {
      get: function get(target, prop, receiver) {
        if (prop === TRACKER) return Reflect.get(target, prop, receiver); // Take note: Reflect.get will not trigger `get` handler

        var tracker = Reflect.get(target, TRACKER, receiver);
        var base = tracker.base; // if key is 'base', should not report and return directly.

        if (prop === 'base') return base;
        var value = base[prop];
        var childrenProxies = tracker['childrenProxies'];
        var nextPath = path.concat(prop);
        reportAccessPaths(nextPath);

        if (isTrackable(value)) {
          if (!childrenProxies[prop]) {
            childrenProxies[prop] = new Tracker({
              base: value,
              path: nextPath,
              reportAccessPaths: reportAccessPaths
            });
          } else if (childrenProxies[prop].base !== value) {
            childrenProxies[prop] = new Tracker({
              base: value,
              path: nextPath,
              reportAccessPaths: reportAccessPaths
            });
          }

          return childrenProxies[prop];
        } else if (childrenProxies[prop]) {
          delete childrenProxies[prop];
        }

        return value;
      },
      set: function set(target, prop, newValue, receiver) {
        return Reflect.set(target, prop, newValue, receiver);
      }
    });
    createHiddenProperty(tracker, TRACKER, {
      base: base,
      childrenProxies: {},
      effects: [],
      paths: []
    });
  }

  return tracker;
};

var joinPath = function joinPath(path) {
  return path.join('_');
};

var generateRemarkablePaths = function generateRemarkablePaths(paths) {
  var copy = paths.slice();
  var accessMap = {};
  var len = copy.length;
  var remarkablePaths = [];

  for (var i = len - 1; i >= 0; i--) {
    var path = copy[i].slice();
    var pathLength = path.length;
    var isConsecutive = false;

    for (var _i = 0; _i < pathLength; _i++) {
      var joinedPath = joinPath(path);
      var count = accessMap[joinedPath] || 0; // the intermediate accessed path will be ignored.
      // https://stackoverflow.com/questions/2937120/how-to-get-javascript-object-references-or-reference-count
      // because of this, intermediate value may be ignored...

      if (isConsecutive) {
        accessMap[joinedPath] = count + 1;
        path.pop();
        continue; // eslint-disable-line
      }

      if (!count) {
        (function () {
          var p = path.slice();
          var str = joinPath(p);
          var found = remarkablePaths.find(function (path) {
            return joinPath(path) === str;
          });
          if (!found) remarkablePaths.push(p);
          isConsecutive = true;
          path.pop();
        })();
      } else {
        accessMap[joinedPath] = count - 1;
        break;
      }
    }
  }

  return remarkablePaths;
};

var EffectNode = /*#__PURE__*/function () {
  function EffectNode(_ref) {
    var key = _ref.key;
    this.childMap = {};
    this.effectMap = {};
    this._key = key;
    this._slugKey = '';
  }

  var _proto = EffectNode.prototype;

  _proto.getKey = function getKey() {
    return this._key;
  };

  _proto.addChild = function addChild(path, loadManager) {
    var node = path.reduce(function (node, point) {
      if (!node.childMap[point]) node.childMap[point] = new EffectNode({
        key: point
      });
      return node.childMap[point];
    }, this);
    node.addEffect(loadManager);
  };

  _proto.addEffect = function addEffect(loadManager) {
    var _this = this;

    var key = loadManager.getKey();
    this.effectMap[key] = {
      loadManager: loadManager
    };
    loadManager.addTeardown(function () {
      return delete _this.effectMap[key];
    });
  };

  _proto.addChildren = function addChildren(_ref2) {
    var _this2 = this;

    var paths = _ref2.paths,
        loadManager = _ref2.loadManager;
    paths.forEach(function (path) {
      _this2.addChild(path, loadManager);
    });
  };

  _proto.triggerEffect = function triggerEffect(path) {
    var node = path.reduce(function (node, cur) {
      if (node && node.childMap && node.childMap[cur]) {
        return node.childMap[cur];
      }

      return node;
    }, this);

    for (var key in node.effectMap) {
      var loadManager = node.effectMap[key].loadManager;
      loadManager.update();
    }
  };

  return EffectNode;
}();

var EventTracker = /*#__PURE__*/function () {
  function EventTracker(props) {
    var events = props.events;
    this.events = events;
    this.eventObject = this.initEventObject();
    this._proxyEvent = new Tracker({
      path: [],
      base: this.eventObject,
      reportAccessPaths: this.reportAccessPaths.bind(this)
    });
    this.accessPaths = [];
    this.effectNodeTree = new EffectNode({
      key: 'root'
    });
    this.currentLoadManager = null;
  }
  /**
   *
   * @param eventValue
   * 目前先做到第一层的比较
   */


  var _proto = EventTracker.prototype;

  _proto.updateEventValue = function updateEventValue(eventValue) {
    var event = eventValue.event,
        value = eventValue.value;
    var baseEventValue = this._proxyEvent[event];

    if (baseEventValue !== value) {
      this._proxyEvent[event] = value; // base value should be loaded as well

      this._proxyEvent.base[event] = value;
      this.effectNodeTree.triggerEffect([event]);
    }
  };

  _proto.getProxyEvent = function getProxyEvent() {
    return this._proxyEvent;
  };

  _proto.reportAccessPaths = function reportAccessPaths(paths) {
    this.accessPaths.push(paths);
  };

  _proto.initEventObject = function initEventObject() {
    return this.events.reduce(function (acc, cur) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[cur] = {}, _extends2));
    }, {});
  };

  _proto.setLoadManager = function setLoadManager(loadManager) {
    this.accessPaths = [];
    this.currentLoadManager = loadManager;
  };

  _proto.releaseLoadManager = function releaseLoadManager() {
    var _this$currentLoadMana;

    var tipPoints = generateRemarkablePaths(this.accessPaths);

    if (this.currentLoadManager) {
      this.effectNodeTree.addChildren({
        paths: tipPoints,
        loadManager: this.currentLoadManager
      });
    }

    logActivity('EventTracker', {
      message: "add effects to loadManager " + ((_this$currentLoadMana = this.currentLoadManager) === null || _this$currentLoadMana === void 0 ? void 0 : _this$currentLoadMana.getKey())
    });
    this.currentLoadManager = null;
  };

  _proto.addEffect = function addEffect() {};

  return EventTracker;
}();

var Halation = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Halation, _PureComponent);

  function Halation(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    var name = props.name,
        store = props.store,
        events = props.events,
        registers = props.registers,
        blockRenderFn = props.blockRenderFn,
        halationState = props.halationState,
        rootRenderFn = props.rootRenderFn;
    _this.halationState = halationState;
    _this.blockRenderFn = blockRenderFn;
    _this.nodeMap = new Map();
    _this.name = name;
    _this.moduleMap = new Map();
    _this.loadManagerMap = new Map();
    _this.rootRenderFn = rootRenderFn;
    _this.hooks = {
      register: new tapable.SyncHook(['block'])
    };
    _this._refs = {};
    _this.runtimeRegisterModule = new Map();
    _this.eventTracker = new EventTracker({
      events: events || []
    });

    _this.createBlockNode(_this.halationState);

    _this.startListen();

    _this.store = store;
    registers.forEach(function (register) {
      var moduleProps = register.call(null);
      var name = moduleProps.name,
          getModel = moduleProps.getModel,
          getComponent = moduleProps.getComponent,
          strategies = moduleProps.strategies;

      if (!_this.moduleMap.get(name)) {
        var module = new Module({
          name: name,
          getComponent: getComponent,
          getModel: getModel,
          strategies: strategies || []
        });

        _this.moduleMap.set(name, module);
      }
    });
    return _this;
  }

  var _proto = Halation.prototype;

  _proto.startListen = function startListen() {
    for (var key in this.hooks) {
      var hook = this.hooks[key];
      hook.tap(key, function () {});
      hook.intercept({
        register: function register(tabInfo) {
          logActivity('Halation', {
            message: 'register info',
            value: tabInfo
          });
          return tabInfo;
        }
      });
    }
  };

  _proto.getName = function getName() {
    return this.name;
  };

  _proto.createBlockNode = function createBlockNode(list) {
    var _this2 = this;

    list.forEach(function (item) {
      var key = item.key;

      _this2.nodeMap.set(key, new Node(item));
    });
    logActivity('Halation', {
      message: 'finish to create nodes ',
      value: this.nodeMap
    });
  };

  _proto.getRefs = function getRefs() {
    return this._refs;
  };

  _proto.getPropsAPI = function getPropsAPI() {
    return {
      hooks: this.hooks,
      nodeMap: this.nodeMap,
      moduleMap: this.moduleMap,
      loadManagerMap: this.loadManagerMap,
      refs: this.getRefs(),
      addBlockLoadManager: this.addBlockLoadManager.bind(this)
    };
  };

  _proto.addBlockLoadManager = function addBlockLoadManager(_ref) {
    var blockKey = _ref.blockKey,
        moduleName = _ref.moduleName,
        strategies = _ref.strategies;

    if (this.loadManagerMap.get(blockKey)) {
      logActivity('Halation', {
        message: "Duplicated module key " + blockKey + " is registered in halation application"
      });
      return false;
    }

    this.loadManagerMap.set(blockKey, new LoadManager({
      store: this.store,
      blockKey: blockKey,
      strategies: strategies,
      moduleName: moduleName,
      moduleMap: this.moduleMap,
      dispatchEvent: this.dispatchEvent.bind(this),
      proxyEvent: this.eventTracker.getProxyEvent(),
      lockCurrentLoadManager: this.lockCurrentLoadManager.bind(this),
      releaseCurrentLoadManager: this.releaseCurrentLoadManager.bind(this)
    }));
    return true;
  };

  _proto.lockCurrentLoadManager = function lockCurrentLoadManager(loadManager) {
    this.eventTracker.setLoadManager(loadManager);
  };

  _proto.releaseCurrentLoadManager = function releaseCurrentLoadManager() {
    this.eventTracker.releaseLoadManager();
  };

  _proto.dispatchEvent = function dispatchEvent(event) {
    var nextValue = event;

    if (isString(event)) {
      nextValue = {
        event: event,
        value: true
      };
    }

    if (isPlainObject(nextValue)) {
      this.eventTracker.updateEventValue(nextValue);
    }
  };

  _proto.render = function render() {
    var blocks = this.nodeMap.values();
    var block = blocks.next().value;
    var children = [];

    while (block) {
      children.push(React.createElement(BlockNode, _extends({
        block: block,
        key: block.getKey(),
        blockRenderFn: this.blockRenderFn
      }, this.getPropsAPI()), null));
      var blockKey = block.getNextSibling();
      block = this.nodeMap.get(blockKey);
    }

    if (typeof this.rootRenderFn === 'function') {
      return React__default.createElement(this.rootRenderFn, _extends({}, this.getPropsAPI()), children);
    }

    return React__default.createElement(React.Fragment, {}, children);
  };

  return Halation;
}(React.PureComponent);

exports.Halation = Halation;
exports.Node = Node;
//# sourceMappingURL=halation.cjs.development.js.map
