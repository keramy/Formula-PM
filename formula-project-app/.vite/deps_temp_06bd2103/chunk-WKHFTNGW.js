import {
  require_jsx_runtime
} from "./chunk-EI6MR3JK.js";
import {
  clsx_default
} from "./chunk-4YDN7RMF.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-7QXRRMHH.js";
import {
  require_prop_types
} from "./chunk-YQBFPE75.js";
import {
  init_emotion_styled_browser_development_esm,
  newStyled
} from "./chunk-AAXBB6EF.js";
import {
  CacheProvider,
  Global,
  ThemeContext,
  createCache,
  css,
  init_emotion_cache_browser_development_esm,
  init_emotion_react_browser_development_esm,
  keyframes
} from "./chunk-KPOJAITF.js";
import {
  _extends,
  init_extends
} from "./chunk-DLEOTRWY.js";
import {
  require_react
} from "./chunk-LK4O2NHZ.js";
import {
  toPropertyKey
} from "./chunk-7KBFDO7A.js";
import {
  __commonJS,
  __esm,
  __export,
  __name,
  __toCommonJS,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/@mui/utils/esm/formatMuiErrorMessage/formatMuiErrorMessage.js
function formatMuiErrorMessage(code) {
  let url = "https://mui.com/production-error/?code=" + code;
  for (let i = 1; i < arguments.length; i += 1) {
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified MUI error #" + code + "; visit " + url + " for the full message.";
}
var init_formatMuiErrorMessage = __esm({
  "node_modules/@mui/utils/esm/formatMuiErrorMessage/formatMuiErrorMessage.js"() {
    __name(formatMuiErrorMessage, "formatMuiErrorMessage");
  }
});

// node_modules/@mui/utils/esm/formatMuiErrorMessage/index.js
var formatMuiErrorMessage_exports = {};
__export(formatMuiErrorMessage_exports, {
  default: () => formatMuiErrorMessage
});
var init_formatMuiErrorMessage2 = __esm({
  "node_modules/@mui/utils/esm/formatMuiErrorMessage/index.js"() {
    init_formatMuiErrorMessage();
  }
});

// node_modules/@mui/styled-engine/StyledEngineProvider/StyledEngineProvider.js
function StyledEngineProvider(props) {
  const {
    injectFirst,
    children
  } = props;
  return injectFirst && cache ? (0, import_jsx_runtime.jsx)(CacheProvider, {
    value: cache,
    children
  }) : children;
}
var React, import_prop_types, import_jsx_runtime, cache;
var init_StyledEngineProvider = __esm({
  "node_modules/@mui/styled-engine/StyledEngineProvider/StyledEngineProvider.js"() {
    "use client";
    React = __toESM(require_react());
    import_prop_types = __toESM(require_prop_types());
    init_emotion_react_browser_development_esm();
    init_emotion_cache_browser_development_esm();
    import_jsx_runtime = __toESM(require_jsx_runtime());
    if (typeof document === "object") {
      cache = createCache({
        key: "css",
        prepend: true
      });
    }
    __name(StyledEngineProvider, "StyledEngineProvider");
    true ? StyledEngineProvider.propTypes = {
      /**
       * Your component tree.
       */
      children: import_prop_types.default.node,
      /**
       * By default, the styles are injected last in the <head> element of the page.
       * As a result, they gain more specificity than any other style sheet.
       * If you want to override MUI's styles, set this prop.
       */
      injectFirst: import_prop_types.default.bool
    } : void 0;
  }
});

// node_modules/@mui/styled-engine/StyledEngineProvider/index.js
var init_StyledEngineProvider2 = __esm({
  "node_modules/@mui/styled-engine/StyledEngineProvider/index.js"() {
    "use client";
    init_StyledEngineProvider();
  }
});

// node_modules/@mui/styled-engine/GlobalStyles/GlobalStyles.js
function isEmpty(obj) {
  return obj === void 0 || obj === null || Object.keys(obj).length === 0;
}
function GlobalStyles(props) {
  const {
    styles,
    defaultTheme: defaultTheme5 = {}
  } = props;
  const globalStyles = typeof styles === "function" ? (themeInput) => styles(isEmpty(themeInput) ? defaultTheme5 : themeInput) : styles;
  return (0, import_jsx_runtime2.jsx)(Global, {
    styles: globalStyles
  });
}
var React2, import_prop_types2, import_jsx_runtime2;
var init_GlobalStyles = __esm({
  "node_modules/@mui/styled-engine/GlobalStyles/GlobalStyles.js"() {
    "use client";
    React2 = __toESM(require_react());
    import_prop_types2 = __toESM(require_prop_types());
    init_emotion_react_browser_development_esm();
    import_jsx_runtime2 = __toESM(require_jsx_runtime());
    __name(isEmpty, "isEmpty");
    __name(GlobalStyles, "GlobalStyles");
    true ? GlobalStyles.propTypes = {
      defaultTheme: import_prop_types2.default.object,
      styles: import_prop_types2.default.oneOfType([import_prop_types2.default.array, import_prop_types2.default.string, import_prop_types2.default.object, import_prop_types2.default.func])
    } : void 0;
  }
});

// node_modules/@mui/styled-engine/GlobalStyles/index.js
var init_GlobalStyles2 = __esm({
  "node_modules/@mui/styled-engine/GlobalStyles/index.js"() {
    "use client";
    init_GlobalStyles();
  }
});

// node_modules/@mui/styled-engine/index.js
var styled_engine_exports = {};
__export(styled_engine_exports, {
  GlobalStyles: () => GlobalStyles,
  StyledEngineProvider: () => StyledEngineProvider,
  ThemeContext: () => ThemeContext,
  css: () => css,
  default: () => styled,
  internal_processStyles: () => internal_processStyles,
  keyframes: () => keyframes
});
function styled(tag, options) {
  const stylesFactory = newStyled(tag, options);
  if (true) {
    return (...styles) => {
      const component = typeof tag === "string" ? `"${tag}"` : "component";
      if (styles.length === 0) {
        console.error([`MUI: Seems like you called \`styled(${component})()\` without a \`style\` argument.`, 'You must provide a `styles` argument: `styled("div")(styleYouForgotToPass)`.'].join("\n"));
      } else if (styles.some((style4) => style4 === void 0)) {
        console.error(`MUI: the styled(${component})(...args) API requires all its args to be defined.`);
      }
      return stylesFactory(...styles);
    };
  }
  return stylesFactory;
}
var internal_processStyles;
var init_styled_engine = __esm({
  "node_modules/@mui/styled-engine/index.js"() {
    "use client";
    init_emotion_styled_browser_development_esm();
    init_emotion_react_browser_development_esm();
    init_StyledEngineProvider2();
    init_GlobalStyles2();
    __name(styled, "styled");
    internal_processStyles = /* @__PURE__ */ __name((tag, processor) => {
      if (Array.isArray(tag.__emotion_styles)) {
        tag.__emotion_styles = processor(tag.__emotion_styles);
      }
    }, "internal_processStyles");
  }
});

// node_modules/@mui/utils/esm/deepmerge/deepmerge.js
function isPlainObject(item) {
  if (typeof item !== "object" || item === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(item);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
}
function deepClone(source) {
  if (React4.isValidElement(source) || !isPlainObject(source)) {
    return source;
  }
  const output = {};
  Object.keys(source).forEach((key) => {
    output[key] = deepClone(source[key]);
  });
  return output;
}
function deepmerge(target, source, options = {
  clone: true
}) {
  const output = options.clone ? _extends({}, target) : target;
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      if (React4.isValidElement(source[key])) {
        output[key] = source[key];
      } else if (isPlainObject(source[key]) && // Avoid prototype pollution
      Object.prototype.hasOwnProperty.call(target, key) && isPlainObject(target[key])) {
        output[key] = deepmerge(target[key], source[key], options);
      } else if (options.clone) {
        output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}
var React4;
var init_deepmerge = __esm({
  "node_modules/@mui/utils/esm/deepmerge/deepmerge.js"() {
    init_extends();
    React4 = __toESM(require_react());
    __name(isPlainObject, "isPlainObject");
    __name(deepClone, "deepClone");
    __name(deepmerge, "deepmerge");
  }
});

// node_modules/@mui/utils/esm/deepmerge/index.js
var deepmerge_exports = {};
__export(deepmerge_exports, {
  default: () => deepmerge,
  isPlainObject: () => isPlainObject
});
var init_deepmerge2 = __esm({
  "node_modules/@mui/utils/esm/deepmerge/index.js"() {
    init_deepmerge();
    init_deepmerge();
  }
});

// node_modules/@mui/utils/esm/capitalize/capitalize.js
function capitalize(string) {
  if (typeof string !== "string") {
    throw new Error(true ? `MUI: \`capitalize(string)\` expects a string argument.` : formatMuiErrorMessage(7));
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var init_capitalize = __esm({
  "node_modules/@mui/utils/esm/capitalize/capitalize.js"() {
    init_formatMuiErrorMessage2();
    __name(capitalize, "capitalize");
  }
});

// node_modules/@mui/utils/esm/capitalize/index.js
var capitalize_exports = {};
__export(capitalize_exports, {
  default: () => capitalize
});
var init_capitalize2 = __esm({
  "node_modules/@mui/utils/esm/capitalize/index.js"() {
    init_capitalize();
  }
});

// node_modules/@mui/utils/esm/clamp/clamp.js
function clamp(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  return Math.max(min, Math.min(val, max));
}
var clamp_default;
var init_clamp = __esm({
  "node_modules/@mui/utils/esm/clamp/clamp.js"() {
    __name(clamp, "clamp");
    clamp_default = clamp;
  }
});

// node_modules/@mui/utils/esm/clamp/index.js
var clamp_exports = {};
__export(clamp_exports, {
  default: () => clamp_default
});
var init_clamp2 = __esm({
  "node_modules/@mui/utils/esm/clamp/index.js"() {
    init_clamp();
  }
});

// node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    (function() {
      function typeOf(object) {
        if ("object" === typeof object && null !== object) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              switch (object = object.type, object) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                case REACT_VIEW_TRANSITION_TYPE:
                  return object;
                default:
                  switch (object = object && object.$$typeof, object) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                      return object;
                    case REACT_CONSUMER_TYPE:
                      return object;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
      }
      __name(typeOf, "typeOf");
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      Symbol.for("react.provider");
      var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
      exports.ContextConsumer = REACT_CONSUMER_TYPE;
      exports.ContextProvider = REACT_CONTEXT_TYPE;
      exports.Element = REACT_ELEMENT_TYPE;
      exports.ForwardRef = REACT_FORWARD_REF_TYPE;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Lazy = REACT_LAZY_TYPE;
      exports.Memo = REACT_MEMO_TYPE;
      exports.Portal = REACT_PORTAL_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
      exports.isContextConsumer = function(object) {
        return typeOf(object) === REACT_CONSUMER_TYPE;
      };
      exports.isContextProvider = function(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      };
      exports.isElement = function(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      };
      exports.isForwardRef = function(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      };
      exports.isFragment = function(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      };
      exports.isLazy = function(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      };
      exports.isMemo = function(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      };
      exports.isPortal = function(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      };
      exports.isProfiler = function(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      };
      exports.isStrictMode = function(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      };
      exports.isSuspense = function(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      };
      exports.isSuspenseList = function(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      };
      exports.isValidElementType = function(type) {
        return "string" === typeof type || "function" === typeof type || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || "object" === typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || void 0 !== type.getModuleId) ? true : false;
      };
      exports.typeOf = typeOf;
    })();
  }
});

// node_modules/react-is/index.js
var require_react_is = __commonJS({
  "node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// node_modules/@mui/utils/esm/getDisplayName/getDisplayName.js
function getFunctionName(fn) {
  const match = `${fn}`.match(fnNameMatchRegex);
  const name = match && match[1];
  return name || "";
}
function getFunctionComponentName(Component, fallback = "") {
  return Component.displayName || Component.name || getFunctionName(Component) || fallback;
}
function getWrappedName(outerType, innerType, wrapperName) {
  const functionName = getFunctionComponentName(innerType);
  return outerType.displayName || (functionName !== "" ? `${wrapperName}(${functionName})` : wrapperName);
}
function getDisplayName(Component) {
  if (Component == null) {
    return void 0;
  }
  if (typeof Component === "string") {
    return Component;
  }
  if (typeof Component === "function") {
    return getFunctionComponentName(Component, "Component");
  }
  if (typeof Component === "object") {
    switch (Component.$$typeof) {
      case import_react_is.ForwardRef:
        return getWrappedName(Component, Component.render, "ForwardRef");
      case import_react_is.Memo:
        return getWrappedName(Component, Component.type, "memo");
      default:
        return void 0;
    }
  }
  return void 0;
}
var import_react_is, fnNameMatchRegex;
var init_getDisplayName = __esm({
  "node_modules/@mui/utils/esm/getDisplayName/getDisplayName.js"() {
    import_react_is = __toESM(require_react_is());
    fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
    __name(getFunctionName, "getFunctionName");
    __name(getFunctionComponentName, "getFunctionComponentName");
    __name(getWrappedName, "getWrappedName");
    __name(getDisplayName, "getDisplayName");
  }
});

// node_modules/@mui/utils/esm/getDisplayName/index.js
var getDisplayName_exports = {};
__export(getDisplayName_exports, {
  default: () => getDisplayName,
  getFunctionName: () => getFunctionName
});
var init_getDisplayName2 = __esm({
  "node_modules/@mui/utils/esm/getDisplayName/index.js"() {
    init_getDisplayName();
    init_getDisplayName();
  }
});

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS({
  "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports, module) {
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@mui/system/colorManipulator.js
var require_colorManipulator = __commonJS({
  "node_modules/@mui/system/colorManipulator.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.alpha = alpha2;
    exports.blend = blend;
    exports.colorChannel = void 0;
    exports.darken = darken3;
    exports.decomposeColor = decomposeColor2;
    exports.emphasize = emphasize2;
    exports.getContrastRatio = getContrastRatio3;
    exports.getLuminance = getLuminance2;
    exports.hexToRgb = hexToRgb2;
    exports.hslToRgb = hslToRgb2;
    exports.lighten = lighten3;
    exports.private_safeAlpha = private_safeAlpha;
    exports.private_safeColorChannel = void 0;
    exports.private_safeDarken = private_safeDarken;
    exports.private_safeEmphasize = private_safeEmphasize;
    exports.private_safeLighten = private_safeLighten;
    exports.recomposeColor = recomposeColor2;
    exports.rgbToHex = rgbToHex2;
    var _formatMuiErrorMessage2 = _interopRequireDefault((init_formatMuiErrorMessage2(), __toCommonJS(formatMuiErrorMessage_exports)));
    var _clamp = _interopRequireDefault((init_clamp2(), __toCommonJS(clamp_exports)));
    function clampWrapper2(value, min = 0, max = 1) {
      if (true) {
        if (value < min || value > max) {
          console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
        }
      }
      return (0, _clamp.default)(value, min, max);
    }
    __name(clampWrapper2, "clampWrapper");
    function hexToRgb2(color2) {
      color2 = color2.slice(1);
      const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
      let colors = color2.match(re);
      if (colors && colors[0].length === 1) {
        colors = colors.map((n) => n + n);
      }
      return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n, index) => {
        return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
      }).join(", ")})` : "";
    }
    __name(hexToRgb2, "hexToRgb");
    function intToHex2(int) {
      const hex = int.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }
    __name(intToHex2, "intToHex");
    function decomposeColor2(color2) {
      if (color2.type) {
        return color2;
      }
      if (color2.charAt(0) === "#") {
        return decomposeColor2(hexToRgb2(color2));
      }
      const marker = color2.indexOf("(");
      const type = color2.substring(0, marker);
      if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
        throw new Error(true ? `MUI: Unsupported \`${color2}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : (0, _formatMuiErrorMessage2.default)(9, color2));
      }
      let values2 = color2.substring(marker + 1, color2.length - 1);
      let colorSpace;
      if (type === "color") {
        values2 = values2.split(" ");
        colorSpace = values2.shift();
        if (values2.length === 4 && values2[3].charAt(0) === "/") {
          values2[3] = values2[3].slice(1);
        }
        if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
          throw new Error(true ? `MUI: unsupported \`${colorSpace}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : (0, _formatMuiErrorMessage2.default)(10, colorSpace));
        }
      } else {
        values2 = values2.split(",");
      }
      values2 = values2.map((value) => parseFloat(value));
      return {
        type,
        values: values2,
        colorSpace
      };
    }
    __name(decomposeColor2, "decomposeColor");
    var colorChannel = /* @__PURE__ */ __name((color2) => {
      const decomposedColor = decomposeColor2(color2);
      return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.indexOf("hsl") !== -1 && idx !== 0 ? `${val}%` : val).join(" ");
    }, "colorChannel");
    exports.colorChannel = colorChannel;
    var private_safeColorChannel = /* @__PURE__ */ __name((color2, warning) => {
      try {
        return colorChannel(color2);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color2;
      }
    }, "private_safeColorChannel");
    exports.private_safeColorChannel = private_safeColorChannel;
    function recomposeColor2(color2) {
      const {
        type,
        colorSpace
      } = color2;
      let {
        values: values2
      } = color2;
      if (type.indexOf("rgb") !== -1) {
        values2 = values2.map((n, i) => i < 3 ? parseInt(n, 10) : n);
      } else if (type.indexOf("hsl") !== -1) {
        values2[1] = `${values2[1]}%`;
        values2[2] = `${values2[2]}%`;
      }
      if (type.indexOf("color") !== -1) {
        values2 = `${colorSpace} ${values2.join(" ")}`;
      } else {
        values2 = `${values2.join(", ")}`;
      }
      return `${type}(${values2})`;
    }
    __name(recomposeColor2, "recomposeColor");
    function rgbToHex2(color2) {
      if (color2.indexOf("#") === 0) {
        return color2;
      }
      const {
        values: values2
      } = decomposeColor2(color2);
      return `#${values2.map((n, i) => intToHex2(i === 3 ? Math.round(255 * n) : n)).join("")}`;
    }
    __name(rgbToHex2, "rgbToHex");
    function hslToRgb2(color2) {
      color2 = decomposeColor2(color2);
      const {
        values: values2
      } = color2;
      const h = values2[0];
      const s = values2[1] / 100;
      const l = values2[2] / 100;
      const a = s * Math.min(l, 1 - l);
      const f = /* @__PURE__ */ __name((n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1), "f");
      let type = "rgb";
      const rgb = [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
      if (color2.type === "hsla") {
        type += "a";
        rgb.push(values2[3]);
      }
      return recomposeColor2({
        type,
        values: rgb
      });
    }
    __name(hslToRgb2, "hslToRgb");
    function getLuminance2(color2) {
      color2 = decomposeColor2(color2);
      let rgb = color2.type === "hsl" || color2.type === "hsla" ? decomposeColor2(hslToRgb2(color2)).values : color2.values;
      rgb = rgb.map((val) => {
        if (color2.type !== "color") {
          val /= 255;
        }
        return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
      });
      return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
    }
    __name(getLuminance2, "getLuminance");
    function getContrastRatio3(foreground, background) {
      const lumA = getLuminance2(foreground);
      const lumB = getLuminance2(background);
      return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
    }
    __name(getContrastRatio3, "getContrastRatio");
    function alpha2(color2, value) {
      color2 = decomposeColor2(color2);
      value = clampWrapper2(value);
      if (color2.type === "rgb" || color2.type === "hsl") {
        color2.type += "a";
      }
      if (color2.type === "color") {
        color2.values[3] = `/${value}`;
      } else {
        color2.values[3] = value;
      }
      return recomposeColor2(color2);
    }
    __name(alpha2, "alpha");
    function private_safeAlpha(color2, value, warning) {
      try {
        return alpha2(color2, value);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color2;
      }
    }
    __name(private_safeAlpha, "private_safeAlpha");
    function darken3(color2, coefficient) {
      color2 = decomposeColor2(color2);
      coefficient = clampWrapper2(coefficient);
      if (color2.type.indexOf("hsl") !== -1) {
        color2.values[2] *= 1 - coefficient;
      } else if (color2.type.indexOf("rgb") !== -1 || color2.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color2.values[i] *= 1 - coefficient;
        }
      }
      return recomposeColor2(color2);
    }
    __name(darken3, "darken");
    function private_safeDarken(color2, coefficient, warning) {
      try {
        return darken3(color2, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color2;
      }
    }
    __name(private_safeDarken, "private_safeDarken");
    function lighten3(color2, coefficient) {
      color2 = decomposeColor2(color2);
      coefficient = clampWrapper2(coefficient);
      if (color2.type.indexOf("hsl") !== -1) {
        color2.values[2] += (100 - color2.values[2]) * coefficient;
      } else if (color2.type.indexOf("rgb") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color2.values[i] += (255 - color2.values[i]) * coefficient;
        }
      } else if (color2.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color2.values[i] += (1 - color2.values[i]) * coefficient;
        }
      }
      return recomposeColor2(color2);
    }
    __name(lighten3, "lighten");
    function private_safeLighten(color2, coefficient, warning) {
      try {
        return lighten3(color2, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color2;
      }
    }
    __name(private_safeLighten, "private_safeLighten");
    function emphasize2(color2, coefficient = 0.15) {
      return getLuminance2(color2) > 0.5 ? darken3(color2, coefficient) : lighten3(color2, coefficient);
    }
    __name(emphasize2, "emphasize");
    function private_safeEmphasize(color2, coefficient, warning) {
      try {
        return emphasize2(color2, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color2;
      }
    }
    __name(private_safeEmphasize, "private_safeEmphasize");
    function blend(background, overlay, opacity, gamma = 1) {
      const blendChannel = /* @__PURE__ */ __name((b, o) => Math.round((b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma), "blendChannel");
      const backgroundColor2 = decomposeColor2(background);
      const overlayColor = decomposeColor2(overlay);
      const rgb = [blendChannel(backgroundColor2.values[0], overlayColor.values[0]), blendChannel(backgroundColor2.values[1], overlayColor.values[1]), blendChannel(backgroundColor2.values[2], overlayColor.values[2])];
      return recomposeColor2({
        type: "rgb",
        values: rgb
      });
    }
    __name(blend, "blend");
  }
});

// node_modules/@mui/material/styles/identifier.js
var identifier_default = "$$material";

// node_modules/@mui/utils/esm/ClassNameGenerator/ClassNameGenerator.js
var defaultGenerator = /* @__PURE__ */ __name((componentName) => componentName, "defaultGenerator");
var createClassNameGenerator = /* @__PURE__ */ __name(() => {
  let generate = defaultGenerator;
  return {
    configure(generator) {
      generate = generator;
    },
    generate(componentName) {
      return generate(componentName);
    },
    reset() {
      generate = defaultGenerator;
    }
  };
}, "createClassNameGenerator");
var ClassNameGenerator = createClassNameGenerator();
var ClassNameGenerator_default = ClassNameGenerator;

// node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js
var globalStateClasses = {
  active: "active",
  checked: "checked",
  completed: "completed",
  disabled: "disabled",
  error: "error",
  expanded: "expanded",
  focused: "focused",
  focusVisible: "focusVisible",
  open: "open",
  readOnly: "readOnly",
  required: "required",
  selected: "selected"
};
function generateUtilityClass(componentName, slot, globalStatePrefix = "Mui") {
  const globalStateClass = globalStateClasses[slot];
  return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator_default.generate(componentName)}-${slot}`;
}
__name(generateUtilityClass, "generateUtilityClass");

// node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js
function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
  const result = {};
  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
  });
  return result;
}
__name(generateUtilityClasses, "generateUtilityClasses");

// node_modules/@mui/system/esm/useMediaQuery/useMediaQuery.js
var React6 = __toESM(require_react());

// node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js
var React3 = __toESM(require_react());
var useEnhancedEffect = typeof window !== "undefined" ? React3.useLayoutEffect : React3.useEffect;
var useEnhancedEffect_default = useEnhancedEffect;

// node_modules/@mui/utils/esm/resolveProps/resolveProps.js
init_extends();
function resolveProps(defaultProps, props) {
  const output = _extends({}, props);
  Object.keys(defaultProps).forEach((propName) => {
    if (propName.toString().match(/^(components|slots)$/)) {
      output[propName] = _extends({}, defaultProps[propName], output[propName]);
    } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
      const defaultSlotProps = defaultProps[propName] || {};
      const slotProps = props[propName];
      output[propName] = {};
      if (!slotProps || !Object.keys(slotProps)) {
        output[propName] = defaultSlotProps;
      } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
        output[propName] = slotProps;
      } else {
        output[propName] = _extends({}, slotProps);
        Object.keys(defaultSlotProps).forEach((slotPropName) => {
          output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
        });
      }
    } else if (output[propName] === void 0) {
      output[propName] = defaultProps[propName];
    }
  });
  return output;
}
__name(resolveProps, "resolveProps");

// node_modules/@mui/system/esm/useThemeProps/getThemeProps.js
function getThemeProps(params) {
  const {
    theme,
    name,
    props
  } = params;
  if (!theme || !theme.components || !theme.components[name] || !theme.components[name].defaultProps) {
    return props;
  }
  return resolveProps(theme.components[name].defaultProps, props);
}
__name(getThemeProps, "getThemeProps");

// node_modules/@mui/system/esm/createTheme/createTheme.js
init_extends();
init_deepmerge2();

// node_modules/@mui/system/esm/createTheme/createBreakpoints.js
init_extends();
var _excluded = ["values", "unit", "step"];
var sortBreakpointsValues = /* @__PURE__ */ __name((values2) => {
  const breakpointsAsArray = Object.keys(values2).map((key) => ({
    key,
    val: values2[key]
  })) || [];
  breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
  return breakpointsAsArray.reduce((acc, obj) => {
    return _extends({}, acc, {
      [obj.key]: obj.val
    });
  }, {});
}, "sortBreakpointsValues");
function createBreakpoints(breakpoints) {
  const {
    // The breakpoint **start** at this value.
    // For instance with the first breakpoint xs: [xs, sm).
    values: values2 = {
      xs: 0,
      // phone
      sm: 600,
      // tablet
      md: 900,
      // small laptop
      lg: 1200,
      // desktop
      xl: 1536
      // large screen
    },
    unit = "px",
    step = 5
  } = breakpoints, other = _objectWithoutPropertiesLoose(breakpoints, _excluded);
  const sortedValues = sortBreakpointsValues(values2);
  const keys = Object.keys(sortedValues);
  function up(key) {
    const value = typeof values2[key] === "number" ? values2[key] : key;
    return `@media (min-width:${value}${unit})`;
  }
  __name(up, "up");
  function down(key) {
    const value = typeof values2[key] === "number" ? values2[key] : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  }
  __name(down, "down");
  function between(start, end) {
    const endIndex = keys.indexOf(end);
    return `@media (min-width:${typeof values2[start] === "number" ? values2[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys[endIndex]] === "number" ? values2[keys[endIndex]] : end) - step / 100}${unit})`;
  }
  __name(between, "between");
  function only(key) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1]);
    }
    return up(key);
  }
  __name(only, "only");
  function not(key) {
    const keyIndex = keys.indexOf(key);
    if (keyIndex === 0) {
      return up(keys[1]);
    }
    if (keyIndex === keys.length - 1) {
      return down(keys[keyIndex]);
    }
    return between(key, keys[keys.indexOf(key) + 1]).replace("@media", "@media not all and");
  }
  __name(not, "not");
  return _extends({
    keys,
    values: sortedValues,
    up,
    down,
    between,
    only,
    not,
    unit
  }, other);
}
__name(createBreakpoints, "createBreakpoints");

// node_modules/@mui/system/esm/createTheme/shape.js
var shape = {
  borderRadius: 4
};
var shape_default = shape;

// node_modules/@mui/system/esm/responsivePropType.js
var import_prop_types3 = __toESM(require_prop_types());
var responsivePropType = true ? import_prop_types3.default.oneOfType([import_prop_types3.default.number, import_prop_types3.default.string, import_prop_types3.default.object, import_prop_types3.default.array]) : {};
var responsivePropType_default = responsivePropType;

// node_modules/@mui/system/esm/breakpoints.js
init_extends();
var import_prop_types4 = __toESM(require_prop_types());
init_deepmerge2();

// node_modules/@mui/system/esm/merge.js
init_deepmerge2();
function merge(acc, item) {
  if (!item) {
    return acc;
  }
  return deepmerge(acc, item, {
    clone: false
    // No need to clone deep, it's way faster.
  });
}
__name(merge, "merge");
var merge_default = merge;

// node_modules/@mui/system/esm/breakpoints.js
var values = {
  xs: 0,
  // phone
  sm: 600,
  // tablet
  md: 900,
  // small laptop
  lg: 1200,
  // desktop
  xl: 1536
  // large screen
};
var defaultBreakpoints = {
  // Sorted ASC by size. That's important.
  // It can't be configured as it's used statically for propTypes.
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: /* @__PURE__ */ __name((key) => `@media (min-width:${values[key]}px)`, "up")
};
function handleBreakpoints(props, propValue, styleFromPropValue) {
  const theme = props.theme || {};
  if (Array.isArray(propValue)) {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return propValue.reduce((acc, item, index) => {
      acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
      return acc;
    }, {});
  }
  if (typeof propValue === "object") {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return Object.keys(propValue).reduce((acc, breakpoint) => {
      if (Object.keys(themeBreakpoints.values || values).indexOf(breakpoint) !== -1) {
        const mediaKey = themeBreakpoints.up(breakpoint);
        acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
      } else {
        const cssKey = breakpoint;
        acc[cssKey] = propValue[cssKey];
      }
      return acc;
    }, {});
  }
  const output = styleFromPropValue(propValue);
  return output;
}
__name(handleBreakpoints, "handleBreakpoints");
function createEmptyBreakpointObject(breakpointsInput = {}) {
  var _breakpointsInput$key;
  const breakpointsInOrder = (_breakpointsInput$key = breakpointsInput.keys) == null ? void 0 : _breakpointsInput$key.reduce((acc, key) => {
    const breakpointStyleKey = breakpointsInput.up(key);
    acc[breakpointStyleKey] = {};
    return acc;
  }, {});
  return breakpointsInOrder || {};
}
__name(createEmptyBreakpointObject, "createEmptyBreakpointObject");
function removeUnusedBreakpoints(breakpointKeys, style4) {
  return breakpointKeys.reduce((acc, key) => {
    const breakpointOutput = acc[key];
    const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
    if (isBreakpointUnused) {
      delete acc[key];
    }
    return acc;
  }, style4);
}
__name(removeUnusedBreakpoints, "removeUnusedBreakpoints");
function mergeBreakpointsInOrder(breakpointsInput, ...styles) {
  const emptyBreakpoints = createEmptyBreakpointObject(breakpointsInput);
  const mergedOutput = [emptyBreakpoints, ...styles].reduce((prev, next) => deepmerge(prev, next), {});
  return removeUnusedBreakpoints(Object.keys(emptyBreakpoints), mergedOutput);
}
__name(mergeBreakpointsInOrder, "mergeBreakpointsInOrder");
function computeBreakpointsBase(breakpointValues, themeBreakpoints) {
  if (typeof breakpointValues !== "object") {
    return {};
  }
  const base = {};
  const breakpointsKeys = Object.keys(themeBreakpoints);
  if (Array.isArray(breakpointValues)) {
    breakpointsKeys.forEach((breakpoint, i) => {
      if (i < breakpointValues.length) {
        base[breakpoint] = true;
      }
    });
  } else {
    breakpointsKeys.forEach((breakpoint) => {
      if (breakpointValues[breakpoint] != null) {
        base[breakpoint] = true;
      }
    });
  }
  return base;
}
__name(computeBreakpointsBase, "computeBreakpointsBase");
function resolveBreakpointValues({
  values: breakpointValues,
  breakpoints: themeBreakpoints,
  base: customBase
}) {
  const base = customBase || computeBreakpointsBase(breakpointValues, themeBreakpoints);
  const keys = Object.keys(base);
  if (keys.length === 0) {
    return breakpointValues;
  }
  let previous;
  return keys.reduce((acc, breakpoint, i) => {
    if (Array.isArray(breakpointValues)) {
      acc[breakpoint] = breakpointValues[i] != null ? breakpointValues[i] : breakpointValues[previous];
      previous = i;
    } else if (typeof breakpointValues === "object") {
      acc[breakpoint] = breakpointValues[breakpoint] != null ? breakpointValues[breakpoint] : breakpointValues[previous];
      previous = breakpoint;
    } else {
      acc[breakpoint] = breakpointValues;
    }
    return acc;
  }, {});
}
__name(resolveBreakpointValues, "resolveBreakpointValues");

// node_modules/@mui/system/esm/style.js
init_capitalize2();
function getPath(obj, path, checkVars = true) {
  if (!path || typeof path !== "string") {
    return null;
  }
  if (obj && obj.vars && checkVars) {
    const val = `vars.${path}`.split(".").reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
    if (val != null) {
      return val;
    }
  }
  return path.split(".").reduce((acc, item) => {
    if (acc && acc[item] != null) {
      return acc[item];
    }
    return null;
  }, obj);
}
__name(getPath, "getPath");
function getStyleValue(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
  let value;
  if (typeof themeMapping === "function") {
    value = themeMapping(propValueFinal);
  } else if (Array.isArray(themeMapping)) {
    value = themeMapping[propValueFinal] || userValue;
  } else {
    value = getPath(themeMapping, propValueFinal) || userValue;
  }
  if (transform) {
    value = transform(value, userValue, themeMapping);
  }
  return value;
}
__name(getStyleValue, "getStyleValue");
function style(options) {
  const {
    prop,
    cssProperty = options.prop,
    themeKey,
    transform
  } = options;
  const fn = /* @__PURE__ */ __name((props) => {
    if (props[prop] == null) {
      return null;
    }
    const propValue = props[prop];
    const theme = props.theme;
    const themeMapping = getPath(theme, themeKey) || {};
    const styleFromPropValue = /* @__PURE__ */ __name((propValueFinal) => {
      let value = getStyleValue(themeMapping, transform, propValueFinal);
      if (propValueFinal === value && typeof propValueFinal === "string") {
        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
      }
      if (cssProperty === false) {
        return value;
      }
      return {
        [cssProperty]: value
      };
    }, "styleFromPropValue");
    return handleBreakpoints(props, propValue, styleFromPropValue);
  }, "fn");
  fn.propTypes = true ? {
    [prop]: responsivePropType_default
  } : {};
  fn.filterProps = [prop];
  return fn;
}
__name(style, "style");
var style_default = style;

// node_modules/@mui/system/esm/memoize.js
function memoize(fn) {
  const cache2 = {};
  return (arg) => {
    if (cache2[arg] === void 0) {
      cache2[arg] = fn(arg);
    }
    return cache2[arg];
  };
}
__name(memoize, "memoize");

// node_modules/@mui/system/esm/spacing.js
var properties = {
  m: "margin",
  p: "padding"
};
var directions = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"]
};
var aliases = {
  marginX: "mx",
  marginY: "my",
  paddingX: "px",
  paddingY: "py"
};
var getCssProperties = memoize((prop) => {
  if (prop.length > 2) {
    if (aliases[prop]) {
      prop = aliases[prop];
    } else {
      return [prop];
    }
  }
  const [a, b] = prop.split("");
  const property = properties[a];
  const direction = directions[b] || "";
  return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
});
var marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
var paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
var spacingKeys = [...marginKeys, ...paddingKeys];
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
  var _getPath;
  const themeSpacing = (_getPath = getPath(theme, themeKey, false)) != null ? _getPath : defaultValue;
  if (typeof themeSpacing === "number") {
    return (abs) => {
      if (typeof abs === "string") {
        return abs;
      }
      if (true) {
        if (typeof abs !== "number") {
          console.error(`MUI: Expected ${propName} argument to be a number or a string, got ${abs}.`);
        }
      }
      return themeSpacing * abs;
    };
  }
  if (Array.isArray(themeSpacing)) {
    return (abs) => {
      if (typeof abs === "string") {
        return abs;
      }
      if (true) {
        if (!Number.isInteger(abs)) {
          console.error([`MUI: The \`theme.${themeKey}\` array type cannot be combined with non integer values.You should either use an integer value that can be used as index, or define the \`theme.${themeKey}\` as a number.`].join("\n"));
        } else if (abs > themeSpacing.length - 1) {
          console.error([`MUI: The value provided (${abs}) overflows.`, `The supported values are: ${JSON.stringify(themeSpacing)}.`, `${abs} > ${themeSpacing.length - 1}, you need to add the missing values.`].join("\n"));
        }
      }
      return themeSpacing[abs];
    };
  }
  if (typeof themeSpacing === "function") {
    return themeSpacing;
  }
  if (true) {
    console.error([`MUI: The \`theme.${themeKey}\` value (${themeSpacing}) is invalid.`, "It should be a number, an array or a function."].join("\n"));
  }
  return () => void 0;
}
__name(createUnaryUnit, "createUnaryUnit");
function createUnarySpacing(theme) {
  return createUnaryUnit(theme, "spacing", 8, "spacing");
}
__name(createUnarySpacing, "createUnarySpacing");
function getValue(transformer, propValue) {
  if (typeof propValue === "string" || propValue == null) {
    return propValue;
  }
  const abs = Math.abs(propValue);
  const transformed = transformer(abs);
  if (propValue >= 0) {
    return transformed;
  }
  if (typeof transformed === "number") {
    return -transformed;
  }
  return `-${transformed}`;
}
__name(getValue, "getValue");
function getStyleFromPropValue(cssProperties, transformer) {
  return (propValue) => cssProperties.reduce((acc, cssProperty) => {
    acc[cssProperty] = getValue(transformer, propValue);
    return acc;
  }, {});
}
__name(getStyleFromPropValue, "getStyleFromPropValue");
function resolveCssProperty(props, keys, prop, transformer) {
  if (keys.indexOf(prop) === -1) {
    return null;
  }
  const cssProperties = getCssProperties(prop);
  const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
  const propValue = props[prop];
  return handleBreakpoints(props, propValue, styleFromPropValue);
}
__name(resolveCssProperty, "resolveCssProperty");
function style2(props, keys) {
  const transformer = createUnarySpacing(props.theme);
  return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(merge_default, {});
}
__name(style2, "style");
function margin(props) {
  return style2(props, marginKeys);
}
__name(margin, "margin");
margin.propTypes = true ? marginKeys.reduce((obj, key) => {
  obj[key] = responsivePropType_default;
  return obj;
}, {}) : {};
margin.filterProps = marginKeys;
function padding(props) {
  return style2(props, paddingKeys);
}
__name(padding, "padding");
padding.propTypes = true ? paddingKeys.reduce((obj, key) => {
  obj[key] = responsivePropType_default;
  return obj;
}, {}) : {};
padding.filterProps = paddingKeys;
function spacing(props) {
  return style2(props, spacingKeys);
}
__name(spacing, "spacing");
spacing.propTypes = true ? spacingKeys.reduce((obj, key) => {
  obj[key] = responsivePropType_default;
  return obj;
}, {}) : {};
spacing.filterProps = spacingKeys;
var spacing_default = spacing;

