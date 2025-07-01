import {
  __name
} from "./chunk-JSWZH6GQ.js";

// node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var isProduction = false;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}
__name(invariant, "invariant");

export {
  invariant
};
//# sourceMappingURL=chunk-M5X4REA2.js.map
