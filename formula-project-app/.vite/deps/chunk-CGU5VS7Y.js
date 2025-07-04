import {
  ThemeProvider_default,
  capitalize_exports,
  createBreakpoints,
  createCssVarsProvider,
  createGetCssVar,
  createSpacing,
  createTheme_default,
  createTypography,
  deepmerge,
  deepmerge_exports,
  defaultSxConfig_default,
  defaultTheme_default,
  getDisplayName_exports,
  identifier_default,
  init_capitalize,
  init_deepmerge,
  init_formatMuiErrorMessage,
  init_getDisplayName,
  init_styled_engine,
  prepareCssVars_default,
  require_colorManipulator,
  require_interopRequireDefault,
  styleFunctionSx_default,
  styled_engine_exports,
  useThemeProps,
  useTheme_default
} from "./chunk-WKHFTNGW.js";
import {
  require_jsx_runtime
} from "./chunk-EI6MR3JK.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-7QXRRMHH.js";
import {
  require_prop_types
} from "./chunk-YQBFPE75.js";
import {
  _extends,
  init_extends
} from "./chunk-DLEOTRWY.js";
import {
  require_react
} from "./chunk-LK4O2NHZ.js";
import {
  __commonJS,
  __name,
  __toCommonJS,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/@babel/runtime/helpers/extends.js
var require_extends = __commonJS({
  "node_modules/@babel/runtime/helpers/extends.js"(exports, module) {
    function _extends2() {
      return module.exports = _extends2 = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends2.apply(null, arguments);
    }
    __name(_extends2, "_extends");
    module.exports = _extends2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js
var require_objectWithoutPropertiesLoose = __commonJS({
  "node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"(exports, module) {
    function _objectWithoutPropertiesLoose2(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    __name(_objectWithoutPropertiesLoose2, "_objectWithoutPropertiesLoose");
    module.exports = _objectWithoutPropertiesLoose2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@mui/system/createTheme/createBreakpoints.js
var require_createBreakpoints = __commonJS({
  "node_modules/@mui/system/createTheme/createBreakpoints.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.breakpointKeys = void 0;
    exports.default = createBreakpoints2;
    var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require_objectWithoutPropertiesLoose());
    var _extends2 = _interopRequireDefault(require_extends());
    var _excluded5 = ["values", "unit", "step"];
    var breakpointKeys = exports.breakpointKeys = ["xs", "sm", "md", "lg", "xl"];
    var sortBreakpointsValues = /* @__PURE__ */ __name((values) => {
      const breakpointsAsArray = Object.keys(values).map((key) => ({
        key,
        val: values[key]
      })) || [];
      breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
      return breakpointsAsArray.reduce((acc, obj) => {
        return (0, _extends2.default)({}, acc, {
          [obj.key]: obj.val
        });
      }, {});
    }, "sortBreakpointsValues");
    function createBreakpoints2(breakpoints) {
      const {
        // The breakpoint **start** at this value.
        // For instance with the first breakpoint xs: [xs, sm).
        values = {
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
      } = breakpoints, other = (0, _objectWithoutPropertiesLoose2.default)(breakpoints, _excluded5);
      const sortedValues = sortBreakpointsValues(values);
      const keys = Object.keys(sortedValues);
      function up(key) {
        const value = typeof values[key] === "number" ? values[key] : key;
        return `@media (min-width:${value}${unit})`;
      }
      __name(up, "up");
      function down(key) {
        const value = typeof values[key] === "number" ? values[key] : key;
        return `@media (max-width:${value - step / 100}${unit})`;
      }
      __name(down, "down");
      function between(start, end) {
        const endIndex = keys.indexOf(end);
        return `@media (min-width:${typeof values[start] === "number" ? values[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values[keys[endIndex]] === "number" ? values[keys[endIndex]] : end) - step / 100}${unit})`;
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
      return (0, _extends2.default)({
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
    __name(createBreakpoints2, "createBreakpoints");
  }
});

// node_modules/@mui/system/createTheme/shape.js
var require_shape = __commonJS({
  "node_modules/@mui/system/createTheme/shape.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var shape = {
      borderRadius: 4
    };
    var _default = exports.default = shape;
  }
});

// node_modules/@mui/system/responsivePropType.js
var require_responsivePropType = __commonJS({
  "node_modules/@mui/system/responsivePropType.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _propTypes = _interopRequireDefault(require_prop_types());
    var responsivePropType = true ? _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.object, _propTypes.default.array]) : {};
    var _default = exports.default = responsivePropType;
  }
});

// node_modules/@mui/system/merge.js
var require_merge = __commonJS({
  "node_modules/@mui/system/merge.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _deepmerge = _interopRequireDefault((init_deepmerge(), __toCommonJS(deepmerge_exports)));
    function merge(acc, item) {
      if (!item) {
        return acc;
      }
      return (0, _deepmerge.default)(acc, item, {
        clone: false
        // No need to clone deep, it's way faster.
      });
    }
    __name(merge, "merge");
    var _default = exports.default = merge;
  }
});

// node_modules/@mui/system/breakpoints.js
var require_breakpoints = __commonJS({
  "node_modules/@mui/system/breakpoints.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.computeBreakpointsBase = computeBreakpointsBase;
    exports.createEmptyBreakpointObject = createEmptyBreakpointObject;
    exports.default = void 0;
    exports.handleBreakpoints = handleBreakpoints;
    exports.mergeBreakpointsInOrder = mergeBreakpointsInOrder;
    exports.removeUnusedBreakpoints = removeUnusedBreakpoints;
    exports.resolveBreakpointValues = resolveBreakpointValues;
    exports.values = void 0;
    var _extends2 = _interopRequireDefault(require_extends());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _deepmerge = _interopRequireDefault((init_deepmerge(), __toCommonJS(deepmerge_exports)));
    var _merge = _interopRequireDefault(require_merge());
    var values = exports.values = {
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
    function breakpoints(styleFunction) {
      const newStyleFunction = /* @__PURE__ */ __name((props) => {
        const theme = props.theme || {};
        const base = styleFunction(props);
        const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
        const extended = themeBreakpoints.keys.reduce((acc, key) => {
          if (props[key]) {
            acc = acc || {};
            acc[themeBreakpoints.up(key)] = styleFunction((0, _extends2.default)({
              theme
            }, props[key]));
          }
          return acc;
        }, null);
        return (0, _merge.default)(base, extended);
      }, "newStyleFunction");
      newStyleFunction.propTypes = true ? (0, _extends2.default)({}, styleFunction.propTypes, {
        xs: _propTypes.default.object,
        sm: _propTypes.default.object,
        md: _propTypes.default.object,
        lg: _propTypes.default.object,
        xl: _propTypes.default.object
      }) : {};
      newStyleFunction.filterProps = ["xs", "sm", "md", "lg", "xl", ...styleFunction.filterProps];
      return newStyleFunction;
    }
    __name(breakpoints, "breakpoints");
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
    function removeUnusedBreakpoints(breakpointKeys, style) {
      return breakpointKeys.reduce((acc, key) => {
        const breakpointOutput = acc[key];
        const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
        if (isBreakpointUnused) {
          delete acc[key];
        }
        return acc;
      }, style);
    }
    __name(removeUnusedBreakpoints, "removeUnusedBreakpoints");
    function mergeBreakpointsInOrder(breakpointsInput, ...styles) {
      const emptyBreakpoints = createEmptyBreakpointObject(breakpointsInput);
      const mergedOutput = [emptyBreakpoints, ...styles].reduce((prev, next) => (0, _deepmerge.default)(prev, next), {});
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
    var _default = exports.default = breakpoints;
  }
});

// node_modules/@mui/system/style.js
var require_style = __commonJS({
  "node_modules/@mui/system/style.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    exports.getPath = getPath;
    exports.getStyleValue = getStyleValue;
    var _capitalize = _interopRequireDefault((init_capitalize(), __toCommonJS(capitalize_exports)));
    var _responsivePropType = _interopRequireDefault(require_responsivePropType());
    var _breakpoints = require_breakpoints();
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
            value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : (0, _capitalize.default)(propValueFinal)}`, propValueFinal);
          }
          if (cssProperty === false) {
            return value;
          }
          return {
            [cssProperty]: value
          };
        }, "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, propValue, styleFromPropValue);
      }, "fn");
      fn.propTypes = true ? {
        [prop]: _responsivePropType.default
      } : {};
      fn.filterProps = [prop];
      return fn;
    }
    __name(style, "style");
    var _default = exports.default = style;
  }
});

// node_modules/@mui/system/memoize.js
var require_memoize = __commonJS({
  "node_modules/@mui/system/memoize.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = memoize;
    function memoize(fn) {
      const cache = {};
      return (arg) => {
        if (cache[arg] === void 0) {
          cache[arg] = fn(arg);
        }
        return cache[arg];
      };
    }
    __name(memoize, "memoize");
  }
});

// node_modules/@mui/system/spacing.js
var require_spacing = __commonJS({
  "node_modules/@mui/system/spacing.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createUnarySpacing = createUnarySpacing;
    exports.createUnaryUnit = createUnaryUnit;
    exports.default = void 0;
    exports.getStyleFromPropValue = getStyleFromPropValue;
    exports.getValue = getValue;
    exports.margin = margin;
    exports.marginKeys = void 0;
    exports.padding = padding;
    exports.paddingKeys = void 0;
    var _responsivePropType = _interopRequireDefault(require_responsivePropType());
    var _breakpoints = require_breakpoints();
    var _style = require_style();
    var _merge = _interopRequireDefault(require_merge());
    var _memoize = _interopRequireDefault(require_memoize());
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
    var getCssProperties = (0, _memoize.default)((prop) => {
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
    var marginKeys = exports.marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
    var paddingKeys = exports.paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
    var spacingKeys = [...marginKeys, ...paddingKeys];
    function createUnaryUnit(theme, themeKey, defaultValue, propName) {
      var _getPath;
      const themeSpacing = (_getPath = (0, _style.getPath)(theme, themeKey, false)) != null ? _getPath : defaultValue;
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
      return (0, _breakpoints.handleBreakpoints)(props, propValue, styleFromPropValue);
    }
    __name(resolveCssProperty, "resolveCssProperty");
    function style(props, keys) {
      const transformer = createUnarySpacing(props.theme);
      return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(_merge.default, {});
    }
    __name(style, "style");
    function margin(props) {
      return style(props, marginKeys);
    }
    __name(margin, "margin");
    margin.propTypes = true ? marginKeys.reduce((obj, key) => {
      obj[key] = _responsivePropType.default;
      return obj;
    }, {}) : {};
    margin.filterProps = marginKeys;
    function padding(props) {
      return style(props, paddingKeys);
    }
    __name(padding, "padding");
    padding.propTypes = true ? paddingKeys.reduce((obj, key) => {
      obj[key] = _responsivePropType.default;
      return obj;
    }, {}) : {};
    padding.filterProps = paddingKeys;
    function spacing(props) {
      return style(props, spacingKeys);
    }
    __name(spacing, "spacing");
    spacing.propTypes = true ? spacingKeys.reduce((obj, key) => {
      obj[key] = _responsivePropType.default;
      return obj;
    }, {}) : {};
    spacing.filterProps = spacingKeys;
    var _default = exports.default = spacing;
  }
});

// node_modules/@mui/system/createTheme/createSpacing.js
var require_createSpacing = __commonJS({
  "node_modules/@mui/system/createTheme/createSpacing.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = createSpacing2;
    var _spacing = require_spacing();
    function createSpacing2(spacingInput = 8) {
      if (spacingInput.mui) {
        return spacingInput;
      }
      const transform = (0, _spacing.createUnarySpacing)({
        spacing: spacingInput
      });
      const spacing = /* @__PURE__ */ __name((...argsInput) => {
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
      spacing.mui = true;
      return spacing;
    }
    __name(createSpacing2, "createSpacing");
  }
});

// node_modules/@mui/system/compose.js
var require_compose = __commonJS({
  "node_modules/@mui/system/compose.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _merge = _interopRequireDefault(require_merge());
    function compose(...styles) {
      const handlers = styles.reduce((acc, style) => {
        style.filterProps.forEach((prop) => {
          acc[prop] = style;
        });
        return acc;
      }, {});
      const fn = /* @__PURE__ */ __name((props) => {
        return Object.keys(props).reduce((acc, prop) => {
          if (handlers[prop]) {
            return (0, _merge.default)(acc, handlers[prop](props));
          }
          return acc;
        }, {});
      }, "fn");
      fn.propTypes = true ? styles.reduce((acc, style) => Object.assign(acc, style.propTypes), {}) : {};
      fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);
      return fn;
    }
    __name(compose, "compose");
    var _default = exports.default = compose;
  }
});

// node_modules/@mui/system/borders.js
var require_borders = __commonJS({
  "node_modules/@mui/system/borders.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.borderTopColor = exports.borderTop = exports.borderRightColor = exports.borderRight = exports.borderRadius = exports.borderLeftColor = exports.borderLeft = exports.borderColor = exports.borderBottomColor = exports.borderBottom = exports.border = void 0;
    exports.borderTransform = borderTransform;
    exports.outlineColor = exports.outline = exports.default = void 0;
    var _responsivePropType = _interopRequireDefault(require_responsivePropType());
    var _style = _interopRequireDefault(require_style());
    var _compose = _interopRequireDefault(require_compose());
    var _spacing = require_spacing();
    var _breakpoints = require_breakpoints();
    function borderTransform(value) {
      if (typeof value !== "number") {
        return value;
      }
      return `${value}px solid`;
    }
    __name(borderTransform, "borderTransform");
    function createBorderStyle(prop, transform) {
      return (0, _style.default)({
        prop,
        themeKey: "borders",
        transform
      });
    }
    __name(createBorderStyle, "createBorderStyle");
    var border = exports.border = createBorderStyle("border", borderTransform);
    var borderTop = exports.borderTop = createBorderStyle("borderTop", borderTransform);
    var borderRight = exports.borderRight = createBorderStyle("borderRight", borderTransform);
    var borderBottom = exports.borderBottom = createBorderStyle("borderBottom", borderTransform);
    var borderLeft = exports.borderLeft = createBorderStyle("borderLeft", borderTransform);
    var borderColor = exports.borderColor = createBorderStyle("borderColor");
    var borderTopColor = exports.borderTopColor = createBorderStyle("borderTopColor");
    var borderRightColor = exports.borderRightColor = createBorderStyle("borderRightColor");
    var borderBottomColor = exports.borderBottomColor = createBorderStyle("borderBottomColor");
    var borderLeftColor = exports.borderLeftColor = createBorderStyle("borderLeftColor");
    var outline = exports.outline = createBorderStyle("outline", borderTransform);
    var outlineColor = exports.outlineColor = createBorderStyle("outlineColor");
    var borderRadius = /* @__PURE__ */ __name((props) => {
      if (props.borderRadius !== void 0 && props.borderRadius !== null) {
        const transformer = (0, _spacing.createUnaryUnit)(props.theme, "shape.borderRadius", 4, "borderRadius");
        const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
          borderRadius: (0, _spacing.getValue)(transformer, propValue)
        }), "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, props.borderRadius, styleFromPropValue);
      }
      return null;
    }, "borderRadius");
    exports.borderRadius = borderRadius;
    borderRadius.propTypes = true ? {
      borderRadius: _responsivePropType.default
    } : {};
    borderRadius.filterProps = ["borderRadius"];
    var borders = (0, _compose.default)(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
    var _default = exports.default = borders;
  }
});

// node_modules/@mui/system/cssGrid.js
var require_cssGrid = __commonJS({
  "node_modules/@mui/system/cssGrid.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.rowGap = exports.gridTemplateRows = exports.gridTemplateColumns = exports.gridTemplateAreas = exports.gridRow = exports.gridColumn = exports.gridAutoRows = exports.gridAutoFlow = exports.gridAutoColumns = exports.gridArea = exports.gap = exports.default = exports.columnGap = void 0;
    var _style = _interopRequireDefault(require_style());
    var _compose = _interopRequireDefault(require_compose());
    var _spacing = require_spacing();
    var _breakpoints = require_breakpoints();
    var _responsivePropType = _interopRequireDefault(require_responsivePropType());
    var gap = /* @__PURE__ */ __name((props) => {
      if (props.gap !== void 0 && props.gap !== null) {
        const transformer = (0, _spacing.createUnaryUnit)(props.theme, "spacing", 8, "gap");
        const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
          gap: (0, _spacing.getValue)(transformer, propValue)
        }), "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, props.gap, styleFromPropValue);
      }
      return null;
    }, "gap");
    exports.gap = gap;
    gap.propTypes = true ? {
      gap: _responsivePropType.default
    } : {};
    gap.filterProps = ["gap"];
    var columnGap = /* @__PURE__ */ __name((props) => {
      if (props.columnGap !== void 0 && props.columnGap !== null) {
        const transformer = (0, _spacing.createUnaryUnit)(props.theme, "spacing", 8, "columnGap");
        const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
          columnGap: (0, _spacing.getValue)(transformer, propValue)
        }), "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, props.columnGap, styleFromPropValue);
      }
      return null;
    }, "columnGap");
    exports.columnGap = columnGap;
    columnGap.propTypes = true ? {
      columnGap: _responsivePropType.default
    } : {};
    columnGap.filterProps = ["columnGap"];
    var rowGap = /* @__PURE__ */ __name((props) => {
      if (props.rowGap !== void 0 && props.rowGap !== null) {
        const transformer = (0, _spacing.createUnaryUnit)(props.theme, "spacing", 8, "rowGap");
        const styleFromPropValue = /* @__PURE__ */ __name((propValue) => ({
          rowGap: (0, _spacing.getValue)(transformer, propValue)
        }), "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, props.rowGap, styleFromPropValue);
      }
      return null;
    }, "rowGap");
    exports.rowGap = rowGap;
    rowGap.propTypes = true ? {
      rowGap: _responsivePropType.default
    } : {};
    rowGap.filterProps = ["rowGap"];
    var gridColumn = exports.gridColumn = (0, _style.default)({
      prop: "gridColumn"
    });
    var gridRow = exports.gridRow = (0, _style.default)({
      prop: "gridRow"
    });
    var gridAutoFlow = exports.gridAutoFlow = (0, _style.default)({
      prop: "gridAutoFlow"
    });
    var gridAutoColumns = exports.gridAutoColumns = (0, _style.default)({
      prop: "gridAutoColumns"
    });
    var gridAutoRows = exports.gridAutoRows = (0, _style.default)({
      prop: "gridAutoRows"
    });
    var gridTemplateColumns = exports.gridTemplateColumns = (0, _style.default)({
      prop: "gridTemplateColumns"
    });
    var gridTemplateRows = exports.gridTemplateRows = (0, _style.default)({
      prop: "gridTemplateRows"
    });
    var gridTemplateAreas = exports.gridTemplateAreas = (0, _style.default)({
      prop: "gridTemplateAreas"
    });
    var gridArea = exports.gridArea = (0, _style.default)({
      prop: "gridArea"
    });
    var grid = (0, _compose.default)(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
    var _default = exports.default = grid;
  }
});

// node_modules/@mui/system/palette.js
var require_palette = __commonJS({
  "node_modules/@mui/system/palette.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = exports.color = exports.bgcolor = exports.backgroundColor = void 0;
    exports.paletteTransform = paletteTransform;
    var _style = _interopRequireDefault(require_style());
    var _compose = _interopRequireDefault(require_compose());
    function paletteTransform(value, userValue) {
      if (userValue === "grey") {
        return userValue;
      }
      return value;
    }
    __name(paletteTransform, "paletteTransform");
    var color = exports.color = (0, _style.default)({
      prop: "color",
      themeKey: "palette",
      transform: paletteTransform
    });
    var bgcolor = exports.bgcolor = (0, _style.default)({
      prop: "bgcolor",
      cssProperty: "backgroundColor",
      themeKey: "palette",
      transform: paletteTransform
    });
    var backgroundColor = exports.backgroundColor = (0, _style.default)({
      prop: "backgroundColor",
      themeKey: "palette",
      transform: paletteTransform
    });
    var palette = (0, _compose.default)(color, bgcolor, backgroundColor);
    var _default = exports.default = palette;
  }
});

// node_modules/@mui/system/sizing.js
var require_sizing = __commonJS({
  "node_modules/@mui/system/sizing.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.sizeWidth = exports.sizeHeight = exports.minWidth = exports.minHeight = exports.maxWidth = exports.maxHeight = exports.height = exports.default = exports.boxSizing = void 0;
    exports.sizingTransform = sizingTransform;
    exports.width = void 0;
    var _style = _interopRequireDefault(require_style());
    var _compose = _interopRequireDefault(require_compose());
    var _breakpoints = require_breakpoints();
    function sizingTransform(value) {
      return value <= 1 && value !== 0 ? `${value * 100}%` : value;
    }
    __name(sizingTransform, "sizingTransform");
    var width = exports.width = (0, _style.default)({
      prop: "width",
      transform: sizingTransform
    });
    var maxWidth = /* @__PURE__ */ __name((props) => {
      if (props.maxWidth !== void 0 && props.maxWidth !== null) {
        const styleFromPropValue = /* @__PURE__ */ __name((propValue) => {
          var _props$theme, _props$theme2;
          const breakpoint = ((_props$theme = props.theme) == null || (_props$theme = _props$theme.breakpoints) == null || (_props$theme = _props$theme.values) == null ? void 0 : _props$theme[propValue]) || _breakpoints.values[propValue];
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
        return (0, _breakpoints.handleBreakpoints)(props, props.maxWidth, styleFromPropValue);
      }
      return null;
    }, "maxWidth");
    exports.maxWidth = maxWidth;
    maxWidth.filterProps = ["maxWidth"];
    var minWidth = exports.minWidth = (0, _style.default)({
      prop: "minWidth",
      transform: sizingTransform
    });
    var height = exports.height = (0, _style.default)({
      prop: "height",
      transform: sizingTransform
    });
    var maxHeight = exports.maxHeight = (0, _style.default)({
      prop: "maxHeight",
      transform: sizingTransform
    });
    var minHeight = exports.minHeight = (0, _style.default)({
      prop: "minHeight",
      transform: sizingTransform
    });
    var sizeWidth = exports.sizeWidth = (0, _style.default)({
      prop: "size",
      cssProperty: "width",
      transform: sizingTransform
    });
    var sizeHeight = exports.sizeHeight = (0, _style.default)({
      prop: "size",
      cssProperty: "height",
      transform: sizingTransform
    });
    var boxSizing = exports.boxSizing = (0, _style.default)({
      prop: "boxSizing"
    });
    var sizing = (0, _compose.default)(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
    var _default = exports.default = sizing;
  }
});

// node_modules/@mui/system/styleFunctionSx/defaultSxConfig.js
var require_defaultSxConfig = __commonJS({
  "node_modules/@mui/system/styleFunctionSx/defaultSxConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _spacing = require_spacing();
    var _borders = require_borders();
    var _cssGrid = require_cssGrid();
    var _palette = require_palette();
    var _sizing = require_sizing();
    var defaultSxConfig = {
      // borders
      border: {
        themeKey: "borders",
        transform: _borders.borderTransform
      },
      borderTop: {
        themeKey: "borders",
        transform: _borders.borderTransform
      },
      borderRight: {
        themeKey: "borders",
        transform: _borders.borderTransform
      },
      borderBottom: {
        themeKey: "borders",
        transform: _borders.borderTransform
      },
      borderLeft: {
        themeKey: "borders",
        transform: _borders.borderTransform
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
        transform: _borders.borderTransform
      },
      outlineColor: {
        themeKey: "palette"
      },
      borderRadius: {
        themeKey: "shape.borderRadius",
        style: _borders.borderRadius
      },
      // palette
      color: {
        themeKey: "palette",
        transform: _palette.paletteTransform
      },
      bgcolor: {
        themeKey: "palette",
        cssProperty: "backgroundColor",
        transform: _palette.paletteTransform
      },
      backgroundColor: {
        themeKey: "palette",
        transform: _palette.paletteTransform
      },
      // spacing
      p: {
        style: _spacing.padding
      },
      pt: {
        style: _spacing.padding
      },
      pr: {
        style: _spacing.padding
      },
      pb: {
        style: _spacing.padding
      },
      pl: {
        style: _spacing.padding
      },
      px: {
        style: _spacing.padding
      },
      py: {
        style: _spacing.padding
      },
      padding: {
        style: _spacing.padding
      },
      paddingTop: {
        style: _spacing.padding
      },
      paddingRight: {
        style: _spacing.padding
      },
      paddingBottom: {
        style: _spacing.padding
      },
      paddingLeft: {
        style: _spacing.padding
      },
      paddingX: {
        style: _spacing.padding
      },
      paddingY: {
        style: _spacing.padding
      },
      paddingInline: {
        style: _spacing.padding
      },
      paddingInlineStart: {
        style: _spacing.padding
      },
      paddingInlineEnd: {
        style: _spacing.padding
      },
      paddingBlock: {
        style: _spacing.padding
      },
      paddingBlockStart: {
        style: _spacing.padding
      },
      paddingBlockEnd: {
        style: _spacing.padding
      },
      m: {
        style: _spacing.margin
      },
      mt: {
        style: _spacing.margin
      },
      mr: {
        style: _spacing.margin
      },
      mb: {
        style: _spacing.margin
      },
      ml: {
        style: _spacing.margin
      },
      mx: {
        style: _spacing.margin
      },
      my: {
        style: _spacing.margin
      },
      margin: {
        style: _spacing.margin
      },
      marginTop: {
        style: _spacing.margin
      },
      marginRight: {
        style: _spacing.margin
      },
      marginBottom: {
        style: _spacing.margin
      },
      marginLeft: {
        style: _spacing.margin
      },
      marginX: {
        style: _spacing.margin
      },
      marginY: {
        style: _spacing.margin
      },
      marginInline: {
        style: _spacing.margin
      },
      marginInlineStart: {
        style: _spacing.margin
      },
      marginInlineEnd: {
        style: _spacing.margin
      },
      marginBlock: {
        style: _spacing.margin
      },
      marginBlockStart: {
        style: _spacing.margin
      },
      marginBlockEnd: {
        style: _spacing.margin
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
        style: _cssGrid.gap
      },
      rowGap: {
        style: _cssGrid.rowGap
      },
      columnGap: {
        style: _cssGrid.columnGap
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
        transform: _sizing.sizingTransform
      },
      maxWidth: {
        style: _sizing.maxWidth
      },
      minWidth: {
        transform: _sizing.sizingTransform
      },
      height: {
        transform: _sizing.sizingTransform
      },
      maxHeight: {
        transform: _sizing.sizingTransform
      },
      minHeight: {
        transform: _sizing.sizingTransform
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
    var _default = exports.default = defaultSxConfig;
  }
});

// node_modules/@mui/system/styleFunctionSx/styleFunctionSx.js
var require_styleFunctionSx = __commonJS({
  "node_modules/@mui/system/styleFunctionSx/styleFunctionSx.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    exports.unstable_createStyleFunctionSx = unstable_createStyleFunctionSx;
    var _capitalize = _interopRequireDefault((init_capitalize(), __toCommonJS(capitalize_exports)));
    var _merge = _interopRequireDefault(require_merge());
    var _style = require_style();
    var _breakpoints = require_breakpoints();
    var _defaultSxConfig = _interopRequireDefault(require_defaultSxConfig());
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
          style
        } = options;
        if (val == null) {
          return null;
        }
        if (themeKey === "typography" && val === "inherit") {
          return {
            [prop]: val
          };
        }
        const themeMapping = (0, _style.getPath)(theme, themeKey) || {};
        if (style) {
          return style(props);
        }
        const styleFromPropValue = /* @__PURE__ */ __name((propValueFinal) => {
          let value = (0, _style.getStyleValue)(themeMapping, transform, propValueFinal);
          if (propValueFinal === value && typeof propValueFinal === "string") {
            value = (0, _style.getStyleValue)(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : (0, _capitalize.default)(propValueFinal)}`, propValueFinal);
          }
          if (cssProperty === false) {
            return value;
          }
          return {
            [cssProperty]: value
          };
        }, "styleFromPropValue");
        return (0, _breakpoints.handleBreakpoints)(props, val, styleFromPropValue);
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
        const config = (_theme$unstable_sxCon = theme.unstable_sxConfig) != null ? _theme$unstable_sxCon : _defaultSxConfig.default;
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
          const emptyBreakpoints = (0, _breakpoints.createEmptyBreakpointObject)(theme.breakpoints);
          const breakpointsKeys = Object.keys(emptyBreakpoints);
          let css2 = emptyBreakpoints;
          Object.keys(sxObject).forEach((styleKey) => {
            const value = callIfFn(sxObject[styleKey], theme);
            if (value !== null && value !== void 0) {
              if (typeof value === "object") {
                if (config[styleKey]) {
                  css2 = (0, _merge.default)(css2, getThemeValue(styleKey, value, theme, config));
                } else {
                  const breakpointsValues = (0, _breakpoints.handleBreakpoints)({
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
                    css2 = (0, _merge.default)(css2, breakpointsValues);
                  }
                }
              } else {
                css2 = (0, _merge.default)(css2, getThemeValue(styleKey, value, theme, config));
              }
            }
          });
          return (0, _breakpoints.removeUnusedBreakpoints)(breakpointsKeys, css2);
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
    var _default = exports.default = styleFunctionSx;
  }
});

// node_modules/@mui/system/createTheme/applyStyles.js
var require_applyStyles = __commonJS({
  "node_modules/@mui/system/createTheme/applyStyles.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = applyStyles;
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
  }
});