// node_modules/@mui/system/esm/createTheme/createSpacing.js
function createSpacing(spacingInput = 8) {
  if (spacingInput.mui) {
    return spacingInput;
  }
  const transform = createUnarySpacing({
    spacing: spacingInput
  });
  const spacing2 = /* @__PURE__ */ __name((...argsInput) => {
    if (true) {
      if (!(argsInput.length <= 4)) {
        console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${argsInput.length}`);
      }
    }
    const args = argsInput.length === 0 ? [1] : argsInput;
    return args.map((argument) => {
      const output = transform(argument);
      return typeof output === "number" ? `${output}px` : output;
    }).join(" ");
  }, "spacing");
  spacing2.mui = true;
  return spacing2;
}
__name(createSpacing, "createSpacing");

// node_modules/@mui/system/esm/styleFunctionSx/styleFunctionSx.js
init_capitalize2();

// node_modules/@mui/system/esm/compose.js
function compose(...styles) {
  const handlers = styles.reduce((acc, style4) => {
    style4.filterProps.forEach((prop) => {
      acc[prop] = style4;
    });
    return acc;
  }, {});
  const fn = /* @__PURE__ */ __name((props) => {
    return Object.keys(props).reduce((acc, prop) => {
      if (handlers[prop]) {
        return merge_default(acc, handlers[prop](props));
      }
      return acc;
    }, {});
  }, "fn");
  fn.propTypes = true ? styles.reduce((acc, style4) => Object.assign(acc, style4.propTypes), {}) : {};
  fn.filterProps = styles.reduce((acc, style4) => acc.concat(style4.filterProps), []);
  return fn;
}
__name(compose, "compose");
var compose_default = compose;

// node_modules/@mui/system/esm/borders.js
function borderTransform(value) {
  if (typeof value !== "number") {
    return value;
  }
  return `${value}px solid`;
}
__name(borderTransform, "borderTransform");
function createBorderStyle(prop, transform) {
  return style_default({
    prop,
    themeKey: "borders",
    transform
  });
}
__name(createBorderStyle, "createBorderStyle");
var border = createBorderStyle("border", borderTransform);
var borderTop = createBorderStyle("borderTop", borderTransform);
var borderRight = createBorderStyle("borderRight", borderTransform);
var borderBottom = createBorderStyle("borderBottom", borderTransform);
var borderLeft = createBorderStyle("borderLeft", borderTransform);
var borderColor = createBorderStyle("borderColor");
var borderTopColor = createBorderStyle("borderTopColor");
var borderRightColor = createBorderStyle("borderRightColor");
var borderBottomColor = createBorderStyle("borderBottomColor");
var borderLeftColor = createBorderStyle("borderLeftColor");
var outline = createBorderStyle("outline", borderTransform);
var outlineColor = createBorderStyle("outlineColor");
var borderRadius = /* @__PURE__ */ __name((props) => {
  if (props.borderRadius !== void 0 && props.borderRadius !== null) {
    const transformer = createUnaryUnit(props.theme, "shape.borderRadius", 4, "borderRadius");
    const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
      borderRadius: getValue(transformer, propValue)
    }), "styleFromPropValue");
    return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
  }
  return null;
}, "borderRadius");
borderRadius.propTypes = true ? {
  borderRadius: responsivePropType_default
} : {};
borderRadius.filterProps = ["borderRadius"];
var borders = compose_default(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
var borders_default = borders;

// node_modules/@mui/system/esm/cssGrid.js
var gap = /* @__PURE__ */ __name((props) => {
  if (props.gap !== void 0 && props.gap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8, "gap");
    const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
      gap: getValue(transformer, propValue)
    }), "styleFromPropValue");
    return handleBreakpoints(props, props.gap, styleFromPropValue);
  }
  return null;
}, "gap");
gap.propTypes = true ? {
  gap: responsivePropType_default
} : {};
gap.filterProps = ["gap"];
var columnGap = /* @__PURE__ */ __name((props) => {
  if (props.columnGap !== void 0 && props.columnGap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8, "columnGap");
    const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
      columnGap: getValue(transformer, propValue)
    }), "styleFromPropValue");
    return handleBreakpoints(props, props.columnGap, styleFromPropValue);
  }
  return null;
}, "columnGap");
columnGap.propTypes = true ? {
  columnGap: responsivePropType_default
} : {};
columnGap.filterProps = ["columnGap"];
var rowGap = /* @__PURE__ */ __name((props) => {
  if (props.rowGap !== void 0 && props.rowGap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8, "rowGap");
    const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
      rowGap: getValue(transformer, propValue)
    }), "styleFromPropValue");
    return handleBreakpoints(props, props.rowGap, styleFromPropValue);
  }
  return null;
}, "rowGap");
rowGap.propTypes = true ? {
  rowGap: responsivePropType_default
} : {};
rowGap.filterProps = ["rowGap"];
var gridColumn = style_default({
  prop: "gridColumn"
});
var gridRow = style_default({
  prop: "gridRow"
});
var gridAutoFlow = style_default({
  prop: "gridAutoFlow"
});
var gridAutoColumns = style_default({
  prop: "gridAutoColumns"
});
var gridAutoRows = style_default({
  prop: "gridAutoRows"
});
var gridTemplateColumns = style_default({
  prop: "gridTemplateColumns"
});
var gridTemplateRows = style_default({
  prop: "gridTemplateRows"
});
var gridTemplateAreas = style_default({
  prop: "gridTemplateAreas"
});
var gridArea = style_default({
  prop: "gridArea"
});
var grid = compose_default(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
var cssGrid_default = grid;

// node_modules/@mui/system/esm/palette.js
function paletteTransform(value, userValue) {
  if (userValue === "grey") {
    return userValue;
  }
  return value;
}
__name(paletteTransform, "paletteTransform");
var color = style_default({
  prop: "color",
  themeKey: "palette",
  transform: paletteTransform
});
var bgcolor = style_default({
  prop: "bgcolor",
  cssProperty: "backgroundColor",
  themeKey: "palette",
  transform: paletteTransform
});
var backgroundColor = style_default({
  prop: "backgroundColor",
  themeKey: "palette",
  transform: paletteTransform
});
var palette = compose_default(color, bgcolor, backgroundColor);
var palette_default = palette;

// node_modules/@mui/system/esm/sizing.js
function sizingTransform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}
__name(sizingTransform, "sizingTransform");
var width = style_default({
  prop: "width",
  transform: sizingTransform
});
var maxWidth = /* @__PURE__ */ __name((props) => {
  if (props.maxWidth !== void 0 && props.maxWidth !== null) {
    const styleFromPropValue = /* @__PURE__ */ __name((propValue) => {
      var _props$theme, _props$theme2;
      const breakpoint = ((_props$theme = props.theme) == null || (_props$theme = _props$theme.breakpoints) == null || (_props$theme = _props$theme.values) == null ? void 0 : _props$theme[propValue]) || values[propValue];
      if (!breakpoint) {
        return {
          maxWidth: sizingTransform(propValue)
        };
      }
      if (((_props$theme2 = props.theme) == null || (_props$theme2 = _props$theme2.breakpoints) == null ? void 0 : _props$theme2.unit) !== "px") {
        return {
          maxWidth: `${breakpoint}${props.theme.breakpoints.unit}`
        };
      }
      return {
        maxWidth: breakpoint
      };
    }, "styleFromPropValue");
    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
  }
  return null;
}, "maxWidth");
maxWidth.filterProps = ["maxWidth"];
var minWidth = style_default({
  prop: "minWidth",
  transform: sizingTransform
});
var height = style_default({
  prop: "height",
  transform: sizingTransform
});
var maxHeight = style_default({
  prop: "maxHeight",
  transform: sizingTransform
});
var minHeight = style_default({
  prop: "minHeight",
  transform: sizingTransform
});
var sizeWidth = style_default({
  prop: "size",
  cssProperty: "width",
  transform: sizingTransform
});
var sizeHeight = style_default({
  prop: "size",
  cssProperty: "height",
  transform: sizingTransform
});
var boxSizing = style_default({
  prop: "boxSizing"
});
var sizing = compose_default(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
var sizing_default = sizing;

// node_modules/@mui/system/esm/styleFunctionSx/defaultSxConfig.js
var defaultSxConfig = {
  // borders
  border: {
    themeKey: "borders",
    transform: borderTransform
  },
  borderTop: {
    themeKey: "borders",
    transform: borderTransform
  },
  borderRight: {
    themeKey: "borders",
    transform: borderTransform
  },
  borderBottom: {
    themeKey: "borders",
    transform: borderTransform
  },
  borderLeft: {
    themeKey: "borders",
    transform: borderTransform
  },
  borderColor: {
    themeKey: "palette"
  },
  borderTopColor: {
    themeKey: "palette"
  },
  borderRightColor: {
    themeKey: "palette"
  },
  borderBottomColor: {
    themeKey: "palette"
  },
  borderLeftColor: {
    themeKey: "palette"
  },
  outline: {
    themeKey: "borders",
    transform: borderTransform
  },
  outlineColor: {
    themeKey: "palette"
  },
  borderRadius: {
    themeKey: "shape.borderRadius",
    style: borderRadius
  },
  // palette
  color: {
    themeKey: "palette",
    transform: paletteTransform
  },
  bgcolor: {
    themeKey: "palette",
    cssProperty: "backgroundColor",
    transform: paletteTransform
  },
  backgroundColor: {
    themeKey: "palette",
    transform: paletteTransform
  },
  // spacing
  p: {
    style: padding
  },
  pt: {
    style: padding
  },
  pr: {
    style: padding
  },
  pb: {
    style: padding
  },
  pl: {
    style: padding
  },
  px: {
    style: padding
  },
  py: {
    style: padding
  },
  padding: {
    style: padding
  },
  paddingTop: {
    style: padding
  },
  paddingRight: {
    style: padding
  },
  paddingBottom: {
    style: padding
  },
  paddingLeft: {
    style: padding
  },
  paddingX: {
    style: padding
  },
  paddingY: {
    style: padding
  },
  paddingInline: {
    style: padding
  },
  paddingInlineStart: {
    style: padding
  },
  paddingInlineEnd: {
    style: padding
  },
  paddingBlock: {
    style: padding
  },
  paddingBlockStart: {
    style: padding
  },
  paddingBlockEnd: {
    style: padding
  },
  m: {
    style: margin
  },
  mt: {
    style: margin
  },
  mr: {
    style: margin
  },
  mb: {
    style: margin
  },
  ml: {
    style: margin
  },
  mx: {
    style: margin
  },
  my: {
    style: margin
  },
  margin: {
    style: margin
  },
  marginTop: {
    style: margin
  },
  marginRight: {
    style: margin
  },
  marginBottom: {
    style: margin
  },
  marginLeft: {
    style: margin
  },
  marginX: {
    style: margin
  },
  marginY: {
    style: margin
  },
  marginInline: {
    style: margin
  },
  marginInlineStart: {
    style: margin
  },
  marginInlineEnd: {
    style: margin
  },
  marginBlock: {
    style: margin
  },
  marginBlockStart: {
    style: margin
  },
  marginBlockEnd: {
    style: margin
  },
  // display
  displayPrint: {
    cssProperty: false,
    transform: /* @__PURE__ */ __name((value) => ({
      "@media print": {
        display: value
      }
    }), "transform")
  },
  display: {},
  overflow: {},
  textOverflow: {},
  visibility: {},
  whiteSpace: {},
  // flexbox
  flexBasis: {},
  flexDirection: {},
  flexWrap: {},
  justifyContent: {},
  alignItems: {},
  alignContent: {},
  order: {},
  flex: {},
  flexGrow: {},
  flexShrink: {},
  alignSelf: {},
  justifyItems: {},
  justifySelf: {},
  // grid
  gap: {
    style: gap
  },
  rowGap: {
    style: rowGap
  },
  columnGap: {
    style: columnGap
  },
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoColumns: {},
  gridAutoRows: {},
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridTemplateAreas: {},
  gridArea: {},
  // positions
  position: {},
  zIndex: {
    themeKey: "zIndex"
  },
  top: {},
  right: {},
  bottom: {},
  left: {},
  // shadows
  boxShadow: {
    themeKey: "shadows"
  },
  // sizing
  width: {
    transform: sizingTransform
  },
  maxWidth: {
    style: maxWidth
  },
  minWidth: {
    transform: sizingTransform
  },
  height: {
    transform: sizingTransform
  },
  maxHeight: {
    transform: sizingTransform
  },
  minHeight: {
    transform: sizingTransform
  },
  boxSizing: {},
  // typography
  fontFamily: {
    themeKey: "typography"
  },
  fontSize: {
    themeKey: "typography"
  },
  fontStyle: {
    themeKey: "typography"
  },
  fontWeight: {
    themeKey: "typography"
  },
  letterSpacing: {},
  textTransform: {},
  lineHeight: {},
  textAlign: {},
  typography: {
    cssProperty: false,
    themeKey: "typography"
  }
};
var defaultSxConfig_default = defaultSxConfig;

// node_modules/@mui/system/esm/styleFunctionSx/styleFunctionSx.js
function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}
__name(objectsHaveSameKeys, "objectsHaveSameKeys");
function callIfFn(maybeFn, arg) {
  return typeof maybeFn === "function" ? maybeFn(arg) : maybeFn;
}
__name(callIfFn, "callIfFn");
function unstable_createStyleFunctionSx() {
  function getThemeValue(prop, val, theme, config) {
    const props = {
      [prop]: val,
      theme
    };
    const options = config[prop];
    if (!options) {
      return {
        [prop]: val
      };
    }
    const {
      cssProperty = prop,
      themeKey,
      transform,
      style: style4
    } = options;
    if (val == null) {
      return null;
    }
    if (themeKey === "typography" && val === "inherit") {
      return {
        [prop]: val
      };
    }
    const themeMapping = getPath(theme, themeKey) || {};
    if (style4) {
      return style4(props);
    }
    const styleFromPropValue = /* @__PURE__ */ __name((propValueFinal) => {
      let value = getStyleValue(themeMapping, transform, propValueFinal);
      if (propValueFinal === value && typeof propValueFinal === "string") {
        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
      }
      if (cssProperty === false) {
        return value;
      }
      return {
        [cssProperty]: value
      };
    }, "styleFromPropValue");
    return handleBreakpoints(props, val, styleFromPropValue);
  }
  __name(getThemeValue, "getThemeValue");
  function styleFunctionSx2(props) {
    var _theme$unstable_sxCon;
    const {
      sx,
      theme = {}
    } = props || {};
    if (!sx) {
      return null;
    }
    const config = (_theme$unstable_sxCon = theme.unstable_sxConfig) != null ? _theme$unstable_sxCon : defaultSxConfig_default;
    function traverse(sxInput) {
      let sxObject = sxInput;
      if (typeof sxInput === "function") {
        sxObject = sxInput(theme);
      } else if (typeof sxInput !== "object") {
        return sxInput;
      }
      if (!sxObject) {
        return null;
      }
      const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
      const breakpointsKeys = Object.keys(emptyBreakpoints);
      let css2 = emptyBreakpoints;
      Object.keys(sxObject).forEach((styleKey) => {
        const value = callIfFn(sxObject[styleKey], theme);
        if (value !== null && value !== void 0) {
          if (typeof value === "object") {
            if (config[styleKey]) {
              css2 = merge_default(css2, getThemeValue(styleKey, value, theme, config));
            } else {
              const breakpointsValues = handleBreakpoints({
                theme
              }, value, (x) => ({
                [styleKey]: x
              }));
              if (objectsHaveSameKeys(breakpointsValues, value)) {
                css2[styleKey] = styleFunctionSx2({
                  sx: value,
                  theme
                });
              } else {
                css2 = merge_default(css2, breakpointsValues);
              }
            }
          } else {
            css2 = merge_default(css2, getThemeValue(styleKey, value, theme, config));
          }
        }
      });
      return removeUnusedBreakpoints(breakpointsKeys, css2);
    }
    __name(traverse, "traverse");
    return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
  }
  __name(styleFunctionSx2, "styleFunctionSx");
  return styleFunctionSx2;
}
__name(unstable_createStyleFunctionSx, "unstable_createStyleFunctionSx");
var styleFunctionSx = unstable_createStyleFunctionSx();
styleFunctionSx.filterProps = ["sx"];
var styleFunctionSx_default = styleFunctionSx;

// node_modules/@mui/system/esm/createTheme/applyStyles.js
function applyStyles(key, styles) {
  const theme = this;
  if (theme.vars && typeof theme.getColorSchemeSelector === "function") {
    const selector = theme.getColorSchemeSelector(key).replace(/(\[[^\]]+\])/, "*:where($1)");
    return {
      [selector]: styles
    };
  }
  if (theme.palette.mode === key) {
    return styles;
  }
  return {};
}
__name(applyStyles, "applyStyles");

// node_modules/@mui/system/esm/createTheme/createTheme.js
var _excluded2 = ["breakpoints", "palette", "spacing", "shape"];
function createTheme(options = {}, ...args) {
  const {
    breakpoints: breakpointsInput = {},
    palette: paletteInput = {},
    spacing: spacingInput,
    shape: shapeInput = {}
  } = options, other = _objectWithoutPropertiesLoose(options, _excluded2);
  const breakpoints = createBreakpoints(breakpointsInput);
  const spacing2 = createSpacing(spacingInput);
  let muiTheme = deepmerge({
    breakpoints,
    direction: "ltr",
    components: {},
    // Inject component definitions.
    palette: _extends({
      mode: "light"
    }, paletteInput),
    spacing: spacing2,
    shape: _extends({}, shape_default, shapeInput)
  }, other);
  muiTheme.applyStyles = applyStyles;
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
  muiTheme.unstable_sxConfig = _extends({}, defaultSxConfig_default, other == null ? void 0 : other.unstable_sxConfig);
  muiTheme.unstable_sx = /* @__PURE__ */ __name(function sx(props) {
    return styleFunctionSx_default({
      sx: props,
      theme: this
    });
  }, "sx");
  return muiTheme;
}
__name(createTheme, "createTheme");
var createTheme_default = createTheme;

// node_modules/@mui/system/esm/useThemeWithoutDefault.js
var React5 = __toESM(require_react());
init_styled_engine();
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
__name(isObjectEmpty, "isObjectEmpty");
function useTheme(defaultTheme5 = null) {
  const contextTheme = React5.useContext(ThemeContext);
  return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme5 : contextTheme;
}
__name(useTheme, "useTheme");
var useThemeWithoutDefault_default = useTheme;

// node_modules/@mui/system/esm/useTheme.js
var systemDefaultTheme = createTheme_default();
function useTheme2(defaultTheme5 = systemDefaultTheme) {
  return useThemeWithoutDefault_default(defaultTheme5);
}
__name(useTheme2, "useTheme");
var useTheme_default = useTheme2;

// node_modules/@mui/system/esm/useThemeProps/useThemeProps.js
function useThemeProps({
  props,
  name,
  defaultTheme: defaultTheme5,
  themeId
}) {
  let theme = useTheme_default(defaultTheme5);
  if (themeId) {
    theme = theme[themeId] || theme;
  }
  const mergedProps = getThemeProps({
    theme,
    name,
    props
  });
  return mergedProps;
}
__name(useThemeProps, "useThemeProps");

// node_modules/@mui/system/esm/useMediaQuery/useMediaQuery.js
function useMediaQueryOld(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr) {
  const [match, setMatch] = React6.useState(() => {
    if (noSsr && matchMedia) {
      return matchMedia(query).matches;
    }
    if (ssrMatchMedia) {
      return ssrMatchMedia(query).matches;
    }
    return defaultMatches;
  });
  useEnhancedEffect_default(() => {
    let active = true;
    if (!matchMedia) {
      return void 0;
    }
    const queryList = matchMedia(query);
    const updateMatch = /* @__PURE__ */ __name(() => {
      if (active) {
        setMatch(queryList.matches);
      }
    }, "updateMatch");
    updateMatch();
    queryList.addListener(updateMatch);
    return () => {
      active = false;
      queryList.removeListener(updateMatch);
    };
  }, [query, matchMedia]);
  return match;
}
__name(useMediaQueryOld, "useMediaQueryOld");
var maybeReactUseSyncExternalStore = React6["useSyncExternalStore"];
function useMediaQueryNew(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr) {
  const getDefaultSnapshot = React6.useCallback(() => defaultMatches, [defaultMatches]);
  const getServerSnapshot = React6.useMemo(() => {
    if (noSsr && matchMedia) {
      return () => matchMedia(query).matches;
    }
    if (ssrMatchMedia !== null) {
      const {
        matches
      } = ssrMatchMedia(query);
      return () => matches;
    }
    return getDefaultSnapshot;
  }, [getDefaultSnapshot, query, ssrMatchMedia, noSsr, matchMedia]);
  const [getSnapshot, subscribe] = React6.useMemo(() => {
    if (matchMedia === null) {
      return [getDefaultSnapshot, () => () => {
      }];
    }
    const mediaQueryList = matchMedia(query);
    return [() => mediaQueryList.matches, (notify) => {
      mediaQueryList.addListener(notify);
      return () => {
        mediaQueryList.removeListener(notify);
      };
    }];
  }, [getDefaultSnapshot, matchMedia, query]);
  const match = maybeReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return match;
}
__name(useMediaQueryNew, "useMediaQueryNew");
function useMediaQuery(queryInput, options = {}) {
  const theme = useThemeWithoutDefault_default();
  const supportMatchMedia = typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
  const {
    defaultMatches = false,
    matchMedia = supportMatchMedia ? window.matchMedia : null,
    ssrMatchMedia = null,
    noSsr = false
  } = getThemeProps({
    name: "MuiUseMediaQuery",
    props: options,
    theme
  });
  if (true) {
    if (typeof queryInput === "function" && theme === null) {
      console.error(["MUI: The `query` argument provided is invalid.", "You are providing a function without a theme in the context.", "One of the parent elements needs to use a ThemeProvider."].join("\n"));
    }
  }
  let query = typeof queryInput === "function" ? queryInput(theme) : queryInput;
  query = query.replace(/^@media( ?)/m, "");
  const useMediaQueryImplementation = maybeReactUseSyncExternalStore !== void 0 ? useMediaQueryNew : useMediaQueryOld;
  const match = useMediaQueryImplementation(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr);
  if (true) {
    React6.useDebugValue({
      query,
      match
    });
  }
  return match;
}
__name(useMediaQuery, "useMediaQuery");

// node_modules/@mui/system/esm/colorManipulator.js
init_formatMuiErrorMessage2();
init_clamp2();
function clampWrapper(value, min = 0, max = 1) {
  if (true) {
    if (value < min || value > max) {
      console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
    }
  }
  return clamp_default(value, min, max);
}
__name(clampWrapper, "clampWrapper");
function hexToRgb(color2) {
  color2 = color2.slice(1);
  const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
  let colors = color2.match(re);
  if (colors && colors[0].length === 1) {
    colors = colors.map((n) => n + n);
  }
  return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n, index) => {
    return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
  }).join(", ")})` : "";
}
__name(hexToRgb, "hexToRgb");
function intToHex(int) {
  const hex = int.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}
__name(intToHex, "intToHex");
function decomposeColor(color2) {
  if (color2.type) {
    return color2;
  }
  if (color2.charAt(0) === "#") {
    return decomposeColor(hexToRgb(color2));
  }
  const marker = color2.indexOf("(");
  const type = color2.substring(0, marker);
  if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
    throw new Error(true ? `MUI: Unsupported \`${color2}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : formatMuiErrorMessage(9, color2));
  }
  let values2 = color2.substring(marker + 1, color2.length - 1);
  let colorSpace;
  if (type === "color") {
    values2 = values2.split(" ");
    colorSpace = values2.shift();
    if (values2.length === 4 && values2[3].charAt(0) === "/") {
      values2[3] = values2[3].slice(1);
    }
    if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
      throw new Error(true ? `MUI: unsupported \`${colorSpace}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : formatMuiErrorMessage(10, colorSpace));
    }
  } else {
    values2 = values2.split(",");
  }
  values2 = values2.map((value) => parseFloat(value));
  return {
    type,
    values: values2,
    colorSpace
  };
}
__name(decomposeColor, "decomposeColor");
function recomposeColor(color2) {
  const {
    type,
    colorSpace
  } = color2;
  let {
    values: values2
  } = color2;
  if (type.indexOf("rgb") !== -1) {
    values2 = values2.map((n, i) => i < 3 ? parseInt(n, 10) : n);
  } else if (type.indexOf("hsl") !== -1) {
    values2[1] = `${values2[1]}%`;
    values2[2] = `${values2[2]}%`;
  }
  if (type.indexOf("color") !== -1) {
    values2 = `${colorSpace} ${values2.join(" ")}`;
  } else {
    values2 = `${values2.join(", ")}`;
  }
  return `${type}(${values2})`;
}
__name(recomposeColor, "recomposeColor");
function rgbToHex(color2) {
  if (color2.indexOf("#") === 0) {
    return color2;
  }
  const {
    values: values2
  } = decomposeColor(color2);
  return `#${values2.map((n, i) => intToHex(i === 3 ? Math.round(255 * n) : n)).join("")}`;
}
__name(rgbToHex, "rgbToHex");
function hslToRgb(color2) {
  color2 = decomposeColor(color2);
  const {
    values: values2
  } = color2;
  const h = values2[0];
  const s = values2[1] / 100;
  const l = values2[2] / 100;
  const a = s * Math.min(l, 1 - l);
  const f = /* @__PURE__ */ __name((n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1), "f");
  let type = "rgb";
  const rgb = [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  if (color2.type === "hsla") {
    type += "a";
    rgb.push(values2[3]);
  }
  return recomposeColor({
    type,
    values: rgb
  });
}
__name(hslToRgb, "hslToRgb");
function getLuminance(color2) {
  color2 = decomposeColor(color2);
  let rgb = color2.type === "hsl" || color2.type === "hsla" ? decomposeColor(hslToRgb(color2)).values : color2.values;
  rgb = rgb.map((val) => {
    if (color2.type !== "color") {
      val /= 255;
    }
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  });
  return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
}
__name(getLuminance, "getLuminance");
function getContrastRatio(foreground, background) {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}
__name(getContrastRatio, "getContrastRatio");
function alpha(color2, value) {
  color2 = decomposeColor(color2);
  value = clampWrapper(value);
  if (color2.type === "rgb" || color2.type === "hsl") {
    color2.type += "a";
  }
  if (color2.type === "color") {
    color2.values[3] = `/${value}`;
  } else {
    color2.values[3] = value;
  }
  return recomposeColor(color2);
}
__name(alpha, "alpha");
function darken(color2, coefficient) {
  color2 = decomposeColor(color2);
  coefficient = clampWrapper(coefficient);
  if (color2.type.indexOf("hsl") !== -1) {
    color2.values[2] *= 1 - coefficient;
  } else if (color2.type.indexOf("rgb") !== -1 || color2.type.indexOf("color") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] *= 1 - coefficient;
    }
  }
  return recomposeColor(color2);
}
__name(darken, "darken");
function lighten(color2, coefficient) {
  color2 = decomposeColor(color2);
  coefficient = clampWrapper(coefficient);
  if (color2.type.indexOf("hsl") !== -1) {
    color2.values[2] += (100 - color2.values[2]) * coefficient;
  } else if (color2.type.indexOf("rgb") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] += (255 - color2.values[i]) * coefficient;
    }
  } else if (color2.type.indexOf("color") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] += (1 - color2.values[i]) * coefficient;
    }
  }
  return recomposeColor(color2);
}
__name(lighten, "lighten");
function emphasize(color2, coefficient = 0.15) {
  return getLuminance(color2) > 0.5 ? darken(color2, coefficient) : lighten(color2, coefficient);
}
__name(emphasize, "emphasize");

