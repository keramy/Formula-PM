import {
  invariant
} from "./chunk-M5X4REA2.js";
import {
  _inheritsLoose
} from "./chunk-CWE3A6VF.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-7QXRRMHH.js";
import {
  require_prop_types
} from "./chunk-YQBFPE75.js";
import {
  require_react_dom
} from "./chunk-SP2UK2M6.js";
import {
  require_hoist_non_react_statics_cjs
} from "./chunk-RVH45CIQ.js";
import {
  _extends,
  init_extends
} from "./chunk-DLEOTRWY.js";
import {
  require_react
} from "./chunk-LK4O2NHZ.js";
import {
  _defineProperty
} from "./chunk-QEQD4ENY.js";
import "./chunk-7KBFDO7A.js";
import "./chunk-L4NXMWXH.js";
import "./chunk-ZAUM6RTG.js";
import {
  __commonJS,
  __name,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/react-redux/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "node_modules/react-redux/node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var REACT_ELEMENT_TYPE = 60103;
        var REACT_PORTAL_TYPE = 60106;
        var REACT_FRAGMENT_TYPE = 60107;
        var REACT_STRICT_MODE_TYPE = 60108;
        var REACT_PROFILER_TYPE = 60114;
        var REACT_PROVIDER_TYPE = 60109;
        var REACT_CONTEXT_TYPE = 60110;
        var REACT_FORWARD_REF_TYPE = 60112;
        var REACT_SUSPENSE_TYPE = 60113;
        var REACT_SUSPENSE_LIST_TYPE = 60120;
        var REACT_MEMO_TYPE = 60115;
        var REACT_LAZY_TYPE = 60116;
        var REACT_BLOCK_TYPE = 60121;
        var REACT_SERVER_BLOCK_TYPE = 60122;
        var REACT_FUNDAMENTAL_TYPE = 60117;
        var REACT_SCOPE_TYPE = 60119;
        var REACT_OPAQUE_ID_TYPE = 60128;
        var REACT_DEBUG_TRACING_MODE_TYPE = 60129;
        var REACT_OFFSCREEN_TYPE = 60130;
        var REACT_LEGACY_HIDDEN_TYPE = 60131;
        if (typeof Symbol === "function" && Symbol.for) {
          var symbolFor = Symbol.for;
          REACT_ELEMENT_TYPE = symbolFor("react.element");
          REACT_PORTAL_TYPE = symbolFor("react.portal");
          REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
          REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
          REACT_PROFILER_TYPE = symbolFor("react.profiler");
          REACT_PROVIDER_TYPE = symbolFor("react.provider");
          REACT_CONTEXT_TYPE = symbolFor("react.context");
          REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
          REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
          REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
          REACT_MEMO_TYPE = symbolFor("react.memo");
          REACT_LAZY_TYPE = symbolFor("react.lazy");
          REACT_BLOCK_TYPE = symbolFor("react.block");
          REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
          REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
          REACT_SCOPE_TYPE = symbolFor("react.scope");
          REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
          REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
          REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
          REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
        }
        var enableScopeAPI = false;
        function isValidElementType2(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
              return true;
            }
          }
          return false;
        }
        __name(isValidElementType2, "isValidElementType");
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                  case REACT_SUSPENSE_LIST_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        __name(typeOf, "typeOf");
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element2 = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        var hasWarnedAboutDeprecatedIsConcurrentMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.");
            }
          }
          return false;
        }
        __name(isAsyncMode, "isAsyncMode");
        function isConcurrentMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
              hasWarnedAboutDeprecatedIsConcurrentMode = true;
              console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.");
            }
          }
          return false;
        }
        __name(isConcurrentMode, "isConcurrentMode");
        function isContextConsumer2(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        __name(isContextConsumer2, "isContextConsumer");
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        __name(isContextProvider, "isContextProvider");
        function isElement2(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        __name(isElement2, "isElement");
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        __name(isForwardRef, "isForwardRef");
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        __name(isFragment, "isFragment");
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        __name(isLazy, "isLazy");
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        __name(isMemo, "isMemo");
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        __name(isPortal, "isPortal");
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        __name(isProfiler, "isProfiler");
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        __name(isStrictMode, "isStrictMode");
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        __name(isSuspense, "isSuspense");
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element2;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer2;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement2;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType2;
        exports.typeOf = typeOf;
      })();
    }
  }
});

// node_modules/react-redux/node_modules/react-is/index.js
var require_react_is = __commonJS({
  "node_modules/react-redux/node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// node_modules/react-beautiful-dnd/dist/react-beautiful-dnd.esm.js
var import_react9 = __toESM(require_react());
init_extends();

// node_modules/@babel/runtime/helpers/esm/objectSpread2.js
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
__name(ownKeys, "ownKeys");
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
__name(_objectSpread2, "_objectSpread2");

// node_modules/redux/es/redux.js
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = /* @__PURE__ */ __name(function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
}, "randomString");
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: /* @__PURE__ */ __name(function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }, "PROBE_UNKNOWN_ACTION")
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
__name(isPlainObject, "isPlainObject");
function miniKindOf(val) {
  if (val === void 0) return "undefined";
  if (val === null) return "null";
  var type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val)) return "array";
  if (isDate(val)) return "date";
  if (isError(val)) return "error";
  var constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
__name(miniKindOf, "miniKindOf");
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
__name(ctorName, "ctorName");
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
__name(isError, "isError");
function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
__name(isDate, "isDate");
function kindOf(val) {
  var typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}
__name(kindOf, "kindOf");
function createStore(reducer2, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }
    return enhancer(createStore)(reducer2, preloadedState);
  }
  if (typeof reducer2 !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer2) + "'");
  }
  var currentReducer = reducer2;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  __name(ensureCanMutateNextListeners, "ensureCanMutateNextListeners");
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  __name(getState, "getState");
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return /* @__PURE__ */ __name(function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    }, "unsubscribe");
  }
  __name(subscribe, "subscribe");
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  __name(dispatch, "dispatch");
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  __name(replaceReducer, "replaceReducer");
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: /* @__PURE__ */ __name(function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        __name(observeState, "observeState");
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }, "subscribe")
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  __name(observable, "observable");
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
__name(createStore, "createStore");
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
__name(bindActionCreator, "bindActionCreator");
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(false ? formatProdErrorMessage(16) : "bindActionCreators expected an object or a function, but instead received: '" + kindOf(actionCreators) + `'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`);
  }
  var boundActionCreators = {};
  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
__name(bindActionCreators, "bindActionCreators");
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(void 0, arguments));
    };
  });
}
__name(compose, "compose");
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function(createStore3) {
    return function() {
      var store = createStore3.apply(void 0, arguments);
      var _dispatch = /* @__PURE__ */ __name(function dispatch() {
        throw new Error(false ? formatProdErrorMessage(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
      }, "dispatch");
      var middlewareAPI = {
        getState: store.getState,
        dispatch: /* @__PURE__ */ __name(function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }, "dispatch")
      };
      var chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2(_objectSpread2({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}
__name(applyMiddleware, "applyMiddleware");

// node_modules/react-redux/es/components/Provider.js
var import_react3 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/react-redux/es/components/Context.js
var import_react = __toESM(require_react());
var ReactReduxContext = import_react.default.createContext(null);
if (true) {
  ReactReduxContext.displayName = "ReactRedux";
}

// node_modules/react-redux/es/utils/batch.js
function defaultNoopBatch(callback) {
  callback();
}
__name(defaultNoopBatch, "defaultNoopBatch");
var batch = defaultNoopBatch;
var setBatch = /* @__PURE__ */ __name(function setBatch2(newBatch) {
  return batch = newBatch;
}, "setBatch");
var getBatch = /* @__PURE__ */ __name(function getBatch2() {
  return batch;
}, "getBatch");

// node_modules/react-redux/es/utils/Subscription.js
function createListenerCollection() {
  var batch2 = getBatch();
  var first = null;
  var last = null;
  return {
    clear: /* @__PURE__ */ __name(function clear() {
      first = null;
      last = null;
    }, "clear"),
    notify: /* @__PURE__ */ __name(function notify2() {
      batch2(function() {
        var listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    }, "notify"),
    get: /* @__PURE__ */ __name(function get2() {
      var listeners = [];
      var listener = first;
      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }
      return listeners;
    }, "get"),
    subscribe: /* @__PURE__ */ __name(function subscribe(callback) {
      var isSubscribed = true;
      var listener = last = {
        callback,
        next: null,
        prev: last
      };
      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }
      return /* @__PURE__ */ __name(function unsubscribe() {
        if (!isSubscribed || first === null) return;
        isSubscribed = false;
        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      }, "unsubscribe");
    }, "subscribe")
  };
}
__name(createListenerCollection, "createListenerCollection");
var nullListeners = {
  notify: /* @__PURE__ */ __name(function notify() {
  }, "notify"),
  get: /* @__PURE__ */ __name(function get() {
    return [];
  }, "get")
};
function createSubscription(store, parentSub) {
  var unsubscribe;
  var listeners = nullListeners;
  function addNestedSub(listener) {
    trySubscribe();
    return listeners.subscribe(listener);
  }
  __name(addNestedSub, "addNestedSub");
  function notifyNestedSubs() {
    listeners.notify();
  }
  __name(notifyNestedSubs, "notifyNestedSubs");
  function handleChangeWrapper() {
    if (subscription.onStateChange) {
      subscription.onStateChange();
    }
  }
  __name(handleChangeWrapper, "handleChangeWrapper");
  function isSubscribed() {
    return Boolean(unsubscribe);
  }
  __name(isSubscribed, "isSubscribed");
  function trySubscribe() {
    if (!unsubscribe) {
      unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
      listeners = createListenerCollection();
    }
  }
  __name(trySubscribe, "trySubscribe");
  function tryUnsubscribe() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = void 0;
      listeners.clear();
      listeners = nullListeners;
    }
  }
  __name(tryUnsubscribe, "tryUnsubscribe");
  var subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: /* @__PURE__ */ __name(function getListeners() {
      return listeners;
    }, "getListeners")
  };
  return subscription;
}
__name(createSubscription, "createSubscription");

// node_modules/react-redux/es/utils/useIsomorphicLayoutEffect.js
var import_react2 = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? import_react2.useLayoutEffect : import_react2.useEffect;

// node_modules/react-redux/es/components/Provider.js
function Provider(_ref) {
  var store = _ref.store, context = _ref.context, children = _ref.children;
  var contextValue = (0, import_react3.useMemo)(function() {
    var subscription = createSubscription(store);
    return {
      store,
      subscription
    };
  }, [store]);
  var previousState = (0, import_react3.useMemo)(function() {
    return store.getState();
  }, [store]);
  useIsomorphicLayoutEffect(function() {
    var subscription = contextValue.subscription;
    subscription.onStateChange = subscription.notifyNestedSubs;
    subscription.trySubscribe();
    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs();
    }
    return function() {
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    };
  }, [contextValue, previousState]);
  var Context = context || ReactReduxContext;
  return import_react3.default.createElement(Context.Provider, {
    value: contextValue
  }, children);
}
__name(Provider, "Provider");
if (true) {
  Provider.propTypes = {
    store: import_prop_types.default.shape({
      subscribe: import_prop_types.default.func.isRequired,
      dispatch: import_prop_types.default.func.isRequired,
      getState: import_prop_types.default.func.isRequired
    }),
    context: import_prop_types.default.object,
    children: import_prop_types.default.any
  };
}
var Provider_default = Provider;

// node_modules/react-redux/es/components/connectAdvanced.js
init_extends();
var import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
var import_react4 = __toESM(require_react());
var import_react_is = __toESM(require_react_is());
var _excluded = ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"];
var _excluded2 = ["reactReduxForwardedRef"];
var EMPTY_ARRAY = [];
var NO_SUBSCRIPTION_ARRAY = [null, null];
var stringifyComponent = /* @__PURE__ */ __name(function stringifyComponent2(Comp) {
  try {
    return JSON.stringify(Comp);
  } catch (err) {
    return String(Comp);
  }
}, "stringifyComponent");
function storeStateUpdatesReducer(state, action) {
  var updateCount = state[1];
  return [action.payload, updateCount + 1];
}
__name(storeStateUpdatesReducer, "storeStateUpdatesReducer");
function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
  useIsomorphicLayoutEffect(function() {
    return effectFunc.apply(void 0, effectArgs);
  }, dependencies);
}
__name(useIsomorphicLayoutEffectWithArgs, "useIsomorphicLayoutEffectWithArgs");
function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs) {
  lastWrapperProps.current = wrapperProps;
  lastChildProps.current = actualChildProps;
  renderIsScheduled.current = false;
  if (childPropsFromStoreUpdate.current) {
    childPropsFromStoreUpdate.current = null;
    notifyNestedSubs();
  }
}
__name(captureWrapperProps, "captureWrapperProps");
function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch) {
  if (!shouldHandleStateChanges) return;
  var didUnsubscribe = false;
  var lastThrownError = null;
  var checkForUpdates = /* @__PURE__ */ __name(function checkForUpdates2() {
    if (didUnsubscribe) {
      return;
    }
    var latestStoreState = store.getState();
    var newChildProps, error2;
    try {
      newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
    } catch (e) {
      error2 = e;
      lastThrownError = e;
    }
    if (!error2) {
      lastThrownError = null;
    }
    if (newChildProps === lastChildProps.current) {
      if (!renderIsScheduled.current) {
        notifyNestedSubs();
      }
    } else {
      lastChildProps.current = newChildProps;
      childPropsFromStoreUpdate.current = newChildProps;
      renderIsScheduled.current = true;
      forceComponentUpdateDispatch({
        type: "STORE_UPDATED",
        payload: {
          error: error2
        }
      });
    }
  }, "checkForUpdates");
  subscription.onStateChange = checkForUpdates;
  subscription.trySubscribe();
  checkForUpdates();
  var unsubscribeWrapper = /* @__PURE__ */ __name(function unsubscribeWrapper2() {
    didUnsubscribe = true;
    subscription.tryUnsubscribe();
    subscription.onStateChange = null;
    if (lastThrownError) {
      throw lastThrownError;
    }
  }, "unsubscribeWrapper");
  return unsubscribeWrapper;
}
__name(subscribeUpdates, "subscribeUpdates");
var initStateUpdates = /* @__PURE__ */ __name(function initStateUpdates2() {
  return [null, 0];
}, "initStateUpdates");
function connectAdvanced(selectorFactory, _ref) {
  if (_ref === void 0) {
    _ref = {};
  }
  var _ref2 = _ref, _ref2$getDisplayName = _ref2.getDisplayName, getDisplayName = _ref2$getDisplayName === void 0 ? function(name) {
    return "ConnectAdvanced(" + name + ")";
  } : _ref2$getDisplayName, _ref2$methodName = _ref2.methodName, methodName = _ref2$methodName === void 0 ? "connectAdvanced" : _ref2$methodName, _ref2$renderCountProp = _ref2.renderCountProp, renderCountProp = _ref2$renderCountProp === void 0 ? void 0 : _ref2$renderCountProp, _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges, shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta, _ref2$storeKey = _ref2.storeKey, storeKey = _ref2$storeKey === void 0 ? "store" : _ref2$storeKey, _ref2$withRef = _ref2.withRef, withRef = _ref2$withRef === void 0 ? false : _ref2$withRef, _ref2$forwardRef = _ref2.forwardRef, forwardRef = _ref2$forwardRef === void 0 ? false : _ref2$forwardRef, _ref2$context = _ref2.context, context = _ref2$context === void 0 ? ReactReduxContext : _ref2$context, connectOptions = _objectWithoutPropertiesLoose(_ref2, _excluded);
  if (true) {
    if (renderCountProp !== void 0) {
      throw new Error("renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension");
    }
    if (withRef) {
      throw new Error("withRef is removed. To access the wrapped instance, use a ref on the connected component");
    }
    var customStoreWarningMessage = "To use a custom Redux store for specific components, create a custom React context with React.createContext(), and pass the context object to React Redux's Provider and specific components like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. You may also pass a {context : MyContext} option to connect";
    if (storeKey !== "store") {
      throw new Error("storeKey has been removed and does not do anything. " + customStoreWarningMessage);
    }
  }
  var Context = context;
  return /* @__PURE__ */ __name(function wrapWithConnect(WrappedComponent) {
    if (!(0, import_react_is.isValidElementType)(WrappedComponent)) {
      throw new Error("You must pass a component to the function returned by " + (methodName + ". Instead received " + stringifyComponent(WrappedComponent)));
    }
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    var displayName = getDisplayName(wrappedComponentName);
    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent
    });
    var pure = connectOptions.pure;
    function createChildSelector(store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions);
    }
    __name(createChildSelector, "createChildSelector");
    var usePureOnlyMemo = pure ? import_react4.useMemo : function(callback) {
      return callback();
    };
    function ConnectFunction(props) {
      var _useMemo = (0, import_react4.useMemo)(function() {
        var reactReduxForwardedRef2 = props.reactReduxForwardedRef, wrapperProps2 = _objectWithoutPropertiesLoose(props, _excluded2);
        return [props.context, reactReduxForwardedRef2, wrapperProps2];
      }, [props]), propsContext = _useMemo[0], reactReduxForwardedRef = _useMemo[1], wrapperProps = _useMemo[2];
      var ContextToUse = (0, import_react4.useMemo)(function() {
        return propsContext && propsContext.Consumer && (0, import_react_is.isContextConsumer)(import_react4.default.createElement(propsContext.Consumer, null)) ? propsContext : Context;
      }, [propsContext, Context]);
      var contextValue = (0, import_react4.useContext)(ContextToUse);
      var didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
      var didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);
      if (!didStoreComeFromProps && !didStoreComeFromContext) {
        throw new Error('Could not find "store" in the context of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + "or pass a custom React context provider to <Provider> and the corresponding " + ("React context consumer to " + displayName + " in connect options."));
      }
      var store = didStoreComeFromProps ? props.store : contextValue.store;
      var childPropsSelector = (0, import_react4.useMemo)(function() {
        return createChildSelector(store);
      }, [store]);
      var _useMemo2 = (0, import_react4.useMemo)(function() {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY;
        var subscription2 = createSubscription(store, didStoreComeFromProps ? null : contextValue.subscription);
        var notifyNestedSubs2 = subscription2.notifyNestedSubs.bind(subscription2);
        return [subscription2, notifyNestedSubs2];
      }, [store, didStoreComeFromProps, contextValue]), subscription = _useMemo2[0], notifyNestedSubs = _useMemo2[1];
      var overriddenContextValue = (0, import_react4.useMemo)(function() {
        if (didStoreComeFromProps) {
          return contextValue;
        }
        return _extends({}, contextValue, {
          subscription
        });
      }, [didStoreComeFromProps, contextValue, subscription]);
      var _useReducer = (0, import_react4.useReducer)(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates), _useReducer$ = _useReducer[0], previousStateUpdateResult = _useReducer$[0], forceComponentUpdateDispatch = _useReducer[1];
      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      }
      var lastChildProps = (0, import_react4.useRef)();
      var lastWrapperProps = (0, import_react4.useRef)(wrapperProps);
      var childPropsFromStoreUpdate = (0, import_react4.useRef)();
      var renderIsScheduled = (0, import_react4.useRef)(false);
      var actualChildProps = usePureOnlyMemo(function() {
        if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
          return childPropsFromStoreUpdate.current;
        }
        return childPropsSelector(store.getState(), wrapperProps);
      }, [store, previousStateUpdateResult, wrapperProps]);
      useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs]);
      useIsomorphicLayoutEffectWithArgs(subscribeUpdates, [shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch], [store, subscription, childPropsSelector]);
      var renderedWrappedComponent = (0, import_react4.useMemo)(function() {
        return import_react4.default.createElement(WrappedComponent, _extends({}, actualChildProps, {
          ref: reactReduxForwardedRef
        }));
      }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]);
      var renderedChild = (0, import_react4.useMemo)(function() {
        if (shouldHandleStateChanges) {
          return import_react4.default.createElement(ContextToUse.Provider, {
            value: overriddenContextValue
          }, renderedWrappedComponent);
        }
        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
      return renderedChild;
    }
    __name(ConnectFunction, "ConnectFunction");
    var Connect = pure ? import_react4.default.memo(ConnectFunction) : ConnectFunction;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = ConnectFunction.displayName = displayName;
    if (forwardRef) {
      var forwarded = import_react4.default.forwardRef(/* @__PURE__ */ __name(function forwardConnectRef(props, ref2) {
        return import_react4.default.createElement(Connect, _extends({}, props, {
          reactReduxForwardedRef: ref2
        }));
      }, "forwardConnectRef"));
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      return (0, import_hoist_non_react_statics.default)(forwarded, WrappedComponent);
    }
    return (0, import_hoist_non_react_statics.default)(Connect, WrappedComponent);
  }, "wrapWithConnect");
}
__name(connectAdvanced, "connectAdvanced");

// node_modules/react-redux/es/connect/connect.js
init_extends();

// node_modules/react-redux/es/utils/shallowEqual.js
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
__name(is, "is");
function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (var i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
__name(shallowEqual, "shallowEqual");

// node_modules/react-redux/es/utils/bindActionCreators.js
function bindActionCreators2(actionCreators, dispatch) {
  var boundActionCreators = {};
  var _loop = /* @__PURE__ */ __name(function _loop2(key2) {
    var actionCreator = actionCreators[key2];
    if (typeof actionCreator === "function") {
      boundActionCreators[key2] = function() {
        return dispatch(actionCreator.apply(void 0, arguments));
      };
    }
  }, "_loop");
  for (var key in actionCreators) {
    _loop(key);
  }
  return boundActionCreators;
}
__name(bindActionCreators2, "bindActionCreators");

// node_modules/react-redux/es/utils/isPlainObject.js
function isPlainObject2(obj) {
  if (typeof obj !== "object" || obj === null) return false;
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;
  var baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }
  return proto === baseProto;
}
__name(isPlainObject2, "isPlainObject");

// node_modules/react-redux/es/utils/warning.js
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {
  }
}
__name(warning, "warning");

// node_modules/react-redux/es/utils/verifyPlainObject.js
function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject2(value)) {
    warning(methodName + "() in " + displayName + " must return a plain object. Instead received " + value + ".");
  }
}
__name(verifyPlainObject, "verifyPlainObject");

// node_modules/react-redux/es/connect/wrapMapToProps.js
function wrapMapToPropsConstant(getConstant) {
  return /* @__PURE__ */ __name(function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);
    function constantSelector() {
      return constant;
    }
    __name(constantSelector, "constantSelector");
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  }, "initConstantSelector");
}
__name(wrapMapToPropsConstant, "wrapMapToPropsConstant");
function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== void 0 ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}
__name(getDependsOnOwnProps, "getDependsOnOwnProps");
function wrapMapToPropsFunc(mapToProps, methodName) {
  return /* @__PURE__ */ __name(function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;
    var proxy = /* @__PURE__ */ __name(function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }, "mapToPropsProxy");
    proxy.dependsOnOwnProps = true;
    proxy.mapToProps = /* @__PURE__ */ __name(function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);
      if (typeof props === "function") {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }
      if (true) verifyPlainObject(props, displayName, methodName);
      return props;
    }, "detectFactoryAndVerify");
    return proxy;
  }, "initProxySelector");
}
__name(wrapMapToPropsFunc, "wrapMapToPropsFunc");

// node_modules/react-redux/es/connect/mapDispatchToProps.js
function whenMapDispatchToPropsIsFunction(mapDispatchToProps2) {
  return typeof mapDispatchToProps2 === "function" ? wrapMapToPropsFunc(mapDispatchToProps2, "mapDispatchToProps") : void 0;
}
__name(whenMapDispatchToPropsIsFunction, "whenMapDispatchToPropsIsFunction");
function whenMapDispatchToPropsIsMissing(mapDispatchToProps2) {
  return !mapDispatchToProps2 ? wrapMapToPropsConstant(function(dispatch) {
    return {
      dispatch
    };
  }) : void 0;
}
__name(whenMapDispatchToPropsIsMissing, "whenMapDispatchToPropsIsMissing");
function whenMapDispatchToPropsIsObject(mapDispatchToProps2) {
  return mapDispatchToProps2 && typeof mapDispatchToProps2 === "object" ? wrapMapToPropsConstant(function(dispatch) {
    return bindActionCreators2(mapDispatchToProps2, dispatch);
  }) : void 0;
}
__name(whenMapDispatchToPropsIsObject, "whenMapDispatchToPropsIsObject");
var mapDispatchToProps_default = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

// node_modules/react-redux/es/connect/mapStateToProps.js
function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === "function" ? wrapMapToPropsFunc(mapStateToProps, "mapStateToProps") : void 0;
}
__name(whenMapStateToPropsIsFunction, "whenMapStateToPropsIsFunction");
function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function() {
    return {};
  }) : void 0;
}
__name(whenMapStateToPropsIsMissing, "whenMapStateToPropsIsMissing");
var mapStateToProps_default = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

// node_modules/react-redux/es/connect/mergeProps.js
init_extends();
function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}
__name(defaultMergeProps, "defaultMergeProps");
function wrapMergePropsFunc(mergeProps) {
  return /* @__PURE__ */ __name(function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName, pure = _ref.pure, areMergedPropsEqual = _ref.areMergedPropsEqual;
    var hasRunOnce = false;
    var mergedProps;
    return /* @__PURE__ */ __name(function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;
        if (true) verifyPlainObject(mergedProps, displayName, "mergeProps");
      }
      return mergedProps;
    }, "mergePropsProxy");
  }, "initMergePropsProxy");
}
__name(wrapMergePropsFunc, "wrapMergePropsFunc");
function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === "function" ? wrapMergePropsFunc(mergeProps) : void 0;
}
__name(whenMergePropsIsFunction, "whenMergePropsIsFunction");
function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function() {
    return defaultMergeProps;
  } : void 0;
}
__name(whenMergePropsIsOmitted, "whenMergePropsIsOmitted");
var mergeProps_default = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

// node_modules/react-redux/es/connect/verifySubselectors.js
function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error("Unexpected value for " + methodName + " in " + displayName + ".");
  } else if (methodName === "mapStateToProps" || methodName === "mapDispatchToProps") {
    if (!Object.prototype.hasOwnProperty.call(selector, "dependsOnOwnProps")) {
      warning("The selector for " + methodName + " of " + displayName + " did not specify a value for dependsOnOwnProps.");
    }
  }
}
__name(verify, "verify");
function verifySubselectors(mapStateToProps, mapDispatchToProps2, mergeProps, displayName) {
  verify(mapStateToProps, "mapStateToProps", displayName);
  verify(mapDispatchToProps2, "mapDispatchToProps", displayName);
  verify(mergeProps, "mergeProps", displayName);
}
__name(verifySubselectors, "verifySubselectors");

// node_modules/react-redux/es/connect/selectorFactory.js
var _excluded3 = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];
function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch) {
  return /* @__PURE__ */ __name(function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps2(dispatch, ownProps), ownProps);
  }, "impureFinalPropsSelector");
}
__name(impureFinalPropsSelectorFactory, "impureFinalPropsSelectorFactory");
function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual, areOwnPropsEqual = _ref.areOwnPropsEqual, areStatePropsEqual = _ref.areStatePropsEqual;
  var hasRunAtLeastOnce = false;
  var state;
  var ownProps;
  var stateProps;
  var dispatchProps;
  var mergedProps;
  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps2(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }
  __name(handleFirstCall, "handleFirstCall");
  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps2.dependsOnOwnProps) dispatchProps = mapDispatchToProps2(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }
  __name(handleNewPropsAndNewState, "handleNewPropsAndNewState");
  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps2.dependsOnOwnProps) dispatchProps = mapDispatchToProps2(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }
  __name(handleNewProps, "handleNewProps");
  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;
    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }
  __name(handleNewState, "handleNewState");
  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state, nextOwnProps, ownProps);
    state = nextState;
    ownProps = nextOwnProps;
    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }
  __name(handleSubsequentCalls, "handleSubsequentCalls");
  return /* @__PURE__ */ __name(function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  }, "pureFinalPropsSelector");
}
__name(pureFinalPropsSelectorFactory, "pureFinalPropsSelectorFactory");
function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps, initMapDispatchToProps = _ref2.initMapDispatchToProps, initMergeProps = _ref2.initMergeProps, options = _objectWithoutPropertiesLoose(_ref2, _excluded3);
  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps2 = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);
  if (true) {
    verifySubselectors(mapStateToProps, mapDispatchToProps2, mergeProps, options.displayName);
  }
  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
  return selectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch, options);
}
__name(finalPropsSelectorFactory, "finalPropsSelectorFactory");

// node_modules/react-redux/es/connect/connect.js
var _excluded4 = ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"];
function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }
  return function(dispatch, options) {
    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
  };
}
__name(match, "match");
function strictEqual(a, b) {
  return a === b;
}
__name(strictEqual, "strictEqual");
function createConnect(_temp) {
  var _ref = _temp === void 0 ? {} : _temp, _ref$connectHOC = _ref.connectHOC, connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC, _ref$mapStateToPropsF = _ref.mapStateToPropsFactories, mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? mapStateToProps_default : _ref$mapStateToPropsF, _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories, mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? mapDispatchToProps_default : _ref$mapDispatchToPro, _ref$mergePropsFactor = _ref.mergePropsFactories, mergePropsFactories = _ref$mergePropsFactor === void 0 ? mergeProps_default : _ref$mergePropsFactor, _ref$selectorFactory = _ref.selectorFactory, selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;
  return /* @__PURE__ */ __name(function connect(mapStateToProps, mapDispatchToProps2, mergeProps, _ref2) {
    if (_ref2 === void 0) {
      _ref2 = {};
    }
    var _ref3 = _ref2, _ref3$pure = _ref3.pure, pure = _ref3$pure === void 0 ? true : _ref3$pure, _ref3$areStatesEqual = _ref3.areStatesEqual, areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual, _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual, areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua, _ref3$areStatePropsEq = _ref3.areStatePropsEqual, areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq, _ref3$areMergedPropsE = _ref3.areMergedPropsEqual, areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE, extraOptions = _objectWithoutPropertiesLoose(_ref3, _excluded4);
    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, "mapStateToProps");
    var initMapDispatchToProps = match(mapDispatchToProps2, mapDispatchToPropsFactories, "mapDispatchToProps");
    var initMergeProps = match(mergeProps, mergePropsFactories, "mergeProps");
    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: "connect",
      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: /* @__PURE__ */ __name(function getDisplayName(name) {
        return "Connect(" + name + ")";
      }, "getDisplayName"),
      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),
      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual
    }, extraOptions));
  }, "connect");
}
__name(createConnect, "createConnect");
var connect_default = createConnect();

// node_modules/react-redux/es/hooks/useStore.js
var import_react6 = __toESM(require_react());

// node_modules/react-redux/es/hooks/useReduxContext.js
var import_react5 = __toESM(require_react());
function useReduxContext() {
  var contextValue = (0, import_react5.useContext)(ReactReduxContext);
  if (!contextValue) {
    throw new Error("could not find react-redux context value; please ensure the component is wrapped in a <Provider>");
  }
  return contextValue;
}
__name(useReduxContext, "useReduxContext");

// node_modules/react-redux/es/hooks/useStore.js
function createStoreHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useReduxContext2 = context === ReactReduxContext ? useReduxContext : function() {
    return (0, import_react6.useContext)(context);
  };
  return /* @__PURE__ */ __name(function useStore2() {
    var _useReduxContext = useReduxContext2(), store = _useReduxContext.store;
    return store;
  }, "useStore");
}
__name(createStoreHook, "createStoreHook");
var useStore = createStoreHook();

// node_modules/react-redux/es/hooks/useDispatch.js
function createDispatchHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useStore2 = context === ReactReduxContext ? useStore : createStoreHook(context);
  return /* @__PURE__ */ __name(function useDispatch2() {
    var store = useStore2();
    return store.dispatch;
  }, "useDispatch");
}
__name(createDispatchHook, "createDispatchHook");
var useDispatch = createDispatchHook();

// node_modules/react-redux/es/hooks/useSelector.js
var import_react7 = __toESM(require_react());
var refEquality = /* @__PURE__ */ __name(function refEquality2(a, b) {
  return a === b;
}, "refEquality");
function useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub) {
  var _useReducer = (0, import_react7.useReducer)(function(s) {
    return s + 1;
  }, 0), forceRender = _useReducer[1];
  var subscription = (0, import_react7.useMemo)(function() {
    return createSubscription(store, contextSub);
  }, [store, contextSub]);
  var latestSubscriptionCallbackError = (0, import_react7.useRef)();
  var latestSelector = (0, import_react7.useRef)();
  var latestStoreState = (0, import_react7.useRef)();
  var latestSelectedState = (0, import_react7.useRef)();
  var storeState = store.getState();
  var selectedState;
  try {
    if (selector !== latestSelector.current || storeState !== latestStoreState.current || latestSubscriptionCallbackError.current) {
      var newSelectedState = selector(storeState);
      if (latestSelectedState.current === void 0 || !equalityFn(newSelectedState, latestSelectedState.current)) {
        selectedState = newSelectedState;
      } else {
        selectedState = latestSelectedState.current;
      }
    } else {
      selectedState = latestSelectedState.current;
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current) {
      err.message += "\nThe error may be correlated with this previous error:\n" + latestSubscriptionCallbackError.current.stack + "\n\n";
    }
    throw err;
  }
  useIsomorphicLayoutEffect(function() {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selectedState;
    latestSubscriptionCallbackError.current = void 0;
  });
  useIsomorphicLayoutEffect(function() {
    function checkForUpdates() {
      try {
        var newStoreState = store.getState();
        if (newStoreState === latestStoreState.current) {
          return;
        }
        var _newSelectedState = latestSelector.current(newStoreState);
        if (equalityFn(_newSelectedState, latestSelectedState.current)) {
          return;
        }
        latestSelectedState.current = _newSelectedState;
        latestStoreState.current = newStoreState;
      } catch (err) {
        latestSubscriptionCallbackError.current = err;
      }
      forceRender();
    }
    __name(checkForUpdates, "checkForUpdates");
    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();
    checkForUpdates();
    return function() {
      return subscription.tryUnsubscribe();
    };
  }, [store, subscription]);
  return selectedState;
}
__name(useSelectorWithStoreAndSubscription, "useSelectorWithStoreAndSubscription");
function createSelectorHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }
  var useReduxContext2 = context === ReactReduxContext ? useReduxContext : function() {
    return (0, import_react7.useContext)(context);
  };
  return /* @__PURE__ */ __name(function useSelector2(selector, equalityFn) {
    if (equalityFn === void 0) {
      equalityFn = refEquality;
    }
    if (true) {
      if (!selector) {
        throw new Error("You must pass a selector to useSelector");
      }
      if (typeof selector !== "function") {
        throw new Error("You must pass a function as a selector to useSelector");
      }
      if (typeof equalityFn !== "function") {
        throw new Error("You must pass a function as an equality function to useSelector");
      }
    }
    var _useReduxContext = useReduxContext2(), store = _useReduxContext.store, contextSub = _useReduxContext.subscription;
    var selectedState = useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub);
    (0, import_react7.useDebugValue)(selectedState);
    return selectedState;
  }, "useSelector");
}
__name(createSelectorHook, "createSelectorHook");
var useSelector = createSelectorHook();

// node_modules/react-redux/es/utils/reactBatchedUpdates.js
var import_react_dom = __toESM(require_react_dom());

// node_modules/react-redux/es/index.js
setBatch(import_react_dom.unstable_batchedUpdates);

// node_modules/use-memo-one/dist/use-memo-one.esm.js
var import_react8 = __toESM(require_react());
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }
  return true;
}
__name(areInputsEqual, "areInputsEqual");
function useMemoOne(getResult, inputs) {
  var initial = (0, import_react8.useState)(function() {
    return {
      inputs,
      result: getResult()
    };
  })[0];
  var isFirstRun = (0, import_react8.useRef)(true);
  var committed = (0, import_react8.useRef)(initial);
  var useCache = isFirstRun.current || Boolean(inputs && committed.current.inputs && areInputsEqual(inputs, committed.current.inputs));
  var cache = useCache ? committed.current : {
    inputs,
    result: getResult()
  };
  (0, import_react8.useEffect)(function() {
    isFirstRun.current = false;
    committed.current = cache;
  }, [cache]);
  return cache.result;
}
__name(useMemoOne, "useMemoOne");
function useCallbackOne(callback, inputs) {
  return useMemoOne(function() {
    return callback;
  }, inputs);
}
__name(useCallbackOne, "useCallbackOne");
var useMemo4 = useMemoOne;
var useCallback = useCallbackOne;

