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
  __esm,
  __name,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js
function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
  return void 0;
}
function createStyleElement(options) {
  var tag = document.createElement("style");
  tag.setAttribute("data-emotion", options.key);
  if (options.nonce !== void 0) {
    tag.setAttribute("nonce", options.nonce);
  }
  tag.appendChild(document.createTextNode(""));
  tag.setAttribute("data-s", "");
  return tag;
}
var isDevelopment, StyleSheet;
var init_emotion_sheet_development_esm = __esm({
  "node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js"() {
    isDevelopment = true;
    __name(sheetForTag, "sheetForTag");
    __name(createStyleElement, "createStyleElement");
    StyleSheet = function() {
      function StyleSheet2(options) {
        var _this = this;
        this._insertTag = function(tag) {
          var before;
          if (_this.tags.length === 0) {
            if (_this.insertionPoint) {
              before = _this.insertionPoint.nextSibling;
            } else if (_this.prepend) {
              before = _this.container.firstChild;
            } else {
              before = _this.before;
            }
          } else {
            before = _this.tags[_this.tags.length - 1].nextSibling;
          }
          _this.container.insertBefore(tag, before);
          _this.tags.push(tag);
        };
        this.isSpeedy = options.speedy === void 0 ? !isDevelopment : options.speedy;
        this.tags = [];
        this.ctr = 0;
        this.nonce = options.nonce;
        this.key = options.key;
        this.container = options.container;
        this.prepend = options.prepend;
        this.insertionPoint = options.insertionPoint;
        this.before = null;
      }
      __name(StyleSheet2, "StyleSheet");
      var _proto = StyleSheet2.prototype;
      _proto.hydrate = /* @__PURE__ */ __name(function hydrate(nodes) {
        nodes.forEach(this._insertTag);
      }, "hydrate");
      _proto.insert = /* @__PURE__ */ __name(function insert(rule) {
        if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
          this._insertTag(createStyleElement(this));
        }
        var tag = this.tags[this.tags.length - 1];
        {
          var isImportRule3 = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;
          if (isImportRule3 && this._alreadyInsertedOrderInsensitiveRule) {
            console.error("You're attempting to insert the following rule:\n" + rule + "\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.");
          }
          this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule3;
        }
        if (this.isSpeedy) {
          var sheet = sheetForTag(tag);
          try {
            sheet.insertRule(rule, sheet.cssRules.length);
          } catch (e) {
            if (!/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
              console.error('There was a problem inserting the following rule: "' + rule + '"', e);
            }
          }
        } else {
          tag.appendChild(document.createTextNode(rule));
        }
        this.ctr++;
      }, "insert");
      _proto.flush = /* @__PURE__ */ __name(function flush() {
        this.tags.forEach(function(tag) {
          var _tag$parentNode;
          return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
        });
        this.tags = [];
        this.ctr = 0;
        {
          this._alreadyInsertedOrderInsensitiveRule = false;
        }
      }, "flush");
      return StyleSheet2;
    }();
  }
});

// node_modules/stylis/src/Enum.js
var MS, MOZ, WEBKIT, COMMENT, RULESET, DECLARATION, IMPORT, KEYFRAMES, LAYER;
var init_Enum = __esm({
  "node_modules/stylis/src/Enum.js"() {
    MS = "-ms-";
    MOZ = "-moz-";
    WEBKIT = "-webkit-";
    COMMENT = "comm";
    RULESET = "rule";
    DECLARATION = "decl";
    IMPORT = "@import";
    KEYFRAMES = "@keyframes";
    LAYER = "@layer";
  }
});

// node_modules/stylis/src/Utility.js
function hash(value, length2) {
  return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search) {
  return value.indexOf(search);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}
var abs, from, assign;
var init_Utility = __esm({
  "node_modules/stylis/src/Utility.js"() {
    abs = Math.abs;
    from = String.fromCharCode;
    assign = Object.assign;
    __name(hash, "hash");
    __name(trim, "trim");
    __name(match, "match");
    __name(replace, "replace");
    __name(indexof, "indexof");
    __name(charat, "charat");
    __name(substr, "substr");
    __name(strlen, "strlen");
    __name(sizeof, "sizeof");
    __name(append, "append");
    __name(combine, "combine");
  }
});

// node_modules/stylis/src/Tokenizer.js
function node(value, root, parent, type, props, children, length2) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "" };
}
function copy(root, props) {
  return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}
var line, column, length, position, character, characters;
var init_Tokenizer = __esm({
  "node_modules/stylis/src/Tokenizer.js"() {
    init_Utility();
    line = 1;
    column = 1;
    length = 0;
    position = 0;
    character = 0;
    characters = "";
    __name(node, "node");
    __name(copy, "copy");
    __name(char, "char");
    __name(prev, "prev");
    __name(next, "next");
    __name(peek, "peek");
    __name(caret, "caret");
    __name(slice, "slice");
    __name(token, "token");
    __name(alloc, "alloc");
    __name(dealloc, "dealloc");
    __name(delimit, "delimit");
    __name(whitespace, "whitespace");
    __name(escaping, "escaping");
    __name(delimiter, "delimiter");
    __name(commenter, "commenter");
    __name(identifier, "identifier");
  }
});

// node_modules/stylis/src/Parser.js
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
            ampersand = -1;
          break;
        }
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
      if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k++] = z;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2);
}
function comment(value, root, parent) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
}
function declaration(value, root, parent, length2) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
}
var init_Parser = __esm({
  "node_modules/stylis/src/Parser.js"() {
    init_Enum();
    init_Utility();
    init_Tokenizer();
    __name(compile, "compile");
    __name(parse, "parse");
    __name(ruleset, "ruleset");
    __name(comment, "comment");
    __name(declaration, "declaration");
  }
});

// node_modules/stylis/src/Prefixer.js
var init_Prefixer = __esm({
  "node_modules/stylis/src/Prefixer.js"() {
    init_Enum();
    init_Utility();
  }
});