// node_modules/@mui/utils/esm/composeClasses/composeClasses.js
function composeClasses(slots, getUtilityClass, classes = void 0) {
  const output = {};
  Object.keys(slots).forEach(
    // `Object.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    (slot) => {
      output[slot] = slots[slot].reduce((acc, key) => {
        if (key) {
          const utilityClass = getUtilityClass(key);
          if (utilityClass !== "") {
            acc.push(utilityClass);
          }
          if (classes && classes[key]) {
            acc.push(classes[key]);
          }
        }
        return acc;
      }, []).join(" ");
    }
  );
  return output;
}
__name(composeClasses, "composeClasses");

// node_modules/@mui/utils/esm/chainPropTypes/chainPropTypes.js
function chainPropTypes(propType1, propType2) {
  if (false) {
    return () => null;
  }
  return /* @__PURE__ */ __name(function validate(...args) {
    return propType1(...args) || propType2(...args);
  }, "validate");
}
__name(chainPropTypes, "chainPropTypes");

// node_modules/@mui/utils/esm/index.js
init_deepmerge2();
init_deepmerge2();

// node_modules/@mui/utils/esm/elementAcceptingRef/elementAcceptingRef.js
var import_prop_types5 = __toESM(require_prop_types());
function isClassComponent(elementType) {
  const {
    prototype = {}
  } = elementType;
  return Boolean(prototype.isReactComponent);
}
__name(isClassComponent, "isClassComponent");
function acceptingRef(props, propName, componentName, location, propFullName) {
  const element = props[propName];
  const safePropName = propFullName || propName;
  if (element == null || // When server-side rendering React doesn't warn either.
  // This is not an accurate check for SSR.
  // This is only in place for Emotion compat.
  // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
  typeof window === "undefined") {
    return null;
  }
  let warningHint;
  const elementType = element.type;
  if (typeof elementType === "function" && !isClassComponent(elementType)) {
    warningHint = "Did you accidentally use a plain function component for an element instead?";
  }
  if (warningHint !== void 0) {
    return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`);
  }
  return null;
}
__name(acceptingRef, "acceptingRef");
var elementAcceptingRef = chainPropTypes(import_prop_types5.default.element, acceptingRef);
elementAcceptingRef.isRequired = chainPropTypes(import_prop_types5.default.element.isRequired, acceptingRef);
var elementAcceptingRef_default = elementAcceptingRef;

// node_modules/@mui/utils/esm/elementTypeAcceptingRef/elementTypeAcceptingRef.js
var import_prop_types6 = __toESM(require_prop_types());
function isClassComponent2(elementType) {
  const {
    prototype = {}
  } = elementType;
  return Boolean(prototype.isReactComponent);
}
__name(isClassComponent2, "isClassComponent");
function elementTypeAcceptingRef(props, propName, componentName, location, propFullName) {
  const propValue = props[propName];
  const safePropName = propFullName || propName;
  if (propValue == null || // When server-side rendering React doesn't warn either.
  // This is not an accurate check for SSR.
  // This is only in place for emotion compat.
  // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
  typeof window === "undefined") {
    return null;
  }
  let warningHint;
  if (typeof propValue === "function" && !isClassComponent2(propValue)) {
    warningHint = "Did you accidentally provide a plain function component instead?";
  }
  if (warningHint !== void 0) {
    return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element type that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`);
  }
  return null;
}
__name(elementTypeAcceptingRef, "elementTypeAcceptingRef");
var elementTypeAcceptingRef_default = chainPropTypes(import_prop_types6.default.elementType, elementTypeAcceptingRef);

// node_modules/@mui/utils/esm/exactProp/exactProp.js
init_extends();
var specialProperty = "exact-prop: ​";
function exactProp(propTypes) {
  if (false) {
    return propTypes;
  }
  return _extends({}, propTypes, {
    [specialProperty]: (props) => {
      const unsupportedProps = Object.keys(props).filter((prop) => !propTypes.hasOwnProperty(prop));
      if (unsupportedProps.length > 0) {
        return new Error(`The following props are not supported: ${unsupportedProps.map((prop) => `\`${prop}\``).join(", ")}. Please remove them.`);
      }
      return null;
    }
  });
}
__name(exactProp, "exactProp");

// node_modules/@mui/utils/esm/index.js
init_formatMuiErrorMessage2();
init_getDisplayName2();

// node_modules/@mui/utils/esm/HTMLElementType/HTMLElementType.js
function HTMLElementType(props, propName, componentName, location, propFullName) {
  if (false) {
    return null;
  }
  const propValue = props[propName];
  const safePropName = propFullName || propName;
  if (propValue == null) {
    return null;
  }
  if (propValue && propValue.nodeType !== 1) {
    return new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an HTMLElement.`);
  }
  return null;
}
__name(HTMLElementType, "HTMLElementType");

// node_modules/@mui/utils/esm/ponyfillGlobal/ponyfillGlobal.js
var ponyfillGlobal_default = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();

// node_modules/@mui/utils/esm/refType/refType.js
var import_prop_types7 = __toESM(require_prop_types());
var refType = import_prop_types7.default.oneOfType([import_prop_types7.default.func, import_prop_types7.default.object]);
var refType_default = refType;

// node_modules/@mui/utils/esm/index.js
init_capitalize2();

// node_modules/@mui/utils/esm/createChainedFunction/createChainedFunction.js
function createChainedFunction(...funcs) {
  return funcs.reduce((acc, func) => {
    if (func == null) {
      return acc;
    }
    return /* @__PURE__ */ __name(function chainedFunction(...args) {
      acc.apply(this, args);
      func.apply(this, args);
    }, "chainedFunction");
  }, () => {
  });
}
__name(createChainedFunction, "createChainedFunction");

// node_modules/@mui/utils/esm/debounce/debounce.js
function debounce(func, wait = 166) {
  let timeout;
  function debounced(...args) {
    const later = /* @__PURE__ */ __name(() => {
      func.apply(this, args);
    }, "later");
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  __name(debounced, "debounced");
  debounced.clear = () => {
    clearTimeout(timeout);
  };
  return debounced;
}
__name(debounce, "debounce");

// node_modules/@mui/utils/esm/deprecatedPropType/deprecatedPropType.js
function deprecatedPropType(validator2, reason) {
  if (false) {
    return () => null;
  }
  return (props, propName, componentName, location, propFullName) => {
    const componentNameSafe = componentName || "<<anonymous>>";
    const propFullNameSafe = propFullName || propName;
    if (typeof props[propName] !== "undefined") {
      return new Error(`The ${location} \`${propFullNameSafe}\` of \`${componentNameSafe}\` is deprecated. ${reason}`);
    }
    return null;
  };
}
__name(deprecatedPropType, "deprecatedPropType");

// node_modules/@mui/utils/esm/isMuiElement/isMuiElement.js
var React7 = __toESM(require_react());
function isMuiElement(element, muiNames) {
  var _muiName, _element$type;
  return React7.isValidElement(element) && muiNames.indexOf(
    // For server components `muiName` is avaialble in element.type._payload.value.muiName
    // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
    // eslint-disable-next-line no-underscore-dangle
    (_muiName = element.type.muiName) != null ? _muiName : (_element$type = element.type) == null || (_element$type = _element$type._payload) == null || (_element$type = _element$type.value) == null ? void 0 : _element$type.muiName
  ) !== -1;
}
__name(isMuiElement, "isMuiElement");

// node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}
__name(ownerDocument, "ownerDocument");

// node_modules/@mui/utils/esm/ownerWindow/ownerWindow.js
function ownerWindow(node) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
__name(ownerWindow, "ownerWindow");

// node_modules/@mui/utils/esm/requirePropFactory/requirePropFactory.js
init_extends();
function requirePropFactory(componentNameInError, Component) {
  if (false) {
    return () => null;
  }
  const prevPropTypes = Component ? _extends({}, Component.propTypes) : null;
  const requireProp = /* @__PURE__ */ __name((requiredProp) => (props, propName, componentName, location, propFullName, ...args) => {
    const propFullNameSafe = propFullName || propName;
    const defaultTypeChecker = prevPropTypes == null ? void 0 : prevPropTypes[propFullNameSafe];
    if (defaultTypeChecker) {
      const typeCheckerResult = defaultTypeChecker(props, propName, componentName, location, propFullName, ...args);
      if (typeCheckerResult) {
        return typeCheckerResult;
      }
    }
    if (typeof props[propName] !== "undefined" && !props[requiredProp]) {
      return new Error(`The prop \`${propFullNameSafe}\` of \`${componentNameInError}\` can only be used together with the \`${requiredProp}\` prop.`);
    }
    return null;
  }, "requireProp");
  return requireProp;
}
__name(requirePropFactory, "requirePropFactory");

// node_modules/@mui/utils/esm/setRef/setRef.js
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
__name(setRef, "setRef");

// node_modules/@mui/utils/esm/useId/useId.js
var React8 = __toESM(require_react());
var globalId = 0;
function useGlobalId(idOverride) {
  const [defaultId, setDefaultId] = React8.useState(idOverride);
  const id = idOverride || defaultId;
  React8.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`mui-${globalId}`);
    }
  }, [defaultId]);
  return id;
}
__name(useGlobalId, "useGlobalId");
var maybeReactUseId = React8["useId".toString()];
function useId(idOverride) {
  if (maybeReactUseId !== void 0) {
    const reactId = maybeReactUseId();
    return idOverride != null ? idOverride : reactId;
  }
  return useGlobalId(idOverride);
}
__name(useId, "useId");

// node_modules/@mui/utils/esm/unsupportedProp/unsupportedProp.js
function unsupportedProp(props, propName, componentName, location, propFullName) {
  if (false) {
    return null;
  }
  const propFullNameSafe = propFullName || propName;
  if (typeof props[propName] !== "undefined") {
    return new Error(`The prop \`${propFullNameSafe}\` is not supported. Please remove it.`);
  }
  return null;
}
__name(unsupportedProp, "unsupportedProp");