// node_modules/css-box-model/dist/css-box-model.esm.js
var getRect = /* @__PURE__ */ __name(function getRect2(_ref) {
  var top = _ref.top, right = _ref.right, bottom = _ref.bottom, left = _ref.left;
  var width = right - left;
  var height = bottom - top;
  var rect = {
    top,
    right,
    bottom,
    left,
    width,
    height,
    x: left,
    y: top,
    center: {
      x: (right + left) / 2,
      y: (bottom + top) / 2
    }
  };
  return rect;
}, "getRect");
var expand = /* @__PURE__ */ __name(function expand2(target, expandBy) {
  return {
    top: target.top - expandBy.top,
    left: target.left - expandBy.left,
    bottom: target.bottom + expandBy.bottom,
    right: target.right + expandBy.right
  };
}, "expand");
var shrink = /* @__PURE__ */ __name(function shrink2(target, shrinkBy) {
  return {
    top: target.top + shrinkBy.top,
    left: target.left + shrinkBy.left,
    bottom: target.bottom - shrinkBy.bottom,
    right: target.right - shrinkBy.right
  };
}, "shrink");
var shift = /* @__PURE__ */ __name(function shift2(target, shiftBy) {
  return {
    top: target.top + shiftBy.y,
    left: target.left + shiftBy.x,
    bottom: target.bottom + shiftBy.y,
    right: target.right + shiftBy.x
  };
}, "shift");
var noSpacing = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var createBox = /* @__PURE__ */ __name(function createBox2(_ref2) {
  var borderBox = _ref2.borderBox, _ref2$margin = _ref2.margin, margin = _ref2$margin === void 0 ? noSpacing : _ref2$margin, _ref2$border = _ref2.border, border = _ref2$border === void 0 ? noSpacing : _ref2$border, _ref2$padding = _ref2.padding, padding = _ref2$padding === void 0 ? noSpacing : _ref2$padding;
  var marginBox = getRect(expand(borderBox, margin));
  var paddingBox = getRect(shrink(borderBox, border));
  var contentBox = getRect(shrink(paddingBox, padding));
  return {
    marginBox,
    borderBox: getRect(borderBox),
    paddingBox,
    contentBox,
    margin,
    border,
    padding
  };
}, "createBox");
var parse = /* @__PURE__ */ __name(function parse2(raw) {
  var value = raw.slice(0, -2);
  var suffix2 = raw.slice(-2);
  if (suffix2 !== "px") {
    return 0;
  }
  var result = Number(value);
  !!isNaN(result) ? true ? invariant(false, "Could not parse value [raw: " + raw + ", without suffix: " + value + "]") : invariant(false) : void 0;
  return result;
}, "parse");
var getWindowScroll = /* @__PURE__ */ __name(function getWindowScroll2() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}, "getWindowScroll");
var offset = /* @__PURE__ */ __name(function offset2(original, change) {
  var borderBox = original.borderBox, border = original.border, margin = original.margin, padding = original.padding;
  var shifted = shift(borderBox, change);
  return createBox({
    borderBox: shifted,
    border,
    margin,
    padding
  });
}, "offset");
var withScroll = /* @__PURE__ */ __name(function withScroll2(original, scroll3) {
  if (scroll3 === void 0) {
    scroll3 = getWindowScroll();
  }
  return offset(original, scroll3);
}, "withScroll");
var calculateBox = /* @__PURE__ */ __name(function calculateBox2(borderBox, styles) {
  var margin = {
    top: parse(styles.marginTop),
    right: parse(styles.marginRight),
    bottom: parse(styles.marginBottom),
    left: parse(styles.marginLeft)
  };
  var padding = {
    top: parse(styles.paddingTop),
    right: parse(styles.paddingRight),
    bottom: parse(styles.paddingBottom),
    left: parse(styles.paddingLeft)
  };
  var border = {
    top: parse(styles.borderTopWidth),
    right: parse(styles.borderRightWidth),
    bottom: parse(styles.borderBottomWidth),
    left: parse(styles.borderLeftWidth)
  };
  return createBox({
    borderBox,
    margin,
    padding,
    border
  });
}, "calculateBox");
var getBox = /* @__PURE__ */ __name(function getBox2(el) {
  var borderBox = el.getBoundingClientRect();
  var styles = window.getComputedStyle(el);
  return calculateBox(borderBox, styles);
}, "getBox");

// node_modules/memoize-one/dist/memoize-one.esm.js
var safeIsNaN = Number.isNaN || /* @__PURE__ */ __name(function ponyfill(value) {
  return typeof value === "number" && value !== value;
}, "ponyfill");
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
__name(isEqual, "isEqual");
function areInputsEqual2(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
__name(areInputsEqual2, "areInputsEqual");
function memoizeOne(resultFn, isEqual5) {
  if (isEqual5 === void 0) {
    isEqual5 = areInputsEqual2;
  }
  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (calledOnce && lastThis === this && isEqual5(newArgs, lastArgs)) {
      return lastResult;
    }
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }
  __name(memoized, "memoized");
  return memoized;
}
__name(memoizeOne, "memoizeOne");
var memoize_one_esm_default = memoizeOne;

// node_modules/raf-schd/dist/raf-schd.esm.js
var rafSchd = /* @__PURE__ */ __name(function rafSchd2(fn) {
  var lastArgs = [];
  var frameId = null;
  var wrapperFn = /* @__PURE__ */ __name(function wrapperFn2() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    lastArgs = args;
    if (frameId) {
      return;
    }
    frameId = requestAnimationFrame(function() {
      frameId = null;
      fn.apply(void 0, lastArgs);
    });
  }, "wrapperFn");
  wrapperFn.cancel = function() {
    if (!frameId) {
      return;
    }
    cancelAnimationFrame(frameId);
    frameId = null;
  };
  return wrapperFn;
}, "rafSchd");
var raf_schd_esm_default = rafSchd;

// node_modules/react-beautiful-dnd/dist/react-beautiful-dnd.esm.js
var import_react_dom2 = __toESM(require_react_dom());
var isProduction = false;
var spacesAndTabs = /[ \t]{2,}/g;
var lineStartWithSpaces = /^[ \t]*/gm;
var clean = /* @__PURE__ */ __name(function clean2(value) {
  return value.replace(spacesAndTabs, " ").replace(lineStartWithSpaces, "").trim();
}, "clean");
var getDevMessage = /* @__PURE__ */ __name(function getDevMessage2(message) {
  return clean("\n  %creact-beautiful-dnd\n\n  %c" + clean(message) + "\n\n  %c👷‍ This is a development only message. It will be removed in production builds.\n");
}, "getDevMessage");
var getFormattedMessage = /* @__PURE__ */ __name(function getFormattedMessage2(message) {
  return [getDevMessage(message), "color: #00C584; font-size: 1.2em; font-weight: bold;", "line-height: 1.5", "color: #723874;"];
}, "getFormattedMessage");
var isDisabledFlag = "__react-beautiful-dnd-disable-dev-warnings";
function log(type, message) {
  var _console;
  if (isProduction) {
    return;
  }
  if (typeof window !== "undefined" && window[isDisabledFlag]) {
    return;
  }
  (_console = console)[type].apply(_console, getFormattedMessage(message));
}
__name(log, "log");
var warning2 = log.bind(null, "warn");
var error = log.bind(null, "error");
function noop() {
}
__name(noop, "noop");
function getOptions(shared2, fromBinding) {
  return _extends({}, shared2, {}, fromBinding);
}
__name(getOptions, "getOptions");
function bindEvents(el, bindings, sharedOptions) {
  var unbindings = bindings.map(function(binding) {
    var options = getOptions(sharedOptions, binding.options);
    el.addEventListener(binding.eventName, binding.fn, options);
    return /* @__PURE__ */ __name(function unbind() {
      el.removeEventListener(binding.eventName, binding.fn, options);
    }, "unbind");
  });
  return /* @__PURE__ */ __name(function unbindAll() {
    unbindings.forEach(function(unbind) {
      unbind();
    });
  }, "unbindAll");
}
__name(bindEvents, "bindEvents");
var isProduction$1 = false;
var prefix = "Invariant failed";
function RbdInvariant(message) {
  this.message = message;
}
__name(RbdInvariant, "RbdInvariant");
RbdInvariant.prototype.toString = /* @__PURE__ */ __name(function toString() {
  return this.message;
}, "toString");
function invariant2(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction$1) {
    throw new RbdInvariant(prefix);
  } else {
    throw new RbdInvariant(prefix + ": " + (message || ""));
  }
}
__name(invariant2, "invariant");
var ErrorBoundary = function(_React$Component) {
  _inheritsLoose(ErrorBoundary2, _React$Component);
  function ErrorBoundary2() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.callbacks = null;
    _this.unbind = noop;
    _this.onWindowError = function(event) {
      var callbacks = _this.getCallbacks();
      if (callbacks.isDragging()) {
        callbacks.tryAbort();
        true ? warning2("\n        An error was caught by our window 'error' event listener while a drag was occurring.\n        The active drag has been aborted.\n      ") : void 0;
      }
      var err = event.error;
      if (err instanceof RbdInvariant) {
        event.preventDefault();
        if (true) {
          error(err.message);
        }
      }
    };
    _this.getCallbacks = function() {
      if (!_this.callbacks) {
        throw new Error("Unable to find AppCallbacks in <ErrorBoundary/>");
      }
      return _this.callbacks;
    };
    _this.setCallbacks = function(callbacks) {
      _this.callbacks = callbacks;
    };
    return _this;
  }
  __name(ErrorBoundary2, "ErrorBoundary");
  var _proto = ErrorBoundary2.prototype;
  _proto.componentDidMount = /* @__PURE__ */ __name(function componentDidMount() {
    this.unbind = bindEvents(window, [{
      eventName: "error",
      fn: this.onWindowError
    }]);
  }, "componentDidMount");
  _proto.componentDidCatch = /* @__PURE__ */ __name(function componentDidCatch(err) {
    if (err instanceof RbdInvariant) {
      if (true) {
        error(err.message);
      }
      this.setState({});
      return;
    }
    throw err;
  }, "componentDidCatch");
  _proto.componentWillUnmount = /* @__PURE__ */ __name(function componentWillUnmount() {
    this.unbind();
  }, "componentWillUnmount");
  _proto.render = /* @__PURE__ */ __name(function render() {
    return this.props.children(this.setCallbacks);
  }, "render");
  return ErrorBoundary2;
}(import_react9.default.Component);
var dragHandleUsageInstructions = "\n  Press space bar to start a drag.\n  When dragging you can use the arrow keys to move the item around and escape to cancel.\n  Some screen readers may require you to be in focus mode or to use your pass through key\n";
var position = /* @__PURE__ */ __name(function position2(index) {
  return index + 1;
}, "position");
var onDragStart = /* @__PURE__ */ __name(function onDragStart2(start3) {
  return "\n  You have lifted an item in position " + position(start3.source.index) + "\n";
}, "onDragStart");
var withLocation = /* @__PURE__ */ __name(function withLocation2(source, destination) {
  var isInHomeList = source.droppableId === destination.droppableId;
  var startPosition = position(source.index);
  var endPosition = position(destination.index);
  if (isInHomeList) {
    return "\n      You have moved the item from position " + startPosition + "\n      to position " + endPosition + "\n    ";
  }
  return "\n    You have moved the item from position " + startPosition + "\n    in list " + source.droppableId + "\n    to list " + destination.droppableId + "\n    in position " + endPosition + "\n  ";
}, "withLocation");
var withCombine = /* @__PURE__ */ __name(function withCombine2(id, source, combine2) {
  var inHomeList = source.droppableId === combine2.droppableId;
  if (inHomeList) {
    return "\n      The item " + id + "\n      has been combined with " + combine2.draggableId;
  }
  return "\n      The item " + id + "\n      in list " + source.droppableId + "\n      has been combined with " + combine2.draggableId + "\n      in list " + combine2.droppableId + "\n    ";
}, "withCombine");
var onDragUpdate = /* @__PURE__ */ __name(function onDragUpdate2(update2) {
  var location = update2.destination;
  if (location) {
    return withLocation(update2.source, location);
  }
  var combine2 = update2.combine;
  if (combine2) {
    return withCombine(update2.draggableId, update2.source, combine2);
  }
  return "You are over an area that cannot be dropped on";
}, "onDragUpdate");
var returnedToStart = /* @__PURE__ */ __name(function returnedToStart2(source) {
  return "\n  The item has returned to its starting position\n  of " + position(source.index) + "\n";
}, "returnedToStart");
var onDragEnd = /* @__PURE__ */ __name(function onDragEnd2(result) {
  if (result.reason === "CANCEL") {
    return "\n      Movement cancelled.\n      " + returnedToStart(result.source) + "\n    ";
  }
  var location = result.destination;
  var combine2 = result.combine;
  if (location) {
    return "\n      You have dropped the item.\n      " + withLocation(result.source, location) + "\n    ";
  }
  if (combine2) {
    return "\n      You have dropped the item.\n      " + withCombine(result.draggableId, result.source, combine2) + "\n    ";
  }
  return "\n    The item has been dropped while not over a drop area.\n    " + returnedToStart(result.source) + "\n  ";
}, "onDragEnd");
var preset = {
  dragHandleUsageInstructions,
  onDragStart,
  onDragUpdate,
  onDragEnd
};
var origin = {
  x: 0,
  y: 0
};
var add = /* @__PURE__ */ __name(function add2(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y
  };
}, "add");
var subtract = /* @__PURE__ */ __name(function subtract2(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  };
}, "subtract");
var isEqual2 = /* @__PURE__ */ __name(function isEqual3(point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
}, "isEqual");
var negate = /* @__PURE__ */ __name(function negate2(point) {
  return {
    x: point.x !== 0 ? -point.x : 0,
    y: point.y !== 0 ? -point.y : 0
  };
}, "negate");
var patch = /* @__PURE__ */ __name(function patch2(line, value, otherValue) {
  var _ref;
  if (otherValue === void 0) {
    otherValue = 0;
  }
  return _ref = {}, _ref[line] = value, _ref[line === "x" ? "y" : "x"] = otherValue, _ref;
}, "patch");
var distance = /* @__PURE__ */ __name(function distance2(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}, "distance");
var closest = /* @__PURE__ */ __name(function closest2(target, points) {
  return Math.min.apply(Math, points.map(function(point) {
    return distance(target, point);
  }));
}, "closest");
var apply = /* @__PURE__ */ __name(function apply2(fn) {
  return function(point) {
    return {
      x: fn(point.x),
      y: fn(point.y)
    };
  };
}, "apply");
var executeClip = /* @__PURE__ */ __name(function(frame, subject) {
  var result = getRect({
    top: Math.max(subject.top, frame.top),
    right: Math.min(subject.right, frame.right),
    bottom: Math.min(subject.bottom, frame.bottom),
    left: Math.max(subject.left, frame.left)
  });
  if (result.width <= 0 || result.height <= 0) {
    return null;
  }
  return result;
}, "executeClip");
var offsetByPosition = /* @__PURE__ */ __name(function offsetByPosition2(spacing, point) {
  return {
    top: spacing.top + point.y,
    left: spacing.left + point.x,
    bottom: spacing.bottom + point.y,
    right: spacing.right + point.x
  };
}, "offsetByPosition");
var getCorners = /* @__PURE__ */ __name(function getCorners2(spacing) {
  return [{
    x: spacing.left,
    y: spacing.top
  }, {
    x: spacing.right,
    y: spacing.top
  }, {
    x: spacing.left,
    y: spacing.bottom
  }, {
    x: spacing.right,
    y: spacing.bottom
  }];
}, "getCorners");
var noSpacing2 = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var scroll = /* @__PURE__ */ __name(function scroll2(target, frame) {
  if (!frame) {
    return target;
  }
  return offsetByPosition(target, frame.scroll.diff.displacement);
}, "scroll");
var increase = /* @__PURE__ */ __name(function increase2(target, axis, withPlaceholder) {
  if (withPlaceholder && withPlaceholder.increasedBy) {
    var _extends2;
    return _extends({}, target, (_extends2 = {}, _extends2[axis.end] = target[axis.end] + withPlaceholder.increasedBy[axis.line], _extends2));
  }
  return target;
}, "increase");
var clip = /* @__PURE__ */ __name(function clip2(target, frame) {
  if (frame && frame.shouldClipSubject) {
    return executeClip(frame.pageMarginBox, target);
  }
  return getRect(target);
}, "clip");
var getSubject = /* @__PURE__ */ __name(function(_ref) {
  var page = _ref.page, withPlaceholder = _ref.withPlaceholder, axis = _ref.axis, frame = _ref.frame;
  var scrolled = scroll(page.marginBox, frame);
  var increased = increase(scrolled, axis, withPlaceholder);
  var clipped = clip(increased, frame);
  return {
    page,
    withPlaceholder,
    active: clipped
  };
}, "getSubject");
var scrollDroppable = /* @__PURE__ */ __name(function(droppable2, newScroll) {
  !droppable2.frame ? true ? invariant2(false) : invariant2(false) : void 0;
  var scrollable = droppable2.frame;
  var scrollDiff = subtract(newScroll, scrollable.scroll.initial);
  var scrollDisplacement = negate(scrollDiff);
  var frame = _extends({}, scrollable, {
    scroll: {
      initial: scrollable.scroll.initial,
      current: newScroll,
      diff: {
        value: scrollDiff,
        displacement: scrollDisplacement
      },
      max: scrollable.scroll.max
    }
  });
  var subject = getSubject({
    page: droppable2.subject.page,
    withPlaceholder: droppable2.subject.withPlaceholder,
    axis: droppable2.axis,
    frame
  });
  var result = _extends({}, droppable2, {
    frame,
    subject
  });
  return result;
}, "scrollDroppable");
function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  }
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}
__name(isInteger, "isInteger");
function values(map) {
  if (Object.values) {
    return Object.values(map);
  }
  return Object.keys(map).map(function(key) {
    return map[key];
  });
}
__name(values, "values");
function findIndex(list, predicate) {
  if (list.findIndex) {
    return list.findIndex(predicate);
  }
  for (var i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return i;
    }
  }
  return -1;
}
__name(findIndex, "findIndex");
function find(list, predicate) {
  if (list.find) {
    return list.find(predicate);
  }
  var index = findIndex(list, predicate);
  if (index !== -1) {
    return list[index];
  }
  return void 0;
}
__name(find, "find");
function toArray(list) {
  return Array.prototype.slice.call(list);
}
__name(toArray, "toArray");
var toDroppableMap = memoize_one_esm_default(function(droppables) {
  return droppables.reduce(function(previous, current) {
    previous[current.descriptor.id] = current;
    return previous;
  }, {});
});
var toDraggableMap = memoize_one_esm_default(function(draggables) {
  return draggables.reduce(function(previous, current) {
    previous[current.descriptor.id] = current;
    return previous;
  }, {});
});
var toDroppableList = memoize_one_esm_default(function(droppables) {
  return values(droppables);
});
var toDraggableList = memoize_one_esm_default(function(draggables) {
  return values(draggables);
});
var getDraggablesInsideDroppable = memoize_one_esm_default(function(droppableId, draggables) {
  var result = toDraggableList(draggables).filter(function(draggable2) {
    return droppableId === draggable2.descriptor.droppableId;
  }).sort(function(a, b) {
    return a.descriptor.index - b.descriptor.index;
  });
  return result;
});
function tryGetDestination(impact) {
  if (impact.at && impact.at.type === "REORDER") {
    return impact.at.destination;
  }
  return null;
}
__name(tryGetDestination, "tryGetDestination");
function tryGetCombine(impact) {
  if (impact.at && impact.at.type === "COMBINE") {
    return impact.at.combine;
  }
  return null;
}
__name(tryGetCombine, "tryGetCombine");
var removeDraggableFromList = memoize_one_esm_default(function(remove, list) {
  return list.filter(function(item) {
    return item.descriptor.id !== remove.descriptor.id;
  });
});
var moveToNextCombine = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, draggable2 = _ref.draggable, destination = _ref.destination, insideDestination = _ref.insideDestination, previousImpact = _ref.previousImpact;
  if (!destination.isCombineEnabled) {
    return null;
  }
  var location = tryGetDestination(previousImpact);
  if (!location) {
    return null;
  }
  function getImpact(target) {
    var at = {
      type: "COMBINE",
      combine: {
        draggableId: target,
        droppableId: destination.descriptor.id
      }
    };
    return _extends({}, previousImpact, {
      at
    });
  }
  __name(getImpact, "getImpact");
  var all = previousImpact.displaced.all;
  var closestId = all.length ? all[0] : null;
  if (isMovingForward) {
    return closestId ? getImpact(closestId) : null;
  }
  var withoutDraggable = removeDraggableFromList(draggable2, insideDestination);
  if (!closestId) {
    if (!withoutDraggable.length) {
      return null;
    }
    var last = withoutDraggable[withoutDraggable.length - 1];
    return getImpact(last.descriptor.id);
  }
  var indexOfClosest = findIndex(withoutDraggable, function(d) {
    return d.descriptor.id === closestId;
  });
  !(indexOfClosest !== -1) ? true ? invariant2(false, "Could not find displaced item in set") : invariant2(false) : void 0;
  var proposedIndex = indexOfClosest - 1;
  if (proposedIndex < 0) {
    return null;
  }
  var before = withoutDraggable[proposedIndex];
  return getImpact(before.descriptor.id);
}, "moveToNextCombine");
var isHomeOf = /* @__PURE__ */ __name(function(draggable2, destination) {
  return draggable2.descriptor.droppableId === destination.descriptor.id;
}, "isHomeOf");
var noDisplacedBy = {
  point: origin,
  value: 0
};
var emptyGroups = {
  invisible: {},
  visible: {},
  all: []
};
var noImpact = {
  displaced: emptyGroups,
  displacedBy: noDisplacedBy,
  at: null
};
var isWithin = /* @__PURE__ */ __name(function(lowerBound, upperBound) {
  return function(value) {
    return lowerBound <= value && value <= upperBound;
  };
}, "isWithin");
var isPartiallyVisibleThroughFrame = /* @__PURE__ */ __name(function(frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);
  return function(subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
    if (isContained) {
      return true;
    }
    var isPartiallyVisibleVertically = isWithinVertical(subject.top) || isWithinVertical(subject.bottom);
    var isPartiallyVisibleHorizontally = isWithinHorizontal(subject.left) || isWithinHorizontal(subject.right);
    var isPartiallyContained = isPartiallyVisibleVertically && isPartiallyVisibleHorizontally;
    if (isPartiallyContained) {
      return true;
    }
    var isBiggerVertically = subject.top < frame.top && subject.bottom > frame.bottom;
    var isBiggerHorizontally = subject.left < frame.left && subject.right > frame.right;
    var isTargetBiggerThanFrame = isBiggerVertically && isBiggerHorizontally;
    if (isTargetBiggerThanFrame) {
      return true;
    }
    var isTargetBiggerOnOneAxis = isBiggerVertically && isPartiallyVisibleHorizontally || isBiggerHorizontally && isPartiallyVisibleVertically;
    return isTargetBiggerOnOneAxis;
  };
}, "isPartiallyVisibleThroughFrame");
var isTotallyVisibleThroughFrame = /* @__PURE__ */ __name(function(frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);
  return function(subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
    return isContained;
  };
}, "isTotallyVisibleThroughFrame");
var vertical = {
  direction: "vertical",
  line: "y",
  crossAxisLine: "x",
  start: "top",
  end: "bottom",
  size: "height",
  crossAxisStart: "left",
  crossAxisEnd: "right",
  crossAxisSize: "width"
};
var horizontal = {
  direction: "horizontal",
  line: "x",
  crossAxisLine: "y",
  start: "left",
  end: "right",
  size: "width",
  crossAxisStart: "top",
  crossAxisEnd: "bottom",
  crossAxisSize: "height"
};
var isTotallyVisibleThroughFrameOnAxis = /* @__PURE__ */ __name(function(axis) {
  return function(frame) {
    var isWithinVertical = isWithin(frame.top, frame.bottom);
    var isWithinHorizontal = isWithin(frame.left, frame.right);
    return function(subject) {
      if (axis === vertical) {
        return isWithinVertical(subject.top) && isWithinVertical(subject.bottom);
      }
      return isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
    };
  };
}, "isTotallyVisibleThroughFrameOnAxis");
var getDroppableDisplaced = /* @__PURE__ */ __name(function getDroppableDisplaced2(target, destination) {
  var displacement = destination.frame ? destination.frame.scroll.diff.displacement : origin;
  return offsetByPosition(target, displacement);
}, "getDroppableDisplaced");
var isVisibleInDroppable = /* @__PURE__ */ __name(function isVisibleInDroppable2(target, destination, isVisibleThroughFrameFn) {
  if (!destination.subject.active) {
    return false;
  }
  return isVisibleThroughFrameFn(destination.subject.active)(target);
}, "isVisibleInDroppable");
var isVisibleInViewport = /* @__PURE__ */ __name(function isVisibleInViewport2(target, viewport, isVisibleThroughFrameFn) {
  return isVisibleThroughFrameFn(viewport)(target);
}, "isVisibleInViewport");
var isVisible = /* @__PURE__ */ __name(function isVisible2(_ref) {
  var toBeDisplaced = _ref.target, destination = _ref.destination, viewport = _ref.viewport, withDroppableDisplacement2 = _ref.withDroppableDisplacement, isVisibleThroughFrameFn = _ref.isVisibleThroughFrameFn;
  var displacedTarget = withDroppableDisplacement2 ? getDroppableDisplaced(toBeDisplaced, destination) : toBeDisplaced;
  return isVisibleInDroppable(displacedTarget, destination, isVisibleThroughFrameFn) && isVisibleInViewport(displacedTarget, viewport, isVisibleThroughFrameFn);
}, "isVisible");
var isPartiallyVisible = /* @__PURE__ */ __name(function isPartiallyVisible2(args) {
  return isVisible(_extends({}, args, {
    isVisibleThroughFrameFn: isPartiallyVisibleThroughFrame
  }));
}, "isPartiallyVisible");
var isTotallyVisible = /* @__PURE__ */ __name(function isTotallyVisible2(args) {
  return isVisible(_extends({}, args, {
    isVisibleThroughFrameFn: isTotallyVisibleThroughFrame
  }));
}, "isTotallyVisible");
var isTotallyVisibleOnAxis = /* @__PURE__ */ __name(function isTotallyVisibleOnAxis2(args) {
  return isVisible(_extends({}, args, {
    isVisibleThroughFrameFn: isTotallyVisibleThroughFrameOnAxis(args.destination.axis)
  }));
}, "isTotallyVisibleOnAxis");
var getShouldAnimate = /* @__PURE__ */ __name(function getShouldAnimate2(id, last, forceShouldAnimate) {
  if (typeof forceShouldAnimate === "boolean") {
    return forceShouldAnimate;
  }
  if (!last) {
    return true;
  }
  var invisible = last.invisible, visible = last.visible;
  if (invisible[id]) {
    return false;
  }
  var previous = visible[id];
  return previous ? previous.shouldAnimate : true;
}, "getShouldAnimate");
function getTarget(draggable2, displacedBy) {
  var marginBox = draggable2.page.marginBox;
  var expandBy = {
    top: displacedBy.point.y,
    right: 0,
    bottom: 0,
    left: displacedBy.point.x
  };
  return getRect(expand(marginBox, expandBy));
}
__name(getTarget, "getTarget");
function getDisplacementGroups(_ref) {
  var afterDragging = _ref.afterDragging, destination = _ref.destination, displacedBy = _ref.displacedBy, viewport = _ref.viewport, forceShouldAnimate = _ref.forceShouldAnimate, last = _ref.last;
  return afterDragging.reduce(/* @__PURE__ */ __name(function process2(groups, draggable2) {
    var target = getTarget(draggable2, displacedBy);
    var id = draggable2.descriptor.id;
    groups.all.push(id);
    var isVisible3 = isPartiallyVisible({
      target,
      destination,
      viewport,
      withDroppableDisplacement: true
    });
    if (!isVisible3) {
      groups.invisible[draggable2.descriptor.id] = true;
      return groups;
    }
    var shouldAnimate = getShouldAnimate(id, last, forceShouldAnimate);
    var displacement = {
      draggableId: id,
      shouldAnimate
    };
    groups.visible[id] = displacement;
    return groups;
  }, "process"), {
    all: [],
    visible: {},
    invisible: {}
  });
}
__name(getDisplacementGroups, "getDisplacementGroups");
function getIndexOfLastItem(draggables, options) {
  if (!draggables.length) {
    return 0;
  }
  var indexOfLastItem = draggables[draggables.length - 1].descriptor.index;
  return options.inHomeList ? indexOfLastItem : indexOfLastItem + 1;
}
__name(getIndexOfLastItem, "getIndexOfLastItem");
function goAtEnd(_ref) {
  var insideDestination = _ref.insideDestination, inHomeList = _ref.inHomeList, displacedBy = _ref.displacedBy, destination = _ref.destination;
  var newIndex = getIndexOfLastItem(insideDestination, {
    inHomeList
  });
  return {
    displaced: emptyGroups,
    displacedBy,
    at: {
      type: "REORDER",
      destination: {
        droppableId: destination.descriptor.id,
        index: newIndex
      }
    }
  };
}
__name(goAtEnd, "goAtEnd");
function calculateReorderImpact(_ref2) {
  var draggable2 = _ref2.draggable, insideDestination = _ref2.insideDestination, destination = _ref2.destination, viewport = _ref2.viewport, displacedBy = _ref2.displacedBy, last = _ref2.last, index = _ref2.index, forceShouldAnimate = _ref2.forceShouldAnimate;
  var inHomeList = isHomeOf(draggable2, destination);
  if (index == null) {
    return goAtEnd({
      insideDestination,
      inHomeList,
      displacedBy,
      destination
    });
  }
  var match2 = find(insideDestination, function(item) {
    return item.descriptor.index === index;
  });
  if (!match2) {
    return goAtEnd({
      insideDestination,
      inHomeList,
      displacedBy,
      destination
    });
  }
  var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
  var sliceFrom = insideDestination.indexOf(match2);
  var impacted = withoutDragging.slice(sliceFrom);
  var displaced = getDisplacementGroups({
    afterDragging: impacted,
    destination,
    displacedBy,
    last,
    viewport: viewport.frame,
    forceShouldAnimate
  });
  return {
    displaced,
    displacedBy,
    at: {
      type: "REORDER",
      destination: {
        droppableId: destination.descriptor.id,
        index
      }
    }
  };
}
__name(calculateReorderImpact, "calculateReorderImpact");
function didStartAfterCritical(draggableId, afterCritical) {
  return Boolean(afterCritical.effected[draggableId]);
}
__name(didStartAfterCritical, "didStartAfterCritical");
var fromCombine = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, destination = _ref.destination, draggables = _ref.draggables, combine2 = _ref.combine, afterCritical = _ref.afterCritical;
  if (!destination.isCombineEnabled) {
    return null;
  }
  var combineId = combine2.draggableId;
  var combineWith = draggables[combineId];
  var combineWithIndex = combineWith.descriptor.index;
  var didCombineWithStartAfterCritical = didStartAfterCritical(combineId, afterCritical);
  if (didCombineWithStartAfterCritical) {
    if (isMovingForward) {
      return combineWithIndex;
    }
    return combineWithIndex - 1;
  }
  if (isMovingForward) {
    return combineWithIndex + 1;
  }
  return combineWithIndex;
}, "fromCombine");
var fromReorder = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, isInHomeList = _ref.isInHomeList, insideDestination = _ref.insideDestination, location = _ref.location;
  if (!insideDestination.length) {
    return null;
  }
  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
  var firstIndex = insideDestination[0].descriptor.index;
  var lastIndex = insideDestination[insideDestination.length - 1].descriptor.index;
  var upperBound = isInHomeList ? lastIndex : lastIndex + 1;
  if (proposedIndex < firstIndex) {
    return null;
  }
  if (proposedIndex > upperBound) {
    return null;
  }
  return proposedIndex;
}, "fromReorder");
var moveToNextIndex = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, isInHomeList = _ref.isInHomeList, draggable2 = _ref.draggable, draggables = _ref.draggables, destination = _ref.destination, insideDestination = _ref.insideDestination, previousImpact = _ref.previousImpact, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  var wasAt = previousImpact.at;
  !wasAt ? true ? invariant2(false, "Cannot move in direction without previous impact location") : invariant2(false) : void 0;
  if (wasAt.type === "REORDER") {
    var _newIndex = fromReorder({
      isMovingForward,
      isInHomeList,
      location: wasAt.destination,
      insideDestination
    });
    if (_newIndex == null) {
      return null;
    }
    return calculateReorderImpact({
      draggable: draggable2,
      insideDestination,
      destination,
      viewport,
      last: previousImpact.displaced,
      displacedBy: previousImpact.displacedBy,
      index: _newIndex
    });
  }
  var newIndex = fromCombine({
    isMovingForward,
    destination,
    displaced: previousImpact.displaced,
    draggables,
    combine: wasAt.combine,
    afterCritical
  });
  if (newIndex == null) {
    return null;
  }
  return calculateReorderImpact({
    draggable: draggable2,
    insideDestination,
    destination,
    viewport,
    last: previousImpact.displaced,
    displacedBy: previousImpact.displacedBy,
    index: newIndex
  });
}, "moveToNextIndex");
var getCombinedItemDisplacement = /* @__PURE__ */ __name(function(_ref) {
  var displaced = _ref.displaced, afterCritical = _ref.afterCritical, combineWith = _ref.combineWith, displacedBy = _ref.displacedBy;
  var isDisplaced = Boolean(displaced.visible[combineWith] || displaced.invisible[combineWith]);
  if (didStartAfterCritical(combineWith, afterCritical)) {
    return isDisplaced ? origin : negate(displacedBy.point);
  }
  return isDisplaced ? displacedBy.point : origin;
}, "getCombinedItemDisplacement");
var whenCombining = /* @__PURE__ */ __name(function(_ref) {
  var afterCritical = _ref.afterCritical, impact = _ref.impact, draggables = _ref.draggables;
  var combine2 = tryGetCombine(impact);
  !combine2 ? true ? invariant2(false) : invariant2(false) : void 0;
  var combineWith = combine2.draggableId;
  var center = draggables[combineWith].page.borderBox.center;
  var displaceBy = getCombinedItemDisplacement({
    displaced: impact.displaced,
    afterCritical,
    combineWith,
    displacedBy: impact.displacedBy
  });
  return add(center, displaceBy);
}, "whenCombining");
var distanceFromStartToBorderBoxCenter = /* @__PURE__ */ __name(function distanceFromStartToBorderBoxCenter2(axis, box) {
  return box.margin[axis.start] + box.borderBox[axis.size] / 2;
}, "distanceFromStartToBorderBoxCenter");
var distanceFromEndToBorderBoxCenter = /* @__PURE__ */ __name(function distanceFromEndToBorderBoxCenter2(axis, box) {
  return box.margin[axis.end] + box.borderBox[axis.size] / 2;
}, "distanceFromEndToBorderBoxCenter");
var getCrossAxisBorderBoxCenter = /* @__PURE__ */ __name(function getCrossAxisBorderBoxCenter2(axis, target, isMoving) {
  return target[axis.crossAxisStart] + isMoving.margin[axis.crossAxisStart] + isMoving.borderBox[axis.crossAxisSize] / 2;
}, "getCrossAxisBorderBoxCenter");
var goAfter = /* @__PURE__ */ __name(function goAfter2(_ref) {
  var axis = _ref.axis, moveRelativeTo = _ref.moveRelativeTo, isMoving = _ref.isMoving;
  return patch(axis.line, moveRelativeTo.marginBox[axis.end] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
}, "goAfter");
var goBefore = /* @__PURE__ */ __name(function goBefore2(_ref2) {
  var axis = _ref2.axis, moveRelativeTo = _ref2.moveRelativeTo, isMoving = _ref2.isMoving;
  return patch(axis.line, moveRelativeTo.marginBox[axis.start] - distanceFromEndToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
}, "goBefore");
var goIntoStart = /* @__PURE__ */ __name(function goIntoStart2(_ref3) {
  var axis = _ref3.axis, moveInto = _ref3.moveInto, isMoving = _ref3.isMoving;
  return patch(axis.line, moveInto.contentBox[axis.start] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveInto.contentBox, isMoving));
}, "goIntoStart");
var whenReordering = /* @__PURE__ */ __name(function(_ref) {
  var impact = _ref.impact, draggable2 = _ref.draggable, draggables = _ref.draggables, droppable2 = _ref.droppable, afterCritical = _ref.afterCritical;
  var insideDestination = getDraggablesInsideDroppable(droppable2.descriptor.id, draggables);
  var draggablePage = draggable2.page;
  var axis = droppable2.axis;
  if (!insideDestination.length) {
    return goIntoStart({
      axis,
      moveInto: droppable2.page,
      isMoving: draggablePage
    });
  }
  var displaced = impact.displaced, displacedBy = impact.displacedBy;
  var closestAfter = displaced.all[0];
  if (closestAfter) {
    var closest3 = draggables[closestAfter];
    if (didStartAfterCritical(closestAfter, afterCritical)) {
      return goBefore({
        axis,
        moveRelativeTo: closest3.page,
        isMoving: draggablePage
      });
    }
    var withDisplacement = offset(closest3.page, displacedBy.point);
    return goBefore({
      axis,
      moveRelativeTo: withDisplacement,
      isMoving: draggablePage
    });
  }
  var last = insideDestination[insideDestination.length - 1];
  if (last.descriptor.id === draggable2.descriptor.id) {
    return draggablePage.borderBox.center;
  }
  if (didStartAfterCritical(last.descriptor.id, afterCritical)) {
    var page = offset(last.page, negate(afterCritical.displacedBy.point));
    return goAfter({
      axis,
      moveRelativeTo: page,
      isMoving: draggablePage
    });
  }
  return goAfter({
    axis,
    moveRelativeTo: last.page,
    isMoving: draggablePage
  });
}, "whenReordering");
var withDroppableDisplacement = /* @__PURE__ */ __name(function(droppable2, point) {
  var frame = droppable2.frame;
  if (!frame) {
    return point;
  }
  return add(point, frame.scroll.diff.displacement);
}, "withDroppableDisplacement");
var getResultWithoutDroppableDisplacement = /* @__PURE__ */ __name(function getResultWithoutDroppableDisplacement2(_ref) {
  var impact = _ref.impact, draggable2 = _ref.draggable, droppable2 = _ref.droppable, draggables = _ref.draggables, afterCritical = _ref.afterCritical;
  var original = draggable2.page.borderBox.center;
  var at = impact.at;
  if (!droppable2) {
    return original;
  }
  if (!at) {
    return original;
  }
  if (at.type === "REORDER") {
    return whenReordering({
      impact,
      draggable: draggable2,
      draggables,
      droppable: droppable2,
      afterCritical
    });
  }
  return whenCombining({
    impact,
    draggables,
    afterCritical
  });
}, "getResultWithoutDroppableDisplacement");
var getPageBorderBoxCenterFromImpact = /* @__PURE__ */ __name(function(args) {
  var withoutDisplacement = getResultWithoutDroppableDisplacement(args);
  var droppable2 = args.droppable;
  var withDisplacement = droppable2 ? withDroppableDisplacement(droppable2, withoutDisplacement) : withoutDisplacement;
  return withDisplacement;
}, "getPageBorderBoxCenterFromImpact");
var scrollViewport = /* @__PURE__ */ __name(function(viewport, newScroll) {
  var diff = subtract(newScroll, viewport.scroll.initial);
  var displacement = negate(diff);
  var frame = getRect({
    top: newScroll.y,
    bottom: newScroll.y + viewport.frame.height,
    left: newScroll.x,
    right: newScroll.x + viewport.frame.width
  });
  var updated = {
    frame,
    scroll: {
      initial: viewport.scroll.initial,
      max: viewport.scroll.max,
      current: newScroll,
      diff: {
        value: diff,
        displacement
      }
    }
  };
  return updated;
}, "scrollViewport");
function getDraggables(ids, draggables) {
  return ids.map(function(id) {
    return draggables[id];
  });
}
__name(getDraggables, "getDraggables");
function tryGetVisible(id, groups) {
  for (var i = 0; i < groups.length; i++) {
    var displacement = groups[i].visible[id];
    if (displacement) {
      return displacement;
    }
  }
  return null;
}
__name(tryGetVisible, "tryGetVisible");
var speculativelyIncrease = /* @__PURE__ */ __name(function(_ref) {
  var impact = _ref.impact, viewport = _ref.viewport, destination = _ref.destination, draggables = _ref.draggables, maxScrollChange = _ref.maxScrollChange;
  var scrolledViewport = scrollViewport(viewport, add(viewport.scroll.current, maxScrollChange));
  var scrolledDroppable = destination.frame ? scrollDroppable(destination, add(destination.frame.scroll.current, maxScrollChange)) : destination;
  var last = impact.displaced;
  var withViewportScroll = getDisplacementGroups({
    afterDragging: getDraggables(last.all, draggables),
    destination,
    displacedBy: impact.displacedBy,
    viewport: scrolledViewport.frame,
    last,
    forceShouldAnimate: false
  });
  var withDroppableScroll2 = getDisplacementGroups({
    afterDragging: getDraggables(last.all, draggables),
    destination: scrolledDroppable,
    displacedBy: impact.displacedBy,
    viewport: viewport.frame,
    last,
    forceShouldAnimate: false
  });
  var invisible = {};
  var visible = {};
  var groups = [last, withViewportScroll, withDroppableScroll2];
  last.all.forEach(function(id) {
    var displacement = tryGetVisible(id, groups);
    if (displacement) {
      visible[id] = displacement;
      return;
    }
    invisible[id] = true;
  });
  var newImpact = _extends({}, impact, {
    displaced: {
      all: last.all,
      invisible,
      visible
    }
  });
  return newImpact;
}, "speculativelyIncrease");
var withViewportDisplacement = /* @__PURE__ */ __name(function(viewport, point) {
  return add(viewport.scroll.diff.displacement, point);
}, "withViewportDisplacement");
var getClientFromPageBorderBoxCenter = /* @__PURE__ */ __name(function(_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter, draggable2 = _ref.draggable, viewport = _ref.viewport;
  var withoutPageScrollChange = withViewportDisplacement(viewport, pageBorderBoxCenter);
  var offset3 = subtract(withoutPageScrollChange, draggable2.page.borderBox.center);
  return add(draggable2.client.borderBox.center, offset3);
}, "getClientFromPageBorderBoxCenter");
var isTotallyVisibleInNewLocation = /* @__PURE__ */ __name(function(_ref) {
  var draggable2 = _ref.draggable, destination = _ref.destination, newPageBorderBoxCenter = _ref.newPageBorderBoxCenter, viewport = _ref.viewport, withDroppableDisplacement2 = _ref.withDroppableDisplacement, _ref$onlyOnMainAxis = _ref.onlyOnMainAxis, onlyOnMainAxis = _ref$onlyOnMainAxis === void 0 ? false : _ref$onlyOnMainAxis;
  var changeNeeded = subtract(newPageBorderBoxCenter, draggable2.page.borderBox.center);
  var shifted = offsetByPosition(draggable2.page.borderBox, changeNeeded);
  var args = {
    target: shifted,
    destination,
    withDroppableDisplacement: withDroppableDisplacement2,
    viewport
  };
  return onlyOnMainAxis ? isTotallyVisibleOnAxis(args) : isTotallyVisible(args);
}, "isTotallyVisibleInNewLocation");
var moveToNextPlace = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, draggable2 = _ref.draggable, destination = _ref.destination, draggables = _ref.draggables, previousImpact = _ref.previousImpact, viewport = _ref.viewport, previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, previousClientSelection = _ref.previousClientSelection, afterCritical = _ref.afterCritical;
  if (!destination.isEnabled) {
    return null;
  }
  var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
  var isInHomeList = isHomeOf(draggable2, destination);
  var impact = moveToNextCombine({
    isMovingForward,
    draggable: draggable2,
    destination,
    insideDestination,
    previousImpact
  }) || moveToNextIndex({
    isMovingForward,
    isInHomeList,
    draggable: draggable2,
    draggables,
    destination,
    insideDestination,
    previousImpact,
    viewport,
    afterCritical
  });
  if (!impact) {
    return null;
  }
  var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
    impact,
    draggable: draggable2,
    droppable: destination,
    draggables,
    afterCritical
  });
  var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
    draggable: draggable2,
    destination,
    newPageBorderBoxCenter: pageBorderBoxCenter,
    viewport: viewport.frame,
    withDroppableDisplacement: false,
    onlyOnMainAxis: true
  });
  if (isVisibleInNewLocation) {
    var clientSelection = getClientFromPageBorderBoxCenter({
      pageBorderBoxCenter,
      draggable: draggable2,
      viewport
    });
    return {
      clientSelection,
      impact,
      scrollJumpRequest: null
    };
  }
  var distance3 = subtract(pageBorderBoxCenter, previousPageBorderBoxCenter);
  var cautious = speculativelyIncrease({
    impact,
    viewport,
    destination,
    draggables,
    maxScrollChange: distance3
  });
  return {
    clientSelection: previousClientSelection,
    impact: cautious,
    scrollJumpRequest: distance3
  };
}, "moveToNextPlace");
var getKnownActive = /* @__PURE__ */ __name(function getKnownActive2(droppable2) {
  var rect = droppable2.subject.active;
  !rect ? true ? invariant2(false, "Cannot get clipped area from droppable") : invariant2(false) : void 0;
  return rect;
}, "getKnownActive");
var getBestCrossAxisDroppable = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, pageBorderBoxCenter = _ref.pageBorderBoxCenter, source = _ref.source, droppables = _ref.droppables, viewport = _ref.viewport;
  var active = source.subject.active;
  if (!active) {
    return null;
  }
  var axis = source.axis;
  var isBetweenSourceClipped = isWithin(active[axis.start], active[axis.end]);
  var candidates = toDroppableList(droppables).filter(function(droppable2) {
    return droppable2 !== source;
  }).filter(function(droppable2) {
    return droppable2.isEnabled;
  }).filter(function(droppable2) {
    return Boolean(droppable2.subject.active);
  }).filter(function(droppable2) {
    return isPartiallyVisibleThroughFrame(viewport.frame)(getKnownActive(droppable2));
  }).filter(function(droppable2) {
    var activeOfTarget = getKnownActive(droppable2);
    if (isMovingForward) {
      return active[axis.crossAxisEnd] < activeOfTarget[axis.crossAxisEnd];
    }
    return activeOfTarget[axis.crossAxisStart] < active[axis.crossAxisStart];
  }).filter(function(droppable2) {
    var activeOfTarget = getKnownActive(droppable2);
    var isBetweenDestinationClipped = isWithin(activeOfTarget[axis.start], activeOfTarget[axis.end]);
    return isBetweenSourceClipped(activeOfTarget[axis.start]) || isBetweenSourceClipped(activeOfTarget[axis.end]) || isBetweenDestinationClipped(active[axis.start]) || isBetweenDestinationClipped(active[axis.end]);
  }).sort(function(a, b) {
    var first = getKnownActive(a)[axis.crossAxisStart];
    var second = getKnownActive(b)[axis.crossAxisStart];
    if (isMovingForward) {
      return first - second;
    }
    return second - first;
  }).filter(function(droppable2, index, array) {
    return getKnownActive(droppable2)[axis.crossAxisStart] === getKnownActive(array[0])[axis.crossAxisStart];
  });
  if (!candidates.length) {
    return null;
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  var contains = candidates.filter(function(droppable2) {
    var isWithinDroppable = isWithin(getKnownActive(droppable2)[axis.start], getKnownActive(droppable2)[axis.end]);
    return isWithinDroppable(pageBorderBoxCenter[axis.line]);
  });
  if (contains.length === 1) {
    return contains[0];
  }
  if (contains.length > 1) {
    return contains.sort(function(a, b) {
      return getKnownActive(a)[axis.start] - getKnownActive(b)[axis.start];
    })[0];
  }
  return candidates.sort(function(a, b) {
    var first = closest(pageBorderBoxCenter, getCorners(getKnownActive(a)));
    var second = closest(pageBorderBoxCenter, getCorners(getKnownActive(b)));
    if (first !== second) {
      return first - second;
    }
    return getKnownActive(a)[axis.start] - getKnownActive(b)[axis.start];
  })[0];
}, "getBestCrossAxisDroppable");
var getCurrentPageBorderBoxCenter = /* @__PURE__ */ __name(function getCurrentPageBorderBoxCenter2(draggable2, afterCritical) {
  var original = draggable2.page.borderBox.center;
  return didStartAfterCritical(draggable2.descriptor.id, afterCritical) ? subtract(original, afterCritical.displacedBy.point) : original;
}, "getCurrentPageBorderBoxCenter");
var getCurrentPageBorderBox = /* @__PURE__ */ __name(function getCurrentPageBorderBox2(draggable2, afterCritical) {
  var original = draggable2.page.borderBox;
  return didStartAfterCritical(draggable2.descriptor.id, afterCritical) ? offsetByPosition(original, negate(afterCritical.displacedBy.point)) : original;
}, "getCurrentPageBorderBox");
var getClosestDraggable = /* @__PURE__ */ __name(function(_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter, viewport = _ref.viewport, destination = _ref.destination, insideDestination = _ref.insideDestination, afterCritical = _ref.afterCritical;
  var sorted = insideDestination.filter(function(draggable2) {
    return isTotallyVisible({
      target: getCurrentPageBorderBox(draggable2, afterCritical),
      destination,
      viewport: viewport.frame,
      withDroppableDisplacement: true
    });
  }).sort(function(a, b) {
    var distanceToA = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(a, afterCritical)));
    var distanceToB = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(b, afterCritical)));
    if (distanceToA < distanceToB) {
      return -1;
    }
    if (distanceToB < distanceToA) {
      return 1;
    }
    return a.descriptor.index - b.descriptor.index;
  });
  return sorted[0] || null;
}, "getClosestDraggable");
var getDisplacedBy = memoize_one_esm_default(/* @__PURE__ */ __name(function getDisplacedBy2(axis, displaceBy) {
  var displacement = displaceBy[axis.line];
  return {
    value: displacement,
    point: patch(axis.line, displacement)
  };
}, "getDisplacedBy"));
var getRequiredGrowthForPlaceholder = /* @__PURE__ */ __name(function getRequiredGrowthForPlaceholder2(droppable2, placeholderSize, draggables) {
  var axis = droppable2.axis;
  if (droppable2.descriptor.mode === "virtual") {
    return patch(axis.line, placeholderSize[axis.line]);
  }
  var availableSpace = droppable2.subject.page.contentBox[axis.size];
  var insideDroppable = getDraggablesInsideDroppable(droppable2.descriptor.id, draggables);
  var spaceUsed = insideDroppable.reduce(function(sum, dimension) {
    return sum + dimension.client.marginBox[axis.size];
  }, 0);
  var requiredSpace = spaceUsed + placeholderSize[axis.line];
  var needsToGrowBy = requiredSpace - availableSpace;
  if (needsToGrowBy <= 0) {
    return null;
  }
  return patch(axis.line, needsToGrowBy);
}, "getRequiredGrowthForPlaceholder");
var withMaxScroll = /* @__PURE__ */ __name(function withMaxScroll2(frame, max) {
  return _extends({}, frame, {
    scroll: _extends({}, frame.scroll, {
      max
    })
  });
}, "withMaxScroll");
var addPlaceholder = /* @__PURE__ */ __name(function addPlaceholder2(droppable2, draggable2, draggables) {
  var frame = droppable2.frame;
  !!isHomeOf(draggable2, droppable2) ? true ? invariant2(false, "Should not add placeholder space to home list") : invariant2(false) : void 0;
  !!droppable2.subject.withPlaceholder ? true ? invariant2(false, "Cannot add placeholder size to a subject when it already has one") : invariant2(false) : void 0;
  var placeholderSize = getDisplacedBy(droppable2.axis, draggable2.displaceBy).point;
  var requiredGrowth = getRequiredGrowthForPlaceholder(droppable2, placeholderSize, draggables);
  var added = {
    placeholderSize,
    increasedBy: requiredGrowth,
    oldFrameMaxScroll: droppable2.frame ? droppable2.frame.scroll.max : null
  };
  if (!frame) {
    var _subject = getSubject({
      page: droppable2.subject.page,
      withPlaceholder: added,
      axis: droppable2.axis,
      frame: droppable2.frame
    });
    return _extends({}, droppable2, {
      subject: _subject
    });
  }
  var maxScroll = requiredGrowth ? add(frame.scroll.max, requiredGrowth) : frame.scroll.max;
  var newFrame = withMaxScroll(frame, maxScroll);
  var subject = getSubject({
    page: droppable2.subject.page,
    withPlaceholder: added,
    axis: droppable2.axis,
    frame: newFrame
  });
  return _extends({}, droppable2, {
    subject,
    frame: newFrame
  });
}, "addPlaceholder");
var removePlaceholder = /* @__PURE__ */ __name(function removePlaceholder2(droppable2) {
  var added = droppable2.subject.withPlaceholder;
  !added ? true ? invariant2(false, "Cannot remove placeholder form subject when there was none") : invariant2(false) : void 0;
  var frame = droppable2.frame;
  if (!frame) {
    var _subject2 = getSubject({
      page: droppable2.subject.page,
      axis: droppable2.axis,
      frame: null,
      withPlaceholder: null
    });
    return _extends({}, droppable2, {
      subject: _subject2
    });
  }
  var oldMaxScroll = added.oldFrameMaxScroll;
  !oldMaxScroll ? true ? invariant2(false, "Expected droppable with frame to have old max frame scroll when removing placeholder") : invariant2(false) : void 0;
  var newFrame = withMaxScroll(frame, oldMaxScroll);
  var subject = getSubject({
    page: droppable2.subject.page,
    axis: droppable2.axis,
    frame: newFrame,
    withPlaceholder: null
  });
  return _extends({}, droppable2, {
    subject,
    frame: newFrame
  });
}, "removePlaceholder");
var moveToNewDroppable = /* @__PURE__ */ __name(function(_ref) {
  var previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, moveRelativeTo = _ref.moveRelativeTo, insideDestination = _ref.insideDestination, draggable2 = _ref.draggable, draggables = _ref.draggables, destination = _ref.destination, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  if (!moveRelativeTo) {
    if (insideDestination.length) {
      return null;
    }
    var proposed = {
      displaced: emptyGroups,
      displacedBy: noDisplacedBy,
      at: {
        type: "REORDER",
        destination: {
          droppableId: destination.descriptor.id,
          index: 0
        }
      }
    };
    var proposedPageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
      impact: proposed,
      draggable: draggable2,
      droppable: destination,
      draggables,
      afterCritical
    });
    var withPlaceholder = isHomeOf(draggable2, destination) ? destination : addPlaceholder(destination, draggable2, draggables);
    var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
      draggable: draggable2,
      destination: withPlaceholder,
      newPageBorderBoxCenter: proposedPageBorderBoxCenter,
      viewport: viewport.frame,
      withDroppableDisplacement: false,
      onlyOnMainAxis: true
    });
    return isVisibleInNewLocation ? proposed : null;
  }
  var isGoingBeforeTarget = Boolean(previousPageBorderBoxCenter[destination.axis.line] <= moveRelativeTo.page.borderBox.center[destination.axis.line]);
  var proposedIndex = function() {
    var relativeTo = moveRelativeTo.descriptor.index;
    if (moveRelativeTo.descriptor.id === draggable2.descriptor.id) {
      return relativeTo;
    }
    if (isGoingBeforeTarget) {
      return relativeTo;
    }
    return relativeTo + 1;
  }();
  var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
  return calculateReorderImpact({
    draggable: draggable2,
    insideDestination,
    destination,
    viewport,
    displacedBy,
    last: emptyGroups,
    index: proposedIndex
  });
}, "moveToNewDroppable");
var moveCrossAxis = /* @__PURE__ */ __name(function(_ref) {
  var isMovingForward = _ref.isMovingForward, previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, draggable2 = _ref.draggable, isOver = _ref.isOver, draggables = _ref.draggables, droppables = _ref.droppables, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  var destination = getBestCrossAxisDroppable({
    isMovingForward,
    pageBorderBoxCenter: previousPageBorderBoxCenter,
    source: isOver,
    droppables,
    viewport
  });
  if (!destination) {
    return null;
  }
  var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
  var moveRelativeTo = getClosestDraggable({
    pageBorderBoxCenter: previousPageBorderBoxCenter,
    viewport,
    destination,
    insideDestination,
    afterCritical
  });
  var impact = moveToNewDroppable({
    previousPageBorderBoxCenter,
    destination,
    draggable: draggable2,
    draggables,
    moveRelativeTo,
    insideDestination,
    viewport,
    afterCritical
  });
  if (!impact) {
    return null;
  }
  var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
    impact,
    draggable: draggable2,
    droppable: destination,
    draggables,
    afterCritical
  });
  var clientSelection = getClientFromPageBorderBoxCenter({
    pageBorderBoxCenter,
    draggable: draggable2,
    viewport
  });
  return {
    clientSelection,
    impact,
    scrollJumpRequest: null
  };
}, "moveCrossAxis");
var whatIsDraggedOver = /* @__PURE__ */ __name(function(impact) {
  var at = impact.at;
  if (!at) {
    return null;
  }
  if (at.type === "REORDER") {
    return at.destination.droppableId;
  }
  return at.combine.droppableId;
}, "whatIsDraggedOver");
var getDroppableOver = /* @__PURE__ */ __name(function getDroppableOver2(impact, droppables) {
  var id = whatIsDraggedOver(impact);
  return id ? droppables[id] : null;
}, "getDroppableOver");
var moveInDirection = /* @__PURE__ */ __name(function(_ref) {
  var state = _ref.state, type = _ref.type;
  var isActuallyOver = getDroppableOver(state.impact, state.dimensions.droppables);
  var isMainAxisMovementAllowed = Boolean(isActuallyOver);
  var home2 = state.dimensions.droppables[state.critical.droppable.id];
  var isOver = isActuallyOver || home2;
  var direction = isOver.axis.direction;
  var isMovingOnMainAxis = direction === "vertical" && (type === "MOVE_UP" || type === "MOVE_DOWN") || direction === "horizontal" && (type === "MOVE_LEFT" || type === "MOVE_RIGHT");
  if (isMovingOnMainAxis && !isMainAxisMovementAllowed) {
    return null;
  }
  var isMovingForward = type === "MOVE_DOWN" || type === "MOVE_RIGHT";
  var draggable2 = state.dimensions.draggables[state.critical.draggable.id];
  var previousPageBorderBoxCenter = state.current.page.borderBoxCenter;
  var _state$dimensions = state.dimensions, draggables = _state$dimensions.draggables, droppables = _state$dimensions.droppables;
  return isMovingOnMainAxis ? moveToNextPlace({
    isMovingForward,
    previousPageBorderBoxCenter,
    draggable: draggable2,
    destination: isOver,
    draggables,
    viewport: state.viewport,
    previousClientSelection: state.current.client.selection,
    previousImpact: state.impact,
    afterCritical: state.afterCritical
  }) : moveCrossAxis({
    isMovingForward,
    previousPageBorderBoxCenter,
    draggable: draggable2,
    isOver,
    draggables,
    droppables,
    viewport: state.viewport,
    afterCritical: state.afterCritical
  });
}, "moveInDirection");
function isMovementAllowed(state) {
  return state.phase === "DRAGGING" || state.phase === "COLLECTING";
}
__name(isMovementAllowed, "isMovementAllowed");
function isPositionInFrame(frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);
  return /* @__PURE__ */ __name(function run(point) {
    return isWithinVertical(point.y) && isWithinHorizontal(point.x);
  }, "run");
}
__name(isPositionInFrame, "isPositionInFrame");
function getHasOverlap(first, second) {
  return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}
