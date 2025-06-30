import {
  DefaultPropsProvider_default,
  GlobalStyles_default,
  defaultTheme_default,
  identifier_default,
  useDefaultProps
} from "./chunk-TTN5RY6T.js";
import {
  require_jsx_runtime
} from "./chunk-UVB6IW5S.js";
import {
  require_prop_types
} from "./chunk-Q23ZINBZ.js";
import {
  _extends,
  init_extends
} from "./chunk-4LY3UBVW.js";
import {
  require_react
} from "./chunk-YGUP7UQF.js";
import {
  __name,
  __toESM
} from "./chunk-Z43UC6KN.js";

// node_modules/@mui/material/GlobalStyles/GlobalStyles.js
init_extends();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function GlobalStyles(props) {
  return (0, import_jsx_runtime.jsx)(GlobalStyles_default, _extends({}, props, {
    defaultTheme: defaultTheme_default,
    themeId: identifier_default
  }));
}
__name(GlobalStyles, "GlobalStyles");
true ? GlobalStyles.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The styles you want to apply globally.
   */
  styles: import_prop_types.default.oneOfType([import_prop_types.default.array, import_prop_types.default.func, import_prop_types.default.number, import_prop_types.default.object, import_prop_types.default.string, import_prop_types.default.bool])
} : void 0;
var GlobalStyles_default2 = GlobalStyles;

// node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js
init_extends();
var React2 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function DefaultPropsProvider(props) {
  return (0, import_jsx_runtime2.jsx)(DefaultPropsProvider_default, _extends({}, props));
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
  children: import_prop_types2.default.node,
  /**
   * @ignore
   */
  value: import_prop_types2.default.object.isRequired
} : void 0;
function useDefaultProps2(params) {
  return useDefaultProps(params);
}
__name(useDefaultProps2, "useDefaultProps");

export {
  useDefaultProps2 as useDefaultProps,
  GlobalStyles_default2 as GlobalStyles_default
};
//# sourceMappingURL=chunk-K3QTIL7G.js.map