// node_modules/@mui/utils/esm/useControlled/useControlled.js
var React9 = __toESM(require_react());
function useControlled({
  controlled,
  default: defaultProp,
  name,
  state = "value"
}) {
  const {
    current: isControlled
  } = React9.useRef(controlled !== void 0);
  const [valueState, setValue] = React9.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  if (true) {
    React9.useEffect(() => {
      if (isControlled !== (controlled !== void 0)) {
        console.error([`MUI: A component is changing the ${isControlled ? "" : "un"}controlled ${state} state of ${name} to be ${isControlled ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join("\n"));
      }
    }, [state, name, controlled]);
    const {
      current: defaultValue
    } = React9.useRef(defaultProp);
    React9.useEffect(() => {
      if (!isControlled && !Object.is(defaultValue, defaultProp)) {
        console.error([`MUI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`].join("\n"));
      }
    }, [JSON.stringify(defaultProp)]);
  }
  const setValueIfUncontrolled = React9.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
}
__name(useControlled, "useControlled");

// node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js
var React10 = __toESM(require_react());
function useEventCallback(fn) {
  const ref = React10.useRef(fn);
  useEnhancedEffect_default(() => {
    ref.current = fn;
  });
  return React10.useRef((...args) => (
    // @ts-expect-error hide `this`
    (0, ref.current)(...args)
  )).current;
}
__name(useEventCallback, "useEventCallback");
var useEventCallback_default = useEventCallback;

// node_modules/@mui/utils/esm/useForkRef/useForkRef.js
var React11 = __toESM(require_react());
function useForkRef(...refs) {
  return React11.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance);
      });
    };
  }, refs);
}
__name(useForkRef, "useForkRef");

// node_modules/@mui/utils/esm/useLazyRef/useLazyRef.js
var React12 = __toESM(require_react());
var UNINITIALIZED = {};
function useLazyRef(init, initArg) {
  const ref = React12.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }
  return ref;
}
__name(useLazyRef, "useLazyRef");

// node_modules/@mui/utils/esm/useOnMount/useOnMount.js
var React13 = __toESM(require_react());
var EMPTY = [];
function useOnMount(fn) {
  React13.useEffect(fn, EMPTY);
}
__name(useOnMount, "useOnMount");

// node_modules/@mui/utils/esm/useTimeout/useTimeout.js
var _Timeout = class _Timeout {
  constructor() {
    this.currentId = null;
    this.clear = () => {
      if (this.currentId !== null) {
        clearTimeout(this.currentId);
        this.currentId = null;
      }
    };
    this.disposeEffect = () => {
      return this.clear;
    };
  }
  static create() {
    return new _Timeout();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(delay, fn) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = null;
      fn();
    }, delay);
  }
};
__name(_Timeout, "Timeout");
var Timeout = _Timeout;
function useTimeout() {
  const timeout = useLazyRef(Timeout.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}
__name(useTimeout, "useTimeout");

// node_modules/@mui/utils/esm/useIsFocusVisible/useIsFocusVisible.js
var React14 = __toESM(require_react());
var hadKeyboardEvent = true;
var hadFocusVisibleRecently = false;
var hadFocusVisibleRecentlyTimeout = new Timeout();
var inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  "datetime-local": true
};
function focusTriggersKeyboardModality(node) {
  const {
    type,
    tagName
  } = node;
  if (tagName === "INPUT" && inputTypesWhitelist[type] && !node.readOnly) {
    return true;
  }
  if (tagName === "TEXTAREA" && !node.readOnly) {
    return true;
  }
  if (node.isContentEditable) {
    return true;
  }
  return false;
}
__name(focusTriggersKeyboardModality, "focusTriggersKeyboardModality");
function handleKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }
  hadKeyboardEvent = true;
}
__name(handleKeyDown, "handleKeyDown");
function handlePointerDown() {
  hadKeyboardEvent = false;
}
__name(handlePointerDown, "handlePointerDown");
function handleVisibilityChange() {
  if (this.visibilityState === "hidden") {
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true;
    }
  }
}
__name(handleVisibilityChange, "handleVisibilityChange");
function prepare(doc) {
  doc.addEventListener("keydown", handleKeyDown, true);
  doc.addEventListener("mousedown", handlePointerDown, true);
  doc.addEventListener("pointerdown", handlePointerDown, true);
  doc.addEventListener("touchstart", handlePointerDown, true);
  doc.addEventListener("visibilitychange", handleVisibilityChange, true);
}
__name(prepare, "prepare");
function isFocusVisible(event) {
  const {
    target
  } = event;
  try {
    return target.matches(":focus-visible");
  } catch (error) {
  }
  return hadKeyboardEvent || focusTriggersKeyboardModality(target);
}
__name(isFocusVisible, "isFocusVisible");
function useIsFocusVisible() {
  const ref = React14.useCallback((node) => {
    if (node != null) {
      prepare(node.ownerDocument);
    }
  }, []);
  const isFocusVisibleRef = React14.useRef(false);
  function handleBlurVisible() {
    if (isFocusVisibleRef.current) {
      hadFocusVisibleRecently = true;
      hadFocusVisibleRecentlyTimeout.start(100, () => {
        hadFocusVisibleRecently = false;
      });
      isFocusVisibleRef.current = false;
      return true;
    }
    return false;
  }
  __name(handleBlurVisible, "handleBlurVisible");
  function handleFocusVisible(event) {
    if (isFocusVisible(event)) {
      isFocusVisibleRef.current = true;
      return true;
    }
    return false;
  }
  __name(handleFocusVisible, "handleFocusVisible");
  return {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref
  };
}
__name(useIsFocusVisible, "useIsFocusVisible");

// node_modules/@mui/utils/esm/getScrollbarSize/getScrollbarSize.js
function getScrollbarSize(doc) {
  const documentWidth = doc.documentElement.clientWidth;
  return Math.abs(window.innerWidth - documentWidth);
}
__name(getScrollbarSize, "getScrollbarSize");

// node_modules/@mui/utils/esm/scrollLeft/scrollLeft.js
var cachedType;
function detectScrollType() {
  if (cachedType) {
    return cachedType;
  }
  const dummy = document.createElement("div");
  const container = document.createElement("div");
  container.style.width = "10px";
  container.style.height = "1px";
  dummy.appendChild(container);
  dummy.dir = "rtl";
  dummy.style.fontSize = "14px";
  dummy.style.width = "4px";
  dummy.style.height = "1px";
  dummy.style.position = "absolute";
  dummy.style.top = "-1000px";
  dummy.style.overflow = "scroll";
  document.body.appendChild(dummy);
  cachedType = "reverse";
  if (dummy.scrollLeft > 0) {
    cachedType = "default";
  } else {
    dummy.scrollLeft = 1;
    if (dummy.scrollLeft === 0) {
      cachedType = "negative";
    }
  }
  document.body.removeChild(dummy);
  return cachedType;
}
__name(detectScrollType, "detectScrollType");
function getNormalizedScrollLeft(element, direction) {
  const scrollLeft = element.scrollLeft;
  if (direction !== "rtl") {
    return scrollLeft;
  }
  const type = detectScrollType();
  switch (type) {
    case "negative":
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case "reverse":
      return element.scrollWidth - element.clientWidth - scrollLeft;
    default:
      return scrollLeft;
  }
}
__name(getNormalizedScrollLeft, "getNormalizedScrollLeft");

// node_modules/@mui/utils/esm/usePreviousProps/usePreviousProps.js
var React15 = __toESM(require_react());
var usePreviousProps = /* @__PURE__ */ __name((value) => {
  const ref = React15.useRef({});
  React15.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}, "usePreviousProps");
var usePreviousProps_default = usePreviousProps;

// node_modules/@mui/utils/esm/getValidReactChildren/getValidReactChildren.js
var React16 = __toESM(require_react());
function getValidReactChildren(children) {
  return React16.Children.toArray(children).filter((child) => React16.isValidElement(child));
}
__name(getValidReactChildren, "getValidReactChildren");

// node_modules/@mui/utils/esm/visuallyHidden/visuallyHidden.js
var visuallyHidden = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px"
};
var visuallyHidden_default = visuallyHidden;

// node_modules/@mui/utils/esm/integerPropType/integerPropType.js
function getTypeByValue(value) {
  const valueType = typeof value;
  switch (valueType) {
    case "number":
      if (Number.isNaN(value)) {
        return "NaN";
      }
      if (!Number.isFinite(value)) {
        return "Infinity";
      }
      if (value !== Math.floor(value)) {
        return "float";
      }
      return "number";
    case "object":
      if (value === null) {
        return "null";
      }
      return value.constructor.name;
    default:
      return valueType;
  }
}
__name(getTypeByValue, "getTypeByValue");
function ponyfillIsInteger(x) {
  return typeof x === "number" && isFinite(x) && Math.floor(x) === x;
}
__name(ponyfillIsInteger, "ponyfillIsInteger");
var isInteger = Number.isInteger || ponyfillIsInteger;
function requiredInteger(props, propName, componentName, location) {
  const propValue = props[propName];
  if (propValue == null || !isInteger(propValue)) {
    const propType = getTypeByValue(propValue);
    return new RangeError(`Invalid ${location} \`${propName}\` of type \`${propType}\` supplied to \`${componentName}\`, expected \`integer\`.`);
  }
  return null;
}
__name(requiredInteger, "requiredInteger");
function validator(props, propName, ...other) {
  const propValue = props[propName];
  if (propValue === void 0) {
    return null;
  }
  return requiredInteger(props, propName, ...other);
}
__name(validator, "validator");
function validatorNoop() {
  return null;
}
__name(validatorNoop, "validatorNoop");
validator.isRequired = requiredInteger;
validatorNoop.isRequired = validatorNoop;
var integerPropType_default = false ? validatorNoop : validator;

// node_modules/@mui/utils/esm/index.js
init_clamp2();

// node_modules/@mui/utils/esm/useSlotProps/useSlotProps.js
init_extends();

// node_modules/@mui/utils/esm/appendOwnerState/appendOwnerState.js
init_extends();

// node_modules/@mui/utils/esm/isHostComponent/isHostComponent.js
function isHostComponent(element) {
  return typeof element === "string";
}
__name(isHostComponent, "isHostComponent");
var isHostComponent_default = isHostComponent;

// node_modules/@mui/utils/esm/appendOwnerState/appendOwnerState.js
function appendOwnerState(elementType, otherProps, ownerState) {
  if (elementType === void 0 || isHostComponent_default(elementType)) {
    return otherProps;
  }
  return _extends({}, otherProps, {
    ownerState: _extends({}, otherProps.ownerState, ownerState)
  });
}
__name(appendOwnerState, "appendOwnerState");
var appendOwnerState_default = appendOwnerState;

// node_modules/@mui/utils/esm/mergeSlotProps/mergeSlotProps.js
init_extends();

// node_modules/@mui/utils/esm/extractEventHandlers/extractEventHandlers.js
function extractEventHandlers(object, excludeKeys = []) {
  if (object === void 0) {
    return {};
  }
  const result = {};
  Object.keys(object).filter((prop) => prop.match(/^on[A-Z]/) && typeof object[prop] === "function" && !excludeKeys.includes(prop)).forEach((prop) => {
    result[prop] = object[prop];
  });
  return result;
}
__name(extractEventHandlers, "extractEventHandlers");
var extractEventHandlers_default = extractEventHandlers;

// node_modules/@mui/utils/esm/omitEventHandlers/omitEventHandlers.js
function omitEventHandlers(object) {
  if (object === void 0) {
    return {};
  }
  const result = {};
  Object.keys(object).filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === "function")).forEach((prop) => {
    result[prop] = object[prop];
  });
  return result;
}
__name(omitEventHandlers, "omitEventHandlers");
var omitEventHandlers_default = omitEventHandlers;

// node_modules/@mui/utils/esm/mergeSlotProps/mergeSlotProps.js
function mergeSlotProps(parameters) {
  const {
    getSlotProps,
    additionalProps,
    externalSlotProps,
    externalForwardedProps,
    className
  } = parameters;
  if (!getSlotProps) {
    const joinedClasses2 = clsx_default(additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle2 = _extends({}, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
    const props2 = _extends({}, additionalProps, externalForwardedProps, externalSlotProps);
    if (joinedClasses2.length > 0) {
      props2.className = joinedClasses2;
    }
    if (Object.keys(mergedStyle2).length > 0) {
      props2.style = mergedStyle2;
    }
    return {
      props: props2,
      internalRef: void 0
    };
  }
  const eventHandlers = extractEventHandlers_default(_extends({}, externalForwardedProps, externalSlotProps));
  const componentsPropsWithoutEventHandlers = omitEventHandlers_default(externalSlotProps);
  const otherPropsWithoutEventHandlers = omitEventHandlers_default(externalForwardedProps);
  const internalSlotProps = getSlotProps(eventHandlers);
  const joinedClasses = clsx_default(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
  const mergedStyle = _extends({}, internalSlotProps == null ? void 0 : internalSlotProps.style, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
  const props = _extends({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers);
  if (joinedClasses.length > 0) {
    props.className = joinedClasses;
  }
  if (Object.keys(mergedStyle).length > 0) {
    props.style = mergedStyle;
  }
  return {
    props,
    internalRef: internalSlotProps.ref
  };
}
__name(mergeSlotProps, "mergeSlotProps");
var mergeSlotProps_default = mergeSlotProps;

// node_modules/@mui/utils/esm/resolveComponentProps/resolveComponentProps.js
function resolveComponentProps(componentProps, ownerState, slotState) {
  if (typeof componentProps === "function") {
    return componentProps(ownerState, slotState);
  }
  return componentProps;
}
__name(resolveComponentProps, "resolveComponentProps");
var resolveComponentProps_default = resolveComponentProps;

// node_modules/@mui/utils/esm/useSlotProps/useSlotProps.js
var _excluded3 = ["elementType", "externalSlotProps", "ownerState", "skipResolvingSlotProps"];
function useSlotProps(parameters) {
  var _parameters$additiona;
  const {
    elementType,
    externalSlotProps,
    ownerState,
    skipResolvingSlotProps = false
  } = parameters, rest = _objectWithoutPropertiesLoose(parameters, _excluded3);
  const resolvedComponentsProps = skipResolvingSlotProps ? {} : resolveComponentProps_default(externalSlotProps, ownerState);
  const {
    props: mergedProps,
    internalRef
  } = mergeSlotProps_default(_extends({}, rest, {
    externalSlotProps: resolvedComponentsProps
  }));
  const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
  const props = appendOwnerState_default(elementType, _extends({}, mergedProps, {
    ref
  }), ownerState);
  return props;
}
__name(useSlotProps, "useSlotProps");
var useSlotProps_default = useSlotProps;

// node_modules/@mui/utils/esm/getReactElementRef/getReactElementRef.js
var React17 = __toESM(require_react());
function getReactElementRef(element) {
  if (parseInt(React17.version, 10) >= 19) {
    var _element$props;
    return (element == null || (_element$props = element.props) == null ? void 0 : _element$props.ref) || null;
  }
  return (element == null ? void 0 : element.ref) || null;
}
__name(getReactElementRef, "getReactElementRef");

// node_modules/@mui/system/esm/index.js
init_formatMuiErrorMessage2();
init_styled_engine();

// node_modules/@mui/system/esm/GlobalStyles/GlobalStyles.js
var React18 = __toESM(require_react());
var import_prop_types8 = __toESM(require_prop_types());
init_styled_engine();
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
function GlobalStyles2({
  styles,
  themeId,
  defaultTheme: defaultTheme5 = {}
}) {
  const upperTheme = useTheme_default(defaultTheme5);
  const globalStyles = typeof styles === "function" ? styles(themeId ? upperTheme[themeId] || upperTheme : upperTheme) : styles;
  return (0, import_jsx_runtime3.jsx)(GlobalStyles, {
    styles: globalStyles
  });
}
__name(GlobalStyles2, "GlobalStyles");
true ? GlobalStyles2.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  defaultTheme: import_prop_types8.default.object,
  /**
   * @ignore
   */
  styles: import_prop_types8.default.oneOfType([import_prop_types8.default.array, import_prop_types8.default.func, import_prop_types8.default.number, import_prop_types8.default.object, import_prop_types8.default.string, import_prop_types8.default.bool]),
  /**
   * @ignore
   */
  themeId: import_prop_types8.default.string
} : void 0;
var GlobalStyles_default = GlobalStyles2;

// node_modules/@mui/system/esm/display.js
var displayPrint = style_default({
  prop: "displayPrint",
  cssProperty: false,
  transform: /* @__PURE__ */ __name((value) => ({
    "@media print": {
      display: value
    }
  }), "transform")
});
var displayRaw = style_default({
  prop: "display"
});
var overflow = style_default({
  prop: "overflow"
});
var textOverflow = style_default({
  prop: "textOverflow"
});
var visibility = style_default({
  prop: "visibility"
});
var whiteSpace = style_default({
  prop: "whiteSpace"
});
var display_default = compose_default(displayPrint, displayRaw, overflow, textOverflow, visibility, whiteSpace);

// node_modules/@mui/system/esm/flexbox.js
var flexBasis = style_default({
  prop: "flexBasis"
});
var flexDirection = style_default({
  prop: "flexDirection"
});
var flexWrap = style_default({
  prop: "flexWrap"
});
var justifyContent = style_default({
  prop: "justifyContent"
});
var alignItems = style_default({
  prop: "alignItems"
});
var alignContent = style_default({
  prop: "alignContent"
});
var order = style_default({
  prop: "order"
});
var flex = style_default({
  prop: "flex"
});
var flexGrow = style_default({
  prop: "flexGrow"
});
var flexShrink = style_default({
  prop: "flexShrink"
});
var alignSelf = style_default({
  prop: "alignSelf"
});
var justifyItems = style_default({
  prop: "justifyItems"
});
var justifySelf = style_default({
  prop: "justifySelf"
});
var flexbox = compose_default(flexBasis, flexDirection, flexWrap, justifyContent, alignItems, alignContent, order, flex, flexGrow, flexShrink, alignSelf, justifyItems, justifySelf);
var flexbox_default = flexbox;

// node_modules/@mui/system/esm/positions.js
var position = style_default({
  prop: "position"
});
var zIndex = style_default({
  prop: "zIndex",
  themeKey: "zIndex"
});
var top = style_default({
  prop: "top"
});
var right = style_default({
  prop: "right"
});
var bottom = style_default({
  prop: "bottom"
});
var left = style_default({
  prop: "left"
});
var positions_default = compose_default(position, zIndex, top, right, bottom, left);

// node_modules/@mui/system/esm/shadows.js
var boxShadow = style_default({
  prop: "boxShadow",
  themeKey: "shadows"
});
var shadows_default = boxShadow;

// node_modules/@mui/system/esm/typography.js
var fontFamily = style_default({
  prop: "fontFamily",
  themeKey: "typography"
});
var fontSize = style_default({
  prop: "fontSize",
  themeKey: "typography"
});
var fontStyle = style_default({
  prop: "fontStyle",
  themeKey: "typography"
});
var fontWeight = style_default({
  prop: "fontWeight",
  themeKey: "typography"
});
var letterSpacing = style_default({
  prop: "letterSpacing"
});
var textTransform = style_default({
  prop: "textTransform"
});
var lineHeight = style_default({
  prop: "lineHeight"
});
var textAlign = style_default({
  prop: "textAlign"
});
var typographyVariant = style_default({
  prop: "typography",
  cssProperty: false,
  themeKey: "typography"
});
var typography = compose_default(typographyVariant, fontFamily, fontSize, fontStyle, fontWeight, letterSpacing, lineHeight, textAlign, textTransform);
var typography_default = typography;

// node_modules/@mui/system/esm/styleFunctionSx/extendSxProp.js
init_extends();
init_deepmerge2();
var _excluded4 = ["sx"];
var splitProps = /* @__PURE__ */ __name((props) => {
  var _props$theme$unstable, _props$theme;
  const result = {
    systemProps: {},
    otherProps: {}
  };
  const config = (_props$theme$unstable = props == null || (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig_default;
  Object.keys(props).forEach((prop) => {
    if (config[prop]) {
      result.systemProps[prop] = props[prop];
    } else {
      result.otherProps[prop] = props[prop];
    }
  });
  return result;
}, "splitProps");
function extendSxProp(props) {
  const {
    sx: inSx
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded4);
  const {
    systemProps,
    otherProps
  } = splitProps(other);
  let finalSx;
  if (Array.isArray(inSx)) {
    finalSx = [systemProps, ...inSx];
  } else if (typeof inSx === "function") {
    finalSx = /* @__PURE__ */ __name((...args) => {
      const result = inSx(...args);
      if (!isPlainObject(result)) {
        return systemProps;
      }
      return _extends({}, systemProps, result);
    }, "finalSx");
  } else {
    finalSx = _extends({}, systemProps, inSx);
  }
  return _extends({}, otherProps, {
    sx: finalSx
  });
}
__name(extendSxProp, "extendSxProp");

// node_modules/@mui/system/esm/getThemeValue.js
var filterPropsMapping = {
  borders: borders_default.filterProps,
  display: display_default.filterProps,
  flexbox: flexbox_default.filterProps,
  grid: cssGrid_default.filterProps,
  positions: positions_default.filterProps,
  palette: palette_default.filterProps,
  shadows: shadows_default.filterProps,
  sizing: sizing_default.filterProps,
  spacing: spacing_default.filterProps,
  typography: typography_default.filterProps
};
var styleFunctionMapping = {
  borders: borders_default,
  display: display_default,
  flexbox: flexbox_default,
  grid: cssGrid_default,
  positions: positions_default,
  palette: palette_default,
  shadows: shadows_default,
  sizing: sizing_default,
  spacing: spacing_default,
  typography: typography_default
};
var propToStyleFunction = Object.keys(filterPropsMapping).reduce((acc, styleFnName) => {
  filterPropsMapping[styleFnName].forEach((propName) => {
    acc[propName] = styleFunctionMapping[styleFnName];
  });
  return acc;
}, {});

// node_modules/@mui/system/esm/Box/Box.js
var import_prop_types9 = __toESM(require_prop_types());

// node_modules/@mui/system/esm/createBox.js
init_extends();
var React19 = __toESM(require_react());
init_styled_engine();
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var _excluded5 = ["className", "component"];
function createBox(options = {}) {
  const {
    themeId,
    defaultTheme: defaultTheme5,
    defaultClassName = "MuiBox-root",
    generateClassName
  } = options;
  const BoxRoot = styled("div", {
    shouldForwardProp: /* @__PURE__ */ __name((prop) => prop !== "theme" && prop !== "sx" && prop !== "as", "shouldForwardProp")
  })(styleFunctionSx_default);
  const Box2 = React19.forwardRef(/* @__PURE__ */ __name(function Box3(inProps, ref) {
    const theme = useTheme_default(defaultTheme5);
    const _extendSxProp = extendSxProp(inProps), {
      className,
      component = "div"
    } = _extendSxProp, other = _objectWithoutPropertiesLoose(_extendSxProp, _excluded5);
    return (0, import_jsx_runtime4.jsx)(BoxRoot, _extends({
      as: component,
      ref,
      className: clsx_default(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
      theme: themeId ? theme[themeId] || theme : theme
    }, other));
  }, "Box"));
  return Box2;
}
__name(createBox, "createBox");

// node_modules/@mui/system/esm/Box/boxClasses.js
var boxClasses = generateUtilityClasses("MuiBox", ["root"]);
var boxClasses_default = boxClasses;

// node_modules/@mui/system/esm/Box/Box.js
var Box = createBox({
  defaultClassName: boxClasses_default.root,
  generateClassName: ClassNameGenerator_default.generate
});
true ? Box.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: import_prop_types9.default.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types9.default.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types9.default.oneOfType([import_prop_types9.default.arrayOf(import_prop_types9.default.oneOfType([import_prop_types9.default.func, import_prop_types9.default.object, import_prop_types9.default.bool])), import_prop_types9.default.func, import_prop_types9.default.object])
} : void 0;

// node_modules/@mui/system/esm/createStyled.js
init_extends();
init_styled_engine();
init_deepmerge2();
init_capitalize2();
init_getDisplayName2();
var _excluded6 = ["ownerState"];
var _excluded22 = ["variants"];
var _excluded32 = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
function isEmpty2(obj) {
  return Object.keys(obj).length === 0;
}
__name(isEmpty2, "isEmpty");
function isStringTag(tag) {
  return typeof tag === "string" && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96;
}
__name(isStringTag, "isStringTag");
function shouldForwardProp(prop) {
  return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
__name(shouldForwardProp, "shouldForwardProp");
var systemDefaultTheme2 = createTheme_default();
var lowercaseFirstLetter = /* @__PURE__ */ __name((string) => {
  if (!string) {
    return string;
  }
  return string.charAt(0).toLowerCase() + string.slice(1);
}, "lowercaseFirstLetter");
function resolveTheme({
  defaultTheme: defaultTheme5,
  theme,
  themeId
}) {
  return isEmpty2(theme) ? defaultTheme5 : theme[themeId] || theme;
}
__name(resolveTheme, "resolveTheme");
function defaultOverridesResolver(slot) {
  if (!slot) {
    return null;
  }
  return (props, styles) => styles[slot];
}
__name(defaultOverridesResolver, "defaultOverridesResolver");
function processStyleArg(callableStyle, _ref) {
  let {
    ownerState
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded6);
  const resolvedStylesArg = typeof callableStyle === "function" ? callableStyle(_extends({
    ownerState
  }, props)) : callableStyle;
  if (Array.isArray(resolvedStylesArg)) {
    return resolvedStylesArg.flatMap((resolvedStyle) => processStyleArg(resolvedStyle, _extends({
      ownerState
    }, props)));
  }
  if (!!resolvedStylesArg && typeof resolvedStylesArg === "object" && Array.isArray(resolvedStylesArg.variants)) {
    const {
      variants = []
    } = resolvedStylesArg, otherStyles = _objectWithoutPropertiesLoose(resolvedStylesArg, _excluded22);
    let result = otherStyles;
    variants.forEach((variant) => {
      let isMatch = true;
      if (typeof variant.props === "function") {
        isMatch = variant.props(_extends({
          ownerState
        }, props, ownerState));
      } else {
        Object.keys(variant.props).forEach((key) => {
          if ((ownerState == null ? void 0 : ownerState[key]) !== variant.props[key] && props[key] !== variant.props[key]) {
            isMatch = false;
          }
        });
      }
      if (isMatch) {
        if (!Array.isArray(result)) {
          result = [result];
        }
        result.push(typeof variant.style === "function" ? variant.style(_extends({
          ownerState
        }, props, ownerState)) : variant.style);
      }
    });
    return result;
  }
  return resolvedStylesArg;
}
__name(processStyleArg, "processStyleArg");
function createStyled(input = {}) {
  const {
    themeId,
    defaultTheme: defaultTheme5 = systemDefaultTheme2,
    rootShouldForwardProp = shouldForwardProp,
    slotShouldForwardProp = shouldForwardProp
  } = input;
  const systemSx = /* @__PURE__ */ __name((props) => {
    return styleFunctionSx_default(_extends({}, props, {
      theme: resolveTheme(_extends({}, props, {
        defaultTheme: defaultTheme5,
        themeId
      }))
    }));
  }, "systemSx");
  systemSx.__mui_systemSx = true;
  return (tag, inputOptions = {}) => {
    internal_processStyles(tag, (styles) => styles.filter((style4) => !(style4 != null && style4.__mui_systemSx)));
    const {
      name: componentName,
      slot: componentSlot,
      skipVariantsResolver: inputSkipVariantsResolver,
      skipSx: inputSkipSx,
      // TODO v6: remove `lowercaseFirstLetter()` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      overridesResolver = defaultOverridesResolver(lowercaseFirstLetter(componentSlot))
    } = inputOptions, options = _objectWithoutPropertiesLoose(inputOptions, _excluded32);
    const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : (
      // TODO v6: remove `Root` in the next major release
      // For more details: https://github.com/mui/material-ui/pull/37908
      componentSlot && componentSlot !== "Root" && componentSlot !== "root" || false
    );
    const skipSx = inputSkipSx || false;
    let label;
    if (true) {
      if (componentName) {
        label = `${componentName}-${lowercaseFirstLetter(componentSlot || "Root")}`;
      }
    }
    let shouldForwardPropOption = shouldForwardProp;
    if (componentSlot === "Root" || componentSlot === "root") {
      shouldForwardPropOption = rootShouldForwardProp;
    } else if (componentSlot) {
      shouldForwardPropOption = slotShouldForwardProp;
    } else if (isStringTag(tag)) {
      shouldForwardPropOption = void 0;
    }
    const defaultStyledResolver = styled(tag, _extends({
      shouldForwardProp: shouldForwardPropOption,
      label
    }, options));
    const transformStyleArg = /* @__PURE__ */ __name((stylesArg) => {
      if (typeof stylesArg === "function" && stylesArg.__emotion_real !== stylesArg || isPlainObject(stylesArg)) {
        return (props) => processStyleArg(stylesArg, _extends({}, props, {
          theme: resolveTheme({
            theme: props.theme,
            defaultTheme: defaultTheme5,
            themeId
          })
        }));
      }
      return stylesArg;
    }, "transformStyleArg");
    const muiStyledResolver = /* @__PURE__ */ __name((styleArg, ...expressions) => {
      let transformedStyleArg = transformStyleArg(styleArg);
      const expressionsWithDefaultTheme = expressions ? expressions.map(transformStyleArg) : [];
      if (componentName && overridesResolver) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = resolveTheme(_extends({}, props, {
            defaultTheme: defaultTheme5,
            themeId
          }));
          if (!theme.components || !theme.components[componentName] || !theme.components[componentName].styleOverrides) {
            return null;
          }
          const styleOverrides = theme.components[componentName].styleOverrides;
          const resolvedStyleOverrides = {};
          Object.entries(styleOverrides).forEach(([slotKey, slotStyle]) => {
            resolvedStyleOverrides[slotKey] = processStyleArg(slotStyle, _extends({}, props, {
              theme
            }));
          });
          return overridesResolver(props, resolvedStyleOverrides);
        });
      }
      if (componentName && !skipVariantsResolver) {
        expressionsWithDefaultTheme.push((props) => {
          var _theme$components;
          const theme = resolveTheme(_extends({}, props, {
            defaultTheme: defaultTheme5,
            themeId
          }));
          const themeVariants = theme == null || (_theme$components = theme.components) == null || (_theme$components = _theme$components[componentName]) == null ? void 0 : _theme$components.variants;
          return processStyleArg({
            variants: themeVariants
          }, _extends({}, props, {
            theme
          }));
        });
      }
      if (!skipSx) {
        expressionsWithDefaultTheme.push(systemSx);
      }
      const numOfCustomFnsApplied = expressionsWithDefaultTheme.length - expressions.length;
      if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
        const placeholders = new Array(numOfCustomFnsApplied).fill("");
        transformedStyleArg = [...styleArg, ...placeholders];
        transformedStyleArg.raw = [...styleArg.raw, ...placeholders];
      }
      const Component = defaultStyledResolver(transformedStyleArg, ...expressionsWithDefaultTheme);
      if (true) {
        let displayName;
        if (componentName) {
          displayName = `${componentName}${capitalize(componentSlot || "")}`;
        }
        if (displayName === void 0) {
          displayName = `Styled(${getDisplayName(tag)})`;
        }
        Component.displayName = displayName;
      }
      if (tag.muiName) {
        Component.muiName = tag.muiName;
      }
      return Component;
    }, "muiStyledResolver");
    if (defaultStyledResolver.withConfig) {
      muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
    }
    return muiStyledResolver;
  };
}
__name(createStyled, "createStyled");

// node_modules/@mui/system/esm/styled.js
var styled2 = createStyled();
var styled_default = styled2;

// node_modules/@mui/system/esm/ThemeProvider/ThemeProvider.js
init_extends();
var React25 = __toESM(require_react());
var import_prop_types13 = __toESM(require_prop_types());

// node_modules/@mui/private-theming/ThemeProvider/ThemeProvider.js
init_extends();
var React22 = __toESM(require_react());
var import_prop_types10 = __toESM(require_prop_types());

// node_modules/@mui/private-theming/useTheme/ThemeContext.js
var React20 = __toESM(require_react());
var ThemeContext2 = React20.createContext(null);
if (true) {
  ThemeContext2.displayName = "ThemeContext";
}
var ThemeContext_default = ThemeContext2;

// node_modules/@mui/private-theming/useTheme/useTheme.js
var React21 = __toESM(require_react());
function useTheme3() {
  const theme = React21.useContext(ThemeContext_default);
  if (true) {
    React21.useDebugValue(theme);
  }
  return theme;
}
__name(useTheme3, "useTheme");

// node_modules/@mui/private-theming/ThemeProvider/nested.js
var hasSymbol = typeof Symbol === "function" && Symbol.for;
var nested_default = hasSymbol ? Symbol.for("mui.nested") : "__THEME_NESTED__";

// node_modules/@mui/private-theming/ThemeProvider/ThemeProvider.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
function mergeOuterLocalTheme(outerTheme, localTheme) {
  if (typeof localTheme === "function") {
    const mergedTheme = localTheme(outerTheme);
    if (true) {
      if (!mergedTheme) {
        console.error(["MUI: You should return an object from your theme function, i.e.", "<ThemeProvider theme={() => ({})} />"].join("\n"));
      }
    }
    return mergedTheme;
  }
  return _extends({}, outerTheme, localTheme);
}
__name(mergeOuterLocalTheme, "mergeOuterLocalTheme");
function ThemeProvider(props) {
  const {
    children,
    theme: localTheme
  } = props;
  const outerTheme = useTheme3();
  if (true) {
    if (outerTheme === null && typeof localTheme === "function") {
      console.error(["MUI: You are providing a theme function prop to the ThemeProvider component:", "<ThemeProvider theme={outerTheme => outerTheme} />", "", "However, no outer theme is present.", "Make sure a theme is already injected higher in the React tree or provide a theme object."].join("\n"));
    }
  }
  const theme = React22.useMemo(() => {
    const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
    if (output != null) {
      output[nested_default] = outerTheme !== null;
    }
    return output;
  }, [localTheme, outerTheme]);
  return (0, import_jsx_runtime5.jsx)(ThemeContext_default.Provider, {
    value: theme,
    children
  });
}
__name(ThemeProvider, "ThemeProvider");
true ? ThemeProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: import_prop_types10.default.node,
  /**
   * A theme object. You can provide a function to extend the outer theme.
   */
  theme: import_prop_types10.default.oneOfType([import_prop_types10.default.object, import_prop_types10.default.func]).isRequired
} : void 0;
if (true) {
  true ? ThemeProvider.propTypes = exactProp(ThemeProvider.propTypes) : void 0;
}
var ThemeProvider_default = ThemeProvider;

// node_modules/@mui/system/esm/ThemeProvider/ThemeProvider.js
init_styled_engine();

// node_modules/@mui/system/esm/RtlProvider/index.js
init_extends();
var React23 = __toESM(require_react());
var import_prop_types11 = __toESM(require_prop_types());
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var _excluded7 = ["value"];
var RtlContext = React23.createContext();
function RtlProvider(_ref) {
  let {
    value
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded7);
  return (0, import_jsx_runtime6.jsx)(RtlContext.Provider, _extends({
    value: value != null ? value : true
  }, props));
}
__name(RtlProvider, "RtlProvider");
true ? RtlProvider.propTypes = {
  children: import_prop_types11.default.node,
  value: import_prop_types11.default.bool
} : void 0;
var useRtl = /* @__PURE__ */ __name(() => {
  const value = React23.useContext(RtlContext);
  return value != null ? value : false;
}, "useRtl");
var RtlProvider_default = RtlProvider;

// node_modules/@mui/system/esm/DefaultPropsProvider/DefaultPropsProvider.js
var React24 = __toESM(require_react());
var import_prop_types12 = __toESM(require_prop_types());
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var PropsContext = React24.createContext(void 0);
function DefaultPropsProvider({
  value,
  children
}) {
  return (0, import_jsx_runtime7.jsx)(PropsContext.Provider, {
    value,
    children
  });
}
__name(DefaultPropsProvider, "DefaultPropsProvider");
true ? DefaultPropsProvider.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: import_prop_types12.default.node,
  /**
   * @ignore
   */
  value: import_prop_types12.default.object
} : void 0;
function getThemeProps2(params) {
  const {
    theme,
    name,
    props
  } = params;
  if (!theme || !theme.components || !theme.components[name]) {
    return props;
  }
  const config = theme.components[name];
  if (config.defaultProps) {
    return resolveProps(config.defaultProps, props);
  }
  if (!config.styleOverrides && !config.variants) {
    return resolveProps(config, props);
  }
  return props;
}
__name(getThemeProps2, "getThemeProps");
function useDefaultProps({
  props,
  name
}) {
  const ctx = React24.useContext(PropsContext);
  return getThemeProps2({
    props,
    name,
    theme: {
      components: ctx
    }
  });
}
__name(useDefaultProps, "useDefaultProps");
var DefaultPropsProvider_default = DefaultPropsProvider;

// node_modules/@mui/system/esm/ThemeProvider/ThemeProvider.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var EMPTY_THEME = {};
function useThemeScoping(themeId, upperTheme, localTheme, isPrivate = false) {
  return React25.useMemo(() => {
    const resolvedTheme = themeId ? upperTheme[themeId] || upperTheme : upperTheme;
    if (typeof localTheme === "function") {
      const mergedTheme = localTheme(resolvedTheme);
      const result = themeId ? _extends({}, upperTheme, {
        [themeId]: mergedTheme
      }) : mergedTheme;
      if (isPrivate) {
        return () => result;
      }
      return result;
    }
    return themeId ? _extends({}, upperTheme, {
      [themeId]: localTheme
    }) : _extends({}, upperTheme, localTheme);
  }, [themeId, upperTheme, localTheme, isPrivate]);
}
__name(useThemeScoping, "useThemeScoping");
function ThemeProvider2(props) {
  const {
    children,
    theme: localTheme,
    themeId
  } = props;
  const upperTheme = useThemeWithoutDefault_default(EMPTY_THEME);
  const upperPrivateTheme = useTheme3() || EMPTY_THEME;
  if (true) {
    if (upperTheme === null && typeof localTheme === "function" || themeId && upperTheme && !upperTheme[themeId] && typeof localTheme === "function") {
      console.error(["MUI: You are providing a theme function prop to the ThemeProvider component:", "<ThemeProvider theme={outerTheme => outerTheme} />", "", "However, no outer theme is present.", "Make sure a theme is already injected higher in the React tree or provide a theme object."].join("\n"));
    }
  }
  const engineTheme = useThemeScoping(themeId, upperTheme, localTheme);
  const privateTheme = useThemeScoping(themeId, upperPrivateTheme, localTheme, true);
  const rtlValue = engineTheme.direction === "rtl";
  return (0, import_jsx_runtime8.jsx)(ThemeProvider_default, {
    theme: privateTheme,
    children: (0, import_jsx_runtime8.jsx)(ThemeContext.Provider, {
      value: engineTheme,
      children: (0, import_jsx_runtime8.jsx)(RtlProvider_default, {
        value: rtlValue,
        children: (0, import_jsx_runtime8.jsx)(DefaultPropsProvider_default, {
          value: engineTheme == null ? void 0 : engineTheme.components,
          children
        })
      })
    })
  });
}
__name(ThemeProvider2, "ThemeProvider");
true ? ThemeProvider2.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Your component tree.
   */
  children: import_prop_types13.default.node,
  /**
   * A theme object. You can provide a function to extend the outer theme.
   */
  theme: import_prop_types13.default.oneOfType([import_prop_types13.default.func, import_prop_types13.default.object]).isRequired,
  /**
   * The design system's unique id for getting the corresponded theme when there are multiple design systems.
   */
  themeId: import_prop_types13.default.string
} : void 0;
if (true) {
  true ? ThemeProvider2.propTypes = exactProp(ThemeProvider2.propTypes) : void 0;
}
var ThemeProvider_default2 = ThemeProvider2;

// node_modules/@mui/system/esm/cssVars/createCssVarsProvider.js
init_extends();
init_formatMuiErrorMessage2();
var React28 = __toESM(require_react());
var import_prop_types14 = __toESM(require_prop_types());
init_deepmerge2();
init_styled_engine();

// node_modules/@mui/system/esm/InitColorSchemeScript/InitColorSchemeScript.js
var React26 = __toESM(require_react());
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var DEFAULT_MODE_STORAGE_KEY = "mode";
var DEFAULT_COLOR_SCHEME_STORAGE_KEY = "color-scheme";
var DEFAULT_ATTRIBUTE = "data-color-scheme";
function InitColorSchemeScript(options) {
  const {
    defaultMode = "light",
    defaultLightColorScheme = "light",
    defaultDarkColorScheme = "dark",
    modeStorageKey = DEFAULT_MODE_STORAGE_KEY,
    colorSchemeStorageKey = DEFAULT_COLOR_SCHEME_STORAGE_KEY,
    attribute = DEFAULT_ATTRIBUTE,
    colorSchemeNode = "document.documentElement",
    nonce
  } = options || {};
  return (0, import_jsx_runtime9.jsx)("script", {
    suppressHydrationWarning: true,
    nonce: typeof window === "undefined" ? nonce : "",
    dangerouslySetInnerHTML: {
      __html: `(function() {
try {
  var mode = localStorage.getItem('${modeStorageKey}') || '${defaultMode}';
  var colorScheme = '';
  if (mode === 'system') {
    // handle system mode
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.matches) {
      colorScheme = localStorage.getItem('${colorSchemeStorageKey}-dark') || '${defaultDarkColorScheme}';
    } else {
      colorScheme = localStorage.getItem('${colorSchemeStorageKey}-light') || '${defaultLightColorScheme}';
    }
  }
  if (mode === 'light') {
    colorScheme = localStorage.getItem('${colorSchemeStorageKey}-light') || '${defaultLightColorScheme}';
  }
  if (mode === 'dark') {
    colorScheme = localStorage.getItem('${colorSchemeStorageKey}-dark') || '${defaultDarkColorScheme}';
  }
  if (colorScheme) {
    ${colorSchemeNode}.setAttribute('${attribute}', colorScheme);
  }
} catch(e){}})();`
    }
  }, "mui-color-scheme-init");
}
__name(InitColorSchemeScript, "InitColorSchemeScript");

// node_modules/@mui/system/esm/cssVars/useCurrentColorScheme.js
init_extends();
var React27 = __toESM(require_react());
function getSystemMode(mode) {
  if (typeof window !== "undefined" && mode === "system") {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    if (mql.matches) {
      return "dark";
    }
    return "light";
  }
  return void 0;
}
__name(getSystemMode, "getSystemMode");
function processState(state, callback) {
  if (state.mode === "light" || state.mode === "system" && state.systemMode === "light") {
    return callback("light");
  }
  if (state.mode === "dark" || state.mode === "system" && state.systemMode === "dark") {
    return callback("dark");
  }
  return void 0;
}
__name(processState, "processState");
function getColorScheme(state) {
  return processState(state, (mode) => {
    if (mode === "light") {
      return state.lightColorScheme;
    }
    if (mode === "dark") {
      return state.darkColorScheme;
    }
    return void 0;
  });
}
__name(getColorScheme, "getColorScheme");
function initializeValue(key, defaultValue) {
  if (typeof window === "undefined") {
    return void 0;
  }
  let value;
  try {
    value = localStorage.getItem(key) || void 0;
    if (!value) {
      localStorage.setItem(key, defaultValue);
    }
  } catch (e) {
  }
  return value || defaultValue;
}
__name(initializeValue, "initializeValue");
function useCurrentColorScheme(options) {
  const {
    defaultMode = "light",
    defaultLightColorScheme,
    defaultDarkColorScheme,
    supportedColorSchemes = [],
    modeStorageKey = DEFAULT_MODE_STORAGE_KEY,
    colorSchemeStorageKey = DEFAULT_COLOR_SCHEME_STORAGE_KEY,
    storageWindow = typeof window === "undefined" ? void 0 : window
  } = options;
  const joinedColorSchemes = supportedColorSchemes.join(",");
  const [state, setState] = React27.useState(() => {
    const initialMode = initializeValue(modeStorageKey, defaultMode);
    const lightColorScheme = initializeValue(`${colorSchemeStorageKey}-light`, defaultLightColorScheme);
    const darkColorScheme = initializeValue(`${colorSchemeStorageKey}-dark`, defaultDarkColorScheme);
    return {
      mode: initialMode,
      systemMode: getSystemMode(initialMode),
      lightColorScheme,
      darkColorScheme
    };
  });
  const colorScheme = getColorScheme(state);
  const setMode = React27.useCallback((mode) => {
    setState((currentState) => {
      if (mode === currentState.mode) {
        return currentState;
      }
      const newMode = mode != null ? mode : defaultMode;
      try {
        localStorage.setItem(modeStorageKey, newMode);
      } catch (e) {
      }
      return _extends({}, currentState, {
        mode: newMode,
        systemMode: getSystemMode(newMode)
      });
    });
  }, [modeStorageKey, defaultMode]);
  const setColorScheme = React27.useCallback((value) => {
    if (!value) {
      setState((currentState) => {
        try {
          localStorage.setItem(`${colorSchemeStorageKey}-light`, defaultLightColorScheme);
          localStorage.setItem(`${colorSchemeStorageKey}-dark`, defaultDarkColorScheme);
        } catch (e) {
        }
        return _extends({}, currentState, {
          lightColorScheme: defaultLightColorScheme,
          darkColorScheme: defaultDarkColorScheme
        });
      });
    } else if (typeof value === "string") {
      if (value && !joinedColorSchemes.includes(value)) {
        console.error(`\`${value}\` does not exist in \`theme.colorSchemes\`.`);
      } else {
        setState((currentState) => {
          const newState = _extends({}, currentState);
          processState(currentState, (mode) => {
            try {
              localStorage.setItem(`${colorSchemeStorageKey}-${mode}`, value);
            } catch (e) {
            }
            if (mode === "light") {
              newState.lightColorScheme = value;
            }
            if (mode === "dark") {
              newState.darkColorScheme = value;
            }
          });
          return newState;
        });
      }
    } else {
      setState((currentState) => {
        const newState = _extends({}, currentState);
        const newLightColorScheme = value.light === null ? defaultLightColorScheme : value.light;
        const newDarkColorScheme = value.dark === null ? defaultDarkColorScheme : value.dark;
        if (newLightColorScheme) {
          if (!joinedColorSchemes.includes(newLightColorScheme)) {
            console.error(`\`${newLightColorScheme}\` does not exist in \`theme.colorSchemes\`.`);
          } else {
            newState.lightColorScheme = newLightColorScheme;
            try {
              localStorage.setItem(`${colorSchemeStorageKey}-light`, newLightColorScheme);
            } catch (error) {
            }
          }
        }
        if (newDarkColorScheme) {
          if (!joinedColorSchemes.includes(newDarkColorScheme)) {
            console.error(`\`${newDarkColorScheme}\` does not exist in \`theme.colorSchemes\`.`);
          } else {
            newState.darkColorScheme = newDarkColorScheme;
            try {
              localStorage.setItem(`${colorSchemeStorageKey}-dark`, newDarkColorScheme);
            } catch (error) {
            }
          }
        }
        return newState;
      });
    }
  }, [joinedColorSchemes, colorSchemeStorageKey, defaultLightColorScheme, defaultDarkColorScheme]);
  const handleMediaQuery = React27.useCallback((event) => {
    if (state.mode === "system") {
      setState((currentState) => {
        const systemMode = event != null && event.matches ? "dark" : "light";
        if (currentState.systemMode === systemMode) {
          return currentState;
        }
        return _extends({}, currentState, {
          systemMode
        });
      });
    }
  }, [state.mode]);
  const mediaListener = React27.useRef(handleMediaQuery);
  mediaListener.current = handleMediaQuery;
  React27.useEffect(() => {
    const handler = /* @__PURE__ */ __name((...args) => mediaListener.current(...args), "handler");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addListener(handler);
    handler(media);
    return () => {
      media.removeListener(handler);
    };
  }, []);
  React27.useEffect(() => {
    if (storageWindow) {
      const handleStorage = /* @__PURE__ */ __name((event) => {
        const value = event.newValue;
        if (typeof event.key === "string" && event.key.startsWith(colorSchemeStorageKey) && (!value || joinedColorSchemes.match(value))) {
          if (event.key.endsWith("light")) {
            setColorScheme({
              light: value
            });
          }
          if (event.key.endsWith("dark")) {
            setColorScheme({
              dark: value
            });
          }
        }
        if (event.key === modeStorageKey && (!value || ["light", "dark", "system"].includes(value))) {
          setMode(value || defaultMode);
        }
      }, "handleStorage");
      storageWindow.addEventListener("storage", handleStorage);
      return () => {
        storageWindow.removeEventListener("storage", handleStorage);
      };
    }
    return void 0;
  }, [setColorScheme, setMode, modeStorageKey, colorSchemeStorageKey, joinedColorSchemes, defaultMode, storageWindow]);
  return _extends({}, state, {
    colorScheme,
    setMode,
    setColorScheme
  });
}
__name(useCurrentColorScheme, "useCurrentColorScheme");

// node_modules/@mui/system/esm/cssVars/createCssVarsProvider.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var _excluded8 = ["colorSchemes", "components", "generateCssVars", "cssVarPrefix"];
var DISABLE_CSS_TRANSITION = "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
function createCssVarsProvider(options) {
  const {
    themeId,
    /**
     * This `theme` object needs to follow a certain structure to
     * be used correctly by the finel `CssVarsProvider`. It should have a
     * `colorSchemes` key with the light and dark (and any other) palette.
     * It should also ideally have a vars object created using `prepareCssVars`.
     */
    theme: defaultTheme5 = {},
    attribute: defaultAttribute = DEFAULT_ATTRIBUTE,
    modeStorageKey: defaultModeStorageKey = DEFAULT_MODE_STORAGE_KEY,
    colorSchemeStorageKey: defaultColorSchemeStorageKey = DEFAULT_COLOR_SCHEME_STORAGE_KEY,
    defaultMode: designSystemMode = "light",
    defaultColorScheme: designSystemColorScheme,
    disableTransitionOnChange: designSystemTransitionOnChange = false,
    resolveTheme: resolveTheme2,
    excludeVariablesFromRoot
  } = options;
  if (!defaultTheme5.colorSchemes || typeof designSystemColorScheme === "string" && !defaultTheme5.colorSchemes[designSystemColorScheme] || typeof designSystemColorScheme === "object" && !defaultTheme5.colorSchemes[designSystemColorScheme == null ? void 0 : designSystemColorScheme.light] || typeof designSystemColorScheme === "object" && !defaultTheme5.colorSchemes[designSystemColorScheme == null ? void 0 : designSystemColorScheme.dark]) {
    console.error(`MUI: \`${designSystemColorScheme}\` does not exist in \`theme.colorSchemes\`.`);
  }
  const ColorSchemeContext = React28.createContext(void 0);
  if (true) {
    ColorSchemeContext.displayName = "ColorSchemeContext";
  }
  const useColorScheme = /* @__PURE__ */ __name(() => {
    const value = React28.useContext(ColorSchemeContext);
    if (!value) {
      throw new Error(true ? `MUI: \`useColorScheme\` must be called under <CssVarsProvider />` : formatMuiErrorMessage(19));
    }
    return value;
  }, "useColorScheme");
  function CssVarsProvider(props) {
    const {
      children,
      theme: themeProp = defaultTheme5,
      modeStorageKey = defaultModeStorageKey,
      colorSchemeStorageKey = defaultColorSchemeStorageKey,
      attribute = defaultAttribute,
      defaultMode = designSystemMode,
      defaultColorScheme = designSystemColorScheme,
      disableTransitionOnChange = designSystemTransitionOnChange,
      storageWindow = typeof window === "undefined" ? void 0 : window,
      documentNode = typeof document === "undefined" ? void 0 : document,
      colorSchemeNode = typeof document === "undefined" ? void 0 : document.documentElement,
      colorSchemeSelector = ":root",
      disableNestedContext = false,
      disableStyleSheetGeneration = false
    } = props;
    const hasMounted = React28.useRef(false);
    const upperTheme = useTheme3();
    const ctx = React28.useContext(ColorSchemeContext);
    const nested = !!ctx && !disableNestedContext;
    const scopedTheme = themeProp[themeId];
    const _ref = scopedTheme || themeProp, {
      colorSchemes = {},
      components = {},
      generateCssVars = /* @__PURE__ */ __name(() => ({
        vars: {},
        css: {}
      }), "generateCssVars"),
      cssVarPrefix
    } = _ref, restThemeProp = _objectWithoutPropertiesLoose(_ref, _excluded8);
    const allColorSchemes = Object.keys(colorSchemes);
    const defaultLightColorScheme2 = typeof defaultColorScheme === "string" ? defaultColorScheme : defaultColorScheme.light;
    const defaultDarkColorScheme2 = typeof defaultColorScheme === "string" ? defaultColorScheme : defaultColorScheme.dark;
    const {
      mode: stateMode,
      setMode,
      systemMode,
      lightColorScheme,
      darkColorScheme,
      colorScheme: stateColorScheme,
      setColorScheme
    } = useCurrentColorScheme({
      supportedColorSchemes: allColorSchemes,
      defaultLightColorScheme: defaultLightColorScheme2,
      defaultDarkColorScheme: defaultDarkColorScheme2,
      modeStorageKey,
      colorSchemeStorageKey,
      defaultMode,
      storageWindow
    });
    let mode = stateMode;
    let colorScheme = stateColorScheme;
    if (nested) {
      mode = ctx.mode;
      colorScheme = ctx.colorScheme;
    }
    const calculatedMode = (() => {
      if (mode) {
        return mode;
      }
      if (defaultMode === "system") {
        return designSystemMode;
      }
      return defaultMode;
    })();
    const calculatedColorScheme = (() => {
      if (!colorScheme) {
        if (calculatedMode === "dark") {
          return defaultDarkColorScheme2;
        }
        return defaultLightColorScheme2;
      }
      return colorScheme;
    })();
    const {
      css: rootCss,
      vars: rootVars
    } = generateCssVars();
    const theme = _extends({}, restThemeProp, {
      components,
      colorSchemes,
      cssVarPrefix,
      vars: rootVars,
      getColorSchemeSelector: /* @__PURE__ */ __name((targetColorScheme) => `[${attribute}="${targetColorScheme}"] &`, "getColorSchemeSelector")
    });
    const defaultColorSchemeStyleSheet = {};
    const otherColorSchemesStyleSheet = {};
    Object.entries(colorSchemes).forEach(([key, scheme]) => {
      const {
        css: css2,
        vars
      } = generateCssVars(key);
      theme.vars = deepmerge(theme.vars, vars);
      if (key === calculatedColorScheme) {
        Object.keys(scheme).forEach((schemeKey) => {
          if (scheme[schemeKey] && typeof scheme[schemeKey] === "object") {
            theme[schemeKey] = _extends({}, theme[schemeKey], scheme[schemeKey]);
          } else {
            theme[schemeKey] = scheme[schemeKey];
          }
        });
        if (theme.palette) {
          theme.palette.colorScheme = key;
        }
      }
      const resolvedDefaultColorScheme = (() => {
        if (typeof defaultColorScheme === "string") {
          return defaultColorScheme;
        }
        if (defaultMode === "dark") {
          return defaultColorScheme.dark;
        }
        return defaultColorScheme.light;
      })();
      if (key === resolvedDefaultColorScheme) {
        if (excludeVariablesFromRoot) {
          const excludedVariables = {};
          excludeVariablesFromRoot(cssVarPrefix).forEach((cssVar) => {
            excludedVariables[cssVar] = css2[cssVar];
            delete css2[cssVar];
          });
          defaultColorSchemeStyleSheet[`[${attribute}="${key}"]`] = excludedVariables;
        }
        defaultColorSchemeStyleSheet[`${colorSchemeSelector}, [${attribute}="${key}"]`] = css2;
      } else {
        otherColorSchemesStyleSheet[`${colorSchemeSelector === ":root" ? "" : colorSchemeSelector}[${attribute}="${key}"]`] = css2;
      }
    });
    theme.vars = deepmerge(theme.vars, rootVars);
    React28.useEffect(() => {
      if (colorScheme && colorSchemeNode) {
        colorSchemeNode.setAttribute(attribute, colorScheme);
      }
    }, [colorScheme, attribute, colorSchemeNode]);
    React28.useEffect(() => {
      let timer;
      if (disableTransitionOnChange && hasMounted.current && documentNode) {
        const css2 = documentNode.createElement("style");
        css2.appendChild(documentNode.createTextNode(DISABLE_CSS_TRANSITION));
        documentNode.head.appendChild(css2);
        (() => window.getComputedStyle(documentNode.body))();
        timer = setTimeout(() => {
          documentNode.head.removeChild(css2);
        }, 1);
      }
      return () => {
        clearTimeout(timer);
      };
    }, [colorScheme, disableTransitionOnChange, documentNode]);
    React28.useEffect(() => {
      hasMounted.current = true;
      return () => {
        hasMounted.current = false;
      };
    }, []);
    const contextValue = React28.useMemo(() => ({
      allColorSchemes,
      colorScheme,
      darkColorScheme,
      lightColorScheme,
      mode,
      setColorScheme,
      setMode,
      systemMode
    }), [allColorSchemes, colorScheme, darkColorScheme, lightColorScheme, mode, setColorScheme, setMode, systemMode]);
    let shouldGenerateStyleSheet = true;
    if (disableStyleSheetGeneration || nested && (upperTheme == null ? void 0 : upperTheme.cssVarPrefix) === cssVarPrefix) {
      shouldGenerateStyleSheet = false;
    }
    const element = (0, import_jsx_runtime11.jsxs)(React28.Fragment, {
      children: [shouldGenerateStyleSheet && (0, import_jsx_runtime11.jsxs)(React28.Fragment, {
        children: [(0, import_jsx_runtime10.jsx)(GlobalStyles, {
          styles: {
            [colorSchemeSelector]: rootCss
          }
        }), (0, import_jsx_runtime10.jsx)(GlobalStyles, {
          styles: defaultColorSchemeStyleSheet
        }), (0, import_jsx_runtime10.jsx)(GlobalStyles, {
          styles: otherColorSchemesStyleSheet
        })]
      }), (0, import_jsx_runtime10.jsx)(ThemeProvider_default2, {
        themeId: scopedTheme ? themeId : void 0,
        theme: resolveTheme2 ? resolveTheme2(theme) : theme,
        children
      })]
    });
    if (nested) {
      return element;
    }
    return (0, import_jsx_runtime10.jsx)(ColorSchemeContext.Provider, {
      value: contextValue,
      children: element
    });
  }
  __name(CssVarsProvider, "CssVarsProvider");
  true ? CssVarsProvider.propTypes = {
    /**
     * The body attribute name to attach colorScheme.
     */
    attribute: import_prop_types14.default.string,
    /**
     * The component tree.
     */
    children: import_prop_types14.default.node,
    /**
     * The node used to attach the color-scheme attribute
     */
    colorSchemeNode: import_prop_types14.default.any,
    /**
     * The CSS selector for attaching the generated custom properties
     */
    colorSchemeSelector: import_prop_types14.default.string,
    /**
     * localStorage key used to store `colorScheme`
     */
    colorSchemeStorageKey: import_prop_types14.default.string,
    /**
     * The initial color scheme used.
     */
    defaultColorScheme: import_prop_types14.default.oneOfType([import_prop_types14.default.string, import_prop_types14.default.object]),
    /**
     * The initial mode used.
     */
    defaultMode: import_prop_types14.default.string,
    /**
     * If `true`, the provider creates its own context and generate stylesheet as if it is a root `CssVarsProvider`.
     */
    disableNestedContext: import_prop_types14.default.bool,
    /**
     * If `true`, the style sheet won't be generated.
     *
     * This is useful for controlling nested CssVarsProvider behavior.
     */
    disableStyleSheetGeneration: import_prop_types14.default.bool,
    /**
     * Disable CSS transitions when switching between modes or color schemes.
     */
    disableTransitionOnChange: import_prop_types14.default.bool,
    /**
     * The document to attach the attribute to.
     */
    documentNode: import_prop_types14.default.any,
    /**
     * The key in the local storage used to store current color scheme.
     */
    modeStorageKey: import_prop_types14.default.string,
    /**
     * The window that attaches the 'storage' event listener.
     * @default window
     */
    storageWindow: import_prop_types14.default.any,
    /**
     * The calculated theme object that will be passed through context.
     */
    theme: import_prop_types14.default.object
  } : void 0;
  const defaultLightColorScheme = typeof designSystemColorScheme === "string" ? designSystemColorScheme : designSystemColorScheme.light;
  const defaultDarkColorScheme = typeof designSystemColorScheme === "string" ? designSystemColorScheme : designSystemColorScheme.dark;
  const getInitColorSchemeScript = /* @__PURE__ */ __name((params) => InitColorSchemeScript(_extends({
    attribute: defaultAttribute,
    colorSchemeStorageKey: defaultColorSchemeStorageKey,
    defaultMode: designSystemMode,
    defaultLightColorScheme,
    defaultDarkColorScheme,
    modeStorageKey: defaultModeStorageKey
  }, params)), "getInitColorSchemeScript");
  return {
    CssVarsProvider,
    useColorScheme,
    getInitColorSchemeScript
  };
}
__name(createCssVarsProvider, "createCssVarsProvider");

// node_modules/@mui/system/esm/cssVars/createGetCssVar.js
function createGetCssVar(prefix = "") {
  function appendVar(...vars) {
    if (!vars.length) {
      return "";
    }
    const value = vars[0];
    if (typeof value === "string" && !value.match(/(#|\(|\)|(-?(\d*\.)?\d+)(px|em|%|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc))|^(-?(\d*\.)?\d+)$|(\d+ \d+ \d+)/)) {
      return `, var(--${prefix ? `${prefix}-` : ""}${value}${appendVar(...vars.slice(1))})`;
    }
    return `, ${value}`;
  }
  __name(appendVar, "appendVar");
  const getCssVar = /* @__PURE__ */ __name((field, ...fallbacks) => {
    return `var(--${prefix ? `${prefix}-` : ""}${field}${appendVar(...fallbacks)})`;
  }, "getCssVar");
  return getCssVar;
}
__name(createGetCssVar, "createGetCssVar");

// node_modules/@mui/system/esm/cssVars/cssVarsParser.js
var assignNestedKeys = /* @__PURE__ */ __name((obj, keys, value, arrayKeys = []) => {
  let temp = obj;
  keys.forEach((k, index) => {
    if (index === keys.length - 1) {
      if (Array.isArray(temp)) {
        temp[Number(k)] = value;
      } else if (temp && typeof temp === "object") {
        temp[k] = value;
      }
    } else if (temp && typeof temp === "object") {
      if (!temp[k]) {
        temp[k] = arrayKeys.includes(k) ? [] : {};
      }
      temp = temp[k];
    }
  });
}, "assignNestedKeys");
var walkObjectDeep = /* @__PURE__ */ __name((obj, callback, shouldSkipPaths) => {
  function recurse(object, parentKeys = [], arrayKeys = []) {
    Object.entries(object).forEach(([key, value]) => {
      if (!shouldSkipPaths || shouldSkipPaths && !shouldSkipPaths([...parentKeys, key])) {
        if (value !== void 0 && value !== null) {
          if (typeof value === "object" && Object.keys(value).length > 0) {
            recurse(value, [...parentKeys, key], Array.isArray(value) ? [...arrayKeys, key] : arrayKeys);
          } else {
            callback([...parentKeys, key], value, arrayKeys);
          }
        }
      }
    });
  }
  __name(recurse, "recurse");
  recurse(obj);
}, "walkObjectDeep");
var getCssValue = /* @__PURE__ */ __name((keys, value) => {
  if (typeof value === "number") {
    if (["lineHeight", "fontWeight", "opacity", "zIndex"].some((prop) => keys.includes(prop))) {
      return value;
    }
    const lastKey = keys[keys.length - 1];
    if (lastKey.toLowerCase().indexOf("opacity") >= 0) {
      return value;
    }
    return `${value}px`;
  }
  return value;
}, "getCssValue");
function cssVarsParser(theme, options) {
  const {
    prefix,
    shouldSkipGeneratingVar
  } = options || {};
  const css2 = {};
  const vars = {};
  const varsWithDefaults = {};
  walkObjectDeep(
    theme,
    (keys, value, arrayKeys) => {
      if (typeof value === "string" || typeof value === "number") {
        if (!shouldSkipGeneratingVar || !shouldSkipGeneratingVar(keys, value)) {
          const cssVar = `--${prefix ? `${prefix}-` : ""}${keys.join("-")}`;
          Object.assign(css2, {
            [cssVar]: getCssValue(keys, value)
          });
          assignNestedKeys(vars, keys, `var(${cssVar})`, arrayKeys);
          assignNestedKeys(varsWithDefaults, keys, `var(${cssVar}, ${value})`, arrayKeys);
        }
      }
    },
    (keys) => keys[0] === "vars"
    // skip 'vars/*' paths
  );
  return {
    css: css2,
    vars,
    varsWithDefaults
  };
}
__name(cssVarsParser, "cssVarsParser");

// node_modules/@mui/system/esm/cssVars/prepareCssVars.js
init_extends();
init_deepmerge2();
var _excluded9 = ["colorSchemes", "components", "defaultColorScheme"];
function prepareCssVars(theme, parserConfig) {
  const {
    colorSchemes = {},
    defaultColorScheme = "light"
  } = theme, otherTheme = _objectWithoutPropertiesLoose(theme, _excluded9);
  const {
    vars: rootVars,
    css: rootCss,
    varsWithDefaults: rootVarsWithDefaults
  } = cssVarsParser(otherTheme, parserConfig);
  let themeVars = rootVarsWithDefaults;
  const colorSchemesMap = {};
  const {
    [defaultColorScheme]: light2
  } = colorSchemes, otherColorSchemes = _objectWithoutPropertiesLoose(colorSchemes, [defaultColorScheme].map(toPropertyKey));
  Object.entries(otherColorSchemes || {}).forEach(([key, scheme]) => {
    const {
      vars,
      css: css2,
      varsWithDefaults
    } = cssVarsParser(scheme, parserConfig);
    themeVars = deepmerge(themeVars, varsWithDefaults);
    colorSchemesMap[key] = {
      css: css2,
      vars
    };
  });
  if (light2) {
    const {
      css: css2,
      vars,
      varsWithDefaults
    } = cssVarsParser(light2, parserConfig);
    themeVars = deepmerge(themeVars, varsWithDefaults);
    colorSchemesMap[defaultColorScheme] = {
      css: css2,
      vars
    };
  }
  const generateCssVars = /* @__PURE__ */ __name((colorScheme) => {
    var _parserConfig$getSele2;
    if (!colorScheme) {
      var _parserConfig$getSele;
      const css3 = _extends({}, rootCss);
      return {
        css: css3,
        vars: rootVars,
        selector: (parserConfig == null || (_parserConfig$getSele = parserConfig.getSelector) == null ? void 0 : _parserConfig$getSele.call(parserConfig, colorScheme, css3)) || ":root"
      };
    }
    const css2 = _extends({}, colorSchemesMap[colorScheme].css);
    return {
      css: css2,
      vars: colorSchemesMap[colorScheme].vars,
      selector: (parserConfig == null || (_parserConfig$getSele2 = parserConfig.getSelector) == null ? void 0 : _parserConfig$getSele2.call(parserConfig, colorScheme, css2)) || ":root"
    };
  }, "generateCssVars");
  return {
    vars: themeVars,
    generateCssVars
  };
}
__name(prepareCssVars, "prepareCssVars");
var prepareCssVars_default = prepareCssVars;

// node_modules/@mui/system/esm/cssVars/createCssVarsTheme.js
init_extends();

// node_modules/@mui/system/esm/version/index.js
var major = Number("5");
var minor = Number("17");
var patch = Number("1");
var preReleaseNumber = Number(void 0) || null;

// node_modules/@mui/system/esm/Container/createContainer.js
init_extends();
var React29 = __toESM(require_react());
var import_prop_types15 = __toESM(require_prop_types());
init_capitalize2();
var import_jsx_runtime12 = __toESM(require_jsx_runtime());
var _excluded10 = ["className", "component", "disableGutters", "fixed", "maxWidth", "classes"];
var defaultTheme = createTheme_default();
var defaultCreateStyledComponent = styled_default("div", {
  name: "MuiContainer",
  slot: "Root",
  overridesResolver: /* @__PURE__ */ __name((props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[`maxWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fixed && styles.fixed, ownerState.disableGutters && styles.disableGutters];
  }, "overridesResolver")
});
var useThemePropsDefault = /* @__PURE__ */ __name((inProps) => useThemeProps({
  props: inProps,
  name: "MuiContainer",
  defaultTheme
}), "useThemePropsDefault");
var useUtilityClasses = /* @__PURE__ */ __name((ownerState, componentName) => {
  const getContainerUtilityClass = /* @__PURE__ */ __name((slot) => {
    return generateUtilityClass(componentName, slot);
  }, "getContainerUtilityClass");
  const {
    classes,
    fixed,
    disableGutters,
    maxWidth: maxWidth2
  } = ownerState;
  const slots = {
    root: ["root", maxWidth2 && `maxWidth${capitalize(String(maxWidth2))}`, fixed && "fixed", disableGutters && "disableGutters"]
  };
  return composeClasses(slots, getContainerUtilityClass, classes);
}, "useUtilityClasses");
function createContainer(options = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent,
    useThemeProps: useThemeProps2 = useThemePropsDefault,
    componentName = "MuiContainer"
  } = options;
  const ContainerRoot = createStyledComponent(({
    theme,
    ownerState
  }) => _extends({
    width: "100%",
    marginLeft: "auto",
    boxSizing: "border-box",
    marginRight: "auto",
    display: "block"
  }, !ownerState.disableGutters && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }), ({
    theme,
    ownerState
  }) => ownerState.fixed && Object.keys(theme.breakpoints.values).reduce((acc, breakpointValueKey) => {
    const breakpoint = breakpointValueKey;
    const value = theme.breakpoints.values[breakpoint];
    if (value !== 0) {
      acc[theme.breakpoints.up(breakpoint)] = {
        maxWidth: `${value}${theme.breakpoints.unit}`
      };
    }
    return acc;
  }, {}), ({
    theme,
    ownerState
  }) => _extends({}, ownerState.maxWidth === "xs" && {
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up("xs")]: {
      // @ts-ignore module augmentation fails if custom breakpoints are used
      maxWidth: Math.max(theme.breakpoints.values.xs, 444)
    }
  }, ownerState.maxWidth && // @ts-ignore module augmentation fails if custom breakpoints are used
  ownerState.maxWidth !== "xs" && {
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up(ownerState.maxWidth)]: {
      // @ts-ignore module augmentation fails if custom breakpoints are used
      maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`
    }
  }));
  const Container2 = React29.forwardRef(/* @__PURE__ */ __name(function Container3(inProps, ref) {
    const props = useThemeProps2(inProps);
    const {
      className,
      component = "div",
      disableGutters = false,
      fixed = false,
      maxWidth: maxWidth2 = "lg"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded10);
    const ownerState = _extends({}, props, {
      component,
      disableGutters,
      fixed,
      maxWidth: maxWidth2
    });
    const classes = useUtilityClasses(ownerState, componentName);
    return (
      // @ts-ignore theme is injected by the styled util
      (0, import_jsx_runtime12.jsx)(ContainerRoot, _extends({
        as: component,
        ownerState,
        className: clsx_default(classes.root, className),
        ref
      }, other))
    );
  }, "Container"));
  true ? Container2.propTypes = {
    children: import_prop_types15.default.node,
    classes: import_prop_types15.default.object,
    className: import_prop_types15.default.string,
    component: import_prop_types15.default.elementType,
    disableGutters: import_prop_types15.default.bool,
    fixed: import_prop_types15.default.bool,
    maxWidth: import_prop_types15.default.oneOfType([import_prop_types15.default.oneOf(["xs", "sm", "md", "lg", "xl", false]), import_prop_types15.default.string]),
    sx: import_prop_types15.default.oneOfType([import_prop_types15.default.arrayOf(import_prop_types15.default.oneOfType([import_prop_types15.default.func, import_prop_types15.default.object, import_prop_types15.default.bool])), import_prop_types15.default.func, import_prop_types15.default.object])
  } : void 0;
  return Container2;
}
__name(createContainer, "createContainer");

// node_modules/@mui/system/esm/Container/Container.js
var import_prop_types16 = __toESM(require_prop_types());
var Container = createContainer();
true ? Container.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: import_prop_types16.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types16.default.object,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types16.default.elementType,
  /**
   * If `true`, the left and right padding is removed.
   * @default false
   */
  disableGutters: import_prop_types16.default.bool,
  /**
   * Set the max-width to match the min-width of the current breakpoint.
   * This is useful if you'd prefer to design for a fixed set of sizes
   * instead of trying to accommodate a fully fluid viewport.
   * It's fluid by default.
   * @default false
   */
  fixed: import_prop_types16.default.bool,
  /**
   * Determine the max-width of the container.
   * The container width grows with the size of the screen.
   * Set to `false` to disable `maxWidth`.
   * @default 'lg'
   */
  maxWidth: import_prop_types16.default.oneOfType([import_prop_types16.default.oneOf(["xs", "sm", "md", "lg", "xl", false]), import_prop_types16.default.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types16.default.oneOfType([import_prop_types16.default.arrayOf(import_prop_types16.default.oneOfType([import_prop_types16.default.func, import_prop_types16.default.object, import_prop_types16.default.bool])), import_prop_types16.default.func, import_prop_types16.default.object])
} : void 0;

// node_modules/@mui/system/esm/Container/containerClasses.js
var containerClasses = generateUtilityClasses("MuiContainer", ["root", "disableGutters", "fixed", "maxWidthXs", "maxWidthSm", "maxWidthMd", "maxWidthLg", "maxWidthXl"]);

// node_modules/@mui/system/esm/Unstable_Grid/Grid.js
var import_prop_types18 = __toESM(require_prop_types());

// node_modules/@mui/system/esm/Unstable_Grid/createGrid.js
init_extends();
var React30 = __toESM(require_react());
var import_prop_types17 = __toESM(require_prop_types());

// node_modules/@mui/system/esm/Unstable_Grid/gridGenerator.js
init_extends();

// node_modules/@mui/system/esm/Unstable_Grid/traverseBreakpoints.js
var filterBreakpointKeys = /* @__PURE__ */ __name((breakpointsKeys, responsiveKeys) => breakpointsKeys.filter((key) => responsiveKeys.includes(key)), "filterBreakpointKeys");
var traverseBreakpoints = /* @__PURE__ */ __name((breakpoints, responsive, iterator) => {
  const smallestBreakpoint = breakpoints.keys[0];
  if (Array.isArray(responsive)) {
    responsive.forEach((breakpointValue, index) => {
      iterator((responsiveStyles, style4) => {
        if (index <= breakpoints.keys.length - 1) {
          if (index === 0) {
            Object.assign(responsiveStyles, style4);
          } else {
            responsiveStyles[breakpoints.up(breakpoints.keys[index])] = style4;
          }
        }
      }, breakpointValue);
    });
  } else if (responsive && typeof responsive === "object") {
    const keys = Object.keys(responsive).length > breakpoints.keys.length ? breakpoints.keys : filterBreakpointKeys(breakpoints.keys, Object.keys(responsive));
    keys.forEach((key) => {
      if (breakpoints.keys.indexOf(key) !== -1) {
        const breakpointValue = responsive[key];
        if (breakpointValue !== void 0) {
          iterator((responsiveStyles, style4) => {
            if (smallestBreakpoint === key) {
              Object.assign(responsiveStyles, style4);
            } else {
              responsiveStyles[breakpoints.up(key)] = style4;
            }
          }, breakpointValue);
        }
      }
    });
  } else if (typeof responsive === "number" || typeof responsive === "string") {
    iterator((responsiveStyles, style4) => {
      Object.assign(responsiveStyles, style4);
    }, responsive);
  }
}, "traverseBreakpoints");

// node_modules/@mui/system/esm/Unstable_Grid/gridGenerator.js
function appendLevel(level) {
  if (!level) {
    return "";
  }
  return `Level${level}`;
}
__name(appendLevel, "appendLevel");
function isNestedContainer(ownerState) {
  return ownerState.unstable_level > 0 && ownerState.container;
}
__name(isNestedContainer, "isNestedContainer");
function createGetSelfSpacing(ownerState) {
  return /* @__PURE__ */ __name(function getSelfSpacing(axis) {
    return `var(--Grid-${axis}Spacing${appendLevel(ownerState.unstable_level)})`;
  }, "getSelfSpacing");
}
__name(createGetSelfSpacing, "createGetSelfSpacing");
function createGetParentSpacing(ownerState) {
  return /* @__PURE__ */ __name(function getParentSpacing(axis) {
    if (ownerState.unstable_level === 0) {
      return `var(--Grid-${axis}Spacing)`;
    }
    return `var(--Grid-${axis}Spacing${appendLevel(ownerState.unstable_level - 1)})`;
  }, "getParentSpacing");
}
__name(createGetParentSpacing, "createGetParentSpacing");
function getParentColumns(ownerState) {
  if (ownerState.unstable_level === 0) {
    return `var(--Grid-columns)`;
  }
  return `var(--Grid-columns${appendLevel(ownerState.unstable_level - 1)})`;
}
__name(getParentColumns, "getParentColumns");
var generateGridSizeStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  const getSelfSpacing = createGetSelfSpacing(ownerState);
  const styles = {};
  traverseBreakpoints(theme.breakpoints, ownerState.gridSize, (appendStyle, value) => {
    let style4 = {};
    if (value === true) {
      style4 = {
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: "100%"
      };
    }
    if (value === "auto") {
      style4 = {
        flexBasis: "auto",
        flexGrow: 0,
        flexShrink: 0,
        maxWidth: "none",
        width: "auto"
      };
    }
    if (typeof value === "number") {
      style4 = {
        flexGrow: 0,
        flexBasis: "auto",
        width: `calc(100% * ${value} / ${getParentColumns(ownerState)}${isNestedContainer(ownerState) ? ` + ${getSelfSpacing("column")}` : ""})`
      };
    }
    appendStyle(styles, style4);
  });
  return styles;
}, "generateGridSizeStyles");
var generateGridOffsetStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  const styles = {};
  traverseBreakpoints(theme.breakpoints, ownerState.gridOffset, (appendStyle, value) => {
    let style4 = {};
    if (value === "auto") {
      style4 = {
        marginLeft: "auto"
      };
    }
    if (typeof value === "number") {
      style4 = {
        marginLeft: value === 0 ? "0px" : `calc(100% * ${value} / ${getParentColumns(ownerState)})`
      };
    }
    appendStyle(styles, style4);
  });
  return styles;
}, "generateGridOffsetStyles");
var generateGridColumnsStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  if (!ownerState.container) {
    return {};
  }
  const styles = isNestedContainer(ownerState) ? {
    [`--Grid-columns${appendLevel(ownerState.unstable_level)}`]: getParentColumns(ownerState)
  } : {
    "--Grid-columns": 12
  };
  traverseBreakpoints(theme.breakpoints, ownerState.columns, (appendStyle, value) => {
    appendStyle(styles, {
      [`--Grid-columns${appendLevel(ownerState.unstable_level)}`]: value
    });
  });
  return styles;
}, "generateGridColumnsStyles");
var generateGridRowSpacingStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  if (!ownerState.container) {
    return {};
  }
  const getParentSpacing = createGetParentSpacing(ownerState);
  const styles = isNestedContainer(ownerState) ? {
    // Set the default spacing as its parent spacing.
    // It will be overridden if spacing props are provided
    [`--Grid-rowSpacing${appendLevel(ownerState.unstable_level)}`]: getParentSpacing("row")
  } : {};
  traverseBreakpoints(theme.breakpoints, ownerState.rowSpacing, (appendStyle, value) => {
    var _theme$spacing;
    appendStyle(styles, {
      [`--Grid-rowSpacing${appendLevel(ownerState.unstable_level)}`]: typeof value === "string" ? value : (_theme$spacing = theme.spacing) == null ? void 0 : _theme$spacing.call(theme, value)
    });
  });
  return styles;
}, "generateGridRowSpacingStyles");
var generateGridColumnSpacingStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  if (!ownerState.container) {
    return {};
  }
  const getParentSpacing = createGetParentSpacing(ownerState);
  const styles = isNestedContainer(ownerState) ? {
    // Set the default spacing as its parent spacing.
    // It will be overridden if spacing props are provided
    [`--Grid-columnSpacing${appendLevel(ownerState.unstable_level)}`]: getParentSpacing("column")
  } : {};
  traverseBreakpoints(theme.breakpoints, ownerState.columnSpacing, (appendStyle, value) => {
    var _theme$spacing2;
    appendStyle(styles, {
      [`--Grid-columnSpacing${appendLevel(ownerState.unstable_level)}`]: typeof value === "string" ? value : (_theme$spacing2 = theme.spacing) == null ? void 0 : _theme$spacing2.call(theme, value)
    });
  });
  return styles;
}, "generateGridColumnSpacingStyles");
var generateGridDirectionStyles = /* @__PURE__ */ __name(({
  theme,
  ownerState
}) => {
  if (!ownerState.container) {
    return {};
  }
  const styles = {};
  traverseBreakpoints(theme.breakpoints, ownerState.direction, (appendStyle, value) => {
    appendStyle(styles, {
      flexDirection: value
    });
  });
  return styles;
}, "generateGridDirectionStyles");
var generateGridStyles = /* @__PURE__ */ __name(({
  ownerState
}) => {
  const getSelfSpacing = createGetSelfSpacing(ownerState);
  const getParentSpacing = createGetParentSpacing(ownerState);
  return _extends({
    minWidth: 0,
    boxSizing: "border-box"
  }, ownerState.container && _extends({
    display: "flex",
    flexWrap: "wrap"
  }, ownerState.wrap && ownerState.wrap !== "wrap" && {
    flexWrap: ownerState.wrap
  }, {
    margin: `calc(${getSelfSpacing("row")} / -2) calc(${getSelfSpacing("column")} / -2)`
  }, ownerState.disableEqualOverflow && {
    margin: `calc(${getSelfSpacing("row")} * -1) 0px 0px calc(${getSelfSpacing("column")} * -1)`
  }), (!ownerState.container || isNestedContainer(ownerState)) && _extends({
    padding: `calc(${getParentSpacing("row")} / 2) calc(${getParentSpacing("column")} / 2)`
  }, (ownerState.disableEqualOverflow || ownerState.parentDisableEqualOverflow) && {
    padding: `${getParentSpacing("row")} 0px 0px ${getParentSpacing("column")}`
  }));
}, "generateGridStyles");
var generateSizeClassNames = /* @__PURE__ */ __name((gridSize) => {
  const classNames = [];
  Object.entries(gridSize).forEach(([key, value]) => {
    if (value !== false && value !== void 0) {
      classNames.push(`grid-${key}-${String(value)}`);
    }
  });
  return classNames;
}, "generateSizeClassNames");
var generateSpacingClassNames = /* @__PURE__ */ __name((spacing2, smallestBreakpoint = "xs") => {
  function isValidSpacing(val) {
    if (val === void 0) {
      return false;
    }
    return typeof val === "string" && !Number.isNaN(Number(val)) || typeof val === "number" && val > 0;
  }
  __name(isValidSpacing, "isValidSpacing");
  if (isValidSpacing(spacing2)) {
    return [`spacing-${smallestBreakpoint}-${String(spacing2)}`];
  }
  if (typeof spacing2 === "object" && !Array.isArray(spacing2)) {
    const classNames = [];
    Object.entries(spacing2).forEach(([key, value]) => {
      if (isValidSpacing(value)) {
        classNames.push(`spacing-${key}-${String(value)}`);
      }
    });
    return classNames;
  }
  return [];
}, "generateSpacingClassNames");
var generateDirectionClasses = /* @__PURE__ */ __name((direction) => {
  if (direction === void 0) {
    return [];
  }
  if (typeof direction === "object") {
    return Object.entries(direction).map(([key, value]) => `direction-${key}-${value}`);
  }
  return [`direction-xs-${String(direction)}`];
}, "generateDirectionClasses");