__name(getHasOverlap, "getHasOverlap");
function getFurthestAway(_ref) {
  var pageBorderBox = _ref.pageBorderBox, draggable2 = _ref.draggable, candidates = _ref.candidates;
  var startCenter = draggable2.page.borderBox.center;
  var sorted = candidates.map(function(candidate) {
    var axis = candidate.axis;
    var target = patch(candidate.axis.line, pageBorderBox.center[axis.line], candidate.page.borderBox.center[axis.crossAxisLine]);
    return {
      id: candidate.descriptor.id,
      distance: distance(startCenter, target)
    };
  }).sort(function(a, b) {
    return b.distance - a.distance;
  });
  return sorted[0] ? sorted[0].id : null;
}
__name(getFurthestAway, "getFurthestAway");
function getDroppableOver$1(_ref2) {
  var pageBorderBox = _ref2.pageBorderBox, draggable2 = _ref2.draggable, droppables = _ref2.droppables;
  var candidates = toDroppableList(droppables).filter(function(item) {
    if (!item.isEnabled) {
      return false;
    }
    var active = item.subject.active;
    if (!active) {
      return false;
    }
    if (!getHasOverlap(pageBorderBox, active)) {
      return false;
    }
    if (isPositionInFrame(active)(pageBorderBox.center)) {
      return true;
    }
    var axis = item.axis;
    var childCenter = active.center[axis.crossAxisLine];
    var crossAxisStart = pageBorderBox[axis.crossAxisStart];
    var crossAxisEnd = pageBorderBox[axis.crossAxisEnd];
    var isContained = isWithin(active[axis.crossAxisStart], active[axis.crossAxisEnd]);
    var isStartContained = isContained(crossAxisStart);
    var isEndContained = isContained(crossAxisEnd);
    if (!isStartContained && !isEndContained) {
      return true;
    }
    if (isStartContained) {
      return crossAxisStart < childCenter;
    }
    return crossAxisEnd > childCenter;
  });
  if (!candidates.length) {
    return null;
  }
  if (candidates.length === 1) {
    return candidates[0].descriptor.id;
  }
  return getFurthestAway({
    pageBorderBox,
    draggable: draggable2,
    candidates
  });
}
__name(getDroppableOver$1, "getDroppableOver$1");
var offsetRectByPosition = /* @__PURE__ */ __name(function offsetRectByPosition2(rect, point) {
  return getRect(offsetByPosition(rect, point));
}, "offsetRectByPosition");
var withDroppableScroll = /* @__PURE__ */ __name(function(droppable2, area) {
  var frame = droppable2.frame;
  if (!frame) {
    return area;
  }
  return offsetRectByPosition(area, frame.scroll.diff.value);
}, "withDroppableScroll");
function getIsDisplaced(_ref) {
  var displaced = _ref.displaced, id = _ref.id;
  return Boolean(displaced.visible[id] || displaced.invisible[id]);
}
__name(getIsDisplaced, "getIsDisplaced");
function atIndex(_ref) {
  var draggable2 = _ref.draggable, closest3 = _ref.closest, inHomeList = _ref.inHomeList;
  if (!closest3) {
    return null;
  }
  if (!inHomeList) {
    return closest3.descriptor.index;
  }
  if (closest3.descriptor.index > draggable2.descriptor.index) {
    return closest3.descriptor.index - 1;
  }
  return closest3.descriptor.index;
}
__name(atIndex, "atIndex");
var getReorderImpact = /* @__PURE__ */ __name(function(_ref2) {
  var targetRect = _ref2.pageBorderBoxWithDroppableScroll, draggable2 = _ref2.draggable, destination = _ref2.destination, insideDestination = _ref2.insideDestination, last = _ref2.last, viewport = _ref2.viewport, afterCritical = _ref2.afterCritical;
  var axis = destination.axis;
  var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
  var displacement = displacedBy.value;
  var targetStart = targetRect[axis.start];
  var targetEnd = targetRect[axis.end];
  var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
  var closest3 = find(withoutDragging, function(child) {
    var id = child.descriptor.id;
    var childCenter = child.page.borderBox.center[axis.line];
    var didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
    var isDisplaced = getIsDisplaced({
      displaced: last,
      id
    });
    if (didStartAfterCritical$1) {
      if (isDisplaced) {
        return targetEnd <= childCenter;
      }
      return targetStart < childCenter - displacement;
    }
    if (isDisplaced) {
      return targetEnd <= childCenter + displacement;
    }
    return targetStart < childCenter;
  });
  var newIndex = atIndex({
    draggable: draggable2,
    closest: closest3,
    inHomeList: isHomeOf(draggable2, destination)
  });
  return calculateReorderImpact({
    draggable: draggable2,
    insideDestination,
    destination,
    viewport,
    last,
    displacedBy,
    index: newIndex
  });
}, "getReorderImpact");
var combineThresholdDivisor = 4;
var getCombineImpact = /* @__PURE__ */ __name(function(_ref) {
  var draggable2 = _ref.draggable, targetRect = _ref.pageBorderBoxWithDroppableScroll, previousImpact = _ref.previousImpact, destination = _ref.destination, insideDestination = _ref.insideDestination, afterCritical = _ref.afterCritical;
  if (!destination.isCombineEnabled) {
    return null;
  }
  var axis = destination.axis;
  var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
  var displacement = displacedBy.value;
  var targetStart = targetRect[axis.start];
  var targetEnd = targetRect[axis.end];
  var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
  var combineWith = find(withoutDragging, function(child) {
    var id = child.descriptor.id;
    var childRect = child.page.borderBox;
    var childSize = childRect[axis.size];
    var threshold = childSize / combineThresholdDivisor;
    var didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
    var isDisplaced = getIsDisplaced({
      displaced: previousImpact.displaced,
      id
    });
    if (didStartAfterCritical$1) {
      if (isDisplaced) {
        return targetEnd > childRect[axis.start] + threshold && targetEnd < childRect[axis.end] - threshold;
      }
      return targetStart > childRect[axis.start] - displacement + threshold && targetStart < childRect[axis.end] - displacement - threshold;
    }
    if (isDisplaced) {
      return targetEnd > childRect[axis.start] + displacement + threshold && targetEnd < childRect[axis.end] + displacement - threshold;
    }
    return targetStart > childRect[axis.start] + threshold && targetStart < childRect[axis.end] - threshold;
  });
  if (!combineWith) {
    return null;
  }
  var impact = {
    displacedBy,
    displaced: previousImpact.displaced,
    at: {
      type: "COMBINE",
      combine: {
        draggableId: combineWith.descriptor.id,
        droppableId: destination.descriptor.id
      }
    }
  };
  return impact;
}, "getCombineImpact");
var getDragImpact = /* @__PURE__ */ __name(function(_ref) {
  var pageOffset = _ref.pageOffset, draggable2 = _ref.draggable, draggables = _ref.draggables, droppables = _ref.droppables, previousImpact = _ref.previousImpact, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  var pageBorderBox = offsetRectByPosition(draggable2.page.borderBox, pageOffset);
  var destinationId = getDroppableOver$1({
    pageBorderBox,
    draggable: draggable2,
    droppables
  });
  if (!destinationId) {
    return noImpact;
  }
  var destination = droppables[destinationId];
  var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
  var pageBorderBoxWithDroppableScroll = withDroppableScroll(destination, pageBorderBox);
  return getCombineImpact({
    pageBorderBoxWithDroppableScroll,
    draggable: draggable2,
    previousImpact,
    destination,
    insideDestination,
    afterCritical
  }) || getReorderImpact({
    pageBorderBoxWithDroppableScroll,
    draggable: draggable2,
    destination,
    insideDestination,
    last: previousImpact.displaced,
    viewport,
    afterCritical
  });
}, "getDragImpact");
var patchDroppableMap = /* @__PURE__ */ __name(function(droppables, updated) {
  var _extends2;
  return _extends({}, droppables, (_extends2 = {}, _extends2[updated.descriptor.id] = updated, _extends2));
}, "patchDroppableMap");
var clearUnusedPlaceholder = /* @__PURE__ */ __name(function clearUnusedPlaceholder2(_ref) {
  var previousImpact = _ref.previousImpact, impact = _ref.impact, droppables = _ref.droppables;
  var last = whatIsDraggedOver(previousImpact);
  var now = whatIsDraggedOver(impact);
  if (!last) {
    return droppables;
  }
  if (last === now) {
    return droppables;
  }
  var lastDroppable = droppables[last];
  if (!lastDroppable.subject.withPlaceholder) {
    return droppables;
  }
  var updated = removePlaceholder(lastDroppable);
  return patchDroppableMap(droppables, updated);
}, "clearUnusedPlaceholder");
var recomputePlaceholders = /* @__PURE__ */ __name(function(_ref2) {
  var draggable2 = _ref2.draggable, draggables = _ref2.draggables, droppables = _ref2.droppables, previousImpact = _ref2.previousImpact, impact = _ref2.impact;
  var cleaned = clearUnusedPlaceholder({
    previousImpact,
    impact,
    droppables
  });
  var isOver = whatIsDraggedOver(impact);
  if (!isOver) {
    return cleaned;
  }
  var droppable2 = droppables[isOver];
  if (isHomeOf(draggable2, droppable2)) {
    return cleaned;
  }
  if (droppable2.subject.withPlaceholder) {
    return cleaned;
  }
  var patched = addPlaceholder(droppable2, draggable2, draggables);
  return patchDroppableMap(cleaned, patched);
}, "recomputePlaceholders");
var update = /* @__PURE__ */ __name(function(_ref) {
  var state = _ref.state, forcedClientSelection = _ref.clientSelection, forcedDimensions = _ref.dimensions, forcedViewport = _ref.viewport, forcedImpact = _ref.impact, scrollJumpRequest = _ref.scrollJumpRequest;
  var viewport = forcedViewport || state.viewport;
  var dimensions = forcedDimensions || state.dimensions;
  var clientSelection = forcedClientSelection || state.current.client.selection;
  var offset3 = subtract(clientSelection, state.initial.client.selection);
  var client = {
    offset: offset3,
    selection: clientSelection,
    borderBoxCenter: add(state.initial.client.borderBoxCenter, offset3)
  };
  var page = {
    selection: add(client.selection, viewport.scroll.current),
    borderBoxCenter: add(client.borderBoxCenter, viewport.scroll.current),
    offset: add(client.offset, viewport.scroll.diff.value)
  };
  var current = {
    client,
    page
  };
  if (state.phase === "COLLECTING") {
    return _extends({
      phase: "COLLECTING"
    }, state, {
      dimensions,
      viewport,
      current
    });
  }
  var draggable2 = dimensions.draggables[state.critical.draggable.id];
  var newImpact = forcedImpact || getDragImpact({
    pageOffset: page.offset,
    draggable: draggable2,
    draggables: dimensions.draggables,
    droppables: dimensions.droppables,
    previousImpact: state.impact,
    viewport,
    afterCritical: state.afterCritical
  });
  var withUpdatedPlaceholders = recomputePlaceholders({
    draggable: draggable2,
    impact: newImpact,
    previousImpact: state.impact,
    draggables: dimensions.draggables,
    droppables: dimensions.droppables
  });
  var result = _extends({}, state, {
    current,
    dimensions: {
      draggables: dimensions.draggables,
      droppables: withUpdatedPlaceholders
    },
    impact: newImpact,
    viewport,
    scrollJumpRequest: scrollJumpRequest || null,
    forceShouldAnimate: scrollJumpRequest ? false : null
  });
  return result;
}, "update");
function getDraggables$1(ids, draggables) {
  return ids.map(function(id) {
    return draggables[id];
  });
}
__name(getDraggables$1, "getDraggables$1");
var recompute = /* @__PURE__ */ __name(function(_ref) {
  var impact = _ref.impact, viewport = _ref.viewport, draggables = _ref.draggables, destination = _ref.destination, forceShouldAnimate = _ref.forceShouldAnimate;
  var last = impact.displaced;
  var afterDragging = getDraggables$1(last.all, draggables);
  var displaced = getDisplacementGroups({
    afterDragging,
    destination,
    displacedBy: impact.displacedBy,
    viewport: viewport.frame,
    forceShouldAnimate,
    last
  });
  return _extends({}, impact, {
    displaced
  });
}, "recompute");
var getClientBorderBoxCenter = /* @__PURE__ */ __name(function(_ref) {
  var impact = _ref.impact, draggable2 = _ref.draggable, droppable2 = _ref.droppable, draggables = _ref.draggables, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
    impact,
    draggable: draggable2,
    draggables,
    droppable: droppable2,
    afterCritical
  });
  return getClientFromPageBorderBoxCenter({
    pageBorderBoxCenter,
    draggable: draggable2,
    viewport
  });
}, "getClientBorderBoxCenter");
var refreshSnap = /* @__PURE__ */ __name(function(_ref) {
  var state = _ref.state, forcedDimensions = _ref.dimensions, forcedViewport = _ref.viewport;
  !(state.movementMode === "SNAP") ? true ? invariant2(false) : invariant2(false) : void 0;
  var needsVisibilityCheck = state.impact;
  var viewport = forcedViewport || state.viewport;
  var dimensions = forcedDimensions || state.dimensions;
  var draggables = dimensions.draggables, droppables = dimensions.droppables;
  var draggable2 = draggables[state.critical.draggable.id];
  var isOver = whatIsDraggedOver(needsVisibilityCheck);
  !isOver ? true ? invariant2(false, "Must be over a destination in SNAP movement mode") : invariant2(false) : void 0;
  var destination = droppables[isOver];
  var impact = recompute({
    impact: needsVisibilityCheck,
    viewport,
    destination,
    draggables
  });
  var clientSelection = getClientBorderBoxCenter({
    impact,
    draggable: draggable2,
    droppable: destination,
    draggables,
    viewport,
    afterCritical: state.afterCritical
  });
  return update({
    impact,
    clientSelection,
    state,
    dimensions,
    viewport
  });
}, "refreshSnap");
var getHomeLocation = /* @__PURE__ */ __name(function(descriptor) {
  return {
    index: descriptor.index,
    droppableId: descriptor.droppableId
  };
}, "getHomeLocation");
var getLiftEffect = /* @__PURE__ */ __name(function(_ref) {
  var draggable2 = _ref.draggable, home2 = _ref.home, draggables = _ref.draggables, viewport = _ref.viewport;
  var displacedBy = getDisplacedBy(home2.axis, draggable2.displaceBy);
  var insideHome = getDraggablesInsideDroppable(home2.descriptor.id, draggables);
  var rawIndex = insideHome.indexOf(draggable2);
  !(rawIndex !== -1) ? true ? invariant2(false, "Expected draggable to be inside home list") : invariant2(false) : void 0;
  var afterDragging = insideHome.slice(rawIndex + 1);
  var effected = afterDragging.reduce(function(previous, item) {
    previous[item.descriptor.id] = true;
    return previous;
  }, {});
  var afterCritical = {
    inVirtualList: home2.descriptor.mode === "virtual",
    displacedBy,
    effected
  };
  var displaced = getDisplacementGroups({
    afterDragging,
    destination: home2,
    displacedBy,
    last: null,
    viewport: viewport.frame,
    forceShouldAnimate: false
  });
  var impact = {
    displaced,
    displacedBy,
    at: {
      type: "REORDER",
      destination: getHomeLocation(draggable2.descriptor)
    }
  };
  return {
    impact,
    afterCritical
  };
}, "getLiftEffect");
var patchDimensionMap = /* @__PURE__ */ __name(function(dimensions, updated) {
  return {
    draggables: dimensions.draggables,
    droppables: patchDroppableMap(dimensions.droppables, updated)
  };
}, "patchDimensionMap");
var start = /* @__PURE__ */ __name(function start2(key) {
  if (true) {
    {
      return;
    }
  }
}, "start");
var finish = /* @__PURE__ */ __name(function finish2(key) {
  if (true) {
    {
      return;
    }
  }
}, "finish");
var offsetDraggable = /* @__PURE__ */ __name(function(_ref) {
  var draggable2 = _ref.draggable, offset$1 = _ref.offset, initialWindowScroll = _ref.initialWindowScroll;
  var client = offset(draggable2.client, offset$1);
  var page = withScroll(client, initialWindowScroll);
  var moved = _extends({}, draggable2, {
    placeholder: _extends({}, draggable2.placeholder, {
      client
    }),
    client,
    page
  });
  return moved;
}, "offsetDraggable");
var getFrame = /* @__PURE__ */ __name(function(droppable2) {
  var frame = droppable2.frame;
  !frame ? true ? invariant2(false, "Expected Droppable to have a frame") : invariant2(false) : void 0;
  return frame;
}, "getFrame");
var adjustAdditionsForScrollChanges = /* @__PURE__ */ __name(function(_ref) {
  var additions = _ref.additions, updatedDroppables = _ref.updatedDroppables, viewport = _ref.viewport;
  var windowScrollChange = viewport.scroll.diff.value;
  return additions.map(function(draggable2) {
    var droppableId = draggable2.descriptor.droppableId;
    var modified = updatedDroppables[droppableId];
    var frame = getFrame(modified);
    var droppableScrollChange = frame.scroll.diff.value;
    var totalChange = add(windowScrollChange, droppableScrollChange);
    var moved = offsetDraggable({
      draggable: draggable2,
      offset: totalChange,
      initialWindowScroll: viewport.scroll.initial
    });
    return moved;
  });
}, "adjustAdditionsForScrollChanges");
var publishWhileDraggingInVirtual = /* @__PURE__ */ __name(function(_ref) {
  var state = _ref.state, published = _ref.published;
  start();
  var withScrollChange = published.modified.map(function(update2) {
    var existing = state.dimensions.droppables[update2.droppableId];
    var scrolled = scrollDroppable(existing, update2.scroll);
    return scrolled;
  });
  var droppables = _extends({}, state.dimensions.droppables, {}, toDroppableMap(withScrollChange));
  var updatedAdditions = toDraggableMap(adjustAdditionsForScrollChanges({
    additions: published.additions,
    updatedDroppables: droppables,
    viewport: state.viewport
  }));
  var draggables = _extends({}, state.dimensions.draggables, {}, updatedAdditions);
  published.removals.forEach(function(id) {
    delete draggables[id];
  });
  var dimensions = {
    droppables,
    draggables
  };
  var wasOverId = whatIsDraggedOver(state.impact);
  var wasOver = wasOverId ? dimensions.droppables[wasOverId] : null;
  var draggable2 = dimensions.draggables[state.critical.draggable.id];
  var home2 = dimensions.droppables[state.critical.droppable.id];
  var _getLiftEffect = getLiftEffect({
    draggable: draggable2,
    home: home2,
    draggables,
    viewport: state.viewport
  }), onLiftImpact = _getLiftEffect.impact, afterCritical = _getLiftEffect.afterCritical;
  var previousImpact = wasOver && wasOver.isCombineEnabled ? state.impact : onLiftImpact;
  var impact = getDragImpact({
    pageOffset: state.current.page.offset,
    draggable: dimensions.draggables[state.critical.draggable.id],
    draggables: dimensions.draggables,
    droppables: dimensions.droppables,
    previousImpact,
    viewport: state.viewport,
    afterCritical
  });
  finish();
  var draggingState = _extends({
    phase: "DRAGGING"
  }, state, {
    phase: "DRAGGING",
    impact,
    onLiftImpact,
    dimensions,
    afterCritical,
    forceShouldAnimate: false
  });
  if (state.phase === "COLLECTING") {
    return draggingState;
  }
  var dropPending3 = _extends({
    phase: "DROP_PENDING"
  }, draggingState, {
    phase: "DROP_PENDING",
    reason: state.reason,
    isWaiting: false
  });
  return dropPending3;
}, "publishWhileDraggingInVirtual");
var isSnapping = /* @__PURE__ */ __name(function isSnapping2(state) {
  return state.movementMode === "SNAP";
}, "isSnapping");
var postDroppableChange = /* @__PURE__ */ __name(function postDroppableChange2(state, updated, isEnabledChanging) {
  var dimensions = patchDimensionMap(state.dimensions, updated);
  if (!isSnapping(state) || isEnabledChanging) {
    return update({
      state,
      dimensions
    });
  }
  return refreshSnap({
    state,
    dimensions
  });
}, "postDroppableChange");
function removeScrollJumpRequest(state) {
  if (state.isDragging && state.movementMode === "SNAP") {
    return _extends({
      phase: "DRAGGING"
    }, state, {
      scrollJumpRequest: null
    });
  }
  return state;
}
__name(removeScrollJumpRequest, "removeScrollJumpRequest");
var idle = {
  phase: "IDLE",
  completed: null,
  shouldFlush: false
};
var reducer = /* @__PURE__ */ __name(function(state, action) {
  if (state === void 0) {
    state = idle;
  }
  if (action.type === "FLUSH") {
    return _extends({}, idle, {
      shouldFlush: true
    });
  }
  if (action.type === "INITIAL_PUBLISH") {
    !(state.phase === "IDLE") ? true ? invariant2(false, "INITIAL_PUBLISH must come after a IDLE phase") : invariant2(false) : void 0;
    var _action$payload = action.payload, critical = _action$payload.critical, clientSelection = _action$payload.clientSelection, viewport = _action$payload.viewport, dimensions = _action$payload.dimensions, movementMode = _action$payload.movementMode;
    var draggable2 = dimensions.draggables[critical.draggable.id];
    var home2 = dimensions.droppables[critical.droppable.id];
    var client = {
      selection: clientSelection,
      borderBoxCenter: draggable2.client.borderBox.center,
      offset: origin
    };
    var initial = {
      client,
      page: {
        selection: add(client.selection, viewport.scroll.initial),
        borderBoxCenter: add(client.selection, viewport.scroll.initial),
        offset: add(client.selection, viewport.scroll.diff.value)
      }
    };
    var isWindowScrollAllowed = toDroppableList(dimensions.droppables).every(function(item) {
      return !item.isFixedOnPage;
    });
    var _getLiftEffect = getLiftEffect({
      draggable: draggable2,
      home: home2,
      draggables: dimensions.draggables,
      viewport
    }), impact = _getLiftEffect.impact, afterCritical = _getLiftEffect.afterCritical;
    var result = {
      phase: "DRAGGING",
      isDragging: true,
      critical,
      movementMode,
      dimensions,
      initial,
      current: initial,
      isWindowScrollAllowed,
      impact,
      afterCritical,
      onLiftImpact: impact,
      viewport,
      scrollJumpRequest: null,
      forceShouldAnimate: null
    };
    return result;
  }
  if (action.type === "COLLECTION_STARTING") {
    if (state.phase === "COLLECTING" || state.phase === "DROP_PENDING") {
      return state;
    }
    !(state.phase === "DRAGGING") ? true ? invariant2(false, "Collection cannot start from phase " + state.phase) : invariant2(false) : void 0;
    var _result = _extends({
      phase: "COLLECTING"
    }, state, {
      phase: "COLLECTING"
    });
    return _result;
  }
  if (action.type === "PUBLISH_WHILE_DRAGGING") {
    !(state.phase === "COLLECTING" || state.phase === "DROP_PENDING") ? true ? invariant2(false, "Unexpected " + action.type + " received in phase " + state.phase) : invariant2(false) : void 0;
    return publishWhileDraggingInVirtual({
      state,
      published: action.payload
    });
  }
  if (action.type === "MOVE") {
    if (state.phase === "DROP_PENDING") {
      return state;
    }
    !isMovementAllowed(state) ? true ? invariant2(false, action.type + " not permitted in phase " + state.phase) : invariant2(false) : void 0;
    var _clientSelection = action.payload.client;
    if (isEqual2(_clientSelection, state.current.client.selection)) {
      return state;
    }
    return update({
      state,
      clientSelection: _clientSelection,
      impact: isSnapping(state) ? state.impact : null
    });
  }
  if (action.type === "UPDATE_DROPPABLE_SCROLL") {
    if (state.phase === "DROP_PENDING") {
      return removeScrollJumpRequest(state);
    }
    if (state.phase === "COLLECTING") {
      return removeScrollJumpRequest(state);
    }
    !isMovementAllowed(state) ? true ? invariant2(false, action.type + " not permitted in phase " + state.phase) : invariant2(false) : void 0;
    var _action$payload2 = action.payload, id = _action$payload2.id, newScroll = _action$payload2.newScroll;
    var target = state.dimensions.droppables[id];
    if (!target) {
      return state;
    }
    var scrolled = scrollDroppable(target, newScroll);
    return postDroppableChange(state, scrolled, false);
  }
  if (action.type === "UPDATE_DROPPABLE_IS_ENABLED") {
    if (state.phase === "DROP_PENDING") {
      return state;
    }
    !isMovementAllowed(state) ? true ? invariant2(false, "Attempting to move in an unsupported phase " + state.phase) : invariant2(false) : void 0;
    var _action$payload3 = action.payload, _id = _action$payload3.id, isEnabled = _action$payload3.isEnabled;
    var _target = state.dimensions.droppables[_id];
    !_target ? true ? invariant2(false, "Cannot find Droppable[id: " + _id + "] to toggle its enabled state") : invariant2(false) : void 0;
    !(_target.isEnabled !== isEnabled) ? true ? invariant2(false, "Trying to set droppable isEnabled to " + String(isEnabled) + "\n      but it is already " + String(_target.isEnabled)) : invariant2(false) : void 0;
    var updated = _extends({}, _target, {
      isEnabled
    });
    return postDroppableChange(state, updated, true);
  }
  if (action.type === "UPDATE_DROPPABLE_IS_COMBINE_ENABLED") {
    if (state.phase === "DROP_PENDING") {
      return state;
    }
    !isMovementAllowed(state) ? true ? invariant2(false, "Attempting to move in an unsupported phase " + state.phase) : invariant2(false) : void 0;
    var _action$payload4 = action.payload, _id2 = _action$payload4.id, isCombineEnabled = _action$payload4.isCombineEnabled;
    var _target2 = state.dimensions.droppables[_id2];
    !_target2 ? true ? invariant2(false, "Cannot find Droppable[id: " + _id2 + "] to toggle its isCombineEnabled state") : invariant2(false) : void 0;
    !(_target2.isCombineEnabled !== isCombineEnabled) ? true ? invariant2(false, "Trying to set droppable isCombineEnabled to " + String(isCombineEnabled) + "\n      but it is already " + String(_target2.isCombineEnabled)) : invariant2(false) : void 0;
    var _updated = _extends({}, _target2, {
      isCombineEnabled
    });
    return postDroppableChange(state, _updated, true);
  }
  if (action.type === "MOVE_BY_WINDOW_SCROLL") {
    if (state.phase === "DROP_PENDING" || state.phase === "DROP_ANIMATING") {
      return state;
    }
    !isMovementAllowed(state) ? true ? invariant2(false, "Cannot move by window in phase " + state.phase) : invariant2(false) : void 0;
    !state.isWindowScrollAllowed ? true ? invariant2(false, "Window scrolling is currently not supported for fixed lists") : invariant2(false) : void 0;
    var _newScroll = action.payload.newScroll;
    if (isEqual2(state.viewport.scroll.current, _newScroll)) {
      return removeScrollJumpRequest(state);
    }
    var _viewport = scrollViewport(state.viewport, _newScroll);
    if (isSnapping(state)) {
      return refreshSnap({
        state,
        viewport: _viewport
      });
    }
    return update({
      state,
      viewport: _viewport
    });
  }
  if (action.type === "UPDATE_VIEWPORT_MAX_SCROLL") {
    if (!isMovementAllowed(state)) {
      return state;
    }
    var maxScroll = action.payload.maxScroll;
    if (isEqual2(maxScroll, state.viewport.scroll.max)) {
      return state;
    }
    var withMaxScroll3 = _extends({}, state.viewport, {
      scroll: _extends({}, state.viewport.scroll, {
        max: maxScroll
      })
    });
    return _extends({
      phase: "DRAGGING"
    }, state, {
      viewport: withMaxScroll3
    });
  }
  if (action.type === "MOVE_UP" || action.type === "MOVE_DOWN" || action.type === "MOVE_LEFT" || action.type === "MOVE_RIGHT") {
    if (state.phase === "COLLECTING" || state.phase === "DROP_PENDING") {
      return state;
    }
    !(state.phase === "DRAGGING") ? true ? invariant2(false, action.type + " received while not in DRAGGING phase") : invariant2(false) : void 0;
    var _result2 = moveInDirection({
      state,
      type: action.type
    });
    if (!_result2) {
      return state;
    }
    return update({
      state,
      impact: _result2.impact,
      clientSelection: _result2.clientSelection,
      scrollJumpRequest: _result2.scrollJumpRequest
    });
  }
  if (action.type === "DROP_PENDING") {
    var reason = action.payload.reason;
    !(state.phase === "COLLECTING") ? true ? invariant2(false, "Can only move into the DROP_PENDING phase from the COLLECTING phase") : invariant2(false) : void 0;
    var newState = _extends({
      phase: "DROP_PENDING"
    }, state, {
      phase: "DROP_PENDING",
      isWaiting: true,
      reason
    });
    return newState;
  }
  if (action.type === "DROP_ANIMATE") {
    var _action$payload5 = action.payload, completed = _action$payload5.completed, dropDuration = _action$payload5.dropDuration, newHomeClientOffset = _action$payload5.newHomeClientOffset;
    !(state.phase === "DRAGGING" || state.phase === "DROP_PENDING") ? true ? invariant2(false, "Cannot animate drop from phase " + state.phase) : invariant2(false) : void 0;
    var _result3 = {
      phase: "DROP_ANIMATING",
      completed,
      dropDuration,
      newHomeClientOffset,
      dimensions: state.dimensions
    };
    return _result3;
  }
  if (action.type === "DROP_COMPLETE") {
    var _completed = action.payload.completed;
    return {
      phase: "IDLE",
      completed: _completed,
      shouldFlush: false
    };
  }
  return state;
}, "reducer");
var beforeInitialCapture = /* @__PURE__ */ __name(function beforeInitialCapture2(args) {
  return {
    type: "BEFORE_INITIAL_CAPTURE",
    payload: args
  };
}, "beforeInitialCapture");
var lift = /* @__PURE__ */ __name(function lift2(args) {
  return {
    type: "LIFT",
    payload: args
  };
}, "lift");
var initialPublish = /* @__PURE__ */ __name(function initialPublish2(args) {
  return {
    type: "INITIAL_PUBLISH",
    payload: args
  };
}, "initialPublish");
var publishWhileDragging = /* @__PURE__ */ __name(function publishWhileDragging2(args) {
  return {
    type: "PUBLISH_WHILE_DRAGGING",
    payload: args
  };
}, "publishWhileDragging");
var collectionStarting = /* @__PURE__ */ __name(function collectionStarting2() {
  return {
    type: "COLLECTION_STARTING",
    payload: null
  };
}, "collectionStarting");
var updateDroppableScroll = /* @__PURE__ */ __name(function updateDroppableScroll2(args) {
  return {
    type: "UPDATE_DROPPABLE_SCROLL",
    payload: args
  };
}, "updateDroppableScroll");
var updateDroppableIsEnabled = /* @__PURE__ */ __name(function updateDroppableIsEnabled2(args) {
  return {
    type: "UPDATE_DROPPABLE_IS_ENABLED",
    payload: args
  };
}, "updateDroppableIsEnabled");
var updateDroppableIsCombineEnabled = /* @__PURE__ */ __name(function updateDroppableIsCombineEnabled2(args) {
  return {
    type: "UPDATE_DROPPABLE_IS_COMBINE_ENABLED",
    payload: args
  };
}, "updateDroppableIsCombineEnabled");
var move = /* @__PURE__ */ __name(function move2(args) {
  return {
    type: "MOVE",
    payload: args
  };
}, "move");
var moveByWindowScroll = /* @__PURE__ */ __name(function moveByWindowScroll2(args) {
  return {
    type: "MOVE_BY_WINDOW_SCROLL",
    payload: args
  };
}, "moveByWindowScroll");
var updateViewportMaxScroll = /* @__PURE__ */ __name(function updateViewportMaxScroll2(args) {
  return {
    type: "UPDATE_VIEWPORT_MAX_SCROLL",
    payload: args
  };
}, "updateViewportMaxScroll");
var moveUp = /* @__PURE__ */ __name(function moveUp2() {
  return {
    type: "MOVE_UP",
    payload: null
  };
}, "moveUp");
var moveDown = /* @__PURE__ */ __name(function moveDown2() {
  return {
    type: "MOVE_DOWN",
    payload: null
  };
}, "moveDown");
var moveRight = /* @__PURE__ */ __name(function moveRight2() {
  return {
    type: "MOVE_RIGHT",
    payload: null
  };
}, "moveRight");
var moveLeft = /* @__PURE__ */ __name(function moveLeft2() {
  return {
    type: "MOVE_LEFT",
    payload: null
  };
}, "moveLeft");
var flush = /* @__PURE__ */ __name(function flush2() {
  return {
    type: "FLUSH",
    payload: null
  };
}, "flush");
var animateDrop = /* @__PURE__ */ __name(function animateDrop2(args) {
  return {
    type: "DROP_ANIMATE",
    payload: args
  };
}, "animateDrop");
var completeDrop = /* @__PURE__ */ __name(function completeDrop2(args) {
  return {
    type: "DROP_COMPLETE",
    payload: args
  };
}, "completeDrop");
var drop = /* @__PURE__ */ __name(function drop2(args) {
  return {
    type: "DROP",
    payload: args
  };
}, "drop");
var dropPending = /* @__PURE__ */ __name(function dropPending2(args) {
  return {
    type: "DROP_PENDING",
    payload: args
  };
}, "dropPending");
var dropAnimationFinished = /* @__PURE__ */ __name(function dropAnimationFinished2() {
  return {
    type: "DROP_ANIMATION_FINISHED",
    payload: null
  };
}, "dropAnimationFinished");
function checkIndexes(insideDestination) {
  if (insideDestination.length <= 1) {
    return;
  }
  var indexes = insideDestination.map(function(d) {
    return d.descriptor.index;
  });
  var errors = {};
  for (var i = 1; i < indexes.length; i++) {
    var current = indexes[i];
    var previous = indexes[i - 1];
    if (current !== previous + 1) {
      errors[current] = true;
    }
  }
  if (!Object.keys(errors).length) {
    return;
  }
  var formatted = indexes.map(function(index) {
    var hasError = Boolean(errors[index]);
    return hasError ? "[🔥" + index + "]" : "" + index;
  }).join(", ");
  true ? warning2("\n    Detected non-consecutive <Draggable /> indexes.\n\n    (This can cause unexpected bugs)\n\n    " + formatted + "\n  ") : void 0;
}
__name(checkIndexes, "checkIndexes");
function validateDimensions(critical, dimensions) {
  if (true) {
    var insideDestination = getDraggablesInsideDroppable(critical.droppable.id, dimensions.draggables);
    checkIndexes(insideDestination);
  }
}
__name(validateDimensions, "validateDimensions");
var lift$1 = /* @__PURE__ */ __name(function(marshal) {
  return function(_ref) {
    var getState = _ref.getState, dispatch = _ref.dispatch;
    return function(next) {
      return function(action) {
        if (action.type !== "LIFT") {
          next(action);
          return;
        }
        var _action$payload = action.payload, id = _action$payload.id, clientSelection = _action$payload.clientSelection, movementMode = _action$payload.movementMode;
        var initial = getState();
        if (initial.phase === "DROP_ANIMATING") {
          dispatch(completeDrop({
            completed: initial.completed
          }));
        }
        !(getState().phase === "IDLE") ? true ? invariant2(false, "Unexpected phase to start a drag") : invariant2(false) : void 0;
        dispatch(flush());
        dispatch(beforeInitialCapture({
          draggableId: id,
          movementMode
        }));
        var scrollOptions = {
          shouldPublishImmediately: movementMode === "SNAP"
        };
        var request = {
          draggableId: id,
          scrollOptions
        };
        var _marshal$startPublish = marshal.startPublishing(request), critical = _marshal$startPublish.critical, dimensions = _marshal$startPublish.dimensions, viewport = _marshal$startPublish.viewport;
        validateDimensions(critical, dimensions);
        dispatch(initialPublish({
          critical,
          dimensions,
          clientSelection,
          movementMode,
          viewport
        }));
      };
    };
  };
}, "lift$1");
var style = /* @__PURE__ */ __name(function(marshal) {
  return function() {
    return function(next) {
      return function(action) {
        if (action.type === "INITIAL_PUBLISH") {
          marshal.dragging();
        }
        if (action.type === "DROP_ANIMATE") {
          marshal.dropping(action.payload.completed.result.reason);
        }
        if (action.type === "FLUSH" || action.type === "DROP_COMPLETE") {
          marshal.resting();
        }
        next(action);
      };
    };
  };
}, "style");
var curves = {
  outOfTheWay: "cubic-bezier(0.2, 0, 0, 1)",
  drop: "cubic-bezier(.2,1,.1,1)"
};
var combine = {
  opacity: {
    drop: 0,
    combining: 0.7
  },
  scale: {
    drop: 0.75
  }
};
var timings = {
  outOfTheWay: 0.2,
  minDropTime: 0.33,
  maxDropTime: 0.55
};
var outOfTheWayTiming = timings.outOfTheWay + "s " + curves.outOfTheWay;
var transitions = {
  fluid: "opacity " + outOfTheWayTiming,
  snap: "transform " + outOfTheWayTiming + ", opacity " + outOfTheWayTiming,
  drop: /* @__PURE__ */ __name(function drop3(duration) {
    var timing = duration + "s " + curves.drop;
    return "transform " + timing + ", opacity " + timing;
  }, "drop"),
  outOfTheWay: "transform " + outOfTheWayTiming,
  placeholder: "height " + outOfTheWayTiming + ", width " + outOfTheWayTiming + ", margin " + outOfTheWayTiming
};
var moveTo = /* @__PURE__ */ __name(function moveTo2(offset3) {
  return isEqual2(offset3, origin) ? null : "translate(" + offset3.x + "px, " + offset3.y + "px)";
}, "moveTo");
var transforms = {
  moveTo,
  drop: /* @__PURE__ */ __name(function drop4(offset3, isCombining) {
    var translate = moveTo(offset3);
    if (!translate) {
      return null;
    }
    if (!isCombining) {
      return translate;
    }
    return translate + " scale(" + combine.scale.drop + ")";
  }, "drop")
};
var minDropTime = timings.minDropTime;
var maxDropTime = timings.maxDropTime;
var dropTimeRange = maxDropTime - minDropTime;
var maxDropTimeAtDistance = 1500;
var cancelDropModifier = 0.6;
var getDropDuration = /* @__PURE__ */ __name(function(_ref) {
  var current = _ref.current, destination = _ref.destination, reason = _ref.reason;
  var distance$1 = distance(current, destination);
  if (distance$1 <= 0) {
    return minDropTime;
  }
  if (distance$1 >= maxDropTimeAtDistance) {
    return maxDropTime;
  }
  var percentage = distance$1 / maxDropTimeAtDistance;
  var duration = minDropTime + dropTimeRange * percentage;
  var withDuration = reason === "CANCEL" ? duration * cancelDropModifier : duration;
  return Number(withDuration.toFixed(2));
}, "getDropDuration");
var getNewHomeClientOffset = /* @__PURE__ */ __name(function(_ref) {
  var impact = _ref.impact, draggable2 = _ref.draggable, dimensions = _ref.dimensions, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
  var draggables = dimensions.draggables, droppables = dimensions.droppables;
  var droppableId = whatIsDraggedOver(impact);
  var destination = droppableId ? droppables[droppableId] : null;
  var home2 = droppables[draggable2.descriptor.droppableId];
  var newClientCenter = getClientBorderBoxCenter({
    impact,
    draggable: draggable2,
    draggables,
    afterCritical,
    droppable: destination || home2,
    viewport
  });
  var offset3 = subtract(newClientCenter, draggable2.client.borderBox.center);
  return offset3;
}, "getNewHomeClientOffset");
var getDropImpact = /* @__PURE__ */ __name(function(_ref) {
  var draggables = _ref.draggables, reason = _ref.reason, lastImpact = _ref.lastImpact, home2 = _ref.home, viewport = _ref.viewport, onLiftImpact = _ref.onLiftImpact;
  if (!lastImpact.at || reason !== "DROP") {
    var recomputedHomeImpact = recompute({
      draggables,
      impact: onLiftImpact,
      destination: home2,
      viewport,
      forceShouldAnimate: true
    });
    return {
      impact: recomputedHomeImpact,
      didDropInsideDroppable: false
    };
  }
  if (lastImpact.at.type === "REORDER") {
    return {
      impact: lastImpact,
      didDropInsideDroppable: true
    };
  }
  var withoutMovement = _extends({}, lastImpact, {
    displaced: emptyGroups
  });
  return {
    impact: withoutMovement,
    didDropInsideDroppable: true
  };
}, "getDropImpact");
var drop$1 = /* @__PURE__ */ __name(function(_ref) {
  var getState = _ref.getState, dispatch = _ref.dispatch;
  return function(next) {
    return function(action) {
      if (action.type !== "DROP") {
        next(action);
        return;
      }
      var state = getState();
      var reason = action.payload.reason;
      if (state.phase === "COLLECTING") {
        dispatch(dropPending({
          reason
        }));
        return;
      }
      if (state.phase === "IDLE") {
        return;
      }
      var isWaitingForDrop = state.phase === "DROP_PENDING" && state.isWaiting;
      !!isWaitingForDrop ? true ? invariant2(false, "A DROP action occurred while DROP_PENDING and still waiting") : invariant2(false) : void 0;
      !(state.phase === "DRAGGING" || state.phase === "DROP_PENDING") ? true ? invariant2(false, "Cannot drop in phase: " + state.phase) : invariant2(false) : void 0;
      var critical = state.critical;
      var dimensions = state.dimensions;
      var draggable2 = dimensions.draggables[state.critical.draggable.id];
      var _getDropImpact = getDropImpact({
        reason,
        lastImpact: state.impact,
        afterCritical: state.afterCritical,
        onLiftImpact: state.onLiftImpact,
        home: state.dimensions.droppables[state.critical.droppable.id],
        viewport: state.viewport,
        draggables: state.dimensions.draggables
      }), impact = _getDropImpact.impact, didDropInsideDroppable = _getDropImpact.didDropInsideDroppable;
      var destination = didDropInsideDroppable ? tryGetDestination(impact) : null;
      var combine2 = didDropInsideDroppable ? tryGetCombine(impact) : null;
      var source = {
        index: critical.draggable.index,
        droppableId: critical.droppable.id
      };
      var result = {
        draggableId: draggable2.descriptor.id,
        type: draggable2.descriptor.type,
        source,
        reason,
        mode: state.movementMode,
        destination,
        combine: combine2
      };
      var newHomeClientOffset = getNewHomeClientOffset({
        impact,
        draggable: draggable2,
        dimensions,
        viewport: state.viewport,
        afterCritical: state.afterCritical
      });
      var completed = {
        critical: state.critical,
        afterCritical: state.afterCritical,
        result,
        impact
      };
      var isAnimationRequired = !isEqual2(state.current.client.offset, newHomeClientOffset) || Boolean(result.combine);
      if (!isAnimationRequired) {
        dispatch(completeDrop({
          completed
        }));
        return;
      }
      var dropDuration = getDropDuration({
        current: state.current.client.offset,
        destination: newHomeClientOffset,
        reason
      });
      var args = {
        newHomeClientOffset,
        dropDuration,
        completed
      };
      dispatch(animateDrop(args));
    };
  };
}, "drop$1");
var getWindowScroll3 = /* @__PURE__ */ __name(function() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}, "getWindowScroll");
function getWindowScrollBinding(update2) {
  return {
    eventName: "scroll",
    options: {
      passive: true,
      capture: false
    },
    fn: /* @__PURE__ */ __name(function fn(event) {
      if (event.target !== window && event.target !== window.document) {
        return;
      }
      update2();
    }, "fn")
  };
}
__name(getWindowScrollBinding, "getWindowScrollBinding");
function getScrollListener(_ref) {
  var onWindowScroll = _ref.onWindowScroll;
  function updateScroll() {
    onWindowScroll(getWindowScroll3());
  }
  __name(updateScroll, "updateScroll");
  var scheduled = raf_schd_esm_default(updateScroll);
  var binding = getWindowScrollBinding(scheduled);
  var unbind = noop;
  function isActive() {
    return unbind !== noop;
  }
  __name(isActive, "isActive");
  function start3() {
    !!isActive() ? true ? invariant2(false, "Cannot start scroll listener when already active") : invariant2(false) : void 0;
    unbind = bindEvents(window, [binding]);
  }
  __name(start3, "start");
  function stop() {
    !isActive() ? true ? invariant2(false, "Cannot stop scroll listener when not active") : invariant2(false) : void 0;
    scheduled.cancel();
    unbind();
    unbind = noop;
  }
  __name(stop, "stop");
  return {
    start: start3,
    stop,
    isActive
  };
}
__name(getScrollListener, "getScrollListener");
var shouldEnd = /* @__PURE__ */ __name(function shouldEnd2(action) {
  return action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATE" || action.type === "FLUSH";
}, "shouldEnd");
var scrollListener = /* @__PURE__ */ __name(function(store) {
  var listener = getScrollListener({
    onWindowScroll: /* @__PURE__ */ __name(function onWindowScroll(newScroll) {
      store.dispatch(moveByWindowScroll({
        newScroll
      }));
    }, "onWindowScroll")
  });
  return function(next) {
    return function(action) {
      if (!listener.isActive() && action.type === "INITIAL_PUBLISH") {
        listener.start();
      }
      if (listener.isActive() && shouldEnd(action)) {
        listener.stop();
      }
      next(action);
    };
  };
}, "scrollListener");
var getExpiringAnnounce = /* @__PURE__ */ __name(function(announce) {
  var wasCalled = false;
  var isExpired = false;
  var timeoutId = setTimeout(function() {
    isExpired = true;
  });
  var result = /* @__PURE__ */ __name(function result2(message) {
    if (wasCalled) {
      true ? warning2("Announcement already made. Not making a second announcement") : void 0;
      return;
    }
    if (isExpired) {
      true ? warning2("\n        Announcements cannot be made asynchronously.\n        Default message has already been announced.\n      ") : void 0;
      return;
    }
    wasCalled = true;
    announce(message);
    clearTimeout(timeoutId);
  }, "result");
  result.wasCalled = function() {
    return wasCalled;
  };
  return result;
}, "getExpiringAnnounce");
var getAsyncMarshal = /* @__PURE__ */ __name(function() {
  var entries = [];
  var execute3 = /* @__PURE__ */ __name(function execute4(timerId) {
    var index = findIndex(entries, function(item) {
      return item.timerId === timerId;
    });
    !(index !== -1) ? true ? invariant2(false, "Could not find timer") : invariant2(false) : void 0;
    var _entries$splice = entries.splice(index, 1), entry = _entries$splice[0];
    entry.callback();
  }, "execute");
  var add3 = /* @__PURE__ */ __name(function add4(fn) {
    var timerId = setTimeout(function() {
      return execute3(timerId);
    });
    var entry = {
      timerId,
      callback: fn
    };
    entries.push(entry);
  }, "add");
  var flush3 = /* @__PURE__ */ __name(function flush4() {
    if (!entries.length) {
      return;
    }
    var shallow = [].concat(entries);
    entries.length = 0;
    shallow.forEach(function(entry) {
      clearTimeout(entry.timerId);
      entry.callback();
    });
  }, "flush");
  return {
    add: add3,
    flush: flush3
  };
}, "getAsyncMarshal");
var areLocationsEqual = /* @__PURE__ */ __name(function areLocationsEqual2(first, second) {
  if (first == null && second == null) {
    return true;
  }
  if (first == null || second == null) {
    return false;
  }
  return first.droppableId === second.droppableId && first.index === second.index;
}, "areLocationsEqual");
var isCombineEqual = /* @__PURE__ */ __name(function isCombineEqual2(first, second) {
  if (first == null && second == null) {
    return true;
  }
  if (first == null || second == null) {
    return false;
  }
  return first.draggableId === second.draggableId && first.droppableId === second.droppableId;
}, "isCombineEqual");
var isCriticalEqual = /* @__PURE__ */ __name(function isCriticalEqual2(first, second) {
  if (first === second) {
    return true;
  }
  var isDraggableEqual = first.draggable.id === second.draggable.id && first.draggable.droppableId === second.draggable.droppableId && first.draggable.type === second.draggable.type && first.draggable.index === second.draggable.index;
  var isDroppableEqual = first.droppable.id === second.droppable.id && first.droppable.type === second.droppable.type;
  return isDraggableEqual && isDroppableEqual;
}, "isCriticalEqual");
var withTimings = /* @__PURE__ */ __name(function withTimings2(key, fn) {
  start();
  fn();
  finish();
}, "withTimings");
var getDragStart = /* @__PURE__ */ __name(function getDragStart2(critical, mode) {
  return {
    draggableId: critical.draggable.id,
    type: critical.droppable.type,
    source: {
      droppableId: critical.droppable.id,
      index: critical.draggable.index
    },
    mode
  };
}, "getDragStart");
var execute = /* @__PURE__ */ __name(function execute2(responder, data, announce, getDefaultMessage) {
  if (!responder) {
    announce(getDefaultMessage(data));
    return;
  }
  var willExpire = getExpiringAnnounce(announce);
  var provided = {
    announce: willExpire
  };
  responder(data, provided);
  if (!willExpire.wasCalled()) {
    announce(getDefaultMessage(data));
  }
}, "execute");
var getPublisher = /* @__PURE__ */ __name(function(getResponders, announce) {
  var asyncMarshal = getAsyncMarshal();
  var dragging = null;
  var beforeCapture = /* @__PURE__ */ __name(function beforeCapture2(draggableId, mode) {
    !!dragging ? true ? invariant2(false, "Cannot fire onBeforeCapture as a drag start has already been published") : invariant2(false) : void 0;
    withTimings("onBeforeCapture", function() {
      var fn = getResponders().onBeforeCapture;
      if (fn) {
        var before = {
          draggableId,
          mode
        };
        fn(before);
      }
    });
  }, "beforeCapture");
  var beforeStart = /* @__PURE__ */ __name(function beforeStart2(critical, mode) {
    !!dragging ? true ? invariant2(false, "Cannot fire onBeforeDragStart as a drag start has already been published") : invariant2(false) : void 0;
    withTimings("onBeforeDragStart", function() {
      var fn = getResponders().onBeforeDragStart;
      if (fn) {
        fn(getDragStart(critical, mode));
      }
    });
  }, "beforeStart");
  var start3 = /* @__PURE__ */ __name(function start4(critical, mode) {
    !!dragging ? true ? invariant2(false, "Cannot fire onBeforeDragStart as a drag start has already been published") : invariant2(false) : void 0;
    var data = getDragStart(critical, mode);
    dragging = {
      mode,
      lastCritical: critical,
      lastLocation: data.source,
      lastCombine: null
    };
    asyncMarshal.add(function() {
      withTimings("onDragStart", function() {
        return execute(getResponders().onDragStart, data, announce, preset.onDragStart);
      });
    });
  }, "start");
  var update2 = /* @__PURE__ */ __name(function update3(critical, impact) {
    var location = tryGetDestination(impact);
    var combine2 = tryGetCombine(impact);
    !dragging ? true ? invariant2(false, "Cannot fire onDragMove when onDragStart has not been called") : invariant2(false) : void 0;
    var hasCriticalChanged = !isCriticalEqual(critical, dragging.lastCritical);
    if (hasCriticalChanged) {
      dragging.lastCritical = critical;
    }
    var hasLocationChanged = !areLocationsEqual(dragging.lastLocation, location);
    if (hasLocationChanged) {
      dragging.lastLocation = location;
    }
    var hasGroupingChanged = !isCombineEqual(dragging.lastCombine, combine2);
    if (hasGroupingChanged) {
      dragging.lastCombine = combine2;
    }
    if (!hasCriticalChanged && !hasLocationChanged && !hasGroupingChanged) {
      return;
    }
    var data = _extends({}, getDragStart(critical, dragging.mode), {
      combine: combine2,
      destination: location
    });
    asyncMarshal.add(function() {
      withTimings("onDragUpdate", function() {
        return execute(getResponders().onDragUpdate, data, announce, preset.onDragUpdate);
      });
    });
  }, "update");
  var flush3 = /* @__PURE__ */ __name(function flush4() {
    !dragging ? true ? invariant2(false, "Can only flush responders while dragging") : invariant2(false) : void 0;
    asyncMarshal.flush();
  }, "flush");
  var drop5 = /* @__PURE__ */ __name(function drop6(result) {
    !dragging ? true ? invariant2(false, "Cannot fire onDragEnd when there is no matching onDragStart") : invariant2(false) : void 0;
    dragging = null;
    withTimings("onDragEnd", function() {
      return execute(getResponders().onDragEnd, result, announce, preset.onDragEnd);
    });
  }, "drop");
  var abort = /* @__PURE__ */ __name(function abort2() {
    if (!dragging) {
      return;
    }
    var result = _extends({}, getDragStart(dragging.lastCritical, dragging.mode), {
      combine: null,
      destination: null,
      reason: "CANCEL"
    });
    drop5(result);
  }, "abort");
  return {
    beforeCapture,
    beforeStart,
    start: start3,
    update: update2,
    flush: flush3,
    drop: drop5,
    abort
  };
}, "getPublisher");
var responders = /* @__PURE__ */ __name(function(getResponders, announce) {
  var publisher = getPublisher(getResponders, announce);
  return function(store) {
    return function(next) {
      return function(action) {
        if (action.type === "BEFORE_INITIAL_CAPTURE") {
          publisher.beforeCapture(action.payload.draggableId, action.payload.movementMode);
          return;
        }
        if (action.type === "INITIAL_PUBLISH") {
          var critical = action.payload.critical;
          publisher.beforeStart(critical, action.payload.movementMode);
          next(action);
          publisher.start(critical, action.payload.movementMode);
          return;
        }
        if (action.type === "DROP_COMPLETE") {
          var result = action.payload.completed.result;
          publisher.flush();
          next(action);
          publisher.drop(result);
          return;
        }
        next(action);
        if (action.type === "FLUSH") {
          publisher.abort();
          return;
        }
        var state = store.getState();
        if (state.phase === "DRAGGING") {
          publisher.update(state.critical, state.impact);
        }
      };
    };
  };
}, "responders");
var dropAnimationFinish = /* @__PURE__ */ __name(function(store) {
  return function(next) {
    return function(action) {
      if (action.type !== "DROP_ANIMATION_FINISHED") {
        next(action);
        return;
      }
      var state = store.getState();
      !(state.phase === "DROP_ANIMATING") ? true ? invariant2(false, "Cannot finish a drop animating when no drop is occurring") : invariant2(false) : void 0;
      store.dispatch(completeDrop({
        completed: state.completed
      }));
    };
  };
}, "dropAnimationFinish");
var dropAnimationFlushOnScroll = /* @__PURE__ */ __name(function(store) {
  var unbind = null;
  var frameId = null;
  function clear() {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    if (unbind) {
      unbind();
      unbind = null;
    }
  }
  __name(clear, "clear");
  return function(next) {
    return function(action) {
      if (action.type === "FLUSH" || action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATION_FINISHED") {
        clear();
      }
      next(action);
      if (action.type !== "DROP_ANIMATE") {
        return;
      }
      var binding = {
        eventName: "scroll",
        options: {
          capture: true,
          passive: false,
          once: true
        },
        fn: /* @__PURE__ */ __name(function flushDropAnimation() {
          var state = store.getState();
          if (state.phase === "DROP_ANIMATING") {
            store.dispatch(dropAnimationFinished());
          }
        }, "flushDropAnimation")
      };
      frameId = requestAnimationFrame(function() {
        frameId = null;
        unbind = bindEvents(window, [binding]);
      });
    };
  };
}, "dropAnimationFlushOnScroll");
var dimensionMarshalStopper = /* @__PURE__ */ __name(function(marshal) {
  return function() {
    return function(next) {
      return function(action) {
        if (action.type === "DROP_COMPLETE" || action.type === "FLUSH" || action.type === "DROP_ANIMATE") {
          marshal.stopPublishing();
        }
        next(action);
      };
    };
  };
}, "dimensionMarshalStopper");
var focus = /* @__PURE__ */ __name(function(marshal) {
  var isWatching = false;
  return function() {
    return function(next) {
      return function(action) {
        if (action.type === "INITIAL_PUBLISH") {
          isWatching = true;
          marshal.tryRecordFocus(action.payload.critical.draggable.id);
          next(action);
          marshal.tryRestoreFocusRecorded();
          return;
        }
        next(action);
        if (!isWatching) {
          return;
        }
        if (action.type === "FLUSH") {
          isWatching = false;
          marshal.tryRestoreFocusRecorded();
          return;
        }
        if (action.type === "DROP_COMPLETE") {
          isWatching = false;
          var result = action.payload.completed.result;
          if (result.combine) {
            marshal.tryShiftRecord(result.draggableId, result.combine.draggableId);
          }
          marshal.tryRestoreFocusRecorded();
        }
      };
    };
  };
}, "focus");
var shouldStop = /* @__PURE__ */ __name(function shouldStop2(action) {
  return action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATE" || action.type === "FLUSH";
}, "shouldStop");
var autoScroll = /* @__PURE__ */ __name(function(autoScroller) {
  return function(store) {
    return function(next) {
      return function(action) {
        if (shouldStop(action)) {
          autoScroller.stop();
          next(action);
          return;
        }
        if (action.type === "INITIAL_PUBLISH") {
          next(action);
          var state = store.getState();
          !(state.phase === "DRAGGING") ? true ? invariant2(false, "Expected phase to be DRAGGING after INITIAL_PUBLISH") : invariant2(false) : void 0;
          autoScroller.start(state);
          return;
        }
        next(action);
        autoScroller.scroll(store.getState());
      };
    };
  };
}, "autoScroll");
var pendingDrop = /* @__PURE__ */ __name(function(store) {
  return function(next) {
    return function(action) {
      next(action);
      if (action.type !== "PUBLISH_WHILE_DRAGGING") {
        return;
      }
      var postActionState = store.getState();
      if (postActionState.phase !== "DROP_PENDING") {
        return;
      }
      if (postActionState.isWaiting) {
        return;
      }
      store.dispatch(drop({
        reason: postActionState.reason
      }));
    };
  };
}, "pendingDrop");
var composeEnhancers = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  name: "react-beautiful-dnd"
}) : compose;
var createStore2 = /* @__PURE__ */ __name(function(_ref) {
  var dimensionMarshal = _ref.dimensionMarshal, focusMarshal = _ref.focusMarshal, styleMarshal = _ref.styleMarshal, getResponders = _ref.getResponders, announce = _ref.announce, autoScroller = _ref.autoScroller;
  return createStore(reducer, composeEnhancers(applyMiddleware(style(styleMarshal), dimensionMarshalStopper(dimensionMarshal), lift$1(dimensionMarshal), drop$1, dropAnimationFinish, dropAnimationFlushOnScroll, pendingDrop, autoScroll(autoScroller), scrollListener, focus(focusMarshal), responders(getResponders, announce))));
}, "createStore");
var clean$1 = /* @__PURE__ */ __name(function clean3() {
  return {
    additions: {},
    removals: {},
    modified: {}
  };
}, "clean");
function createPublisher(_ref) {
  var registry = _ref.registry, callbacks = _ref.callbacks;
  var staging = clean$1();
  var frameId = null;
  var collect = /* @__PURE__ */ __name(function collect2() {
    if (frameId) {
      return;
    }
    callbacks.collectionStarting();
    frameId = requestAnimationFrame(function() {
      frameId = null;
      start();
      var _staging = staging, additions = _staging.additions, removals = _staging.removals, modified = _staging.modified;
      var added = Object.keys(additions).map(function(id) {
        return registry.draggable.getById(id).getDimension(origin);
      }).sort(function(a, b) {
        return a.descriptor.index - b.descriptor.index;
      });
      var updated = Object.keys(modified).map(function(id) {
        var entry = registry.droppable.getById(id);
        var scroll3 = entry.callbacks.getScrollWhileDragging();
        return {
          droppableId: id,
          scroll: scroll3
        };
      });
      var result = {
        additions: added,
        removals: Object.keys(removals),
        modified: updated
      };
      staging = clean$1();
      finish();
      callbacks.publish(result);
    });
  }, "collect");
  var add3 = /* @__PURE__ */ __name(function add4(entry) {
    var id = entry.descriptor.id;
    staging.additions[id] = entry;
    staging.modified[entry.descriptor.droppableId] = true;
    if (staging.removals[id]) {
      delete staging.removals[id];
    }
    collect();
  }, "add");
  var remove = /* @__PURE__ */ __name(function remove2(entry) {
    var descriptor = entry.descriptor;
    staging.removals[descriptor.id] = true;
    staging.modified[descriptor.droppableId] = true;
    if (staging.additions[descriptor.id]) {
      delete staging.additions[descriptor.id];
    }
    collect();
  }, "remove");
  var stop = /* @__PURE__ */ __name(function stop2() {
    if (!frameId) {
      return;
    }
    cancelAnimationFrame(frameId);
    frameId = null;
    staging = clean$1();
  }, "stop");
  return {
    add: add3,
    remove,
    stop
  };
}
__name(createPublisher, "createPublisher");
var getMaxScroll = /* @__PURE__ */ __name(function(_ref) {
  var scrollHeight = _ref.scrollHeight, scrollWidth = _ref.scrollWidth, height = _ref.height, width = _ref.width;
  var maxScroll = subtract({
    x: scrollWidth,
    y: scrollHeight
  }, {
    x: width,
    y: height
  });
  var adjustedMaxScroll = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y)
  };
  return adjustedMaxScroll;
}, "getMaxScroll");
var getDocumentElement = /* @__PURE__ */ __name(function() {
  var doc = document.documentElement;
  !doc ? true ? invariant2(false, "Cannot find document.documentElement") : invariant2(false) : void 0;
  return doc;
}, "getDocumentElement");
var getMaxWindowScroll = /* @__PURE__ */ __name(function() {
  var doc = getDocumentElement();
  var maxScroll = getMaxScroll({
    scrollHeight: doc.scrollHeight,
    scrollWidth: doc.scrollWidth,
    width: doc.clientWidth,
    height: doc.clientHeight
  });
  return maxScroll;
}, "getMaxWindowScroll");
var getViewport = /* @__PURE__ */ __name(function() {
  var scroll3 = getWindowScroll3();
  var maxScroll = getMaxWindowScroll();
  var top = scroll3.y;
  var left = scroll3.x;
  var doc = getDocumentElement();
  var width = doc.clientWidth;
  var height = doc.clientHeight;
  var right = left + width;
  var bottom = top + height;
  var frame = getRect({
    top,
    left,
    right,
    bottom
  });
  var viewport = {
    frame,
    scroll: {
      initial: scroll3,
      current: scroll3,
      max: maxScroll,
      diff: {
        value: origin,
        displacement: origin
      }
    }
  };
  return viewport;
}, "getViewport");
var getInitialPublish = /* @__PURE__ */ __name(function(_ref) {
  var critical = _ref.critical, scrollOptions = _ref.scrollOptions, registry = _ref.registry;
  start();
  var viewport = getViewport();
  var windowScroll = viewport.scroll.current;
  var home2 = critical.droppable;
  var droppables = registry.droppable.getAllByType(home2.type).map(function(entry) {
    return entry.callbacks.getDimensionAndWatchScroll(windowScroll, scrollOptions);
  });
  var draggables = registry.draggable.getAllByType(critical.draggable.type).map(function(entry) {
    return entry.getDimension(windowScroll);
  });
  var dimensions = {
    draggables: toDraggableMap(draggables),
    droppables: toDroppableMap(droppables)
  };
  finish();
  var result = {
    dimensions,
    critical,
    viewport
  };
  return result;
}, "getInitialPublish");
function shouldPublishUpdate(registry, dragging, entry) {
  if (entry.descriptor.id === dragging.id) {
    return false;
  }
  if (entry.descriptor.type !== dragging.type) {
    return false;
  }
  var home2 = registry.droppable.getById(entry.descriptor.droppableId);
  if (home2.descriptor.mode !== "virtual") {
    true ? warning2("\n      You are attempting to add or remove a Draggable [id: " + entry.descriptor.id + "]\n      while a drag is occurring. This is only supported for virtual lists.\n\n      See https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/patterns/virtual-lists.md\n    ") : void 0;
    return false;
  }
  return true;
}
__name(shouldPublishUpdate, "shouldPublishUpdate");
var createDimensionMarshal = /* @__PURE__ */ __name(function(registry, callbacks) {
  var collection = null;
  var publisher = createPublisher({
    callbacks: {
      publish: callbacks.publishWhileDragging,
      collectionStarting: callbacks.collectionStarting
    },
    registry
  });
  var updateDroppableIsEnabled3 = /* @__PURE__ */ __name(function updateDroppableIsEnabled4(id, isEnabled) {
    !registry.droppable.exists(id) ? true ? invariant2(false, "Cannot update is enabled flag of Droppable " + id + " as it is not registered") : invariant2(false) : void 0;
    if (!collection) {
      return;
    }
    callbacks.updateDroppableIsEnabled({
      id,
      isEnabled
    });
  }, "updateDroppableIsEnabled");
  var updateDroppableIsCombineEnabled3 = /* @__PURE__ */ __name(function updateDroppableIsCombineEnabled4(id, isCombineEnabled) {
    if (!collection) {
      return;
    }
    !registry.droppable.exists(id) ? true ? invariant2(false, "Cannot update isCombineEnabled flag of Droppable " + id + " as it is not registered") : invariant2(false) : void 0;
    callbacks.updateDroppableIsCombineEnabled({
      id,
      isCombineEnabled
    });
  }, "updateDroppableIsCombineEnabled");
  var updateDroppableScroll3 = /* @__PURE__ */ __name(function updateDroppableScroll4(id, newScroll) {
    if (!collection) {
      return;
    }
    !registry.droppable.exists(id) ? true ? invariant2(false, "Cannot update the scroll on Droppable " + id + " as it is not registered") : invariant2(false) : void 0;
    callbacks.updateDroppableScroll({
      id,
      newScroll
    });
  }, "updateDroppableScroll");
  var scrollDroppable2 = /* @__PURE__ */ __name(function scrollDroppable3(id, change) {
    if (!collection) {
      return;
    }
    registry.droppable.getById(id).callbacks.scroll(change);
  }, "scrollDroppable");
  var stopPublishing = /* @__PURE__ */ __name(function stopPublishing2() {
    if (!collection) {
      return;
    }
    publisher.stop();
    var home2 = collection.critical.droppable;
    registry.droppable.getAllByType(home2.type).forEach(function(entry) {
      return entry.callbacks.dragStopped();
    });
    collection.unsubscribe();
    collection = null;
  }, "stopPublishing");
  var subscriber = /* @__PURE__ */ __name(function subscriber2(event) {
    !collection ? true ? invariant2(false, "Should only be subscribed when a collection is occurring") : invariant2(false) : void 0;
    var dragging = collection.critical.draggable;
    if (event.type === "ADDITION") {
      if (shouldPublishUpdate(registry, dragging, event.value)) {
        publisher.add(event.value);
      }
    }
    if (event.type === "REMOVAL") {
      if (shouldPublishUpdate(registry, dragging, event.value)) {
        publisher.remove(event.value);
      }
    }
  }, "subscriber");
  var startPublishing = /* @__PURE__ */ __name(function startPublishing2(request) {
    !!collection ? true ? invariant2(false, "Cannot start capturing critical dimensions as there is already a collection") : invariant2(false) : void 0;
    var entry = registry.draggable.getById(request.draggableId);
    var home2 = registry.droppable.getById(entry.descriptor.droppableId);
    var critical = {
      draggable: entry.descriptor,
      droppable: home2.descriptor
    };
    var unsubscribe = registry.subscribe(subscriber);
    collection = {
      critical,
      unsubscribe
    };
    return getInitialPublish({
      critical,
      registry,
      scrollOptions: request.scrollOptions
    });
  }, "startPublishing");
  var marshal = {
    updateDroppableIsEnabled: updateDroppableIsEnabled3,
    updateDroppableIsCombineEnabled: updateDroppableIsCombineEnabled3,
    scrollDroppable: scrollDroppable2,
    updateDroppableScroll: updateDroppableScroll3,
    startPublishing,
    stopPublishing
  };
  return marshal;
}, "createDimensionMarshal");
var canStartDrag = /* @__PURE__ */ __name(function(state, id) {
  if (state.phase === "IDLE") {
    return true;
  }
  if (state.phase !== "DROP_ANIMATING") {
    return false;
  }
  if (state.completed.result.draggableId === id) {
    return false;
  }
  return state.completed.result.reason === "DROP";
}, "canStartDrag");
var scrollWindow = /* @__PURE__ */ __name(function(change) {
  window.scrollBy(change.x, change.y);
}, "scrollWindow");
var getScrollableDroppables = memoize_one_esm_default(function(droppables) {
  return toDroppableList(droppables).filter(function(droppable2) {
    if (!droppable2.isEnabled) {
      return false;
    }
    if (!droppable2.frame) {
      return false;
    }
    return true;
  });
});
var getScrollableDroppableOver = /* @__PURE__ */ __name(function getScrollableDroppableOver2(target, droppables) {
  var maybe = find(getScrollableDroppables(droppables), function(droppable2) {
    !droppable2.frame ? true ? invariant2(false, "Invalid result") : invariant2(false) : void 0;
    return isPositionInFrame(droppable2.frame.pageMarginBox)(target);
  });
  return maybe;
}, "getScrollableDroppableOver");
var getBestScrollableDroppable = /* @__PURE__ */ __name(function(_ref) {
  var center = _ref.center, destination = _ref.destination, droppables = _ref.droppables;
  if (destination) {
    var _dimension = droppables[destination];
    if (!_dimension.frame) {
      return null;
    }
    return _dimension;
  }
  var dimension = getScrollableDroppableOver(center, droppables);
  return dimension;
}, "getBestScrollableDroppable");
var config = {
  startFromPercentage: 0.25,
  maxScrollAtPercentage: 0.05,
  maxPixelScroll: 28,
  ease: /* @__PURE__ */ __name(function ease(percentage) {
    return Math.pow(percentage, 2);
  }, "ease"),
  durationDampening: {
    stopDampeningAt: 1200,
    accelerateAt: 360
  }
};
var getDistanceThresholds = /* @__PURE__ */ __name(function(container, axis) {
  var startScrollingFrom = container[axis.size] * config.startFromPercentage;
  var maxScrollValueAt = container[axis.size] * config.maxScrollAtPercentage;
  var thresholds = {
    startScrollingFrom,
    maxScrollValueAt
  };
  return thresholds;
}, "getDistanceThresholds");
var getPercentage = /* @__PURE__ */ __name(function(_ref) {
  var startOfRange = _ref.startOfRange, endOfRange = _ref.endOfRange, current = _ref.current;
  var range = endOfRange - startOfRange;
  if (range === 0) {
    true ? warning2("\n      Detected distance range of 0 in the fluid auto scroller\n      This is unexpected and would cause a divide by 0 issue.\n      Not allowing an auto scroll\n    ") : void 0;
    return 0;
  }
  var currentInRange = current - startOfRange;
  var percentage = currentInRange / range;
  return percentage;
}, "getPercentage");
var minScroll = 1;
var getValueFromDistance = /* @__PURE__ */ __name(function(distanceToEdge, thresholds) {
  if (distanceToEdge > thresholds.startScrollingFrom) {
    return 0;
  }
  if (distanceToEdge <= thresholds.maxScrollValueAt) {
    return config.maxPixelScroll;
  }
  if (distanceToEdge === thresholds.startScrollingFrom) {
    return minScroll;
  }
  var percentageFromMaxScrollValueAt = getPercentage({
    startOfRange: thresholds.maxScrollValueAt,
    endOfRange: thresholds.startScrollingFrom,
    current: distanceToEdge
  });
  var percentageFromStartScrollingFrom = 1 - percentageFromMaxScrollValueAt;
  var scroll3 = config.maxPixelScroll * config.ease(percentageFromStartScrollingFrom);
  return Math.ceil(scroll3);
}, "getValueFromDistance");
var accelerateAt = config.durationDampening.accelerateAt;
var stopAt = config.durationDampening.stopDampeningAt;
var dampenValueByTime = /* @__PURE__ */ __name(function(proposedScroll, dragStartTime) {
  var startOfRange = dragStartTime;
  var endOfRange = stopAt;
  var now = Date.now();
  var runTime = now - startOfRange;
  if (runTime >= stopAt) {
    return proposedScroll;
  }
  if (runTime < accelerateAt) {
    return minScroll;
  }
  var betweenAccelerateAtAndStopAtPercentage = getPercentage({
    startOfRange: accelerateAt,
    endOfRange,
    current: runTime
  });
  var scroll3 = proposedScroll * config.ease(betweenAccelerateAtAndStopAtPercentage);
  return Math.ceil(scroll3);
}, "dampenValueByTime");
var getValue = /* @__PURE__ */ __name(function(_ref) {
  var distanceToEdge = _ref.distanceToEdge, thresholds = _ref.thresholds, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
  var scroll3 = getValueFromDistance(distanceToEdge, thresholds);
  if (scroll3 === 0) {
    return 0;
  }
  if (!shouldUseTimeDampening) {
    return scroll3;
  }
  return Math.max(dampenValueByTime(scroll3, dragStartTime), minScroll);
}, "getValue");
var getScrollOnAxis = /* @__PURE__ */ __name(function(_ref) {
  var container = _ref.container, distanceToEdges = _ref.distanceToEdges, dragStartTime = _ref.dragStartTime, axis = _ref.axis, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
  var thresholds = getDistanceThresholds(container, axis);
  var isCloserToEnd = distanceToEdges[axis.end] < distanceToEdges[axis.start];
  if (isCloserToEnd) {
    return getValue({
      distanceToEdge: distanceToEdges[axis.end],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening
    });
  }
  return -1 * getValue({
    distanceToEdge: distanceToEdges[axis.start],
    thresholds,
    dragStartTime,
    shouldUseTimeDampening
  });
}, "getScrollOnAxis");
var adjustForSizeLimits = /* @__PURE__ */ __name(function(_ref) {
  var container = _ref.container, subject = _ref.subject, proposedScroll = _ref.proposedScroll;
  var isTooBigVertically = subject.height > container.height;
  var isTooBigHorizontally = subject.width > container.width;
  if (!isTooBigHorizontally && !isTooBigVertically) {
    return proposedScroll;
  }
  if (isTooBigHorizontally && isTooBigVertically) {
    return null;
  }
  return {
    x: isTooBigHorizontally ? 0 : proposedScroll.x,
    y: isTooBigVertically ? 0 : proposedScroll.y
  };
}, "adjustForSizeLimits");
var clean$2 = apply(function(value) {
  return value === 0 ? 0 : value;
});
var getScroll = /* @__PURE__ */ __name(function(_ref) {
  var dragStartTime = _ref.dragStartTime, container = _ref.container, subject = _ref.subject, center = _ref.center, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
  var distanceToEdges = {
    top: center.y - container.top,
    right: container.right - center.x,
    bottom: container.bottom - center.y,
    left: center.x - container.left
  };
  var y = getScrollOnAxis({
    container,
    distanceToEdges,
    dragStartTime,
    axis: vertical,
    shouldUseTimeDampening
  });
  var x = getScrollOnAxis({
    container,
    distanceToEdges,
    dragStartTime,
    axis: horizontal,
    shouldUseTimeDampening
  });
  var required2 = clean$2({
    x,
    y
  });
  if (isEqual2(required2, origin)) {
    return null;
  }
  var limited = adjustForSizeLimits({
    container,
    subject,
    proposedScroll: required2
  });
  if (!limited) {
    return null;
  }
  return isEqual2(limited, origin) ? null : limited;
}, "getScroll");
var smallestSigned = apply(function(value) {
  if (value === 0) {
    return 0;
  }
  return value > 0 ? 1 : -1;
});
var getOverlap = /* @__PURE__ */ function() {
  var getRemainder = /* @__PURE__ */ __name(function getRemainder2(target, max) {
    if (target < 0) {
      return target;
    }
    if (target > max) {
      return target - max;
    }
    return 0;
  }, "getRemainder");
  return function(_ref) {
    var current = _ref.current, max = _ref.max, change = _ref.change;
    var targetScroll = add(current, change);
    var overlap = {
      x: getRemainder(targetScroll.x, max.x),
      y: getRemainder(targetScroll.y, max.y)
    };
    if (isEqual2(overlap, origin)) {
      return null;
    }
    return overlap;
  };
}();
var canPartiallyScroll = /* @__PURE__ */ __name(function canPartiallyScroll2(_ref2) {
  var rawMax = _ref2.max, current = _ref2.current, change = _ref2.change;
  var max = {
    x: Math.max(current.x, rawMax.x),
    y: Math.max(current.y, rawMax.y)
  };
  var smallestChange = smallestSigned(change);
  var overlap = getOverlap({
    max,
    current,
    change: smallestChange
  });
  if (!overlap) {
    return true;
  }
  if (smallestChange.x !== 0 && overlap.x === 0) {
    return true;
  }
  if (smallestChange.y !== 0 && overlap.y === 0) {
    return true;
  }
  return false;
}, "canPartiallyScroll");
var canScrollWindow = /* @__PURE__ */ __name(function canScrollWindow2(viewport, change) {
  return canPartiallyScroll({
    current: viewport.scroll.current,
    max: viewport.scroll.max,
    change
  });
}, "canScrollWindow");
var getWindowOverlap = /* @__PURE__ */ __name(function getWindowOverlap2(viewport, change) {
  if (!canScrollWindow(viewport, change)) {
    return null;
  }
  var max = viewport.scroll.max;
  var current = viewport.scroll.current;
  return getOverlap({
    current,
    max,
    change
  });
}, "getWindowOverlap");
var canScrollDroppable = /* @__PURE__ */ __name(function canScrollDroppable2(droppable2, change) {
  var frame = droppable2.frame;
  if (!frame) {
    return false;
  }
  return canPartiallyScroll({
    current: frame.scroll.current,
    max: frame.scroll.max,
    change
  });
}, "canScrollDroppable");
var getDroppableOverlap = /* @__PURE__ */ __name(function getDroppableOverlap2(droppable2, change) {
  var frame = droppable2.frame;
  if (!frame) {
    return null;
  }
  if (!canScrollDroppable(droppable2, change)) {
    return null;
  }
  return getOverlap({
    current: frame.scroll.current,
    max: frame.scroll.max,
    change
  });
}, "getDroppableOverlap");
var getWindowScrollChange = /* @__PURE__ */ __name(function(_ref) {
  var viewport = _ref.viewport, subject = _ref.subject, center = _ref.center, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
  var scroll3 = getScroll({
    dragStartTime,
    container: viewport.frame,
    subject,
    center,
    shouldUseTimeDampening
  });
  return scroll3 && canScrollWindow(viewport, scroll3) ? scroll3 : null;
}, "getWindowScrollChange");
var getDroppableScrollChange = /* @__PURE__ */ __name(function(_ref) {
  var droppable2 = _ref.droppable, subject = _ref.subject, center = _ref.center, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
  var frame = droppable2.frame;
  if (!frame) {
    return null;
  }
  var scroll3 = getScroll({
    dragStartTime,
    container: frame.pageMarginBox,
    subject,
    center,
    shouldUseTimeDampening
  });
  return scroll3 && canScrollDroppable(droppable2, scroll3) ? scroll3 : null;
}, "getDroppableScrollChange");
var scroll$1 = /* @__PURE__ */ __name(function(_ref) {
  var state = _ref.state, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening, scrollWindow2 = _ref.scrollWindow, scrollDroppable2 = _ref.scrollDroppable;
  var center = state.current.page.borderBoxCenter;
  var draggable2 = state.dimensions.draggables[state.critical.draggable.id];
  var subject = draggable2.page.marginBox;
  if (state.isWindowScrollAllowed) {
    var viewport = state.viewport;
    var _change = getWindowScrollChange({
      dragStartTime,
      viewport,
      subject,
      center,
      shouldUseTimeDampening
    });
    if (_change) {
      scrollWindow2(_change);
      return;
    }
  }
  var droppable2 = getBestScrollableDroppable({
    center,
    destination: whatIsDraggedOver(state.impact),
    droppables: state.dimensions.droppables
  });
  if (!droppable2) {
    return;
  }
  var change = getDroppableScrollChange({
    dragStartTime,
    droppable: droppable2,
    subject,
    center,
    shouldUseTimeDampening
  });
  if (change) {
    scrollDroppable2(droppable2.descriptor.id, change);
  }
}, "scroll$1");
var createFluidScroller = /* @__PURE__ */ __name(function(_ref) {
  var scrollWindow2 = _ref.scrollWindow, scrollDroppable2 = _ref.scrollDroppable;
  var scheduleWindowScroll = raf_schd_esm_default(scrollWindow2);
  var scheduleDroppableScroll = raf_schd_esm_default(scrollDroppable2);
  var dragging = null;
  var tryScroll = /* @__PURE__ */ __name(function tryScroll2(state) {
    !dragging ? true ? invariant2(false, "Cannot fluid scroll if not dragging") : invariant2(false) : void 0;
    var _dragging = dragging, shouldUseTimeDampening = _dragging.shouldUseTimeDampening, dragStartTime = _dragging.dragStartTime;
    scroll$1({
      state,
      scrollWindow: scheduleWindowScroll,
      scrollDroppable: scheduleDroppableScroll,
      dragStartTime,
      shouldUseTimeDampening
    });
  }, "tryScroll");
  var start$1 = /* @__PURE__ */ __name(function start$12(state) {
    start();
    !!dragging ? true ? invariant2(false, "Cannot start auto scrolling when already started") : invariant2(false) : void 0;
    var dragStartTime = Date.now();
    var wasScrollNeeded = false;
    var fakeScrollCallback = /* @__PURE__ */ __name(function fakeScrollCallback2() {
      wasScrollNeeded = true;
    }, "fakeScrollCallback");
    scroll$1({
      state,
      dragStartTime: 0,
      shouldUseTimeDampening: false,
      scrollWindow: fakeScrollCallback,
      scrollDroppable: fakeScrollCallback
    });
    dragging = {
      dragStartTime,
      shouldUseTimeDampening: wasScrollNeeded
    };
    finish();
    if (wasScrollNeeded) {
      tryScroll(state);
    }
  }, "start$1");
  var stop = /* @__PURE__ */ __name(function stop2() {
    if (!dragging) {
      return;
    }
    scheduleWindowScroll.cancel();
    scheduleDroppableScroll.cancel();
    dragging = null;
  }, "stop");
  return {
    start: start$1,
    stop,
    scroll: tryScroll
  };
}, "createFluidScroller");
var createJumpScroller = /* @__PURE__ */ __name(function(_ref) {
  var move3 = _ref.move, scrollDroppable2 = _ref.scrollDroppable, scrollWindow2 = _ref.scrollWindow;
  var moveByOffset = /* @__PURE__ */ __name(function moveByOffset2(state, offset3) {
    var client = add(state.current.client.selection, offset3);
    move3({
      client
    });
  }, "moveByOffset");
  var scrollDroppableAsMuchAsItCan = /* @__PURE__ */ __name(function scrollDroppableAsMuchAsItCan2(droppable2, change) {
    if (!canScrollDroppable(droppable2, change)) {
      return change;
    }
    var overlap = getDroppableOverlap(droppable2, change);
    if (!overlap) {
      scrollDroppable2(droppable2.descriptor.id, change);
      return null;
    }
    var whatTheDroppableCanScroll = subtract(change, overlap);
    scrollDroppable2(droppable2.descriptor.id, whatTheDroppableCanScroll);
    var remainder = subtract(change, whatTheDroppableCanScroll);
    return remainder;
  }, "scrollDroppableAsMuchAsItCan");
  var scrollWindowAsMuchAsItCan = /* @__PURE__ */ __name(function scrollWindowAsMuchAsItCan2(isWindowScrollAllowed, viewport, change) {
    if (!isWindowScrollAllowed) {
      return change;
    }
    if (!canScrollWindow(viewport, change)) {
      return change;
    }
    var overlap = getWindowOverlap(viewport, change);
    if (!overlap) {
      scrollWindow2(change);
      return null;
    }
    var whatTheWindowCanScroll = subtract(change, overlap);
    scrollWindow2(whatTheWindowCanScroll);
    var remainder = subtract(change, whatTheWindowCanScroll);
    return remainder;
  }, "scrollWindowAsMuchAsItCan");
  var jumpScroller = /* @__PURE__ */ __name(function jumpScroller2(state) {
    var request = state.scrollJumpRequest;
    if (!request) {
      return;
    }
    var destination = whatIsDraggedOver(state.impact);
    !destination ? true ? invariant2(false, "Cannot perform a jump scroll when there is no destination") : invariant2(false) : void 0;
    var droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimensions.droppables[destination], request);
    if (!droppableRemainder) {
      return;
    }
    var viewport = state.viewport;
    var windowRemainder = scrollWindowAsMuchAsItCan(state.isWindowScrollAllowed, viewport, droppableRemainder);
    if (!windowRemainder) {
      return;
    }
    moveByOffset(state, windowRemainder);
  }, "jumpScroller");
  return jumpScroller;
}, "createJumpScroller");
var createAutoScroller = /* @__PURE__ */ __name(function(_ref) {
  var scrollDroppable2 = _ref.scrollDroppable, scrollWindow2 = _ref.scrollWindow, move3 = _ref.move;
  var fluidScroller = createFluidScroller({
    scrollWindow: scrollWindow2,
    scrollDroppable: scrollDroppable2
  });
  var jumpScroll = createJumpScroller({
    move: move3,
    scrollWindow: scrollWindow2,
    scrollDroppable: scrollDroppable2
  });
  var scroll3 = /* @__PURE__ */ __name(function scroll4(state) {
    if (state.phase !== "DRAGGING") {
      return;
    }
    if (state.movementMode === "FLUID") {
      fluidScroller.scroll(state);
      return;
    }
    if (!state.scrollJumpRequest) {
      return;
    }
    jumpScroll(state);
  }, "scroll");
  var scroller = {
    scroll: scroll3,
    start: fluidScroller.start,
    stop: fluidScroller.stop
  };
  return scroller;
}, "createAutoScroller");
var prefix$1 = "data-rbd";
var dragHandle = function() {
  var base = prefix$1 + "-drag-handle";
  return {
    base,
    draggableId: base + "-draggable-id",
    contextId: base + "-context-id"
  };
}();
var draggable = function() {
  var base = prefix$1 + "-draggable";
  return {
    base,
    contextId: base + "-context-id",
    id: base + "-id"
  };
}();
var droppable = function() {
  var base = prefix$1 + "-droppable";
  return {
    base,
    contextId: base + "-context-id",
    id: base + "-id"
  };
}();
var scrollContainer = {
  contextId: prefix$1 + "-scroll-container-context-id"
};
var makeGetSelector = /* @__PURE__ */ __name(function makeGetSelector2(context) {
  return function(attribute) {
    return "[" + attribute + '="' + context + '"]';
  };
}, "makeGetSelector");
var getStyles = /* @__PURE__ */ __name(function getStyles2(rules, property) {
  return rules.map(function(rule) {
    var value = rule.styles[property];
    if (!value) {
      return "";
    }
    return rule.selector + " { " + value + " }";
  }).join(" ");
}, "getStyles");
var noPointerEvents = "pointer-events: none;";
var getStyles$1 = /* @__PURE__ */ __name(function(contextId) {
  var getSelector2 = makeGetSelector(contextId);
  var dragHandle$1 = function() {
    var grabCursor = "\n      cursor: -webkit-grab;\n      cursor: grab;\n    ";
    return {
      selector: getSelector2(dragHandle.contextId),
      styles: {
        always: "\n          -webkit-touch-callout: none;\n          -webkit-tap-highlight-color: rgba(0,0,0,0);\n          touch-action: manipulation;\n        ",
        resting: grabCursor,
        dragging: noPointerEvents,
        dropAnimating: grabCursor
      }
    };
  }();
  var draggable$1 = function() {
    var transition = "\n      transition: " + transitions.outOfTheWay + ";\n    ";
    return {
      selector: getSelector2(draggable.contextId),
      styles: {
        dragging: transition,
        dropAnimating: transition,
        userCancel: transition
      }
    };
  }();
  var droppable$1 = {
    selector: getSelector2(droppable.contextId),
    styles: {
      always: "overflow-anchor: none;"
    }
  };
  var body = {
    selector: "body",
    styles: {
      dragging: "\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        overflow-anchor: none;\n      "
    }
  };
  var rules = [draggable$1, dragHandle$1, droppable$1, body];
  return {
    always: getStyles(rules, "always"),
    resting: getStyles(rules, "resting"),
    dragging: getStyles(rules, "dragging"),
    dropAnimating: getStyles(rules, "dropAnimating"),
    userCancel: getStyles(rules, "userCancel")
  };
}, "getStyles$1");
var useIsomorphicLayoutEffect2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? import_react9.useLayoutEffect : import_react9.useEffect;
var getHead = /* @__PURE__ */ __name(function getHead2() {
  var head = document.querySelector("head");
  !head ? true ? invariant2(false, "Cannot find the head to append a style to") : invariant2(false) : void 0;
  return head;
}, "getHead");
var createStyleEl = /* @__PURE__ */ __name(function createStyleEl2(nonce) {
  var el = document.createElement("style");
  if (nonce) {
    el.setAttribute("nonce", nonce);
  }
  el.type = "text/css";
  return el;
}, "createStyleEl");
function useStyleMarshal(contextId, nonce) {
  var styles = useMemo4(function() {
    return getStyles$1(contextId);
  }, [contextId]);
  var alwaysRef = (0, import_react9.useRef)(null);
  var dynamicRef = (0, import_react9.useRef)(null);
  var setDynamicStyle = useCallback(memoize_one_esm_default(function(proposed) {
    var el = dynamicRef.current;
    !el ? true ? invariant2(false, "Cannot set dynamic style element if it is not set") : invariant2(false) : void 0;
    el.textContent = proposed;
  }), []);
  var setAlwaysStyle = useCallback(function(proposed) {
    var el = alwaysRef.current;
    !el ? true ? invariant2(false, "Cannot set dynamic style element if it is not set") : invariant2(false) : void 0;
    el.textContent = proposed;
  }, []);
  useIsomorphicLayoutEffect2(function() {
    !(!alwaysRef.current && !dynamicRef.current) ? true ? invariant2(false, "style elements already mounted") : invariant2(false) : void 0;
    var always = createStyleEl(nonce);
    var dynamic = createStyleEl(nonce);
    alwaysRef.current = always;
    dynamicRef.current = dynamic;
    always.setAttribute(prefix$1 + "-always", contextId);
    dynamic.setAttribute(prefix$1 + "-dynamic", contextId);
    getHead().appendChild(always);
    getHead().appendChild(dynamic);
    setAlwaysStyle(styles.always);
    setDynamicStyle(styles.resting);
    return function() {
      var remove = /* @__PURE__ */ __name(function remove2(ref2) {
        var current = ref2.current;
        !current ? true ? invariant2(false, "Cannot unmount ref as it is not set") : invariant2(false) : void 0;
        getHead().removeChild(current);
        ref2.current = null;
      }, "remove");
      remove(alwaysRef);
      remove(dynamicRef);
    };
  }, [nonce, setAlwaysStyle, setDynamicStyle, styles.always, styles.resting, contextId]);
  var dragging = useCallback(function() {
    return setDynamicStyle(styles.dragging);
  }, [setDynamicStyle, styles.dragging]);
  var dropping = useCallback(function(reason) {
    if (reason === "DROP") {
      setDynamicStyle(styles.dropAnimating);
      return;
    }
    setDynamicStyle(styles.userCancel);
  }, [setDynamicStyle, styles.dropAnimating, styles.userCancel]);
  var resting = useCallback(function() {
    if (!dynamicRef.current) {
      return;
    }
    setDynamicStyle(styles.resting);
  }, [setDynamicStyle, styles.resting]);
  var marshal = useMemo4(function() {
    return {
      dragging,
      dropping,
      resting
    };
  }, [dragging, dropping, resting]);
  return marshal;
}
__name(useStyleMarshal, "useStyleMarshal");
var getWindowFromEl = /* @__PURE__ */ __name(function(el) {
  return el && el.ownerDocument ? el.ownerDocument.defaultView : window;
}, "getWindowFromEl");
function isHtmlElement(el) {
  return el instanceof getWindowFromEl(el).HTMLElement;
}
__name(isHtmlElement, "isHtmlElement");
function findDragHandle(contextId, draggableId) {
  var selector = "[" + dragHandle.contextId + '="' + contextId + '"]';
  var possible = toArray(document.querySelectorAll(selector));
  if (!possible.length) {
    true ? warning2('Unable to find any drag handles in the context "' + contextId + '"') : void 0;
    return null;
  }
  var handle = find(possible, function(el) {
    return el.getAttribute(dragHandle.draggableId) === draggableId;
  });
  if (!handle) {
    true ? warning2('Unable to find drag handle with id "' + draggableId + '" as no handle with a matching id was found') : void 0;
    return null;
  }
  if (!isHtmlElement(handle)) {
    true ? warning2("drag handle needs to be a HTMLElement") : void 0;
    return null;
  }
  return handle;
}
__name(findDragHandle, "findDragHandle");
function useFocusMarshal(contextId) {
  var entriesRef = (0, import_react9.useRef)({});
  var recordRef = (0, import_react9.useRef)(null);
  var restoreFocusFrameRef = (0, import_react9.useRef)(null);
  var isMountedRef = (0, import_react9.useRef)(false);
  var register = useCallback(/* @__PURE__ */ __name(function register2(id, focus2) {
    var entry = {
      id,
      focus: focus2
    };
    entriesRef.current[id] = entry;
    return /* @__PURE__ */ __name(function unregister() {
      var entries = entriesRef.current;
      var current = entries[id];
      if (current !== entry) {
        delete entries[id];
      }
    }, "unregister");
  }, "register"), []);
  var tryGiveFocus = useCallback(/* @__PURE__ */ __name(function tryGiveFocus2(tryGiveFocusTo) {
    var handle = findDragHandle(contextId, tryGiveFocusTo);
    if (handle && handle !== document.activeElement) {
      handle.focus();
    }
  }, "tryGiveFocus"), [contextId]);
  var tryShiftRecord = useCallback(/* @__PURE__ */ __name(function tryShiftRecord2(previous, redirectTo) {
    if (recordRef.current === previous) {
      recordRef.current = redirectTo;
    }
  }, "tryShiftRecord"), []);
  var tryRestoreFocusRecorded = useCallback(/* @__PURE__ */ __name(function tryRestoreFocusRecorded2() {
    if (restoreFocusFrameRef.current) {
      return;
    }
    if (!isMountedRef.current) {
      return;
    }
    restoreFocusFrameRef.current = requestAnimationFrame(function() {
      restoreFocusFrameRef.current = null;
      var record = recordRef.current;
      if (record) {
        tryGiveFocus(record);
      }
    });
  }, "tryRestoreFocusRecorded"), [tryGiveFocus]);
  var tryRecordFocus = useCallback(/* @__PURE__ */ __name(function tryRecordFocus2(id) {
    recordRef.current = null;
    var focused = document.activeElement;
    if (!focused) {
      return;
    }
    if (focused.getAttribute(dragHandle.draggableId) !== id) {
      return;
    }
    recordRef.current = id;
  }, "tryRecordFocus"), []);
  useIsomorphicLayoutEffect2(function() {
    isMountedRef.current = true;
    return /* @__PURE__ */ __name(function clearFrameOnUnmount() {
      isMountedRef.current = false;
      var frameId = restoreFocusFrameRef.current;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    }, "clearFrameOnUnmount");
  }, []);
  var marshal = useMemo4(function() {
    return {
      register,
      tryRecordFocus,
      tryRestoreFocusRecorded,
      tryShiftRecord
    };
  }, [register, tryRecordFocus, tryRestoreFocusRecorded, tryShiftRecord]);
  return marshal;
}
__name(useFocusMarshal, "useFocusMarshal");
function createRegistry() {
  var entries = {
    draggables: {},
    droppables: {}
  };
  var subscribers = [];
  function subscribe(cb) {
    subscribers.push(cb);
    return /* @__PURE__ */ __name(function unsubscribe() {
      var index = subscribers.indexOf(cb);
      if (index === -1) {
        return;
      }
      subscribers.splice(index, 1);
    }, "unsubscribe");
  }
  __name(subscribe, "subscribe");
  function notify2(event) {
    if (subscribers.length) {
      subscribers.forEach(function(cb) {
        return cb(event);
      });
    }
  }
  __name(notify2, "notify");
  function findDraggableById(id) {
    return entries.draggables[id] || null;
  }
  __name(findDraggableById, "findDraggableById");
  function getDraggableById(id) {
    var entry = findDraggableById(id);
    !entry ? true ? invariant2(false, "Cannot find draggable entry with id [" + id + "]") : invariant2(false) : void 0;
    return entry;
  }
  __name(getDraggableById, "getDraggableById");
  var draggableAPI = {
    register: /* @__PURE__ */ __name(function register(entry) {
      entries.draggables[entry.descriptor.id] = entry;
      notify2({
        type: "ADDITION",
        value: entry
      });
    }, "register"),
    update: /* @__PURE__ */ __name(function update2(entry, last) {
      var current = entries.draggables[last.descriptor.id];
      if (!current) {
        return;
      }
      if (current.uniqueId !== entry.uniqueId) {
        return;
      }
      delete entries.draggables[last.descriptor.id];
      entries.draggables[entry.descriptor.id] = entry;
    }, "update"),
    unregister: /* @__PURE__ */ __name(function unregister(entry) {
      var draggableId = entry.descriptor.id;
      var current = findDraggableById(draggableId);
      if (!current) {
        return;
      }
      if (entry.uniqueId !== current.uniqueId) {
        return;
      }
      delete entries.draggables[draggableId];
      notify2({
        type: "REMOVAL",
        value: entry
      });
    }, "unregister"),
    getById: getDraggableById,
    findById: findDraggableById,
    exists: /* @__PURE__ */ __name(function exists(id) {
      return Boolean(findDraggableById(id));
    }, "exists"),
    getAllByType: /* @__PURE__ */ __name(function getAllByType(type) {
      return values(entries.draggables).filter(function(entry) {
        return entry.descriptor.type === type;
      });
    }, "getAllByType")
  };
  function findDroppableById(id) {
    return entries.droppables[id] || null;
  }
  __name(findDroppableById, "findDroppableById");
  function getDroppableById(id) {
    var entry = findDroppableById(id);
    !entry ? true ? invariant2(false, "Cannot find droppable entry with id [" + id + "]") : invariant2(false) : void 0;
    return entry;
  }
  __name(getDroppableById, "getDroppableById");
  var droppableAPI = {
    register: /* @__PURE__ */ __name(function register(entry) {
      entries.droppables[entry.descriptor.id] = entry;
    }, "register"),
    unregister: /* @__PURE__ */ __name(function unregister(entry) {
      var current = findDroppableById(entry.descriptor.id);
      if (!current) {
        return;
      }
      if (entry.uniqueId !== current.uniqueId) {
        return;
      }
      delete entries.droppables[entry.descriptor.id];
    }, "unregister"),
    getById: getDroppableById,
    findById: findDroppableById,
    exists: /* @__PURE__ */ __name(function exists(id) {
      return Boolean(findDroppableById(id));
    }, "exists"),
    getAllByType: /* @__PURE__ */ __name(function getAllByType(type) {
      return values(entries.droppables).filter(function(entry) {
        return entry.descriptor.type === type;
      });
    }, "getAllByType")
  };
  function clean4() {
    entries.draggables = {};
    entries.droppables = {};
    subscribers.length = 0;
  }
  __name(clean4, "clean");
  return {
    draggable: draggableAPI,
    droppable: droppableAPI,
    subscribe,
    clean: clean4
  };
}
__name(createRegistry, "createRegistry");
function useRegistry() {
  var registry = useMemo4(createRegistry, []);
  (0, import_react9.useEffect)(function() {
    return /* @__PURE__ */ __name(function unmount() {
      requestAnimationFrame(registry.clean);
    }, "unmount");
  }, [registry]);
  return registry;
}
__name(useRegistry, "useRegistry");
var StoreContext = import_react9.default.createContext(null);
var getBodyElement = /* @__PURE__ */ __name(function() {
  var body = document.body;
  !body ? true ? invariant2(false, "Cannot find document.body") : invariant2(false) : void 0;
  return body;
}, "getBodyElement");
var visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  border: "0",
  padding: "0",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(100%)"
};
var getId = /* @__PURE__ */ __name(function getId2(contextId) {
  return "rbd-announcement-" + contextId;
}, "getId");
function useAnnouncer(contextId) {
  var id = useMemo4(function() {
    return getId(contextId);
  }, [contextId]);
  var ref2 = (0, import_react9.useRef)(null);
  (0, import_react9.useEffect)(/* @__PURE__ */ __name(function setup() {
    var el = document.createElement("div");
    ref2.current = el;
    el.id = id;
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    _extends(el.style, visuallyHidden);
    getBodyElement().appendChild(el);
    return /* @__PURE__ */ __name(function cleanup() {
      setTimeout(/* @__PURE__ */ __name(function remove() {
        var body = getBodyElement();
        if (body.contains(el)) {
          body.removeChild(el);
        }
        if (el === ref2.current) {
          ref2.current = null;
        }
      }, "remove"));
    }, "cleanup");
  }, "setup"), [id]);
  var announce = useCallback(function(message) {
    var el = ref2.current;
    if (el) {
      el.textContent = message;
      return;
    }
    true ? warning2('\n      A screen reader message was trying to be announced but it was unable to do so.\n      This can occur if you unmount your <DragDropContext /> in your onDragEnd.\n      Consider calling provided.announce() before the unmount so that the instruction will\n      not be lost for users relying on a screen reader.\n\n      Message not passed to screen reader:\n\n      "' + message + '"\n    ') : void 0;
  }, []);
  return announce;
}
__name(useAnnouncer, "useAnnouncer");
var count = 0;
var defaults = {
  separator: "::"
};
function reset() {
  count = 0;
}
__name(reset, "reset");
function useUniqueId(prefix2, options) {
  if (options === void 0) {
    options = defaults;
  }
  return useMemo4(function() {
    return "" + prefix2 + options.separator + count++;
  }, [options.separator, prefix2]);
}
__name(useUniqueId, "useUniqueId");
function getElementId(_ref) {
  var contextId = _ref.contextId, uniqueId = _ref.uniqueId;
  return "rbd-hidden-text-" + contextId + "-" + uniqueId;
}
__name(getElementId, "getElementId");
function useHiddenTextElement(_ref2) {
  var contextId = _ref2.contextId, text = _ref2.text;
  var uniqueId = useUniqueId("hidden-text", {
    separator: "-"
  });
  var id = useMemo4(function() {
    return getElementId({
      contextId,
      uniqueId
    });
  }, [uniqueId, contextId]);
  (0, import_react9.useEffect)(/* @__PURE__ */ __name(function mount() {
    var el = document.createElement("div");
    el.id = id;
    el.textContent = text;
    el.style.display = "none";
    getBodyElement().appendChild(el);
    return /* @__PURE__ */ __name(function unmount() {
      var body = getBodyElement();
      if (body.contains(el)) {
        body.removeChild(el);
      }
    }, "unmount");
  }, "mount"), [id, text]);
  return id;
}
__name(useHiddenTextElement, "useHiddenTextElement");
var AppContext = import_react9.default.createContext(null);
var peerDependencies = {
  react: "^16.8.5 || ^17.0.0 || ^18.0.0",
  "react-dom": "^16.8.5 || ^17.0.0 || ^18.0.0"
};
var semver = /(\d+)\.(\d+)\.(\d+)/;
var getVersion = /* @__PURE__ */ __name(function getVersion2(value) {
  var result = semver.exec(value);
  !(result != null) ? true ? invariant2(false, "Unable to parse React version " + value) : invariant2(false) : void 0;
  var major = Number(result[1]);
  var minor = Number(result[2]);
  var patch3 = Number(result[3]);
  return {
    major,
    minor,
    patch: patch3,
    raw: value
  };
}, "getVersion");
var isSatisfied = /* @__PURE__ */ __name(function isSatisfied2(expected, actual) {
  if (actual.major > expected.major) {
    return true;
  }
  if (actual.major < expected.major) {
    return false;
  }
  if (actual.minor > expected.minor) {
    return true;
  }
  if (actual.minor < expected.minor) {
    return false;
  }
  return actual.patch >= expected.patch;
}, "isSatisfied");
var checkReactVersion = /* @__PURE__ */ __name(function(peerDepValue, actualValue) {
  var peerDep = getVersion(peerDepValue);
  var actual = getVersion(actualValue);
  if (isSatisfied(peerDep, actual)) {
    return;
  }
  true ? warning2("\n    React version: [" + actual.raw + "]\n    does not satisfy expected peer dependency version: [" + peerDep.raw + "]\n\n    This can result in run time bugs, and even fatal crashes\n  ") : void 0;
}, "checkReactVersion");
var suffix = "\n  We expect a html5 doctype: <!doctype html>\n  This is to ensure consistent browser layout and measurement\n\n  More information: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/doctype.md\n";
var checkDoctype = /* @__PURE__ */ __name(function(doc) {
  var doctype = doc.doctype;
  if (!doctype) {
    true ? warning2("\n      No <!doctype html> found.\n\n      " + suffix + "\n    ") : void 0;
    return;
  }
  if (doctype.name.toLowerCase() !== "html") {
    true ? warning2("\n      Unexpected <!doctype> found: (" + doctype.name + ")\n\n      " + suffix + "\n    ") : void 0;
  }
  if (doctype.publicId !== "") {
    true ? warning2("\n      Unexpected <!doctype> publicId found: (" + doctype.publicId + ")\n      A html5 doctype does not have a publicId\n\n      " + suffix + "\n    ") : void 0;
  }
}, "checkDoctype");
function useDev(useHook) {
  if (true) {
    useHook();
  }
}
__name(useDev, "useDev");
function useDevSetupWarning(fn, inputs) {
  useDev(function() {
    (0, import_react9.useEffect)(function() {
      try {
        fn();
      } catch (e) {
        error("\n          A setup problem was encountered.\n\n          > " + e.message + "\n        ");
      }
    }, inputs);
  });
}
__name(useDevSetupWarning, "useDevSetupWarning");
function useStartupValidation() {
  useDevSetupWarning(function() {
    checkReactVersion(peerDependencies.react, import_react9.default.version);
    checkDoctype(document);
  }, []);
}
__name(useStartupValidation, "useStartupValidation");
function usePrevious(current) {
  var ref2 = (0, import_react9.useRef)(current);
  (0, import_react9.useEffect)(function() {
    ref2.current = current;
  });
  return ref2;
}
__name(usePrevious, "usePrevious");
function create() {
  var lock = null;
  function isClaimed() {
    return Boolean(lock);
  }
  __name(isClaimed, "isClaimed");
  function isActive(value) {
    return value === lock;
  }
  __name(isActive, "isActive");
  function claim(abandon) {
    !!lock ? true ? invariant2(false, "Cannot claim lock as it is already claimed") : invariant2(false) : void 0;
    var newLock = {
      abandon
    };
    lock = newLock;
    return newLock;
  }
  __name(claim, "claim");
  function release() {
    !lock ? true ? invariant2(false, "Cannot release lock when there is no lock") : invariant2(false) : void 0;
    lock = null;
  }
  __name(release, "release");
  function tryAbandon() {
    if (lock) {
      lock.abandon();
      release();
    }
  }
  __name(tryAbandon, "tryAbandon");
  return {
    isClaimed,
    isActive,
    claim,
    release,
    tryAbandon
  };
}
__name(create, "create");
var tab = 9;
var enter = 13;
var escape = 27;
var space = 32;
var pageUp = 33;
var pageDown = 34;
var end = 35;
var home = 36;
var arrowLeft = 37;
var arrowUp = 38;
var arrowRight = 39;
var arrowDown = 40;
var _preventedKeys;
var preventedKeys = (_preventedKeys = {}, _preventedKeys[enter] = true, _preventedKeys[tab] = true, _preventedKeys);
var preventStandardKeyEvents = /* @__PURE__ */ __name(function(event) {
  if (preventedKeys[event.keyCode]) {
    event.preventDefault();
  }
}, "preventStandardKeyEvents");
var supportedEventName = function() {
  var base = "visibilitychange";
  if (typeof document === "undefined") {
    return base;
  }
  var candidates = [base, "ms" + base, "webkit" + base, "moz" + base, "o" + base];
  var supported = find(candidates, function(eventName) {
    return "on" + eventName in document;
  });
  return supported || base;
}();
var primaryButton = 0;
var sloppyClickThreshold = 5;
function isSloppyClickThresholdExceeded(original, current) {
  return Math.abs(current.x - original.x) >= sloppyClickThreshold || Math.abs(current.y - original.y) >= sloppyClickThreshold;
}
__name(isSloppyClickThresholdExceeded, "isSloppyClickThresholdExceeded");
var idle$1 = {
  type: "IDLE"
};
function getCaptureBindings(_ref) {
  var cancel = _ref.cancel, completed = _ref.completed, getPhase = _ref.getPhase, setPhase = _ref.setPhase;
  return [{
    eventName: "mousemove",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var button = event.button, clientX = event.clientX, clientY = event.clientY;
      if (button !== primaryButton) {
        return;
      }
      var point = {
        x: clientX,
        y: clientY
      };
      var phase = getPhase();
      if (phase.type === "DRAGGING") {
        event.preventDefault();
        phase.actions.move(point);
        return;
      }
      !(phase.type === "PENDING") ? true ? invariant2(false, "Cannot be IDLE") : invariant2(false) : void 0;
      var pending = phase.point;
      if (!isSloppyClickThresholdExceeded(pending, point)) {
        return;
      }
      event.preventDefault();
      var actions = phase.actions.fluidLift(point);
      setPhase({
        type: "DRAGGING",
        actions
      });
    }, "fn")
  }, {
    eventName: "mouseup",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      if (phase.type !== "DRAGGING") {
        cancel();
        return;
      }
      event.preventDefault();
      phase.actions.drop({
        shouldBlockNextClick: true
      });
      completed();
    }, "fn")
  }, {
    eventName: "mousedown",
    fn: /* @__PURE__ */ __name(function fn(event) {
      if (getPhase().type === "DRAGGING") {
        event.preventDefault();
      }
      cancel();
    }, "fn")
  }, {
    eventName: "keydown",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      if (phase.type === "PENDING") {
        cancel();
        return;
      }
      if (event.keyCode === escape) {
        event.preventDefault();
        cancel();
        return;
      }
      preventStandardKeyEvents(event);
    }, "fn")
  }, {
    eventName: "resize",
    fn: cancel
  }, {
    eventName: "scroll",
    options: {
      passive: true,
      capture: false
    },
    fn: /* @__PURE__ */ __name(function fn() {
      if (getPhase().type === "PENDING") {
        cancel();
      }
    }, "fn")
  }, {
    eventName: "webkitmouseforcedown",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      !(phase.type !== "IDLE") ? true ? invariant2(false, "Unexpected phase") : invariant2(false) : void 0;
      if (phase.actions.shouldRespectForcePress()) {
        cancel();
        return;
      }
      event.preventDefault();
    }, "fn")
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];
}
__name(getCaptureBindings, "getCaptureBindings");
function useMouseSensor(api) {
  var phaseRef = (0, import_react9.useRef)(idle$1);
  var unbindEventsRef = (0, import_react9.useRef)(noop);
  var startCaptureBinding = useMemo4(function() {
    return {
      eventName: "mousedown",
      fn: /* @__PURE__ */ __name(function onMouseDown(event) {
        if (event.defaultPrevented) {
          return;
        }
        if (event.button !== primaryButton) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
          return;
        }
        var draggableId = api.findClosestDraggableId(event);
        if (!draggableId) {
          return;
        }
        var actions = api.tryGetLock(draggableId, stop, {
          sourceEvent: event
        });
        if (!actions) {
          return;
        }
        event.preventDefault();
        var point = {
          x: event.clientX,
          y: event.clientY
        };
        unbindEventsRef.current();
        startPendingDrag(actions, point);
      }, "onMouseDown")
    };
  }, [api]);
  var preventForcePressBinding = useMemo4(function() {
    return {
      eventName: "webkitmouseforcewillbegin",
      fn: /* @__PURE__ */ __name(function fn(event) {
        if (event.defaultPrevented) {
          return;
        }
        var id = api.findClosestDraggableId(event);
        if (!id) {
          return;
        }
        var options = api.findOptionsForDraggable(id);
        if (!options) {
          return;
        }
        if (options.shouldRespectForcePress) {
          return;
        }
        if (!api.canGetLock(id)) {
          return;
        }
        event.preventDefault();
      }, "fn")
    };
  }, [api]);
  var listenForCapture = useCallback(/* @__PURE__ */ __name(function listenForCapture2() {
    var options = {
      passive: false,
      capture: true
    };
    unbindEventsRef.current = bindEvents(window, [preventForcePressBinding, startCaptureBinding], options);
  }, "listenForCapture"), [preventForcePressBinding, startCaptureBinding]);
  var stop = useCallback(function() {
    var current = phaseRef.current;
    if (current.type === "IDLE") {
      return;
    }
    phaseRef.current = idle$1;
    unbindEventsRef.current();
    listenForCapture();
  }, [listenForCapture]);
  var cancel = useCallback(function() {
    var phase = phaseRef.current;
    stop();
    if (phase.type === "DRAGGING") {
      phase.actions.cancel({
        shouldBlockNextClick: true
      });
    }
    if (phase.type === "PENDING") {
      phase.actions.abort();
    }
  }, [stop]);
  var bindCapturingEvents = useCallback(/* @__PURE__ */ __name(function bindCapturingEvents2() {
    var options = {
      capture: true,
      passive: false
    };
    var bindings = getCaptureBindings({
      cancel,
      completed: stop,
      getPhase: /* @__PURE__ */ __name(function getPhase() {
        return phaseRef.current;
      }, "getPhase"),
      setPhase: /* @__PURE__ */ __name(function setPhase(phase) {
        phaseRef.current = phase;
      }, "setPhase")
    });
    unbindEventsRef.current = bindEvents(window, bindings, options);
  }, "bindCapturingEvents"), [cancel, stop]);
  var startPendingDrag = useCallback(/* @__PURE__ */ __name(function startPendingDrag2(actions, point) {
    !(phaseRef.current.type === "IDLE") ? true ? invariant2(false, "Expected to move from IDLE to PENDING drag") : invariant2(false) : void 0;
    phaseRef.current = {
      type: "PENDING",
      point,
      actions
    };
    bindCapturingEvents();
  }, "startPendingDrag"), [bindCapturingEvents]);
  useIsomorphicLayoutEffect2(/* @__PURE__ */ __name(function mount() {
    listenForCapture();
    return /* @__PURE__ */ __name(function unmount() {
      unbindEventsRef.current();
    }, "unmount");
  }, "mount"), [listenForCapture]);
}
__name(useMouseSensor, "useMouseSensor");
var _scrollJumpKeys;
function noop$1() {
}
__name(noop$1, "noop$1");
var scrollJumpKeys = (_scrollJumpKeys = {}, _scrollJumpKeys[pageDown] = true, _scrollJumpKeys[pageUp] = true, _scrollJumpKeys[home] = true, _scrollJumpKeys[end] = true, _scrollJumpKeys);
function getDraggingBindings(actions, stop) {
  function cancel() {
    stop();
    actions.cancel();
  }
  __name(cancel, "cancel");
  function drop5() {
    stop();
    actions.drop();
  }
  __name(drop5, "drop");
  return [{
    eventName: "keydown",
    fn: /* @__PURE__ */ __name(function fn(event) {
      if (event.keyCode === escape) {
        event.preventDefault();
        cancel();
        return;
      }
      if (event.keyCode === space) {
        event.preventDefault();
        drop5();
        return;
      }
      if (event.keyCode === arrowDown) {
        event.preventDefault();
        actions.moveDown();
        return;
      }
      if (event.keyCode === arrowUp) {
        event.preventDefault();
        actions.moveUp();
        return;
      }
      if (event.keyCode === arrowRight) {
        event.preventDefault();
        actions.moveRight();
        return;
      }
      if (event.keyCode === arrowLeft) {
        event.preventDefault();
        actions.moveLeft();
        return;
      }
      if (scrollJumpKeys[event.keyCode]) {
        event.preventDefault();
        return;
      }
      preventStandardKeyEvents(event);
    }, "fn")
  }, {
    eventName: "mousedown",
    fn: cancel
  }, {
    eventName: "mouseup",
    fn: cancel
  }, {
    eventName: "click",
    fn: cancel
  }, {
    eventName: "touchstart",
    fn: cancel
  }, {
    eventName: "resize",
    fn: cancel
  }, {
    eventName: "wheel",
    fn: cancel,
    options: {
      passive: true
    }
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];
}
__name(getDraggingBindings, "getDraggingBindings");
function useKeyboardSensor(api) {
  var unbindEventsRef = (0, import_react9.useRef)(noop$1);
  var startCaptureBinding = useMemo4(function() {
    return {
      eventName: "keydown",
      fn: /* @__PURE__ */ __name(function onKeyDown(event) {
        if (event.defaultPrevented) {
          return;
        }
        if (event.keyCode !== space) {
          return;
        }
        var draggableId = api.findClosestDraggableId(event);
        if (!draggableId) {
          return;
        }
        var preDrag = api.tryGetLock(draggableId, stop, {
          sourceEvent: event
        });
        if (!preDrag) {
          return;
        }
        event.preventDefault();
        var isCapturing = true;
        var actions = preDrag.snapLift();
        unbindEventsRef.current();
        function stop() {
          !isCapturing ? true ? invariant2(false, "Cannot stop capturing a keyboard drag when not capturing") : invariant2(false) : void 0;
          isCapturing = false;
          unbindEventsRef.current();
          listenForCapture();
        }
        __name(stop, "stop");
        unbindEventsRef.current = bindEvents(window, getDraggingBindings(actions, stop), {
          capture: true,
          passive: false
        });
      }, "onKeyDown")
    };
  }, [api]);
  var listenForCapture = useCallback(/* @__PURE__ */ __name(function tryStartCapture() {
    var options = {
      passive: false,
      capture: true
    };
    unbindEventsRef.current = bindEvents(window, [startCaptureBinding], options);
  }, "tryStartCapture"), [startCaptureBinding]);
  useIsomorphicLayoutEffect2(/* @__PURE__ */ __name(function mount() {
    listenForCapture();
    return /* @__PURE__ */ __name(function unmount() {
      unbindEventsRef.current();
    }, "unmount");
  }, "mount"), [listenForCapture]);
}
__name(useKeyboardSensor, "useKeyboardSensor");
var idle$2 = {
  type: "IDLE"
};
var timeForLongPress = 120;
var forcePressThreshold = 0.15;
function getWindowBindings(_ref) {
  var cancel = _ref.cancel, getPhase = _ref.getPhase;
  return [{
    eventName: "orientationchange",
    fn: cancel
  }, {
    eventName: "resize",
    fn: cancel
  }, {
    eventName: "contextmenu",
    fn: /* @__PURE__ */ __name(function fn(event) {
      event.preventDefault();
    }, "fn")
  }, {
    eventName: "keydown",
    fn: /* @__PURE__ */ __name(function fn(event) {
      if (getPhase().type !== "DRAGGING") {
        cancel();
        return;
      }
      if (event.keyCode === escape) {
        event.preventDefault();
      }
      cancel();
    }, "fn")
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];
}
__name(getWindowBindings, "getWindowBindings");
function getHandleBindings(_ref2) {
  var cancel = _ref2.cancel, completed = _ref2.completed, getPhase = _ref2.getPhase;
  return [{
    eventName: "touchmove",
    options: {
      capture: false
    },
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      if (phase.type !== "DRAGGING") {
        cancel();
        return;
      }
      phase.hasMoved = true;
      var _event$touches$ = event.touches[0], clientX = _event$touches$.clientX, clientY = _event$touches$.clientY;
      var point = {
        x: clientX,
        y: clientY
      };
      event.preventDefault();
      phase.actions.move(point);
    }, "fn")
  }, {
    eventName: "touchend",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      if (phase.type !== "DRAGGING") {
        cancel();
        return;
      }
      event.preventDefault();
      phase.actions.drop({
        shouldBlockNextClick: true
      });
      completed();
    }, "fn")
  }, {
    eventName: "touchcancel",
    fn: /* @__PURE__ */ __name(function fn(event) {
      if (getPhase().type !== "DRAGGING") {
        cancel();
        return;
      }
      event.preventDefault();
      cancel();
    }, "fn")
  }, {
    eventName: "touchforcechange",
    fn: /* @__PURE__ */ __name(function fn(event) {
      var phase = getPhase();
      !(phase.type !== "IDLE") ? true ? invariant2(false) : invariant2(false) : void 0;
      var touch = event.touches[0];
      if (!touch) {
        return;
      }
      var isForcePress = touch.force >= forcePressThreshold;
      if (!isForcePress) {
        return;
      }
      var shouldRespect = phase.actions.shouldRespectForcePress();
      if (phase.type === "PENDING") {
        if (shouldRespect) {
          cancel();
        }
        return;
      }
      if (shouldRespect) {
        if (phase.hasMoved) {
          event.preventDefault();
          return;
        }
        cancel();
        return;
      }
      event.preventDefault();
    }, "fn")
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];
}
__name(getHandleBindings, "getHandleBindings");
function useTouchSensor(api) {
  var phaseRef = (0, import_react9.useRef)(idle$2);
  var unbindEventsRef = (0, import_react9.useRef)(noop);
  var getPhase = useCallback(/* @__PURE__ */ __name(function getPhase2() {
    return phaseRef.current;
  }, "getPhase"), []);
  var setPhase = useCallback(/* @__PURE__ */ __name(function setPhase2(phase) {
    phaseRef.current = phase;
  }, "setPhase"), []);
  var startCaptureBinding = useMemo4(function() {
    return {
      eventName: "touchstart",
      fn: /* @__PURE__ */ __name(function onTouchStart(event) {
        if (event.defaultPrevented) {
          return;
        }
        var draggableId = api.findClosestDraggableId(event);
        if (!draggableId) {
          return;
        }
        var actions = api.tryGetLock(draggableId, stop, {
          sourceEvent: event
        });
        if (!actions) {
          return;
        }
        var touch = event.touches[0];
        var clientX = touch.clientX, clientY = touch.clientY;
        var point = {
          x: clientX,
          y: clientY
        };
        unbindEventsRef.current();
        startPendingDrag(actions, point);
      }, "onTouchStart")
    };
  }, [api]);
  var listenForCapture = useCallback(/* @__PURE__ */ __name(function listenForCapture2() {
    var options = {
      capture: true,
      passive: false
    };
    unbindEventsRef.current = bindEvents(window, [startCaptureBinding], options);
  }, "listenForCapture"), [startCaptureBinding]);
  var stop = useCallback(function() {
    var current = phaseRef.current;
    if (current.type === "IDLE") {
      return;
    }
    if (current.type === "PENDING") {
      clearTimeout(current.longPressTimerId);
    }
    setPhase(idle$2);
    unbindEventsRef.current();
    listenForCapture();
  }, [listenForCapture, setPhase]);
  var cancel = useCallback(function() {
    var phase = phaseRef.current;
    stop();
    if (phase.type === "DRAGGING") {
      phase.actions.cancel({
        shouldBlockNextClick: true
      });
    }
    if (phase.type === "PENDING") {
      phase.actions.abort();
    }
  }, [stop]);
  var bindCapturingEvents = useCallback(/* @__PURE__ */ __name(function bindCapturingEvents2() {
    var options = {
      capture: true,
      passive: false
    };
    var args = {
      cancel,
      completed: stop,
      getPhase
    };
    var unbindTarget = bindEvents(window, getHandleBindings(args), options);
    var unbindWindow = bindEvents(window, getWindowBindings(args), options);
    unbindEventsRef.current = /* @__PURE__ */ __name(function unbindAll() {
      unbindTarget();
      unbindWindow();
    }, "unbindAll");
  }, "bindCapturingEvents"), [cancel, getPhase, stop]);
  var startDragging = useCallback(/* @__PURE__ */ __name(function startDragging2() {
    var phase = getPhase();
    !(phase.type === "PENDING") ? true ? invariant2(false, "Cannot start dragging from phase " + phase.type) : invariant2(false) : void 0;
    var actions = phase.actions.fluidLift(phase.point);
    setPhase({
      type: "DRAGGING",
      actions,
      hasMoved: false
    });
  }, "startDragging"), [getPhase, setPhase]);
  var startPendingDrag = useCallback(/* @__PURE__ */ __name(function startPendingDrag2(actions, point) {
    !(getPhase().type === "IDLE") ? true ? invariant2(false, "Expected to move from IDLE to PENDING drag") : invariant2(false) : void 0;
    var longPressTimerId = setTimeout(startDragging, timeForLongPress);
    setPhase({
      type: "PENDING",
      point,
      actions,
      longPressTimerId
    });
    bindCapturingEvents();
  }, "startPendingDrag"), [bindCapturingEvents, getPhase, setPhase, startDragging]);
  useIsomorphicLayoutEffect2(/* @__PURE__ */ __name(function mount() {
    listenForCapture();
    return /* @__PURE__ */ __name(function unmount() {
      unbindEventsRef.current();
      var phase = getPhase();
      if (phase.type === "PENDING") {
        clearTimeout(phase.longPressTimerId);
        setPhase(idle$2);
      }
    }, "unmount");
  }, "mount"), [getPhase, listenForCapture, setPhase]);
  useIsomorphicLayoutEffect2(/* @__PURE__ */ __name(function webkitHack() {
    var unbind = bindEvents(window, [{
      eventName: "touchmove",
      fn: /* @__PURE__ */ __name(function fn() {
      }, "fn"),
      options: {
        capture: false,
        passive: false
      }
    }]);
    return unbind;
  }, "webkitHack"), []);
}
__name(useTouchSensor, "useTouchSensor");
function useValidateSensorHooks(sensorHooks) {
  useDev(function() {
    var previousRef = usePrevious(sensorHooks);
    useDevSetupWarning(function() {
      !(previousRef.current.length === sensorHooks.length) ? true ? invariant2(false, "Cannot change the amount of sensor hooks after mounting") : invariant2(false) : void 0;
    });
  });
}
__name(useValidateSensorHooks, "useValidateSensorHooks");
var interactiveTagNames = {
  input: true,
  button: true,
  textarea: true,
  select: true,
  option: true,
  optgroup: true,
  video: true,
  audio: true
};
function isAnInteractiveElement(parent, current) {
  if (current == null) {
    return false;
  }
  var hasAnInteractiveTag = Boolean(interactiveTagNames[current.tagName.toLowerCase()]);
  if (hasAnInteractiveTag) {
    return true;
  }
  var attribute = current.getAttribute("contenteditable");
  if (attribute === "true" || attribute === "") {
    return true;
  }
  if (current === parent) {
    return false;
  }
  return isAnInteractiveElement(parent, current.parentElement);
}
__name(isAnInteractiveElement, "isAnInteractiveElement");
function isEventInInteractiveElement(draggable2, event) {
  var target = event.target;
  if (!isHtmlElement(target)) {
    return false;
  }
  return isAnInteractiveElement(draggable2, target);
}
__name(isEventInInteractiveElement, "isEventInInteractiveElement");
var getBorderBoxCenterPosition = /* @__PURE__ */ __name(function(el) {
  return getRect(el.getBoundingClientRect()).center;
}, "getBorderBoxCenterPosition");
function isElement(el) {
  return el instanceof getWindowFromEl(el).Element;
}
__name(isElement, "isElement");
var supportedMatchesName = function() {
  var base = "matches";
  if (typeof document === "undefined") {
    return base;
  }
  var candidates = [base, "msMatchesSelector", "webkitMatchesSelector"];
  var value = find(candidates, function(name) {
    return name in Element.prototype;
  });
  return value || base;
}();
function closestPonyfill(el, selector) {
  if (el == null) {
    return null;
  }
  if (el[supportedMatchesName](selector)) {
    return el;
  }
  return closestPonyfill(el.parentElement, selector);
}
__name(closestPonyfill, "closestPonyfill");
function closest$1(el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }
  return closestPonyfill(el, selector);
}
__name(closest$1, "closest$1");
function getSelector(contextId) {
  return "[" + dragHandle.contextId + '="' + contextId + '"]';
}
__name(getSelector, "getSelector");
function findClosestDragHandleFromEvent(contextId, event) {
  var target = event.target;
  if (!isElement(target)) {
    true ? warning2("event.target must be a Element") : void 0;
    return null;
  }
  var selector = getSelector(contextId);
  var handle = closest$1(target, selector);
  if (!handle) {
    return null;
  }
  if (!isHtmlElement(handle)) {
    true ? warning2("drag handle must be a HTMLElement") : void 0;
    return null;
  }
  return handle;
}
__name(findClosestDragHandleFromEvent, "findClosestDragHandleFromEvent");
function tryGetClosestDraggableIdFromEvent(contextId, event) {
  var handle = findClosestDragHandleFromEvent(contextId, event);
  if (!handle) {
    return null;
  }
  return handle.getAttribute(dragHandle.draggableId);
}
__name(tryGetClosestDraggableIdFromEvent, "tryGetClosestDraggableIdFromEvent");
function findDraggable(contextId, draggableId) {
  var selector = "[" + draggable.contextId + '="' + contextId + '"]';
  var possible = toArray(document.querySelectorAll(selector));
  var draggable$1 = find(possible, function(el) {
    return el.getAttribute(draggable.id) === draggableId;
  });
  if (!draggable$1) {
    return null;
  }
  if (!isHtmlElement(draggable$1)) {
    true ? warning2("Draggable element is not a HTMLElement") : void 0;
    return null;
  }
  return draggable$1;
}
__name(findDraggable, "findDraggable");
function preventDefault(event) {
  event.preventDefault();
}
__name(preventDefault, "preventDefault");
function _isActive(_ref) {
  var expected = _ref.expected, phase = _ref.phase, isLockActive = _ref.isLockActive, shouldWarn = _ref.shouldWarn;
  if (!isLockActive()) {
    if (shouldWarn) {
      true ? warning2("\n        Cannot perform action.\n        The sensor no longer has an action lock.\n\n        Tips:\n\n        - Throw away your action handlers when forceStop() is called\n        - Check actions.isActive() if you really need to\n      ") : void 0;
    }
    return false;
  }
  if (expected !== phase) {
    if (shouldWarn) {
      true ? warning2("\n        Cannot perform action.\n        The actions you used belong to an outdated phase\n\n        Current phase: " + expected + "\n        You called an action from outdated phase: " + phase + "\n\n        Tips:\n\n        - Do not use preDragActions actions after calling preDragActions.lift()\n      ") : void 0;
    }
    return false;
  }
  return true;
}
__name(_isActive, "_isActive");
function canStart(_ref2) {
  var lockAPI = _ref2.lockAPI, store = _ref2.store, registry = _ref2.registry, draggableId = _ref2.draggableId;
  if (lockAPI.isClaimed()) {
    return false;
  }
  var entry = registry.draggable.findById(draggableId);
  if (!entry) {
    true ? warning2("Unable to find draggable with id: " + draggableId) : void 0;
    return false;
  }
  if (!entry.options.isEnabled) {
    return false;
  }
  if (!canStartDrag(store.getState(), draggableId)) {
    return false;
  }
  return true;
}
__name(canStart, "canStart");
function tryStart(_ref3) {
  var lockAPI = _ref3.lockAPI, contextId = _ref3.contextId, store = _ref3.store, registry = _ref3.registry, draggableId = _ref3.draggableId, forceSensorStop = _ref3.forceSensorStop, sourceEvent = _ref3.sourceEvent;
  var shouldStart = canStart({
    lockAPI,
    store,
    registry,
    draggableId
  });
  if (!shouldStart) {
    return null;
  }
  var entry = registry.draggable.getById(draggableId);
  var el = findDraggable(contextId, entry.descriptor.id);
  if (!el) {
    true ? warning2("Unable to find draggable element with id: " + draggableId) : void 0;
    return null;
  }
  if (sourceEvent && !entry.options.canDragInteractiveElements && isEventInInteractiveElement(el, sourceEvent)) {
    return null;
  }
  var lock = lockAPI.claim(forceSensorStop || noop);
  var phase = "PRE_DRAG";
  function getShouldRespectForcePress() {
    return entry.options.shouldRespectForcePress;
  }
  __name(getShouldRespectForcePress, "getShouldRespectForcePress");
  function isLockActive() {
    return lockAPI.isActive(lock);
  }
  __name(isLockActive, "isLockActive");
  function tryDispatch(expected, getAction) {
    if (_isActive({
      expected,
      phase,
      isLockActive,
      shouldWarn: true
    })) {
      store.dispatch(getAction());
    }
  }
  __name(tryDispatch, "tryDispatch");
  var tryDispatchWhenDragging = tryDispatch.bind(null, "DRAGGING");
  function lift$12(args) {
    function completed() {
      lockAPI.release();
      phase = "COMPLETED";
    }
    __name(completed, "completed");
    if (phase !== "PRE_DRAG") {
      completed();
      !(phase === "PRE_DRAG") ? true ? invariant2(false, "Cannot lift in phase " + phase) : invariant2(false) : void 0;
    }
    store.dispatch(lift(args.liftActionArgs));
    phase = "DRAGGING";
    function finish3(reason, options) {
      if (options === void 0) {
        options = {
          shouldBlockNextClick: false
        };
      }
      args.cleanup();
      if (options.shouldBlockNextClick) {
        var unbind = bindEvents(window, [{
          eventName: "click",
          fn: preventDefault,
          options: {
            once: true,
            passive: false,
            capture: true
          }
        }]);
        setTimeout(unbind);
      }
      completed();
      store.dispatch(drop({
        reason
      }));
    }
    __name(finish3, "finish");
    return _extends({
      isActive: /* @__PURE__ */ __name(function isActive() {
        return _isActive({
          expected: "DRAGGING",
          phase,
          isLockActive,
          shouldWarn: false
        });
      }, "isActive"),
      shouldRespectForcePress: getShouldRespectForcePress,
      drop: /* @__PURE__ */ __name(function drop5(options) {
        return finish3("DROP", options);
      }, "drop"),
      cancel: /* @__PURE__ */ __name(function cancel(options) {
        return finish3("CANCEL", options);
      }, "cancel")
    }, args.actions);
  }
  __name(lift$12, "lift$1");
  function fluidLift(clientSelection) {
    var move$1 = raf_schd_esm_default(function(client) {
      tryDispatchWhenDragging(function() {
        return move({
          client
        });
      });
    });
    var api = lift$12({
      liftActionArgs: {
        id: draggableId,
        clientSelection,
        movementMode: "FLUID"
      },
      cleanup: /* @__PURE__ */ __name(function cleanup() {
        return move$1.cancel();
      }, "cleanup"),
      actions: {
        move: move$1
      }
    });
    return _extends({}, api, {
      move: move$1
    });
  }
  __name(fluidLift, "fluidLift");
  function snapLift() {
    var actions = {
      moveUp: /* @__PURE__ */ __name(function moveUp$1() {
        return tryDispatchWhenDragging(moveUp);
      }, "moveUp$1"),
      moveRight: /* @__PURE__ */ __name(function moveRight$1() {
        return tryDispatchWhenDragging(moveRight);
      }, "moveRight$1"),
      moveDown: /* @__PURE__ */ __name(function moveDown$1() {
        return tryDispatchWhenDragging(moveDown);
      }, "moveDown$1"),
      moveLeft: /* @__PURE__ */ __name(function moveLeft$1() {
        return tryDispatchWhenDragging(moveLeft);
      }, "moveLeft$1")
    };
    return lift$12({
      liftActionArgs: {
        id: draggableId,
        clientSelection: getBorderBoxCenterPosition(el),
        movementMode: "SNAP"
      },
      cleanup: noop,
      actions
    });
  }
  __name(snapLift, "snapLift");
  function abortPreDrag() {
    var shouldRelease = _isActive({
      expected: "PRE_DRAG",
      phase,
      isLockActive,
      shouldWarn: true
    });
    if (shouldRelease) {
      lockAPI.release();
    }
  }
  __name(abortPreDrag, "abortPreDrag");
  var preDrag = {
    isActive: /* @__PURE__ */ __name(function isActive() {
      return _isActive({
        expected: "PRE_DRAG",
        phase,
        isLockActive,
        shouldWarn: false
      });
    }, "isActive"),
    shouldRespectForcePress: getShouldRespectForcePress,
    fluidLift,
    snapLift,
    abort: abortPreDrag
  };
  return preDrag;
}
__name(tryStart, "tryStart");
var defaultSensors = [useMouseSensor, useKeyboardSensor, useTouchSensor];
function useSensorMarshal(_ref4) {
  var contextId = _ref4.contextId, store = _ref4.store, registry = _ref4.registry, customSensors = _ref4.customSensors, enableDefaultSensors = _ref4.enableDefaultSensors;
  var useSensors = [].concat(enableDefaultSensors ? defaultSensors : [], customSensors || []);
  var lockAPI = (0, import_react9.useState)(function() {
    return create();
  })[0];
  var tryAbandonLock = useCallback(/* @__PURE__ */ __name(function tryAbandonLock2(previous, current) {
    if (previous.isDragging && !current.isDragging) {
      lockAPI.tryAbandon();
    }
  }, "tryAbandonLock"), [lockAPI]);
  useIsomorphicLayoutEffect2(/* @__PURE__ */ __name(function listenToStore() {
    var previous = store.getState();
    var unsubscribe = store.subscribe(function() {
      var current = store.getState();
      tryAbandonLock(previous, current);
      previous = current;
    });
    return unsubscribe;
  }, "listenToStore"), [lockAPI, store, tryAbandonLock]);
  useIsomorphicLayoutEffect2(function() {
    return lockAPI.tryAbandon;
  }, [lockAPI.tryAbandon]);
  var canGetLock = useCallback(function(draggableId) {
    return canStart({
      lockAPI,
      registry,
      store,
      draggableId
    });
  }, [lockAPI, registry, store]);
  var tryGetLock = useCallback(function(draggableId, forceStop, options) {
    return tryStart({
      lockAPI,
      registry,
      contextId,
      store,
      draggableId,
      forceSensorStop: forceStop,
      sourceEvent: options && options.sourceEvent ? options.sourceEvent : null
    });
  }, [contextId, lockAPI, registry, store]);
  var findClosestDraggableId = useCallback(function(event) {
    return tryGetClosestDraggableIdFromEvent(contextId, event);
  }, [contextId]);
  var findOptionsForDraggable = useCallback(function(id) {
    var entry = registry.draggable.findById(id);
    return entry ? entry.options : null;
  }, [registry.draggable]);
  var tryReleaseLock = useCallback(/* @__PURE__ */ __name(function tryReleaseLock2() {
    if (!lockAPI.isClaimed()) {
      return;
    }
    lockAPI.tryAbandon();
    if (store.getState().phase !== "IDLE") {
      store.dispatch(flush());
    }
  }, "tryReleaseLock"), [lockAPI, store]);
  var isLockClaimed = useCallback(lockAPI.isClaimed, [lockAPI]);
  var api = useMemo4(function() {
    return {
      canGetLock,
      tryGetLock,
      findClosestDraggableId,
      findOptionsForDraggable,
      tryReleaseLock,
      isLockClaimed
    };
  }, [canGetLock, tryGetLock, findClosestDraggableId, findOptionsForDraggable, tryReleaseLock, isLockClaimed]);
  useValidateSensorHooks(useSensors);
  for (var i = 0; i < useSensors.length; i++) {
    useSensors[i](api);
  }
}
__name(useSensorMarshal, "useSensorMarshal");
var createResponders = /* @__PURE__ */ __name(function createResponders2(props) {
  return {
    onBeforeCapture: props.onBeforeCapture,
    onBeforeDragStart: props.onBeforeDragStart,
    onDragStart: props.onDragStart,
    onDragEnd: props.onDragEnd,
    onDragUpdate: props.onDragUpdate
  };
}, "createResponders");
function getStore(lazyRef) {
  !lazyRef.current ? true ? invariant2(false, "Could not find store from lazy ref") : invariant2(false) : void 0;
  return lazyRef.current;
}
__name(getStore, "getStore");
function App(props) {
  var contextId = props.contextId, setCallbacks = props.setCallbacks, sensors = props.sensors, nonce = props.nonce, dragHandleUsageInstructions2 = props.dragHandleUsageInstructions;
  var lazyStoreRef = (0, import_react9.useRef)(null);
  useStartupValidation();
  var lastPropsRef = usePrevious(props);
  var getResponders = useCallback(function() {
    return createResponders(lastPropsRef.current);
  }, [lastPropsRef]);
  var announce = useAnnouncer(contextId);
  var dragHandleUsageInstructionsId = useHiddenTextElement({
    contextId,
    text: dragHandleUsageInstructions2
  });
  var styleMarshal = useStyleMarshal(contextId, nonce);
  var lazyDispatch = useCallback(function(action) {
    getStore(lazyStoreRef).dispatch(action);
  }, []);
  var marshalCallbacks = useMemo4(function() {
    return bindActionCreators({
      publishWhileDragging,
      updateDroppableScroll,
      updateDroppableIsEnabled,
      updateDroppableIsCombineEnabled,
      collectionStarting
    }, lazyDispatch);
  }, [lazyDispatch]);
  var registry = useRegistry();
  var dimensionMarshal = useMemo4(function() {
    return createDimensionMarshal(registry, marshalCallbacks);
  }, [registry, marshalCallbacks]);
  var autoScroller = useMemo4(function() {
    return createAutoScroller(_extends({
      scrollWindow,
      scrollDroppable: dimensionMarshal.scrollDroppable
    }, bindActionCreators({
      move
    }, lazyDispatch)));
  }, [dimensionMarshal.scrollDroppable, lazyDispatch]);
  var focusMarshal = useFocusMarshal(contextId);
  var store = useMemo4(function() {
    return createStore2({
      announce,
      autoScroller,
      dimensionMarshal,
      focusMarshal,
      getResponders,
      styleMarshal
    });
  }, [announce, autoScroller, dimensionMarshal, focusMarshal, getResponders, styleMarshal]);
  if (true) {
    if (lazyStoreRef.current && lazyStoreRef.current !== store) {
      true ? warning2("unexpected store change") : void 0;
    }
  }
  lazyStoreRef.current = store;
  var tryResetStore = useCallback(function() {
    var current = getStore(lazyStoreRef);
    var state = current.getState();
    if (state.phase !== "IDLE") {
      current.dispatch(flush());
    }
  }, []);
  var isDragging = useCallback(function() {
    var state = getStore(lazyStoreRef).getState();
    return state.isDragging || state.phase === "DROP_ANIMATING";
  }, []);
  var appCallbacks = useMemo4(function() {
    return {
      isDragging,
      tryAbort: tryResetStore
    };
  }, [isDragging, tryResetStore]);
  setCallbacks(appCallbacks);
  var getCanLift = useCallback(function(id) {
    return canStartDrag(getStore(lazyStoreRef).getState(), id);
  }, []);
  var getIsMovementAllowed = useCallback(function() {
    return isMovementAllowed(getStore(lazyStoreRef).getState());
  }, []);
  var appContext = useMemo4(function() {
    return {
      marshal: dimensionMarshal,
      focus: focusMarshal,
      contextId,
      canLift: getCanLift,
      isMovementAllowed: getIsMovementAllowed,
      dragHandleUsageInstructionsId,
      registry
    };
  }, [contextId, dimensionMarshal, dragHandleUsageInstructionsId, focusMarshal, getCanLift, getIsMovementAllowed, registry]);
  useSensorMarshal({
    contextId,
    store,
    registry,
    customSensors: sensors,
    enableDefaultSensors: props.enableDefaultSensors !== false
  });
  (0, import_react9.useEffect)(function() {
    return tryResetStore;
  }, [tryResetStore]);
  return import_react9.default.createElement(AppContext.Provider, {
    value: appContext
  }, import_react9.default.createElement(Provider_default, {
    context: StoreContext,
    store
  }, props.children));
}
__name(App, "App");
var count$1 = 0;
function reset$1() {
  count$1 = 0;
}
__name(reset$1, "reset$1");
function useInstanceCount() {
  return useMemo4(function() {
    return "" + count$1++;
  }, []);
}
__name(useInstanceCount, "useInstanceCount");
function resetServerContext() {
  reset$1();
  reset();
}
__name(resetServerContext, "resetServerContext");
function DragDropContext(props) {
  var contextId = useInstanceCount();
  var dragHandleUsageInstructions2 = props.dragHandleUsageInstructions || preset.dragHandleUsageInstructions;
  return import_react9.default.createElement(ErrorBoundary, null, function(setCallbacks) {
    return import_react9.default.createElement(App, {
      nonce: props.nonce,
      contextId,
      setCallbacks,
      dragHandleUsageInstructions: dragHandleUsageInstructions2,
      enableDefaultSensors: props.enableDefaultSensors,
      sensors: props.sensors,
      onBeforeCapture: props.onBeforeCapture,
      onBeforeDragStart: props.onBeforeDragStart,
      onDragStart: props.onDragStart,
      onDragUpdate: props.onDragUpdate,
      onDragEnd: props.onDragEnd
    }, props.children);
  });
}
__name(DragDropContext, "DragDropContext");
var isEqual$1 = /* @__PURE__ */ __name(function isEqual4(base) {
  return function(value) {
    return base === value;
  };
}, "isEqual");
var isScroll = isEqual$1("scroll");
var isAuto = isEqual$1("auto");
var isVisible$1 = isEqual$1("visible");
var isEither = /* @__PURE__ */ __name(function isEither2(overflow, fn) {
  return fn(overflow.overflowX) || fn(overflow.overflowY);
}, "isEither");
var isBoth = /* @__PURE__ */ __name(function isBoth2(overflow, fn) {
  return fn(overflow.overflowX) && fn(overflow.overflowY);
}, "isBoth");
var isElementScrollable = /* @__PURE__ */ __name(function isElementScrollable2(el) {
  var style2 = window.getComputedStyle(el);
  var overflow = {
    overflowX: style2.overflowX,
    overflowY: style2.overflowY
  };
  return isEither(overflow, isScroll) || isEither(overflow, isAuto);
}, "isElementScrollable");
var isBodyScrollable = /* @__PURE__ */ __name(function isBodyScrollable2() {
  if (false) {
    return false;
  }
  var body = getBodyElement();
  var html = document.documentElement;
  !html ? true ? invariant2(false) : invariant2(false) : void 0;
  if (!isElementScrollable(body)) {
    return false;
  }
  var htmlStyle = window.getComputedStyle(html);
  var htmlOverflow = {
    overflowX: htmlStyle.overflowX,
    overflowY: htmlStyle.overflowY
  };
  if (isBoth(htmlOverflow, isVisible$1)) {
    return false;
  }
  true ? warning2("\n    We have detected that your <body> element might be a scroll container.\n    We have found no reliable way of detecting whether the <body> element is a scroll container.\n    Under most circumstances a <body> scroll bar will be on the <html> element (document.documentElement)\n\n    Because we cannot determine if the <body> is a scroll container, and generally it is not one,\n    we will be treating the <body> as *not* a scroll container\n\n    More information: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/how-we-detect-scroll-containers.md\n  ") : void 0;
  return false;
}, "isBodyScrollable");
var getClosestScrollable = /* @__PURE__ */ __name(function getClosestScrollable2(el) {
  if (el == null) {
    return null;
  }
  if (el === document.body) {
    return isBodyScrollable() ? el : null;
  }
  if (el === document.documentElement) {
    return null;
  }
  if (!isElementScrollable(el)) {
    return getClosestScrollable2(el.parentElement);
  }
  return el;
}, "getClosestScrollable");
var checkForNestedScrollContainers = /* @__PURE__ */ __name(function(scrollable) {
  if (!scrollable) {
    return;
  }
  var anotherScrollParent = getClosestScrollable(scrollable.parentElement);
  if (!anotherScrollParent) {
    return;
  }
  true ? warning2("\n    Droppable: unsupported nested scroll container detected.\n    A Droppable can only have one scroll parent (which can be itself)\n    Nested scroll containers are currently not supported.\n\n    We hope to support nested scroll containers soon: https://github.com/atlassian/react-beautiful-dnd/issues/131\n  ") : void 0;
}, "checkForNestedScrollContainers");
var getScroll$1 = /* @__PURE__ */ __name(function(el) {
  return {
    x: el.scrollLeft,
    y: el.scrollTop
  };
}, "getScroll$1");
var getIsFixed = /* @__PURE__ */ __name(function getIsFixed2(el) {
  if (!el) {
    return false;
  }
  var style2 = window.getComputedStyle(el);
  if (style2.position === "fixed") {
    return true;
  }
  return getIsFixed2(el.parentElement);
}, "getIsFixed");
var getEnv = /* @__PURE__ */ __name(function(start3) {
  var closestScrollable = getClosestScrollable(start3);
  var isFixedOnPage = getIsFixed(start3);
  return {
    closestScrollable,
    isFixedOnPage
  };
}, "getEnv");
var getDroppableDimension = /* @__PURE__ */ __name(function(_ref) {
  var descriptor = _ref.descriptor, isEnabled = _ref.isEnabled, isCombineEnabled = _ref.isCombineEnabled, isFixedOnPage = _ref.isFixedOnPage, direction = _ref.direction, client = _ref.client, page = _ref.page, closest3 = _ref.closest;
  var frame = function() {
    if (!closest3) {
      return null;
    }
    var scrollSize = closest3.scrollSize, frameClient = closest3.client;
    var maxScroll = getMaxScroll({
      scrollHeight: scrollSize.scrollHeight,
      scrollWidth: scrollSize.scrollWidth,
      height: frameClient.paddingBox.height,
      width: frameClient.paddingBox.width
    });
    return {
      pageMarginBox: closest3.page.marginBox,
      frameClient,
      scrollSize,
      shouldClipSubject: closest3.shouldClipSubject,
      scroll: {
        initial: closest3.scroll,
        current: closest3.scroll,
        max: maxScroll,
        diff: {
          value: origin,
          displacement: origin
        }
      }
    };
  }();
  var axis = direction === "vertical" ? vertical : horizontal;
  var subject = getSubject({
    page,
    withPlaceholder: null,
    axis,
    frame
  });
  var dimension = {
    descriptor,
    isCombineEnabled,
    isFixedOnPage,
    axis,
    isEnabled,
    client,
    page,
    frame,
    subject
  };
  return dimension;
}, "getDroppableDimension");
var getClient = /* @__PURE__ */ __name(function getClient2(targetRef, closestScrollable) {
  var base = getBox(targetRef);
  if (!closestScrollable) {
    return base;
  }
  if (targetRef !== closestScrollable) {
    return base;
  }
  var top = base.paddingBox.top - closestScrollable.scrollTop;
  var left = base.paddingBox.left - closestScrollable.scrollLeft;
  var bottom = top + closestScrollable.scrollHeight;
  var right = left + closestScrollable.scrollWidth;
  var paddingBox = {
    top,
    right,
    bottom,
    left
  };
  var borderBox = expand(paddingBox, base.border);
  var client = createBox({
    borderBox,
    margin: base.margin,
    border: base.border,
    padding: base.padding
  });
  return client;
}, "getClient");
var getDimension = /* @__PURE__ */ __name(function(_ref) {
  var ref2 = _ref.ref, descriptor = _ref.descriptor, env = _ref.env, windowScroll = _ref.windowScroll, direction = _ref.direction, isDropDisabled = _ref.isDropDisabled, isCombineEnabled = _ref.isCombineEnabled, shouldClipSubject = _ref.shouldClipSubject;
  var closestScrollable = env.closestScrollable;
  var client = getClient(ref2, closestScrollable);
  var page = withScroll(client, windowScroll);
  var closest3 = function() {
    if (!closestScrollable) {
      return null;
    }
    var frameClient = getBox(closestScrollable);
    var scrollSize = {
      scrollHeight: closestScrollable.scrollHeight,
      scrollWidth: closestScrollable.scrollWidth
    };
    return {
      client: frameClient,
      page: withScroll(frameClient, windowScroll),
      scroll: getScroll$1(closestScrollable),
      scrollSize,
      shouldClipSubject
    };
  }();
  var dimension = getDroppableDimension({
    descriptor,
    isEnabled: !isDropDisabled,
    isCombineEnabled,
    isFixedOnPage: env.isFixedOnPage,
    direction,
    client,
    page,
    closest: closest3
  });
  return dimension;
}, "getDimension");
var immediate = {
  passive: false
};
var delayed = {
  passive: true
};
var getListenerOptions = /* @__PURE__ */ __name(function(options) {
  return options.shouldPublishImmediately ? immediate : delayed;
}, "getListenerOptions");
function useRequiredContext(Context) {
  var result = (0, import_react9.useContext)(Context);
  !result ? true ? invariant2(false, "Could not find required context") : invariant2(false) : void 0;
  return result;
}
__name(useRequiredContext, "useRequiredContext");
var getClosestScrollableFromDrag = /* @__PURE__ */ __name(function getClosestScrollableFromDrag2(dragging) {
  return dragging && dragging.env.closestScrollable || null;
}, "getClosestScrollableFromDrag");
function useDroppablePublisher(args) {
  var whileDraggingRef = (0, import_react9.useRef)(null);
  var appContext = useRequiredContext(AppContext);
  var uniqueId = useUniqueId("droppable");
  var registry = appContext.registry, marshal = appContext.marshal;
  var previousRef = usePrevious(args);
  var descriptor = useMemo4(function() {
    return {
      id: args.droppableId,
      type: args.type,
      mode: args.mode
    };
  }, [args.droppableId, args.mode, args.type]);
  var publishedDescriptorRef = (0, import_react9.useRef)(descriptor);
  var memoizedUpdateScroll = useMemo4(function() {
    return memoize_one_esm_default(function(x, y) {
      !whileDraggingRef.current ? true ? invariant2(false, "Can only update scroll when dragging") : invariant2(false) : void 0;
      var scroll4 = {
        x,
        y
      };
      marshal.updateDroppableScroll(descriptor.id, scroll4);
    });
  }, [descriptor.id, marshal]);
  var getClosestScroll = useCallback(function() {
    var dragging = whileDraggingRef.current;
    if (!dragging || !dragging.env.closestScrollable) {
      return origin;
    }
    return getScroll$1(dragging.env.closestScrollable);
  }, []);
  var updateScroll = useCallback(function() {
    var scroll4 = getClosestScroll();
    memoizedUpdateScroll(scroll4.x, scroll4.y);
  }, [getClosestScroll, memoizedUpdateScroll]);
  var scheduleScrollUpdate = useMemo4(function() {
    return raf_schd_esm_default(updateScroll);
  }, [updateScroll]);
  var onClosestScroll = useCallback(function() {
    var dragging = whileDraggingRef.current;
    var closest3 = getClosestScrollableFromDrag(dragging);
    !(dragging && closest3) ? true ? invariant2(false, "Could not find scroll options while scrolling") : invariant2(false) : void 0;
    var options = dragging.scrollOptions;
    if (options.shouldPublishImmediately) {
      updateScroll();
      return;
    }
    scheduleScrollUpdate();
  }, [scheduleScrollUpdate, updateScroll]);
  var getDimensionAndWatchScroll = useCallback(function(windowScroll, options) {
    !!whileDraggingRef.current ? true ? invariant2(false, "Cannot collect a droppable while a drag is occurring") : invariant2(false) : void 0;
    var previous = previousRef.current;
    var ref2 = previous.getDroppableRef();
    !ref2 ? true ? invariant2(false, "Cannot collect without a droppable ref") : invariant2(false) : void 0;
    var env = getEnv(ref2);
    var dragging = {
      ref: ref2,
      descriptor,
      env,
      scrollOptions: options
    };
    whileDraggingRef.current = dragging;
    var dimension = getDimension({
      ref: ref2,
      descriptor,
      env,
      windowScroll,
      direction: previous.direction,
      isDropDisabled: previous.isDropDisabled,
      isCombineEnabled: previous.isCombineEnabled,
      shouldClipSubject: !previous.ignoreContainerClipping
    });
    var scrollable = env.closestScrollable;
    if (scrollable) {
      scrollable.setAttribute(scrollContainer.contextId, appContext.contextId);
      scrollable.addEventListener("scroll", onClosestScroll, getListenerOptions(dragging.scrollOptions));
      if (true) {
        checkForNestedScrollContainers(scrollable);
      }
    }
    return dimension;
  }, [appContext.contextId, descriptor, onClosestScroll, previousRef]);
  var getScrollWhileDragging = useCallback(function() {
    var dragging = whileDraggingRef.current;
    var closest3 = getClosestScrollableFromDrag(dragging);
    !(dragging && closest3) ? true ? invariant2(false, "Can only recollect Droppable client for Droppables that have a scroll container") : invariant2(false) : void 0;
    return getScroll$1(closest3);
  }, []);
  var dragStopped = useCallback(function() {
    var dragging = whileDraggingRef.current;
    !dragging ? true ? invariant2(false, "Cannot stop drag when no active drag") : invariant2(false) : void 0;
    var closest3 = getClosestScrollableFromDrag(dragging);
    whileDraggingRef.current = null;
    if (!closest3) {
      return;
    }
    scheduleScrollUpdate.cancel();
    closest3.removeAttribute(scrollContainer.contextId);
    closest3.removeEventListener("scroll", onClosestScroll, getListenerOptions(dragging.scrollOptions));
  }, [onClosestScroll, scheduleScrollUpdate]);
  var scroll3 = useCallback(function(change) {
    var dragging = whileDraggingRef.current;
    !dragging ? true ? invariant2(false, "Cannot scroll when there is no drag") : invariant2(false) : void 0;
    var closest3 = getClosestScrollableFromDrag(dragging);
    !closest3 ? true ? invariant2(false, "Cannot scroll a droppable with no closest scrollable") : invariant2(false) : void 0;
    closest3.scrollTop += change.y;
    closest3.scrollLeft += change.x;
  }, []);
  var callbacks = useMemo4(function() {
    return {
      getDimensionAndWatchScroll,
      getScrollWhileDragging,
      dragStopped,
      scroll: scroll3
    };
  }, [dragStopped, getDimensionAndWatchScroll, getScrollWhileDragging, scroll3]);
  var entry = useMemo4(function() {
    return {
      uniqueId,
      descriptor,
      callbacks
    };
  }, [callbacks, descriptor, uniqueId]);
  useIsomorphicLayoutEffect2(function() {
    publishedDescriptorRef.current = entry.descriptor;
    registry.droppable.register(entry);
    return function() {
      if (whileDraggingRef.current) {
        true ? warning2("Unsupported: changing the droppableId or type of a Droppable during a drag") : void 0;
        dragStopped();
      }
      registry.droppable.unregister(entry);
    };
  }, [callbacks, descriptor, dragStopped, entry, marshal, registry.droppable]);
  useIsomorphicLayoutEffect2(function() {
    if (!whileDraggingRef.current) {
      return;
    }
    marshal.updateDroppableIsEnabled(publishedDescriptorRef.current.id, !args.isDropDisabled);
  }, [args.isDropDisabled, marshal]);
  useIsomorphicLayoutEffect2(function() {
    if (!whileDraggingRef.current) {
      return;
    }
    marshal.updateDroppableIsCombineEnabled(publishedDescriptorRef.current.id, args.isCombineEnabled);
  }, [args.isCombineEnabled, marshal]);
}
__name(useDroppablePublisher, "useDroppablePublisher");
function noop$2() {
}
__name(noop$2, "noop$2");
var empty = {
  width: 0,
  height: 0,
  margin: noSpacing2
};
var getSize = /* @__PURE__ */ __name(function getSize2(_ref) {
  var isAnimatingOpenOnMount = _ref.isAnimatingOpenOnMount, placeholder2 = _ref.placeholder, animate = _ref.animate;
  if (isAnimatingOpenOnMount) {
    return empty;
  }
  if (animate === "close") {
    return empty;
  }
  return {
    height: placeholder2.client.borderBox.height,
    width: placeholder2.client.borderBox.width,
    margin: placeholder2.client.margin
  };
}, "getSize");
var getStyle = /* @__PURE__ */ __name(function getStyle2(_ref2) {
  var isAnimatingOpenOnMount = _ref2.isAnimatingOpenOnMount, placeholder2 = _ref2.placeholder, animate = _ref2.animate;
  var size = getSize({
    isAnimatingOpenOnMount,
    placeholder: placeholder2,
    animate
  });
  return {
    display: placeholder2.display,
    boxSizing: "border-box",
    width: size.width,
    height: size.height,
    marginTop: size.margin.top,
    marginRight: size.margin.right,
    marginBottom: size.margin.bottom,
    marginLeft: size.margin.left,
    flexShrink: "0",
    flexGrow: "0",
    pointerEvents: "none",
    transition: animate !== "none" ? transitions.placeholder : null
  };
}, "getStyle");
function Placeholder(props) {
  var animateOpenTimerRef = (0, import_react9.useRef)(null);
  var tryClearAnimateOpenTimer = useCallback(function() {
    if (!animateOpenTimerRef.current) {
      return;
    }
    clearTimeout(animateOpenTimerRef.current);
    animateOpenTimerRef.current = null;
  }, []);
  var animate = props.animate, onTransitionEnd = props.onTransitionEnd, onClose = props.onClose, contextId = props.contextId;
  var _useState = (0, import_react9.useState)(props.animate === "open"), isAnimatingOpenOnMount = _useState[0], setIsAnimatingOpenOnMount = _useState[1];
  (0, import_react9.useEffect)(function() {
    if (!isAnimatingOpenOnMount) {
      return noop$2;
    }
    if (animate !== "open") {
      tryClearAnimateOpenTimer();
      setIsAnimatingOpenOnMount(false);
      return noop$2;
    }
    if (animateOpenTimerRef.current) {
      return noop$2;
    }
    animateOpenTimerRef.current = setTimeout(function() {
      animateOpenTimerRef.current = null;
      setIsAnimatingOpenOnMount(false);
    });
    return tryClearAnimateOpenTimer;
  }, [animate, isAnimatingOpenOnMount, tryClearAnimateOpenTimer]);
  var onSizeChangeEnd = useCallback(function(event) {
    if (event.propertyName !== "height") {
      return;
    }
    onTransitionEnd();
    if (animate === "close") {
      onClose();
    }
  }, [animate, onClose, onTransitionEnd]);
  var style2 = getStyle({
    isAnimatingOpenOnMount,
    animate: props.animate,
    placeholder: props.placeholder
  });
  return import_react9.default.createElement(props.placeholder.tagName, {
    style: style2,
    "data-rbd-placeholder-context-id": contextId,
    onTransitionEnd: onSizeChangeEnd,
    ref: props.innerRef
  });
}
__name(Placeholder, "Placeholder");
var Placeholder$1 = import_react9.default.memo(Placeholder);
var DroppableContext = import_react9.default.createContext(null);
function checkIsValidInnerRef(el) {
  !(el && isHtmlElement(el)) ? true ? invariant2(false, "\n    provided.innerRef has not been provided with a HTMLElement.\n\n    You can find a guide on using the innerRef callback functions at:\n    https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md\n  ") : invariant2(false) : void 0;
}
__name(checkIsValidInnerRef, "checkIsValidInnerRef");
function isBoolean(value) {
  return typeof value === "boolean";
}
__name(isBoolean, "isBoolean");
function runChecks(args, checks) {
  checks.forEach(function(check) {
    return check(args);
  });
}
__name(runChecks, "runChecks");
var shared = [/* @__PURE__ */ __name(function required(_ref) {
  var props = _ref.props;
  !props.droppableId ? true ? invariant2(false, "A Droppable requires a droppableId prop") : invariant2(false) : void 0;
  !(typeof props.droppableId === "string") ? true ? invariant2(false, "A Droppable requires a [string] droppableId. Provided: [" + typeof props.droppableId + "]") : invariant2(false) : void 0;
}, "required"), /* @__PURE__ */ __name(function _boolean(_ref2) {
  var props = _ref2.props;
  !isBoolean(props.isDropDisabled) ? true ? invariant2(false, "isDropDisabled must be a boolean") : invariant2(false) : void 0;
  !isBoolean(props.isCombineEnabled) ? true ? invariant2(false, "isCombineEnabled must be a boolean") : invariant2(false) : void 0;
  !isBoolean(props.ignoreContainerClipping) ? true ? invariant2(false, "ignoreContainerClipping must be a boolean") : invariant2(false) : void 0;
}, "_boolean"), /* @__PURE__ */ __name(function ref(_ref3) {
  var getDroppableRef = _ref3.getDroppableRef;
  checkIsValidInnerRef(getDroppableRef());
}, "ref")];
var standard = [/* @__PURE__ */ __name(function placeholder(_ref4) {
  var props = _ref4.props, getPlaceholderRef = _ref4.getPlaceholderRef;
  if (!props.placeholder) {
    return;
  }
  var ref2 = getPlaceholderRef();
  if (ref2) {
    return;
  }
  true ? warning2('\n      Droppable setup issue [droppableId: "' + props.droppableId + '"]:\n      DroppableProvided > placeholder could not be found.\n\n      Please be sure to add the {provided.placeholder} React Node as a child of your Droppable.\n      More information: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md\n    ') : void 0;
}, "placeholder")];
var virtual = [/* @__PURE__ */ __name(function hasClone(_ref5) {
  var props = _ref5.props;
  !props.renderClone ? true ? invariant2(false, "Must provide a clone render function (renderClone) for virtual lists") : invariant2(false) : void 0;
}, "hasClone"), /* @__PURE__ */ __name(function hasNoPlaceholder(_ref6) {
  var getPlaceholderRef = _ref6.getPlaceholderRef;
  !!getPlaceholderRef() ? true ? invariant2(false, "Expected virtual list to not have a placeholder") : invariant2(false) : void 0;
}, "hasNoPlaceholder")];
function useValidation(args) {
  useDevSetupWarning(function() {
    runChecks(args, shared);
    if (args.props.mode === "standard") {
      runChecks(args, standard);
    }
    if (args.props.mode === "virtual") {
      runChecks(args, virtual);
    }
  });
}
__name(useValidation, "useValidation");
var AnimateInOut = function(_React$PureComponent) {
  _inheritsLoose(AnimateInOut2, _React$PureComponent);
  function AnimateInOut2() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
    _this.state = {
      isVisible: Boolean(_this.props.on),
      data: _this.props.on,
      animate: _this.props.shouldAnimate && _this.props.on ? "open" : "none"
    };
    _this.onClose = function() {
      if (_this.state.animate !== "close") {
        return;
      }
      _this.setState({
        isVisible: false
      });
    };
    return _this;
  }
  __name(AnimateInOut2, "AnimateInOut");
  AnimateInOut2.getDerivedStateFromProps = /* @__PURE__ */ __name(function getDerivedStateFromProps(props, state) {
    if (!props.shouldAnimate) {
      return {
        isVisible: Boolean(props.on),
        data: props.on,
        animate: "none"
      };
    }
    if (props.on) {
      return {
        isVisible: true,
        data: props.on,
        animate: "open"
      };
    }
    if (state.isVisible) {
      return {
        isVisible: true,
        data: state.data,
        animate: "close"
      };
    }
    return {
      isVisible: false,
      animate: "close",
      data: null
    };
  }, "getDerivedStateFromProps");
  var _proto = AnimateInOut2.prototype;
  _proto.render = /* @__PURE__ */ __name(function render() {
    if (!this.state.isVisible) {
      return null;
    }
    var provided = {
      onClose: this.onClose,
      data: this.state.data,
      animate: this.state.animate
    };
    return this.props.children(provided);
  }, "render");
  return AnimateInOut2;
}(import_react9.default.PureComponent);
var zIndexOptions = {
  dragging: 5e3,
  dropAnimating: 4500
};
var getDraggingTransition = /* @__PURE__ */ __name(function getDraggingTransition2(shouldAnimateDragMovement, dropping) {
  if (dropping) {
    return transitions.drop(dropping.duration);
  }
  if (shouldAnimateDragMovement) {
    return transitions.snap;
  }
  return transitions.fluid;
}, "getDraggingTransition");
var getDraggingOpacity = /* @__PURE__ */ __name(function getDraggingOpacity2(isCombining, isDropAnimating) {
  if (!isCombining) {
    return null;
  }
  return isDropAnimating ? combine.opacity.drop : combine.opacity.combining;
}, "getDraggingOpacity");
var getShouldDraggingAnimate = /* @__PURE__ */ __name(function getShouldDraggingAnimate2(dragging) {
  if (dragging.forceShouldAnimate != null) {
    return dragging.forceShouldAnimate;
  }
  return dragging.mode === "SNAP";
}, "getShouldDraggingAnimate");
function getDraggingStyle(dragging) {
  var dimension = dragging.dimension;
  var box = dimension.client;
  var offset3 = dragging.offset, combineWith = dragging.combineWith, dropping = dragging.dropping;
  var isCombining = Boolean(combineWith);
  var shouldAnimate = getShouldDraggingAnimate(dragging);
  var isDropAnimating = Boolean(dropping);
  var transform = isDropAnimating ? transforms.drop(offset3, isCombining) : transforms.moveTo(offset3);
  var style2 = {
    position: "fixed",
    top: box.marginBox.top,
    left: box.marginBox.left,
    boxSizing: "border-box",
    width: box.borderBox.width,
    height: box.borderBox.height,
    transition: getDraggingTransition(shouldAnimate, dropping),
    transform,
    opacity: getDraggingOpacity(isCombining, isDropAnimating),
    zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
    pointerEvents: "none"
  };
  return style2;
}
__name(getDraggingStyle, "getDraggingStyle");
function getSecondaryStyle(secondary) {
  return {
    transform: transforms.moveTo(secondary.offset),
    transition: secondary.shouldAnimateDisplacement ? null : "none"
  };
}
__name(getSecondaryStyle, "getSecondaryStyle");
function getStyle$1(mapped) {
  return mapped.type === "DRAGGING" ? getDraggingStyle(mapped) : getSecondaryStyle(mapped);
}
__name(getStyle$1, "getStyle$1");
function getDimension$1(descriptor, el, windowScroll) {
  if (windowScroll === void 0) {
    windowScroll = origin;
  }
  var computedStyles = window.getComputedStyle(el);
  var borderBox = el.getBoundingClientRect();
  var client = calculateBox(borderBox, computedStyles);
  var page = withScroll(client, windowScroll);
  var placeholder2 = {
    client,
    tagName: el.tagName.toLowerCase(),
    display: computedStyles.display
  };
  var displaceBy = {
    x: client.marginBox.width,
    y: client.marginBox.height
  };
  var dimension = {
    descriptor,
    placeholder: placeholder2,
    displaceBy,
    client,
    page
  };
  return dimension;
}
__name(getDimension$1, "getDimension$1");
function useDraggablePublisher(args) {
  var uniqueId = useUniqueId("draggable");
  var descriptor = args.descriptor, registry = args.registry, getDraggableRef = args.getDraggableRef, canDragInteractiveElements = args.canDragInteractiveElements, shouldRespectForcePress = args.shouldRespectForcePress, isEnabled = args.isEnabled;
  var options = useMemo4(function() {
    return {
      canDragInteractiveElements,
      shouldRespectForcePress,
      isEnabled
    };
  }, [canDragInteractiveElements, isEnabled, shouldRespectForcePress]);
  var getDimension2 = useCallback(function(windowScroll) {
    var el = getDraggableRef();
    !el ? true ? invariant2(false, "Cannot get dimension when no ref is set") : invariant2(false) : void 0;
    return getDimension$1(descriptor, el, windowScroll);
  }, [descriptor, getDraggableRef]);
  var entry = useMemo4(function() {
    return {
      uniqueId,
      descriptor,
      options,
      getDimension: getDimension2
    };
  }, [descriptor, getDimension2, options, uniqueId]);
  var publishedRef = (0, import_react9.useRef)(entry);
  var isFirstPublishRef = (0, import_react9.useRef)(true);
  useIsomorphicLayoutEffect2(function() {
    registry.draggable.register(publishedRef.current);
    return function() {
      return registry.draggable.unregister(publishedRef.current);
    };
  }, [registry.draggable]);
  useIsomorphicLayoutEffect2(function() {
    if (isFirstPublishRef.current) {
      isFirstPublishRef.current = false;
      return;
    }
    var last = publishedRef.current;
    publishedRef.current = entry;
    registry.draggable.update(entry, last);
  }, [entry, registry.draggable]);
}
__name(useDraggablePublisher, "useDraggablePublisher");
function useValidation$1(props, contextId, getRef) {
  useDevSetupWarning(function() {
    function prefix2(id2) {
      return "Draggable[id: " + id2 + "]: ";
    }
    __name(prefix2, "prefix");
    var id = props.draggableId;
    !id ? true ? invariant2(false, "Draggable requires a draggableId") : invariant2(false) : void 0;
    !(typeof id === "string") ? true ? invariant2(false, "Draggable requires a [string] draggableId.\n      Provided: [type: " + typeof id + "] (value: " + id + ")") : invariant2(false) : void 0;
    !isInteger(props.index) ? true ? invariant2(false, prefix2(id) + " requires an integer index prop") : invariant2(false) : void 0;
    if (props.mapped.type === "DRAGGING") {
      return;
    }
    checkIsValidInnerRef(getRef());
    if (props.isEnabled) {
      !findDragHandle(contextId, id) ? true ? invariant2(false, prefix2(id) + " Unable to find drag handle") : invariant2(false) : void 0;
    }
  });
}
__name(useValidation$1, "useValidation$1");
function useClonePropValidation(isClone) {
  useDev(function() {
    var initialRef = (0, import_react9.useRef)(isClone);
    useDevSetupWarning(function() {
      !(isClone === initialRef.current) ? true ? invariant2(false, "Draggable isClone prop value changed during component life") : invariant2(false) : void 0;
    }, [isClone]);
  });
}
__name(useClonePropValidation, "useClonePropValidation");
function preventHtml5Dnd(event) {
  event.preventDefault();
}
__name(preventHtml5Dnd, "preventHtml5Dnd");
function Draggable(props) {
  var ref2 = (0, import_react9.useRef)(null);
  var setRef = useCallback(function(el) {
    ref2.current = el;
  }, []);
  var getRef = useCallback(function() {
    return ref2.current;
  }, []);
  var _useRequiredContext = useRequiredContext(AppContext), contextId = _useRequiredContext.contextId, dragHandleUsageInstructionsId = _useRequiredContext.dragHandleUsageInstructionsId, registry = _useRequiredContext.registry;
  var _useRequiredContext2 = useRequiredContext(DroppableContext), type = _useRequiredContext2.type, droppableId = _useRequiredContext2.droppableId;
  var descriptor = useMemo4(function() {
    return {
      id: props.draggableId,
      index: props.index,
      type,
      droppableId
    };
  }, [props.draggableId, props.index, type, droppableId]);
  var children = props.children, draggableId = props.draggableId, isEnabled = props.isEnabled, shouldRespectForcePress = props.shouldRespectForcePress, canDragInteractiveElements = props.canDragInteractiveElements, isClone = props.isClone, mapped = props.mapped, dropAnimationFinishedAction = props.dropAnimationFinished;
  useValidation$1(props, contextId, getRef);
  useClonePropValidation(isClone);
  if (!isClone) {
    var forPublisher = useMemo4(function() {
      return {
        descriptor,
        registry,
        getDraggableRef: getRef,
        canDragInteractiveElements,
        shouldRespectForcePress,
        isEnabled
      };
    }, [descriptor, registry, getRef, canDragInteractiveElements, shouldRespectForcePress, isEnabled]);
    useDraggablePublisher(forPublisher);
  }
  var dragHandleProps = useMemo4(function() {
    return isEnabled ? {
      tabIndex: 0,
      role: "button",
      "aria-describedby": dragHandleUsageInstructionsId,
      "data-rbd-drag-handle-draggable-id": draggableId,
      "data-rbd-drag-handle-context-id": contextId,
      draggable: false,
      onDragStart: preventHtml5Dnd
    } : null;
  }, [contextId, dragHandleUsageInstructionsId, draggableId, isEnabled]);
  var onMoveEnd = useCallback(function(event) {
    if (mapped.type !== "DRAGGING") {
      return;
    }
    if (!mapped.dropping) {
      return;
    }
    if (event.propertyName !== "transform") {
      return;
    }
    dropAnimationFinishedAction();
  }, [dropAnimationFinishedAction, mapped]);
  var provided = useMemo4(function() {
    var style2 = getStyle$1(mapped);
    var onTransitionEnd = mapped.type === "DRAGGING" && mapped.dropping ? onMoveEnd : null;
    var result = {
      innerRef: setRef,
      draggableProps: {
        "data-rbd-draggable-context-id": contextId,
        "data-rbd-draggable-id": draggableId,
        style: style2,
        onTransitionEnd
      },
      dragHandleProps
    };
    return result;
  }, [contextId, dragHandleProps, draggableId, mapped, onMoveEnd, setRef]);
  var rubric = useMemo4(function() {
    return {
      draggableId: descriptor.id,
      type: descriptor.type,
      source: {
        index: descriptor.index,
        droppableId: descriptor.droppableId
      }
    };
  }, [descriptor.droppableId, descriptor.id, descriptor.index, descriptor.type]);
  return children(provided, mapped.snapshot, rubric);
}
__name(Draggable, "Draggable");
var isStrictEqual = /* @__PURE__ */ __name(function(a, b) {
  return a === b;
}, "isStrictEqual");
var whatIsDraggedOverFromResult = /* @__PURE__ */ __name(function(result) {
  var combine2 = result.combine, destination = result.destination;
  if (destination) {
    return destination.droppableId;
  }
  if (combine2) {
    return combine2.droppableId;
  }
  return null;
}, "whatIsDraggedOverFromResult");
var getCombineWithFromResult = /* @__PURE__ */ __name(function getCombineWithFromResult2(result) {
  return result.combine ? result.combine.draggableId : null;
}, "getCombineWithFromResult");
var getCombineWithFromImpact = /* @__PURE__ */ __name(function getCombineWithFromImpact2(impact) {
  return impact.at && impact.at.type === "COMBINE" ? impact.at.combine.draggableId : null;
}, "getCombineWithFromImpact");
function getDraggableSelector() {
  var memoizedOffset = memoize_one_esm_default(function(x, y) {
    return {
      x,
      y
    };
  });
  var getMemoizedSnapshot = memoize_one_esm_default(function(mode, isClone, draggingOver, combineWith, dropping) {
    return {
      isDragging: true,
      isClone,
      isDropAnimating: Boolean(dropping),
      dropAnimation: dropping,
      mode,
      draggingOver,
      combineWith,
      combineTargetFor: null
    };
  });
  var getMemoizedProps = memoize_one_esm_default(function(offset3, mode, dimension, isClone, draggingOver, combineWith, forceShouldAnimate) {
    return {
      mapped: {
        type: "DRAGGING",
        dropping: null,
        draggingOver,
        combineWith,
        mode,
        offset: offset3,
        dimension,
        forceShouldAnimate,
        snapshot: getMemoizedSnapshot(mode, isClone, draggingOver, combineWith, null)
      }
    };
  });
  var selector = /* @__PURE__ */ __name(function selector2(state, ownProps) {
    if (state.isDragging) {
      if (state.critical.draggable.id !== ownProps.draggableId) {
        return null;
      }
      var offset3 = state.current.client.offset;
      var dimension = state.dimensions.draggables[ownProps.draggableId];
      var draggingOver = whatIsDraggedOver(state.impact);
      var combineWith = getCombineWithFromImpact(state.impact);
      var forceShouldAnimate = state.forceShouldAnimate;
      return getMemoizedProps(memoizedOffset(offset3.x, offset3.y), state.movementMode, dimension, ownProps.isClone, draggingOver, combineWith, forceShouldAnimate);
    }
    if (state.phase === "DROP_ANIMATING") {
      var completed = state.completed;
      if (completed.result.draggableId !== ownProps.draggableId) {
        return null;
      }
      var isClone = ownProps.isClone;
      var _dimension = state.dimensions.draggables[ownProps.draggableId];
      var result = completed.result;
      var mode = result.mode;
      var _draggingOver = whatIsDraggedOverFromResult(result);
      var _combineWith = getCombineWithFromResult(result);
      var duration = state.dropDuration;
      var dropping = {
        duration,
        curve: curves.drop,
        moveTo: state.newHomeClientOffset,
        opacity: _combineWith ? combine.opacity.drop : null,
        scale: _combineWith ? combine.scale.drop : null
      };
      return {
        mapped: {
          type: "DRAGGING",
          offset: state.newHomeClientOffset,
          dimension: _dimension,
          dropping,
          draggingOver: _draggingOver,
          combineWith: _combineWith,
          mode,
          forceShouldAnimate: null,
          snapshot: getMemoizedSnapshot(mode, isClone, _draggingOver, _combineWith, dropping)
        }
      };
    }
    return null;
  }, "selector");
  return selector;
}
__name(getDraggableSelector, "getDraggableSelector");
function getSecondarySnapshot(combineTargetFor) {
  return {
    isDragging: false,
    isDropAnimating: false,
    isClone: false,
    dropAnimation: null,
    mode: null,
    draggingOver: null,
    combineTargetFor,
    combineWith: null
  };
}
__name(getSecondarySnapshot, "getSecondarySnapshot");
var atRest = {
  mapped: {
    type: "SECONDARY",
    offset: origin,
    combineTargetFor: null,
    shouldAnimateDisplacement: true,
    snapshot: getSecondarySnapshot(null)
  }
};
function getSecondarySelector() {
  var memoizedOffset = memoize_one_esm_default(function(x, y) {
    return {
      x,
      y
    };
  });
  var getMemoizedSnapshot = memoize_one_esm_default(getSecondarySnapshot);
  var getMemoizedProps = memoize_one_esm_default(function(offset3, combineTargetFor, shouldAnimateDisplacement) {
    if (combineTargetFor === void 0) {
      combineTargetFor = null;
    }
    return {
      mapped: {
        type: "SECONDARY",
        offset: offset3,
        combineTargetFor,
        shouldAnimateDisplacement,
        snapshot: getMemoizedSnapshot(combineTargetFor)
      }
    };
  });
  var getFallback = /* @__PURE__ */ __name(function getFallback2(combineTargetFor) {
    return combineTargetFor ? getMemoizedProps(origin, combineTargetFor, true) : null;
  }, "getFallback");
  var getProps = /* @__PURE__ */ __name(function getProps2(ownId, draggingId, impact, afterCritical) {
    var visualDisplacement = impact.displaced.visible[ownId];
    var isAfterCriticalInVirtualList = Boolean(afterCritical.inVirtualList && afterCritical.effected[ownId]);
    var combine2 = tryGetCombine(impact);
    var combineTargetFor = combine2 && combine2.draggableId === ownId ? draggingId : null;
    if (!visualDisplacement) {
      if (!isAfterCriticalInVirtualList) {
        return getFallback(combineTargetFor);
      }
      if (impact.displaced.invisible[ownId]) {
        return null;
      }
      var change = negate(afterCritical.displacedBy.point);
      var _offset = memoizedOffset(change.x, change.y);
      return getMemoizedProps(_offset, combineTargetFor, true);
    }
    if (isAfterCriticalInVirtualList) {
      return getFallback(combineTargetFor);
    }
    var displaceBy = impact.displacedBy.point;
    var offset3 = memoizedOffset(displaceBy.x, displaceBy.y);
    return getMemoizedProps(offset3, combineTargetFor, visualDisplacement.shouldAnimate);
  }, "getProps");
  var selector = /* @__PURE__ */ __name(function selector2(state, ownProps) {
    if (state.isDragging) {
      if (state.critical.draggable.id === ownProps.draggableId) {
        return null;
      }
      return getProps(ownProps.draggableId, state.critical.draggable.id, state.impact, state.afterCritical);
    }
    if (state.phase === "DROP_ANIMATING") {
      var completed = state.completed;
      if (completed.result.draggableId === ownProps.draggableId) {
        return null;
      }
      return getProps(ownProps.draggableId, completed.result.draggableId, completed.impact, completed.afterCritical);
    }
    return null;
  }, "selector");
  return selector;
}
__name(getSecondarySelector, "getSecondarySelector");
var makeMapStateToProps = /* @__PURE__ */ __name(function makeMapStateToProps2() {
  var draggingSelector = getDraggableSelector();
  var secondarySelector = getSecondarySelector();
  var selector = /* @__PURE__ */ __name(function selector2(state, ownProps) {
    return draggingSelector(state, ownProps) || secondarySelector(state, ownProps) || atRest;
  }, "selector");
  return selector;
}, "makeMapStateToProps");
var mapDispatchToProps = {
  dropAnimationFinished
};
var ConnectedDraggable = connect_default(makeMapStateToProps, mapDispatchToProps, null, {
  context: StoreContext,
  pure: true,
  areStatePropsEqual: isStrictEqual
})(Draggable);
function PrivateDraggable(props) {
  var droppableContext = useRequiredContext(DroppableContext);
  var isUsingCloneFor = droppableContext.isUsingCloneFor;
  if (isUsingCloneFor === props.draggableId && !props.isClone) {
    return null;
  }
  return import_react9.default.createElement(ConnectedDraggable, props);
}
__name(PrivateDraggable, "PrivateDraggable");
function PublicDraggable(props) {
  var isEnabled = typeof props.isDragDisabled === "boolean" ? !props.isDragDisabled : true;
  var canDragInteractiveElements = Boolean(props.disableInteractiveElementBlocking);
  var shouldRespectForcePress = Boolean(props.shouldRespectForcePress);
  return import_react9.default.createElement(PrivateDraggable, _extends({}, props, {
    isClone: false,
    isEnabled,
    canDragInteractiveElements,
    shouldRespectForcePress
  }));
}
__name(PublicDraggable, "PublicDraggable");
function Droppable(props) {
  var appContext = (0, import_react9.useContext)(AppContext);
  !appContext ? true ? invariant2(false, "Could not find app context") : invariant2(false) : void 0;
  var contextId = appContext.contextId, isMovementAllowed2 = appContext.isMovementAllowed;
  var droppableRef = (0, import_react9.useRef)(null);
  var placeholderRef = (0, import_react9.useRef)(null);
  var children = props.children, droppableId = props.droppableId, type = props.type, mode = props.mode, direction = props.direction, ignoreContainerClipping = props.ignoreContainerClipping, isDropDisabled = props.isDropDisabled, isCombineEnabled = props.isCombineEnabled, snapshot = props.snapshot, useClone = props.useClone, updateViewportMaxScroll3 = props.updateViewportMaxScroll, getContainerForClone = props.getContainerForClone;
  var getDroppableRef = useCallback(function() {
    return droppableRef.current;
  }, []);
  var setDroppableRef = useCallback(function(value) {
    droppableRef.current = value;
  }, []);
  var getPlaceholderRef = useCallback(function() {
    return placeholderRef.current;
  }, []);
  var setPlaceholderRef = useCallback(function(value) {
    placeholderRef.current = value;
  }, []);
  useValidation({
    props,
    getDroppableRef,
    getPlaceholderRef
  });
  var onPlaceholderTransitionEnd = useCallback(function() {
    if (isMovementAllowed2()) {
      updateViewportMaxScroll3({
        maxScroll: getMaxWindowScroll()
      });
    }
  }, [isMovementAllowed2, updateViewportMaxScroll3]);
  useDroppablePublisher({
    droppableId,
    type,
    mode,
    direction,
    isDropDisabled,
    isCombineEnabled,
    ignoreContainerClipping,
    getDroppableRef
  });
  var placeholder2 = import_react9.default.createElement(AnimateInOut, {
    on: props.placeholder,
    shouldAnimate: props.shouldAnimatePlaceholder
  }, function(_ref) {
    var onClose = _ref.onClose, data = _ref.data, animate = _ref.animate;
    return import_react9.default.createElement(Placeholder$1, {
      placeholder: data,
      onClose,
      innerRef: setPlaceholderRef,
      animate,
      contextId,
      onTransitionEnd: onPlaceholderTransitionEnd
    });
  });
  var provided = useMemo4(function() {
    return {
      innerRef: setDroppableRef,
      placeholder: placeholder2,
      droppableProps: {
        "data-rbd-droppable-id": droppableId,
        "data-rbd-droppable-context-id": contextId
      }
    };
  }, [contextId, droppableId, placeholder2, setDroppableRef]);
  var isUsingCloneFor = useClone ? useClone.dragging.draggableId : null;
  var droppableContext = useMemo4(function() {
    return {
      droppableId,
      type,
      isUsingCloneFor
    };
  }, [droppableId, isUsingCloneFor, type]);
  function getClone() {
    if (!useClone) {
      return null;
    }
    var dragging = useClone.dragging, render = useClone.render;
    var node = import_react9.default.createElement(PrivateDraggable, {
      draggableId: dragging.draggableId,
      index: dragging.source.index,
      isClone: true,
      isEnabled: true,
      shouldRespectForcePress: false,
      canDragInteractiveElements: true
    }, function(draggableProvided, draggableSnapshot) {
      return render(draggableProvided, draggableSnapshot, dragging);
    });
    return import_react_dom2.default.createPortal(node, getContainerForClone());
  }
  __name(getClone, "getClone");
  return import_react9.default.createElement(DroppableContext.Provider, {
    value: droppableContext
  }, children(provided, snapshot), getClone());
}
__name(Droppable, "Droppable");
var isMatchingType = /* @__PURE__ */ __name(function isMatchingType2(type, critical) {
  return type === critical.droppable.type;
}, "isMatchingType");
var getDraggable = /* @__PURE__ */ __name(function getDraggable2(critical, dimensions) {
  return dimensions.draggables[critical.draggable.id];
}, "getDraggable");
var makeMapStateToProps$1 = /* @__PURE__ */ __name(function makeMapStateToProps3() {
  var idleWithAnimation = {
    placeholder: null,
    shouldAnimatePlaceholder: true,
    snapshot: {
      isDraggingOver: false,
      draggingOverWith: null,
      draggingFromThisWith: null,
      isUsingPlaceholder: false
    },
    useClone: null
  };
  var idleWithoutAnimation = _extends({}, idleWithAnimation, {
    shouldAnimatePlaceholder: false
  });
  var getDraggableRubric = memoize_one_esm_default(function(descriptor) {
    return {
      draggableId: descriptor.id,
      type: descriptor.type,
      source: {
        index: descriptor.index,
        droppableId: descriptor.droppableId
      }
    };
  });
  var getMapProps = memoize_one_esm_default(function(id, isEnabled, isDraggingOverForConsumer, isDraggingOverForImpact, dragging, renderClone) {
    var draggableId = dragging.descriptor.id;
    var isHome = dragging.descriptor.droppableId === id;
    if (isHome) {
      var useClone = renderClone ? {
        render: renderClone,
        dragging: getDraggableRubric(dragging.descriptor)
      } : null;
      var _snapshot = {
        isDraggingOver: isDraggingOverForConsumer,
        draggingOverWith: isDraggingOverForConsumer ? draggableId : null,
        draggingFromThisWith: draggableId,
        isUsingPlaceholder: true
      };
      return {
        placeholder: dragging.placeholder,
        shouldAnimatePlaceholder: false,
        snapshot: _snapshot,
        useClone
      };
    }
    if (!isEnabled) {
      return idleWithoutAnimation;
    }
    if (!isDraggingOverForImpact) {
      return idleWithAnimation;
    }
    var snapshot = {
      isDraggingOver: isDraggingOverForConsumer,
      draggingOverWith: draggableId,
      draggingFromThisWith: null,
      isUsingPlaceholder: true
    };
    return {
      placeholder: dragging.placeholder,
      shouldAnimatePlaceholder: true,
      snapshot,
      useClone: null
    };
  });
  var selector = /* @__PURE__ */ __name(function selector2(state, ownProps) {
    var id = ownProps.droppableId;
    var type = ownProps.type;
    var isEnabled = !ownProps.isDropDisabled;
    var renderClone = ownProps.renderClone;
    if (state.isDragging) {
      var critical = state.critical;
      if (!isMatchingType(type, critical)) {
        return idleWithoutAnimation;
      }
      var dragging = getDraggable(critical, state.dimensions);
      var isDraggingOver = whatIsDraggedOver(state.impact) === id;
      return getMapProps(id, isEnabled, isDraggingOver, isDraggingOver, dragging, renderClone);
    }
    if (state.phase === "DROP_ANIMATING") {
      var completed = state.completed;
      if (!isMatchingType(type, completed.critical)) {
        return idleWithoutAnimation;
      }
      var _dragging = getDraggable(completed.critical, state.dimensions);
      return getMapProps(id, isEnabled, whatIsDraggedOverFromResult(completed.result) === id, whatIsDraggedOver(completed.impact) === id, _dragging, renderClone);
    }
    if (state.phase === "IDLE" && state.completed && !state.shouldFlush) {
      var _completed = state.completed;
      if (!isMatchingType(type, _completed.critical)) {
        return idleWithoutAnimation;
      }
      var wasOver = whatIsDraggedOver(_completed.impact) === id;
      var wasCombining = Boolean(_completed.impact.at && _completed.impact.at.type === "COMBINE");
      var isHome = _completed.critical.droppable.id === id;
      if (wasOver) {
        return wasCombining ? idleWithAnimation : idleWithoutAnimation;
      }
      if (isHome) {
        return idleWithAnimation;
      }
      return idleWithoutAnimation;
    }
    return idleWithoutAnimation;
  }, "selector");
  return selector;
}, "makeMapStateToProps");
var mapDispatchToProps$1 = {
  updateViewportMaxScroll
};
function getBody() {
  !document.body ? true ? invariant2(false, "document.body is not ready") : invariant2(false) : void 0;
  return document.body;
}
__name(getBody, "getBody");
var defaultProps = {
  mode: "standard",
  type: "DEFAULT",
  direction: "vertical",
  isDropDisabled: false,
  isCombineEnabled: false,
  ignoreContainerClipping: false,
  renderClone: null,
  getContainerForClone: getBody
};
var ConnectedDroppable = connect_default(makeMapStateToProps$1, mapDispatchToProps$1, null, {
  context: StoreContext,
  pure: true,
  areStatePropsEqual: isStrictEqual
})(Droppable);
ConnectedDroppable.defaultProps = defaultProps;
export {
  DragDropContext,
  PublicDraggable as Draggable,
  ConnectedDroppable as Droppable,
  resetServerContext,
  useKeyboardSensor,
  useMouseSensor,
  useTouchSensor
};
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (** @license React v17.0.2
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=react-beautiful-dnd.js.map