// node_modules/stylis/src/Serializer.js
function serialize(children, callback) {
  var output = "";
  var length2 = sizeof(children);
  for (var i = 0; i < length2; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length) break;
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      element.value = element.props.join(",");
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
var init_Serializer = __esm({
  "node_modules/stylis/src/Serializer.js"() {
    init_Enum();
    init_Utility();
    __name(serialize, "serialize");
    __name(stringify, "stringify");
  }
});

// node_modules/stylis/src/Middleware.js
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
var init_Middleware = __esm({
  "node_modules/stylis/src/Middleware.js"() {
    init_Enum();
    init_Utility();
    init_Tokenizer();
    init_Serializer();
    init_Prefixer();
    __name(middleware, "middleware");
  }
});

// node_modules/stylis/index.js
var init_stylis = __esm({
  "node_modules/stylis/index.js"() {
    init_Enum();
    init_Utility();
    init_Parser();
    init_Prefixer();
    init_Tokenizer();
    init_Serializer();
    init_Middleware();
  }
});

// node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js
var weakMemoize;
var init_emotion_weak_memoize_esm = __esm({
  "node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js"() {
    weakMemoize = /* @__PURE__ */ __name(function weakMemoize2(func) {
      var cache = /* @__PURE__ */ new WeakMap();
      return function(arg) {
        if (cache.has(arg)) {
          return cache.get(arg);
        }
        var ret = func(arg);
        cache.set(arg, ret);
        return ret;
      };
    }, "weakMemoize");
  }
});

// node_modules/@emotion/memoize/dist/emotion-memoize.esm.js
function memoize(fn) {
  var cache = /* @__PURE__ */ Object.create(null);
  return function(arg) {
    if (cache[arg] === void 0) cache[arg] = fn(arg);
    return cache[arg];
  };
}
var init_emotion_memoize_esm = __esm({
  "node_modules/@emotion/memoize/dist/emotion-memoize.esm.js"() {
    __name(memoize, "memoize");
  }
});

// node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js
function prefix2(value, length2) {
  switch (hash(value, length2)) {
    case 5103:
      return WEBKIT + "print-" + value + value;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value;
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length2 > 6) switch (charat(value, length2 + 1)) {
        case 109:
          if (charat(value, length2 + 4) !== 45) break;
        case 102:
          return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
        case 115:
          return ~indexof(value, "stretch") ? prefix2(replace(value, "stretch", "fill-available"), length2) + value : value;
      }
      break;
    case 4949:
      if (charat(value, length2 + 1) !== 115) break;
    case 6444:
      switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
        case 107:
          return replace(value, ":", ":" + WEBKIT) + value;
        case 101:
          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
      }
      break;
    case 5936:
      switch (charat(value, length2 + 11)) {
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
      return WEBKIT + value + MS + value + value;
  }
  return value;
}
var identifierWithPointTracking, toRules, getRules, fixedElements, compat, removeLabel, ignoreFlag, isIgnoringComment, createUnsafeSelectorsAlarm, isImportRule, isPrependedWithRegularRules, nullifyElement, incorrectImportAlarm, prefixer, defaultStylisPlugins, getSourceMap, sourceMapPattern, createCache;
var init_emotion_cache_browser_development_esm = __esm({
  "node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js"() {
    init_emotion_sheet_development_esm();
    init_stylis();
    init_emotion_weak_memoize_esm();
    init_emotion_memoize_esm();
    identifierWithPointTracking = /* @__PURE__ */ __name(function identifierWithPointTracking2(begin, points, index) {
      var previous = 0;
      var character2 = 0;
      while (true) {
        previous = character2;
        character2 = peek();
        if (previous === 38 && character2 === 12) {
          points[index] = 1;
        }
        if (token(character2)) {
          break;
        }
        next();
      }
      return slice(begin, position);
    }, "identifierWithPointTracking");
    toRules = /* @__PURE__ */ __name(function toRules2(parsed, points) {
      var index = -1;
      var character2 = 44;
      do {
        switch (token(character2)) {
          case 0:
            if (character2 === 38 && peek() === 12) {
              points[index] = 1;
            }
            parsed[index] += identifierWithPointTracking(position - 1, points, index);
            break;
          case 2:
            parsed[index] += delimit(character2);
            break;
          case 4:
            if (character2 === 44) {
              parsed[++index] = peek() === 58 ? "&\f" : "";
              points[index] = parsed[index].length;
              break;
            }
          default:
            parsed[index] += from(character2);
        }
      } while (character2 = next());
      return parsed;
    }, "toRules");
    getRules = /* @__PURE__ */ __name(function getRules2(value, points) {
      return dealloc(toRules(alloc(value), points));
    }, "getRules");
    fixedElements = /* @__PURE__ */ new WeakMap();
    compat = /* @__PURE__ */ __name(function compat2(element) {
      if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
      // negative .length indicates that this rule has been already prefixed
      element.length < 1) {
        return;
      }
      var value = element.value;
      var parent = element.parent;
      var isImplicitRule = element.column === parent.column && element.line === parent.line;
      while (parent.type !== "rule") {
        parent = parent.parent;
        if (!parent) return;
      }
      if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
        return;
      }
      if (isImplicitRule) {
        return;
      }
      fixedElements.set(element, true);
      var points = [];
      var rules = getRules(value, points);
      var parentRules = parent.props;
      for (var i = 0, k = 0; i < rules.length; i++) {
        for (var j = 0; j < parentRules.length; j++, k++) {
          element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
        }
      }
    }, "compat");
    removeLabel = /* @__PURE__ */ __name(function removeLabel2(element) {
      if (element.type === "decl") {
        var value = element.value;
        if (
          // charcode for l
          value.charCodeAt(0) === 108 && // charcode for b
          value.charCodeAt(2) === 98
        ) {
          element["return"] = "";
          element.value = "";
        }
      }
    }, "removeLabel");
    ignoreFlag = "emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason";
    isIgnoringComment = /* @__PURE__ */ __name(function isIgnoringComment2(element) {
      return element.type === "comm" && element.children.indexOf(ignoreFlag) > -1;
    }, "isIgnoringComment");
    createUnsafeSelectorsAlarm = /* @__PURE__ */ __name(function createUnsafeSelectorsAlarm2(cache) {
      return function(element, index, children) {
        if (element.type !== "rule" || cache.compat) return;
        var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);
        if (unsafePseudoClasses) {
          var isNested = !!element.parent;
          var commentContainer = isNested ? element.parent.children : (
            // global rule at the root level
            children
          );
          for (var i = commentContainer.length - 1; i >= 0; i--) {
            var node2 = commentContainer[i];
            if (node2.line < element.line) {
              break;
            }
            if (node2.column < element.column) {
              if (isIgnoringComment(node2)) {
                return;
              }
              break;
            }
          }
          unsafePseudoClasses.forEach(function(unsafePseudoClass) {
            console.error('The pseudo class "' + unsafePseudoClass + '" is potentially unsafe when doing server-side rendering. Try changing it to "' + unsafePseudoClass.split("-child")[0] + '-of-type".');
          });
        }
      };
    }, "createUnsafeSelectorsAlarm");
    isImportRule = /* @__PURE__ */ __name(function isImportRule2(element) {
      return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
    }, "isImportRule");
    isPrependedWithRegularRules = /* @__PURE__ */ __name(function isPrependedWithRegularRules2(index, children) {
      for (var i = index - 1; i >= 0; i--) {
        if (!isImportRule(children[i])) {
          return true;
        }
      }
      return false;
    }, "isPrependedWithRegularRules");
    nullifyElement = /* @__PURE__ */ __name(function nullifyElement2(element) {
      element.type = "";
      element.value = "";
      element["return"] = "";
      element.children = "";
      element.props = "";
    }, "nullifyElement");
    incorrectImportAlarm = /* @__PURE__ */ __name(function incorrectImportAlarm2(element, index, children) {
      if (!isImportRule(element)) {
        return;
      }
      if (element.parent) {
        console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
        nullifyElement(element);
      } else if (isPrependedWithRegularRules(index, children)) {
        console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
        nullifyElement(element);
      }
    }, "incorrectImportAlarm");
    __name(prefix2, "prefix");
    prefixer = /* @__PURE__ */ __name(function prefixer2(element, index, children, callback) {
      if (element.length > -1) {
        if (!element["return"]) switch (element.type) {
          case DECLARATION:
            element["return"] = prefix2(element.value, element.length);
            break;
          case KEYFRAMES:
            return serialize([copy(element, {
              value: replace(element.value, "@", "@" + WEBKIT)
            })], callback);
          case RULESET:
            if (element.length) return combine(element.props, function(value) {
              switch (match(value, /(::plac\w+|:read-\w+)/)) {
                case ":read-only":
                case ":read-write":
                  return serialize([copy(element, {
                    props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                  })], callback);
                case "::placeholder":
                  return serialize([copy(element, {
                    props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                  }), copy(element, {
                    props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                  }), copy(element, {
                    props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                  })], callback);
              }
              return "";
            });
        }
      }
    }, "prefixer");
    defaultStylisPlugins = [prefixer];
    {
      sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
      getSourceMap = /* @__PURE__ */ __name(function getSourceMap2(styles) {
        var matches = styles.match(sourceMapPattern);
        if (!matches) return;
        return matches[matches.length - 1];
      }, "getSourceMap");
    }
    createCache = /* @__PURE__ */ __name(function createCache2(options) {
      var key = options.key;
      if (!key) {
        throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\nIf multiple caches share the same key they might \"fight\" for each other's style elements.");
      }
      if (key === "css") {
        var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
        Array.prototype.forEach.call(ssrStyles, function(node2) {
          var dataEmotionAttribute = node2.getAttribute("data-emotion");
          if (dataEmotionAttribute.indexOf(" ") === -1) {
            return;
          }
          document.head.appendChild(node2);
          node2.setAttribute("data-s", "");
        });
      }
      var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
      {
        if (/[^a-z-]/.test(key)) {
          throw new Error('Emotion key must only contain lower case alphabetical characters and - but "' + key + '" was passed');
        }
      }
      var inserted = {};
      var container;
      var nodesToHydrate = [];
      {
        container = options.container || document.head;
        Array.prototype.forEach.call(
          // this means we will ignore elements which don't have a space in them which
          // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
          document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
          function(node2) {
            var attrib = node2.getAttribute("data-emotion").split(" ");
            for (var i = 1; i < attrib.length; i++) {
              inserted[attrib[i]] = true;
            }
            nodesToHydrate.push(node2);
          }
        );
      }
      var _insert;
      var omnipresentPlugins = [compat, removeLabel];
      {
        omnipresentPlugins.push(createUnsafeSelectorsAlarm({
          get compat() {
            return cache.compat;
          }
        }), incorrectImportAlarm);
      }
      {
        var currentSheet;
        var finalizingPlugins = [stringify, function(element) {
          if (!element.root) {
            if (element["return"]) {
              currentSheet.insert(element["return"]);
            } else if (element.value && element.type !== COMMENT) {
              currentSheet.insert(element.value + "{}");
            }
          }
        }];
        var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
        var stylis = /* @__PURE__ */ __name(function stylis2(styles) {
          return serialize(compile(styles), serializer);
        }, "stylis");
        _insert = /* @__PURE__ */ __name(function insert(selector, serialized, sheet, shouldCache) {
          currentSheet = sheet;
          if (getSourceMap) {
            var sourceMap = getSourceMap(serialized.styles);
            if (sourceMap) {
              currentSheet = {
                insert: /* @__PURE__ */ __name(function insert2(rule) {
                  sheet.insert(rule + sourceMap);
                }, "insert")
              };
            }
          }
          stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
          if (shouldCache) {
            cache.inserted[serialized.name] = true;
          }
        }, "insert");
      }
      var cache = {
        key,
        sheet: new StyleSheet({
          key,
          container,
          nonce: options.nonce,
          speedy: options.speedy,
          prepend: options.prepend,
          insertionPoint: options.insertionPoint
        }),
        nonce: options.nonce,
        inserted,
        registered: {},
        insert: _insert
      };
      cache.sheet.hydrate(nodesToHydrate);
      return cache;
    }, "createCache");
  }
});