// node_modules/@mui/system/esm/Unstable_Grid/createGrid.js
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
var _excluded11 = ["className", "children", "columns", "container", "component", "direction", "wrap", "spacing", "rowSpacing", "columnSpacing", "disableEqualOverflow", "unstable_level"];
var defaultTheme2 = createTheme_default();
var defaultCreateStyledComponent2 = styled_default("div", {
  name: "MuiGrid",
  slot: "Root",
  overridesResolver: /* @__PURE__ */ __name((props, styles) => styles.root, "overridesResolver")
});
function useThemePropsDefault2(props) {
  return useThemeProps({
    props,
    name: "MuiGrid",
    defaultTheme: defaultTheme2
  });
}
__name(useThemePropsDefault2, "useThemePropsDefault");
function createGrid(options = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent2,
    useThemeProps: useThemeProps2 = useThemePropsDefault2,
    componentName = "MuiGrid"
  } = options;
  const GridOverflowContext = React30.createContext(void 0);
  if (true) {
    GridOverflowContext.displayName = "GridOverflowContext";
  }
  const useUtilityClasses2 = /* @__PURE__ */ __name((ownerState, theme) => {
    const {
      container,
      direction,
      spacing: spacing2,
      wrap,
      gridSize
    } = ownerState;
    const slots = {
      root: ["root", container && "container", wrap !== "wrap" && `wrap-xs-${String(wrap)}`, ...generateDirectionClasses(direction), ...generateSizeClassNames(gridSize), ...container ? generateSpacingClassNames(spacing2, theme.breakpoints.keys[0]) : []]
    };
    return composeClasses(slots, (slot) => generateUtilityClass(componentName, slot), {});
  }, "useUtilityClasses");
  const GridRoot = createStyledComponent(generateGridColumnsStyles, generateGridColumnSpacingStyles, generateGridRowSpacingStyles, generateGridSizeStyles, generateGridDirectionStyles, generateGridStyles, generateGridOffsetStyles);
  const Grid2 = React30.forwardRef(/* @__PURE__ */ __name(function Grid3(inProps, ref) {
    var _inProps$columns, _inProps$spacing, _ref, _inProps$rowSpacing, _ref2, _inProps$columnSpacin, _ref3, _disableEqualOverflow;
    const theme = useTheme_default();
    const themeProps = useThemeProps2(inProps);
    const props = extendSxProp(themeProps);
    const overflow2 = React30.useContext(GridOverflowContext);
    const {
      className,
      children,
      columns: columnsProp = 12,
      container = false,
      component = "div",
      direction = "row",
      wrap = "wrap",
      spacing: spacingProp = 0,
      rowSpacing: rowSpacingProp = spacingProp,
      columnSpacing: columnSpacingProp = spacingProp,
      disableEqualOverflow: themeDisableEqualOverflow,
      unstable_level: level = 0
    } = props, rest = _objectWithoutPropertiesLoose(props, _excluded11);
    let disableEqualOverflow = themeDisableEqualOverflow;
    if (level && themeDisableEqualOverflow !== void 0) {
      disableEqualOverflow = inProps.disableEqualOverflow;
    }
    const gridSize = {};
    const gridOffset = {};
    const other = {};
    Object.entries(rest).forEach(([key, val]) => {
      if (theme.breakpoints.values[key] !== void 0) {
        gridSize[key] = val;
      } else if (theme.breakpoints.values[key.replace("Offset", "")] !== void 0) {
        gridOffset[key.replace("Offset", "")] = val;
      } else {
        other[key] = val;
      }
    });
    const columns = (_inProps$columns = inProps.columns) != null ? _inProps$columns : level ? void 0 : columnsProp;
    const spacing2 = (_inProps$spacing = inProps.spacing) != null ? _inProps$spacing : level ? void 0 : spacingProp;
    const rowSpacing = (_ref = (_inProps$rowSpacing = inProps.rowSpacing) != null ? _inProps$rowSpacing : inProps.spacing) != null ? _ref : level ? void 0 : rowSpacingProp;
    const columnSpacing = (_ref2 = (_inProps$columnSpacin = inProps.columnSpacing) != null ? _inProps$columnSpacin : inProps.spacing) != null ? _ref2 : level ? void 0 : columnSpacingProp;
    const ownerState = _extends({}, props, {
      level,
      columns,
      container,
      direction,
      wrap,
      spacing: spacing2,
      rowSpacing,
      columnSpacing,
      gridSize,
      gridOffset,
      disableEqualOverflow: (_ref3 = (_disableEqualOverflow = disableEqualOverflow) != null ? _disableEqualOverflow : overflow2) != null ? _ref3 : false,
      // use context value if exists.
      parentDisableEqualOverflow: overflow2
      // for nested grid
    });
    const classes = useUtilityClasses2(ownerState, theme);
    let result = (0, import_jsx_runtime13.jsx)(GridRoot, _extends({
      ref,
      as: component,
      ownerState,
      className: clsx_default(classes.root, className)
    }, other, {
      children: React30.Children.map(children, (child) => {
        if (React30.isValidElement(child) && isMuiElement(child, ["Grid"])) {
          var _unstable_level, _child$props;
          return React30.cloneElement(child, {
            unstable_level: (_unstable_level = (_child$props = child.props) == null ? void 0 : _child$props.unstable_level) != null ? _unstable_level : level + 1
          });
        }
        return child;
      })
    }));
    if (disableEqualOverflow !== void 0 && disableEqualOverflow !== (overflow2 != null ? overflow2 : false)) {
      result = (0, import_jsx_runtime13.jsx)(GridOverflowContext.Provider, {
        value: disableEqualOverflow,
        children: result
      });
    }
    return result;
  }, "Grid"));
  true ? Grid2.propTypes = {
    children: import_prop_types17.default.node,
    className: import_prop_types17.default.string,
    columns: import_prop_types17.default.oneOfType([import_prop_types17.default.arrayOf(import_prop_types17.default.number), import_prop_types17.default.number, import_prop_types17.default.object]),
    columnSpacing: import_prop_types17.default.oneOfType([import_prop_types17.default.arrayOf(import_prop_types17.default.oneOfType([import_prop_types17.default.number, import_prop_types17.default.string])), import_prop_types17.default.number, import_prop_types17.default.object, import_prop_types17.default.string]),
    component: import_prop_types17.default.elementType,
    container: import_prop_types17.default.bool,
    direction: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["column-reverse", "column", "row-reverse", "row"]), import_prop_types17.default.arrayOf(import_prop_types17.default.oneOf(["column-reverse", "column", "row-reverse", "row"])), import_prop_types17.default.object]),
    disableEqualOverflow: import_prop_types17.default.bool,
    lg: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number, import_prop_types17.default.bool]),
    lgOffset: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number]),
    md: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number, import_prop_types17.default.bool]),
    mdOffset: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number]),
    rowSpacing: import_prop_types17.default.oneOfType([import_prop_types17.default.arrayOf(import_prop_types17.default.oneOfType([import_prop_types17.default.number, import_prop_types17.default.string])), import_prop_types17.default.number, import_prop_types17.default.object, import_prop_types17.default.string]),
    sm: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number, import_prop_types17.default.bool]),
    smOffset: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number]),
    spacing: import_prop_types17.default.oneOfType([import_prop_types17.default.arrayOf(import_prop_types17.default.oneOfType([import_prop_types17.default.number, import_prop_types17.default.string])), import_prop_types17.default.number, import_prop_types17.default.object, import_prop_types17.default.string]),
    sx: import_prop_types17.default.oneOfType([import_prop_types17.default.arrayOf(import_prop_types17.default.oneOfType([import_prop_types17.default.func, import_prop_types17.default.object, import_prop_types17.default.bool])), import_prop_types17.default.func, import_prop_types17.default.object]),
    wrap: import_prop_types17.default.oneOf(["nowrap", "wrap-reverse", "wrap"]),
    xl: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number, import_prop_types17.default.bool]),
    xlOffset: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number]),
    xs: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number, import_prop_types17.default.bool]),
    xsOffset: import_prop_types17.default.oneOfType([import_prop_types17.default.oneOf(["auto"]), import_prop_types17.default.number])
  } : void 0;
  Grid2.muiName = "Grid";
  return Grid2;
}
__name(createGrid, "createGrid");