// node_modules/@mui/system/createTheme/createTheme.js
var require_createTheme = __commonJS({
  "node_modules/@mui/system/createTheme/createTheme.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _extends2 = _interopRequireDefault(require_extends());
    var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require_objectWithoutPropertiesLoose());
    var _deepmerge = _interopRequireDefault((init_deepmerge(), __toCommonJS(deepmerge_exports)));
    var _createBreakpoints = _interopRequireDefault(require_createBreakpoints());
    var _shape = _interopRequireDefault(require_shape());
    var _createSpacing = _interopRequireDefault(require_createSpacing());
    var _styleFunctionSx = _interopRequireDefault(require_styleFunctionSx());
    var _defaultSxConfig = _interopRequireDefault(require_defaultSxConfig());
    var _applyStyles = _interopRequireDefault(require_applyStyles());
    var _excluded5 = ["breakpoints", "palette", "spacing", "shape"];
    function createTheme(options = {}, ...args) {
      const {
        breakpoints: breakpointsInput = {},
        palette: paletteInput = {},
        spacing: spacingInput,
        shape: shapeInput = {}
      } = options, other = (0, _objectWithoutPropertiesLoose2.default)(options, _excluded5);
      const breakpoints = (0, _createBreakpoints.default)(breakpointsInput);
      const spacing = (0, _createSpacing.default)(spacingInput);
      let muiTheme = (0, _deepmerge.default)({
        breakpoints,
        direction: "ltr",
        components: {},
        // Inject component definitions.
        palette: (0, _extends2.default)({
          mode: "light"
        }, paletteInput),
        spacing,
        shape: (0, _extends2.default)({}, _shape.default, shapeInput)
      }, other);
      muiTheme.applyStyles = _applyStyles.default;
      muiTheme = args.reduce((acc, argument) => (0, _deepmerge.default)(acc, argument), muiTheme);
      muiTheme.unstable_sxConfig = (0, _extends2.default)({}, _defaultSxConfig.default, other == null ? void 0 : other.unstable_sxConfig);
      muiTheme.unstable_sx = /* @__PURE__ */ __name(function sx(props) {
        return (0, _styleFunctionSx.default)({
          sx: props,
          theme: this
        });
      }, "sx");
      return muiTheme;
    }
    __name(createTheme, "createTheme");
    var _default = exports.default = createTheme;
  }
});