// node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js
var import_hoist_non_react_statics, hoistNonReactStatics;
var init_emotion_react_isolated_hnrs_browser_development_esm = __esm({
  "node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js"() {
    import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
    hoistNonReactStatics = /* @__PURE__ */ __name(function(targetComponent, sourceComponent) {
      return (0, import_hoist_non_react_statics.default)(targetComponent, sourceComponent);
    }, "hoistNonReactStatics");
  }
});

// node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = "";
  classNames.split(" ").forEach(function(className) {
    if (registered[className] !== void 0) {
      registeredStyles.push(registered[className] + ";");
    } else if (className) {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var isBrowser, registerStyles, insertStyles;
var init_emotion_utils_browser_esm = __esm({
  "node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js"() {
    isBrowser = true;
    __name(getRegisteredStyles, "getRegisteredStyles");
    registerStyles = /* @__PURE__ */ __name(function registerStyles2(cache, serialized, isStringTag) {
      var className = cache.key + "-" + serialized.name;
      if (
        // we only need to add the styles to the registered cache if the
        // class name could be used further down
        // the tree but if it's a string tag, we know it won't
        // so we don't have to add it to registered cache.
        // this improves memory usage since we can avoid storing the whole style string
        (isStringTag === false || // we need to always store it if we're in compat mode and
        // in node since emotion-server relies on whether a style is in
        // the registered cache to know whether a style is global or not
        // also, note that this check will be dead code eliminated in the browser
        isBrowser === false) && cache.registered[className] === void 0
      ) {
        cache.registered[className] = serialized.styles;
      }
    }, "registerStyles");
    insertStyles = /* @__PURE__ */ __name(function insertStyles2(cache, serialized, isStringTag) {
      registerStyles(cache, serialized, isStringTag);
      var className = cache.key + "-" + serialized.name;
      if (cache.inserted[serialized.name] === void 0) {
        var current = serialized;
        do {
          cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
          current = current.next;
        } while (current !== void 0);
      }
    }, "insertStyles");
  }
});

// node_modules/@emotion/hash/dist/emotion-hash.esm.js
function murmur2(str) {
  var h = 0;
  var k, i = 0, len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
    k = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
    k ^= /* k >>> r: */
    k >>> 24;
    h = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 255) << 16;
    case 2:
      h ^= (str.charCodeAt(i + 1) & 255) << 8;
    case 1:
      h ^= str.charCodeAt(i) & 255;
      h = /* Math.imul(h, m): */
      (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  h ^= h >>> 13;
  h = /* Math.imul(h, m): */
  (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}
var init_emotion_hash_esm = __esm({
  "node_modules/@emotion/hash/dist/emotion-hash.esm.js"() {
    __name(murmur2, "murmur2");
  }
});

// node_modules/@emotion/unitless/dist/emotion-unitless.esm.js
var unitlessKeys;
var init_emotion_unitless_esm = __esm({
  "node_modules/@emotion/unitless/dist/emotion-unitless.esm.js"() {
    unitlessKeys = {
      animationIterationCount: 1,
      aspectRatio: 1,
      borderImageOutset: 1,
      borderImageSlice: 1,
      borderImageWidth: 1,
      boxFlex: 1,
      boxFlexGroup: 1,
      boxOrdinalGroup: 1,
      columnCount: 1,
      columns: 1,
      flex: 1,
      flexGrow: 1,
      flexPositive: 1,
      flexShrink: 1,
      flexNegative: 1,
      flexOrder: 1,
      gridRow: 1,
      gridRowEnd: 1,
      gridRowSpan: 1,
      gridRowStart: 1,
      gridColumn: 1,
      gridColumnEnd: 1,
      gridColumnSpan: 1,
      gridColumnStart: 1,
      msGridRow: 1,
      msGridRowSpan: 1,
      msGridColumn: 1,
      msGridColumnSpan: 1,
      fontWeight: 1,
      lineHeight: 1,
      opacity: 1,
      order: 1,
      orphans: 1,
      scale: 1,
      tabSize: 1,
      widows: 1,
      zIndex: 1,
      zoom: 1,
      WebkitLineClamp: 1,
      // SVG-related properties
      fillOpacity: 1,
      floodOpacity: 1,
      stopOpacity: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeMiterlimit: 1,
      strokeOpacity: 1,
      strokeWidth: 1
    };
  }
});

// node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js
function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return "";
  }
  var componentSelector = interpolation;
  if (componentSelector.__emotion_styles !== void 0) {
    if (String(componentSelector) === "NO_COMPONENT_SELECTOR") {
      throw new Error(noComponentSelectorMessage);
    }
    return componentSelector;
  }
  switch (typeof interpolation) {
    case "boolean": {
      return "";
    }
    case "object": {
      var keyframes2 = interpolation;
      if (keyframes2.anim === 1) {
        cursor = {
          name: keyframes2.name,
          styles: keyframes2.styles,
          next: cursor
        };
        return keyframes2.name;
      }
      var serializedStyles = interpolation;
      if (serializedStyles.styles !== void 0) {
        var next2 = serializedStyles.next;
        if (next2 !== void 0) {
          while (next2 !== void 0) {
            cursor = {
              name: next2.name,
              styles: next2.styles,
              next: cursor
            };
            next2 = next2.next;
          }
        }
        var styles = serializedStyles.styles + ";";
        return styles;
      }
      return createStringFromObject(mergedProps, registered, interpolation);
    }
    case "function": {
      if (mergedProps !== void 0) {
        var previousCursor = cursor;
        var result = interpolation(mergedProps);
        cursor = previousCursor;
        return handleInterpolation(mergedProps, registered, result);
      } else {
        console.error("Functions that are interpolated in css calls will be stringified.\nIf you want to have a css call based on props, create a function that returns a css call like this\nlet dynamicStyle = (props) => css`color: ${props.color}`\nIt can be called directly with props or interpolated in a styled call like this\nlet SomeComponent = styled('div')`${dynamicStyle}`");
      }
      break;
    }
    case "string":
      {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function(_match, _p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, "") + "`");
          return "${" + fakeVarName + "}";
        });
        if (matched.length) {
          console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(matched, ["`" + replaced + "`"]).join("\n") + "\n\nYou should wrap it with `css` like this:\n\ncss`" + replaced + "`");
        }
      }
      break;
  }
  var asString = interpolation;
  if (registered == null) {
    return asString;
  }
  var cached = registered[asString];
  return cached !== void 0 ? cached : asString;
}
function createStringFromObject(mergedProps, registered, obj) {
  var string = "";
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var key in obj) {
      var value = obj[key];
      if (typeof value !== "object") {
        var asString = value;
        if (registered != null && registered[asString] !== void 0) {
          string += key + "{" + registered[asString] + "}";
        } else if (isProcessableValue(asString)) {
          string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
        }
      } else {
        if (key === "NO_COMPONENT_SELECTOR" && isDevelopment2) {
          throw new Error(noComponentSelectorMessage);
        }
        if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);
          switch (key) {
            case "animation":
            case "animationName": {
              string += processStyleName(key) + ":" + interpolated + ";";
              break;
            }
            default: {
              if (key === "undefined") {
                console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
              }
              string += key + "{" + interpolated + "}";
            }
          }
        }
      }
    }
  }
  return string;
}
function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
    return args[0];
  }
  var stringMode = true;
  var styles = "";
  cursor = void 0;
  var strings = args[0];
  if (strings == null || strings.raw === void 0) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    var asTemplateStringsArr = strings;
    if (asTemplateStringsArr[0] === void 0) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }
    styles += asTemplateStringsArr[0];
  }
  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);
    if (stringMode) {
      var templateStringsArr = strings;
      if (templateStringsArr[i] === void 0) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }
      styles += templateStringsArr[i];
    }
  }
  labelPattern.lastIndex = 0;
  var identifierName = "";
  var match2;
  while ((match2 = labelPattern.exec(styles)) !== null) {
    identifierName += "-" + match2[1];
  }
  var name = murmur2(styles) + identifierName;
  {
    var devStyles = {
      name,
      styles,
      next: cursor,
      toString: /* @__PURE__ */ __name(function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }, "toString")
    };
    return devStyles;
  }
}
var isDevelopment2, ILLEGAL_ESCAPE_SEQUENCE_ERROR, UNDEFINED_AS_OBJECT_KEY_ERROR, hyphenateRegex, animationRegex, isCustomProperty, isProcessableValue, processStyleName, processStyleValue, contentValuePattern, contentValues, oldProcessStyleValue, msPattern, hyphenPattern, hyphenatedCache, noComponentSelectorMessage, labelPattern, cursor;
var init_emotion_serialize_development_esm = __esm({
  "node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js"() {
    init_emotion_hash_esm();
    init_emotion_unitless_esm();
    init_emotion_memoize_esm();
    isDevelopment2 = true;
    ILLEGAL_ESCAPE_SEQUENCE_ERROR = `You have illegal escape sequence in your template literal, most likely inside content's property value.
Because you write your CSS inside a JavaScript string you actually have to do double escaping, so for example "content: '\\00d7';" should become "content: '\\\\00d7';".
You can read more about this here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences`;
    UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
    hyphenateRegex = /[A-Z]|^ms/g;
    animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
    isCustomProperty = /* @__PURE__ */ __name(function isCustomProperty2(property) {
      return property.charCodeAt(1) === 45;
    }, "isCustomProperty");
    isProcessableValue = /* @__PURE__ */ __name(function isProcessableValue2(value) {
      return value != null && typeof value !== "boolean";
    }, "isProcessableValue");
    processStyleName = memoize(function(styleName) {
      return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
    });
    processStyleValue = /* @__PURE__ */ __name(function processStyleValue2(key, value) {
      switch (key) {
        case "animation":
        case "animationName": {
          if (typeof value === "string") {
            return value.replace(animationRegex, function(match2, p1, p2) {
              cursor = {
                name: p1,
                styles: p2,
                next: cursor
              };
              return p1;
            });
          }
        }
      }
      if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
        return value + "px";
      }
      return value;
    }, "processStyleValue");
    {
      contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
      contentValues = ["normal", "none", "initial", "inherit", "unset"];
      oldProcessStyleValue = processStyleValue;
      msPattern = /^-ms-/;
      hyphenPattern = /-(.)/g;
      hyphenatedCache = {};
      processStyleValue = /* @__PURE__ */ __name(function processStyleValue3(key, value) {
        if (key === "content") {
          if (typeof value !== "string" || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
            throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
          }
        }
        var processed = oldProcessStyleValue(key, value);
        if (processed !== "" && !isCustomProperty(key) && key.indexOf("-") !== -1 && hyphenatedCache[key] === void 0) {
          hyphenatedCache[key] = true;
          console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, "ms-").replace(hyphenPattern, function(str, _char) {
            return _char.toUpperCase();
          }) + "?");
        }
        return processed;
      }, "processStyleValue");
    }
    noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
    __name(handleInterpolation, "handleInterpolation");
    __name(createStringFromObject, "createStringFromObject");
    labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g;
    __name(serializeStyles, "serializeStyles");
  }
});