// node_modules/@mui/system/esm/Unstable_Grid/Grid.js
var Grid = createGrid();
true ? Grid.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: import_prop_types18.default.node,
  /**
   * The number of columns.
   * @default 12
   */
  columns: import_prop_types18.default.oneOfType([import_prop_types18.default.arrayOf(import_prop_types18.default.number), import_prop_types18.default.number, import_prop_types18.default.object]),
  /**
   * Defines the horizontal space between the type `item` components.
   * It overrides the value of the `spacing` prop.
   */
  columnSpacing: import_prop_types18.default.oneOfType([import_prop_types18.default.arrayOf(import_prop_types18.default.oneOfType([import_prop_types18.default.number, import_prop_types18.default.string])), import_prop_types18.default.number, import_prop_types18.default.object, import_prop_types18.default.string]),
  /**
   * If `true`, the component will have the flex *container* behavior.
   * You should be wrapping *items* with a *container*.
   * @default false
   */
  container: import_prop_types18.default.bool,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'row'
   */
  direction: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["column-reverse", "column", "row-reverse", "row"]), import_prop_types18.default.arrayOf(import_prop_types18.default.oneOf(["column-reverse", "column", "row-reverse", "row"])), import_prop_types18.default.object]),
  /**
   * If `true`, the negative margin and padding are apply only to the top and left sides of the grid.
   */
  disableEqualOverflow: import_prop_types18.default.bool,
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `lg` breakpoint and wider screens if not overridden.
   * @default false
   */
  lg: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number, import_prop_types18.default.bool]),
  /**
   * If a number, it sets the margin-left equals to the number of columns the grid item uses.
   * If 'auto', the grid item push itself to the right-end of the container.
   * The value is applied for the `lg` breakpoint and wider screens if not overridden.
   */
  lgOffset: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `md` breakpoint and wider screens if not overridden.
   * @default false
   */
  md: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number, import_prop_types18.default.bool]),
  /**
   * If a number, it sets the margin-left equals to the number of columns the grid item uses.
   * If 'auto', the grid item push itself to the right-end of the container.
   * The value is applied for the `md` breakpoint and wider screens if not overridden.
   */
  mdOffset: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number]),
  /**
   * Defines the vertical space between the type `item` components.
   * It overrides the value of the `spacing` prop.
   */
  rowSpacing: import_prop_types18.default.oneOfType([import_prop_types18.default.arrayOf(import_prop_types18.default.oneOfType([import_prop_types18.default.number, import_prop_types18.default.string])), import_prop_types18.default.number, import_prop_types18.default.object, import_prop_types18.default.string]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `sm` breakpoint and wider screens if not overridden.
   * @default false
   */
  sm: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number, import_prop_types18.default.bool]),
  /**
   * If a number, it sets the margin-left equals to the number of columns the grid item uses.
   * If 'auto', the grid item push itself to the right-end of the container.
   * The value is applied for the `sm` breakpoint and wider screens if not overridden.
   */
  smOffset: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number]),
  /**
   * Defines the space between the type `item` components.
   * It can only be used on a type `container` component.
   * @default 0
   */
  spacing: import_prop_types18.default.oneOfType([import_prop_types18.default.arrayOf(import_prop_types18.default.oneOfType([import_prop_types18.default.number, import_prop_types18.default.string])), import_prop_types18.default.number, import_prop_types18.default.object, import_prop_types18.default.string]),
  /**
   * @ignore
   */
  sx: import_prop_types18.default.oneOfType([import_prop_types18.default.arrayOf(import_prop_types18.default.oneOfType([import_prop_types18.default.func, import_prop_types18.default.object, import_prop_types18.default.bool])), import_prop_types18.default.func, import_prop_types18.default.object]),
  /**
   * @internal
   * The level of the grid starts from `0`
   * and increases when the grid nests inside another grid regardless of container or item.
   *
   * ```js
   * <Grid> // level 0
   *   <Grid> // level 1
   *     <Grid> // level 2
   *   <Grid> // level 1
   * ```
   *
   * Only consecutive grid is considered nesting.
   * A grid container will start at `0` if there are non-Grid element above it.
   *
   * ```js
   * <Grid> // level 0
   *   <div>
   *     <Grid> // level 0
   *       <Grid> // level 1
   * ```
   */
  unstable_level: import_prop_types18.default.number,
  /**
   * Defines the `flex-wrap` style property.
   * It's applied for all screen sizes.
   * @default 'wrap'
   */
  wrap: import_prop_types18.default.oneOf(["nowrap", "wrap-reverse", "wrap"]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `xl` breakpoint and wider screens if not overridden.
   * @default false
   */
  xl: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number, import_prop_types18.default.bool]),
  /**
   * If a number, it sets the margin-left equals to the number of columns the grid item uses.
   * If 'auto', the grid item push itself to the right-end of the container.
   * The value is applied for the `xl` breakpoint and wider screens if not overridden.
   */
  xlOffset: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for all the screen sizes with the lowest priority.
   * @default false
   */
  xs: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number, import_prop_types18.default.bool]),
  /**
   * If a number, it sets the margin-left equals to the number of columns the grid item uses.
   * If 'auto', the grid item push itself to the right-end of the container.
   * The value is applied for the `xs` breakpoint and wider screens if not overridden.
   */
  xsOffset: import_prop_types18.default.oneOfType([import_prop_types18.default.oneOf(["auto"]), import_prop_types18.default.number])
} : void 0;