// node_modules/@mui/system/createTheme/index.js
var require_createTheme2 = __commonJS({
  "node_modules/@mui/system/createTheme/index.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _createTheme.default;
      }, "get")
    });
    Object.defineProperty(exports, "private_createBreakpoints", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _createBreakpoints.default;
      }, "get")
    });
    Object.defineProperty(exports, "unstable_applyStyles", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _applyStyles.default;
      }, "get")
    });
    var _createTheme = _interopRequireDefault(require_createTheme());
    var _createBreakpoints = _interopRequireDefault(require_createBreakpoints());
    var _applyStyles = _interopRequireDefault(require_applyStyles());
  }
});

// node_modules/@mui/system/styleFunctionSx/extendSxProp.js
var require_extendSxProp = __commonJS({
  "node_modules/@mui/system/styleFunctionSx/extendSxProp.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = extendSxProp;
    var _extends2 = _interopRequireDefault(require_extends());
    var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require_objectWithoutPropertiesLoose());
    var _deepmerge = (init_deepmerge(), __toCommonJS(deepmerge_exports));
    var _defaultSxConfig = _interopRequireDefault(require_defaultSxConfig());
    var _excluded5 = ["sx"];
    var splitProps = /* @__PURE__ */ __name((props) => {
      var _props$theme$unstable, _props$theme;
      const result = {
        systemProps: {},
        otherProps: {}
      };
      const config = (_props$theme$unstable = props == null || (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : _defaultSxConfig.default;
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
      } = props, other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded5);
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
          if (!(0, _deepmerge.isPlainObject)(result)) {
            return systemProps;
          }
          return (0, _extends2.default)({}, systemProps, result);
        }, "finalSx");
      } else {
        finalSx = (0, _extends2.default)({}, systemProps, inSx);
      }
      return (0, _extends2.default)({}, otherProps, {
        sx: finalSx
      });
    }
    __name(extendSxProp, "extendSxProp");
  }
});