// node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js
var React, syncFallback, useInsertionEffect2, useInsertionEffectAlwaysWithSyncFallback, useInsertionEffectWithLayoutFallback;
var init_emotion_use_insertion_effect_with_fallbacks_browser_esm = __esm({
  "node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js"() {
    React = __toESM(require_react());
    syncFallback = /* @__PURE__ */ __name(function syncFallback2(create) {
      return create();
    }, "syncFallback");
    useInsertionEffect2 = React["useInsertionEffect"] ? React["useInsertionEffect"] : false;
    useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect2 || syncFallback;
    useInsertionEffectWithLayoutFallback = useInsertionEffect2 || React.useLayoutEffect;
  }
});

// node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || "Component";
  var WithTheme = React2.forwardRef(/* @__PURE__ */ __name(function render(props, ref) {
    var theme = React2.useContext(ThemeContext);
    return React2.createElement(Component, _extends({
      theme,
      ref
    }, props));
  }, "render"));
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return hoistNonReactStatics(WithTheme, Component);
}
var React2, import_react, EmotionCacheContext, CacheProvider, __unsafe_useEmotionCache, withEmotionCache, ThemeContext, useTheme, getTheme, createCacheWithTheme, ThemeProvider, hasOwn, getLastPart, getFunctionNameFromStackTraceLine, internalReactFunctionNames, sanitizeIdentifier, getLabelFromStackTrace, typePropName, labelPropName, createEmotionProps, Insertion, Emotion, Emotion$1;
var init_emotion_element_489459f2_browser_development_esm = __esm({
  "node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js"() {
    React2 = __toESM(require_react());
    import_react = __toESM(require_react());
    init_emotion_cache_browser_development_esm();
    init_extends();
    init_emotion_weak_memoize_esm();
    init_emotion_react_isolated_hnrs_browser_development_esm();
    init_emotion_utils_browser_esm();
    init_emotion_serialize_development_esm();
    init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
    EmotionCacheContext = React2.createContext(
      // we're doing this to avoid preconstruct's dead code elimination in this one case
      // because this module is primarily intended for the browser and node
      // but it's also required in react native and similar environments sometimes
      // and we could have a special build just for that
      // but this is much easier and the native packages
      // might use a different theme context in the future anyway
      typeof HTMLElement !== "undefined" ? createCache({
        key: "css"
      }) : null
    );
    {
      EmotionCacheContext.displayName = "EmotionCacheContext";
    }
    CacheProvider = EmotionCacheContext.Provider;
    __unsafe_useEmotionCache = /* @__PURE__ */ __name(function useEmotionCache() {
      return (0, import_react.useContext)(EmotionCacheContext);
    }, "useEmotionCache");
    withEmotionCache = /* @__PURE__ */ __name(function withEmotionCache2(func) {
      return (0, import_react.forwardRef)(function(props, ref) {
        var cache = (0, import_react.useContext)(EmotionCacheContext);
        return func(props, cache, ref);
      });
    }, "withEmotionCache");
    ThemeContext = React2.createContext({});
    {
      ThemeContext.displayName = "EmotionThemeContext";
    }
    useTheme = /* @__PURE__ */ __name(function useTheme2() {
      return React2.useContext(ThemeContext);
    }, "useTheme");
    getTheme = /* @__PURE__ */ __name(function getTheme2(outerTheme, theme) {
      if (typeof theme === "function") {
        var mergedTheme = theme(outerTheme);
        if (mergedTheme == null || typeof mergedTheme !== "object" || Array.isArray(mergedTheme)) {
          throw new Error("[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!");
        }
        return mergedTheme;
      }
      if (theme == null || typeof theme !== "object" || Array.isArray(theme)) {
        throw new Error("[ThemeProvider] Please make your theme prop a plain object");
      }
      return _extends({}, outerTheme, theme);
    }, "getTheme");
    createCacheWithTheme = weakMemoize(function(outerTheme) {
      return weakMemoize(function(theme) {
        return getTheme(outerTheme, theme);
      });
    });
    ThemeProvider = /* @__PURE__ */ __name(function ThemeProvider2(props) {
      var theme = React2.useContext(ThemeContext);
      if (props.theme !== theme) {
        theme = createCacheWithTheme(theme)(props.theme);
      }
      return React2.createElement(ThemeContext.Provider, {
        value: theme
      }, props.children);
    }, "ThemeProvider");
    __name(withTheme, "withTheme");
    hasOwn = {}.hasOwnProperty;
    getLastPart = /* @__PURE__ */ __name(function getLastPart2(functionName) {
      var parts = functionName.split(".");
      return parts[parts.length - 1];
    }, "getLastPart");
    getFunctionNameFromStackTraceLine = /* @__PURE__ */ __name(function getFunctionNameFromStackTraceLine2(line2) {
      var match2 = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line2);
      if (match2) return getLastPart(match2[1]);
      match2 = /^([A-Za-z0-9$.]+)@/.exec(line2);
      if (match2) return getLastPart(match2[1]);
      return void 0;
    }, "getFunctionNameFromStackTraceLine");
    internalReactFunctionNames = /* @__PURE__ */ new Set(["renderWithHooks", "processChild", "finishClassComponent", "renderToString"]);
    sanitizeIdentifier = /* @__PURE__ */ __name(function sanitizeIdentifier2(identifier2) {
      return identifier2.replace(/\$/g, "-");
    }, "sanitizeIdentifier");
    getLabelFromStackTrace = /* @__PURE__ */ __name(function getLabelFromStackTrace2(stackTrace) {
      if (!stackTrace) return void 0;
      var lines = stackTrace.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var functionName = getFunctionNameFromStackTraceLine(lines[i]);
        if (!functionName) continue;
        if (internalReactFunctionNames.has(functionName)) break;
        if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
      }
      return void 0;
    }, "getLabelFromStackTrace");
    typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
    labelPropName = "__EMOTION_LABEL_PLEASE_DO_NOT_USE__";
    createEmotionProps = /* @__PURE__ */ __name(function createEmotionProps2(type, props) {
      if (typeof props.css === "string" && // check if there is a css declaration
      props.css.indexOf(":") !== -1) {
        throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
      }
      var newProps = {};
      for (var _key in props) {
        if (hasOwn.call(props, _key)) {
          newProps[_key] = props[_key];
        }
      }
      newProps[typePropName] = type;
      if (typeof globalThis !== "undefined" && !!globalThis.EMOTION_RUNTIME_AUTO_LABEL && !!props.css && (typeof props.css !== "object" || !("name" in props.css) || typeof props.css.name !== "string" || props.css.name.indexOf("-") === -1)) {
        var label = getLabelFromStackTrace(new Error().stack);
        if (label) newProps[labelPropName] = label;
      }
      return newProps;
    }, "createEmotionProps");
    Insertion = /* @__PURE__ */ __name(function Insertion2(_ref) {
      var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
      registerStyles(cache, serialized, isStringTag);
      useInsertionEffectAlwaysWithSyncFallback(function() {
        return insertStyles(cache, serialized, isStringTag);
      });
      return null;
    }, "Insertion");
    Emotion = withEmotionCache(function(props, cache, ref) {
      var cssProp = props.css;
      if (typeof cssProp === "string" && cache.registered[cssProp] !== void 0) {
        cssProp = cache.registered[cssProp];
      }
      var WrappedComponent = props[typePropName];
      var registeredStyles = [cssProp];
      var className = "";
      if (typeof props.className === "string") {
        className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }
      var serialized = serializeStyles(registeredStyles, void 0, React2.useContext(ThemeContext));
      if (serialized.name.indexOf("-") === -1) {
        var labelFromStack = props[labelPropName];
        if (labelFromStack) {
          serialized = serializeStyles([serialized, "label:" + labelFromStack + ";"]);
        }
      }
      className += cache.key + "-" + serialized.name;
      var newProps = {};
      for (var _key2 in props) {
        if (hasOwn.call(props, _key2) && _key2 !== "css" && _key2 !== typePropName && _key2 !== labelPropName) {
          newProps[_key2] = props[_key2];
        }
      }
      newProps.className = className;
      if (ref) {
        newProps.ref = ref;
      }
      return React2.createElement(React2.Fragment, null, React2.createElement(Insertion, {
        cache,
        serialized,
        isStringTag: typeof WrappedComponent === "string"
      }), React2.createElement(WrappedComponent, newProps));
    });
    {
      Emotion.displayName = "EmotionCssPropInternal";
    }
    Emotion$1 = Emotion;
  }
});