// node_modules/@mui/system/esm/Unstable_Grid/gridClasses.js
var SPACINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var DIRECTIONS = ["column-reverse", "column", "row-reverse", "row"];
var WRAPS = ["nowrap", "wrap-reverse", "wrap"];
var GRID_SIZES = ["auto", true, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var gridClasses = generateUtilityClasses("MuiGrid", [
  "root",
  "container",
  "item",
  // spacings
  ...SPACINGS.map((spacing2) => `spacing-xs-${spacing2}`),
  // direction values
  ...DIRECTIONS.map((direction) => `direction-xs-${direction}`),
  // wrap values
  ...WRAPS.map((wrap) => `wrap-xs-${wrap}`),
  // grid sizes for all breakpoints
  ...GRID_SIZES.map((size) => `grid-xs-${size}`),
  ...GRID_SIZES.map((size) => `grid-sm-${size}`),
  ...GRID_SIZES.map((size) => `grid-md-${size}`),
  ...GRID_SIZES.map((size) => `grid-lg-${size}`),
  ...GRID_SIZES.map((size) => `grid-xl-${size}`)
]);

// node_modules/@mui/system/esm/Stack/Stack.js
var import_prop_types20 = __toESM(require_prop_types());

// node_modules/@mui/system/esm/Stack/createStack.js
init_extends();
var React31 = __toESM(require_react());
var import_prop_types19 = __toESM(require_prop_types());
init_deepmerge2();
var import_jsx_runtime14 = __toESM(require_jsx_runtime());
var _excluded12 = ["component", "direction", "spacing", "divider", "children", "className", "useFlexGap"];
var defaultTheme3 = createTheme_default();
var defaultCreateStyledComponent3 = styled_default("div", {
  name: "MuiStack",
  slot: "Root",
  overridesResolver: /* @__PURE__ */ __name((props, styles) => styles.root, "overridesResolver")
});
function useThemePropsDefault3(props) {
  return useThemeProps({
    props,
    name: "MuiStack",
    defaultTheme: defaultTheme3
  });
}
__name(useThemePropsDefault3, "useThemePropsDefault");
function joinChildren(children, separator) {
  const childrenArray = React31.Children.toArray(children).filter(Boolean);
  return childrenArray.reduce((output, child, index) => {
    output.push(child);
    if (index < childrenArray.length - 1) {
      output.push(React31.cloneElement(separator, {
        key: `separator-${index}`
      }));
    }
    return output;
  }, []);
}
__name(joinChildren, "joinChildren");
var getSideFromDirection = /* @__PURE__ */ __name((direction) => {
  return {
    row: "Left",
    "row-reverse": "Right",
    column: "Top",
    "column-reverse": "Bottom"
  }[direction];
}, "getSideFromDirection");
var style3 = /* @__PURE__ */ __name(({
  ownerState,
  theme
}) => {
  let styles = _extends({
    display: "flex",
    flexDirection: "column"
  }, handleBreakpoints({
    theme
  }, resolveBreakpointValues({
    values: ownerState.direction,
    breakpoints: theme.breakpoints.values
  }), (propValue) => ({
    flexDirection: propValue
  })));
  if (ownerState.spacing) {
    const transformer = createUnarySpacing(theme);
    const base = Object.keys(theme.breakpoints.values).reduce((acc, breakpoint) => {
      if (typeof ownerState.spacing === "object" && ownerState.spacing[breakpoint] != null || typeof ownerState.direction === "object" && ownerState.direction[breakpoint] != null) {
        acc[breakpoint] = true;
      }
      return acc;
    }, {});
    const directionValues = resolveBreakpointValues({
      values: ownerState.direction,
      base
    });
    const spacingValues = resolveBreakpointValues({
      values: ownerState.spacing,
      base
    });
    if (typeof directionValues === "object") {
      Object.keys(directionValues).forEach((breakpoint, index, breakpoints) => {
        const directionValue = directionValues[breakpoint];
        if (!directionValue) {
          const previousDirectionValue = index > 0 ? directionValues[breakpoints[index - 1]] : "column";
          directionValues[breakpoint] = previousDirectionValue;
        }
      });
    }
    const styleFromPropValue = /* @__PURE__ */ __name((propValue, breakpoint) => {
      if (ownerState.useFlexGap) {
        return {
          gap: getValue(transformer, propValue)
        };
      }
      return {
        // The useFlexGap={false} implement relies on each child to give up control of the margin.
        // We need to reset the margin to avoid double spacing.
        "& > :not(style):not(style)": {
          margin: 0
        },
        "& > :not(style) ~ :not(style)": {
          [`margin${getSideFromDirection(breakpoint ? directionValues[breakpoint] : ownerState.direction)}`]: getValue(transformer, propValue)
        }
      };
    }, "styleFromPropValue");
    styles = deepmerge(styles, handleBreakpoints({
      theme
    }, spacingValues, styleFromPropValue));
  }
  styles = mergeBreakpointsInOrder(theme.breakpoints, styles);
  return styles;
}, "style");
function createStack(options = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent3,
    useThemeProps: useThemeProps2 = useThemePropsDefault3,
    componentName = "MuiStack"
  } = options;
  const useUtilityClasses2 = /* @__PURE__ */ __name(() => {
    const slots = {
      root: ["root"]
    };
    return composeClasses(slots, (slot) => generateUtilityClass(componentName, slot), {});
  }, "useUtilityClasses");
  const StackRoot = createStyledComponent(style3);
  const Stack2 = React31.forwardRef(/* @__PURE__ */ __name(function Grid2(inProps, ref) {
    const themeProps = useThemeProps2(inProps);
    const props = extendSxProp(themeProps);
    const {
      component = "div",
      direction = "column",
      spacing: spacing2 = 0,
      divider,
      children,
      className,
      useFlexGap = false
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded12);
    const ownerState = {
      direction,
      spacing: spacing2,
      useFlexGap
    };
    const classes = useUtilityClasses2();
    return (0, import_jsx_runtime14.jsx)(StackRoot, _extends({
      as: component,
      ownerState,
      ref,
      className: clsx_default(classes.root, className)
    }, other, {
      children: divider ? joinChildren(children, divider) : children
    }));
  }, "Grid"));
  true ? Stack2.propTypes = {
    children: import_prop_types19.default.node,
    direction: import_prop_types19.default.oneOfType([import_prop_types19.default.oneOf(["column-reverse", "column", "row-reverse", "row"]), import_prop_types19.default.arrayOf(import_prop_types19.default.oneOf(["column-reverse", "column", "row-reverse", "row"])), import_prop_types19.default.object]),
    divider: import_prop_types19.default.node,
    spacing: import_prop_types19.default.oneOfType([import_prop_types19.default.arrayOf(import_prop_types19.default.oneOfType([import_prop_types19.default.number, import_prop_types19.default.string])), import_prop_types19.default.number, import_prop_types19.default.object, import_prop_types19.default.string]),
    sx: import_prop_types19.default.oneOfType([import_prop_types19.default.arrayOf(import_prop_types19.default.oneOfType([import_prop_types19.default.func, import_prop_types19.default.object, import_prop_types19.default.bool])), import_prop_types19.default.func, import_prop_types19.default.object])
  } : void 0;
  return Stack2;
}
__name(createStack, "createStack");