// node_modules/@mui/system/styleFunctionSx/index.js
var require_styleFunctionSx2 = __commonJS({
  "node_modules/@mui/system/styleFunctionSx/index.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _styleFunctionSx.default;
      }, "get")
    });
    Object.defineProperty(exports, "extendSxProp", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _extendSxProp.default;
      }, "get")
    });
    Object.defineProperty(exports, "unstable_createStyleFunctionSx", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _styleFunctionSx.unstable_createStyleFunctionSx;
      }, "get")
    });
    Object.defineProperty(exports, "unstable_defaultSxConfig", {
      enumerable: true,
      get: /* @__PURE__ */ __name(function() {
        return _defaultSxConfig.default;
      }, "get")
    });
    var _styleFunctionSx = _interopRequireWildcard(require_styleFunctionSx());
    var _extendSxProp = _interopRequireDefault(require_extendSxProp());
    var _defaultSxConfig = _interopRequireDefault(require_defaultSxConfig());
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function(e2) {
        return e2 ? t : r;
      }, "_getRequireWildcardCache"))(e);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n.default = e, t && t.set(e, n), n;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
  }
});

// node_modules/@mui/system/createStyled.js
var require_createStyled = __commonJS({
  "node_modules/@mui/system/createStyled.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = createStyled2;
    exports.shouldForwardProp = shouldForwardProp;
    exports.systemDefaultTheme = void 0;
    var _extends2 = _interopRequireDefault(require_extends());
    var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require_objectWithoutPropertiesLoose());
    var _styledEngine = _interopRequireWildcard((init_styled_engine(), __toCommonJS(styled_engine_exports)));
    var _deepmerge = (init_deepmerge(), __toCommonJS(deepmerge_exports));
    var _capitalize = _interopRequireDefault((init_capitalize(), __toCommonJS(capitalize_exports)));
    var _getDisplayName = _interopRequireDefault((init_getDisplayName(), __toCommonJS(getDisplayName_exports)));
    var _createTheme = _interopRequireDefault(require_createTheme2());
    var _styleFunctionSx = _interopRequireDefault(require_styleFunctionSx2());
    var _excluded5 = ["ownerState"];
    var _excluded23 = ["variants"];
    var _excluded32 = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function(e2) {
        return e2 ? t : r;
      }, "_getRequireWildcardCache"))(e);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n.default = e, t && t.set(e, n), n;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }
    __name(isEmpty, "isEmpty");
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
    var systemDefaultTheme = exports.systemDefaultTheme = (0, _createTheme.default)();
    var lowercaseFirstLetter = /* @__PURE__ */ __name((string) => {
      if (!string) {
        return string;
      }
      return string.charAt(0).toLowerCase() + string.slice(1);
    }, "lowercaseFirstLetter");
    function resolveTheme({
      defaultTheme: defaultTheme2,
      theme,
      themeId
    }) {
      return isEmpty(theme) ? defaultTheme2 : theme[themeId] || theme;
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
      } = _ref, props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded5);
      const resolvedStylesArg = typeof callableStyle === "function" ? callableStyle((0, _extends2.default)({
        ownerState
      }, props)) : callableStyle;
      if (Array.isArray(resolvedStylesArg)) {
        return resolvedStylesArg.flatMap((resolvedStyle) => processStyleArg(resolvedStyle, (0, _extends2.default)({
          ownerState
        }, props)));
      }
      if (!!resolvedStylesArg && typeof resolvedStylesArg === "object" && Array.isArray(resolvedStylesArg.variants)) {
        const {
          variants = []
        } = resolvedStylesArg, otherStyles = (0, _objectWithoutPropertiesLoose2.default)(resolvedStylesArg, _excluded23);
        let result = otherStyles;
        variants.forEach((variant) => {
          let isMatch = true;
          if (typeof variant.props === "function") {
            isMatch = variant.props((0, _extends2.default)({
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
            result.push(typeof variant.style === "function" ? variant.style((0, _extends2.default)({
              ownerState
            }, props, ownerState)) : variant.style);
          }
        });
        return result;
      }
      return resolvedStylesArg;
    }
    __name(processStyleArg, "processStyleArg");
    function createStyled2(input = {}) {
      const {
        themeId,
        defaultTheme: defaultTheme2 = systemDefaultTheme,
        rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
        slotShouldForwardProp: slotShouldForwardProp2 = shouldForwardProp
      } = input;
      const systemSx = /* @__PURE__ */ __name((props) => {
        return (0, _styleFunctionSx.default)((0, _extends2.default)({}, props, {
          theme: resolveTheme((0, _extends2.default)({}, props, {
            defaultTheme: defaultTheme2,
            themeId
          }))
        }));
      }, "systemSx");
      systemSx.__mui_systemSx = true;
      return (tag, inputOptions = {}) => {
        (0, _styledEngine.internal_processStyles)(tag, (styles) => styles.filter((style) => !(style != null && style.__mui_systemSx)));
        const {
          name: componentName,
          slot: componentSlot,
          skipVariantsResolver: inputSkipVariantsResolver,
          skipSx: inputSkipSx,
          // TODO v6: remove `lowercaseFirstLetter()` in the next major release
          // For more details: https://github.com/mui/material-ui/pull/37908
          overridesResolver = defaultOverridesResolver(lowercaseFirstLetter(componentSlot))
        } = inputOptions, options = (0, _objectWithoutPropertiesLoose2.default)(inputOptions, _excluded32);
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
          shouldForwardPropOption = rootShouldForwardProp2;
        } else if (componentSlot) {
          shouldForwardPropOption = slotShouldForwardProp2;
        } else if (isStringTag(tag)) {
          shouldForwardPropOption = void 0;
        }
        const defaultStyledResolver = (0, _styledEngine.default)(tag, (0, _extends2.default)({
          shouldForwardProp: shouldForwardPropOption,
          label
        }, options));
        const transformStyleArg = /* @__PURE__ */ __name((stylesArg) => {
          if (typeof stylesArg === "function" && stylesArg.__emotion_real !== stylesArg || (0, _deepmerge.isPlainObject)(stylesArg)) {
            return (props) => processStyleArg(stylesArg, (0, _extends2.default)({}, props, {
              theme: resolveTheme({
                theme: props.theme,
                defaultTheme: defaultTheme2,
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
              const theme = resolveTheme((0, _extends2.default)({}, props, {
                defaultTheme: defaultTheme2,
                themeId
              }));
              if (!theme.components || !theme.components[componentName] || !theme.components[componentName].styleOverrides) {
                return null;
              }
              const styleOverrides = theme.components[componentName].styleOverrides;
              const resolvedStyleOverrides = {};
              Object.entries(styleOverrides).forEach(([slotKey, slotStyle]) => {
                resolvedStyleOverrides[slotKey] = processStyleArg(slotStyle, (0, _extends2.default)({}, props, {
                  theme
                }));
              });
              return overridesResolver(props, resolvedStyleOverrides);
            });
          }
          if (componentName && !skipVariantsResolver) {
            expressionsWithDefaultTheme.push((props) => {
              var _theme$components;
              const theme = resolveTheme((0, _extends2.default)({}, props, {
                defaultTheme: defaultTheme2,
                themeId
              }));
              const themeVariants = theme == null || (_theme$components = theme.components) == null || (_theme$components = _theme$components[componentName]) == null ? void 0 : _theme$components.variants;
              return processStyleArg({
                variants: themeVariants
              }, (0, _extends2.default)({}, props, {
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
              displayName = `${componentName}${(0, _capitalize.default)(componentSlot || "")}`;
            }
            if (displayName === void 0) {
              displayName = `Styled(${(0, _getDisplayName.default)(tag)})`;
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
    __name(createStyled2, "createStyled");
  }
});

// node_modules/@mui/material/styles/index.js
init_formatMuiErrorMessage();

// node_modules/@mui/material/styles/adaptV4Theme.js
init_extends();
var _excluded = ["defaultProps", "mixins", "overrides", "palette", "props", "styleOverrides"];
var _excluded2 = ["type", "mode"];
function adaptV4Theme(inputTheme) {
  if (true) {
    console.warn(["MUI: adaptV4Theme() is deprecated.", "Follow the upgrade guide on https://mui.com/r/migration-v4#theme."].join("\n"));
  }
  const {
    defaultProps = {},
    mixins = {},
    overrides = {},
    palette = {},
    props = {},
    styleOverrides = {}
  } = inputTheme, other = _objectWithoutPropertiesLoose(inputTheme, _excluded);
  const theme = _extends({}, other, {
    components: {}
  });
  Object.keys(defaultProps).forEach((component) => {
    const componentValue = theme.components[component] || {};
    componentValue.defaultProps = defaultProps[component];
    theme.components[component] = componentValue;
  });
  Object.keys(props).forEach((component) => {
    const componentValue = theme.components[component] || {};
    componentValue.defaultProps = props[component];
    theme.components[component] = componentValue;
  });
  Object.keys(styleOverrides).forEach((component) => {
    const componentValue = theme.components[component] || {};
    componentValue.styleOverrides = styleOverrides[component];
    theme.components[component] = componentValue;
  });
  Object.keys(overrides).forEach((component) => {
    const componentValue = theme.components[component] || {};
    componentValue.styleOverrides = overrides[component];
    theme.components[component] = componentValue;
  });
  theme.spacing = createSpacing(inputTheme.spacing);
  const breakpoints = createBreakpoints(inputTheme.breakpoints || {});
  const spacing = theme.spacing;
  theme.mixins = _extends({
    gutters: /* @__PURE__ */ __name((styles = {}) => {
      return _extends({
        paddingLeft: spacing(2),
        paddingRight: spacing(2)
      }, styles, {
        [breakpoints.up("sm")]: _extends({
          paddingLeft: spacing(3),
          paddingRight: spacing(3)
        }, styles[breakpoints.up("sm")])
      });
    }, "gutters")
  }, mixins);
  const {
    type: typeInput,
    mode: modeInput
  } = palette, paletteRest = _objectWithoutPropertiesLoose(palette, _excluded2);
  const finalMode = modeInput || typeInput || "light";
  theme.palette = _extends({
    // theme.palette.text.hint
    text: {
      hint: finalMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)"
    },
    mode: finalMode,
    type: finalMode
  }, paletteRest);
  return theme;
}
__name(adaptV4Theme, "adaptV4Theme");

// node_modules/@mui/material/styles/createMuiStrictModeTheme.js
init_deepmerge();
function createMuiStrictModeTheme(options, ...args) {
  return createTheme_default(deepmerge({
    unstable_strictMode: true
  }, options), ...args);
}
__name(createMuiStrictModeTheme, "createMuiStrictModeTheme");

// node_modules/@mui/material/styles/createStyles.js
var warnedOnce = false;
function createStyles(styles) {
  if (!warnedOnce) {
    console.warn(["MUI: createStyles from @mui/material/styles is deprecated.", "Please use @mui/styles/createStyles"].join("\n"));
    warnedOnce = true;
  }
  return styles;
}
__name(createStyles, "createStyles");

// node_modules/@mui/material/styles/cssUtils.js
function isUnitless(value) {
  return String(parseFloat(value)).length === String(value).length;
}
__name(isUnitless, "isUnitless");
function getUnit(input) {
  return String(input).match(/[\d.\-+]*\s*(.*)/)[1] || "";
}
__name(getUnit, "getUnit");
function toUnitless(length) {
  return parseFloat(length);
}
__name(toUnitless, "toUnitless");
function convertLength(baseFontSize) {
  return (length, toUnit) => {
    const fromUnit = getUnit(length);
    if (fromUnit === toUnit) {
      return length;
    }
    let pxLength = toUnitless(length);
    if (fromUnit !== "px") {
      if (fromUnit === "em") {
        pxLength = toUnitless(length) * toUnitless(baseFontSize);
      } else if (fromUnit === "rem") {
        pxLength = toUnitless(length) * toUnitless(baseFontSize);
      }
    }
    let outputLength = pxLength;
    if (toUnit !== "px") {
      if (toUnit === "em") {
        outputLength = pxLength / toUnitless(baseFontSize);
      } else if (toUnit === "rem") {
        outputLength = pxLength / toUnitless(baseFontSize);
      } else {
        return length;
      }
    }
    return parseFloat(outputLength.toFixed(5)) + toUnit;
  };
}
__name(convertLength, "convertLength");
function alignProperty({
  size,
  grid
}) {
  const sizeBelow = size - size % grid;
  const sizeAbove = sizeBelow + grid;
  return size - sizeBelow < sizeAbove - size ? sizeBelow : sizeAbove;
}
__name(alignProperty, "alignProperty");
function fontGrid({
  lineHeight,
  pixels,
  htmlFontSize
}) {
  return pixels / (lineHeight * htmlFontSize);
}
__name(fontGrid, "fontGrid");
function responsiveProperty({
  cssProperty,
  min,
  max,
  unit = "rem",
  breakpoints = [600, 900, 1200],
  transform = null
}) {
  const output = {
    [cssProperty]: `${min}${unit}`
  };
  const factor = (max - min) / breakpoints[breakpoints.length - 1];
  breakpoints.forEach((breakpoint) => {
    let value = min + factor * breakpoint;
    if (transform !== null) {
      value = transform(value);
    }
    output[`@media (min-width:${breakpoint}px)`] = {
      [cssProperty]: `${Math.round(value * 1e4) / 1e4}${unit}`
    };
  });
  return output;
}
__name(responsiveProperty, "responsiveProperty");

// node_modules/@mui/material/styles/responsiveFontSizes.js
init_extends();
init_formatMuiErrorMessage();
function responsiveFontSizes(themeInput, options = {}) {
  const {
    breakpoints = ["sm", "md", "lg"],
    disableAlign = false,
    factor = 2,
    variants = ["h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "caption", "button", "overline"]
  } = options;
  const theme = _extends({}, themeInput);
  theme.typography = _extends({}, theme.typography);
  const typography = theme.typography;
  const convert = convertLength(typography.htmlFontSize);
  const breakpointValues = breakpoints.map((x) => theme.breakpoints.values[x]);
  variants.forEach((variant) => {
    const style = typography[variant];
    if (!style) {
      return;
    }
    const remFontSize = parseFloat(convert(style.fontSize, "rem"));
    if (remFontSize <= 1) {
      return;
    }
    const maxFontSize = remFontSize;
    const minFontSize = 1 + (maxFontSize - 1) / factor;
    let {
      lineHeight
    } = style;
    if (!isUnitless(lineHeight) && !disableAlign) {
      throw new Error(true ? `MUI: Unsupported non-unitless line height with grid alignment.
Use unitless line heights instead.` : formatMuiErrorMessage(6));
    }
    if (!isUnitless(lineHeight)) {
      lineHeight = parseFloat(convert(lineHeight, "rem")) / parseFloat(remFontSize);
    }
    let transform = null;
    if (!disableAlign) {
      transform = /* @__PURE__ */ __name((value) => alignProperty({
        size: value,
        grid: fontGrid({
          pixels: 4,
          lineHeight,
          htmlFontSize: typography.htmlFontSize
        })
      }), "transform");
    }
    typography[variant] = _extends({}, style, responsiveProperty({
      cssProperty: "fontSize",
      min: minFontSize,
      max: maxFontSize,
      unit: "rem",
      breakpoints: breakpointValues,
      transform
    }));
  });
  return theme;
}
__name(responsiveFontSizes, "responsiveFontSizes");

// node_modules/@mui/material/styles/useTheme.js
var React = __toESM(require_react());
function useTheme() {
  const theme = useTheme_default(defaultTheme_default);
  if (true) {
    React.useDebugValue(theme);
  }
  return theme[identifier_default] || theme;
}
__name(useTheme, "useTheme");

// node_modules/@mui/material/styles/useThemeProps.js
function useThemeProps2({
  props,
  name
}) {
  return useThemeProps({
    props,
    name,
    defaultTheme: defaultTheme_default,
    themeId: identifier_default
  });
}
__name(useThemeProps2, "useThemeProps");

// node_modules/@mui/material/styles/styled.js
var import_createStyled = __toESM(require_createStyled());

// node_modules/@mui/material/styles/slotShouldForwardProp.js
function slotShouldForwardProp(prop) {
  return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
__name(slotShouldForwardProp, "slotShouldForwardProp");
var slotShouldForwardProp_default = slotShouldForwardProp;

// node_modules/@mui/material/styles/rootShouldForwardProp.js
var rootShouldForwardProp = /* @__PURE__ */ __name((prop) => slotShouldForwardProp_default(prop) && prop !== "classes", "rootShouldForwardProp");
var rootShouldForwardProp_default = rootShouldForwardProp;

// node_modules/@mui/material/styles/styled.js
var styled = (0, import_createStyled.default)({
  themeId: identifier_default,
  defaultTheme: defaultTheme_default,
  rootShouldForwardProp: rootShouldForwardProp_default
});
var styled_default = styled;

// node_modules/@mui/material/styles/ThemeProvider.js
init_extends();
var React2 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded3 = ["theme"];
function ThemeProvider(_ref) {
  let {
    theme: themeInput
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded3);
  const scopedTheme = themeInput[identifier_default];
  let finalTheme = scopedTheme || themeInput;
  if (typeof themeInput !== "function") {
    if (scopedTheme && !scopedTheme.vars) {
      finalTheme = _extends({}, scopedTheme, {
        vars: null
      });
    } else if (themeInput && !themeInput.vars) {
      finalTheme = _extends({}, themeInput, {
        vars: null
      });
    }
  }
  return (0, import_jsx_runtime.jsx)(ThemeProvider_default, _extends({}, props, {
    themeId: scopedTheme ? identifier_default : void 0,
    theme: finalTheme
  }));
}
__name(ThemeProvider, "ThemeProvider");
true ? ThemeProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: import_prop_types.default.node,
  /**
   * A theme object. You can provide a function to extend the outer theme.
   */
  theme: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.func]).isRequired
} : void 0;

// node_modules/@mui/material/styles/makeStyles.js
init_formatMuiErrorMessage();
function makeStyles() {
  throw new Error(true ? `MUI: makeStyles is no longer exported from @mui/material/styles.
You have to import it from @mui/styles.
See https://mui.com/r/migration-v4/#mui-material-styles for more details.` : formatMuiErrorMessage(14));
}
__name(makeStyles, "makeStyles");

// node_modules/@mui/material/styles/withStyles.js
init_formatMuiErrorMessage();
function withStyles() {
  throw new Error(true ? `MUI: withStyles is no longer exported from @mui/material/styles.
You have to import it from @mui/styles.
See https://mui.com/r/migration-v4/#mui-material-styles for more details.` : formatMuiErrorMessage(15));
}
__name(withStyles, "withStyles");

// node_modules/@mui/material/styles/withTheme.js
init_formatMuiErrorMessage();
function withTheme() {
  throw new Error(true ? `MUI: withTheme is no longer exported from @mui/material/styles.
You have to import it from @mui/styles.
See https://mui.com/r/migration-v4/#mui-material-styles for more details.` : formatMuiErrorMessage(16));
}
__name(withTheme, "withTheme");

// node_modules/@mui/material/styles/CssVarsProvider.js
init_extends();

// node_modules/@mui/material/styles/experimental_extendTheme.js
init_extends();
init_deepmerge();
var import_colorManipulator = __toESM(require_colorManipulator());

// node_modules/@mui/material/styles/shouldSkipGeneratingVar.js
function shouldSkipGeneratingVar(keys) {
  var _keys$;
  return !!keys[0].match(/(cssVarPrefix|typography|mixins|breakpoints|direction|transitions)/) || !!keys[0].match(/sxConfig$/) || // ends with sxConfig
  keys[0] === "palette" && !!((_keys$ = keys[1]) != null && _keys$.match(/(mode|contrastThreshold|tonalOffset)/));
}
__name(shouldSkipGeneratingVar, "shouldSkipGeneratingVar");

// node_modules/@mui/material/styles/getOverlayAlpha.js
var getOverlayAlpha = /* @__PURE__ */ __name((elevation) => {
  let alphaValue;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return (alphaValue / 100).toFixed(2);
}, "getOverlayAlpha");
var getOverlayAlpha_default = getOverlayAlpha;

// node_modules/@mui/material/styles/experimental_extendTheme.js
var _excluded4 = ["colorSchemes", "cssVarPrefix", "shouldSkipGeneratingVar"];
var _excluded22 = ["palette"];
var defaultDarkOverlays = [...Array(25)].map((_, index) => {
  if (index === 0) {
    return void 0;
  }
  const overlay = getOverlayAlpha_default(index);
  return `linear-gradient(rgba(255 255 255 / ${overlay}), rgba(255 255 255 / ${overlay}))`;
});
function assignNode(obj, keys) {
  keys.forEach((k) => {
    if (!obj[k]) {
      obj[k] = {};
    }
  });
}
__name(assignNode, "assignNode");
function setColor(obj, key, defaultValue) {
  if (!obj[key] && defaultValue) {
    obj[key] = defaultValue;
  }
}
__name(setColor, "setColor");
function toRgb(color) {
  if (!color || !color.startsWith("hsl")) {
    return color;
  }
  return (0, import_colorManipulator.hslToRgb)(color);
}
__name(toRgb, "toRgb");
function setColorChannel(obj, key) {
  if (!(`${key}Channel` in obj)) {
    obj[`${key}Channel`] = (0, import_colorManipulator.private_safeColorChannel)(toRgb(obj[key]), `MUI: Can't create \`palette.${key}Channel\` because \`palette.${key}\` is not one of these formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().
To suppress this warning, you need to explicitly provide the \`palette.${key}Channel\` as a string (in rgb format, for example "12 12 12") or undefined if you want to remove the channel token.`);
  }
}
__name(setColorChannel, "setColorChannel");
var silent = /* @__PURE__ */ __name((fn) => {
  try {
    return fn();
  } catch (error) {
  }
  return void 0;
}, "silent");
var createGetCssVar2 = /* @__PURE__ */ __name((cssVarPrefix = "mui") => createGetCssVar(cssVarPrefix), "createGetCssVar");
function extendTheme(options = {}, ...args) {
  var _colorSchemesInput$li, _colorSchemesInput$da, _colorSchemesInput$li2, _colorSchemesInput$li3, _colorSchemesInput$da2, _colorSchemesInput$da3;
  const {
    colorSchemes: colorSchemesInput = {},
    cssVarPrefix = "mui",
    shouldSkipGeneratingVar: shouldSkipGeneratingVar2 = shouldSkipGeneratingVar
  } = options, input = _objectWithoutPropertiesLoose(options, _excluded4);
  const getCssVar = createGetCssVar2(cssVarPrefix);
  const _createThemeWithoutVa = createTheme_default(_extends({}, input, colorSchemesInput.light && {
    palette: (_colorSchemesInput$li = colorSchemesInput.light) == null ? void 0 : _colorSchemesInput$li.palette
  })), {
    palette: lightPalette
  } = _createThemeWithoutVa, muiTheme = _objectWithoutPropertiesLoose(_createThemeWithoutVa, _excluded22);
  const {
    palette: darkPalette
  } = createTheme_default({
    palette: _extends({
      mode: "dark"
    }, (_colorSchemesInput$da = colorSchemesInput.dark) == null ? void 0 : _colorSchemesInput$da.palette)
  });
  let theme = _extends({}, muiTheme, {
    cssVarPrefix,
    getCssVar,
    colorSchemes: _extends({}, colorSchemesInput, {
      light: _extends({}, colorSchemesInput.light, {
        palette: lightPalette,
        opacity: _extends({
          inputPlaceholder: 0.42,
          inputUnderline: 0.42,
          switchTrackDisabled: 0.12,
          switchTrack: 0.38
        }, (_colorSchemesInput$li2 = colorSchemesInput.light) == null ? void 0 : _colorSchemesInput$li2.opacity),
        overlays: ((_colorSchemesInput$li3 = colorSchemesInput.light) == null ? void 0 : _colorSchemesInput$li3.overlays) || []
      }),
      dark: _extends({}, colorSchemesInput.dark, {
        palette: darkPalette,
        opacity: _extends({
          inputPlaceholder: 0.5,
          inputUnderline: 0.7,
          switchTrackDisabled: 0.2,
          switchTrack: 0.3
        }, (_colorSchemesInput$da2 = colorSchemesInput.dark) == null ? void 0 : _colorSchemesInput$da2.opacity),
        overlays: ((_colorSchemesInput$da3 = colorSchemesInput.dark) == null ? void 0 : _colorSchemesInput$da3.overlays) || defaultDarkOverlays
      })
    })
  });
  Object.keys(theme.colorSchemes).forEach((key) => {
    const palette = theme.colorSchemes[key].palette;
    const setCssVarColor = /* @__PURE__ */ __name((cssVar) => {
      const tokens = cssVar.split("-");
      const color = tokens[1];
      const colorToken = tokens[2];
      return getCssVar(cssVar, palette[color][colorToken]);
    }, "setCssVarColor");
    if (key === "light") {
      setColor(palette.common, "background", "#fff");
      setColor(palette.common, "onBackground", "#000");
    } else {
      setColor(palette.common, "background", "#000");
      setColor(palette.common, "onBackground", "#fff");
    }
    assignNode(palette, ["Alert", "AppBar", "Avatar", "Button", "Chip", "FilledInput", "LinearProgress", "Skeleton", "Slider", "SnackbarContent", "SpeedDialAction", "StepConnector", "StepContent", "Switch", "TableCell", "Tooltip"]);
    if (key === "light") {
      setColor(palette.Alert, "errorColor", (0, import_colorManipulator.private_safeDarken)(palette.error.light, 0.6));
      setColor(palette.Alert, "infoColor", (0, import_colorManipulator.private_safeDarken)(palette.info.light, 0.6));
      setColor(palette.Alert, "successColor", (0, import_colorManipulator.private_safeDarken)(palette.success.light, 0.6));
      setColor(palette.Alert, "warningColor", (0, import_colorManipulator.private_safeDarken)(palette.warning.light, 0.6));
      setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-main"));
      setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-main"));
      setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-main"));
      setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-main"));
      setColor(palette.Alert, "errorFilledColor", silent(() => lightPalette.getContrastText(palette.error.main)));
      setColor(palette.Alert, "infoFilledColor", silent(() => lightPalette.getContrastText(palette.info.main)));
      setColor(palette.Alert, "successFilledColor", silent(() => lightPalette.getContrastText(palette.success.main)));
      setColor(palette.Alert, "warningFilledColor", silent(() => lightPalette.getContrastText(palette.warning.main)));
      setColor(palette.Alert, "errorStandardBg", (0, import_colorManipulator.private_safeLighten)(palette.error.light, 0.9));
      setColor(palette.Alert, "infoStandardBg", (0, import_colorManipulator.private_safeLighten)(palette.info.light, 0.9));
      setColor(palette.Alert, "successStandardBg", (0, import_colorManipulator.private_safeLighten)(palette.success.light, 0.9));
      setColor(palette.Alert, "warningStandardBg", (0, import_colorManipulator.private_safeLighten)(palette.warning.light, 0.9));
      setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
      setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
      setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
      setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
      setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-100"));
      setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-400"));
      setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-300"));
      setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-A100"));
      setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-400"));
      setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-700"));
      setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-700"));
      setColor(palette.FilledInput, "bg", "rgba(0, 0, 0, 0.06)");
      setColor(palette.FilledInput, "hoverBg", "rgba(0, 0, 0, 0.09)");
      setColor(palette.FilledInput, "disabledBg", "rgba(0, 0, 0, 0.12)");
      setColor(palette.LinearProgress, "primaryBg", (0, import_colorManipulator.private_safeLighten)(palette.primary.main, 0.62));
      setColor(palette.LinearProgress, "secondaryBg", (0, import_colorManipulator.private_safeLighten)(palette.secondary.main, 0.62));
      setColor(palette.LinearProgress, "errorBg", (0, import_colorManipulator.private_safeLighten)(palette.error.main, 0.62));
      setColor(palette.LinearProgress, "infoBg", (0, import_colorManipulator.private_safeLighten)(palette.info.main, 0.62));
      setColor(palette.LinearProgress, "successBg", (0, import_colorManipulator.private_safeLighten)(palette.success.main, 0.62));
      setColor(palette.LinearProgress, "warningBg", (0, import_colorManipulator.private_safeLighten)(palette.warning.main, 0.62));
      setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.11)`);
      setColor(palette.Slider, "primaryTrack", (0, import_colorManipulator.private_safeLighten)(palette.primary.main, 0.62));
      setColor(palette.Slider, "secondaryTrack", (0, import_colorManipulator.private_safeLighten)(palette.secondary.main, 0.62));
      setColor(palette.Slider, "errorTrack", (0, import_colorManipulator.private_safeLighten)(palette.error.main, 0.62));
      setColor(palette.Slider, "infoTrack", (0, import_colorManipulator.private_safeLighten)(palette.info.main, 0.62));
      setColor(palette.Slider, "successTrack", (0, import_colorManipulator.private_safeLighten)(palette.success.main, 0.62));
      setColor(palette.Slider, "warningTrack", (0, import_colorManipulator.private_safeLighten)(palette.warning.main, 0.62));
      const snackbarContentBackground = (0, import_colorManipulator.private_safeEmphasize)(palette.background.default, 0.8);
      setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
      setColor(palette.SnackbarContent, "color", silent(() => lightPalette.getContrastText(snackbarContentBackground)));
      setColor(palette.SpeedDialAction, "fabHoverBg", (0, import_colorManipulator.private_safeEmphasize)(palette.background.paper, 0.15));
      setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-400"));
      setColor(palette.StepContent, "border", setCssVarColor("palette-grey-400"));
      setColor(palette.Switch, "defaultColor", setCssVarColor("palette-common-white"));
      setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-100"));
      setColor(palette.Switch, "primaryDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.primary.main, 0.62));
      setColor(palette.Switch, "secondaryDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.secondary.main, 0.62));
      setColor(palette.Switch, "errorDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.error.main, 0.62));
      setColor(palette.Switch, "infoDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.info.main, 0.62));
      setColor(palette.Switch, "successDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.success.main, 0.62));
      setColor(palette.Switch, "warningDisabledColor", (0, import_colorManipulator.private_safeLighten)(palette.warning.main, 0.62));
      setColor(palette.TableCell, "border", (0, import_colorManipulator.private_safeLighten)((0, import_colorManipulator.private_safeAlpha)(palette.divider, 1), 0.88));
      setColor(palette.Tooltip, "bg", (0, import_colorManipulator.private_safeAlpha)(palette.grey[700], 0.92));
    } else {
      setColor(palette.Alert, "errorColor", (0, import_colorManipulator.private_safeLighten)(palette.error.light, 0.6));
      setColor(palette.Alert, "infoColor", (0, import_colorManipulator.private_safeLighten)(palette.info.light, 0.6));
      setColor(palette.Alert, "successColor", (0, import_colorManipulator.private_safeLighten)(palette.success.light, 0.6));
      setColor(palette.Alert, "warningColor", (0, import_colorManipulator.private_safeLighten)(palette.warning.light, 0.6));
      setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-dark"));
      setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-dark"));
      setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-dark"));
      setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-dark"));
      setColor(palette.Alert, "errorFilledColor", silent(() => darkPalette.getContrastText(palette.error.dark)));
      setColor(palette.Alert, "infoFilledColor", silent(() => darkPalette.getContrastText(palette.info.dark)));
      setColor(palette.Alert, "successFilledColor", silent(() => darkPalette.getContrastText(palette.success.dark)));
      setColor(palette.Alert, "warningFilledColor", silent(() => darkPalette.getContrastText(palette.warning.dark)));
      setColor(palette.Alert, "errorStandardBg", (0, import_colorManipulator.private_safeDarken)(palette.error.light, 0.9));
      setColor(palette.Alert, "infoStandardBg", (0, import_colorManipulator.private_safeDarken)(palette.info.light, 0.9));
      setColor(palette.Alert, "successStandardBg", (0, import_colorManipulator.private_safeDarken)(palette.success.light, 0.9));
      setColor(palette.Alert, "warningStandardBg", (0, import_colorManipulator.private_safeDarken)(palette.warning.light, 0.9));
      setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
      setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
      setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
      setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
      setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-900"));
      setColor(palette.AppBar, "darkBg", setCssVarColor("palette-background-paper"));
      setColor(palette.AppBar, "darkColor", setCssVarColor("palette-text-primary"));
      setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-600"));
      setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-800"));
      setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-700"));
      setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-700"));
      setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-300"));
      setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-300"));
      setColor(palette.FilledInput, "bg", "rgba(255, 255, 255, 0.09)");
      setColor(palette.FilledInput, "hoverBg", "rgba(255, 255, 255, 0.13)");
      setColor(palette.FilledInput, "disabledBg", "rgba(255, 255, 255, 0.12)");
      setColor(palette.LinearProgress, "primaryBg", (0, import_colorManipulator.private_safeDarken)(palette.primary.main, 0.5));
      setColor(palette.LinearProgress, "secondaryBg", (0, import_colorManipulator.private_safeDarken)(palette.secondary.main, 0.5));
      setColor(palette.LinearProgress, "errorBg", (0, import_colorManipulator.private_safeDarken)(palette.error.main, 0.5));
      setColor(palette.LinearProgress, "infoBg", (0, import_colorManipulator.private_safeDarken)(palette.info.main, 0.5));
      setColor(palette.LinearProgress, "successBg", (0, import_colorManipulator.private_safeDarken)(palette.success.main, 0.5));
      setColor(palette.LinearProgress, "warningBg", (0, import_colorManipulator.private_safeDarken)(palette.warning.main, 0.5));
      setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.13)`);
      setColor(palette.Slider, "primaryTrack", (0, import_colorManipulator.private_safeDarken)(palette.primary.main, 0.5));
      setColor(palette.Slider, "secondaryTrack", (0, import_colorManipulator.private_safeDarken)(palette.secondary.main, 0.5));
      setColor(palette.Slider, "errorTrack", (0, import_colorManipulator.private_safeDarken)(palette.error.main, 0.5));
      setColor(palette.Slider, "infoTrack", (0, import_colorManipulator.private_safeDarken)(palette.info.main, 0.5));
      setColor(palette.Slider, "successTrack", (0, import_colorManipulator.private_safeDarken)(palette.success.main, 0.5));
      setColor(palette.Slider, "warningTrack", (0, import_colorManipulator.private_safeDarken)(palette.warning.main, 0.5));
      const snackbarContentBackground = (0, import_colorManipulator.private_safeEmphasize)(palette.background.default, 0.98);
      setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
      setColor(palette.SnackbarContent, "color", silent(() => darkPalette.getContrastText(snackbarContentBackground)));
      setColor(palette.SpeedDialAction, "fabHoverBg", (0, import_colorManipulator.private_safeEmphasize)(palette.background.paper, 0.15));
      setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-600"));
      setColor(palette.StepContent, "border", setCssVarColor("palette-grey-600"));
      setColor(palette.Switch, "defaultColor", setCssVarColor("palette-grey-300"));
      setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-600"));
      setColor(palette.Switch, "primaryDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.primary.main, 0.55));
      setColor(palette.Switch, "secondaryDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.secondary.main, 0.55));
      setColor(palette.Switch, "errorDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.error.main, 0.55));
      setColor(palette.Switch, "infoDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.info.main, 0.55));
      setColor(palette.Switch, "successDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.success.main, 0.55));
      setColor(palette.Switch, "warningDisabledColor", (0, import_colorManipulator.private_safeDarken)(palette.warning.main, 0.55));
      setColor(palette.TableCell, "border", (0, import_colorManipulator.private_safeDarken)((0, import_colorManipulator.private_safeAlpha)(palette.divider, 1), 0.68));
      setColor(palette.Tooltip, "bg", (0, import_colorManipulator.private_safeAlpha)(palette.grey[700], 0.92));
    }
    setColorChannel(palette.background, "default");
    setColorChannel(palette.background, "paper");
    setColorChannel(palette.common, "background");
    setColorChannel(palette.common, "onBackground");
    setColorChannel(palette, "divider");
    Object.keys(palette).forEach((color) => {
      const colors = palette[color];
      if (colors && typeof colors === "object") {
        if (colors.main) {
          setColor(palette[color], "mainChannel", (0, import_colorManipulator.private_safeColorChannel)(toRgb(colors.main)));
        }
        if (colors.light) {
          setColor(palette[color], "lightChannel", (0, import_colorManipulator.private_safeColorChannel)(toRgb(colors.light)));
        }
        if (colors.dark) {
          setColor(palette[color], "darkChannel", (0, import_colorManipulator.private_safeColorChannel)(toRgb(colors.dark)));
        }
        if (colors.contrastText) {
          setColor(palette[color], "contrastTextChannel", (0, import_colorManipulator.private_safeColorChannel)(toRgb(colors.contrastText)));
        }
        if (color === "text") {
          setColorChannel(palette[color], "primary");
          setColorChannel(palette[color], "secondary");
        }
        if (color === "action") {
          if (colors.active) {
            setColorChannel(palette[color], "active");
          }
          if (colors.selected) {
            setColorChannel(palette[color], "selected");
          }
        }
      }
    });
  });
  theme = args.reduce((acc, argument) => deepmerge(acc, argument), theme);
  const parserConfig = {
    prefix: cssVarPrefix,
    shouldSkipGeneratingVar: shouldSkipGeneratingVar2
  };
  const {
    vars: themeVars,
    generateCssVars
  } = prepareCssVars_default(theme, parserConfig);
  theme.vars = themeVars;
  theme.generateCssVars = generateCssVars;
  theme.shouldSkipGeneratingVar = shouldSkipGeneratingVar2;
  theme.unstable_sxConfig = _extends({}, defaultSxConfig_default, input == null ? void 0 : input.unstable_sxConfig);
  theme.unstable_sx = /* @__PURE__ */ __name(function sx(props) {
    return styleFunctionSx_default({
      sx: props,
      theme: this
    });
  }, "sx");
  return theme;
}
__name(extendTheme, "extendTheme");

// node_modules/@mui/material/styles/excludeVariablesFromRoot.js
var excludeVariablesFromRoot = /* @__PURE__ */ __name((cssVarPrefix) => [...[...Array(24)].map((_, index) => `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}overlays-${index + 1}`), `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkBg`, `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkColor`], "excludeVariablesFromRoot");
var excludeVariablesFromRoot_default = excludeVariablesFromRoot;

// node_modules/@mui/material/InitColorSchemeScript/InitColorSchemeScript.js
init_extends();
var React3 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var defaultConfig = {
  attribute: "data-mui-color-scheme",
  colorSchemeStorageKey: "mui-color-scheme",
  defaultLightColorScheme: "light",
  defaultDarkColorScheme: "dark",
  modeStorageKey: "mui-mode"
};

// node_modules/@mui/material/styles/CssVarsProvider.js
var defaultTheme = extendTheme();
var {
  CssVarsProvider,
  useColorScheme,
  getInitColorSchemeScript: getInitColorSchemeScriptSystem
} = createCssVarsProvider({
  themeId: identifier_default,
  theme: defaultTheme,
  attribute: defaultConfig.attribute,
  colorSchemeStorageKey: defaultConfig.colorSchemeStorageKey,
  modeStorageKey: defaultConfig.modeStorageKey,
  defaultColorScheme: {
    light: defaultConfig.defaultLightColorScheme,
    dark: defaultConfig.defaultDarkColorScheme
  },
  resolveTheme: /* @__PURE__ */ __name((theme) => {
    const newTheme = _extends({}, theme, {
      typography: createTypography(theme.palette, theme.typography)
    });
    newTheme.unstable_sx = /* @__PURE__ */ __name(function sx(props) {
      return styleFunctionSx_default({
        sx: props,
        theme: this
      });
    }, "sx");
    return newTheme;
  }, "resolveTheme"),
  excludeVariablesFromRoot: excludeVariablesFromRoot_default
});
var getInitColorSchemeScript = getInitColorSchemeScriptSystem;

// node_modules/@mui/material/styles/index.js
function experimental_sx() {
  throw new Error(true ? `MUI: The \`experimental_sx\` has been moved to \`theme.unstable_sx\`.For more details, see https://github.com/mui/material-ui/pull/35150.` : formatMuiErrorMessage(20));
}
__name(experimental_sx, "experimental_sx");

export {
  adaptV4Theme,
  createMuiStrictModeTheme,
  createStyles,
  getUnit,
  toUnitless,
  responsiveFontSizes,
  useTheme,
  useThemeProps2 as useThemeProps,
  slotShouldForwardProp_default,
  rootShouldForwardProp_default,
  styled_default,
  ThemeProvider,
  makeStyles,
  withStyles,
  withTheme,
  shouldSkipGeneratingVar,
  getOverlayAlpha_default,
  extendTheme,
  excludeVariablesFromRoot_default,
  CssVarsProvider,
  useColorScheme,
  getInitColorSchemeScript,
  experimental_sx
};
//# sourceMappingURL=chunk-CGU5VS7Y.js.map