// node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js
function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return serializeStyles(args);
}
function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name;
  return {
    name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: /* @__PURE__ */ __name(function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }, "toString")
  };
}
function merge(registered, css2, className) {
  var registeredStyles = [];
  var rawClassName = getRegisteredStyles(registered, registeredStyles, className);
  if (registeredStyles.length < 2) {
    return className;
  }
  return rawClassName + css2(registeredStyles);
}
var React3, import_hoist_non_react_statics2, isDevelopment3, pkg, jsx, warnedAboutCssPropForGlobal, Global, classnames, Insertion3, ClassNames, isBrowser2, isTestEnv, globalContext, globalKey;
var init_emotion_react_browser_development_esm = __esm({
  "node_modules/@emotion/react/dist/emotion-react.browser.development.esm.js"() {
    init_emotion_element_489459f2_browser_development_esm();
    init_emotion_element_489459f2_browser_development_esm();
    React3 = __toESM(require_react());
    init_emotion_utils_browser_esm();
    init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
    init_emotion_serialize_development_esm();
    init_emotion_cache_browser_development_esm();
    init_extends();
    init_emotion_weak_memoize_esm();
    init_emotion_react_isolated_hnrs_browser_development_esm();
    import_hoist_non_react_statics2 = __toESM(require_hoist_non_react_statics_cjs());
    isDevelopment3 = true;
    pkg = {
      name: "@emotion/react",
      version: "11.14.0",
      main: "dist/emotion-react.cjs.js",
      module: "dist/emotion-react.esm.js",
      types: "dist/emotion-react.cjs.d.ts",
      exports: {
        ".": {
          types: {
            "import": "./dist/emotion-react.cjs.mjs",
            "default": "./dist/emotion-react.cjs.js"
          },
          development: {
            "edge-light": {
              module: "./dist/emotion-react.development.edge-light.esm.js",
              "import": "./dist/emotion-react.development.edge-light.cjs.mjs",
              "default": "./dist/emotion-react.development.edge-light.cjs.js"
            },
            worker: {
              module: "./dist/emotion-react.development.edge-light.esm.js",
              "import": "./dist/emotion-react.development.edge-light.cjs.mjs",
              "default": "./dist/emotion-react.development.edge-light.cjs.js"
            },
            workerd: {
              module: "./dist/emotion-react.development.edge-light.esm.js",
              "import": "./dist/emotion-react.development.edge-light.cjs.mjs",
              "default": "./dist/emotion-react.development.edge-light.cjs.js"
            },
            browser: {
              module: "./dist/emotion-react.browser.development.esm.js",
              "import": "./dist/emotion-react.browser.development.cjs.mjs",
              "default": "./dist/emotion-react.browser.development.cjs.js"
            },
            module: "./dist/emotion-react.development.esm.js",
            "import": "./dist/emotion-react.development.cjs.mjs",
            "default": "./dist/emotion-react.development.cjs.js"
          },
          "edge-light": {
            module: "./dist/emotion-react.edge-light.esm.js",
            "import": "./dist/emotion-react.edge-light.cjs.mjs",
            "default": "./dist/emotion-react.edge-light.cjs.js"
          },
          worker: {
            module: "./dist/emotion-react.edge-light.esm.js",
            "import": "./dist/emotion-react.edge-light.cjs.mjs",
            "default": "./dist/emotion-react.edge-light.cjs.js"
          },
          workerd: {
            module: "./dist/emotion-react.edge-light.esm.js",
            "import": "./dist/emotion-react.edge-light.cjs.mjs",
            "default": "./dist/emotion-react.edge-light.cjs.js"
          },
          browser: {
            module: "./dist/emotion-react.browser.esm.js",
            "import": "./dist/emotion-react.browser.cjs.mjs",
            "default": "./dist/emotion-react.browser.cjs.js"
          },
          module: "./dist/emotion-react.esm.js",
          "import": "./dist/emotion-react.cjs.mjs",
          "default": "./dist/emotion-react.cjs.js"
        },
        "./jsx-runtime": {
          types: {
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
          },
          development: {
            "edge-light": {
              module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
              "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
            },
            worker: {
              module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
              "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
            },
            workerd: {
              module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
              "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
            },
            browser: {
              module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.esm.js",
              "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.mjs",
              "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.js"
            },
            module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.esm.js",
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.js"
          },
          "edge-light": {
            module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
          },
          worker: {
            module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
          },
          workerd: {
            module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
          },
          browser: {
            module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js",
            "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.mjs",
            "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.js"
          },
          module: "./jsx-runtime/dist/emotion-react-jsx-runtime.esm.js",
          "import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
          "default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
        },
        "./_isolated-hnrs": {
          types: {
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
          },
          development: {
            "edge-light": {
              module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
              "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
              "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
            },
            worker: {
              module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
              "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
              "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
            },
            workerd: {
              module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
              "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
              "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
            },
            browser: {
              module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js",
              "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.mjs",
              "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.js"
            },
            module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.esm.js",
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.js"
          },
          "edge-light": {
            module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
          },
          worker: {
            module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
          },
          workerd: {
            module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
          },
          browser: {
            module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js",
            "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.mjs",
            "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.js"
          },
          module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.esm.js",
          "import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
          "default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
        },
        "./jsx-dev-runtime": {
          types: {
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
          },
          development: {
            "edge-light": {
              module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
              "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
            },
            worker: {
              module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
              "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
            },
            workerd: {
              module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
              "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
              "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
            },
            browser: {
              module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js",
              "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.mjs",
              "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.js"
            },
            module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.esm.js",
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.js"
          },
          "edge-light": {
            module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
          },
          worker: {
            module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
          },
          workerd: {
            module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
          },
          browser: {
            module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.esm.js",
            "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.mjs",
            "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.js"
          },
          module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.esm.js",
          "import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
          "default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
        },
        "./package.json": "./package.json",
        "./types/css-prop": "./types/css-prop.d.ts",
        "./macro": {
          types: {
            "import": "./macro.d.mts",
            "default": "./macro.d.ts"
          },
          "default": "./macro.js"
        }
      },
      imports: {
        "#is-development": {
          development: "./src/conditions/true.ts",
          "default": "./src/conditions/false.ts"
        },
        "#is-browser": {
          "edge-light": "./src/conditions/false.ts",
          workerd: "./src/conditions/false.ts",
          worker: "./src/conditions/false.ts",
          browser: "./src/conditions/true.ts",
          "default": "./src/conditions/is-browser.ts"
        }
      },
      files: [
        "src",
        "dist",
        "jsx-runtime",
        "jsx-dev-runtime",
        "_isolated-hnrs",
        "types/css-prop.d.ts",
        "macro.*"
      ],
      sideEffects: false,
      author: "Emotion Contributors",
      license: "MIT",
      scripts: {
        "test:typescript": "dtslint types"
      },
      dependencies: {
        "@babel/runtime": "^7.18.3",
        "@emotion/babel-plugin": "^11.13.5",
        "@emotion/cache": "^11.14.0",
        "@emotion/serialize": "^1.3.3",
        "@emotion/use-insertion-effect-with-fallbacks": "^1.2.0",
        "@emotion/utils": "^1.4.2",
        "@emotion/weak-memoize": "^0.4.0",
        "hoist-non-react-statics": "^3.3.1"
      },
      peerDependencies: {
        react: ">=16.8.0"
      },
      peerDependenciesMeta: {
        "@types/react": {
          optional: true
        }
      },
      devDependencies: {
        "@definitelytyped/dtslint": "0.0.112",
        "@emotion/css": "11.13.5",
        "@emotion/css-prettifier": "1.2.0",
        "@emotion/server": "11.11.0",
        "@emotion/styled": "11.14.0",
        "@types/hoist-non-react-statics": "^3.3.5",
        "html-tag-names": "^1.1.2",
        react: "16.14.0",
        "svg-tag-names": "^1.1.1",
        typescript: "^5.4.5"
      },
      repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
      publishConfig: {
        access: "public"
      },
      "umd:main": "dist/emotion-react.umd.min.js",
      preconstruct: {
        entrypoints: [
          "./index.ts",
          "./jsx-runtime.ts",
          "./jsx-dev-runtime.ts",
          "./_isolated-hnrs.ts"
        ],
        umdName: "emotionReact",
        exports: {
          extra: {
            "./types/css-prop": "./types/css-prop.d.ts",
            "./macro": {
              types: {
                "import": "./macro.d.mts",
                "default": "./macro.d.ts"
              },
              "default": "./macro.js"
            }
          }
        }
      }
    };
    jsx = /* @__PURE__ */ __name(function jsx2(type, props) {
      var args = arguments;
      if (props == null || !hasOwn.call(props, "css")) {
        return React3.createElement.apply(void 0, args);
      }
      var argsLength = args.length;
      var createElementArgArray = new Array(argsLength);
      createElementArgArray[0] = Emotion$1;
      createElementArgArray[1] = createEmotionProps(type, props);
      for (var i = 2; i < argsLength; i++) {
        createElementArgArray[i] = args[i];
      }
      return React3.createElement.apply(null, createElementArgArray);
    }, "jsx");
    (function(_jsx) {
      var JSX;
      /* @__PURE__ */ (function(_JSX) {
      })(JSX || (JSX = _jsx.JSX || (_jsx.JSX = {})));
    })(jsx || (jsx = {}));
    warnedAboutCssPropForGlobal = false;
    Global = withEmotionCache(function(props, cache) {
      if (!warnedAboutCssPropForGlobal && // check for className as well since the user is
      // probably using the custom createElement which
      // means it will be turned into a className prop
      // I don't really want to add it to the type since it shouldn't be used
      ("className" in props && props.className || "css" in props && props.css)) {
        console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
        warnedAboutCssPropForGlobal = true;
      }
      var styles = props.styles;
      var serialized = serializeStyles([styles], void 0, React3.useContext(ThemeContext));
      var sheetRef = React3.useRef();
      useInsertionEffectWithLayoutFallback(function() {
        var key = cache.key + "-global";
        var sheet = new cache.sheet.constructor({
          key,
          nonce: cache.sheet.nonce,
          container: cache.sheet.container,
          speedy: cache.sheet.isSpeedy
        });
        var rehydrating = false;
        var node2 = document.querySelector('style[data-emotion="' + key + " " + serialized.name + '"]');
        if (cache.sheet.tags.length) {
          sheet.before = cache.sheet.tags[0];
        }
        if (node2 !== null) {
          rehydrating = true;
          node2.setAttribute("data-emotion", key);
          sheet.hydrate([node2]);
        }
        sheetRef.current = [sheet, rehydrating];
        return function() {
          sheet.flush();
        };
      }, [cache]);
      useInsertionEffectWithLayoutFallback(function() {
        var sheetRefCurrent = sheetRef.current;
        var sheet = sheetRefCurrent[0], rehydrating = sheetRefCurrent[1];
        if (rehydrating) {
          sheetRefCurrent[1] = false;
          return;
        }
        if (serialized.next !== void 0) {
          insertStyles(cache, serialized.next, true);
        }
        if (sheet.tags.length) {
          var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
          sheet.before = element;
          sheet.flush();
        }
        cache.insert("", serialized, sheet, false);
      }, [cache, serialized.name]);
      return null;
    });
    {
      Global.displayName = "EmotionGlobal";
    }
    __name(css, "css");
    __name(keyframes, "keyframes");
    classnames = /* @__PURE__ */ __name(function classnames2(args) {
      var len = args.length;
      var i = 0;
      var cls = "";
      for (; i < len; i++) {
        var arg = args[i];
        if (arg == null) continue;
        var toAdd = void 0;
        switch (typeof arg) {
          case "boolean":
            break;
          case "object": {
            if (Array.isArray(arg)) {
              toAdd = classnames2(arg);
            } else {
              if (arg.styles !== void 0 && arg.name !== void 0) {
                console.error("You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.");
              }
              toAdd = "";
              for (var k in arg) {
                if (arg[k] && k) {
                  toAdd && (toAdd += " ");
                  toAdd += k;
                }
              }
            }
            break;
          }
          default: {
            toAdd = arg;
          }
        }
        if (toAdd) {
          cls && (cls += " ");
          cls += toAdd;
        }
      }
      return cls;
    }, "classnames");
    __name(merge, "merge");
    Insertion3 = /* @__PURE__ */ __name(function Insertion4(_ref) {
      var cache = _ref.cache, serializedArr = _ref.serializedArr;
      useInsertionEffectAlwaysWithSyncFallback(function() {
        for (var i = 0; i < serializedArr.length; i++) {
          insertStyles(cache, serializedArr[i], false);
        }
      });
      return null;
    }, "Insertion");
    ClassNames = withEmotionCache(function(props, cache) {
      var hasRendered = false;
      var serializedArr = [];
      var css2 = /* @__PURE__ */ __name(function css3() {
        if (hasRendered && isDevelopment3) {
          throw new Error("css can only be used during render");
        }
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var serialized = serializeStyles(args, cache.registered);
        serializedArr.push(serialized);
        registerStyles(cache, serialized, false);
        return cache.key + "-" + serialized.name;
      }, "css");
      var cx = /* @__PURE__ */ __name(function cx2() {
        if (hasRendered && isDevelopment3) {
          throw new Error("cx can only be used during render");
        }
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return merge(cache.registered, css2, classnames(args));
      }, "cx");
      var content = {
        css: css2,
        cx,
        theme: React3.useContext(ThemeContext)
      };
      var ele = props.children(content);
      hasRendered = true;
      return React3.createElement(React3.Fragment, null, React3.createElement(Insertion3, {
        cache,
        serializedArr
      }), ele);
    });
    {
      ClassNames.displayName = "EmotionClassNames";
    }
    {
      isBrowser2 = typeof document !== "undefined";
      isTestEnv = typeof jest !== "undefined" || typeof vi !== "undefined";
      if (isBrowser2 && !isTestEnv) {
        globalContext = typeof globalThis !== "undefined" ? globalThis : isBrowser2 ? window : global;
        globalKey = "__EMOTION_REACT_" + pkg.version.split(".")[0] + "__";
        if (globalContext[globalKey]) {
          console.warn("You are loading @emotion/react when it is already loaded. Running multiple instances may cause problems. This can happen if multiple versions are used, or if multiple builds of the same version are used.");
        }
        globalContext[globalKey] = true;
      }
    }
  }
});

export {
  memoize,
  init_emotion_memoize_esm,
  createCache,
  init_emotion_cache_browser_development_esm,
  getRegisteredStyles,
  registerStyles,
  insertStyles,
  init_emotion_utils_browser_esm,
  serializeStyles,
  init_emotion_serialize_development_esm,
  useInsertionEffectAlwaysWithSyncFallback,
  init_emotion_use_insertion_effect_with_fallbacks_browser_esm,
  CacheProvider,
  __unsafe_useEmotionCache,
  withEmotionCache,
  ThemeContext,
  useTheme,
  ThemeProvider,
  withTheme,
  jsx,
  Global,
  css,
  keyframes,
  ClassNames,
  init_emotion_react_browser_development_esm
};
//# sourceMappingURL=chunk-KPOJAITF.js.map
