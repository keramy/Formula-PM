import {
  GlobalStyles_default,
  useDefaultProps
} from "./chunk-PHZ5NS7P.js";
import {
  require_jsx_runtime
} from "./chunk-EI6MR3JK.js";
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
  __name,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/@mui/material/CssBaseline/CssBaseline.js
init_extends();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var html = /* @__PURE__ */ __name((theme, enableColorScheme) => _extends({
  WebkitFontSmoothing: "antialiased",
  // Antialiasing.
  MozOsxFontSmoothing: "grayscale",
  // Antialiasing.
  // Change from `box-sizing: content-box` so that `width`
  // is not affected by `padding` or `border`.
  boxSizing: "border-box",
  // Fix font resize problem in iOS
  WebkitTextSizeAdjust: "100%"
}, enableColorScheme && !theme.vars && {
  colorScheme: theme.palette.mode
}), "html");
var body = /* @__PURE__ */ __name((theme) => _extends({
  color: (theme.vars || theme).palette.text.primary
}, theme.typography.body1, {
  backgroundColor: (theme.vars || theme).palette.background.default,
  "@media print": {
    // Save printer ink.
    backgroundColor: (theme.vars || theme).palette.common.white
  }
}), "body");
var styles = /* @__PURE__ */ __name((theme, enableColorScheme = false) => {
  var _theme$components;
  const colorSchemeStyles = {};
  if (enableColorScheme && theme.colorSchemes) {
    Object.entries(theme.colorSchemes).forEach(([key, scheme]) => {
      var _scheme$palette;
      colorSchemeStyles[theme.getColorSchemeSelector(key).replace(/\s*&/, "")] = {
        colorScheme: (_scheme$palette = scheme.palette) == null ? void 0 : _scheme$palette.mode
      };
    });
  }
  let defaultStyles = _extends({
    html: html(theme, enableColorScheme),
    "*, *::before, *::after": {
      boxSizing: "inherit"
    },
    "strong, b": {
      fontWeight: theme.typography.fontWeightBold
    },
    body: _extends({
      margin: 0
    }, body(theme), {
      // Add support for document.body.requestFullScreen().
      // Other elements, if background transparent, are not supported.
      "&::backdrop": {
        backgroundColor: (theme.vars || theme).palette.background.default
      }
    })
  }, colorSchemeStyles);
  const themeOverrides = (_theme$components = theme.components) == null || (_theme$components = _theme$components.MuiCssBaseline) == null ? void 0 : _theme$components.styleOverrides;
  if (themeOverrides) {
    defaultStyles = [defaultStyles, themeOverrides];
  }
  return defaultStyles;
}, "styles");
function CssBaseline(inProps) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiCssBaseline"
  });
  const {
    children,
    enableColorScheme = false
  } = props;
  return (0, import_jsx_runtime2.jsxs)(React.Fragment, {
    children: [(0, import_jsx_runtime.jsx)(GlobalStyles_default, {
      styles: /* @__PURE__ */ __name((theme) => styles(theme, enableColorScheme), "styles")
    }), children]
  });
}
__name(CssBaseline, "CssBaseline");
true ? CssBaseline.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * You can wrap a node.
   */
  children: import_prop_types.default.node,
  /**
   * Enable `color-scheme` CSS property to use `theme.palette.mode`.
   * For more details, check out https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
   * For browser support, check out https://caniuse.com/?search=color-scheme
   * @default false
   */
  enableColorScheme: import_prop_types.default.bool
} : void 0;
var CssBaseline_default = CssBaseline;

export {
  html,
  body,
  CssBaseline_default
};
//# sourceMappingURL=chunk-F62E5GLB.js.map