// node_modules/@mui/system/esm/Stack/Stack.js
var Stack = createStack();
true ? Stack.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: import_prop_types20.default.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types20.default.elementType,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'column'
   */
  direction: import_prop_types20.default.oneOfType([import_prop_types20.default.oneOf(["column-reverse", "column", "row-reverse", "row"]), import_prop_types20.default.arrayOf(import_prop_types20.default.oneOf(["column-reverse", "column", "row-reverse", "row"])), import_prop_types20.default.object]),
  /**
   * Add an element between each child.
   */
  divider: import_prop_types20.default.node,
  /**
   * Defines the space between immediate children.
   * @default 0
   */
  spacing: import_prop_types20.default.oneOfType([import_prop_types20.default.arrayOf(import_prop_types20.default.oneOfType([import_prop_types20.default.number, import_prop_types20.default.string])), import_prop_types20.default.number, import_prop_types20.default.object, import_prop_types20.default.string]),
  /**
   * The system prop, which allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types20.default.oneOfType([import_prop_types20.default.arrayOf(import_prop_types20.default.oneOfType([import_prop_types20.default.func, import_prop_types20.default.object, import_prop_types20.default.bool])), import_prop_types20.default.func, import_prop_types20.default.object]),
  /**
   * If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
   *
   * While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
   * it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
   *
   * To enable this flag globally, follow the theme's default props configuration.
   * @default false
   */
  useFlexGap: import_prop_types20.default.bool
} : void 0;

// node_modules/@mui/system/esm/Stack/stackClasses.js
var stackClasses = generateUtilityClasses("MuiStack", ["root"]);

// node_modules/@mui/material/styles/createMixins.js
init_extends();
function createMixins(breakpoints, mixins) {
  return _extends({
    toolbar: {
      minHeight: 56,
      [breakpoints.up("xs")]: {
        "@media (orientation: landscape)": {
          minHeight: 48
        }
      },
      [breakpoints.up("sm")]: {
        minHeight: 64
      }
    }
  }, mixins);
}
__name(createMixins, "createMixins");

// node_modules/@mui/material/styles/createTypography.js
init_extends();
init_deepmerge2();
var _excluded13 = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}
__name(round, "round");
var caseAllCaps = {
  textTransform: "uppercase"
};
var defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
function createTypography(palette2, typography2) {
  const _ref = typeof typography2 === "function" ? typography2(palette2) : typography2, {
    fontFamily: fontFamily2 = defaultFontFamily,
    // The default font size of the Material Specification.
    fontSize: fontSize2 = 14,
    // px
    fontWeightLight = 300,
    fontWeightRegular = 400,
    fontWeightMedium = 500,
    fontWeightBold = 700,
    // Tell MUI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize = 16,
    // Apply the CSS properties to all the variants.
    allVariants,
    pxToRem: pxToRem2
  } = _ref, other = _objectWithoutPropertiesLoose(_ref, _excluded13);
  if (true) {
    if (typeof fontSize2 !== "number") {
      console.error("MUI: `fontSize` is required to be a number.");
    }
    if (typeof htmlFontSize !== "number") {
      console.error("MUI: `htmlFontSize` is required to be a number.");
    }
  }
  const coef = fontSize2 / 14;
  const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
  const buildVariant = /* @__PURE__ */ __name((fontWeight2, size, lineHeight2, letterSpacing2, casing) => _extends({
    fontFamily: fontFamily2,
    fontWeight: fontWeight2,
    fontSize: pxToRem(size),
    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
    lineHeight: lineHeight2
  }, fontFamily2 === defaultFontFamily ? {
    letterSpacing: `${round(letterSpacing2 / size)}em`
  } : {}, casing, allVariants), "buildVariant");
  const variants = {
    h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
    h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
    h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
    h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
    h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
    h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
    subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
    subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
    body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
    body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
    button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
    overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
    // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
    inherit: {
      fontFamily: "inherit",
      fontWeight: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit"
    }
  };
  return deepmerge(_extends({
    htmlFontSize,
    pxToRem,
    fontFamily: fontFamily2,
    fontSize: fontSize2,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold
  }, variants), other, {
    clone: false
    // No need to clone deep
  });
}
__name(createTypography, "createTypography");

// node_modules/@mui/material/styles/createTransitions.js
init_extends();
var _excluded14 = ["duration", "easing", "delay"];
var easing = {
  // This is the most common easing curve.
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
var duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}
__name(formatMs, "formatMs");
function getAutoHeightDuration(height2) {
  if (!height2) {
    return 0;
  }
  const constant = height2 / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
__name(getAutoHeightDuration, "getAutoHeightDuration");
function createTransitions(inputTransitions) {
  const mergedEasing = _extends({}, easing, inputTransitions.easing);
  const mergedDuration = _extends({}, duration, inputTransitions.duration);
  const create = /* @__PURE__ */ __name((props = ["all"], options = {}) => {
    const {
      duration: durationOption = mergedDuration.standard,
      easing: easingOption = mergedEasing.easeInOut,
      delay = 0
    } = options, other = _objectWithoutPropertiesLoose(options, _excluded14);
    if (true) {
      const isString = /* @__PURE__ */ __name((value) => typeof value === "string", "isString");
      const isNumber = /* @__PURE__ */ __name((value) => !isNaN(parseFloat(value)), "isNumber");
      if (!isString(props) && !Array.isArray(props)) {
        console.error('MUI: Argument "props" must be a string or Array.');
      }
      if (!isNumber(durationOption) && !isString(durationOption)) {
        console.error(`MUI: Argument "duration" must be a number or a string but found ${durationOption}.`);
      }
      if (!isString(easingOption)) {
        console.error('MUI: Argument "easing" must be a string.');
      }
      if (!isNumber(delay) && !isString(delay)) {
        console.error('MUI: Argument "delay" must be a number or a string.');
      }
      if (typeof options !== "object") {
        console.error(["MUI: Secong argument of transition.create must be an object.", "Arguments should be either `create('prop1', options)` or `create(['prop1', 'prop2'], options)`"].join("\n"));
      }
      if (Object.keys(other).length !== 0) {
        console.error(`MUI: Unrecognized argument(s) [${Object.keys(other).join(",")}].`);
      }
    }
    return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
  }, "create");
  return _extends({
    getAutoHeightDuration,
    create
  }, inputTransitions, {
    easing: mergedEasing,
    duration: mergedDuration
  });
}
__name(createTransitions, "createTransitions");

// node_modules/@mui/material/styles/createTheme.js
init_extends();
init_formatMuiErrorMessage2();
init_deepmerge2();

// node_modules/@mui/material/styles/createPalette.js
init_extends();
init_formatMuiErrorMessage2();
init_deepmerge2();
var import_colorManipulator = __toESM(require_colorManipulator());

// node_modules/@mui/material/colors/common.js
var common = {
  black: "#000",
  white: "#fff"
};
var common_default = common;

// node_modules/@mui/material/colors/grey.js
var grey = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};
var grey_default = grey;

// node_modules/@mui/material/colors/purple.js
var purple = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff"
};
var purple_default = purple;

// node_modules/@mui/material/colors/red.js
var red = {
  50: "#ffebee",
  100: "#ffcdd2",
  200: "#ef9a9a",
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  600: "#e53935",
  700: "#d32f2f",
  800: "#c62828",
  900: "#b71c1c",
  A100: "#ff8a80",
  A200: "#ff5252",
  A400: "#ff1744",
  A700: "#d50000"
};
var red_default = red;

// node_modules/@mui/material/colors/orange.js
var orange = {
  50: "#fff3e0",
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
  A100: "#ffd180",
  A200: "#ffab40",
  A400: "#ff9100",
  A700: "#ff6d00"
};
var orange_default = orange;

// node_modules/@mui/material/colors/blue.js
var blue = {
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
  A100: "#82b1ff",
  A200: "#448aff",
  A400: "#2979ff",
  A700: "#2962ff"
};
var blue_default = blue;

// node_modules/@mui/material/colors/lightBlue.js
var lightBlue = {
  50: "#e1f5fe",
  100: "#b3e5fc",
  200: "#81d4fa",
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  600: "#039be5",
  700: "#0288d1",
  800: "#0277bd",
  900: "#01579b",
  A100: "#80d8ff",
  A200: "#40c4ff",
  A400: "#00b0ff",
  A700: "#0091ea"
};
var lightBlue_default = lightBlue;

// node_modules/@mui/material/colors/green.js
var green = {
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
  A100: "#b9f6ca",
  A200: "#69f0ae",
  A400: "#00e676",
  A700: "#00c853"
};
var green_default = green;

// node_modules/@mui/material/styles/createPalette.js
var _excluded15 = ["mode", "contrastThreshold", "tonalOffset"];
var light = {
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: "rgba(0, 0, 0, 0.87)",
    // Secondary text.
    secondary: "rgba(0, 0, 0, 0.6)",
    // Disabled text have even lower visual prominence.
    disabled: "rgba(0, 0, 0, 0.38)"
  },
  // The color used to divide different elements.
  divider: "rgba(0, 0, 0, 0.12)",
  // The background colors used to style the surfaces.
  // Consistency between these values is important.
  background: {
    paper: common_default.white,
    default: common_default.white
  },
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: "rgba(0, 0, 0, 0.54)",
    // The color of an hovered action.
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    // The color of a selected action.
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    // The color of a disabled action.
    disabled: "rgba(0, 0, 0, 0.26)",
    // The background color of a disabled action.
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
};
var dark = {
  text: {
    primary: common_default.white,
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
    icon: "rgba(255, 255, 255, 0.5)"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#121212",
    default: "#121212"
  },
  action: {
    active: common_default.white,
    hover: "rgba(255, 255, 255, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255, 255, 255, 0.16)",
    selectedOpacity: 0.16,
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255, 255, 255, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
};
function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = tonalOffset.light || tonalOffset;
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === "light") {
      intent.light = (0, import_colorManipulator.lighten)(intent.main, tonalOffsetLight);
    } else if (direction === "dark") {
      intent.dark = (0, import_colorManipulator.darken)(intent.main, tonalOffsetDark);
    }
  }
}
__name(addLightOrDark, "addLightOrDark");
function getDefaultPrimary(mode = "light") {
  if (mode === "dark") {
    return {
      main: blue_default[200],
      light: blue_default[50],
      dark: blue_default[400]
    };
  }
  return {
    main: blue_default[700],
    light: blue_default[400],
    dark: blue_default[800]
  };
}
__name(getDefaultPrimary, "getDefaultPrimary");
function getDefaultSecondary(mode = "light") {
  if (mode === "dark") {
    return {
      main: purple_default[200],
      light: purple_default[50],
      dark: purple_default[400]
    };
  }
  return {
    main: purple_default[500],
    light: purple_default[300],
    dark: purple_default[700]
  };
}
__name(getDefaultSecondary, "getDefaultSecondary");
function getDefaultError(mode = "light") {
  if (mode === "dark") {
    return {
      main: red_default[500],
      light: red_default[300],
      dark: red_default[700]
    };
  }
  return {
    main: red_default[700],
    light: red_default[400],
    dark: red_default[800]
  };
}
__name(getDefaultError, "getDefaultError");
function getDefaultInfo(mode = "light") {
  if (mode === "dark") {
    return {
      main: lightBlue_default[400],
      light: lightBlue_default[300],
      dark: lightBlue_default[700]
    };
  }
  return {
    main: lightBlue_default[700],
    light: lightBlue_default[500],
    dark: lightBlue_default[900]
  };
}
__name(getDefaultInfo, "getDefaultInfo");
function getDefaultSuccess(mode = "light") {
  if (mode === "dark") {
    return {
      main: green_default[400],
      light: green_default[300],
      dark: green_default[700]
    };
  }
  return {
    main: green_default[800],
    light: green_default[500],
    dark: green_default[900]
  };
}
__name(getDefaultSuccess, "getDefaultSuccess");
function getDefaultWarning(mode = "light") {
  if (mode === "dark") {
    return {
      main: orange_default[400],
      light: orange_default[300],
      dark: orange_default[700]
    };
  }
  return {
    main: "#ed6c02",
    // closest to orange[800] that pass 3:1.
    light: orange_default[500],
    dark: orange_default[900]
  };
}
__name(getDefaultWarning, "getDefaultWarning");
function createPalette(palette2) {
  const {
    mode = "light",
    contrastThreshold = 3,
    tonalOffset = 0.2
  } = palette2, other = _objectWithoutPropertiesLoose(palette2, _excluded15);
  const primary = palette2.primary || getDefaultPrimary(mode);
  const secondary = palette2.secondary || getDefaultSecondary(mode);
  const error = palette2.error || getDefaultError(mode);
  const info = palette2.info || getDefaultInfo(mode);
  const success = palette2.success || getDefaultSuccess(mode);
  const warning = palette2.warning || getDefaultWarning(mode);
  function getContrastText(background) {
    const contrastText = (0, import_colorManipulator.getContrastRatio)(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
    if (true) {
      const contrast = (0, import_colorManipulator.getContrastRatio)(background, contrastText);
      if (contrast < 3) {
        console.error([`MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`, "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.", "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"].join("\n"));
      }
    }
    return contrastText;
  }
  __name(getContrastText, "getContrastText");
  const augmentColor = /* @__PURE__ */ __name(({
    color: color2,
    name,
    mainShade = 500,
    lightShade = 300,
    darkShade = 700
  }) => {
    color2 = _extends({}, color2);
    if (!color2.main && color2[mainShade]) {
      color2.main = color2[mainShade];
    }
    if (!color2.hasOwnProperty("main")) {
      throw new Error(true ? `MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${mainShade}\` property.` : formatMuiErrorMessage(11, name ? ` (${name})` : "", mainShade));
    }
    if (typeof color2.main !== "string") {
      throw new Error(true ? `MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(color2.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : formatMuiErrorMessage(12, name ? ` (${name})` : "", JSON.stringify(color2.main)));
    }
    addLightOrDark(color2, "light", lightShade, tonalOffset);
    addLightOrDark(color2, "dark", darkShade, tonalOffset);
    if (!color2.contrastText) {
      color2.contrastText = getContrastText(color2.main);
    }
    return color2;
  }, "augmentColor");
  const modes = {
    dark,
    light
  };
  if (true) {
    if (!modes[mode]) {
      console.error(`MUI: The palette mode \`${mode}\` is not supported.`);
    }
  }
  const paletteOutput = deepmerge(_extends({
    // A collection of common colors.
    common: _extends({}, common_default),
    // prevent mutable object.
    // The palette mode, can be light or dark.
    mode,
    // The colors used to represent primary interface elements for a user.
    primary: augmentColor({
      color: primary,
      name: "primary"
    }),
    // The colors used to represent secondary interface elements for a user.
    secondary: augmentColor({
      color: secondary,
      name: "secondary",
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    }),
    // The colors used to represent interface elements that the user should be made aware of.
    error: augmentColor({
      color: error,
      name: "error"
    }),
    // The colors used to represent potentially dangerous actions or important messages.
    warning: augmentColor({
      color: warning,
      name: "warning"
    }),
    // The colors used to present information to the user that is neutral and not necessarily important.
    info: augmentColor({
      color: info,
      name: "info"
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: augmentColor({
      color: success,
      name: "success"
    }),
    // The grey colors.
    grey: grey_default,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText,
    // Generate a rich color object.
    augmentColor,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset
  }, modes[mode]), other);
  return paletteOutput;
}
__name(createPalette, "createPalette");

// node_modules/@mui/material/styles/shadows.js
var shadowKeyUmbraOpacity = 0.2;
var shadowKeyPenumbraOpacity = 0.14;
var shadowAmbientShadowOpacity = 0.12;
function createShadow(...px) {
  return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
}
__name(createShadow, "createShadow");
var shadows = ["none", createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
var shadows_default2 = shadows;

// node_modules/@mui/material/styles/zIndex.js
var zIndex2 = {
  mobileStepper: 1e3,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};
var zIndex_default = zIndex2;

// node_modules/@mui/material/styles/createTheme.js
var _excluded16 = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
function createTheme2(options = {}, ...args) {
  const {
    mixins: mixinsInput = {},
    palette: paletteInput = {},
    transitions: transitionsInput = {},
    typography: typographyInput = {}
  } = options, other = _objectWithoutPropertiesLoose(options, _excluded16);
  if (options.vars && // The error should throw only for the root theme creation because user is not allowed to use a custom node `vars`.
  // `generateCssVars` is the closest identifier for checking that the `options` is a result of `extendTheme` with CSS variables so that user can create new theme for nested ThemeProvider.
  options.generateCssVars === void 0) {
    throw new Error(true ? `MUI: \`vars\` is a private field used for CSS variables support.
Please use another name.` : formatMuiErrorMessage(18));
  }
  const palette2 = createPalette(paletteInput);
  const systemTheme = createTheme_default(options);
  let muiTheme = deepmerge(systemTheme, {
    mixins: createMixins(systemTheme.breakpoints, mixinsInput),
    palette: palette2,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: shadows_default2.slice(),
    typography: createTypography(palette2, typographyInput),
    transitions: createTransitions(transitionsInput),
    zIndex: _extends({}, zIndex_default)
  });
  muiTheme = deepmerge(muiTheme, other);
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
  if (true) {
    const stateClasses = ["active", "checked", "completed", "disabled", "error", "expanded", "focused", "focusVisible", "required", "selected"];
    const traverse = /* @__PURE__ */ __name((node, component) => {
      let key;
      for (key in node) {
        const child = node[key];
        if (stateClasses.indexOf(key) !== -1 && Object.keys(child).length > 0) {
          if (true) {
            const stateClass = generateUtilityClass("", key);
            console.error([`MUI: The \`${component}\` component increases the CSS specificity of the \`${key}\` internal state.`, "You can not override it like this: ", JSON.stringify(node, null, 2), "", `Instead, you need to use the '&.${stateClass}' syntax:`, JSON.stringify({
              root: {
                [`&.${stateClass}`]: child
              }
            }, null, 2), "", "https://mui.com/r/state-classes-guide"].join("\n"));
          }
          node[key] = {};
        }
      }
    }, "traverse");
    Object.keys(muiTheme.components).forEach((component) => {
      const styleOverrides = muiTheme.components[component].styleOverrides;
      if (styleOverrides && component.indexOf("Mui") === 0) {
        traverse(styleOverrides, component);
      }
    });
  }
  muiTheme.unstable_sxConfig = _extends({}, defaultSxConfig_default, other == null ? void 0 : other.unstable_sxConfig);
  muiTheme.unstable_sx = /* @__PURE__ */ __name(function sx(props) {
    return styleFunctionSx_default({
      sx: props,
      theme: this
    });
  }, "sx");
  return muiTheme;
}
__name(createTheme2, "createTheme");
var warnedOnce = false;
function createMuiTheme(...args) {
  if (true) {
    if (!warnedOnce) {
      warnedOnce = true;
      console.error(["MUI: the createMuiTheme function was renamed to createTheme.", "", "You should use `import { createTheme } from '@mui/material/styles'`"].join("\n"));
    }
  }
  return createTheme2(...args);
}
__name(createMuiTheme, "createMuiTheme");
var createTheme_default2 = createTheme2;

// node_modules/@mui/material/styles/defaultTheme.js
var defaultTheme4 = createTheme_default2();
var defaultTheme_default = defaultTheme4;

export {
  common_default,
  red_default,
  purple_default,
  blue_default,
  lightBlue_default,
  green_default,
  orange_default,
  grey_default,
  init_formatMuiErrorMessage2 as init_formatMuiErrorMessage,
  identifier_default,
  StyledEngineProvider,
  styled_engine_exports,
  init_styled_engine,
  deepmerge,
  deepmerge_exports,
  init_deepmerge2 as init_deepmerge,
  createBreakpoints,
  handleBreakpoints,
  resolveBreakpointValues,
  capitalize,
  capitalize_exports,
  init_capitalize2 as init_capitalize,
  getPath,
  createSpacing,
  defaultSxConfig_default,
  styleFunctionSx_default,
  useTheme_default,
  GlobalStyles_default,
  extendSxProp,
  ClassNameGenerator_default,
  createBox,
  generateUtilityClass,
  generateUtilityClasses,
  require_react_is,
  getDisplayName,
  getDisplayName_exports,
  init_getDisplayName2 as init_getDisplayName,
  resolveProps,
  getThemeProps,
  useThemeProps,
  useEnhancedEffect_default,
  useMediaQuery,
  clamp_default,
  init_clamp2 as init_clamp,
  hexToRgb,
  decomposeColor,
  recomposeColor,
  rgbToHex,
  hslToRgb,
  getLuminance,
  getContrastRatio,
  alpha,
  darken,
  lighten,
  emphasize,
  chainPropTypes,
  elementAcceptingRef_default,
  elementTypeAcceptingRef_default,
  exactProp,
  HTMLElementType,
  refType_default,
  createChainedFunction,
  debounce,
  deprecatedPropType,
  isMuiElement,
  ownerDocument,
  ownerWindow,
  requirePropFactory,
  setRef,
  useId,
  unsupportedProp,
  useControlled,
  useEventCallback_default,
  useForkRef,
  Timeout,
  useTimeout,
  useIsFocusVisible,
  getScrollbarSize,
  detectScrollType,
  getNormalizedScrollLeft,
  usePreviousProps_default,
  getValidReactChildren,
  visuallyHidden_default,
  integerPropType_default,
  composeClasses,
  isHostComponent_default,
  appendOwnerState_default,
  extractEventHandlers_default,
  mergeSlotProps_default,
  resolveComponentProps_default,
  useSlotProps_default,
  getReactElementRef,
  useRtl,
  useDefaultProps,
  DefaultPropsProvider_default,
  ThemeProvider_default2 as ThemeProvider_default,
  createCssVarsProvider,
  createGetCssVar,
  prepareCssVars_default,
  createContainer,
  createGrid,
  createStack,
  createMixins,
  require_interopRequireDefault,
  require_colorManipulator,
  createTypography,
  easing,
  duration,
  createMuiTheme,
  createTheme_default2 as createTheme_default,
  defaultTheme_default
};
/*! Bundled license information:

@mui/styled-engine/index.js:
  (**
   * @mui/styled-engine v5.16.14
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-is/cjs/react-is.development.js:
  (**
   * @license React
   * react-is.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@mui/private-theming/index.js:
  (**
   * @mui/private-theming v5.17.1
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=chunk-WKHFTNGW.js.map
