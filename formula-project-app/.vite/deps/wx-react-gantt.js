import {
  require_react
} from "./chunk-LK4O2NHZ.js";
import {
  __name,
  __publicField,
  __toESM
} from "./chunk-JSWZH6GQ.js";

// node_modules/wx-react-gantt/dist/gantt.js
var import_react = __toESM(require_react());
function I() {
}
__name(I, "I");
function We(l, e) {
  for (const t in e) l[t] = e[t];
  return (
    /** @type {T & S} */
    l
  );
}
__name(We, "We");
function co(l) {
  return l();
}
__name(co, "co");
function Tl() {
  return /* @__PURE__ */ Object.create(null);
}
__name(Tl, "Tl");
function Ee(l) {
  l.forEach(co);
}
__name(Ee, "Ee");
function ot(l) {
  return typeof l == "function";
}
__name(ot, "ot");
function x(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
__name(x, "x");
function Wr(l) {
  return Object.keys(l).length === 0;
}
__name(Wr, "Wr");
function Lt(l) {
  for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    e[_key - 1] = arguments[_key];
  }
  if (l == null) {
    for (const n of e) n(void 0);
    return I;
  }
  const t = l.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
__name(Lt, "Lt");
function ce(l, e, t) {
  l.$$.on_destroy.push(Lt(e, t));
}
__name(ce, "ce");
function Ie(l, e, t, n) {
  if (l) {
    const i = uo(l, e, t, n);
    return l[0](i);
  }
}
__name(Ie, "Ie");
function uo(l, e, t, n) {
  return l[1] && n ? We(t.ctx.slice(), l[1](n(e))) : t.ctx;
}
__name(uo, "uo");
function Re(l, e, t, n) {
  if (l[2] && n) {
    const i = l[2](n(t));
    if (e.dirty === void 0) return i;
    if (typeof i == "object") {
      const s = [], o = Math.max(e.dirty.length, i.length);
      for (let a = 0; a < o; a += 1) s[a] = e.dirty[a] | i[a];
      return s;
    }
    return e.dirty | i;
  }
  return e.dirty;
}
__name(Re, "Re");
function Oe(l, e, t, n, i, s) {
  if (i) {
    const o = uo(e, t, n, s);
    l.p(o, i);
  }
}
__name(Oe, "Oe");
function Ae(l) {
  if (l.ctx.length > 32) {
    const e = [], t = l.ctx.length / 32;
    for (let n = 0; n < t; n++) e[n] = -1;
    return e;
  }
  return -1;
}
__name(Ae, "Ae");
function qe(l) {
  const e = {};
  for (const t in l) t[0] !== "$" && (e[t] = l[t]);
  return e;
}
__name(qe, "qe");
function Ve(l) {
  return l ?? "";
}
__name(Ve, "Ve");
function Cl(l, e, t) {
  return l.set(t), e;
}
__name(Cl, "Cl");
function nt(l) {
  return l && ot(l.destroy) ? l.destroy : I;
}
__name(nt, "nt");
function H(l, e) {
  l.appendChild(e);
}
__name(H, "H");
function S(l, e, t) {
  l.insertBefore(e, t || null);
}
__name(S, "S");
function v(l) {
  l.parentNode && l.parentNode.removeChild(l);
}
__name(v, "v");
function $e(l, e) {
  for (let t = 0; t < l.length; t += 1) l[t] && l[t].d(e);
}
__name($e, "$e");
function D(l) {
  return document.createElement(l);
}
__name(D, "D");
function ll(l) {
  return document.createElementNS("http://www.w3.org/2000/svg", l);
}
__name(ll, "ll");
function re(l) {
  return document.createTextNode(l);
}
__name(re, "re");
function Y() {
  return re(" ");
}
__name(Y, "Y");
function se() {
  return re("");
}
__name(se, "se");
function q(l, e, t, n) {
  return l.addEventListener(e, t, n), () => l.removeEventListener(e, t, n);
}
__name(q, "q");
function En(l) {
  return function(e) {
    return e.stopPropagation(), l.call(this, e);
  };
}
__name(En, "En");
function g(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
__name(g, "g");
function il(l) {
  return l === "" ? null : +l;
}
__name(il, "il");
function Hr(l) {
  return Array.from(l.childNodes);
}
__name(Hr, "Hr");
function me(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
__name(me, "me");
function Ue(l, e) {
  l.value = e ?? "";
}
__name(Ue, "Ue");
function j(l, e, t, n) {
  t == null ? l.style.removeProperty(e) : l.style.setProperty(e, t, "");
}
__name(j, "j");
var yn;
function zr() {
  if (yn === void 0) {
    yn = false;
    try {
      typeof window < "u" && window.parent && window.parent.document;
    } catch {
      yn = true;
    }
  }
  return yn;
}
__name(zr, "zr");
function sl(l, e) {
  getComputedStyle(l).position === "static" && (l.style.position = "relative");
  const n = D("iframe");
  n.setAttribute("style", "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"), n.setAttribute("aria-hidden", "true"), n.tabIndex = -1;
  const i = zr();
  let s;
  return i ? (n.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>", s = q(
    window,
    "message",
    /** @param {MessageEvent} event */
    (o) => {
      o.source === n.contentWindow && e();
    }
  )) : (n.src = "about:blank", n.onload = () => {
    s = q(n.contentWindow, "resize", e), e();
  }), H(l, n), () => {
    (i || s && n.contentWindow) && s(), v(n);
  };
}
__name(sl, "sl");
function Q(l, e, t) {
  l.classList.toggle(e, !!t);
}
__name(Q, "Q");
function Nr(l, e) {
  let { bubbles: t = false, cancelable: n = false } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: n });
}
__name(Nr, "Nr");
var _ol = class _ol {
  constructor() {
    /**
    * @private
    * @default false
    */
    __publicField(this, "is_svg", /* @__PURE__ */ (() => false)());
    /** parent for creating node */
    __publicField(this, "e", /* @__PURE__ */ (() => void 0)());
    /** html tag nodes */
    __publicField(this, "n", /* @__PURE__ */ (() => void 0)());
    /** target */
    __publicField(this, "t", /* @__PURE__ */ (() => void 0)());
    /** anchor */
    __publicField(this, "a", /* @__PURE__ */ (() => void 0)());
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    this.is_svg = e, this.e = this.n = null;
  }
  /**
  * @param {string} html
  * @returns {void}
  */
  c(e) {
    this.h(e);
  }
  /**
  * @param {string} html
  * @param {HTMLElement | SVGElement} target
  * @param {HTMLElement | SVGElement} anchor
  * @returns {void}
  */
  m(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    this.e || (this.is_svg ? this.e = ll(
      /** @type {keyof SVGElementTagNameMap} */
      t.nodeName
    ) : this.e = D(
      /** @type {keyof HTMLElementTagNameMap} */
      t.nodeType === 11 ? "TEMPLATE" : t.nodeName
    ), this.t = t.tagName !== "TEMPLATE" ? t : (
      /** @type {HTMLTemplateElement} */
      t.content
    ), this.c(e)), this.i(n);
  }
  /**
  * @param {string} html
  * @returns {void}
  */
  h(e) {
    this.e.innerHTML = e, this.n = Array.from(this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes);
  }
  /**
  * @returns {void} */
  i(e) {
    for (let t = 0; t < this.n.length; t += 1) S(this.t, this.n[t], e);
  }
  /**
  * @param {string} html
  * @returns {void}
  */
  p(e) {
    this.d(), this.h(e), this.i(this.a);
  }
  /**
  * @returns {void} */
  d() {
    this.n.forEach(v);
  }
};
__name(_ol, "ol");
var ol = _ol;
function Le(l, e) {
  return new l(e);
}
__name(Le, "Le");
var dn;
function cn(l) {
  dn = l;
}
__name(cn, "cn");
function $t() {
  if (!dn) throw new Error("Function called outside component initialization");
  return dn;
}
__name($t, "$t");
function ht(l) {
  $t().$$.on_mount.push(l);
}
__name(ht, "ht");
function kn(l) {
  $t().$$.after_update.push(l);
}
__name(kn, "kn");
function rl(l) {
  $t().$$.on_destroy.push(l);
}
__name(rl, "rl");
function He() {
  const l = $t();
  return function(e, t) {
    let { cancelable: n = false } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const i = l.$$.callbacks[e];
    if (i) {
      const s = Nr(
        /** @type {string} */
        e,
        t,
        { cancelable: n }
      );
      return i.slice().forEach((o) => {
        o.call(l, s);
      }), !s.defaultPrevented;
    }
    return true;
  };
}
__name(He, "He");
function It(l, e) {
  return $t().$$.context.set(l, e), e;
}
__name(It, "It");
function ze(l) {
  return $t().$$.context.get(l);
}
__name(ze, "ze");
function De(l, e) {
  const t = l.$$.callbacks[e.type];
  t && t.slice().forEach((n) => n.call(this, e));
}
__name(De, "De");
var qt = [];
var be = [];
var Gt = [];
var Gn = [];
var fo = Promise.resolve();
var Xn = false;
function ho() {
  Xn || (Xn = true, fo.then(mo));
}
__name(ho, "ho");
function Dn() {
  return ho(), fo;
}
__name(Dn, "Dn");
function Vt(l) {
  Gt.push(l);
}
__name(Vt, "Vt");
function dt(l) {
  Gn.push(l);
}
__name(dt, "dt");
var Bn = /* @__PURE__ */ new Set();
var Yt = 0;
function mo() {
  if (Yt !== 0) return;
  const l = dn;
  do {
    try {
      for (; Yt < qt.length; ) {
        const e = qt[Yt];
        Yt++, cn(e), Lr(e.$$);
      }
    } catch (e) {
      throw qt.length = 0, Yt = 0, e;
    }
    for (cn(null), qt.length = 0, Yt = 0; be.length; ) be.pop()();
    for (let e = 0; e < Gt.length; e += 1) {
      const t = Gt[e];
      Bn.has(t) || (Bn.add(t), t());
    }
    Gt.length = 0;
  } while (qt.length);
  for (; Gn.length; ) Gn.pop()();
  Xn = false, Bn.clear(), cn(l);
}
__name(mo, "mo");
function Lr(l) {
  if (l.fragment !== null) {
    l.update(), Ee(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(Vt);
  }
}
__name(Lr, "Lr");
function Er(l) {
  const e = [], t = [];
  Gt.forEach((n) => l.indexOf(n) === -1 ? e.push(n) : t.push(n)), t.forEach((n) => n()), Gt = e;
}
__name(Er, "Er");
var Cn = /* @__PURE__ */ new Set();
var Et;
function te() {
  Et = {
    r: 0,
    c: [],
    p: Et
    // parent group
  };
}
__name(te, "te");
function ne() {
  Et.r || Ee(Et.c), Et = Et.p;
}
__name(ne, "ne");
function k(l, e) {
  l && l.i && (Cn.delete(l), l.i(e));
}
__name(k, "k");
function y(l, e, t, n) {
  if (l && l.o) {
    if (Cn.has(l)) return;
    Cn.add(l), Et.c.push(() => {
      Cn.delete(l), n && (t && l.d(1), n());
    }), l.o(e);
  } else n && n();
}
__name(y, "y");
function de(l) {
  return l?.length !== void 0 ? l : Array.from(l);
}
__name(de, "de");
function al(l, e) {
  l.d(1), e.delete(l.key);
}
__name(al, "al");
function en(l, e) {
  y(l, 1, 1, () => {
    e.delete(l.key);
  });
}
__name(en, "en");
function kt(l, e, t, n, i, s, o, a, r, c, u, f) {
  let d = l.length, h = s.length, m = d;
  const _ = {};
  for (; m--; ) _[l[m].key] = m;
  const w = [], b = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), z = [];
  for (m = h; m--; ) {
    const C = f(i, s, m), P = t(C);
    let X = o.get(P);
    X ? z.push(() => X.p(C, e)) : (X = c(P, C), X.c()), b.set(P, w[m] = X), P in _ && p.set(P, Math.abs(m - _[P]));
  }
  const T = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Set();
  function M(C) {
    k(C, 1), C.m(a, u), o.set(C.key, C), u = C.first, h--;
  }
  __name(M, "M");
  for (; d && h; ) {
    const C = w[h - 1], P = l[d - 1], X = C.key, A = P.key;
    C === P ? (u = C.first, d--, h--) : b.has(A) ? !o.has(X) || T.has(X) ? M(C) : W.has(A) ? d-- : p.get(X) > p.get(A) ? (W.add(X), M(C)) : (T.add(A), d--) : (r(P, o), d--);
  }
  for (; d--; ) {
    const C = l[d];
    b.has(C.key) || r(C, o);
  }
  for (; h; ) M(w[h - 1]);
  return Ee(z), w;
}
__name(kt, "kt");
function Ut(l, e) {
  const t = {}, n = {}, i = { $$scope: 1 };
  let s = l.length;
  for (; s--; ) {
    const o = l[s], a = e[s];
    if (a) {
      for (const r in o) r in a || (n[r] = 1);
      for (const r in a) i[r] || (t[r] = a[r], i[r] = 1);
      l[s] = a;
    } else for (const r in o) i[r] = 1;
  }
  for (const o in n) o in t || (t[o] = void 0);
  return t;
}
__name(Ut, "Ut");
function Jt(l) {
  return typeof l == "object" && l !== null ? l : {};
}
__name(Jt, "Jt");
function rt(l, e, t) {
  const n = l.$$.props[e];
  n !== void 0 && (l.$$.bound[n] = t, t(l.$$.ctx[n]));
}
__name(rt, "rt");
function F(l) {
  l && l.c();
}
__name(F, "F");
function R(l, e, t) {
  const { fragment: n, after_update: i } = l.$$;
  n && n.m(e, t), Vt(() => {
    const s = l.$$.on_mount.map(co).filter(ot);
    l.$$.on_destroy ? l.$$.on_destroy.push(...s) : Ee(s), l.$$.on_mount = [];
  }), i.forEach(Vt);
}
__name(R, "R");
function O(l, e) {
  const t = l.$$;
  t.fragment !== null && (Er(t.after_update), Ee(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
__name(O, "O");
function Ir(l, e) {
  l.$$.dirty[0] === -1 && (qt.push(l), ho(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
__name(Ir, "Ir");
function $(l, e, t, n, i, s) {
  let o = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : null;
  let a = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : [-1];
  const r = dn;
  cn(l);
  const c = l.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: s,
    update: I,
    not_equal: i,
    bound: Tl(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (r ? r.$$.context : [])),
    // everything else
    callbacks: Tl(),
    dirty: a,
    skip_bound: false,
    root: e.target || r.$$.root
  };
  o && o(c.root);
  let u = false;
  if (c.ctx = t ? t(l, e.props || {}, function(f, d) {
    const m = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? void 0 : arguments[2] : d;
    return c.ctx && i(c.ctx[f], c.ctx[f] = m) && (!c.skip_bound && c.bound[f] && c.bound[f](m), u && Ir(l, f)), d;
  }) : [], c.update(), u = true, Ee(c.before_update), c.fragment = n ? n(c.ctx) : false, e.target) {
    if (e.hydrate) {
      const f = Hr(e.target);
      c.fragment && c.fragment.l(f), f.forEach(v);
    } else c.fragment && c.fragment.c();
    e.intro && k(l.$$.fragment), R(l, e.target, e.anchor), mo();
  }
  cn(r);
}
__name($, "$");
var _ee = class _ee {
  constructor() {
    /**
    * ### PRIVATE API
    *
    * Do not use, may change at any time
    *
    * @type {any}
    */
    __publicField(this, "$$", /* @__PURE__ */ (() => void 0)());
    /**
    * ### PRIVATE API
    *
    * Do not use, may change at any time
    *
    * @type {any}
    */
    __publicField(this, "$$set", /* @__PURE__ */ (() => void 0)());
  }
  /** @returns {void} */
  $destroy() {
    O(this, 1), this.$destroy = I;
  }
  /**
  * @template {Extract<keyof Events, string>} K
  * @param {K} type
  * @param {((e: Events[K]) => void) | null | undefined} callback
  * @returns {() => void}
  */
  $on(e, t) {
    if (!ot(t)) return I;
    const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return n.push(t), () => {
      const i = n.indexOf(t);
      i !== -1 && n.splice(i, 1);
    };
  }
  /**
  * @param {Partial<Props>} props
  * @returns {void}
  */
  $set(e) {
    this.$$set && !Wr(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
};
__name(_ee, "ee");
var ee = _ee;
var Rr = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Rr);
var Bt = [];
function cl(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : I;
  let t;
  const n = /* @__PURE__ */ new Set();
  function i(a) {
    if (x(l, a) && (l = a, t)) {
      const r = !Bt.length;
      for (const c of n) c[1](), Bt.push(c, l);
      if (r) {
        for (let c = 0; c < Bt.length; c += 2) Bt[c][0](Bt[c + 1]);
        Bt.length = 0;
      }
    }
  }
  __name(i, "i");
  function s(a) {
    i(a(l));
  }
  __name(s, "s");
  function o(a) {
    let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : I;
    const c = [a, r];
    return n.add(c), n.size === 1 && (t = e(i, s) || I), a(l), () => {
      n.delete(c), n.size === 0 && t && (t(), t = null);
    };
  }
  __name(o, "o");
  return { set: i, update: s, subscribe: o };
}
__name(cl, "cl");
function wt(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "data-id";
  let t = l;
  for (!t.tagName && l.target && (t = l.target); t; ) {
    if (t.getAttribute && t.getAttribute(e)) return t;
    t = t.parentNode;
  }
  return null;
}
__name(wt, "wt");
function Or(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "data-id";
  const t = wt(l, e);
  return t ? t.getAttribute(e) : null;
}
__name(Or, "Or");
function hn(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "data-id";
  const t = wt(l, e);
  return t ? ul(t.getAttribute(e)) : null;
}
__name(hn, "hn");
function ul(l) {
  if (typeof l == "string") {
    const e = l * 1;
    if (!isNaN(e)) return e;
  }
  return l;
}
__name(ul, "ul");
function Dl(l, e, t) {
  function n(i) {
    const s = wt(i);
    if (!s) return;
    const o = ul(s.dataset.id);
    if (typeof e == "function") return e(o, i);
    let a, r = i.target;
    for (; r != s; ) {
      if (a = r.dataset ? r.dataset.action : null, a && e[a]) {
        e[a](o, i);
        return;
      }
      r = r.parentNode;
    }
    e[t] && e[t](o, i);
  }
  __name(n, "n");
  l.addEventListener(t, n);
}
__name(Dl, "Dl");
function In(l, e) {
  Dl(l, e, "click"), e.dblclick && Dl(l, e.dblclick, "dblclick");
}
__name(In, "In");
function Ar(l, e) {
  for (let t = l.length - 1; t >= 0; t--) if (l[t] === e) {
    l.splice(t, 1);
    break;
  }
}
__name(Ar, "Ar");
var _o = /* @__PURE__ */ new Date();
var Wn = false;
var Tt = [];
var Wl = /* @__PURE__ */ __name((l) => {
  if (Wn) {
    Wn = false;
    return;
  }
  for (let e = Tt.length - 1; e >= 0; e--) {
    const { node: t, date: n, props: i } = Tt[e];
    if (!(n > _o) && !t.contains(l.target) && t !== l.target && (i.callback && i.callback(l), i.modal || l.defaultPrevented)) break;
  }
}, "Wl");
var Hl = ["click", "contextmenu"];
var Fr = /* @__PURE__ */ __name((l) => {
  _o = /* @__PURE__ */ new Date(), Wn = true;
  for (let e = Tt.length - 1; e >= 0; e--) {
    const { node: t } = Tt[e];
    if (!t.contains(l.target) && t !== l.target) {
      Wn = false;
      break;
    }
  }
}, "Fr");
function Rn(l, e) {
  Tt.length || (Hl.forEach((n) => document.addEventListener(n, Wl)), document.addEventListener("mousedown", Fr)), typeof e != "object" && (e = { callback: e });
  const t = { node: l, date: /* @__PURE__ */ new Date(), props: e };
  return Tt.push(t), { destroy() {
    Ar(Tt, t), Tt.length || Hl.forEach((n) => document.removeEventListener(n, Wl));
  } };
}
__name(Rn, "Rn");
var Pr = /* @__PURE__ */ __name((l) => l.indexOf("bottom") !== -1, "Pr");
var Yr = /* @__PURE__ */ __name((l) => l.indexOf("left") !== -1, "Yr");
var zl = /* @__PURE__ */ __name((l) => l.indexOf("right") !== -1, "zl");
var Br = /* @__PURE__ */ __name((l) => l.indexOf("top") !== -1, "Br");
var Nl = /* @__PURE__ */ __name((l) => l.indexOf("fit") !== -1, "Nl");
var Ll = /* @__PURE__ */ __name((l) => l.indexOf("overlap") !== -1, "Ll");
var jr = /* @__PURE__ */ __name((l) => l.indexOf("center") !== -1, "jr");
function Zr(l, e) {
  let t = 0;
  for (; l && l !== document.body; ) {
    const n = getComputedStyle(l).position;
    if ((n === "absolute" || n === "relative" || n === "fixed") && (t = parseInt(getComputedStyle(l).zIndex) || 0), l = l.parentNode, l === e) break;
  }
  return t;
}
__name(Zr, "Zr");
var Qe;
var vt;
var vn;
var st;
var El = { x: 0, y: 0, z: 0, width: "auto" };
function qr(l, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "bottom";
  let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
  let i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  if (!l) return El;
  Qe = n, vt = i;
  let s = 0, o = 0;
  const a = Kr(l), r = Ll(t) ? document.body : a;
  if (!a) return El;
  const c = a.getBoundingClientRect(), u = l.getBoundingClientRect(), f = r.getBoundingClientRect();
  if (e) {
    const m = Zr(e, a);
    s = Math.max(m + 1, 20);
  }
  if (e) {
    if (st = e.getBoundingClientRect(), vn = Nl(t) ? st.width + "px" : "auto", t !== "point") if (jr(t)) Nl(t) ? Qe = 0 : (Qe = f.width / 2, o = 1), vt = (f.height - u.height) / 2;
    else {
      const m = Ll(t) ? 0 : 1;
      Qe = zl(t) ? st.right + m : st.left - m, vt = Pr(t) ? st.bottom + 1 : st.top;
    }
  } else st = { left: n, right: n, top: i, bottom: i };
  Yr(t) && (Qe = st.left, o = 2), Br(t) && (vt = st.top - u.height);
  const d = vt + u.height - f.bottom;
  return d > 0 && (vt -= d), Qe + u.width - f.right > 0 && (zl(t) ? o = 2 : Qe = st.right - u.width), o && (Qe = Math.round(Qe - u.width * o / 2)), Qe < 0 && (t !== "left" ? Qe = 0 : Qe = st.right), Qe += r.scrollLeft - c.left, vt += r.scrollTop - c.top, vn = vn || "auto", { x: Qe, y: vt, z: s, width: vn };
}
__name(qr, "qr");
function Kr(l) {
  for (; l; ) {
    l = l.parentNode;
    const e = getComputedStyle(l).position;
    if (l === document.body || e === "relative" || e === "absolute" || e === "fixed") return l;
  }
  return null;
}
__name(Kr, "Kr");
var Il = (/* @__PURE__ */ new Date()).valueOf();
function Rt() {
  return Il += 1, Il;
}
__name(Rt, "Rt");
function xe(l) {
  return l < 10 ? "0" + l : l.toString();
}
__name(xe, "xe");
function Gr(l) {
  const e = xe(l);
  return e.length == 2 ? "0" + e : e;
}
__name(Gr, "Gr");
function Xr(l) {
  let e = l.getDay();
  e === 0 && (e = 7);
  const t = new Date(l.valueOf());
  t.setDate(l.getDate() + (4 - e));
  const n = t.getFullYear(), i = Math.floor((t.getTime() - new Date(n, 0, 1).getTime()) / 864e5);
  return 1 + Math.floor(i / 7);
}
__name(Xr, "Xr");
var Rl = ["", ""];
function Vr(l, e, t) {
  switch (l) {
    case "%d":
      return xe(e.getDate());
    case "%m":
      return xe(e.getMonth() + 1);
    case "%j":
      return e.getDate();
    case "%n":
      return e.getMonth() + 1;
    case "%y":
      return xe(e.getFullYear() % 100);
    case "%Y":
      return e.getFullYear();
    case "%D":
      return t.dayShort[e.getDay()];
    case "%l":
      return t.dayFull[e.getDay()];
    case "%M":
      return t.monthShort[e.getMonth()];
    case "%F":
      return t.monthFull[e.getMonth()];
    case "%h":
      return xe((e.getHours() + 11) % 12 + 1);
    case "%g":
      return (e.getHours() + 11) % 12 + 1;
    case "%G":
      return e.getHours();
    case "%H":
      return xe(e.getHours());
    case "%i":
      return xe(e.getMinutes());
    case "%a":
      return ((e.getHours() > 11 ? t.pm : t.am) || Rl)[0];
    case "%A":
      return ((e.getHours() > 11 ? t.pm : t.am) || Rl)[1];
    case "%s":
      return xe(e.getSeconds());
    case "%S":
      return Gr(e.getMilliseconds());
    case "%W":
      return xe(Xr(e));
    case "%c": {
      let n = e.getFullYear() + "";
      return n += "-" + xe(e.getMonth() + 1), n += "-" + xe(e.getDate()), n += "T", n += xe(e.getHours()), n += ":" + xe(e.getMinutes()), n += ":" + xe(e.getSeconds()), n;
    }
    default:
      return l;
  }
}
__name(Vr, "Vr");
var Ur = /%[a-zA-Z]/g;
function Jr(l, e) {
  return typeof l == "function" ? l : function(t) {
    return t ? (t.getMonth || (t = new Date(t)), l.replace(Ur, (n) => Vr(n, t, e))) : "";
  };
}
__name(Jr, "Jr");
function Ol(l) {
  return l && typeof l == "object" && !Array.isArray(l);
}
__name(Ol, "Ol");
function Vn(l, e) {
  for (const t in e) {
    const n = e[t];
    Ol(l[t]) && Ol(n) ? l[t] = Vn({ ...l[t] }, e[t]) : l[t] = e[t];
  }
  return l;
}
__name(Vn, "Vn");
function On(l) {
  return { getGroup(e) {
    const t = l[e];
    return (n) => t && t[n] || n;
  }, getRaw() {
    return l;
  }, extend(e, t) {
    if (!e) return this;
    let n;
    return t ? n = Vn({ ...e }, l) : n = Vn({ ...l }, e), On(n);
  } };
}
__name(On, "On");
function Qr(l) {
  let e, t, n;
  return { c() {
    e = D("textarea"), g(e, "class", "wx-textarea x2-1eba9c5"), g(
      e,
      "id",
      /*id*/
      l[1]
    ), e.disabled = /*disabled*/
    l[4], g(
      e,
      "placeholder",
      /*placeholder*/
      l[2]
    ), e.readOnly = /*readonly*/
    l[6], g(
      e,
      "title",
      /*title*/
      l[3]
    ), Q(
      e,
      "wx-error",
      /*error*/
      l[5]
    );
  }, m(i, s) {
    S(i, e, s), Ue(
      e,
      /*value*/
      l[0]
    ), t || (n = [q(
      e,
      "input",
      /*textarea_input_handler*/
      l[8]
    ), q(
      e,
      "input",
      /*input_handler*/
      l[9]
    ), q(
      e,
      "change",
      /*change_handler*/
      l[10]
    )], t = true);
  }, p(i, _ref) {
    let [s] = _ref;
    s & /*id*/
    2 && g(
      e,
      "id",
      /*id*/
      i[1]
    ), s & /*disabled*/
    16 && (e.disabled = /*disabled*/
    i[4]), s & /*placeholder*/
    4 && g(
      e,
      "placeholder",
      /*placeholder*/
      i[2]
    ), s & /*readonly*/
    64 && (e.readOnly = /*readonly*/
    i[6]), s & /*title*/
    8 && g(
      e,
      "title",
      /*title*/
      i[3]
    ), s & /*value*/
    1 && Ue(
      e,
      /*value*/
      i[0]
    ), s & /*error*/
    32 && Q(
      e,
      "wx-error",
      /*error*/
      i[5]
    );
  }, i: I, o: I, d(i) {
    i && v(e), t = false, Ee(n);
  } };
}
__name(Qr, "Qr");
function xr(l, e, t) {
  let { value: n = "" } = e, { id: i = Rt() } = e, { placeholder: s = "" } = e, { title: o = "" } = e, { disabled: a = false } = e, { error: r = false } = e, { readonly: c = false } = e;
  const u = He();
  function f() {
    n = this.value, t(0, n);
  }
  __name(f, "f");
  const d = /* @__PURE__ */ __name(() => u("change", { value: n, input: true }), "d"), h = /* @__PURE__ */ __name(() => u("change", { value: n }), "h");
  return l.$$set = (m) => {
    "value" in m && t(0, n = m.value), "id" in m && t(1, i = m.id), "placeholder" in m && t(2, s = m.placeholder), "title" in m && t(3, o = m.title), "disabled" in m && t(4, a = m.disabled), "error" in m && t(5, r = m.error), "readonly" in m && t(6, c = m.readonly);
  }, [n, i, s, o, a, r, c, u, f, d, h];
}
__name(xr, "xr");
var _$r = class _$r extends ee {
  constructor(e) {
    super(), $(this, e, xr, Qr, x, { value: 0, id: 1, placeholder: 2, title: 3, disabled: 4, error: 5, readonly: 6 });
  }
};
__name(_$r, "$r");
var $r = _$r;
function Al(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = Ve(
      /*icon*/
      l[0]
    ) + " x2-ap8ojf");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*icon*/
    1 && t !== (t = Ve(
      /*icon*/
      n[0]
    ) + " x2-ap8ojf") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(Al, "Al");
function ea(l) {
  let e;
  return { c() {
    e = re(
      /*text*/
      l[3]
    );
  }, m(t, n) {
    S(t, e, n);
  }, p(t, n) {
    n & /*text*/
    8 && me(
      e,
      /*text*/
      t[3]
    );
  }, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(ea, "ea");
function ta(l) {
  let e;
  const t = (
    /*#slots*/
    l[11].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[10],
    null
  );
  return { c() {
    n && n.c();
  }, m(i, s) {
    n && n.m(i, s), e = true;
  }, p(i, s) {
    n && n.p && (!e || s & /*$$scope*/
    1024) && Oe(
      n,
      t,
      i,
      /*$$scope*/
      i[10],
      e ? Re(
        t,
        /*$$scope*/
        i[10],
        s,
        null
      ) : Ae(
        /*$$scope*/
        i[10]
      ),
      null
    );
  }, i(i) {
    e || (k(n, i), e = true);
  }, o(i) {
    y(n, i), e = false;
  }, d(i) {
    n && n.d(i);
  } };
}
__name(ta, "ta");
function na(l) {
  let e, t, n, i, s, o, a, r, c = (
    /*icon*/
    l[0] && Al(l)
  );
  const u = [ta, ea], f = [];
  function d(h, m) {
    return (
      /*SLOTS*/
      h[5] ? 0 : 1
    );
  }
  __name(d, "d");
  return n = d(l), i = f[n] = u[n](l), { c() {
    e = D("button"), c && c.c(), t = Y(), i.c(), g(
      e,
      "title",
      /*title*/
      l[2]
    ), g(e, "class", s = Ve(`wx-button ${/*buttonCss*/
    l[4]}`) + " x2-ap8ojf"), e.disabled = /*disabled*/
    l[1], Q(
      e,
      "wx-icon",
      /*icon*/
      l[0] && (!/*SLOTS*/
      l[5] || !/*SLOTS*/
      l[5].default)
    );
  }, m(h, m) {
    S(h, e, m), c && c.m(e, null), H(e, t), f[n].m(e, null), o = true, a || (r = q(
      e,
      "click",
      /*handleClick*/
      l[6]
    ), a = true);
  }, p(h, _ref2) {
    let [m] = _ref2;
    h[0] ? c ? c.p(h, m) : (c = Al(h), c.c(), c.m(e, t)) : c && (c.d(1), c = null), i.p(h, m), (!o || m & /*title*/
    4) && g(
      e,
      "title",
      /*title*/
      h[2]
    ), (!o || m & /*buttonCss*/
    16 && s !== (s = Ve(`wx-button ${/*buttonCss*/
    h[4]}`) + " x2-ap8ojf")) && g(e, "class", s), (!o || m & /*disabled*/
    2) && (e.disabled = /*disabled*/
    h[1]), (!o || m & /*buttonCss, icon, SLOTS*/
    49) && Q(
      e,
      "wx-icon",
      /*icon*/
      h[0] && (!/*SLOTS*/
      h[5] || !/*SLOTS*/
      h[5].default)
    );
  }, i(h) {
    o || (k(i), o = true);
  }, o(h) {
    y(i), o = false;
  }, d(h) {
    h && v(e), c && c.d(), f[n].d(), a = false, r();
  } };
}
__name(na, "na");
function la(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { type: s = "" } = e, { css: o = "" } = e, { click: a } = e, { icon: r = "" } = e, { disabled: c = false } = e, { title: u = "" } = e, { text: f = "" } = e;
  const d = e.$$slots;
  let h;
  const m = He(), _ = /* @__PURE__ */ __name((w) => {
    c || (m("click"), a && a(w));
  }, "_");
  return l.$$set = (w) => {
    t(13, e = We(We({}, e), qe(w))), "type" in w && t(7, s = w.type), "css" in w && t(8, o = w.css), "click" in w && t(9, a = w.click), "icon" in w && t(0, r = w.icon), "disabled" in w && t(1, c = w.disabled), "title" in w && t(2, u = w.title), "text" in w && t(3, f = w.text), "$$scope" in w && t(10, i = w.$$scope);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*type, css*/
    384) {
      let w = s ? s.split(" ").filter((b) => b !== "").map((b) => "wx-" + b).join(" ") : "";
      t(4, h = o + (o ? " " : "") + w);
    }
  }, e = qe(e), [r, c, u, f, h, d, _, s, o, a, i, n];
}
__name(la, "la");
var _a;
var mn = (_a = class extends ee {
  constructor(e) {
    super(), $(this, e, la, na, x, { type: 7, css: 8, click: 9, icon: 0, disabled: 1, title: 2, text: 3 });
  }
}, __name(_a, "mn"), _a);
function ia(l) {
  let e, t, n, i, s;
  const o = (
    /*#slots*/
    l[8].default
  ), a = Ie(
    o,
    l,
    /*$$scope*/
    l[7],
    null
  );
  return { c() {
    e = D("div"), a && a.c(), g(e, "class", t = `wx-dropdown wx-${/*position*/
    l[0]}-${/*align*/
    l[1]} x2-1jzzq2v`), j(
      e,
      "width",
      /*width*/
      l[2]
    );
  }, m(r, c) {
    S(r, e, c), a && a.m(e, null), l[9](e), n = true, i || (s = nt(Rn.call(
      null,
      e,
      /*down*/
      l[4]
    )), i = true);
  }, p(r, _ref3) {
    let [c] = _ref3;
    a && a.p && (!n || c & /*$$scope*/
    128) && Oe(
      a,
      o,
      r,
      /*$$scope*/
      r[7],
      n ? Re(
        o,
        /*$$scope*/
        r[7],
        c,
        null
      ) : Ae(
        /*$$scope*/
        r[7]
      ),
      null
    ), (!n || c & /*position, align*/
    3 && t !== (t = `wx-dropdown wx-${/*position*/
    r[0]}-${/*align*/
    r[1]} x2-1jzzq2v`)) && g(e, "class", t), (!n || c & /*width*/
    4) && j(
      e,
      "width",
      /*width*/
      r[2]
    );
  }, i(r) {
    n || (k(a, r), n = true);
  }, o(r) {
    y(a, r), n = false;
  }, d(r) {
    r && v(e), a && a.d(r), l[9](null), i = false, s();
  } };
}
__name(ia, "ia");
function sa(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { position: s = "bottom" } = e, { align: o = "start" } = e, { autoFit: a = true } = e, { cancel: r = null } = e, { width: c = "100%" } = e, u;
  kn(() => {
    if (a) {
      const h = u.getBoundingClientRect(), m = document.body.getBoundingClientRect();
      return h.right >= m.right && t(1, o = "end"), h.bottom >= m.bottom && t(0, s = "top"), `${s}-${o}`;
    }
  });
  function f(h) {
    r && r(h);
  }
  __name(f, "f");
  function d(h) {
    be[h ? "unshift" : "push"](() => {
      u = h, t(3, u);
    });
  }
  __name(d, "d");
  return l.$$set = (h) => {
    "position" in h && t(0, s = h.position), "align" in h && t(1, o = h.align), "autoFit" in h && t(5, a = h.autoFit), "cancel" in h && t(6, r = h.cancel), "width" in h && t(2, c = h.width), "$$scope" in h && t(7, i = h.$$scope);
  }, [s, o, c, u, f, a, r, i, n, d];
}
__name(sa, "sa");
var _pn = class _pn extends ee {
  constructor(e) {
    super(), $(this, e, sa, ia, x, { position: 0, align: 1, autoFit: 5, cancel: 6, width: 2 });
  }
};
__name(_pn, "pn");
var pn = _pn;
function oa() {
  let l = null, e = false, t, n, i, s;
  const o = /* @__PURE__ */ __name((d, h, m, _) => {
    t = d, n = h, i = m, s = _;
  }, "o"), a = /* @__PURE__ */ __name((d) => {
    l = d, e = l !== null, i(l);
  }, "a"), r = /* @__PURE__ */ __name((d, h) => {
    const m = d === null ? null : Math.max(0, Math.min(l + d, n.length - 1));
    m !== l && (a(m), t ? c(m, h) : requestAnimationFrame(() => c(m, h)));
  }, "r"), c = /* @__PURE__ */ __name((d, h) => {
    if (d !== null && t) {
      const m = t.querySelectorAll(".list > .item")[d];
      m && (m.scrollIntoView({ block: "nearest" }), h && h.preventDefault());
    }
  }, "c");
  return { move: /* @__PURE__ */ __name((d) => {
    const h = hn(d), m = n.findIndex((_) => _.id == h);
    m !== l && a(m);
  }, "move"), keydown: /* @__PURE__ */ __name((d, h) => {
    switch (d.code) {
      case "Enter":
        e ? s() : a(0);
        break;
      case "Space":
        e || a(0);
        break;
      case "Escape":
        i(l = null);
        break;
      case "Tab":
        i(l = null);
        break;
      case "ArrowDown":
        r(e ? 1 : h || 0, d);
        break;
      case "ArrowUp":
        r(e ? -1 : h || 0, d);
        break;
    }
  }, "keydown"), init: o, navigate: r };
}
__name(oa, "oa");
function Fl(l, e, t) {
  const n = l.slice();
  return n[13] = e[t], n[15] = t, n;
}
__name(Fl, "Fl");
var ra = /* @__PURE__ */ __name((l) => ({ option: l & /*items*/
1 }), "ra");
var Pl = /* @__PURE__ */ __name((l) => ({ option: (
  /*data*/
  l[13]
) }), "Pl");
function Yl(l) {
  let e, t;
  return e = new pn({ props: { cancel: (
    /*func*/
    l[8]
  ), $$slots: { default: [fa] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*$$scope, list, items, navIndex*/
    519 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Yl, "Yl");
function aa(l) {
  let e;
  return { c() {
    e = D("div"), e.textContent = "No data", g(e, "class", "wx-no-data x2-fl05h9");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(aa, "aa");
function ca(l) {
  let e = [], t = /* @__PURE__ */ new Map(), n, i, s = de(
    /*items*/
    l[0]
  );
  const o = /* @__PURE__ */ __name((a) => (
    /*data*/
    a[13].id
  ), "o");
  for (let a = 0; a < s.length; a += 1) {
    let r = Fl(l, s, a), c = o(r);
    t.set(c, e[a] = Bl(c, r));
  }
  return { c() {
    for (let a = 0; a < e.length; a += 1) e[a].c();
    n = se();
  }, m(a, r) {
    for (let c = 0; c < e.length; c += 1) e[c] && e[c].m(a, r);
    S(a, n, r), i = true;
  }, p(a, r) {
    r & /*items, navIndex, $$scope*/
    517 && (s = de(
      /*items*/
      a[0]
    ), te(), e = kt(e, r, o, 1, a, s, t, n.parentNode, en, Bl, n, Fl), ne());
  }, i(a) {
    if (!i) {
      for (let r = 0; r < s.length; r += 1) k(e[r]);
      i = true;
    }
  }, o(a) {
    for (let r = 0; r < e.length; r += 1) y(e[r]);
    i = false;
  }, d(a) {
    a && v(n);
    for (let r = 0; r < e.length; r += 1) e[r].d(a);
  } };
}
__name(ca, "ca");
function ua(l) {
  let e = (
    /*data*/
    l[13].name + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*items*/
    1 && e !== (e = /*data*/
    n[13].name + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(ua, "ua");
function Bl(l, e) {
  let t, n, i, s;
  const o = (
    /*#slots*/
    e[6].default
  ), a = Ie(
    o,
    e,
    /*$$scope*/
    e[9],
    Pl
  ), r = a || ua(e);
  return { key: l, first: null, c() {
    t = D("div"), r && r.c(), n = Y(), g(t, "class", "wx-item x2-fl05h9"), g(t, "data-id", i = /*data*/
    e[13].id), Q(
      t,
      "wx-focus",
      /*index*/
      e[15] === /*navIndex*/
      e[2]
    ), this.first = t;
  }, m(c, u) {
    S(c, t, u), r && r.m(t, null), H(t, n), s = true;
  }, p(c, u) {
    e = c, a ? a.p && (!s || u & /*$$scope, items*/
    513) && Oe(
      a,
      o,
      e,
      /*$$scope*/
      e[9],
      s ? Re(
        o,
        /*$$scope*/
        e[9],
        u,
        ra
      ) : Ae(
        /*$$scope*/
        e[9]
      ),
      Pl
    ) : r && r.p && (!s || u & /*items*/
    1) && r.p(e, s ? u : -1), (!s || u & /*items*/
    1 && i !== (i = /*data*/
    e[13].id)) && g(t, "data-id", i), (!s || u & /*items, navIndex*/
    5) && Q(
      t,
      "wx-focus",
      /*index*/
      e[15] === /*navIndex*/
      e[2]
    );
  }, i(c) {
    s || (k(r, c), s = true);
  }, o(c) {
    y(r, c), s = false;
  }, d(c) {
    c && v(t), r && r.d(c);
  } };
}
__name(Bl, "Bl");
function fa(l) {
  let e, t, n, i, s, o;
  const a = [ca, aa], r = [];
  function c(u, f) {
    return (
      /*items*/
      u[0].length ? 0 : 1
    );
  }
  __name(c, "c");
  return t = c(l), n = r[t] = a[t](l), { c() {
    e = D("div"), n.c(), g(e, "class", "wx-list x2-fl05h9");
  }, m(u, f) {
    S(u, e, f), r[t].m(e, null), l[7](e), i = true, s || (o = [q(e, "click", En(
      /*select*/
      l[5]
    )), q(
      e,
      "mousemove",
      /*move*/
      l[3]
    )], s = true);
  }, p(u, f) {
    let d = t;
    t = c(u), t === d ? r[t].p(u, f) : (te(), y(r[d], 1, 1, () => {
      r[d] = null;
    }), ne(), n = r[t], n ? n.p(u, f) : (n = r[t] = a[t](u), n.c()), k(n, 1), n.m(e, null));
  }, i(u) {
    i || (k(n), i = true);
  }, o(u) {
    y(n), i = false;
  }, d(u) {
    u && v(e), r[t].d(), l[7](null), s = false, Ee(o);
  } };
}
__name(fa, "fa");
function da(l) {
  let e, t, n = (
    /*navIndex*/
    l[2] !== null && Yl(l)
  );
  return { c() {
    n && n.c(), e = se();
  }, m(i, s) {
    n && n.m(i, s), S(i, e, s), t = true;
  }, p(i, _ref4) {
    let [s] = _ref4;
    i[2] !== null ? n ? (n.p(i, s), s & /*navIndex*/
    4 && k(n, 1)) : (n = Yl(i), n.c(), k(n, 1), n.m(e.parentNode, e)) : n && (te(), y(n, 1, 1, () => {
      n = null;
    }), ne());
  }, i(i) {
    t || (k(n), t = true);
  }, o(i) {
    y(n), t = false;
  }, d(i) {
    i && v(e), n && n.d(i);
  } };
}
__name(da, "da");
function ha(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { items: s = [] } = e, o, a = null;
  const r = He(), { move: c, keydown: u, init: f, navigate: d } = oa(), h = /* @__PURE__ */ __name(() => r("select", { id: s[a]?.id }), "h");
  ht(() => {
    r("ready", { navigate: d, keydown: u, move: c });
  });
  function m(w) {
    be[w ? "unshift" : "push"](() => {
      o = w, t(1, o);
    });
  }
  __name(m, "m");
  const _ = /* @__PURE__ */ __name(() => d(null), "_");
  return l.$$set = (w) => {
    "items" in w && t(0, s = w.items), "$$scope" in w && t(9, i = w.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty & /*list, items*/
    3 && f(o, s, (w) => t(2, a = w), h);
  }, [s, o, a, c, d, h, n, m, _, i];
}
__name(ha, "ha");
var _fl = class _fl extends ee {
  constructor(e) {
    super(), $(this, e, ha, da, x, { items: 0 });
  }
};
__name(_fl, "fl");
var fl = _fl;
var ma = /* @__PURE__ */ __name((l) => ({ option: l[1] & /*option*/
4 }), "ma");
var jl = /* @__PURE__ */ __name((l) => ({ option: (
  /*option*/
  l[33]
) }), "jl");
function _a2(l) {
  let e;
  return { c() {
    e = D("i"), g(e, "class", "wx-icon wxi-angle-down x2-1oh2bu");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, d(t) {
    t && v(e);
  } };
}
__name(_a2, "_a");
function ga(l) {
  let e, t, n;
  return { c() {
    e = D("i"), g(e, "class", "wx-icon wxi-close x2-1oh2bu");
  }, m(i, s) {
    S(i, e, s), t || (n = q(e, "click", En(
      /*doUnselect*/
      l[14]
    )), t = true);
  }, p: I, d(i) {
    i && v(e), t = false, n();
  } };
}
__name(ga, "ga");
function Zl(l) {
  let e, t;
  return e = new fl({ props: { items: (
    /*filterOptions*/
    l[8]
  ), $$slots: { default: [ba, (_ref5) => {
    let { option: n } = _ref5;
    return { 33: n };
  }, (_ref6) => {
    let { option: n } = _ref6;
    return [0, n ? 4 : 0];
  }] }, $$scope: { ctx: l } } }), e.$on(
    "ready",
    /*ready*/
    l[12]
  ), e.$on(
    "select",
    /*selectByEvent*/
    l[13]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*filterOptions*/
    256 && (s.items = /*filterOptions*/
    n[8]), i[0] & /*$$scope*/
    134217728 | i[1] & /*option*/
    4 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Zl, "Zl");
function wa(l) {
  let e = (
    /*option*/
    l[33].name + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i[1] & /*option*/
    4 && e !== (e = /*option*/
    n[33].name + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(wa, "wa");
function ba(l) {
  let e;
  const t = (
    /*#slots*/
    l[22].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[27],
    jl
  ), i = n || wa(l);
  return { c() {
    i && i.c();
  }, m(s, o) {
    i && i.m(s, o), e = true;
  }, p(s, o) {
    n ? n.p && (!e || o[0] & /*$$scope*/
    134217728 | o[1] & /*option*/
    4) && Oe(
      n,
      t,
      s,
      /*$$scope*/
      s[27],
      e ? Re(
        t,
        /*$$scope*/
        s[27],
        o,
        ma
      ) : Ae(
        /*$$scope*/
        s[27]
      ),
      jl
    ) : i && i.p && (!e || o[1] & /*option*/
    4) && i.p(s, e ? o : [-1, -1]);
  }, i(s) {
    e || (k(i, s), e = true);
  }, o(s) {
    y(i, s), e = false;
  }, d(s) {
    i && i.d(s);
  } };
}
__name(ba, "ba");
function ka(l) {
  let e, t, n, i, s, o, a;
  function r(d, h) {
    return (
      /*clearButton*/
      d[6] && !/*disabled*/
      d[4] && /*value*/
      d[0] ? ga : _a2
    );
  }
  __name(r, "r");
  let c = r(l), u = c(l), f = !/*disabled*/
  l[4] && Zl(l);
  return { c() {
    e = D("div"), t = D("input"), n = Y(), u.c(), i = Y(), f && f.c(), g(
      t,
      "id",
      /*id*/
      l[1]
    ), t.disabled = /*disabled*/
    l[4], g(
      t,
      "placeholder",
      /*placeholder*/
      l[2]
    ), g(t, "class", "x2-1oh2bu"), Q(
      t,
      "wx-error",
      /*error*/
      l[5]
    ), g(e, "class", "wx-combo x2-1oh2bu"), g(
      e,
      "title",
      /*title*/
      l[3]
    );
  }, m(d, h) {
    S(d, e, h), H(e, t), l[23](t), Ue(
      t,
      /*text*/
      l[7]
    ), H(e, n), u.m(e, null), H(e, i), f && f.m(e, null), s = true, o || (a = [q(
      t,
      "input",
      /*input_1_input_handler*/
      l[24]
    ), q(
      t,
      "focus",
      /*onFocus*/
      l[16]
    ), q(
      t,
      "blur",
      /*onBlur*/
      l[17]
    ), q(
      t,
      "input",
      /*input*/
      l[15]
    ), q(
      e,
      "click",
      /*click_handler*/
      l[25]
    ), q(
      e,
      "keydown",
      /*keydown_handler*/
      l[26]
    )], o = true);
  }, p(d, h) {
    (!s || h[0] & /*id*/
    2) && g(
      t,
      "id",
      /*id*/
      d[1]
    ), (!s || h[0] & /*disabled*/
    16) && (t.disabled = /*disabled*/
    d[4]), (!s || h[0] & /*placeholder*/
    4) && g(
      t,
      "placeholder",
      /*placeholder*/
      d[2]
    ), h[0] & /*text*/
    128 && t.value !== /*text*/
    d[7] && Ue(
      t,
      /*text*/
      d[7]
    ), (!s || h[0] & /*error*/
    32) && Q(
      t,
      "wx-error",
      /*error*/
      d[5]
    ), c === (c = r(d)) && u ? u.p(d, h) : (u.d(1), u = c(d), u && (u.c(), u.m(e, i))), /*disabled*/
    d[4] ? f && (te(), y(f, 1, 1, () => {
      f = null;
    }), ne()) : f ? (f.p(d, h), h[0] & /*disabled*/
    16 && k(f, 1)) : (f = Zl(d), f.c(), k(f, 1), f.m(e, null)), (!s || h[0] & /*title*/
    8) && g(
      e,
      "title",
      /*title*/
      d[3]
    );
  }, i(d) {
    s || (k(f), s = true);
  }, o(d) {
    y(f), s = false;
  }, d(d) {
    d && v(e), l[23](null), u.d(), f && f.d(), o = false, Ee(a);
  } };
}
__name(ka, "ka");
function pa(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { value: s = "" } = e, { id: o = Rt() } = e, { options: a = [] } = e, { textField: r = "label" } = e, { placeholder: c = "" } = e, { title: u = "" } = e, { disabled: f = false } = e, { error: d = false } = e, { clearButton: h = false } = e;
  const m = He();
  let _ = "", w = [], b, p;
  function z(K) {
    t(9, b = K.detail.navigate), t(10, p = K.detail.keydown);
  }
  __name(z, "z");
  let T;
  function W(K) {
    const ue = K.detail.id;
    C(ue, true);
  }
  __name(W, "W");
  function M(K) {
    if (!a.length) return;
    if (K === "" && h) {
      P();
      return;
    }
    let ue = a.find((ye) => ye[r] === K);
    ue || (ue = a.find((ye) => ye[r].toLowerCase().includes(K.toLowerCase())));
    const Ne = ue ? ue.id : T || a[0].id;
    C(Ne, false);
  }
  __name(M, "M");
  function C(K, ue) {
    if (K || K === 0) {
      let Ne = a.find((ye) => ye.id === K);
      t(7, _ = Ne[r]), t(8, w = a), ue && b(null), s !== Ne.id && (t(0, s = Ne.id), m("select", { selected: Ne }));
    }
    !B && ue && A.focus();
  }
  __name(C, "C");
  function P() {
    t(7, _ = t(0, s = "")), t(8, w = a), m("select", { selected: null });
  }
  __name(P, "P");
  function X() {
    t(8, w = _ ? a.filter((K) => K[r].toLowerCase().includes(_.toLowerCase())) : a), w.length ? b(0) : b(null);
  }
  __name(X, "X");
  let A, B;
  function V() {
    B = true;
  }
  __name(V, "V");
  function fe() {
    B = false, setTimeout(() => {
      B || M(_);
    }, 200);
  }
  __name(fe, "fe");
  const L = /* @__PURE__ */ __name(() => w.findIndex((K) => K.id === s), "L");
  function Ye(K) {
    be[K ? "unshift" : "push"](() => {
      A = K, t(11, A);
    });
  }
  __name(Ye, "Ye");
  function G() {
    _ = this.value, t(7, _), t(21, T), t(0, s), t(19, a), t(20, r);
  }
  __name(G, "G");
  const pe = /* @__PURE__ */ __name(() => b(L()), "pe"), Se = /* @__PURE__ */ __name((K) => p(K, L()), "Se");
  return l.$$set = (K) => {
    "value" in K && t(0, s = K.value), "id" in K && t(1, o = K.id), "options" in K && t(19, a = K.options), "textField" in K && t(20, r = K.textField), "placeholder" in K && t(2, c = K.placeholder), "title" in K && t(3, u = K.title), "disabled" in K && t(4, f = K.disabled), "error" in K && t(5, d = K.error), "clearButton" in K && t(6, h = K.clearButton), "$$scope" in K && t(27, i = K.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*prevValue, value, options, textField*/
    3670017 && T != s && (t(7, _ = s || s === 0 ? a.find((K) => K.id === s)[r] : ""), t(21, T = s)), l.$$.dirty[0] & /*options*/
    524288 && t(8, w = a);
  }, [s, o, c, u, f, d, h, _, w, b, p, A, z, W, P, X, V, fe, L, a, r, T, n, Ye, G, pe, Se, i];
}
__name(pa, "pa");
var _a3;
var go = (_a3 = class extends ee {
  constructor(e) {
    super(), $(this, e, pa, ka, x, { value: 0, id: 1, options: 19, textField: 20, placeholder: 2, title: 3, disabled: 4, error: 5, clearButton: 6 }, null, [-1, -1]);
  }
}, __name(_a3, "go"), _a3);
function ya(l) {
  let e, t, n;
  return { c() {
    e = D("input"), g(
      e,
      "id",
      /*id*/
      l[2]
    ), e.readOnly = /*readonly*/
    l[3], e.disabled = /*disabled*/
    l[6], g(
      e,
      "placeholder",
      /*placeholder*/
      l[5]
    ), g(
      e,
      "title",
      /*title*/
      l[9]
    ), g(
      e,
      "style",
      /*inputStyle*/
      l[8]
    ), g(e, "class", "x2-1axmg32");
  }, m(i, s) {
    S(i, e, s), Ue(
      e,
      /*value*/
      l[0]
    ), l[24](e), t || (n = [q(
      e,
      "input",
      /*input_1_input_handler_2*/
      l[23]
    ), q(
      e,
      "input",
      /*input_handler_2*/
      l[25]
    ), q(
      e,
      "change",
      /*change_handler_2*/
      l[26]
    )], t = true);
  }, p(i, s) {
    s & /*id*/
    4 && g(
      e,
      "id",
      /*id*/
      i[2]
    ), s & /*readonly*/
    8 && (e.readOnly = /*readonly*/
    i[3]), s & /*disabled*/
    64 && (e.disabled = /*disabled*/
    i[6]), s & /*placeholder*/
    32 && g(
      e,
      "placeholder",
      /*placeholder*/
      i[5]
    ), s & /*title*/
    512 && g(
      e,
      "title",
      /*title*/
      i[9]
    ), s & /*inputStyle*/
    256 && g(
      e,
      "style",
      /*inputStyle*/
      i[8]
    ), s & /*value*/
    1 && e.value !== /*value*/
    i[0] && Ue(
      e,
      /*value*/
      i[0]
    );
  }, d(i) {
    i && v(e), l[24](null), t = false, Ee(n);
  } };
}
__name(ya, "ya");
function va(l) {
  let e, t, n;
  return { c() {
    e = D("input"), g(
      e,
      "id",
      /*id*/
      l[2]
    ), e.readOnly = /*readonly*/
    l[3], e.disabled = /*disabled*/
    l[6], g(
      e,
      "placeholder",
      /*placeholder*/
      l[5]
    ), g(e, "type", "number"), g(
      e,
      "style",
      /*inputStyle*/
      l[8]
    ), g(
      e,
      "title",
      /*title*/
      l[9]
    ), g(e, "class", "x2-1axmg32");
  }, m(i, s) {
    S(i, e, s), Ue(
      e,
      /*value*/
      l[0]
    ), l[20](e), t || (n = [q(
      e,
      "input",
      /*input_1_input_handler_1*/
      l[19]
    ), q(
      e,
      "input",
      /*input_handler_1*/
      l[21]
    ), q(
      e,
      "change",
      /*change_handler_1*/
      l[22]
    )], t = true);
  }, p(i, s) {
    s & /*id*/
    4 && g(
      e,
      "id",
      /*id*/
      i[2]
    ), s & /*readonly*/
    8 && (e.readOnly = /*readonly*/
    i[3]), s & /*disabled*/
    64 && (e.disabled = /*disabled*/
    i[6]), s & /*placeholder*/
    32 && g(
      e,
      "placeholder",
      /*placeholder*/
      i[5]
    ), s & /*inputStyle*/
    256 && g(
      e,
      "style",
      /*inputStyle*/
      i[8]
    ), s & /*title*/
    512 && g(
      e,
      "title",
      /*title*/
      i[9]
    ), s & /*value*/
    1 && il(e.value) !== /*value*/
    i[0] && Ue(
      e,
      /*value*/
      i[0]
    );
  }, d(i) {
    i && v(e), l[20](null), t = false, Ee(n);
  } };
}
__name(va, "va");
function Sa(l) {
  let e, t, n;
  return { c() {
    e = D("input"), g(
      e,
      "id",
      /*id*/
      l[2]
    ), e.readOnly = /*readonly*/
    l[3], e.disabled = /*disabled*/
    l[6], g(
      e,
      "placeholder",
      /*placeholder*/
      l[5]
    ), g(e, "type", "password"), g(
      e,
      "style",
      /*inputStyle*/
      l[8]
    ), g(
      e,
      "title",
      /*title*/
      l[9]
    ), g(e, "class", "x2-1axmg32");
  }, m(i, s) {
    S(i, e, s), Ue(
      e,
      /*value*/
      l[0]
    ), l[16](e), t || (n = [q(
      e,
      "input",
      /*input_1_input_handler*/
      l[15]
    ), q(
      e,
      "input",
      /*input_handler*/
      l[17]
    ), q(
      e,
      "change",
      /*change_handler*/
      l[18]
    )], t = true);
  }, p(i, s) {
    s & /*id*/
    4 && g(
      e,
      "id",
      /*id*/
      i[2]
    ), s & /*readonly*/
    8 && (e.readOnly = /*readonly*/
    i[3]), s & /*disabled*/
    64 && (e.disabled = /*disabled*/
    i[6]), s & /*placeholder*/
    32 && g(
      e,
      "placeholder",
      /*placeholder*/
      i[5]
    ), s & /*inputStyle*/
    256 && g(
      e,
      "style",
      /*inputStyle*/
      i[8]
    ), s & /*title*/
    512 && g(
      e,
      "title",
      /*title*/
      i[9]
    ), s & /*value*/
    1 && e.value !== /*value*/
    i[0] && Ue(
      e,
      /*value*/
      i[0]
    );
  }, d(i) {
    i && v(e), l[16](null), t = false, Ee(n);
  } };
}
__name(Sa, "Sa");
function ql(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = "wx-icon " + /*icon*/
    l[10] + " x2-1axmg32");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*icon*/
    1024 && t !== (t = "wx-icon " + /*icon*/
    n[10] + " x2-1axmg32") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(ql, "ql");
function Ma(l) {
  let e, t, n;
  function i(r, c) {
    return (
      /*type*/
      r[4] == "password" ? Sa : (
        /*type*/
        r[4] == "number" ? va : ya
      )
    );
  }
  __name(i, "i");
  let s = i(l), o = s(l), a = (
    /*icon*/
    l[10] && ql(l)
  );
  return { c() {
    e = D("div"), o.c(), t = Y(), a && a.c(), g(e, "class", n = "wx-text " + /*css*/
    l[1] + " x2-1axmg32"), Q(
      e,
      "wx-error",
      /*error*/
      l[7]
    ), Q(
      e,
      "wx-disabled",
      /*disabled*/
      l[6]
    );
  }, m(r, c) {
    S(r, e, c), o.m(e, null), H(e, t), a && a.m(e, null);
  }, p(r, _ref7) {
    let [c] = _ref7;
    s === (s = i(r)) && o ? o.p(r, c) : (o.d(1), o = s(r), o && (o.c(), o.m(e, t))), /*icon*/
    r[10] ? a ? a.p(r, c) : (a = ql(r), a.c(), a.m(e, null)) : a && (a.d(1), a = null), c & /*css*/
    2 && n !== (n = "wx-text " + /*css*/
    r[1] + " x2-1axmg32") && g(e, "class", n), c & /*css, error*/
    130 && Q(
      e,
      "wx-error",
      /*error*/
      r[7]
    ), c & /*css, disabled*/
    66 && Q(
      e,
      "wx-disabled",
      /*disabled*/
      r[6]
    );
  }, i: I, o: I, d(r) {
    r && v(e), o.d(), a && a.d();
  } };
}
__name(Ma, "Ma");
function Ta(l, e, t) {
  let { value: n = "" } = e, { id: i = Rt() } = e, { readonly: s = false } = e, { focus: o = false } = e, { select: a = false } = e, { type: r = "text" } = e, { placeholder: c = "" } = e, { disabled: u = false } = e, { error: f = false } = e, { inputStyle: d = "" } = e, { title: h = "" } = e, { css: m = "" } = e, { icon: _ = "" } = e;
  const w = He();
  _ && m.indexOf("wx-icon-left") === -1 && (m = "wx-icon-right " + m);
  let b;
  ht(() => {
    setTimeout(() => {
      o && b && b.focus(), a && b && b.select();
    }, 1);
  });
  function p() {
    n = this.value, t(0, n);
  }
  __name(p, "p");
  function z(L) {
    be[L ? "unshift" : "push"](() => {
      b = L, t(11, b);
    });
  }
  __name(z, "z");
  const T = /* @__PURE__ */ __name(() => w("change", { value: n, input: true }), "T"), W = /* @__PURE__ */ __name(() => w("change", { value: n }), "W");
  function M() {
    n = il(this.value), t(0, n);
  }
  __name(M, "M");
  function C(L) {
    be[L ? "unshift" : "push"](() => {
      b = L, t(11, b);
    });
  }
  __name(C, "C");
  const P = /* @__PURE__ */ __name(() => w("change", { value: n, input: true }), "P"), X = /* @__PURE__ */ __name(() => w("change", { value: n }), "X");
  function A() {
    n = this.value, t(0, n);
  }
  __name(A, "A");
  function B(L) {
    be[L ? "unshift" : "push"](() => {
      b = L, t(11, b);
    });
  }
  __name(B, "B");
  const V = /* @__PURE__ */ __name(() => w("change", { value: n, input: true }), "V"), fe = /* @__PURE__ */ __name(() => w("change", { value: n }), "fe");
  return l.$$set = (L) => {
    "value" in L && t(0, n = L.value), "id" in L && t(2, i = L.id), "readonly" in L && t(3, s = L.readonly), "focus" in L && t(13, o = L.focus), "select" in L && t(14, a = L.select), "type" in L && t(4, r = L.type), "placeholder" in L && t(5, c = L.placeholder), "disabled" in L && t(6, u = L.disabled), "error" in L && t(7, f = L.error), "inputStyle" in L && t(8, d = L.inputStyle), "title" in L && t(9, h = L.title), "css" in L && t(1, m = L.css), "icon" in L && t(10, _ = L.icon);
  }, [n, m, i, s, r, c, u, f, d, h, _, b, w, o, a, p, z, T, W, M, C, P, X, A, B, V, fe];
}
__name(Ta, "Ta");
var _a4;
var wo = (_a4 = class extends ee {
  constructor(e) {
    super(), $(this, e, Ta, Ma, x, { value: 0, id: 2, readonly: 3, focus: 13, select: 14, type: 4, placeholder: 5, disabled: 6, error: 7, inputStyle: 8, title: 9, css: 1, icon: 10 });
  }
}, __name(_a4, "wo"), _a4);
function Ca(l) {
  let e;
  return { c() {
    e = D("span"), g(e, "class", "wx-spacer x2-wurt7c");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, d(t) {
    t && v(e);
  } };
}
__name(Ca, "Ca");
function Da(l) {
  let e, t, n;
  return { c() {
    e = D("i"), g(e, "class", "wx-pager wxi-angle-left x2-wurt7c");
  }, m(i, s) {
    S(i, e, s), t || (n = q(
      e,
      "click",
      /*click_handler*/
      l[8]
    ), t = true);
  }, p: I, d(i) {
    i && v(e), t = false, n();
  } };
}
__name(Da, "Da");
function Wa(l) {
  let e;
  return { c() {
    e = D("span"), g(e, "class", "wx-spacer x2-wurt7c");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, d(t) {
    t && v(e);
  } };
}
__name(Wa, "Wa");
function Ha(l) {
  let e, t, n;
  return { c() {
    e = D("i"), g(e, "class", "wx-pager wxi-angle-right x2-wurt7c");
  }, m(i, s) {
    S(i, e, s), t || (n = q(
      e,
      "click",
      /*click_handler_1*/
      l[9]
    ), t = true);
  }, p: I, d(i) {
    i && v(e), t = false, n();
  } };
}
__name(Ha, "Ha");
function za(l) {
  let e, t, n, i, s, o, a;
  function r(m, _) {
    return (
      /*part*/
      m[1] != "right" ? Da : Ca
    );
  }
  __name(r, "r");
  let c = r(l), u = c(l);
  function f(m, _) {
    return (
      /*part*/
      m[1] != "left" ? Ha : Wa
    );
  }
  __name(f, "f");
  let d = f(l), h = d(l);
  return { c() {
    e = D("div"), u.c(), t = Y(), n = D("span"), i = re(
      /*label*/
      l[2]
    ), s = Y(), h.c(), g(n, "class", "wx-label x2-wurt7c"), g(e, "class", "wx-header x2-wurt7c");
  }, m(m, _) {
    S(m, e, _), u.m(e, null), H(e, t), H(e, n), H(n, i), H(e, s), h.m(e, null), o || (a = q(
      n,
      "click",
      /*changeType*/
      l[4]
    ), o = true);
  }, p(m, _ref8) {
    let [_] = _ref8;
    c === (c = r(m)) && u ? u.p(m, _) : (u.d(1), u = c(m), u && (u.c(), u.m(e, t))), _ & /*label*/
    4 && me(
      i,
      /*label*/
      m[2]
    ), d === (d = f(m)) && h ? h.p(m, _) : (h.d(1), h = d(m), h && (h.c(), h.m(e, null)));
  }, i: I, o: I, d(m) {
    m && v(e), u.d(), h.d(), o = false, a();
  } };
}
__name(za, "za");
function Na(l, e, t) {
  const n = He(), s = ze("wx-i18n").getRaw().calendar.monthFull;
  let { date: o } = e, { type: a } = e, { part: r } = e, c, u, f;
  function d() {
    n("shift", { diff: 0, type: a });
  }
  __name(d, "d");
  const h = /* @__PURE__ */ __name(() => n("shift", { diff: -1, type: a }), "h"), m = /* @__PURE__ */ __name(() => n("shift", { diff: 1, type: a }), "m");
  return l.$$set = (_) => {
    "date" in _ && t(5, o = _.date), "type" in _ && t(0, a = _.type), "part" in _ && t(1, r = _.part);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*date, type, month, year*/
    225) switch (t(6, c = o.getMonth()), t(7, u = o.getFullYear()), a) {
      case "month":
        t(2, f = `${s[c]} ${u}`);
        break;
      case "year":
        t(2, f = u);
        break;
      case "duodecade": {
        const _ = u - u % 10, w = _ + 9;
        t(2, f = `${_} - ${w}`);
        break;
      }
    }
  }, [a, r, f, n, d, o, c, u, h, m];
}
__name(Na, "Na");
var _La = class _La extends ee {
  constructor(e) {
    super(), $(this, e, Na, za, x, { date: 5, type: 0, part: 1 });
  }
};
__name(_La, "La");
var La = _La;
function Ea(l) {
  let e, t, n, i;
  const s = (
    /*#slots*/
    l[2].default
  ), o = Ie(
    s,
    l,
    /*$$scope*/
    l[1],
    null
  );
  return { c() {
    e = D("button"), o && o.c(), g(e, "class", "x2-1f88uh6");
  }, m(a, r) {
    S(a, e, r), o && o.m(e, null), t = true, n || (i = q(e, "click", function() {
      ot(
        /*click*/
        l[0]
      ) && l[0].apply(this, arguments);
    }), n = true);
  }, p(a, _ref9) {
    let [r] = _ref9;
    l = a, o && o.p && (!t || r & /*$$scope*/
    2) && Oe(
      o,
      s,
      l,
      /*$$scope*/
      l[1],
      t ? Re(
        s,
        /*$$scope*/
        l[1],
        r,
        null
      ) : Ae(
        /*$$scope*/
        l[1]
      ),
      null
    );
  }, i(a) {
    t || (k(o, a), t = true);
  }, o(a) {
    y(o, a), t = false;
  }, d(a) {
    a && v(e), o && o.d(a), n = false, i();
  } };
}
__name(Ea, "Ea");
function Ia(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { click: s } = e;
  return l.$$set = (o) => {
    "click" in o && t(0, s = o.click), "$$scope" in o && t(1, i = o.$$scope);
  }, [s, i, n];
}
__name(Ia, "Ia");
var __n = class __n extends ee {
  constructor(e) {
    super(), $(this, e, Ia, Ea, x, { click: 0 });
  }
};
__name(__n, "_n");
var _n = __n;
function Kl(l, e, t) {
  const n = l.slice();
  return n[17] = e[t], n;
}
__name(Kl, "Kl");
function Gl(l, e, t) {
  const n = l.slice();
  return n[17] = e[t], n;
}
__name(Gl, "Gl");
function Xl(l) {
  let e;
  return { c() {
    e = D("div"), e.textContent = `${/*day*/
    l[17]}`, g(e, "class", "wx-weekday x2-ee96p9");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, d(t) {
    t && v(e);
  } };
}
__name(Xl, "Xl");
function Vl(l, e) {
  let t, n = (
    /*day*/
    e[17].day + ""
  ), i, s, o, a;
  return { key: l, first: null, c() {
    t = D("div"), i = re(n), s = Y(), g(t, "class", o = "wx-day " + /*day*/
    e[17].css + " x2-ee96p9"), g(t, "data-id", a = /*day*/
    e[17].date), Q(t, "wx-out", !/*day*/
    e[17].in), this.first = t;
  }, m(r, c) {
    S(r, t, c), H(t, i), H(t, s);
  }, p(r, c) {
    e = r, c & /*days*/
    1 && n !== (n = /*day*/
    e[17].day + "") && me(i, n), c & /*days*/
    1 && o !== (o = "wx-day " + /*day*/
    e[17].css + " x2-ee96p9") && g(t, "class", o), c & /*days*/
    1 && a !== (a = /*day*/
    e[17].date) && g(t, "data-id", a), c & /*days, days*/
    1 && Q(t, "wx-out", !/*day*/
    e[17].in);
  }, d(r) {
    r && v(t);
  } };
}
__name(Vl, "Vl");
function Ra(l) {
  let e, t, n, i, s = [], o = /* @__PURE__ */ new Map(), a, r, c = de(
    /*weekdays*/
    l[1]
  ), u = [];
  for (let h = 0; h < c.length; h += 1) u[h] = Xl(Gl(l, c, h));
  let f = de(
    /*days*/
    l[0]
  );
  const d = /* @__PURE__ */ __name((h) => (
    /*day*/
    h[17].date
  ), "d");
  for (let h = 0; h < f.length; h += 1) {
    let m = Kl(l, f, h), _ = d(m);
    o.set(_, s[h] = Vl(_, m));
  }
  return { c() {
    e = D("div"), t = D("div");
    for (let h = 0; h < u.length; h += 1) u[h].c();
    n = Y(), i = D("div");
    for (let h = 0; h < s.length; h += 1) s[h].c();
    g(t, "class", "wx-weekdays x2-ee96p9"), g(i, "class", "wx-days x2-ee96p9");
  }, m(h, m) {
    S(h, e, m), H(e, t);
    for (let _ = 0; _ < u.length; _ += 1) u[_] && u[_].m(t, null);
    H(e, n), H(e, i);
    for (let _ = 0; _ < s.length; _ += 1) s[_] && s[_].m(i, null);
    a || (r = nt(In.call(
      null,
      i,
      /*selectDates*/
      l[2]
    )), a = true);
  }, p(h, _ref10) {
    let [m] = _ref10;
    if (m & /*weekdays*/
    2) {
      c = de(
        /*weekdays*/
        h[1]
      );
      let _;
      for (_ = 0; _ < c.length; _ += 1) {
        const w = Gl(h, c, _);
        u[_] ? u[_].p(w, m) : (u[_] = Xl(w), u[_].c(), u[_].m(t, null));
      }
      for (; _ < u.length; _ += 1) u[_].d(1);
      u.length = c.length;
    }
    m & /*days*/
    1 && (f = de(
      /*days*/
      h[0]
    ), s = kt(s, m, d, 1, h, f, o, i, al, Vl, null, Kl));
  }, i: I, o: I, d(h) {
    h && v(e), $e(u, h);
    for (let m = 0; m < s.length; m += 1) s[m].d();
    a = false, r();
  } };
}
__name(Ra, "Ra");
function Oa(l) {
  const e = l.getDay();
  return e === 0 || e === 6;
}
__name(Oa, "Oa");
function Aa(l, e, t) {
  let { value: n } = e, { current: i } = e, { cancel: s } = e, { select: o } = e, { part: a } = e, { markers: r = null } = e;
  const c = ze("wx-i18n").getRaw().calendar, u = (c.weekStart || 7) % 7, f = c.dayShort.slice(u).concat(c.dayShort.slice(0, u));
  let d, h;
  const m = /* @__PURE__ */ __name((T, W, M) => new Date(T.getFullYear(), T.getMonth() + (W || 0), T.getDate() + (M || 0)), "m");
  let _ = a !== "normal";
  function w() {
    const T = m(i, 0, 1 - i.getDate());
    return T.setDate(T.getDate() - (T.getDay() - (u - 7)) % 7), T;
  }
  __name(w, "w");
  function b() {
    const T = m(i, 1, -i.getDate());
    return T.setDate(T.getDate() + (6 - T.getDay() + u) % 7), T;
  }
  __name(b, "b");
  const p = { click: z };
  function z(T, W) {
    o && (W.stopPropagation(), o(new Date(new Date(T)))), s && s();
  }
  __name(z, "z");
  return l.$$set = (T) => {
    "value" in T && t(3, n = T.value), "current" in T && t(4, i = T.current), "cancel" in T && t(5, s = T.cancel), "select" in T && t(6, o = T.select), "part" in T && t(7, a = T.part), "markers" in T && t(8, r = T.markers);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*part, value, current, date, markers, days*/
    921) {
      a == "normal" ? t(9, h = [n ? m(n).valueOf() : 0]) : t(9, h = n ? [n.start ? m(n.start).valueOf() : 0, n.end ? m(n.end).valueOf() : 0] : [0, 0]);
      const T = w(), W = b(), M = i.getMonth();
      t(0, d = []);
      for (let C = T; C <= W; C.setDate(C.getDate() + 1)) {
        const P = { day: C.getDate(), in: C.getMonth() === M, date: C.valueOf() };
        let X = "";
        if (X += P.in ? "" : " wx-inactive", X += h.indexOf(P.date) > -1 ? " wx-selected" : "", _) {
          const A = P.date == h[0], B = P.date == h[1];
          A && !B ? X += " wx-left" : B && !A && (X += " wx-right"), P.date > h[0] && P.date < h[1] && (X += " wx-inrange");
        }
        if (X += Oa(C) ? " wx-weekend" : "", r) {
          const A = r(C);
          A && (X += " " + A);
        }
        d.push({ ...P, css: X });
      }
    }
  }, [d, f, p, n, i, s, o, a, r, h];
}
__name(Aa, "Aa");
var _Fa = class _Fa extends ee {
  constructor(e) {
    super(), $(this, e, Aa, Ra, x, { value: 3, current: 4, cancel: 5, select: 6, part: 7, markers: 8 });
  }
};
__name(_Fa, "Fa");
var Fa = _Fa;
function Ul(l, e, t) {
  const n = l.slice();
  return n[9] = e[t], n[11] = t, n;
}
__name(Ul, "Ul");
function Jl(l) {
  let e;
  return { c() {
    e = D("div"), e.textContent = `${/*month*/
    l[9]} `, g(e, "class", "wx-month x2-pmn9ti"), g(
      e,
      "data-id",
      /*i*/
      l[11]
    ), Q(
      e,
      "wx-current",
      /*monthNum*/
      l[1] === /*i*/
      l[11]
    );
  }, m(t, n) {
    S(t, e, n);
  }, p(t, n) {
    n & /*monthNum*/
    2 && Q(
      e,
      "wx-current",
      /*monthNum*/
      t[1] === /*i*/
      t[11]
    );
  }, d(t) {
    t && v(e);
  } };
}
__name(Jl, "Jl");
function Pa(l) {
  let e = (
    /*locale*/
    l[2].done + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(Pa, "Pa");
function Ya(l) {
  let e, t, n, i, s, o, a, r = de(
    /*months*/
    l[3]
  ), c = [];
  for (let u = 0; u < r.length; u += 1) c[u] = Jl(Ul(l, r, u));
  return i = new _n({ props: { click: (
    /*cancel*/
    l[0]
  ), $$slots: { default: [Pa] }, $$scope: { ctx: l } } }), { c() {
    e = D("div");
    for (let u = 0; u < c.length; u += 1) c[u].c();
    t = Y(), n = D("div"), F(i.$$.fragment), g(e, "class", "wx-months x2-pmn9ti"), g(n, "class", "wx-buttons x2-pmn9ti");
  }, m(u, f) {
    S(u, e, f);
    for (let d = 0; d < c.length; d += 1) c[d] && c[d].m(e, null);
    S(u, t, f), S(u, n, f), R(i, n, null), s = true, o || (a = nt(In.call(
      null,
      e,
      /*selectMonths*/
      l[4]
    )), o = true);
  }, p(u, _ref11) {
    let [f] = _ref11;
    if (f & /*monthNum, months*/
    10) {
      r = de(
        /*months*/
        u[3]
      );
      let h;
      for (h = 0; h < r.length; h += 1) {
        const m = Ul(u, r, h);
        c[h] ? c[h].p(m, f) : (c[h] = Jl(m), c[h].c(), c[h].m(e, null));
      }
      for (; h < c.length; h += 1) c[h].d(1);
      c.length = r.length;
    }
    const d = {};
    f & /*cancel*/
    1 && (d.click = /*cancel*/
    u[0]), f & /*$$scope*/
    4096 && (d.$$scope = { dirty: f, ctx: u }), i.$set(d);
  }, i(u) {
    s || (k(i.$$.fragment, u), s = true);
  }, o(u) {
    y(i.$$.fragment, u), s = false;
  }, d(u) {
    u && (v(e), v(t), v(n)), $e(c, u), O(i), o = false, a();
  } };
}
__name(Ya, "Ya");
function Ba(l, e, t) {
  let { value: n } = e, { current: i } = e, { cancel: s } = e, { part: o } = e;
  const a = ze("wx-i18n").getRaw().calendar, r = a.monthShort;
  let c;
  const u = { click: f };
  function f(d, h) {
    (d || d === 0) && (h.stopPropagation(), i.setMonth(d), t(6, i)), o === "normal" && t(5, n = new Date(i)), s();
  }
  __name(f, "f");
  return l.$$set = (d) => {
    "value" in d && t(5, n = d.value), "current" in d && t(6, i = d.current), "cancel" in d && t(0, s = d.cancel), "part" in d && t(7, o = d.part);
  }, l.$$.update = () => {
    l.$$.dirty & /*part, value, current*/
    224 && (o !== "normal" && n ? o === "left" && n.start ? t(1, c = n.start.getMonth()) : o === "right" && n.end ? t(1, c = n.end.getMonth()) : t(1, c = i.getMonth()) : t(1, c = i.getMonth()));
  }, [s, c, a, r, u, n, i, o];
}
__name(Ba, "Ba");
var _ja = class _ja extends ee {
  constructor(e) {
    super(), $(this, e, Ba, Ya, x, { value: 5, current: 6, cancel: 0, part: 7 });
  }
};
__name(_ja, "ja");
var ja = _ja;
function Ql(l, e, t) {
  const n = l.slice();
  return n[9] = e[t], n[11] = t, n;
}
__name(Ql, "Ql");
function xl(l) {
  let e, t = (
    /*y*/
    l[9] + ""
  ), n, i, s;
  return { c() {
    e = D("div"), n = re(t), i = Y(), g(e, "class", "wx-year x2-is1ghx"), g(e, "data-id", s = /*y*/
    l[9]), Q(
      e,
      "wx-current",
      /*year*/
      l[2] == /*y*/
      l[9]
    ), Q(
      e,
      "wx-prev-decade",
      /*i*/
      l[11] === 0
    ), Q(
      e,
      "wx-next-decade",
      /*i*/
      l[11] === 11
    );
  }, m(o, a) {
    S(o, e, a), H(e, n), H(e, i);
  }, p(o, a) {
    a & /*years*/
    2 && t !== (t = /*y*/
    o[9] + "") && me(n, t), a & /*years*/
    2 && s !== (s = /*y*/
    o[9]) && g(e, "data-id", s), a & /*year, years*/
    6 && Q(
      e,
      "wx-current",
      /*year*/
      o[2] == /*y*/
      o[9]
    );
  }, d(o) {
    o && v(e);
  } };
}
__name(xl, "xl");
function Za(l) {
  let e = (
    /*_*/
    l[3].done + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(Za, "Za");
function qa(l) {
  let e, t, n, i, s, o, a, r = de(
    /*years*/
    l[1]
  ), c = [];
  for (let u = 0; u < r.length; u += 1) c[u] = xl(Ql(l, r, u));
  return i = new _n({ props: { click: (
    /*cancel*/
    l[0]
  ), $$slots: { default: [Za] }, $$scope: { ctx: l } } }), { c() {
    e = D("div");
    for (let u = 0; u < c.length; u += 1) c[u].c();
    t = Y(), n = D("div"), F(i.$$.fragment), g(e, "class", "wx-years x2-is1ghx"), g(n, "class", "wx-buttons x2-is1ghx");
  }, m(u, f) {
    S(u, e, f);
    for (let d = 0; d < c.length; d += 1) c[d] && c[d].m(e, null);
    S(u, t, f), S(u, n, f), R(i, n, null), s = true, o || (a = nt(In.call(
      null,
      e,
      /*selectYears*/
      l[4]
    )), o = true);
  }, p(u, _ref12) {
    let [f] = _ref12;
    if (f & /*years, year*/
    6) {
      r = de(
        /*years*/
        u[1]
      );
      let h;
      for (h = 0; h < r.length; h += 1) {
        const m = Ql(u, r, h);
        c[h] ? c[h].p(m, f) : (c[h] = xl(m), c[h].c(), c[h].m(e, null));
      }
      for (; h < c.length; h += 1) c[h].d(1);
      c.length = r.length;
    }
    const d = {};
    f & /*cancel*/
    1 && (d.click = /*cancel*/
    u[0]), f & /*$$scope*/
    4096 && (d.$$scope = { dirty: f, ctx: u }), i.$set(d);
  }, i(u) {
    s || (k(i.$$.fragment, u), s = true);
  }, o(u) {
    y(i.$$.fragment, u), s = false;
  }, d(u) {
    u && (v(e), v(t), v(n)), $e(c, u), O(i), o = false, a();
  } };
}
__name(qa, "qa");
function Ka(l, e, t) {
  const n = ze("wx-i18n").getRaw().calendar;
  let { value: i } = e, { current: s } = e, { cancel: o } = e, { part: a } = e, r, c;
  const u = { click: f };
  function f(d, h) {
    d && (h.stopPropagation(), s.setFullYear(d), t(5, s)), a === "normal" && t(6, i = new Date(s)), o();
  }
  __name(f, "f");
  return l.$$set = (d) => {
    "value" in d && t(6, i = d.value), "current" in d && t(5, s = d.current), "cancel" in d && t(0, o = d.cancel), "part" in d && t(7, a = d.part);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*current, year, years*/
    38) {
      t(2, c = s.getFullYear());
      const d = c - c % 10 - 1, h = d + 12;
      t(1, r = []);
      for (let m = d; m < h; ++m) r.push(m);
    }
  }, [o, r, c, n, u, s, i, a];
}
__name(Ka, "Ka");
var _Ga = class _Ga extends ee {
  constructor(e) {
    super(), $(this, e, Ka, qa, x, { value: 6, current: 5, cancel: 0, part: 7 });
  }
};
__name(_Ga, "Ga");
var Ga = _Ga;
var Un = { month: { component: Fa, next: Va, prev: Xa }, year: { component: ja, next: Ja, prev: Ua }, duodecade: { component: Ga, next: xa, prev: Qa } };
function Xa(l) {
  let e = new Date(l);
  for (e.setMonth(l.getMonth() - 1); l.getMonth() === e.getMonth(); ) e.setDate(e.getDate() - 1);
  return e;
}
__name(Xa, "Xa");
function Va(l) {
  return l = new Date(l), l.setDate(1), l.setMonth(l.getMonth() + 1), l;
}
__name(Va, "Va");
function Ua(l) {
  return l = new Date(l), l.setFullYear(l.getFullYear() - 1), l;
}
__name(Ua, "Ua");
function Ja(l) {
  return l = new Date(l), l.setFullYear(l.getFullYear() + 1), l;
}
__name(Ja, "Ja");
function Qa(l) {
  return l = new Date(l), l.setFullYear(l.getFullYear() - 10), l;
}
__name(Qa, "Qa");
function xa(l) {
  return l = new Date(l), l.setFullYear(l.getFullYear() + 10), l;
}
__name(xa, "xa");
function $l(l) {
  let e, t, n, i, s, o, a, r, c = (
    /*done*/
    l[2] && ei(l)
  );
  return i = new _n({ props: { click: (
    /*func_1*/
    l[14]
  ), $$slots: { default: [ec] }, $$scope: { ctx: l } } }), a = new _n({ props: { click: (
    /*func_2*/
    l[15]
  ), $$slots: { default: [tc] }, $$scope: { ctx: l } } }), { c() {
    e = D("div"), c && c.c(), t = Y(), n = D("div"), F(i.$$.fragment), s = Y(), o = D("div"), F(a.$$.fragment), g(n, "class", "wx-button-item x2-9ihaic"), g(o, "class", "wx-button-item x2-9ihaic"), g(e, "class", "wx-buttons x2-9ihaic");
  }, m(u, f) {
    S(u, e, f), c && c.m(e, null), H(e, t), H(e, n), R(i, n, null), H(e, s), H(e, o), R(a, o, null), r = true;
  }, p(u, f) {
    u[2] ? c ? (c.p(u, f), f & /*done*/
    4 && k(c, 1)) : (c = ei(u), c.c(), k(c, 1), c.m(e, t)) : c && (te(), y(c, 1, 1, () => {
      c = null;
    }), ne());
    const d = {};
    f & /*$$scope*/
    131072 && (d.$$scope = { dirty: f, ctx: u }), i.$set(d);
    const h = {};
    f & /*$$scope*/
    131072 && (h.$$scope = { dirty: f, ctx: u }), a.$set(h);
  }, i(u) {
    r || (k(c), k(i.$$.fragment, u), k(a.$$.fragment, u), r = true);
  }, o(u) {
    y(c), y(i.$$.fragment, u), y(a.$$.fragment, u), r = false;
  }, d(u) {
    u && v(e), c && c.d(), O(i), O(a);
  } };
}
__name($l, "$l");
function ei(l) {
  let e, t, n;
  return t = new _n({ props: { click: (
    /*func*/
    l[13]
  ), $$slots: { default: [$a] }, $$scope: { ctx: l } } }), { c() {
    e = D("div"), F(t.$$.fragment), g(e, "class", "wx-button-item x2-9ihaic");
  }, m(i, s) {
    S(i, e, s), R(t, e, null), n = true;
  }, p(i, s) {
    const o = {};
    s & /*$$scope*/
    131072 && (o.$$scope = { dirty: s, ctx: i }), t.$set(o);
  }, i(i) {
    n || (k(t.$$.fragment, i), n = true);
  }, o(i) {
    y(t.$$.fragment, i), n = false;
  }, d(i) {
    i && v(e), O(t);
  } };
}
__name(ei, "ei");
function $a(l) {
  let e = (
    /*_*/
    l[7]("done") + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name($a, "$a");
function ec(l) {
  let e = (
    /*_*/
    l[7]("clear") + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(ec, "ec");
function tc(l) {
  let e = (
    /*_*/
    l[7]("today") + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(tc, "tc");
function nc(l) {
  let e, t, n, i, s, o, a, r, c;
  n = new La({ props: { date: (
    /*current*/
    l[1]
  ), part: (
    /*part*/
    l[3]
  ), type: (
    /*type*/
    l[6]
  ) } }), n.$on(
    "shift",
    /*shift_handler*/
    l[12]
  );
  var u = Un[
    /*type*/
    l[6]
  ].component;
  function f(h, m) {
    return { props: { value: (
      /*value*/
      h[0]
    ), current: (
      /*current*/
      h[1]
    ), part: (
      /*part*/
      h[3]
    ), markers: (
      /*markers*/
      h[4]
    ), select: (
      /*select*/
      h[11]
    ), cancel: (
      /*cancel*/
      h[9]
    ) } };
  }
  __name(f, "f");
  u && (o = Le(u, f(l)));
  let d = (
    /*type*/
    l[6] === "month" && /*buttons*/
    l[5] && $l(l)
  );
  return { c() {
    e = D("div"), t = D("div"), F(n.$$.fragment), i = Y(), s = D("div"), o && F(o.$$.fragment), a = Y(), d && d.c(), g(t, "class", "wx-wrap x2-9ihaic"), g(e, "class", r = "wx-calendar " + /*part*/
    (l[3] !== "normal" && /*part*/
    l[3] !== "both" ? "wx-part" : "") + " x2-9ihaic");
  }, m(h, m) {
    S(h, e, m), H(e, t), R(n, t, null), H(t, i), H(t, s), o && R(o, s, null), H(s, a), d && d.m(s, null), c = true;
  }, p(h, _ref13) {
    let [m] = _ref13;
    const _ = {};
    if (m & /*current*/
    2 && (_.date = /*current*/
    h[1]), m & /*part*/
    8 && (_.part = /*part*/
    h[3]), m & /*type*/
    64 && (_.type = /*type*/
    h[6]), n.$set(_), m & /*type*/
    64 && u !== (u = Un[
      /*type*/
      h[6]
    ].component)) {
      if (o) {
        te();
        const w = o;
        y(w.$$.fragment, 1, 0, () => {
          O(w, 1);
        }), ne();
      }
      u ? (o = Le(u, f(h)), F(o.$$.fragment), k(o.$$.fragment, 1), R(o, s, a)) : o = null;
    } else if (u) {
      const w = {};
      m & /*value*/
      1 && (w.value = /*value*/
      h[0]), m & /*current*/
      2 && (w.current = /*current*/
      h[1]), m & /*part*/
      8 && (w.part = /*part*/
      h[3]), m & /*markers*/
      16 && (w.markers = /*markers*/
      h[4]), o.$set(w);
    }
    h[6] === "month" && /*buttons*/
    h[5] ? d ? (d.p(h, m), m & /*type, buttons*/
    96 && k(d, 1)) : (d = $l(h), d.c(), k(d, 1), d.m(s, null)) : d && (te(), y(d, 1, 1, () => {
      d = null;
    }), ne()), (!c || m & /*part*/
    8 && r !== (r = "wx-calendar " + /*part*/
    (h[3] !== "normal" && /*part*/
    h[3] !== "both" ? "wx-part" : "") + " x2-9ihaic")) && g(e, "class", r);
  }, i(h) {
    c || (k(n.$$.fragment, h), o && k(o.$$.fragment, h), k(d), c = true);
  }, o(h) {
    y(n.$$.fragment, h), o && y(o.$$.fragment, h), y(d), c = false;
  }, d(h) {
    h && v(e), O(n), o && O(o), d && d.d();
  } };
}
__name(nc, "nc");
function lc(l, e, t) {
  const n = He(), i = ze("wx-i18n").getGroup("calendar");
  let { value: s } = e, { current: o } = e, { done: a = false } = e, { part: r = "normal" } = e, { markers: c = null } = e, { buttons: u = true } = e, f = "month";
  function d(T, W) {
    T.preventDefault(), n("change", { value: W });
  }
  __name(d, "d");
  function h() {
    f === "duodecade" ? t(6, f = "year") : f === "year" && t(6, f = "month");
  }
  __name(h, "h");
  function m(T) {
    T.diff == 0 ? f === "month" ? t(6, f = "year") : f === "year" && t(6, f = "duodecade") : n("shift", T);
  }
  __name(m, "m");
  function _(T) {
    n("change", { select: true, value: T });
  }
  __name(_, "_");
  const w = /* @__PURE__ */ __name((T) => m(T.detail), "w"), b = /* @__PURE__ */ __name((T) => d(T, -1), "b"), p = /* @__PURE__ */ __name((T) => d(T, null), "p"), z = /* @__PURE__ */ __name((T) => d(T, /* @__PURE__ */ new Date()), "z");
  return l.$$set = (T) => {
    "value" in T && t(0, s = T.value), "current" in T && t(1, o = T.current), "done" in T && t(2, a = T.done), "part" in T && t(3, r = T.part), "markers" in T && t(4, c = T.markers), "buttons" in T && t(5, u = T.buttons);
  }, [s, o, a, r, c, u, f, i, d, h, m, _, w, b, p, z];
}
__name(lc, "lc");
var _ic = class _ic extends ee {
  constructor(e) {
    super(), $(this, e, lc, nc, x, { value: 0, current: 1, done: 2, part: 3, markers: 4, buttons: 5 });
  }
};
__name(_ic, "ic");
var ic = _ic;
function sc(l) {
  let e, t;
  return e = new ic({ props: { value: (
    /*value*/
    l[0]
  ), current: (
    /*current*/
    l[1]
  ), markers: (
    /*markers*/
    l[2]
  ), buttons: (
    /*buttons*/
    l[3]
  ) } }), e.$on(
    "shift",
    /*shift_handler*/
    l[6]
  ), e.$on(
    "change",
    /*change_handler*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref14) {
    let [i] = _ref14;
    const s = {};
    i & /*value*/
    1 && (s.value = /*value*/
    n[0]), i & /*current*/
    2 && (s.current = /*current*/
    n[1]), i & /*markers*/
    4 && (s.markers = /*markers*/
    n[2]), i & /*buttons*/
    8 && (s.buttons = /*buttons*/
    n[3]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(sc, "sc");
function oc(l, e, t) {
  const n = He();
  let { value: i } = e, { current: s } = e, { markers: o = null } = e, { buttons: a = true } = e;
  function r() {
    s || t(1, s = i ? new Date(i) : /* @__PURE__ */ new Date());
  }
  __name(r, "r");
  function c(_ref15) {
    let { diff: h, type: m } = _ref15;
    const _ = Un[m];
    t(1, s = h > 0 ? _.next(s) : _.prev(s));
  }
  __name(c, "c");
  function u(h) {
    const m = h.value;
    m ? (t(1, s = new Date(m)), t(0, i = new Date(m))) : t(0, i = null), n("change", { value: i });
  }
  __name(u, "u");
  const f = /* @__PURE__ */ __name((h) => c(h.detail), "f"), d = /* @__PURE__ */ __name((h) => u(h.detail), "d");
  return l.$$set = (h) => {
    "value" in h && t(0, i = h.value), "current" in h && t(1, s = h.current), "markers" in h && t(2, o = h.markers), "buttons" in h && t(3, a = h.buttons);
  }, l.$$.update = () => {
    l.$$.dirty & /*value*/
    1 && r();
  }, [i, s, o, a, c, u, f, d];
}
__name(oc, "oc");
var _bo = class _bo extends ee {
  constructor(e) {
    super(), $(this, e, oc, sc, x, { value: 0, current: 1, markers: 2, buttons: 3 });
  }
};
__name(_bo, "bo");
var bo = _bo;
function ti(l) {
  let e, t;
  return e = new pn({ props: { cancel: (
    /*cancel*/
    l[13]
  ), width: (
    /*width*/
    l[4]
  ), align: (
    /*align*/
    l[5]
  ), autoFit: !!/*align*/
  l[5], $$slots: { default: [rc] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*width*/
    16 && (s.width = /*width*/
    n[4]), i & /*align*/
    32 && (s.align = /*align*/
    n[5]), i & /*align*/
    32 && (s.autoFit = !!/*align*/
    n[5]), i & /*$$scope, buttons, value*/
    16777345 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(ti, "ti");
function rc(l) {
  let e, t;
  return e = new bo({ props: { buttons: (
    /*buttons*/
    l[7]
  ), value: (
    /*value*/
    l[0]
  ) } }), e.$on(
    "change",
    /*change_handler*/
    l[17]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*buttons*/
    128 && (s.buttons = /*buttons*/
    n[7]), i & /*value*/
    1 && (s.value = /*value*/
    n[0]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(rc, "rc");
function ac(l) {
  let e, t, n, i, s, o;
  t = new wo({ props: { css: (
    /*css*/
    l[8]
  ), title: (
    /*title*/
    l[9]
  ), value: (
    /*formattedValue*/
    l[12]
  ), id: (
    /*id*/
    l[1]
  ), readonly: !/*editable*/
  l[10], disabled: (
    /*disabled*/
    l[2]
  ), error: (
    /*error*/
    l[3]
  ), placeholder: (
    /*placeholder*/
    l[6]
  ), icon: "wxi-calendar", inputStyle: "cursor: pointer; width: 100%; padding-right: calc(var(--wx-input-icon-size) + var(--wx-input-icon-indent) * 2);" } }), t.$on(
    "input",
    /*cancel*/
    l[13]
  ), t.$on(
    "change",
    /*doChangeInput*/
    l[15]
  );
  let a = (
    /*popup*/
    l[11] && !/*disabled*/
    l[2] && ti(l)
  );
  return { c() {
    e = D("div"), F(t.$$.fragment), n = Y(), a && a.c(), g(e, "class", "wx-datepicker x2-1k3rk87");
  }, m(r, c) {
    S(r, e, c), R(t, e, null), H(e, n), a && a.m(e, null), i = true, s || (o = [q(
      window,
      "scroll",
      /*cancel*/
      l[13]
    ), q(
      e,
      "click",
      /*click_handler*/
      l[18]
    )], s = true);
  }, p(r, _ref16) {
    let [c] = _ref16;
    const u = {};
    c & /*css*/
    256 && (u.css = /*css*/
    r[8]), c & /*title*/
    512 && (u.title = /*title*/
    r[9]), c & /*formattedValue*/
    4096 && (u.value = /*formattedValue*/
    r[12]), c & /*id*/
    2 && (u.id = /*id*/
    r[1]), c & /*editable*/
    1024 && (u.readonly = !/*editable*/
    r[10]), c & /*disabled*/
    4 && (u.disabled = /*disabled*/
    r[2]), c & /*error*/
    8 && (u.error = /*error*/
    r[3]), c & /*placeholder*/
    64 && (u.placeholder = /*placeholder*/
    r[6]), t.$set(u), /*popup*/
    r[11] && !/*disabled*/
    r[2] ? a ? (a.p(r, c), c & /*popup, disabled*/
    2052 && k(a, 1)) : (a = ti(r), a.c(), k(a, 1), a.m(e, null)) : a && (te(), y(a, 1, 1, () => {
      a = null;
    }), ne());
  }, i(r) {
    i || (k(t.$$.fragment, r), k(a), i = true);
  }, o(r) {
    y(t.$$.fragment, r), y(a), i = false;
  }, d(r) {
    r && v(e), O(t), a && a.d(), s = false, Ee(o);
  } };
}
__name(ac, "ac");
function cc(l, e, t) {
  let { value: n } = e, { id: i = Rt() } = e, { disabled: s = false } = e, { error: o = false } = e, { width: a = "unset" } = e, { align: r = "start" } = e, { placeholder: c = "" } = e, { format: u } = e, { buttons: f = true } = e, { css: d = "" } = e, { title: h = "" } = e, { editable: m = false } = e;
  const _ = He(), { calendar: w, formats: b } = ze("wx-i18n").getRaw(), p = u || b.dateFormat;
  let z = typeof p == "function" ? p : Jr(p, w), T;
  function W() {
    t(11, T = false);
  }
  __name(W, "W");
  function M(B) {
    const V = B === n || B && n && B.valueOf() === n.valueOf() || !B && !n;
    t(0, n = B), V || _("select", { selected: B }), setTimeout(W, 1);
  }
  __name(M, "M");
  let C;
  function P(B) {
    if (!m) return;
    const { value: V, input: fe } = B.detail;
    if (fe) return;
    t(12, C = "");
    let L = typeof m == "function" ? m(V) : V ? new Date(V) : null;
    L = isNaN(L) ? n || null : L || null, M(L);
  }
  __name(P, "P");
  const X = /* @__PURE__ */ __name((B) => M(B.detail.value), "X"), A = /* @__PURE__ */ __name(() => t(11, T = true), "A");
  return l.$$set = (B) => {
    "value" in B && t(0, n = B.value), "id" in B && t(1, i = B.id), "disabled" in B && t(2, s = B.disabled), "error" in B && t(3, o = B.error), "width" in B && t(4, a = B.width), "align" in B && t(5, r = B.align), "placeholder" in B && t(6, c = B.placeholder), "format" in B && t(16, u = B.format), "buttons" in B && t(7, f = B.buttons), "css" in B && t(8, d = B.css), "title" in B && t(9, h = B.title), "editable" in B && t(10, m = B.editable);
  }, l.$$.update = () => {
    l.$$.dirty & /*value*/
    1 && t(12, C = n ? z(n) : "");
  }, [n, i, s, o, a, r, c, f, d, h, m, T, C, W, M, P, u, X, A];
}
__name(cc, "cc");
var _uc = class _uc extends ee {
  constructor(e) {
    super(), $(this, e, cc, ac, x, { value: 0, id: 1, disabled: 2, error: 3, width: 4, align: 5, placeholder: 6, format: 16, buttons: 7, css: 8, title: 9, editable: 10 });
  }
};
__name(_uc, "uc");
var uc = _uc;
function ni(l) {
  let e, t;
  return { c() {
    e = D("label"), t = re(
      /*label*/
      l[2]
    ), g(
      e,
      "for",
      /*id*/
      l[1]
    ), g(e, "class", "x2-vxce8u");
  }, m(n, i) {
    S(n, e, i), H(e, t);
  }, p(n, i) {
    i & /*label*/
    4 && me(
      t,
      /*label*/
      n[2]
    ), i & /*id*/
    2 && g(
      e,
      "for",
      /*id*/
      n[1]
    );
  }, d(n) {
    n && v(e);
  } };
}
__name(ni, "ni");
function fc(l) {
  let e, t, n, i, s, o, a, r = (
    /*label*/
    l[2] && ni(l)
  );
  return { c() {
    e = D("div"), r && r.c(), t = Y(), n = D("div"), i = D("input"), g(
      i,
      "id",
      /*id*/
      l[1]
    ), g(i, "type", "range"), g(
      i,
      "min",
      /*min*/
      l[4]
    ), g(
      i,
      "max",
      /*max*/
      l[5]
    ), g(
      i,
      "step",
      /*step*/
      l[6]
    ), i.disabled = /*disabled*/
    l[8], g(
      i,
      "style",
      /*bgStyle*/
      l[9]
    ), g(i, "class", "x2-vxce8u"), g(n, "class", "x2-vxce8u"), g(e, "class", "wx-slider x2-vxce8u"), g(e, "style", s = /*width*/
    l[3] ? `width: ${/*width*/
    l[3]}` : ""), g(
      e,
      "title",
      /*title*/
      l[7]
    );
  }, m(c, u) {
    S(c, e, u), r && r.m(e, null), H(e, t), H(e, n), H(n, i), Ue(
      i,
      /*value*/
      l[0]
    ), o || (a = [q(
      i,
      "change",
      /*input_change_input_handler*/
      l[13]
    ), q(
      i,
      "input",
      /*input_change_input_handler*/
      l[13]
    ), q(
      i,
      "change",
      /*onChange*/
      l[10]
    )], o = true);
  }, p(c, _ref17) {
    let [u] = _ref17;
    c[2] ? r ? r.p(c, u) : (r = ni(c), r.c(), r.m(e, t)) : r && (r.d(1), r = null), u & /*id*/
    2 && g(
      i,
      "id",
      /*id*/
      c[1]
    ), u & /*min*/
    16 && g(
      i,
      "min",
      /*min*/
      c[4]
    ), u & /*max*/
    32 && g(
      i,
      "max",
      /*max*/
      c[5]
    ), u & /*step*/
    64 && g(
      i,
      "step",
      /*step*/
      c[6]
    ), u & /*disabled*/
    256 && (i.disabled = /*disabled*/
    c[8]), u & /*bgStyle*/
    512 && g(
      i,
      "style",
      /*bgStyle*/
      c[9]
    ), u & /*value*/
    1 && Ue(
      i,
      /*value*/
      c[0]
    ), u & /*width*/
    8 && s !== (s = /*width*/
    c[3] ? `width: ${/*width*/
    c[3]}` : "") && g(e, "style", s), u & /*title*/
    128 && g(
      e,
      "title",
      /*title*/
      c[7]
    );
  }, i: I, o: I, d(c) {
    c && v(e), r && r.d(), o = false, Ee(a);
  } };
}
__name(fc, "fc");
function dc(l, e, t) {
  const n = He();
  let { id: i = Rt() } = e, { label: s = "" } = e, { width: o = "" } = e, { min: a = 0 } = e, { max: r = 100 } = e, { value: c = 0 } = e, { step: u = 1 } = e, { title: f = "" } = e, { disabled: d = false } = e, h = 0, m = "", _;
  function w(_ref18) {
    let { target: p } = _ref18;
    const z = p.value * 1;
    n("change", { value: z }), t(0, c = z);
  }
  __name(w, "w");
  function b() {
    c = il(this.value), t(0, c), t(4, a), t(5, r), t(8, d), t(11, h), t(12, _);
  }
  __name(b, "b");
  return l.$$set = (p) => {
    "id" in p && t(1, i = p.id), "label" in p && t(2, s = p.label), "width" in p && t(3, o = p.width), "min" in p && t(4, a = p.min), "max" in p && t(5, r = p.max), "value" in p && t(0, c = p.value), "step" in p && t(6, u = p.step), "title" in p && t(7, f = p.title), "disabled" in p && t(8, d = p.disabled);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max, disabled, progress, previous*/
    6449 && (t(11, h = (c - a) / (r - a) * 100 + "%"), t(9, m = d ? "" : `background: linear-gradient(90deg, var(--wx-slider-primary) 0% ${h}, var(--wx-slider-background) ${h} 100%);`), isNaN(c) && t(0, c = 0), _ !== c && (n("change", { value: c, previous: _, input: true }), t(12, _ = c)));
  }, [c, i, s, o, a, r, u, f, d, m, w, h, _, b];
}
__name(dc, "dc");
var _hc = class _hc extends ee {
  constructor(e) {
    super(), $(this, e, dc, fc, x, { id: 1, label: 2, width: 3, min: 4, max: 5, value: 0, step: 6, title: 7, disabled: 8 });
  }
};
__name(_hc, "hc");
var hc = _hc;
var mc = /* @__PURE__ */ __name((l) => ({}), "mc");
var li = /* @__PURE__ */ __name((l) => ({ id: (
  /*id*/
  l[5]
) }), "li");
function ii(l) {
  let e, t;
  return { c() {
    e = D("label"), t = re(
      /*label*/
      l[0]
    ), g(
      e,
      "for",
      /*id*/
      l[5]
    ), g(e, "class", "x2-16h42zq");
  }, m(n, i) {
    S(n, e, i), H(e, t);
  }, p(n, i) {
    i & /*label*/
    1 && me(
      t,
      /*label*/
      n[0]
    );
  }, d(n) {
    n && v(e);
  } };
}
__name(ii, "ii");
function _c(l) {
  let e, t, n, i, s, o, a, r = (
    /*label*/
    l[0] && ii(l)
  );
  const c = (
    /*#slots*/
    l[7].default
  ), u = Ie(
    c,
    l,
    /*$$scope*/
    l[6],
    li
  );
  return { c() {
    e = D("div"), r && r.c(), t = Y(), n = D("div"), u && u.c(), g(n, "class", i = "wx-field-control wx-" + /*type*/
    l[4] + " x2-16h42zq"), g(e, "class", s = "wx-field wx-" + /*position*/
    l[1] + " x2-16h42zq"), g(e, "style", o = /*width*/
    l[2] ? `width: ${/*width*/
    l[2]}` : ""), Q(
      e,
      "wx-error",
      /*error*/
      l[3]
    );
  }, m(f, d) {
    S(f, e, d), r && r.m(e, null), H(e, t), H(e, n), u && u.m(n, null), a = true;
  }, p(f, _ref19) {
    let [d] = _ref19;
    f[0] ? r ? r.p(f, d) : (r = ii(f), r.c(), r.m(e, t)) : r && (r.d(1), r = null), u && u.p && (!a || d & /*$$scope*/
    64) && Oe(
      u,
      c,
      f,
      /*$$scope*/
      f[6],
      a ? Re(
        c,
        /*$$scope*/
        f[6],
        d,
        mc
      ) : Ae(
        /*$$scope*/
        f[6]
      ),
      li
    ), (!a || d & /*type*/
    16 && i !== (i = "wx-field-control wx-" + /*type*/
    f[4] + " x2-16h42zq")) && g(n, "class", i), (!a || d & /*position*/
    2 && s !== (s = "wx-field wx-" + /*position*/
    f[1] + " x2-16h42zq")) && g(e, "class", s), (!a || d & /*width*/
    4 && o !== (o = /*width*/
    f[2] ? `width: ${/*width*/
    f[2]}` : "")) && g(e, "style", o), (!a || d & /*position, error*/
    10) && Q(
      e,
      "wx-error",
      /*error*/
      f[3]
    );
  }, i(f) {
    a || (k(u, f), a = true);
  }, o(f) {
    y(u, f), a = false;
  }, d(f) {
    f && v(e), r && r.d(), u && u.d(f);
  } };
}
__name(_c, "_c");
function gc(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { label: s = "" } = e, { position: o = "" } = e, { width: a = "" } = e, { error: r = false } = e, { type: c = "" } = e, u = Rt();
  return l.$$set = (f) => {
    "label" in f && t(0, s = f.label), "position" in f && t(1, o = f.position), "width" in f && t(2, a = f.width), "error" in f && t(3, r = f.error), "type" in f && t(4, c = f.type), "$$scope" in f && t(6, i = f.$$scope);
  }, [s, o, a, r, c, u, i, n];
}
__name(gc, "gc");
var _Ot = class _Ot extends ee {
  constructor(e) {
    super(), $(this, e, gc, _c, x, { label: 0, position: 1, width: 2, error: 3, type: 4 });
  }
};
__name(_Ot, "Ot");
var Ot = _Ot;
var wc = /* @__PURE__ */ __name((l) => ({}), "wc");
var si = /* @__PURE__ */ __name((l) => ({ mount: (
  /*mount*/
  l[1]
) }), "si");
function bc(l) {
  let e, t, n, i;
  const s = (
    /*#slots*/
    l[5].default
  ), o = Ie(
    s,
    l,
    /*$$scope*/
    l[4],
    si
  );
  return { c() {
    e = D("div"), t = D("div"), o && o.c(), g(t, "class", n = "wx-" + /*theme*/
    l[0] + "-theme x2-1dixdmq"), g(e, "class", "wx-portal x2-1dixdmq");
  }, m(a, r) {
    S(a, e, r), H(e, t), o && o.m(t, null), l[6](t), i = true;
  }, p(a, _ref20) {
    let [r] = _ref20;
    o && o.p && (!i || r & /*$$scope*/
    16) && Oe(
      o,
      s,
      a,
      /*$$scope*/
      a[4],
      i ? Re(
        s,
        /*$$scope*/
        a[4],
        r,
        wc
      ) : Ae(
        /*$$scope*/
        a[4]
      ),
      si
    ), (!i || r & /*theme*/
    1 && n !== (n = "wx-" + /*theme*/
    a[0] + "-theme x2-1dixdmq")) && g(t, "class", n);
  }, i(a) {
    i || (k(o, a), i = true);
  }, o(a) {
    y(o, a), i = false;
  }, d(a) {
    a && v(e), o && o.d(a), l[6](null);
  } };
}
__name(bc, "bc");
function kc(l) {
  for (; l !== document.body && !l.getAttribute("data-wx-portal-root"); ) l = l.parentNode;
  return l;
}
__name(kc, "kc");
function pc(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, s, { theme: o = "" } = e, { target: a = void 0 } = e, r = [];
  const c = /* @__PURE__ */ __name((f) => {
    r && r.push(f);
  }, "c");
  o === "" && (o = ze("wx-theme")), ht(() => {
    (a || kc(s)).appendChild(s), r && r.forEach((d) => d());
  }), rl(() => {
    s && s.parentNode && s.parentNode.removeChild(s);
  });
  function u(f) {
    be[f ? "unshift" : "push"](() => {
      s = f, t(2, s);
    });
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "theme" in f && t(0, o = f.theme), "target" in f && t(3, a = f.target), "$$scope" in f && t(4, i = f.$$scope);
  }, [o, c, s, a, i, n, u];
}
__name(pc, "pc");
var _yc = class _yc extends ee {
  constructor(e) {
    super(), $(this, e, pc, bc, x, { theme: 0, target: 3, mount: 1 });
  }
  get mount() {
    return this.$$.ctx[1];
  }
};
__name(_yc, "yc");
var yc = _yc;
var Ic = { monthFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], hours: "Hours", minutes: "Minutes", done: "Done", clear: "Clear", today: "Today", am: ["am", "AM"], pm: ["pm", "PM"], weekStart: 7, clockFormat: 24 };
var Rc = { ok: "OK", cancel: "Cancel" };
var Oc = { timeFormat: "%H:%i", dateFormat: "%m/%d/%Y" };
var So = { core: Rc, calendar: Ic, formats: Oc };
function Ac(l) {
  let e;
  const t = (
    /*#slots*/
    l[3].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[2],
    null
  );
  return { c() {
    n && n.c();
  }, m(i, s) {
    n && n.m(i, s), e = true;
  }, p(i, _ref24) {
    let [s] = _ref24;
    n && n.p && (!e || s & /*$$scope*/
    4) && Oe(
      n,
      t,
      i,
      /*$$scope*/
      i[2],
      e ? Re(
        t,
        /*$$scope*/
        i[2],
        s,
        null
      ) : Ae(
        /*$$scope*/
        i[2]
      ),
      null
    );
  }, i(i) {
    e || (k(n, i), e = true);
  }, o(i) {
    y(n, i), e = false;
  }, d(i) {
    n && n.d(i);
  } };
}
__name(Ac, "Ac");
function Fc(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { words: s = null } = e, { optional: o = false } = e, a = ze("wx-i18n");
  return a || (a = On(So)), a = a.extend(s, o), It("wx-i18n", a), l.$$set = (r) => {
    "words" in r && t(0, s = r.words), "optional" in r && t(1, o = r.optional), "$$scope" in r && t(2, i = r.$$scope);
  }, [s, o, i, n];
}
__name(Fc, "Fc");
var _Mo = class _Mo extends ee {
  constructor(e) {
    super(), $(this, e, Fc, Ac, x, { words: 0, optional: 1 });
  }
};
__name(_Mo, "Mo");
var Mo = _Mo;
var dl = { gantt: {
  // Header / sidebar
  "Task name": "Task name",
  "Start date": "Start date",
  Duration: "Duration",
  Task: "Task",
  Milestone: "Milestone",
  "Summary task": "Summary task",
  // Sidebar
  Save: "Save",
  Delete: "Delete",
  Name: "Name",
  Description: "Description",
  "Select type": "Select type",
  Type: "Type",
  "End date": "End date",
  Progress: "Progress",
  Predecessors: "Predecessors",
  Successors: "Successors",
  "Add task name": "Add task name",
  "Add description": "Add description",
  "Select link type": "Select link type",
  "End-to-start": "End-to-start",
  "Start-to-start": "Start-to-start",
  "End-to-end": "End-to-end",
  "Start-to-end": "Start-to-end",
  // Context menu / toolbar
  Add: "Add",
  "Child task": "Child task",
  "Task above": "Task above",
  "Task below": "Task below",
  "Convert to": "Convert to",
  Edit: "Edit",
  Cut: "Cut",
  Copy: "Copy",
  Paste: "Paste",
  Move: "Move",
  Up: "Up",
  Down: "Down",
  Indent: "Indent",
  Outdent: "Outdent",
  "Split task": "Split task",
  // Toolbar
  "New task": "New task",
  "Move up": "Move up",
  "Move down": "Move down"
} };
var Pc = (/* @__PURE__ */ new Date()).valueOf();
var Yc = /* @__PURE__ */ __name(() => Pc++, "Yc");
var _To = class _To {
  constructor(e) {
    this._nextHandler = null, this._dispatch = e, this.exec = this.exec.bind(this);
  }
  async exec(e, t) {
    return this._dispatch(e, t), this._nextHandler && await this._nextHandler.exec(e, t), t;
  }
  setNext(e) {
    return this._nextHandler = e;
  }
};
__name(_To, "To");
var To = _To;
var Co = (/* @__PURE__ */ new Date()).valueOf();
var Do = /* @__PURE__ */ __name(() => Co++, "Do");
function Wo() {
  return "temp://" + Co++;
}
__name(Wo, "Wo");
var _ci = class _ci {
  constructor(e) {
    this._data = e, this._pool = /* @__PURE__ */ new Map();
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      this._pool.set(n.id, n);
    }
  }
  add(e) {
    e = { id: Do(), ...e }, this._data.push(e), this._pool.set(e.id, e);
  }
  update(e, t) {
    const n = this._data.findIndex((s) => s.id == e), i = { ...this._data[n], ...t };
    this._data[n] = i, this._pool.set(i.id, i);
  }
  remove(e) {
    this._data = this._data.filter((t) => t.id != e), this._pool.delete(e);
  }
  filter(e) {
    this._data = this._data.filter((t) => {
      const n = e(t);
      return n || this._pool.delete(t.id), n;
    });
  }
  byId(e) {
    return this._pool.get(e);
  }
  map(e) {
    return this._data.map(e);
  }
  forEach(e) {
    this._data.forEach(e);
  }
};
__name(_ci, "ci");
var ci = _ci;
var _Bc = class _Bc {
  constructor(e) {
    const t = { id: 0, $level: 0, data: [], parent: null }, n = /* @__PURE__ */ new Map();
    n.set(0, t), this._pool = n, e && e.length && this.parse(e, 0);
  }
  parse(e, t) {
    const n = this._pool;
    for (let s = 0; s < e.length; s++) {
      const o = e[s];
      o.parent = o.parent || t, o.data = null, n.set(o.id, o);
    }
    for (let s = 0; s < e.length; s++) {
      const o = e[s], a = n.get(o.parent);
      a && (a.data || (a.data = []), a.data.push(o));
    }
    const i = n.get(t);
    Jn(i.data, i.$level + 1);
  }
  add(e, t) {
    this._pool.set(e.id, e);
    const n = this._pool.get(e.parent || 0);
    e.$level = n.$level + 1, n.data ? t === -1 ? n.data.push(e) : n.data.splice(t, -1, e) : n.data = [e];
  }
  addAfter(e, t) {
    if (!t) return this.add(e, -1);
    const n = this.byId(t), i = this.byId(n.parent), s = i.data.indexOf(n) + 1;
    e.parent = i.id, e.$level = i.$level + 1, this.add(e, s);
  }
  remove(e) {
    const t = this._pool.get(e);
    this._remove(t);
    const n = this._pool.get(t.parent);
    n.data = n.data.filter((i) => i.id != e), this._clearBranch(n);
  }
  _remove(e) {
    e.data && e.data.forEach((t) => this._remove(t)), this._pool.delete(e.id);
  }
  update(e, t) {
    let n = this._pool.get(e);
    const i = this._pool.get(n.parent), s = i.data.indexOf(n);
    n = { ...n, ...t }, i.data[s] = n, this._pool.set(n.id, n);
  }
  move(e, t, n) {
    const i = this._pool.get(e), s = t === "child", o = this._pool.get(n), a = o.$level + (s ? 1 : 0);
    if (!i || !o) return;
    const r = this._pool.get(i.parent), c = s ? o : this._pool.get(o.parent);
    c.data || (c.data = []);
    const u = r.data.indexOf(i);
    r.data.splice(u, 1);
    const f = s ? c.data.length : c.data.indexOf(o) + (t === "after" ? 1 : 0);
    if (c.data.splice(f, -1, i), r === c && u === f) return null;
    i.parent = c.id, i.$level !== a && Jn([i], a), this._clearBranch(r);
  }
  _clearBranch(e) {
    e.data && !e.data.length && (e.open && delete e.open, e.data = null);
  }
  toArray() {
    const e = [], t = this._pool.get(0).data;
    return t && Ho(t, e), e;
  }
  byId(e) {
    return this._pool.get(e);
  }
  getBranch(e) {
    return this._pool.get(e).data;
  }
  forEach(e) {
    this._pool.forEach((t, n) => {
      n !== 0 && e(t);
    });
  }
  eachChild(e, t) {
    const n = this.byId(t);
    !n || !n.data || n.data.forEach((i, s) => {
      e(this.byId(i.id), s), this.eachChild(e, i.id);
    });
  }
};
__name(_Bc, "Bc");
var Bc = _Bc;
function Ho(l, e) {
  l.forEach((t) => {
    e.push(t), t.open === true && Ho(t.data, e);
  });
}
__name(Ho, "Ho");
function Jn(l, e) {
  for (let t = 0; t < l.length; t++) {
    const n = l[t];
    n.$level = e, n.data && Jn(n.data, e + 1);
  }
}
__name(Jn, "Jn");
var zo = 2;
var _jc = class _jc {
  constructor(e) {
    e && (this._writable = e.writable, this._async = e.async), this._values = {}, this._state = {};
  }
  setState(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const n = {};
    return this._wrapProperties(e, this._state, this._values, "", n, t), n;
  }
  getState() {
    return this._values;
  }
  getReactive() {
    return this._state;
  }
  _wrapProperties(e, t, n, i, s, o) {
    for (const a in e) {
      const r = t[a], c = n[a], u = e[a];
      if (r && (c === u && typeof u != "object" || u instanceof Date && c instanceof Date && c.getTime() === u.getTime())) continue;
      const f = i + (i ? "." : "") + a;
      r ? (r.__parse(u, f, s, o) && (n[a] = u), o & zo ? s[f] = r.__trigger : r.__trigger()) : (u && u.__reactive ? t[a] = this._wrapNested(u, u, f, s) : t[a] = this._wrapWritable(u), n[a] = u), s[f] = s[f] || null;
    }
  }
  _wrapNested(e, t, n, i) {
    const s = this._wrapWritable(e);
    return this._wrapProperties(e, s, t, n, i, 0), s.__parse = (o, a, r, c) => (this._wrapProperties(o, s, t, a, r, c), false), s;
  }
  _wrapWritable(e) {
    const t = [], n = /* @__PURE__ */ __name(function() {
      for (let i = 0; i < t.length; i++) t[i](e);
    }, "n");
    return { subscribe: /* @__PURE__ */ __name((i) => (t.push(i), this._async ? setTimeout(i, 1, e) : i(e), () => {
      const s = t.indexOf(i);
      s >= 0 && t.splice(s, 1);
    }), "subscribe"), __trigger: /* @__PURE__ */ __name(() => {
      t.length && (this._async ? setTimeout(n, 1) : n());
    }, "__trigger"), __parse: /* @__PURE__ */ __name(function(i) {
      return e = i, true;
    }, "__parse") };
  }
};
__name(_jc, "jc");
var jc = _jc;
var _Zc = class _Zc {
  constructor(e, t, n, i) {
    typeof e == "function" ? this._setter = e : this._setter = e.setState.bind(e), this._routes = t, this._parsers = n, this._prev = {}, this._triggers = /* @__PURE__ */ new Map(), this._sources = /* @__PURE__ */ new Map(), this._routes.forEach((s) => {
      s.in.forEach((o) => {
        const a = this._triggers.get(o) || [];
        a.push(s), this._triggers.set(o, a);
      }), s.out.forEach((o) => {
        const a = this._sources.get(o) || {};
        s.in.forEach((r) => a[r] = true), this._sources.set(o, a);
      });
    }), this._routes.forEach((s) => {
      s.length = Math.max(...s.in.map((o) => No(o, this._sources, 1)));
    }), this._bus = i;
  }
  init(e) {
    const t = {};
    for (const n in e) if (this._prev[n] !== e[n]) {
      const i = this._parsers[n];
      t[n] = i ? i(e[n]) : e[n];
    }
    this._prev = this._prev ? { ...this._prev, ...e } : { ...e }, this.setState(t), this._bus && this._bus.exec("init-state", t);
  }
  setStateAsync(e) {
    const t = this._setter(e, zo);
    return this._async ? Object.assign(this._async.signals, t) : this._async = { signals: t, timer: setTimeout(this._applyState.bind(this), 1) }, t;
  }
  _applyState() {
    const e = this._async;
    if (e) {
      this._async = null, this._triggerUpdates(e.signals, []);
      for (const t in e.signals) {
        const n = e.signals[t];
        n && n();
      }
    }
  }
  setState(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    const n = this._setter(e);
    return this._triggerUpdates(n, t), n;
  }
  _triggerUpdates(e, t) {
    const n = Object.keys(e), i = !t.length;
    t = t || [];
    for (let s = 0; s < n.length; s++) {
      const o = n[s], a = this._triggers.get(o);
      a && a.forEach((r) => {
        t.indexOf(r) == -1 && t.push(r);
      });
    }
    i && this._execNext(t);
  }
  _execNext(e) {
    for (; e.length; ) {
      e.sort((n, i) => n.length < i.length ? 1 : -1);
      const t = e[e.length - 1];
      e.splice(e.length - 1), t.exec(e);
    }
  }
};
__name(_Zc, "Zc");
var Zc = _Zc;
function No(l, e, t) {
  const n = e.get(l);
  if (!n) return t;
  const i = Object.keys(n).map((s) => No(s, e, t + 1));
  return Math.max(...i);
}
__name(No, "No");
var _qc = class _qc {
  constructor() {
    this._nextHandler = null, this._handlers = {}, this._tag = /* @__PURE__ */ new WeakMap(), this.exec = this.exec.bind(this);
  }
  on(e, t, n) {
    let i = this._handlers[e];
    i ? n && n.intercept ? i.unshift(t) : i.push(t) : i = this._handlers[e] = [t], n && n.tag && this._tag.set(t, n.tag);
  }
  intercept(e, t, n) {
    this.on(e, t, { ...n, intercept: true });
  }
  detach(e) {
    for (const t in this._handlers) {
      const n = this._handlers[t];
      for (let i = n.length - 1; i >= 0; i--) this._tag.get(n[i]) === e && n.splice(i, 1);
    }
  }
  async exec(e, t) {
    const n = this._handlers[e];
    if (n) for (let i = 0; i < n.length; i++) {
      const s = n[i](t);
      if (s === false || s && s.then && await s === false) return;
    }
    return this._nextHandler && await this._nextHandler.exec(e, t), t;
  }
  setNext(e) {
    return this._nextHandler = e;
  }
};
__name(_qc, "qc");
var qc = _qc;
function Kc(l, e) {
  return l.sort(Vc(e));
}
__name(Kc, "Kc");
function Gc(l, e) {
  return typeof l == "string" ? l.localeCompare(e, void 0, { numeric: true }) : typeof l == "object" ? l.getTime() - e.getTime() : (l ?? 0) - (e ?? 0);
}
__name(Gc, "Gc");
function Xc(l, e) {
  return typeof l == "string" ? -l.localeCompare(e, void 0, { numeric: true }) : typeof e == "object" ? e.getTime() - l.getTime() : (e ?? 0) - (l ?? 0);
}
__name(Xc, "Xc");
function Vc(_ref25) {
  let { key: l, order: e } = _ref25;
  const t = e === "asc" ? Gc : Xc;
  return (n, i) => t(n[l], i[l]);
}
__name(Vc, "Vc");
function he(l) {
  const e = Object.prototype.toString.call(l);
  return l instanceof Date || typeof l == "object" && e === "[object Date]" ? new l.constructor(+l) : typeof l == "number" || e === "[object Number]" || typeof l == "string" || e === "[object String]" ? new Date(l) : /* @__PURE__ */ new Date(NaN);
}
__name(he, "he");
function lt(l, e) {
  return l instanceof Date ? new l.constructor(e) : new Date(e);
}
__name(lt, "lt");
function Lo(l, e) {
  const t = he(l);
  return isNaN(e) ? lt(l, NaN) : (e && t.setDate(t.getDate() + e), t);
}
__name(Lo, "Lo");
function hl(l, e) {
  const t = he(l);
  if (isNaN(e)) return lt(l, NaN);
  if (!e) return t;
  const n = t.getDate(), i = lt(l, t.getTime());
  i.setMonth(t.getMonth() + e + 1, 0);
  const s = i.getDate();
  return n >= s ? i : (t.setFullYear(i.getFullYear(), i.getMonth(), n), t);
}
__name(hl, "hl");
function Uc(l, e) {
  const t = +he(l);
  return lt(l, t + e);
}
__name(Uc, "Uc");
var An = 6048e5;
var Jc = 864e5;
var Qc = 6e4;
var Eo = 36e5;
function xc(l, e) {
  return Uc(l, e * Eo);
}
__name(xc, "xc");
var $c = {};
function Fn() {
  return $c;
}
__name(Fn, "Fn");
function Ct(l, e) {
  const t = Fn(), n = e?.weekStartsOn ?? e?.locale?.options?.weekStartsOn ?? t.weekStartsOn ?? t.locale?.options?.weekStartsOn ?? 0, i = he(l), s = i.getDay(), o = (s < n ? 7 : 0) + s - n;
  return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
__name(Ct, "Ct");
function Qt(l) {
  return Ct(l, { weekStartsOn: 1 });
}
__name(Qt, "Qt");
function Io(l) {
  const e = he(l), t = e.getFullYear(), n = lt(l, 0);
  n.setFullYear(t + 1, 0, 4), n.setHours(0, 0, 0, 0);
  const i = Qt(n), s = lt(l, 0);
  s.setFullYear(t, 0, 4), s.setHours(0, 0, 0, 0);
  const o = Qt(s);
  return e.getTime() >= i.getTime() ? t + 1 : e.getTime() >= o.getTime() ? t : t - 1;
}
__name(Io, "Io");
function gn(l) {
  const e = he(l);
  return e.setHours(0, 0, 0, 0), e;
}
__name(gn, "gn");
function Hn(l) {
  const e = he(l), t = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()));
  return t.setUTCFullYear(e.getFullYear()), +l - +t;
}
__name(Hn, "Hn");
function ml(l, e) {
  const t = gn(l), n = gn(e), i = +t - Hn(t), s = +n - Hn(n);
  return Math.round((i - s) / Jc);
}
__name(ml, "ml");
function Qn(l) {
  const e = Io(l), t = lt(l, 0);
  return t.setFullYear(e, 0, 4), t.setHours(0, 0, 0, 0), Qt(t);
}
__name(Qn, "Qn");
function eu(l, e) {
  const t = e * 3;
  return hl(l, t);
}
__name(eu, "eu");
function Ro(l, e) {
  const t = e * 7;
  return Lo(l, t);
}
__name(Ro, "Ro");
function tu(l, e) {
  return hl(l, e * 12);
}
__name(tu, "tu");
function un(l, e) {
  const t = he(l), n = he(e), i = t.getTime() - n.getTime();
  return i < 0 ? -1 : i > 0 ? 1 : i;
}
__name(un, "un");
function nu(l, e) {
  const t = gn(l), n = gn(e);
  return +t == +n;
}
__name(nu, "nu");
function lu(l) {
  return l instanceof Date || typeof l == "object" && Object.prototype.toString.call(l) === "[object Date]";
}
__name(lu, "lu");
function iu(l) {
  if (!lu(l) && typeof l != "number") return false;
  const e = he(l);
  return !isNaN(Number(e));
}
__name(iu, "iu");
function _l(l, e) {
  const t = Qt(l), n = Qt(e), i = +t - Hn(t), s = +n - Hn(n);
  return Math.round((i - s) / An);
}
__name(_l, "_l");
function su(l, e) {
  const t = he(l), n = he(e), i = t.getFullYear() - n.getFullYear(), s = t.getMonth() - n.getMonth();
  return i * 12 + s;
}
__name(su, "su");
function ou(l, e) {
  const t = he(l), n = he(e);
  return t.getFullYear() - n.getFullYear();
}
__name(ou, "ou");
function gl(l) {
  return (e) => {
    const t = (l ? Math[l] : Math.trunc)(e);
    return t === 0 ? 0 : t;
  };
}
__name(gl, "gl");
function Oo(l, e) {
  return +he(l) - +he(e);
}
__name(Oo, "Oo");
function ru(l, e, t) {
  const n = Oo(l, e) / Eo;
  return gl(t?.roundingMethod)(n);
}
__name(ru, "ru");
function au(l, e, t) {
  const n = Oo(l, e) / Qc;
  return gl(t?.roundingMethod)(n);
}
__name(au, "au");
function Ao(l) {
  const e = he(l);
  return e.setHours(23, 59, 59, 999), e;
}
__name(Ao, "Ao");
function wl(l) {
  const e = he(l), t = e.getMonth();
  return e.setFullYear(e.getFullYear(), t + 1, 0), e.setHours(23, 59, 59, 999), e;
}
__name(wl, "wl");
function cu(l) {
  const e = he(l);
  return +Ao(e) == +wl(e);
}
__name(cu, "cu");
function Fo(l, e) {
  const t = he(l), n = he(e), i = un(t, n), s = Math.abs(su(t, n));
  let o;
  if (s < 1) o = 0;
  else {
    t.getMonth() === 1 && t.getDate() > 27 && t.setDate(30), t.setMonth(t.getMonth() - i * s);
    let a = un(t, n) === -i;
    cu(he(l)) && s === 1 && un(l, n) === 1 && (a = false), o = i * (s - Number(a));
  }
  return o === 0 ? 0 : o;
}
__name(Fo, "Fo");
function uu(l, e, t) {
  const n = Fo(l, e) / 3;
  return gl(t?.roundingMethod)(n);
}
__name(uu, "uu");
function fu(l, e) {
  const t = he(l), n = he(e), i = un(t, n), s = Math.abs(ou(t, n));
  t.setFullYear(1584), n.setFullYear(1584);
  const o = un(t, n) === -i, a = i * (s - +o);
  return a === 0 ? 0 : a;
}
__name(fu, "fu");
function wn(l) {
  const e = he(l), t = e.getMonth(), n = t - t % 3;
  return e.setMonth(n, 1), e.setHours(0, 0, 0, 0), e;
}
__name(wn, "wn");
function Po(l) {
  const e = he(l);
  return e.setDate(1), e.setHours(0, 0, 0, 0), e;
}
__name(Po, "Po");
function du(l) {
  const e = he(l), t = e.getFullYear();
  return e.setFullYear(t + 1, 0, 0), e.setHours(23, 59, 59, 999), e;
}
__name(du, "du");
function Yo(l) {
  const e = he(l), t = lt(l, 0);
  return t.setFullYear(e.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
__name(Yo, "Yo");
function hu(l) {
  const e = he(l);
  return e.setMinutes(59, 59, 999), e;
}
__name(hu, "hu");
function mu(l, e) {
  const t = e?.weekStartsOn, n = he(l), i = n.getDay(), s = (i < t ? -7 : 0) + 6 - (i - t);
  return n.setDate(n.getDate() + s), n.setHours(23, 59, 59, 999), n;
}
__name(mu, "mu");
function bl(l) {
  const e = he(l), t = e.getMonth(), n = t - t % 3 + 3;
  return e.setMonth(n, 0), e.setHours(23, 59, 59, 999), e;
}
__name(bl, "bl");
var _u = { lessThanXSeconds: { one: "less than a second", other: "less than {{count}} seconds" }, xSeconds: { one: "1 second", other: "{{count}} seconds" }, halfAMinute: "half a minute", lessThanXMinutes: { one: "less than a minute", other: "less than {{count}} minutes" }, xMinutes: { one: "1 minute", other: "{{count}} minutes" }, aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" }, xHours: { one: "1 hour", other: "{{count}} hours" }, xDays: { one: "1 day", other: "{{count}} days" }, aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" }, xWeeks: { one: "1 week", other: "{{count}} weeks" }, aboutXMonths: { one: "about 1 month", other: "about {{count}} months" }, xMonths: { one: "1 month", other: "{{count}} months" }, aboutXYears: { one: "about 1 year", other: "about {{count}} years" }, xYears: { one: "1 year", other: "{{count}} years" }, overXYears: { one: "over 1 year", other: "over {{count}} years" }, almostXYears: { one: "almost 1 year", other: "almost {{count}} years" } };
var gu = /* @__PURE__ */ __name((l, e, t) => {
  let n;
  const i = _u[l];
  return typeof i == "string" ? n = i : e === 1 ? n = i.one : n = i.other.replace("{{count}}", e.toString()), t?.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
}, "gu");
function jn(l) {
  return function() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const t = e.width ? String(e.width) : l.defaultWidth;
    return l.formats[t] || l.formats[l.defaultWidth];
  };
}
__name(jn, "jn");
var wu = { full: "EEEE, MMMM do, y", long: "MMMM do, y", medium: "MMM d, y", short: "MM/dd/yyyy" };
var bu = { full: "h:mm:ss a zzzz", long: "h:mm:ss a z", medium: "h:mm:ss a", short: "h:mm a" };
var ku = { full: "{{date}} 'at' {{time}}", long: "{{date}} 'at' {{time}}", medium: "{{date}}, {{time}}", short: "{{date}}, {{time}}" };
var pu = { date: jn({ formats: wu, defaultWidth: "full" }), time: jn({ formats: bu, defaultWidth: "full" }), dateTime: jn({ formats: ku, defaultWidth: "full" }) };
var yu = { lastWeek: "'last' eeee 'at' p", yesterday: "'yesterday at' p", today: "'today at' p", tomorrow: "'tomorrow at' p", nextWeek: "eeee 'at' p", other: "P" };
var vu = /* @__PURE__ */ __name((l, e, t, n) => yu[l], "vu");
function on(l) {
  return (e, t) => {
    const n = t?.context ? String(t.context) : "standalone";
    let i;
    if (n === "formatting" && l.formattingValues) {
      const o = l.defaultFormattingWidth || l.defaultWidth, a = t?.width ? String(t.width) : o;
      i = l.formattingValues[a] || l.formattingValues[o];
    } else {
      const o = l.defaultWidth, a = t?.width ? String(t.width) : l.defaultWidth;
      i = l.values[a] || l.values[o];
    }
    const s = l.argumentCallback ? l.argumentCallback(e) : e;
    return i[s];
  };
}
__name(on, "on");
var Su = { narrow: ["B", "A"], abbreviated: ["BC", "AD"], wide: ["Before Christ", "Anno Domini"] };
var Mu = { narrow: ["1", "2", "3", "4"], abbreviated: ["Q1", "Q2", "Q3", "Q4"], wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"] };
var Tu = { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] };
var Cu = { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
var Du = { narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" }, abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" }, wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" } };
var Wu = { narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" }, abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" }, wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" } };
var Hu = /* @__PURE__ */ __name((l, e) => {
  const t = Number(l), n = t % 100;
  if (n > 20 || n < 10) switch (n % 10) {
    case 1:
      return t + "st";
    case 2:
      return t + "nd";
    case 3:
      return t + "rd";
  }
  return t + "th";
}, "Hu");
var zu = { ordinalNumber: Hu, era: on({ values: Su, defaultWidth: "wide" }), quarter: on({ values: Mu, defaultWidth: "wide", argumentCallback: /* @__PURE__ */ __name((l) => l - 1, "argumentCallback") }), month: on({ values: Tu, defaultWidth: "wide" }), day: on({ values: Cu, defaultWidth: "wide" }), dayPeriod: on({ values: Du, defaultWidth: "wide", formattingValues: Wu, defaultFormattingWidth: "wide" }) };
function rn(l) {
  return function(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = t.width, i = n && l.matchPatterns[n] || l.matchPatterns[l.defaultMatchWidth], s = e.match(i);
    if (!s) return null;
    const o = s[0], a = n && l.parsePatterns[n] || l.parsePatterns[l.defaultParseWidth], r = Array.isArray(a) ? Lu(a, (f) => f.test(o)) : Nu(a, (f) => f.test(o));
    let c;
    c = l.valueCallback ? l.valueCallback(r) : r, c = t.valueCallback ? t.valueCallback(c) : c;
    const u = e.slice(o.length);
    return { value: c, rest: u };
  };
}
__name(rn, "rn");
function Nu(l, e) {
  for (const t in l) if (Object.prototype.hasOwnProperty.call(l, t) && e(l[t])) return t;
}
__name(Nu, "Nu");
function Lu(l, e) {
  for (let t = 0; t < l.length; t++) if (e(l[t])) return t;
}
__name(Lu, "Lu");
function Eu(l) {
  return function(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = e.match(l.matchPattern);
    if (!n) return null;
    const i = n[0], s = e.match(l.parsePattern);
    if (!s) return null;
    let o = l.valueCallback ? l.valueCallback(s[0]) : s[0];
    o = t.valueCallback ? t.valueCallback(o) : o;
    const a = e.slice(i.length);
    return { value: o, rest: a };
  };
}
__name(Eu, "Eu");
var Iu = /^(\d+)(th|st|nd|rd)?/i;
var Ru = /\d+/i;
var Ou = { narrow: /^(b|a)/i, abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i, wide: /^(before christ|before common era|anno domini|common era)/i };
var Au = { any: [/^b/i, /^(a|c)/i] };
var Fu = { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i };
var Pu = { any: [/1/i, /2/i, /3/i, /4/i] };
var Yu = { narrow: /^[jfmasond]/i, abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i };
var Bu = { narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i], any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i] };
var ju = { narrow: /^[smtwf]/i, short: /^(su|mo|tu|we|th|fr|sa)/i, abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i, wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i };
var Zu = { narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i], any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i] };
var qu = { narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i, any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i };
var Ku = { any: { am: /^a/i, pm: /^p/i, midnight: /^mi/i, noon: /^no/i, morning: /morning/i, afternoon: /afternoon/i, evening: /evening/i, night: /night/i } };
var Gu = { ordinalNumber: Eu({ matchPattern: Iu, parsePattern: Ru, valueCallback: /* @__PURE__ */ __name((l) => parseInt(l, 10), "valueCallback") }), era: rn({ matchPatterns: Ou, defaultMatchWidth: "wide", parsePatterns: Au, defaultParseWidth: "any" }), quarter: rn({ matchPatterns: Fu, defaultMatchWidth: "wide", parsePatterns: Pu, defaultParseWidth: "any", valueCallback: /* @__PURE__ */ __name((l) => l + 1, "valueCallback") }), month: rn({ matchPatterns: Yu, defaultMatchWidth: "wide", parsePatterns: Bu, defaultParseWidth: "any" }), day: rn({ matchPatterns: ju, defaultMatchWidth: "wide", parsePatterns: Zu, defaultParseWidth: "any" }), dayPeriod: rn({ matchPatterns: qu, defaultMatchWidth: "any", parsePatterns: Ku, defaultParseWidth: "any" }) };
var Xu = { code: "en-US", formatDistance: gu, formatLong: pu, formatRelative: vu, localize: zu, match: Gu, options: { weekStartsOn: 0, firstWeekContainsDate: 1 } };
function Vu(l) {
  const e = he(l);
  return ml(e, Yo(e)) + 1;
}
__name(Vu, "Vu");
function Uu(l) {
  const e = he(l), t = +Qt(e) - +Qn(e);
  return Math.round(t / An) + 1;
}
__name(Uu, "Uu");
function Bo(l, e) {
  const t = he(l), n = t.getFullYear(), i = Fn(), s = e?.firstWeekContainsDate ?? e?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1, o = lt(l, 0);
  o.setFullYear(n + 1, 0, s), o.setHours(0, 0, 0, 0);
  const a = Ct(o, e), r = lt(l, 0);
  r.setFullYear(n, 0, s), r.setHours(0, 0, 0, 0);
  const c = Ct(r, e);
  return t.getTime() >= a.getTime() ? n + 1 : t.getTime() >= c.getTime() ? n : n - 1;
}
__name(Bo, "Bo");
function Ju(l, e) {
  const t = Fn(), n = e?.firstWeekContainsDate ?? e?.locale?.options?.firstWeekContainsDate ?? t.firstWeekContainsDate ?? t.locale?.options?.firstWeekContainsDate ?? 1, i = Bo(l, e), s = lt(l, 0);
  return s.setFullYear(i, 0, n), s.setHours(0, 0, 0, 0), Ct(s, e);
}
__name(Ju, "Ju");
function Qu(l, e) {
  const t = he(l), n = +Ct(t, e) - +Ju(t, e);
  return Math.round(n / An) + 1;
}
__name(Qu, "Qu");
function Ce(l, e) {
  const t = l < 0 ? "-" : "", n = Math.abs(l).toString().padStart(e, "0");
  return t + n;
}
__name(Ce, "Ce");
var St = { y(l, e) {
  const t = l.getFullYear(), n = t > 0 ? t : 1 - t;
  return Ce(e === "yy" ? n % 100 : n, e.length);
}, M(l, e) {
  const t = l.getMonth();
  return e === "M" ? String(t + 1) : Ce(t + 1, 2);
}, d(l, e) {
  return Ce(l.getDate(), e.length);
}, a(l, e) {
  const t = l.getHours() / 12 >= 1 ? "pm" : "am";
  switch (e) {
    case "a":
    case "aa":
      return t.toUpperCase();
    case "aaa":
      return t;
    case "aaaaa":
      return t[0];
    case "aaaa":
    default:
      return t === "am" ? "a.m." : "p.m.";
  }
}, h(l, e) {
  return Ce(l.getHours() % 12 || 12, e.length);
}, H(l, e) {
  return Ce(l.getHours(), e.length);
}, m(l, e) {
  return Ce(l.getMinutes(), e.length);
}, s(l, e) {
  return Ce(l.getSeconds(), e.length);
}, S(l, e) {
  const t = e.length, n = l.getMilliseconds(), i = Math.trunc(n * Math.pow(10, t - 3));
  return Ce(i, e.length);
} };
var jt = { am: "am", pm: "pm", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" };
var ui = { G: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getFullYear() > 0 ? 1 : 0;
  switch (e) {
    case "G":
    case "GG":
    case "GGG":
      return t.era(n, { width: "abbreviated" });
    case "GGGGG":
      return t.era(n, { width: "narrow" });
    case "GGGG":
    default:
      return t.era(n, { width: "wide" });
  }
}, "G"), y: /* @__PURE__ */ __name(function(l, e, t) {
  if (e === "yo") {
    const n = l.getFullYear(), i = n > 0 ? n : 1 - n;
    return t.ordinalNumber(i, { unit: "year" });
  }
  return St.y(l, e);
}, "y"), Y: /* @__PURE__ */ __name(function(l, e, t, n) {
  const i = Bo(l, n), s = i > 0 ? i : 1 - i;
  if (e === "YY") {
    const o = s % 100;
    return Ce(o, 2);
  }
  return e === "Yo" ? t.ordinalNumber(s, { unit: "year" }) : Ce(s, e.length);
}, "Y"), R: /* @__PURE__ */ __name(function(l, e) {
  const t = Io(l);
  return Ce(t, e.length);
}, "R"), u: /* @__PURE__ */ __name(function(l, e) {
  const t = l.getFullYear();
  return Ce(t, e.length);
}, "u"), Q: /* @__PURE__ */ __name(function(l, e, t) {
  const n = Math.ceil((l.getMonth() + 1) / 3);
  switch (e) {
    case "Q":
      return String(n);
    case "QQ":
      return Ce(n, 2);
    case "Qo":
      return t.ordinalNumber(n, { unit: "quarter" });
    case "QQQ":
      return t.quarter(n, { width: "abbreviated", context: "formatting" });
    case "QQQQQ":
      return t.quarter(n, { width: "narrow", context: "formatting" });
    case "QQQQ":
    default:
      return t.quarter(n, { width: "wide", context: "formatting" });
  }
}, "Q"), q: /* @__PURE__ */ __name(function(l, e, t) {
  const n = Math.ceil((l.getMonth() + 1) / 3);
  switch (e) {
    case "q":
      return String(n);
    case "qq":
      return Ce(n, 2);
    case "qo":
      return t.ordinalNumber(n, { unit: "quarter" });
    case "qqq":
      return t.quarter(n, { width: "abbreviated", context: "standalone" });
    case "qqqqq":
      return t.quarter(n, { width: "narrow", context: "standalone" });
    case "qqqq":
    default:
      return t.quarter(n, { width: "wide", context: "standalone" });
  }
}, "q"), M: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getMonth();
  switch (e) {
    case "M":
    case "MM":
      return St.M(l, e);
    case "Mo":
      return t.ordinalNumber(n + 1, { unit: "month" });
    case "MMM":
      return t.month(n, { width: "abbreviated", context: "formatting" });
    case "MMMMM":
      return t.month(n, { width: "narrow", context: "formatting" });
    case "MMMM":
    default:
      return t.month(n, { width: "wide", context: "formatting" });
  }
}, "M"), L: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getMonth();
  switch (e) {
    case "L":
      return String(n + 1);
    case "LL":
      return Ce(n + 1, 2);
    case "Lo":
      return t.ordinalNumber(n + 1, { unit: "month" });
    case "LLL":
      return t.month(n, { width: "abbreviated", context: "standalone" });
    case "LLLLL":
      return t.month(n, { width: "narrow", context: "standalone" });
    case "LLLL":
    default:
      return t.month(n, { width: "wide", context: "standalone" });
  }
}, "L"), w: /* @__PURE__ */ __name(function(l, e, t, n) {
  const i = Qu(l, n);
  return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : Ce(i, e.length);
}, "w"), I: /* @__PURE__ */ __name(function(l, e, t) {
  const n = Uu(l);
  return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : Ce(n, e.length);
}, "I"), d: /* @__PURE__ */ __name(function(l, e, t) {
  return e === "do" ? t.ordinalNumber(l.getDate(), { unit: "date" }) : St.d(l, e);
}, "d"), D: /* @__PURE__ */ __name(function(l, e, t) {
  const n = Vu(l);
  return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : Ce(n, e.length);
}, "D"), E: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getDay();
  switch (e) {
    case "E":
    case "EE":
    case "EEE":
      return t.day(n, { width: "abbreviated", context: "formatting" });
    case "EEEEE":
      return t.day(n, { width: "narrow", context: "formatting" });
    case "EEEEEE":
      return t.day(n, { width: "short", context: "formatting" });
    case "EEEE":
    default:
      return t.day(n, { width: "wide", context: "formatting" });
  }
}, "E"), e: /* @__PURE__ */ __name(function(l, e, t, n) {
  const i = l.getDay(), s = (i - n.weekStartsOn + 8) % 7 || 7;
  switch (e) {
    case "e":
      return String(s);
    case "ee":
      return Ce(s, 2);
    case "eo":
      return t.ordinalNumber(s, { unit: "day" });
    case "eee":
      return t.day(i, { width: "abbreviated", context: "formatting" });
    case "eeeee":
      return t.day(i, { width: "narrow", context: "formatting" });
    case "eeeeee":
      return t.day(i, { width: "short", context: "formatting" });
    case "eeee":
    default:
      return t.day(i, { width: "wide", context: "formatting" });
  }
}, "e"), c: /* @__PURE__ */ __name(function(l, e, t, n) {
  const i = l.getDay(), s = (i - n.weekStartsOn + 8) % 7 || 7;
  switch (e) {
    case "c":
      return String(s);
    case "cc":
      return Ce(s, e.length);
    case "co":
      return t.ordinalNumber(s, { unit: "day" });
    case "ccc":
      return t.day(i, { width: "abbreviated", context: "standalone" });
    case "ccccc":
      return t.day(i, { width: "narrow", context: "standalone" });
    case "cccccc":
      return t.day(i, { width: "short", context: "standalone" });
    case "cccc":
    default:
      return t.day(i, { width: "wide", context: "standalone" });
  }
}, "c"), i: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getDay(), i = n === 0 ? 7 : n;
  switch (e) {
    case "i":
      return String(i);
    case "ii":
      return Ce(i, e.length);
    case "io":
      return t.ordinalNumber(i, { unit: "day" });
    case "iii":
      return t.day(n, { width: "abbreviated", context: "formatting" });
    case "iiiii":
      return t.day(n, { width: "narrow", context: "formatting" });
    case "iiiiii":
      return t.day(n, { width: "short", context: "formatting" });
    case "iiii":
    default:
      return t.day(n, { width: "wide", context: "formatting" });
  }
}, "i"), a: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getHours() / 12 >= 1 ? "pm" : "am";
  switch (e) {
    case "a":
    case "aa":
      return t.dayPeriod(n, { width: "abbreviated", context: "formatting" });
    case "aaa":
      return t.dayPeriod(n, { width: "abbreviated", context: "formatting" }).toLowerCase();
    case "aaaaa":
      return t.dayPeriod(n, { width: "narrow", context: "formatting" });
    case "aaaa":
    default:
      return t.dayPeriod(n, { width: "wide", context: "formatting" });
  }
}, "a"), b: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getHours();
  let i;
  switch (n === 12 ? i = jt.noon : n === 0 ? i = jt.midnight : i = n / 12 >= 1 ? "pm" : "am", e) {
    case "b":
    case "bb":
      return t.dayPeriod(i, { width: "abbreviated", context: "formatting" });
    case "bbb":
      return t.dayPeriod(i, { width: "abbreviated", context: "formatting" }).toLowerCase();
    case "bbbbb":
      return t.dayPeriod(i, { width: "narrow", context: "formatting" });
    case "bbbb":
    default:
      return t.dayPeriod(i, { width: "wide", context: "formatting" });
  }
}, "b"), B: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getHours();
  let i;
  switch (n >= 17 ? i = jt.evening : n >= 12 ? i = jt.afternoon : n >= 4 ? i = jt.morning : i = jt.night, e) {
    case "B":
    case "BB":
    case "BBB":
      return t.dayPeriod(i, { width: "abbreviated", context: "formatting" });
    case "BBBBB":
      return t.dayPeriod(i, { width: "narrow", context: "formatting" });
    case "BBBB":
    default:
      return t.dayPeriod(i, { width: "wide", context: "formatting" });
  }
}, "B"), h: /* @__PURE__ */ __name(function(l, e, t) {
  if (e === "ho") {
    let n = l.getHours() % 12;
    return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
  }
  return St.h(l, e);
}, "h"), H: /* @__PURE__ */ __name(function(l, e, t) {
  return e === "Ho" ? t.ordinalNumber(l.getHours(), { unit: "hour" }) : St.H(l, e);
}, "H"), K: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getHours() % 12;
  return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : Ce(n, e.length);
}, "K"), k: /* @__PURE__ */ __name(function(l, e, t) {
  let n = l.getHours();
  return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : Ce(n, e.length);
}, "k"), m: /* @__PURE__ */ __name(function(l, e, t) {
  return e === "mo" ? t.ordinalNumber(l.getMinutes(), { unit: "minute" }) : St.m(l, e);
}, "m"), s: /* @__PURE__ */ __name(function(l, e, t) {
  return e === "so" ? t.ordinalNumber(l.getSeconds(), { unit: "second" }) : St.s(l, e);
}, "s"), S: /* @__PURE__ */ __name(function(l, e) {
  return St.S(l, e);
}, "S"), X: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getTimezoneOffset();
  if (n === 0) return "Z";
  switch (e) {
    case "X":
      return di(n);
    case "XXXX":
    case "XX":
      return Nt(n);
    case "XXXXX":
    case "XXX":
    default:
      return Nt(n, ":");
  }
}, "X"), x: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getTimezoneOffset();
  switch (e) {
    case "x":
      return di(n);
    case "xxxx":
    case "xx":
      return Nt(n);
    case "xxxxx":
    case "xxx":
    default:
      return Nt(n, ":");
  }
}, "x"), O: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getTimezoneOffset();
  switch (e) {
    case "O":
    case "OO":
    case "OOO":
      return "GMT" + fi(n, ":");
    case "OOOO":
    default:
      return "GMT" + Nt(n, ":");
  }
}, "O"), z: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getTimezoneOffset();
  switch (e) {
    case "z":
    case "zz":
    case "zzz":
      return "GMT" + fi(n, ":");
    case "zzzz":
    default:
      return "GMT" + Nt(n, ":");
  }
}, "z"), t: /* @__PURE__ */ __name(function(l, e, t) {
  const n = Math.trunc(l.getTime() / 1e3);
  return Ce(n, e.length);
}, "t"), T: /* @__PURE__ */ __name(function(l, e, t) {
  const n = l.getTime();
  return Ce(n, e.length);
}, "T") };
function fi(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  const t = l > 0 ? "-" : "+", n = Math.abs(l), i = Math.trunc(n / 60), s = n % 60;
  return s === 0 ? t + String(i) : t + String(i) + e + Ce(s, 2);
}
__name(fi, "fi");
function di(l, e) {
  return l % 60 === 0 ? (l > 0 ? "-" : "+") + Ce(Math.abs(l) / 60, 2) : Nt(l, e);
}
__name(di, "di");
function Nt(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  const t = l > 0 ? "-" : "+", n = Math.abs(l), i = Ce(Math.trunc(n / 60), 2), s = Ce(n % 60, 2);
  return t + i + e + s;
}
__name(Nt, "Nt");
var hi = /* @__PURE__ */ __name((l, e) => {
  switch (l) {
    case "P":
      return e.date({ width: "short" });
    case "PP":
      return e.date({ width: "medium" });
    case "PPP":
      return e.date({ width: "long" });
    case "PPPP":
    default:
      return e.date({ width: "full" });
  }
}, "hi");
var jo = /* @__PURE__ */ __name((l, e) => {
  switch (l) {
    case "p":
      return e.time({ width: "short" });
    case "pp":
      return e.time({ width: "medium" });
    case "ppp":
      return e.time({ width: "long" });
    case "pppp":
    default:
      return e.time({ width: "full" });
  }
}, "jo");
var xu = /* @__PURE__ */ __name((l, e) => {
  const t = l.match(/(P+)(p+)?/) || [], n = t[1], i = t[2];
  if (!i) return hi(l, e);
  let s;
  switch (n) {
    case "P":
      s = e.dateTime({ width: "short" });
      break;
    case "PP":
      s = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      s = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      s = e.dateTime({ width: "full" });
      break;
  }
  return s.replace("{{date}}", hi(n, e)).replace("{{time}}", jo(i, e));
}, "xu");
var $u = { p: jo, P: xu };
var ef = /^D+$/;
var tf = /^Y+$/;
var nf = ["D", "DD", "YY", "YYYY"];
function lf(l) {
  return ef.test(l);
}
__name(lf, "lf");
function sf(l) {
  return tf.test(l);
}
__name(sf, "sf");
function of(l, e, t) {
  const n = rf(l, e, t);
  if (console.warn(n), nf.includes(l)) throw new RangeError(n);
}
__name(of, "of");
function rf(l, e, t) {
  const n = l[0] === "Y" ? "years" : "days of the month";
  return `Use \`${l.toLowerCase()}\` instead of \`${l}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
__name(rf, "rf");
var af = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var cf = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var uf = /^'([^]*?)'?$/;
var ff = /''/g;
var df = /[a-zA-Z]/;
function xn(l, e, t) {
  const n = Fn(), i = t?.locale ?? n.locale ?? Xu, s = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, o = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, a = he(l);
  if (!iu(a)) throw new RangeError("Invalid time value");
  let r = e.match(cf).map((u) => {
    const f = u[0];
    if (f === "p" || f === "P") {
      const d = $u[f];
      return d(u, i.formatLong);
    }
    return u;
  }).join("").match(af).map((u) => {
    if (u === "''") return { isToken: false, value: "'" };
    const f = u[0];
    if (f === "'") return { isToken: false, value: hf(u) };
    if (ui[f]) return { isToken: true, value: u };
    if (f.match(df)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + f + "`");
    return { isToken: false, value: u };
  });
  i.localize.preprocessor && (r = i.localize.preprocessor(a, r));
  const c = { firstWeekContainsDate: s, weekStartsOn: o, locale: i };
  return r.map((u) => {
    if (!u.isToken) return u.value;
    const f = u.value;
    (!t?.useAdditionalWeekYearTokens && sf(f) || !t?.useAdditionalDayOfYearTokens && lf(f)) && of(f, e, String(l));
    const d = ui[f[0]];
    return d(a, f, i.localize, c);
  }).join("");
}
__name(xn, "xn");
function hf(l) {
  const e = l.match(uf);
  return e ? e[1].replace(ff, "'") : l;
}
__name(hf, "hf");
function Zo(l) {
  const e = he(l), t = e.getFullYear(), n = e.getMonth(), i = lt(l, 0);
  return i.setFullYear(t, n + 1, 0), i.setHours(0, 0, 0, 0), i.getDate();
}
__name(Zo, "Zo");
function mf(l) {
  const e = he(l).getFullYear();
  return e % 400 === 0 || e % 4 === 0 && e % 100 !== 0;
}
__name(mf, "mf");
function qo(l) {
  const e = he(l);
  return String(new Date(e)) === "Invalid Date" ? NaN : mf(e) ? 366 : 365;
}
__name(qo, "qo");
function _f(l) {
  const e = Qn(l), t = +Qn(Ro(e, 60)) - +e;
  return Math.round(t / An);
}
__name(_f, "_f");
function Kt(l, e) {
  const t = he(l), n = he(e);
  return +t == +n;
}
__name(Kt, "Kt");
function gf(l) {
  const e = he(l);
  return e.setMinutes(0, 0, 0), e;
}
__name(gf, "gf");
function wf(l, e, t) {
  const n = Ct(l, t), i = Ct(e, t);
  return +n == +i;
}
__name(wf, "wf");
function bf(l, e) {
  const t = he(l), n = he(e);
  return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth();
}
__name(bf, "bf");
function kf(l, e) {
  const t = wn(l), n = wn(e);
  return +t == +n;
}
__name(kf, "kf");
function pf(l, e) {
  const t = he(l), n = he(e);
  return t.getFullYear() === n.getFullYear();
}
__name(pf, "pf");
var mi = { year: fu, quarter: uu, month: Fo, week: _l, day: ml, hour: ru, minute: au };
var bn = { year: { quarter: 4, month: 12, week: _f, day: yf, hour: vf }, quarter: { month: 3, week: Sf, day: Ko, hour: Mf }, month: { week: Tf, day: Cf, hour: Df }, week: { day: 7, hour: 24 * 7 }, day: { hour: 24 }, hour: { minute: 60 } };
function yf(l) {
  return l ? qo(l) : 365;
}
__name(yf, "yf");
function vf(l) {
  return qo(l) * 24;
}
__name(vf, "vf");
function Sf(l) {
  const e = wn(l), t = bl(l);
  return _l(t, e);
}
__name(Sf, "Sf");
function Ko(l) {
  if (l) {
    const e = wn(l), t = bl(l);
    return ml(t, e);
  }
  return 91;
}
__name(Ko, "Ko");
function Mf(l) {
  return Ko(l) * 24;
}
__name(Mf, "Mf");
function Tf(l) {
  if (l) {
    const e = Po(l), t = wl(l);
    return _l(t, e);
  }
  return 5;
}
__name(Tf, "Tf");
function Cf(l) {
  return l ? Zo(l) : 30;
}
__name(Cf, "Cf");
function Df(l) {
  return Zo(l) * 24;
}
__name(Df, "Df");
function zn(l, e, t) {
  const n = bn[l][e];
  return n ? typeof n == "number" ? n : n(t) : 1;
}
__name(zn, "zn");
function Wf(l, e) {
  return l === e || !!(bn[l] && bn[l][e]);
}
__name(Wf, "Wf");
var Go = { year: tu, quarter: eu, month: hl, week: Ro, day: Lo, hour: xc };
function kl(l) {
  return (e, t, n, i) => !bn[l][n] || typeof bn[l][n] == "number" || Xo(l, e, t) ? an(l, e, t, n, i) : Hf(e, t, l, n, i);
}
__name(kl, "kl");
function an(l, e, t, n, i) {
  const s = n || l;
  let o = t, a = e;
  if (i && (o = bt(s, t), a = bt(s, e), a < e && (a = ft(s)(a, 1))), l !== s) {
    const r = mi[s](a, o), c = zn(l, s, t);
    return r / c;
  } else return mi[s](a, o);
}
__name(an, "an");
function Hf(l, e, t, n, i) {
  let s = 0;
  if (e > bt(t, e)) {
    const a = zf(t, e);
    s = an(t, a, e, n), e = a;
  }
  let o = 0;
  return Xo(t, e, l) || (o = an(t, bt(t, l), e), e = Go[t](e, o)), o += s + an(t, l, e, n), !o && i && (o = an(t, l, e, n, i)), o;
}
__name(Hf, "Hf");
function ft(l) {
  return Go[l];
}
__name(ft, "ft");
function bt(l, e) {
  switch (l) {
    case "year":
      return Yo(e);
    case "quarter":
      return wn(e);
    case "month":
      return Po(e);
    case "week":
      return Ct(e, { weekStartsOn: 1 });
    case "day":
      return gn(e);
    case "hour":
      return gf(e);
    default:
      return new Date(e);
  }
}
__name(bt, "bt");
function zf(l, e) {
  switch (l) {
    case "year":
      return du(e);
    case "quarter":
      return bl(e);
    case "month":
      return wl(e);
    case "week":
      return mu(e, { weekStartsOn: 1 });
    case "day":
      return Ao(e);
    case "hour":
      return hu(e);
    default:
      return new Date(e);
  }
}
__name(zf, "zf");
function Xo(l, e, t) {
  switch (l) {
    case "year":
      return pf(e, t);
    case "quarter":
      return kf(e, t);
    case "month":
      return bf(e, t);
    case "week":
      return wf(e, t, { weekStartsOn: 1 });
    case "day":
      return nu(e, t);
    default:
      return false;
  }
}
__name(Xo, "Xo");
var $n = 8;
var Vo = 4;
var Nf = 3;
var _i = 7;
var Lf = $n + Vo;
function Uo(l, e) {
  l.open && l.data?.forEach((t) => {
    t.$x += e, Uo(t, e);
  });
}
__name(Uo, "Uo");
function el(l, e, t, n) {
  const i = l.getSummaryId(e.id);
  if (i) {
    const s = l.byId(i), o = { xMin: 1 / 0, xMax: 0 };
    Jo(s, o, t, n), s.$x = o.xMin, s.$w = o.xMax - o.xMin, el(l, s, t, n);
  }
}
__name(el, "el");
function Jo(l, e, t, n) {
  const { lengthUnit: i, start: s } = t;
  l.data?.forEach((o) => {
    typeof o.$x > "u" && (o.$x = Math.round(t.diff(o.start, s, i) * n), o.$w = Math.round(t.diff(o.end, o.start, i, true) * n));
    const a = o.type === "milestone" && o.$h ? o.$h / 2 : 0;
    e.xMin > o.$x && (e.xMin = o.$x + a);
    const r = o.$x + o.$w - a;
    e.xMax < r && (e.xMax = r), o.type !== "summary" && Jo(o, e, t, n);
  });
}
__name(Jo, "Jo");
function pl(l, e) {
  let t;
  e && (t = e.filter((i) => i.parent == l.id));
  const n = { data: t, ...l };
  if (n.data?.length) n.data.forEach((i) => {
    (e || i.type != "summary" && i.data) && (i = pl(i, e)), (!n.start || n.start > i.start) && (n.start = new Date(i.start)), (!n.end || n.end < i.end || i.type === "milestone" && n.end < i.start) && (n.end = new Date(i.end || i.start));
  });
  else if (l.type === "summary") throw Error("Summary tasks must have start and end dates if they have no subtasks");
  return n;
}
__name(pl, "pl");
function Ef(l, e, t, n, i, s) {
  return gi(l, e, t, n, i, s, false), s && gi(l, e, t, n, i, s, true), l;
}
__name(Ef, "Ef");
function gi(l, e, t, n, i, s, o) {
  const { start: a, end: r, lengthUnit: c, diff: u } = i, f = (o ? "base_" : "") + "start", d = (o ? "base_" : "") + "end", h = "$x" + (o ? "_base" : ""), m = "$y" + (o ? "_base" : ""), _ = "$w" + (o ? "_base" : ""), w = "$h" + (o ? "_base" : ""), b = "$skip" + (o ? "_baseline" : "");
  let p = l[f], z = l[d];
  if (o && !p) {
    l[b] = true;
    return;
  }
  l[f] < a && (l[d] < a || Kt(l[d], a)) ? p = z = a : l[f] > r && (p = z = r), l[h] = Math.round(u(p, a, c) * t), l[m] = o ? l.$y + l.$h + Vo : n * e + Nf, l[_] = Math.round(u(z, p, c, true) * t), l[w] = o ? $n : s ? n - _i - Lf : n - _i, l.type === "milestone" && (l[h] = l[h] - l.$h / 2, l[_] = l.$h, o && (l[m] = l.$y + $n, l[_] = l[w] = l.$h)), l[b] = Kt(p, z);
}
__name(gi, "gi");
var If = ft("day");
var Rf = kl("day");
var _Of = class _Of extends Bc {
  constructor(e) {
    super();
    __publicField(this, "_sort");
    this.parse(e, 0);
  }
  parse(e, t) {
    if (!e || !e.length) return;
    const n = e.map((i) => this.normalizeTask(i, e));
    super.parse(n, t), this._sort && this.sortBranch(this._sort, t);
  }
  getBounds(e, t) {
    return e || (e = new Date(3e3, 0, 0)), t || (t = /* @__PURE__ */ new Date(0)), this._pool.forEach((n) => {
      (!e || n.start <= e) && (e = n.start), (!t || n.end >= t) && (t = n.end);
    }), { start: e, end: t };
  }
  getBranch(e) {
    const t = this._pool.get(e);
    return this._pool.get(t.parent || 0).data;
  }
  contains(e, t) {
    const n = this._pool.get(e).data;
    let i = false;
    if (n) for (let s = 0; s < n.length; s++) {
      if (n[s].id === t) {
        i = true;
        break;
      }
      if (n[s].data && (i = this.contains(n[s].id, t), i)) break;
    }
    return i;
  }
  getIndexById(e) {
    return this.getBranch(e).findIndex((t) => t.id === e);
  }
  add(e, t) {
    const n = this.normalizeTask(e);
    return super.add(n, t), n;
  }
  update(e, t) {
    this.fillDates(e, t), this.normalizeDates(t), this.byId(e).base_start && (this.fillDates(e, t, true), this.normalizeDates(t, true)), super.update(e, t);
  }
  copy(e, t, n) {
    const i = this.add({ ...e, id: null, data: null, parent: t }, n);
    let s = [[e.id, i.id]];
    return e.data?.forEach((o, a) => {
      const r = this.copy(o, i.id, a);
      s = s.concat(r);
    }), s;
  }
  normalizeDates(e, t) {
    const { start: n, end: i, duration: s } = this.getFields(t);
    e.type === "milestone" ? e[s] = 0 : e[n] && (e[s] ? e[i] || (e[i] = If(e[n], e[s])) : e[i] ? e[s] = Rf(e[i], e[n]) : (e[i] = e[n], e[s] = 0));
  }
  normalizeTask(e, t) {
    const n = e.id || Wo(), i = e.parent || 0, s = e.text || "", o = e.type || "task", a = e.progress || 0, r = e.details || "";
    this.normalizeDates(e), e.base_start && this.normalizeDates(e, true);
    const c = { ...e, id: n, text: s, parent: i, progress: a, type: o, details: r };
    if (this.normalizeDates(c), c.type === "summary" && !(c.start && c.end)) {
      const { start: u, end: f } = pl({ ...c }, t);
      c.start = u, c.end = f;
    }
    return c;
  }
  getSummaryId(e) {
    const t = this._pool.get(e);
    if (!t.parent) return null;
    const n = this._pool.get(t.parent);
    return n.type === "summary" ? n.id : this.getSummaryId(n.id);
  }
  fillDates(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    const i = this.byId(e);
    t.type = t.type || i.type;
    const { start: s, end: o, duration: a } = this.getFields(n);
    t.type !== "milestone" ? (i[o] && t[s] || (t[s] = i[s]), t[s] && !(t[a] || t[o]) ? (t[o] = i[o] > t[s] ? i[o] : null, t[o] || (t[a] = 1)) : t[o] && !(t[a] || t[s]) ? (t[s] = i[s] < t[o] ? i[s] : t[o], t[s] === t[o] && (t[a] = 1, delete t[o])) : t[a] && !(t[s] || t[o]) && (t[s] = i[s])) : (t[o] && delete t[o], i[o] && delete i[o]);
  }
  getFields(e) {
    return { start: (e ? "base_" : "") + "start", end: (e ? "base_" : "") + "end", duration: (e ? "base_" : "") + "duration" };
  }
  sort(e) {
    this._sort = e, e && this.sortBranch(e, 0);
  }
  sortBranch(e, t) {
    const n = this._pool.get(t || 0).data;
    n && (Kc(n, e), n.forEach((i) => {
      this.sortBranch(e, i.id);
    }));
  }
};
__name(_Of, "Of");
var Of = _Of;
function xt(l) {
  const e = /* @__PURE__ */ new Date();
  return l.map((t) => ({ item: t, len: ft(t.unit)(e, 1) })).sort((t, n) => t.len < n.len ? -1 : 1)[0].item;
}
__name(xt, "xt");
var Mt = ["year", "quarter", "month", "week", "day", "hour"];
var wi = { year: "yyyy", quarter: "QQQ", month: "MMM", week: "w", day: "MMM d", hour: "HH:mm" };
var tl = 50;
var nl = 300;
function Af(l, e, t, n) {
  let i = l, s = e, o = false, a = false;
  n && n.forEach((c) => {
    !l && (!i || c.start <= i) && (i = c.start, o = true);
    const u = c.type === "milestone" ? c.start : c.end;
    !e && (!s || u >= s) && (s = u, a = true);
  });
  const r = ft(t || "day");
  return i ? o && (i = r(i, -1)) : i = /* @__PURE__ */ new Date(), s ? a && (s = r(s, 1)) : s = r(i, 30), { _start: i, _end: s };
}
__name(Af, "Af");
function Ff(l, e, t, n, i, s) {
  const o = xt(s).unit, a = kl(o), r = a(e, l, "", true), c = bt(o, e);
  l = bt(o, l), e = c < e ? ft(o)(c, 1) : c;
  const u = r * n, f = i * s.length, d = s.map((m) => {
    const _ = [], w = ft(m.unit);
    let b = bt(m.unit, l);
    for (; b < e; ) {
      let p = w(b, m.step);
      b < l && (b = l), p > e && (p = e);
      const z = a(p, b, "", true) * n, T = typeof m.format == "function" ? m.format(b, p) : xn(b, m.format, { firstWeekContainsDate: 4, weekStartsOn: 1 });
      let W = "";
      m.css && (W += typeof m.css == "function" ? m.css(b) : m.css), _.push({ width: z, value: T, date: b, css: W, unit: m.unit }), b = p;
    }
    return { cells: _, add: w, height: i };
  });
  let h = n;
  return o !== t && (h = Math.round(h / zn(o, t)) || 1), { rows: d, width: u, height: f, diff: a, start: l, end: e, lengthUnit: t, minUnit: o, lengthUnitWidth: h };
}
__name(Ff, "Ff");
function Pf(l, e, t) {
  const n = typeof l == "boolean" ? {} : l, i = Mt.indexOf(xt(e).unit);
  if (typeof n.level > "u" && (n.level = i), n.levels) n.levels.forEach((a) => {
    a.minCellWidth || (a.minCellWidth = Sn(n.minCellWidth, tl)), a.maxCellWidth || (a.maxCellWidth = Sn(n.maxCellWidth, nl));
  });
  else {
    const a = [], r = e.length || 1, c = Sn(n.minCellWidth, tl), u = Sn(n.maxCellWidth, nl);
    Mt.forEach((f, d) => {
      if (d === i) a.push({ minCellWidth: c, maxCellWidth: u, scales: e });
      else {
        const h = [];
        if (d) for (let m = r - 1; m > 0; m--) Mt[d - m] && h.push({ unit: Mt[d - m], step: 1, format: wi[Mt[d - m]] });
        h.push({ unit: f, step: 1, format: wi[f] }), a.push({ minCellWidth: c, maxCellWidth: u, scales: h });
      }
    }), n.levels = a;
  }
  n.levels[n.level] || (n.level = 0);
  const s = n.levels[n.level], o = Math.min(Math.max(t, s.minCellWidth), s.maxCellWidth);
  return { _zoom: n, scales: s.scales, cellWidth: o };
}
__name(Pf, "Pf");
function Yf(l, e, t, n, i, s, o) {
  l.level = t;
  let a;
  const r = n.scales || n, c = xt(r).unit, u = Bf(c, i);
  if (e === -1) {
    const h = zn(c, i);
    a = o * h;
  } else {
    const h = zn(xt(s).unit, c);
    a = Math.round(o / h);
  }
  const f = n.minCellWidth ?? tl, d = n.maxCellWidth ?? nl;
  return { scales: r, cellWidth: Math.min(d, Math.max(f, a)), lengthUnit: u, zoom: l };
}
__name(Yf, "Yf");
function Bf(l, e) {
  const t = Mt.indexOf(l), n = Mt.indexOf(e);
  return n >= t ? l === "hour" ? "hour" : "day" : Mt[n];
}
__name(Bf, "Bf");
function Sn(l, e) {
  return l ?? e;
}
__name(Sn, "Sn");
var Zn = 20;
var jf = /* @__PURE__ */ __name(function(l, e, t, n, i) {
  const s = Math.round(n / 2) - 3;
  if (!e || !t || !e.$y || !t.$y || e.$skip || t.$skip) return l.$p = "", l;
  let o = false, a = false;
  switch (l.type) {
    case "e2s":
      a = true;
      break;
    case "s2s":
      o = true, a = true;
      break;
    case "s2e":
      o = true;
      break;
  }
  const r = o ? e.$x : e.$x + e.$w, c = i ? e.$y - 7 : e.$y, u = a ? t.$x : t.$x + t.$w, f = i ? t.$y - 7 : t.$y;
  if (r !== u || c !== f) {
    const d = Zf(r, c + s, u, f + s, o, a, n / 2, i), h = qf(u, f + s, a);
    l.$p = `${d},${h}`;
  }
  return l;
}, "jf");
function Zf(l, e, t, n, i, s, o, a) {
  const r = Zn * (i ? -1 : 1), c = Zn * (s ? -1 : 1), u = l + r, f = t + c, d = [l, e, u, e, 0, 0, 0, 0, f, n, t, n], h = f - u;
  let m = n - e;
  const _ = s === i;
  return _ || (f <= l + Zn - 2 && s || f > l && !s) && (m = a ? m - o + 6 : m - o), _ && s && u > f || _ && !s && u < f ? (d[4] = d[2] + h, d[5] = d[3], d[6] = d[4], d[7] = d[5] + m) : (d[4] = d[2], d[5] = d[3] + m, d[6] = d[4] + h, d[7] = d[5]), d.join(",");
}
__name(Zf, "Zf");
function qf(l, e, t) {
  return t ? `${l - 5},${e - 3},${l - 5},${e + 3},${l},${e}` : `${l + 5},${e + 3},${l + 5},${e - 3},${l},${e}`;
}
__name(qf, "qf");
function Kf(l) {
  if (!l || !l.length) return [];
  const e = l.find((t) => t.id === "action");
  return e || (l = [...l, Xf]), l.map((t) => {
    const n = t.align || "left", i = t.id === "action", s = !i && t.flexgrow ? t.flexgrow : null, o = s ? 1 : t.width || (i ? 50 : 120);
    let a;
    t.id === "action" && (a = e ? "add-task" : "expand");
    let r = t.template;
    if (!r) switch (t.id) {
      case "start":
        r = /* @__PURE__ */ __name((c) => xn(c, "dd-MM-yyyy"), "r");
        break;
      case "end":
        r = /* @__PURE__ */ __name((c) => xn(c, "dd-MM-yyyy"), "r");
        break;
    }
    return { width: o, align: n, header: t.header, resize: true, id: t.id, template: r, ...s && { flexgrow: s }, ...a && { action: a }, sort: !!t.sort };
  });
}
__name(Kf, "Kf");
var Gf = [{ id: "text", header: "Task name", flexgrow: 1, sort: true }, { id: "start", header: "Start date", align: "center", sort: true }, { id: "duration", header: "Duration", width: 100, align: "center", sort: true }, { id: "action", header: "", width: 50, align: "center" }];
var Xf = { id: "action", header: "", align: "center", width: 50 };
var Qo = [{ key: "text", type: "text", label: "Name", config: { placeholder: "Add task name", focus: true } }, { key: "details", type: "textarea", label: "Description", config: { placeholder: "Add description" } }, { key: "type", type: "select", label: "Type" }, { key: "start", type: "date", label: "Start date" }, { key: "end", type: "date", label: "End date" }, { key: "duration", type: "counter", label: "Duration", config: { min: 1, max: 100 } }, { key: "progress", type: "slider", label: "Progress" }, { key: "links", type: "links" }];
function Vf(l) {
  return (l.editorShape || Qo).map((e) => (e.type === "select" && e.key === "type" && (e.options = l.taskTypes), e.id = e.id || Do(), e));
}
__name(Vf, "Vf");
var _Uf = class _Uf extends jc {
  constructor(e) {
    super(e);
    __publicField(this, "in");
    __publicField(this, "_router");
    this._router = new Zc(super.setState.bind(this), [{ in: ["tasks", "start", "end", "scales"], out: ["_start", "_end"], exec: /* @__PURE__ */ __name((i) => {
      const { _end: s, _start: o, start: a, end: r, tasks: c, scales: u } = this.getState();
      if (!a || !r) {
        const f = xt(u).unit, d = Af(a, r, f, c);
        (d._end != s || d._start != o) && this.setState(d, i);
      } else this.setState({ _start: a, _end: r }, i);
    }, "exec") }, { in: ["_start", "_end", "cellWidth", "scaleHeight", "scales", "lengthUnit"], out: ["_scales"], exec: /* @__PURE__ */ __name((i) => {
      const s = this.getState();
      let { lengthUnit: o } = s;
      const { _start: a, _end: r, cellWidth: c, scaleHeight: u, scales: f } = s, d = xt(f).unit;
      Wf(d, o) || (o = d);
      const h = Ff(a, r, o, c, u, f);
      this.setState({ _scales: h }, i);
    }, "exec") }, { in: ["_scales", "tasks", "cellHeight", "baselines"], out: ["_tasks"], exec: /* @__PURE__ */ __name((i) => {
      const { cellWidth: s, cellHeight: o, tasks: a, _scales: r, baselines: c } = this.getState(), u = a.toArray().map((f, d) => Ef(f, d, s, o, r, c));
      this.setState({ _tasks: u }, i);
    }, "exec") }, { in: ["_tasks", "links", "cellHeight"], out: ["_links"], exec: /* @__PURE__ */ __name((i) => {
      const { tasks: s, links: o, cellHeight: a, baselines: r } = this.getState(), c = o.map((u) => {
        const f = s.byId(u.source), d = s.byId(u.target);
        return jf(u, f, d, a, r);
      }).filter((u) => u !== null);
      this.setState({ _links: c }, i);
    }, "exec") }, { in: ["tasks", "activeTask"], out: ["_activeTask"], exec: /* @__PURE__ */ __name((i) => {
      const { tasks: s, activeTask: o } = this.getState();
      this.setState({ _activeTask: s.byId(o) || null }, i);
    }, "exec") }, { in: ["tasks", "selected"], out: ["_selected"], exec: /* @__PURE__ */ __name((i) => {
      const { tasks: s, selected: o, _scrollSelected: a } = this.getState(), r = { _selected: o.map((c) => s.byId(c)).filter((c) => !!c) };
      typeof a > "u" && (r._scrollSelected = false), this.setState(r, i);
    }, "exec") }, { in: ["start", "end"], out: ["cellWidth"], exec: /* @__PURE__ */ __name((i) => {
      const { _cellWidth: s, cellWidth: o } = this.getState();
      s != o && this.setState({ cellWidth: s }, i);
    }, "exec") }], { tasks: /* @__PURE__ */ __name((i) => new Of(i), "tasks"), links: /* @__PURE__ */ __name((i) => new ci(i), "links"), columns: /* @__PURE__ */ __name((i) => Kf(i), "columns") });
    const t = this.in = new qc();
    t.on("show-editor", (_ref26) => {
      let { id: i } = _ref26;
      this.setStateAsync({ activeTask: i });
    }), t.on("select-task", (_ref27) => {
      let { id: i, toggle: s, range: o, show: a } = _ref27;
      const { selected: r, _tasks: c, activeTask: u } = this.getState();
      let f = false, d;
      if (r.length && (s || o)) {
        const h = [...r];
        if (o) {
          const m = h[h.length - 1], _ = c.findIndex((z) => z.id == m), w = c.findIndex((z) => z.id == i), b = Math.min(_, w), p = Math.max(_, w) + 1;
          c.slice(b, p).map((z) => z.id).forEach((z) => {
            h.includes(z) || h.push(z);
          });
        } else if (s) {
          const m = h.findIndex((_) => _ == i);
          m === -1 ? h.push(i) : (f = true, h.splice(m, 1));
        }
        d = h;
      } else d = [i];
      this.setStateAsync({ selected: d, _scrollSelected: !!a }), !f && u && u != i && t.exec("show-editor", { id: i });
    }), t.on("delete-link", (_ref28) => {
      let { id: i } = _ref28;
      const { links: s } = this.getState();
      s.remove(i), this.setStateAsync({ links: s });
    }), t.on("update-link", (i) => {
      const { links: s } = this.getState(), { id: o, link: a } = i;
      s.update(o, a), this.setStateAsync({ links: s }), i.link = s.byId(o);
    }), t.on("add-link", (i) => {
      const { link: s } = i, { links: o } = this.getState();
      !s.source || !s.target || (s.type || (s.type = "e2s"), s.id = s.id || Wo(), o.add(s), this.setStateAsync({ links: o }), i.id = s.id, i.link = o.byId(s.id));
    });
    let n = null;
    t.on("move-task", (i) => {
      const { tasks: s } = this.getState();
      let { mode: o, target: a } = i;
      const { id: r, inProgress: c } = i, u = s.byId(r);
      if (typeof c > "u" ? i.source = u.parent : i.source = n = n ?? u.parent, c === false) {
        u.$reorder = false, this.setState({ tasks: s }), n = null;
        return;
      }
      if (a === r || s.contains(r, a)) {
        i.skipProvider = true;
        return;
      }
      if (o === "up" || o === "down") {
        const f = s.getBranch(r);
        let d = s.getIndexById(r);
        if (o === "up") {
          const h = u.parent === 0;
          if (d === 0 && h) {
            i.skipProvider = true;
            return;
          }
          d -= 1, o = "before";
        } else if (o === "down") {
          const h = d === f.length - 1, m = u.parent === 0;
          if (h && m) {
            i.skipProvider = true;
            return;
          }
          d += 1, o = "after";
        }
        if (a = f[d] && f[d].id || u.parent, a) {
          const h = s.getBranch(a);
          let m = s.getIndexById(a), _ = h[m];
          if (_.data) {
            if (o === "before") {
              if (_.parent === u.parent) {
                for (; _.data; ) _.open || t.exec("open-task", { id: _.id, mode: true }), _ = _.data[_.data.length - 1];
                a = _.id;
              }
            } else if (o === "after") {
              let p;
              _.parent === u.parent ? (p = _, _ = _.data[0], a = _.id, o = "before") : h.length - 1 !== m && (p = _, m += 1, _ = h[m], u.$level > _.$level && _.data ? (p = _, _ = _.data[0], a = _.id, o = "before") : a = _.id), p && !p.open && t.exec("open-task", { id: p.id, mode: true });
            }
          }
          const w = s.getSummaryId(u.id);
          s.move(r, o, a);
          const b = s.getSummaryId(r);
          w != b && (w && this.resetSummaryDates(w, "move-task"), b && this.resetSummaryDates(b, "move-task"));
        }
      } else {
        const f = s.byId(a);
        let d = f, h = false;
        for (; d.$level > u.$level; ) d = s.byId(d.parent), d.id === r && (h = true);
        if (h) return;
        const m = s.getSummaryId(u.id);
        if (s.move(r, o, a), o == "child") {
          let w = f;
          for (; w.id !== 0 && !w.open; ) t.exec("open-task", { id: w.id, mode: true }), w = s.byId(w.parent);
        }
        const _ = s.getSummaryId(r);
        m != _ && (m && this.resetSummaryDates(m, "move-task"), _ && this.resetSummaryDates(_, "move-task"));
      }
      c ? this.setState({ tasks: s }) : this.setStateAsync({ tasks: s }), i.target = a, i.mode = o;
    }), t.on("drag-task", (i) => {
      const { id: s, width: o, left: a, top: r, inProgress: c } = i, u = this.getState(), { tasks: f, _tasks: d, _selected: h, _scales: m, cellWidth: _ } = u, w = { _tasks: d, _selected: h }, b = f.byId(s);
      typeof o < "u" && (b.$w = o, el(f, b, m, _)), typeof a < "u" && (b.type === "summary" && Uo(b, a - b.$x), b.$x = a, el(f, b, m, _)), typeof r < "u" && (b.$y = r + 4, b.$reorder = c), typeof o < "u" && (b.$w = o), typeof a < "u" && (b.$x = a), typeof r < "u" && (b.$y = r + 4, b.$reorder = c), this.setState(w);
    }), t.on("update-task", (i) => {
      const { id: s, task: o, eventSource: a } = i;
      let r = i.diff;
      const { tasks: c, _scales: u } = this.getState();
      if (a === "add-task" || a === "copy-task" || a === "move-task" || a === "update-task" || a === "delete-task") {
        c.update(s, o);
        return;
      }
      const f = u.lengthUnit, d = ft(f), h = kl(f), m = c.byId(s);
      if (r && (o.start && (o.start = d(o.start, r)), o.end && (o.end = d(o.end, r))), o.start && o.end) {
        if ((!Kt(o.start, m.start) || !Kt(o.end, m.end)) && m.type == "summary" && m.data?.length) {
          if (!r && (r = h(o.start, m.start), h(o.end, m.end) !== r)) return;
          this.moveSummaryKids(m, (w) => d(w, r), "update-task");
        }
      } else if (m.type == "summary" && (o.start && !o.end || o.end && !o.start || o.duration)) return;
      c.update(s, o), o.type === "summary" && m.type !== "summary" && this.resetSummaryDates(s, "update-task");
      const _ = c.getSummaryId(s);
      _ && this.resetSummaryDates(_, "update-task"), this.setStateAsync({ tasks: c }), i.task = c.byId(s);
    }), t.on("add-task", (i) => {
      const { tasks: s, _scales: o, baselines: a } = this.getState(), { target: r, mode: c, task: u } = i;
      let f = -1, d, h;
      if (r ? (h = s.byId(r), c == "child" ? (d = h, u.parent = d.id) : (h.parent !== null && (d = s.byId(h.parent), u.parent = d.id), f = s.getIndexById(r), c == "after" && (f += 1))) : u.parent && (d = s.byId(u.parent)), !u.start) {
        if (d?.start) u.start = new Date(d.start.valueOf());
        else if (h) u.start = new Date(h.start.valueOf());
        else {
          const w = s.getBranch(0);
          let b;
          if (w.length) {
            const p = w[w.length - 1];
            if (!p.$skip) {
              const z = new Date(p.start.valueOf());
              o.start <= z && (b = z);
            }
          }
          u.start = b || ft("day")(o.start, 1);
        }
        u.duration = 1, a && (u.base_start = u.start, u.base_duration = u.duration);
      }
      const m = s.add(u, f);
      if (d) for (; d && d.id; ) t.exec("open-task", { id: d.id, mode: true }), d = s.byId(d.parent);
      i.id = m.id;
      const _ = s.getSummaryId(m.id);
      _ && this.resetSummaryDates(_, "add-task"), this.setStateAsync({ tasks: s }), t.exec("select-task", { id: m.id }), t.exec("show-editor", { id: m.id }), i.id = m.id, i.task = m;
    }), t.on("delete-task", (i) => {
      const { id: s } = i, { tasks: o, links: a, selected: r } = this.getState();
      i.source = o.byId(s).parent;
      const c = o.getSummaryId(s), u = [s];
      o.eachChild((d) => u.push(d.id), s), a.filter((d) => !(u.includes(d.source) || u.includes(d.target))), o.remove(s), c && this.resetSummaryDates(c, "delete-task");
      const f = { tasks: o, links: a };
      r.includes(s) && (f.selected = r.filter((d) => d !== s)), this.setStateAsync(f);
    }), t.on("indent-task", (_ref29) => {
      let { id: i, mode: s } = _ref29;
      const { tasks: o } = this.getState();
      if (s) {
        const a = o.getBranch(i)[o.getIndexById(i) - 1];
        a && t.exec("move-task", { id: i, mode: "child", target: a.id });
      } else {
        const a = o.byId(i), r = o.byId(a.parent);
        r && r.parent !== null && t.exec("move-task", { id: i, mode: "after", target: a.parent });
      }
    }), t.on("copy-task", (i) => {
      const { id: s, target: o, mode: a, eventSource: r } = i;
      if (r === "copy-task") return;
      const { tasks: c, links: u } = this.getState();
      if (c.contains(s, o)) {
        i.skipProvider = true;
        return;
      }
      const f = c.getSummaryId(s), d = c.getSummaryId(o);
      let h = c.getIndexById(o);
      a == "before" && (h -= 1);
      const m = c.byId(s), _ = c.copy(m, c.byId(o).parent, h + 1);
      i.source = i.id, i.id = _[0][1], m.lazy && (i.lazy = true), f != d && d && this.resetSummaryDates(d, "copy-task");
      let w = [];
      for (let b = 1; b < _.length; b++) {
        const [p, z] = _[b];
        u.forEach((T) => {
          if (T.source === p) {
            const W = { ...T };
            delete W.target, w.push({ ...W, source: z });
          } else if (T.target === p) {
            const W = { ...T };
            delete W.source, w.push({ ...W, target: z });
          }
        });
      }
      w = w.reduce((b, p) => {
        const z = b.findIndex((T) => T.id === p.id);
        return z > -1 ? b[z] = { ...b[z], ...p } : b.push(p), b;
      }, []);
      for (let b = 1; b < _.length; b++) {
        const [p, z] = _[b], T = c.byId(z);
        t.exec("copy-task", { source: p, id: z, lazy: !!T.lazy, eventSource: "copy-task", target: T.parent, mode: "child" });
      }
      w.forEach((b) => {
        t.exec("add-link", { link: { source: b.source, target: b.target, type: b.type } });
      }), this.setStateAsync({ tasks: c });
    }), t.on("open-task", (_ref30) => {
      let { id: i, mode: s } = _ref30;
      const { tasks: o } = this.getState(), a = o.byId(i);
      a.lazy ? t.exec("request-data", { id: a.id }) : (o.toArray().forEach((r) => r.$y = 0), o.update(i, { open: s }), this.setState({ tasks: o }));
    }), t.on("scroll-chart", (_ref31) => {
      let { left: i, top: s } = _ref31;
      isNaN(i) || this.setState({ scrollLeft: i }), isNaN(s) || this.setState({ scrollTop: s });
    }), t.on("render-data", (i) => {
      this.setState({ area: i });
    }), t.on("provide-data", (i) => {
      const { tasks: s, links: o } = this.getState(), a = s.byId(i.id);
      a.lazy ? (a.lazy = false, a.open = true) : a.data = [], s.parse(i.data.tasks, i.id), this.setStateAsync({ tasks: s, links: new ci(o.map((r) => r).concat(i.data.links)) });
    }), t.on("zoom-scale", (_ref32) => {
      let { dir: i, date: s, offset: o } = _ref32;
      const { zoom: a, cellWidth: r, _cellWidth: c } = this.getState();
      let u = r;
      i < 0 && (u = c || r);
      const f = u + i * 50, d = a.levels[a.level], h = i < 0 && r > d.maxCellWidth;
      if (f < d.minCellWidth || f > d.maxCellWidth || h) {
        if (!this.changeScale(a, i)) return;
      } else this.setState({ cellWidth: f, _cellWidth: f });
      const { _scales: m, _start: _, cellWidth: w } = this.getState(), b = bt(m.minUnit, _), p = m.diff(s, b, "hour");
      typeof o > "u" && (o = w);
      let z = Math.round(p * w) - o;
      z < 0 && (z = 0), this.setState({ scrollLeft: z });
    }), t.on("expand-scale", (_ref33) => {
      let { minWidth: i, date: s, offset: o } = _ref33;
      const { _start: a, _scales: r, start: c, end: u, _end: f, cellWidth: d } = this.getState(), h = ft(r.minUnit);
      let m = r.width;
      if (c && u) {
        if (m < i && m) {
          const z = i / m;
          this.setState({ cellWidth: d * z });
        }
        return true;
      }
      let _ = 0;
      for (; m < i; ) m += d, _++;
      const w = _ ? u ? -_ : -1 : 0, b = c || h(a, w);
      let p = 0;
      if (s) {
        const z = r.diff(s, b, "hour");
        p = Math.max(0, Math.round(z * d) - (o || 0));
      }
      this.setState({ _start: b, _end: u || h(f, _), scrollLeft: p });
    }), t.on("sort-tasks", (_ref34) => {
      let { key: i, order: s } = _ref34;
      const { tasks: o } = this.getState(), a = { key: i, order: s };
      o.sort(a), this.setState({ _sort: a, tasks: o });
    });
  }
  init(e) {
    const t = this.getState().area ? {} : { scrollLeft: 0, scrollTop: 0, area: { from: 0, start: 0, end: 0 } };
    if (e.cellWidth && (e._cellWidth = e.cellWidth), e._sort = null, e.editorShape = Vf(e), this._router.init({ selected: [], ...t, ...e }), e.zoom) {
      const n = Pf(e.zoom, e.scales, e.cellWidth);
      this.setState({ zoom: n._zoom, cellWidth: n.cellWidth, _cellWidth: n.cellWidth, scales: n.scales });
    }
  }
  setState(e, t) {
    return this._router.setState(e, t);
  }
  setStateAsync(e) {
    this._router.setStateAsync(e);
  }
  getTask(e) {
    const { tasks: t } = this.getState();
    return t.byId(e);
  }
  changeScale(e, t) {
    const n = e.level + t, i = e.levels[n];
    if (i) {
      const { cellWidth: s, scales: o, _scales: a } = this.getState(), r = Yf(e, t, n, i, a.lengthUnit, o, s);
      return r._cellWidth = r.cellWidth, this.setState(r), true;
    }
    return false;
  }
  resetSummaryDates(e, t) {
    const { tasks: n } = this.getState(), i = n.byId(e), s = i.data;
    if (s?.length > 1 || s?.length && s[0].type !== "milestone") {
      const o = pl({ ...i, start: void 0, end: void 0, duration: void 0 });
      if (!Kt(i.start, o.start) || !Kt(i.end, o.end)) {
        this.in.exec("update-task", { id: e, task: o, eventSource: t });
        const a = n.getSummaryId(e);
        a && this.resetSummaryDates(a, t);
      }
    }
  }
  moveSummaryKids(e, t, n) {
    const { tasks: i } = this.getState();
    e.data.forEach((s) => {
      const o = { ...i.byId(s.id), start: t(s.start) };
      o.type !== "milestone" && (o.end = t(s.end)), delete o.id, this.in.exec("update-task", { id: s.id, task: o, eventSource: n }), s.data?.length && this.moveSummaryKids(s, t, n);
    });
  }
};
__name(_Uf, "Uf");
var Uf = _Uf;
function bi(l, e, t, n) {
  const i = document.createElement("canvas");
  {
    const s = Jf(i, l, e, 1, t);
    Qf(s, n, 0, l, 0, e);
  }
  return i.toDataURL();
}
__name(bi, "bi");
function Jf(l, e, t, n, i) {
  l.setAttribute("width", (e * n).toString()), l.setAttribute("height", (t * n).toString());
  const s = l.getContext("2d");
  return s.translate(-0.5, -0.5), s.strokeStyle = i, s;
}
__name(Jf, "Jf");
function Qf(l, e, t, n, i, s) {
  l.beginPath(), l.moveTo(n, i), l.lineTo(n, s), e === "full" && l.lineTo(t, s), l.stroke();
}
__name(Qf, "Qf");
function xo(l, e, t, n) {
  const { selected: i, tasks: s } = l.getState(), o = i.length, a = !o && e === "add-task", r = ["edit-task", "paste-task"], c = ["copy-task", "cut-task"], u = ["copy-task", "cut-task", "delete-task", "indent-task:remove", "move-task:down"], f = ["indent-task:add", "move-task:down", "move-task:up"], d = { "indent-task:remove": 2 }, h = { parent: f.includes(e), level: d[e] };
  if (t = t || (o ? i[i.length - 1] : null), !(!t && !a)) {
    if (e !== "paste-task" && (l._temp = null), r.includes(e) || a || i.length === 1) ki(l, e, t, n);
    else if (o) {
      const m = c.includes(e) ? i : xf(i, s, h);
      u.includes(e) && m.reverse(), m.forEach((_) => ki(l, e, _, n));
    }
  }
}
__name(xo, "xo");
function xf(l, e, t) {
  let n = l.map((i) => {
    const s = e.byId(i);
    return { id: i, level: s.$level, parent: s.parent, index: e.getIndexById(i) };
  });
  return (t.parent || t.level) && (n = n.filter((i) => t.level && i.level <= t.level || !l.includes(i.parent))), n.sort((i, s) => i.level - s.level || i.index - s.index), n.map((i) => i.id);
}
__name(xf, "xf");
function ki(l, e, t, n) {
  let i = e.split(":")[0], s = e.split(":")[1], o = { id: t }, a = {};
  if (i == "copy-task" || i == "cut-task") {
    l._temp || (l._temp = []), l._temp.push({ id: t, cut: i == "cut-task" });
    return;
  } else if (i == "paste-task") {
    l._temp && l._temp.length && (l._temp.forEach((r) => {
      l.exec(r.cut ? "move-task" : "copy-task", { id: r.id, target: t, mode: "after" });
    }), l._temp = null);
    return;
  } else i === "add-task" ? (a = { task: { type: "task", text: n("New Task") }, target: t }, o = {}) : i === "edit-task" ? i = "show-editor" : i === "convert-task" ? (i = "update-task", a = { task: { type: s } }, s = void 0) : i === "indent-task" && (s = s === "add");
  typeof s < "u" && (a = { mode: s, ...a }), o = { ...o, ...a }, l.exec(i, o);
}
__name(ki, "ki");
function yl(l) {
  return l.map((e) => {
    switch (e.data && yl(e.data), e.id) {
      case "add-task:before":
      case "move-task:up":
        e.check = (t, n) => !ed(t, n);
        break;
      case "move-task:down":
        e.check = (t, n) => !td(t, n);
        break;
      case "indent-task:add":
        e.check = (t, n) => nd(t, n) !== t.parent;
        break;
      case "indent-task:remove":
        e.check = (t) => !$f(t);
        break;
    }
    return e;
  });
}
__name(yl, "yl");
function $f(l) {
  return l.parent === 0;
}
__name($f, "$f");
function ed(l, e) {
  return e[0]?.id === l.id;
}
__name(ed, "ed");
function td(l, e) {
  return e[e.length - 1]?.id === l.id;
}
__name(td, "td");
function nd(l, e) {
  const t = e.findIndex((n) => n.id === l.id);
  return e[t - 1]?.id ?? l.parent;
}
__name(nd, "nd");
var ld = /* @__PURE__ */ __name((l) => (e) => e.type !== l, "ld");
var id = yl([{ id: "add-task", text: "Add", icon: "wxi-plus", data: [{ id: "add-task:child", text: "Child task" }, { id: "add-task:before", text: "Task above" }, { id: "add-task:after", text: "Task below" }] }, { type: "separator" }, { id: "convert-task", text: "Convert to", icon: "wxi-swap-horizontal", dataFactory: /* @__PURE__ */ __name((l) => ({ id: `convert-task:${l.id}`, text: `${l.label}`, check: ld(l.id) }), "dataFactory") }, { id: "edit-task", text: "Edit", icon: "wxi-edit" }, { id: "cut-task", text: "Cut", icon: "wxi-content-cut" }, { id: "copy-task", text: "Copy", icon: "wxi-content-copy" }, { id: "paste-task", text: "Paste", icon: "wxi-content-paste" }, { id: "move-task", text: "Move", icon: "wxi-swap-vertical", data: [{ id: "move-task:up", text: "Up" }, { id: "move-task:down", text: "Down" }] }, { type: "separator" }, { id: "indent-task:add", text: "Indent", icon: "wxi-indent" }, { id: "indent-task:remove", text: "Outdent", icon: "wxi-unindent" }, { type: "separator" }, { id: "delete-task", icon: "wxi-delete", text: "Delete" }]);
var sd = yl([{ id: "add-task", comp: "button", icon: "wxi-plus", text: "New task", type: "primary" }, { id: "edit-task", comp: "icon", icon: "wxi-edit", menuText: "Edit" }, { id: "delete-task", comp: "icon", icon: "wxi-delete", menuText: "Delete" }, { comp: "separator" }, { id: "move-task:up", comp: "icon", icon: "wxi-angle-up", menuText: "Move up" }, { id: "move-task:down", comp: "icon", icon: "wxi-angle-down", menuText: "Move down" }, { comp: "separator" }, { id: "copy-task", comp: "icon", icon: "wxi-content-copy", menuText: "Copy" }, { id: "cut-task", comp: "icon", icon: "wxi-content-cut", menuText: "Cut" }, { id: "paste-task", comp: "icon", icon: "wxi-content-paste", menuText: "Paste" }, { comp: "separator" }, { id: "indent-task:add", comp: "icon", icon: "wxi-indent", menuText: "Indent" }, { id: "indent-task:remove", comp: "icon", icon: "wxi-unindent", menuText: "Outdent" }]);
function pi(l, e, t) {
  const n = l.slice();
  return n[6] = e[t], n;
}
__name(pi, "pi");
function yi(l, e, t) {
  const n = l.slice();
  return n[9] = e[t], n;
}
__name(yi, "yi");
function vi(l) {
  let e, t = (
    /*cell*/
    l[9].value + ""
  ), n, i;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", i = "wx-cell " + /*cell*/
    l[9].css + " " + /*highlightTime*/
    (l[0] ? (
      /*highlightTime*/
      l[0](
        /*cell*/
        l[9].date,
        /*cell*/
        l[9].unit
      )
    ) : "") + " x2-nufjbd"), j(
      e,
      "width",
      /*cell*/
      l[9].width + "px"
    );
  }, m(s, o) {
    S(s, e, o), H(e, n);
  }, p(s, o) {
    o & /*$scales*/
    2 && t !== (t = /*cell*/
    s[9].value + "") && me(n, t), o & /*$scales, highlightTime*/
    3 && i !== (i = "wx-cell " + /*cell*/
    s[9].css + " " + /*highlightTime*/
    (s[0] ? (
      /*highlightTime*/
      s[0](
        /*cell*/
        s[9].date,
        /*cell*/
        s[9].unit
      )
    ) : "") + " x2-nufjbd") && g(e, "class", i), o & /*$scales*/
    2 && j(
      e,
      "width",
      /*cell*/
      s[9].width + "px"
    );
  }, d(s) {
    s && v(e);
  } };
}
__name(vi, "vi");
function Si(l) {
  let e, t, n = de(
    /*row*/
    l[6].cells
  ), i = [];
  for (let s = 0; s < n.length; s += 1) i[s] = vi(yi(l, n, s));
  return { c() {
    e = D("div");
    for (let s = 0; s < i.length; s += 1) i[s].c();
    t = Y(), g(e, "class", "wx-row x2-nufjbd"), j(
      e,
      "height",
      /*row*/
      l[6].height + "px"
    );
  }, m(s, o) {
    S(s, e, o);
    for (let a = 0; a < i.length; a += 1) i[a] && i[a].m(e, null);
    H(e, t);
  }, p(s, o) {
    if (o & /*$scales, highlightTime*/
    3) {
      n = de(
        /*row*/
        s[6].cells
      );
      let a;
      for (a = 0; a < n.length; a += 1) {
        const r = yi(s, n, a);
        i[a] ? i[a].p(r, o) : (i[a] = vi(r), i[a].c(), i[a].m(e, t));
      }
      for (; a < i.length; a += 1) i[a].d(1);
      i.length = n.length;
    }
    o & /*$scales*/
    2 && j(
      e,
      "height",
      /*row*/
      s[6].height + "px"
    );
  }, d(s) {
    s && v(e), $e(i, s);
  } };
}
__name(Si, "Si");
function od(l) {
  let e, t = de(
    /*$scales*/
    l[1].rows
  ), n = [];
  for (let i = 0; i < t.length; i += 1) n[i] = Si(pi(l, t, i));
  return { c() {
    e = D("div");
    for (let i = 0; i < n.length; i += 1) n[i].c();
    g(e, "class", "wx-scale x2-nufjbd"), j(
      e,
      "width",
      /*$scales*/
      l[1].width + "px"
    ), j(e, "left", -/*$scrollLeft*/
    l[2] + "px");
  }, m(i, s) {
    S(i, e, s);
    for (let o = 0; o < n.length; o += 1) n[o] && n[o].m(e, null);
  }, p(i, _ref35) {
    let [s] = _ref35;
    if (s & /*$scales, highlightTime*/
    3) {
      t = de(
        /*$scales*/
        i[1].rows
      );
      let o;
      for (o = 0; o < t.length; o += 1) {
        const a = pi(i, t, o);
        n[o] ? n[o].p(a, s) : (n[o] = Si(a), n[o].c(), n[o].m(e, null));
      }
      for (; o < n.length; o += 1) n[o].d(1);
      n.length = t.length;
    }
    s & /*$scales*/
    2 && j(
      e,
      "width",
      /*$scales*/
      i[1].width + "px"
    ), s & /*$scrollLeft*/
    4 && j(e, "left", -/*$scrollLeft*/
    i[2] + "px");
  }, i: I, o: I, d(i) {
    i && v(e), $e(n, i);
  } };
}
__name(od, "od");
function rd(l, e, t) {
  let n, i, { highlightTime: s } = e;
  const o = ze("gantt-store"), { _scales: a, scrollLeft: r } = o.getReactiveState();
  return ce(l, a, (c) => t(1, n = c)), ce(l, r, (c) => t(2, i = c)), l.$$set = (c) => {
    "highlightTime" in c && t(0, s = c.highlightTime);
  }, [s, n, i, a, r];
}
__name(rd, "rd");
var _ad = class _ad extends ee {
  constructor(e) {
    super(), $(this, e, rd, od, x, { highlightTime: 0 });
  }
};
__name(_ad, "ad");
var ad = _ad;
function fn(l) {
  const e = l.getAttribute("data-id"), t = parseInt(e);
  return isNaN(t) || t.toString() != e ? e : t;
}
__name(fn, "fn");
function cd(l, e, t) {
  const n = l.getBoundingClientRect(), i = e.querySelector(".wx-body").getBoundingClientRect();
  return { top: n.top - i.top, left: n.left - i.left, dt: n.bottom - t.clientY, db: t.clientY - n.top };
}
__name(cd, "cd");
var Mi = 5;
function ud(l, e) {
  let t, n, i, s, o, a, r, c, u;
  function f(M) {
    s = M.clientX, o = M.clientY, a = { ...cd(t, l, M), y: e.getTask(i).$y }, document.body.style.userSelect = "none";
  }
  __name(f, "f");
  function d(M) {
    t = wt(M), t && (i = fn(t), u = setTimeout(() => {
      c = true, e && e.touchStart && e.touchStart(), f(M.touches[0]);
    }, 500), l.addEventListener("touchmove", p), l.addEventListener("contextmenu", h), window.addEventListener("touchend", z));
  }
  __name(d, "d");
  function h(M) {
    if (c || u) return M.preventDefault(), false;
  }
  __name(h, "h");
  function m(M) {
    M.which === 1 && (t = wt(M), t && (i = fn(t), l.addEventListener("mousemove", b), window.addEventListener("mouseup", T), f(M)));
  }
  __name(m, "m");
  function _(M) {
    l.removeEventListener("mousemove", b), l.removeEventListener("touchmove", p), document.body.removeEventListener("mouseup", T), document.body.removeEventListener("touchend", z), document.body.style.userSelect = "", M && (l.removeEventListener("mousedown", m), l.removeEventListener("touchstart", d));
  }
  __name(_, "_");
  function w(M) {
    const C = M.clientX - s, P = M.clientY - o;
    if (!n) {
      if (Math.abs(C) < Mi && Math.abs(P) < Mi || e && e.start && e.start({ id: i, e: M }) === false) return;
      n = t.cloneNode(true), n.style.pointerEvents = "none", n.classList.add("wx-reorder-task"), n.style.position = "absolute", n.style.left = a.left + "px", n.style.top = a.top + "px", t.style.visibility = "hidden", t.parentNode.insertBefore(n, t);
    }
    if (n) {
      const X = Math.round(Math.max(0, a.top + P));
      if (e && e.move && e.move({ id: i, top: X, detail: r }) === false) return;
      const A = e.getTask(i).$y;
      if (!a.start && a.y == A) return W();
      a.start = true, a.y = e.getTask(i).$y - 4, n.style.top = X + "px";
      const B = document.elementFromPoint(M.clientX, M.clientY), V = wt(B);
      if (V && V !== t) {
        const fe = fn(V), L = V.getBoundingClientRect(), Ye = L.top + L.height / 2, G = M.clientY + a.db > Ye && V.nextElementSibling !== t, pe = M.clientY - a.dt < Ye && V.previousElementSibling !== t;
        r?.after == fe || r?.before == fe ? r = null : G ? r = { id: i, after: fe } : pe && (r = { id: i, before: fe });
      }
    }
  }
  __name(w, "w");
  function b(M) {
    w(M);
  }
  __name(b, "b");
  function p(M) {
    c ? (M.preventDefault(), w(M.touches[0])) : u && (clearTimeout(u), u = null);
  }
  __name(p, "p");
  function z() {
    c = null, u && (clearTimeout(u), u = null), W();
  }
  __name(z, "z");
  function T() {
    W();
  }
  __name(T, "T");
  function W() {
    t && (t.style.visibility = ""), n && (n.parentNode.removeChild(n), e && e.end && e.end({ id: i, top: a.top })), i = t = n = a = r = null, _();
  }
  __name(W, "W");
  return l.style.position !== "absolute" && (l.style.position = "relative"), l.addEventListener("mousedown", m), l.addEventListener("touchstart", d), { destroy() {
    _(true);
  } };
}
__name(ud, "ud");
var fd = { grid: { "Add before": "Add before", "Add after": "Add after", Copy: "Copy", Delete: "Delete" } };
(/* @__PURE__ */ new Date()).valueOf();
var $o = 2;
var _dd = class _dd {
  constructor(e) {
    e && (this._writable = e.writable, this._async = e.async), this._values = {}, this._state = {};
  }
  setState(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const n = {};
    return this._wrapProperties(e, this._state, this._values, "", n, t), n;
  }
  getState() {
    return this._values;
  }
  getReactive() {
    return this._state;
  }
  _wrapProperties(e, t, n, i, s, o) {
    for (const a in e) {
      const r = t[a], c = n[a], u = e[a];
      if (r && (c === u && typeof u != "object" || u instanceof Date && c instanceof Date && c.getTime() === u.getTime())) continue;
      const f = i + (i ? "." : "") + a;
      r ? (r.__parse(u, f, s, o) && (n[a] = u), o & $o ? s[f] = r.__trigger : r.__trigger()) : (u && u.__reactive ? t[a] = this._wrapNested(u, u, f, s) : t[a] = this._wrapWritable(u), n[a] = u), s[f] = s[f] || null;
    }
  }
  _wrapNested(e, t, n, i) {
    const s = this._wrapWritable(e);
    return this._wrapProperties(e, s, t, n, i, 0), s.__parse = (o, a, r, c) => (this._wrapProperties(o, s, t, a, r, c), false), s;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _wrapWritable(e) {
    const t = [], n = /* @__PURE__ */ __name(function() {
      for (let i = 0; i < t.length; i++) t[i](e);
    }, "n");
    return { subscribe: /* @__PURE__ */ __name((i) => (t.push(i), this._async ? setTimeout(i, 1, e) : i(e), () => {
      const s = t.indexOf(i);
      s >= 0 && t.splice(s, 1);
    }), "subscribe"), __trigger: /* @__PURE__ */ __name(() => {
      t.length && (this._async ? setTimeout(n, 1) : n());
    }, "__trigger"), __parse: /* @__PURE__ */ __name(function(i) {
      return e = i, true;
    }, "__parse") };
  }
};
__name(_dd, "dd");
var dd = _dd;
var _hd = class _hd {
  constructor(e, t, n, i) {
    typeof e == "function" ? this._setter = e : this._setter = e.setState.bind(e), this._routes = t, this._parsers = n, this._prev = {}, this._triggers = /* @__PURE__ */ new Map(), this._sources = /* @__PURE__ */ new Map(), this._routes.forEach((s) => {
      s.in.forEach((o) => {
        const a = this._triggers.get(o) || [];
        a.push(s), this._triggers.set(o, a);
      }), s.out.forEach((o) => {
        const a = this._sources.get(o) || {};
        s.in.forEach((r) => a[r] = true), this._sources.set(o, a);
      });
    }), this._routes.forEach((s) => {
      s.length = Math.max(...s.in.map((o) => er(o, this._sources, 1)));
    }), this._bus = i;
  }
  init(e) {
    const t = {};
    for (const n in e) if (this._prev[n] !== e[n]) {
      const i = this._parsers[n];
      t[n] = i ? i(e[n]) : e[n];
    }
    this._prev = this._prev ? { ...this._prev, ...e } : { ...e }, this.setState(t), this._bus && this._bus.exec("init-state", t);
  }
  setStateAsync(e) {
    const t = this._setter(e, $o);
    return this._async ? Object.assign(this._async.signals, t) : this._async = { signals: t, timer: setTimeout(this._applyState.bind(this), 1) }, t;
  }
  _applyState() {
    const e = this._async;
    if (e) {
      this._async = null, this._triggerUpdates(e.signals, []);
      for (const t in e.signals) {
        const n = e.signals[t];
        n && n();
      }
    }
  }
  setState(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    const n = this._setter(e);
    return this._triggerUpdates(n, t), n;
  }
  _triggerUpdates(e, t) {
    const n = Object.keys(e), i = !t.length;
    t = t || [];
    for (let s = 0; s < n.length; s++) {
      const o = n[s], a = this._triggers.get(o);
      a && a.forEach((r) => {
        t.indexOf(r) == -1 && t.push(r);
      });
    }
    i && this._execNext(t);
  }
  _execNext(e) {
    for (; e.length; ) {
      e.sort((n, i) => n.length < i.length ? 1 : -1);
      const t = e[e.length - 1];
      e.splice(e.length - 1), t.exec(e);
    }
  }
};
__name(_hd, "hd");
var hd = _hd;
function er(l, e, t) {
  const n = e.get(l);
  if (!n) return t;
  const i = Object.keys(n).map((s) => er(s, e, t + 1));
  return Math.max(...i);
}
__name(er, "er");
var _md = class _md {
  constructor() {
    this._nextHandler = null, this._handlers = {}, this._tag = /* @__PURE__ */ new WeakMap(), this.exec = this.exec.bind(this);
  }
  on(e, t, n) {
    let i = this._handlers[e];
    i ? n && n.intercept ? i.unshift(t) : i.push(t) : i = this._handlers[e] = [t], n && n.tag && this._tag.set(t, n.tag);
  }
  intercept(e, t, n) {
    this.on(e, t, { ...n, intercept: true });
  }
  detach(e) {
    for (const t in this._handlers) {
      const n = this._handlers[t];
      for (let i = n.length - 1; i >= 0; i--) this._tag.get(n[i]) === e && n.splice(i, 1);
    }
  }
  async exec(e, t) {
    const n = this._handlers[e];
    if (n) for (let i = 0; i < n.length; i++) {
      const s = n[i](t);
      if (s === false || s && s.then && await s === false) return;
    }
    return this._nextHandler && await this._nextHandler.exec(e, t), t;
  }
  setNext(e) {
    return this._nextHandler = e;
  }
};
__name(_md, "md");
var md = _md;
function _d(l) {
  return (e) => e[l];
}
__name(_d, "_d");
function gd(l) {
  return (e, t) => e[l] = t;
}
__name(gd, "gd");
function tr(l, e) {
  return (e.getter || _d(e.id))(l) ?? "";
}
__name(tr, "tr");
function Ti(l, e, t) {
  return (e.setter || gd(e.id))(l, t);
}
__name(Ti, "Ti");
function Ci(l, e) {
  const t = document.createElement("a");
  t.href = URL.createObjectURL(l), t.download = e, document.body.appendChild(t), t.click(), document.body.removeChild(t);
}
__name(Ci, "Ci");
function Dt(l, e) {
  let t = tr(l, e);
  return e.template && (t = e.template(t, l, e)), e.optionsMap && (Array.isArray(t) ? t = t.map((n) => e.optionsMap.get(n)) : t = e.optionsMap.get(t)), typeof t > "u" ? "" : t + "";
}
__name(Dt, "Dt");
function wd(l, e) {
  const t = /\n|"|;|,/;
  let n = "";
  const i = e.rows || `
`, s = e.cols || "	", o = l._columns, a = l.data;
  e.header !== false && o[0].header && (n = Di("header", o, n, s, i));
  for (let r = 0; r < a.length; r++) {
    const c = [];
    for (let u = 0; u < o.length; u++) {
      let f = Dt(a[r], o[u]);
      t.test(f) && (f = '"' + f.replace(/"/g, '""') + '"'), c.push(f);
    }
    n += (n ? i : "") + c.join(s);
  }
  return e.footer !== false && o[0].footer && (n = Di("footer", o, n, s, i)), n;
}
__name(wd, "wd");
function Di(l, e, t, n, i) {
  const s = /\n|"|;|,/;
  for (let o = 0; o < e[0][l].length; o++) {
    const a = [];
    for (let r = 0; r < e.length; r++) {
      let c = (e[r][l][o].text || "") + "";
      s.test(c) && (c = '"' + c.replace(/"/g, '""') + '"'), a.push(c);
    }
    t += (t ? i : "") + a.join(n);
  }
  return t;
}
__name(Di, "Di");
function bd(l, e) {
  const t = [], n = [], i = [];
  let s = [];
  const o = l._columns, a = l.data, r = l._sizes;
  for (let u = 0; u < o.length; u++) i.push({ width: o[u].width || r.colWidth });
  let c = 0;
  e.header !== false && o[0].header && (Wi("header", o, t, n, c), s = s.concat(r.headerRowHeights.map((u) => ({ height: u }))), c += o[0].header.length);
  for (let u = 0; u < a.length; u++) {
    const f = [];
    for (let d = 0; d < o.length; d++) f.push({ v: Dt(a[u], o[d]), s: 2 });
    t.push(f), s.push({ height: r.rowHeight });
  }
  return c += a.length, e.footer !== false && o[0].footer && (Wi("footer", o, t, n, c), s = s.concat(r.footerRowHeights.map((u) => ({ height: u })))), { cells: t, merged: n, rowSizes: s, colSizes: i };
}
__name(bd, "bd");
function Wi(l, e, t, n, i) {
  for (let s = 0; s < e[0][l].length; s++) {
    const o = [];
    for (let a = 0; a < e.length; a++) {
      const r = e[a][l][s], c = r.colspan ? r.colspan - 1 : 0, u = r.rowspan ? r.rowspan - 1 : 0;
      (c || u) && n.push({ from: { row: s + i, column: a }, to: { row: s + i + u, column: a + c } });
      const f = (r.text || "") + "";
      let d;
      l == "header" ? s == e[0][l].length - 1 ? d = 1 : d = 0 : s ? d = 4 : d = 3, o.push({ v: f, s: d });
    }
    t.push(o);
  }
}
__name(Wi, "Wi");
function kd() {
  const l = { fontWeight: "bold", color: "#000000b3", background: "#f4f5f9", verticalAlign: "center", align: "left" };
  return { cell: { color: "#000000b3", verticalAlign: "center", align: "left" }, header: { ...l }, footer: { ...l }, lastHeaderCell: { ...l, borderBottom: "0.5px solid #3498ff" }, firstFooterCell: { ...l, borderTop: "0.5px solid #3498ff" } };
}
__name(kd, "kd");
function nr(l, e) {
  return typeof l > "u" || l === null ? -1 : typeof e > "u" || e === null ? 1 : l === e ? 0 : l > e ? 1 : -1;
}
__name(nr, "nr");
function pd(l, e) {
  return -nr(l, e);
}
__name(pd, "pd");
function yd(l, e) {
  const t = e === "asc" ? nr : pd;
  return function(n, i) {
    return t(n[l], i[l]);
  };
}
__name(yd, "yd");
function vd(l) {
  if (!l || !l.length) return;
  const e = l.map((t) => yd(t.key, t.order));
  return l.length === 1 ? e[0] : function(t, n) {
    for (let i = 0; i < e.length; i++) {
      const s = e[i](t, n);
      if (s !== 0) return s;
    }
    return 0;
  };
}
__name(vd, "vd");
var Hi = 28;
var Sd = 16;
function Md() {
  const l = document.querySelector('[class^="wx"][class$="theme"]');
  return l ? l.className.substr(3, l.className.length - 9) : "willow";
}
__name(Md, "Md");
function Nn(l, e, t, n, i) {
  const s = document.createElement("div"), o = document.createElement("div"), a = document.body;
  i = i ? `${i}px` : "auto";
  let r, c;
  o.className = e, s.classList.add(`wx-${t}-theme`), s.style.cssText = `height:auto;position:absolute;top:0px;left:100px;overflow:hidden;width=${i};white-space:nowrap;`, s.appendChild(o), a.appendChild(s), typeof l != "object" && (l = [l]);
  for (let u = 0; u < l.length; u++) {
    o.innerText = l[u] + "";
    const f = s.getBoundingClientRect(), d = Math.ceil(f.width) + (n && n.length ? n[u] : 0), h = Math.ceil(f.height);
    r = Math.max(r || 0, d), c = Math.max(c || 0, h);
  }
  return s.remove(), { width: r, height: c };
}
__name(Nn, "Nn");
function zi(l, e, t, n, i) {
  const s = [];
  for (let o = 0; o < l.length; o++) {
    const a = l[o][e], r = a.length;
    for (let c = 0; c < r; c++) {
      const { text: u, vertical: f, collapsed: d, rowspan: h, css: m } = a[c];
      if (!u) {
        s[c] = Math.max(s[c] || 0, n);
        continue;
      }
      let _ = 0;
      if (f && !d) {
        let w = `wx-measure-cell-${e} wx-measure-vertical`;
        if (w += m ? ` ${m}` : "", _ = Nn(u, w, i).width, (h > 1 || !a[c + 1]) && t > c + 1) {
          const b = h || t - c, p = s.slice(c, c + b).reduce((z, T) => z + T, 0);
          if (p < _) {
            const z = Math.ceil((_ - p) / b);
            for (let T = c; T < c + b; T++) s[T] = (s[T] || n) + z;
          }
          continue;
        }
      }
      s[c] = Math.max(s[c] || n, _);
    }
  }
  return s;
}
__name(zi, "zi");
function Td(l, e, t) {
  const n = [], i = [];
  let s = "wx-measure-cell-body";
  s += l.css ? ` ${l.css}` : "";
  for (let o = 0; o < e.length; o++) {
    const a = e[o], r = Dt(a, l);
    r && (n.push(r), l.treetoggle && i.push(e[o].$level * Hi + (e[o].$count ? Hi : 0)));
  }
  return Nn(n, s, t, i).width;
}
__name(Td, "Td");
function Cd(l, e) {
  const t = "wx-measure-cell-header", n = l.sort ? Sd : 0;
  let i = l.header;
  if (typeof i == "string") return Nn(i, t, e).width + n;
  let s;
  Array.isArray(i) || (i = [i]);
  for (let o = 0; o < i.length; o++) {
    const a = i[o], r = typeof a == "string" ? a : a.text, c = t + (typeof a == "string" ? "" : ` ${a.css}`);
    let u = Nn(r, c, e).width;
    o === i.length - 1 && (u += n), s = Math.max(s || 0, u);
  }
  return s;
}
__name(Cd, "Cd");
var _Dd = class _Dd extends dd {
  constructor(e) {
    super({ writable: e, async: false });
    __publicField(this, "in");
    __publicField(this, "_router");
    __publicField(this, "_branches");
    __publicField(this, "_xlsxWorker");
    const t = { rowHeight: 37, colWidth: 160, headerHeight: 36, footerHeight: 36 };
    this._router = new hd(
      super.setState.bind(this),
      // data recalculation dependencies
      [
        // normalize columns, headers and footers
        { in: ["columns", "sizes", "_skin"], out: ["_columns", "_sizes"], exec: /* @__PURE__ */ __name((i) => {
          const { columns: s, sizes: o, _skin: a } = this.getState(), r = this.copyColumns(s), c = r.reduce((d, h) => Math.max(h.header.length, d), 0), u = r.reduce((d, h) => Math.max(h.footer.length, d), 0);
          r.forEach(this.setCollapsibleColumns);
          const f = this.normalizeSizes(r, o, c, u, a);
          r.forEach((d, h) => {
            this.normalizeColumns(r, h, "header", c, f), this.normalizeColumns(r, h, "footer", u, f);
          }), this.setState({ _columns: r, _sizes: f }, i);
        }, "exec") },
        { in: ["data", "tree"], out: ["flatData"], exec: /* @__PURE__ */ __name((i) => {
          const { data: s, tree: o } = this.getState();
          this.setState({ flatData: o ? this.flattenRows(s) : s }, i);
        }, "exec") }
      ],
      {
        // data initializers
        data: /* @__PURE__ */ __name((i) => this._branches ? this.normalizeTreeRows(i) : this.normalizeRows(i), "data"),
        // accept partially filles size structure
        sizes: /* @__PURE__ */ __name((i) => ({ ...t, ...i }), "sizes")
      }
    );
    const n = this.in = new md();
    n.on("close-editor", (_ref36) => {
      let { ignore: i } = _ref36;
      const { editor: s } = this.getState();
      s && (i || n.exec("update-cell", s), this.setState({ editor: null }));
    }), n.on("open-editor", (_ref37) => {
      let { id: i, column: s } = _ref37;
      let o = this.getState().editor;
      o && n.exec("close-editor", {});
      const a = s ? this.getColumn(s) : this.getNextEditor();
      if (a?.editor) {
        const r = this.getRow(i);
        o = { column: a.id, id: i, value: tr(r, a), renderedValue: Dt(r, a) }, typeof a.editor != "string" && a.editor.config && (o.config = a.editor.config), a.options && (o.options = a.options), this.setState({ editor: o });
      }
    }), n.on("editor", (_ref38) => {
      let { value: i } = _ref38;
      const s = this.getState().editor;
      s && (s.value = i, this.setState({ editor: s }));
    }), n.on("add-row", (i) => {
      let { data: s } = this.getState();
      const { row: o, before: a, after: r } = i;
      if (i.id = o.id = i.id || o.id || qn(), a || r) {
        const c = a || r, u = s.findIndex((f) => f.id === c);
        s.splice(u + (r ? 1 : 0), 0, i.row), s = [...s];
      } else s = [...s, i.row];
      this.setState({ data: s }), n.exec("select-row", { id: o.id });
    }), n.on("delete-row", (i) => {
      const { data: s, selected: o, selectedRows: a } = this.getState(), { id: r } = i, c = { data: s.filter((u) => u.id !== r) };
      this.isSelected(r) && (c.selectedRows = a.filter((u) => u !== r), o == r && (c.selected = c.selectedRows[c.selectedRows.length - 1] || null)), this.setState(c);
    }), n.on("update-cell", (i) => {
      let { data: s } = this.getState();
      s = [...s];
      const { tree: o } = this.getState(), { id: a, column: r, value: c } = i, u = this.getColumn(r);
      if (o) {
        const f = { ...this._branches[a] };
        Ti(f, u, c), this._branches[a] = f;
        const d = this._branches[f.$parent], h = d.data.findIndex((m) => m.id == a);
        f.$parent === 0 && (s = d.data), d.data = [...d.data], d.data[h] = f;
      } else {
        const f = s.findIndex((h) => h.id == a), d = { ...s[f] };
        Ti(d, u, c), s[f] = d;
      }
      this.setState({ data: s });
    }), n.on("update-row", (i) => {
      let { data: s } = this.getState();
      const { id: o, row: a } = i, r = s.findIndex((c) => c.id == o);
      s = [...s], s[r] = { ...s[r], ...a }, this.setState({ data: s });
    }), n.on("select-row", (_ref39) => {
      let { id: i, toggle: s, range: o, mode: a, show: r, column: c } = _ref39;
      let { selected: u, selectedRows: f } = this.getState();
      if (o) {
        const { data: d } = this.getState();
        u || (u = i);
        let h = d.findIndex((_) => _.id == u), m = d.findIndex((_) => _.id == i);
        h > m && ([h, m] = [m, h]), d.slice(h, m + 1).forEach((_) => {
          f.indexOf(_.id) === -1 && f.push(_.id);
        }), u = i;
      } else if (s && this.isSelected(i)) {
        if (a === true) return;
        f = f.filter((d) => d !== i), u = f[f.length - 1] || null;
      } else if (u = i, s) {
        if (a === false) return;
        f.push(i);
      } else f = [i];
      this.setState({ selected: u, selectedRows: f }), r && this.in.exec("scroll", { row: i, column: c });
    }), n.on("resize-column", (i) => {
      const { id: s, auto: o, maxRows: a } = i;
      let r = i.width || 0;
      const c = [...this.getState().columns], u = c.find((f) => f.id == s);
      if (o) {
        if (o == "data" || o === true) {
          const { flatData: f, _skin: d } = this.getState();
          let h = f.length;
          a && (h = Math.min(a, h));
          const m = f.slice(0, h);
          r = Td(u, m, d);
        }
        if (o == "header" || o === true) {
          const { _skin: f } = this.getState();
          r = Math.max(Cd(u, f), r);
        }
      }
      u.width = Math.max(17, r), delete u.flexgrow, this.setState({ columns: c });
    }), n.on("hide-column", (_ref40) => {
      let { id: i, mode: s } = _ref40;
      const o = [...this.getState().columns], a = o.find((c) => c.id == i), r = o.reduce((c, u) => c + (u.hidden ? 0 : 1), 0);
      (!s || r > 1) && (a.hidden = !a.hidden, this.setState({ columns: o }));
    }), n.on("sort-rows", (i) => {
      const s = { key: i.key, order: i.order || "asc" };
      let o = this.getState().sort;
      const { columns: a, data: r, tree: c } = this.getState();
      let u = o.length;
      o.forEach((d, h) => {
        d.key === s.key && (s.order = d.order === "asc" ? "desc" : "asc", u = h);
      }), a.forEach((d) => {
        d.$sort = null;
      }), i.add ? (o = [...o], o[u] = s) : o = [s], this.setState({ sort: o }), o.forEach((d, h) => {
        d.index = o.length === 1 ? 0 : h + 1, a.find((m) => m.id == d.key).$sort = d;
      }), this.setState({ columns: a });
      const f = vd(o);
      if (f) {
        const d = [...r];
        c ? this.sortTree(d, f) : d.sort(f), this.setState({ data: d });
      }
    }), n.on("filter-rows", (i) => {
      this.setState({ filter: i.handler });
    }), n.on("collapse-column", (i) => {
      const { id: s, row: o, mode: a } = i, r = [...this.getState().columns], c = this.getColumn(s).header, u = Array.isArray(c) ? c[o] : c;
      typeof u == "object" && (u.collapsed = a ?? !u.collapsed, this.setState({ columns: r }));
    }), n.on("open-row", (i) => {
      const { id: s, nested: o } = i, { data: a } = this.getState();
      this.toggleBranch(s, true, o), this.setState({ data: a });
    }), n.on("close-row", (i) => {
      const { id: s, nested: o } = i, { data: a } = this.getState();
      this.toggleBranch(s, false, o), this.setState({ data: a });
    }), n.on("export", (i) => new Promise((s, o) => {
      const a = i.options || {}, r = `${a.fileName || "data"}.${a.format}`;
      if (a.format == "csv") {
        const c = wd(this.getState(), a);
        a.download !== false ? Ci(new Blob(["\uFEFF" + c], { type: "text/csv" }), r) : i.result = c, s(true);
      } else if (a.format == "xlsx") {
        const { cells: c, merged: u, rowSizes: f, colSizes: d } = bd(this.getState(), a), h = a.cdn || "https://cdn.dhtmlx.com/libs/json2excel/next/worker.js", m = this.getXlsxWorker(h), _ = a.styles || kd();
        m.then((w) => {
          w.onmessage = (b) => {
            if (b.data.type == "ready") {
              const p = b.data.blob;
              a.download !== false ? Ci(p, r) : i.result = p, s(true);
            }
          }, w.postMessage({ type: "convert", data: { data: [{ name: a.sheetName || "data", cells: c, cols: d, rows: f, merged: u }], styles: [{ id: "header", ..._.header }, { id: "lastHeaderCell", ..._.lastHeaderCell || _.header }, { id: "cell", ..._.cell }, { id: "firstFooterCell", ..._.firstFooterCell || _.footer }, { id: "footer", ..._.footer }] } });
        });
      } else o();
    })), n.on("hotkey", (_ref41) => {
      let { key: i, event: s } = _ref41;
      switch (i) {
        case "arrowup": {
          const { selected: o, editor: a, flatData: r } = this.getState();
          if (!a) {
            s.preventDefault();
            const c = o ? this.getPrevRow(o)?.id : r[r.length - 1]?.id;
            c && this.in.exec("select-row", { id: c, show: true });
          }
          break;
        }
        case "arrowdown": {
          const { selected: o, editor: a, flatData: r } = this.getState();
          if (!a) {
            s.preventDefault();
            const c = o ? this.getNextRow(o)?.id : r[0]?.id;
            c && this.in.exec("select-row", { id: c, show: true });
          }
          break;
        }
        case "tab": {
          const { editor: o } = this.getState();
          if (o) {
            s.preventDefault();
            const a = o.column;
            let r = o.id, c = this.getNextEditor(a);
            if (c) this.in.exec("select-row", { id: r, show: true, column: c.id });
            else {
              const u = this.getNextRow(r);
              u && (r = u.id, c = this.getNextEditor(), this.in.exec("select-row", { id: r, show: true, column: c.id }));
            }
            c && this.in.exec("open-editor", { id: r, column: c.id });
          }
          break;
        }
        case "shift+tab": {
          const { editor: o } = this.getState();
          if (o) {
            s.preventDefault();
            const a = o.column;
            let r = o.id, c = this.getPrevEditor(a);
            if (c) this.in.exec("select-row", { id: r, show: true, column: c.id });
            else {
              const u = this.getPrevRow(r);
              u && (r = u.id, c = this.getPrevEditor(), this.in.exec("select-row", { id: r, show: true, column: c.id }));
            }
            c && this.in.exec("open-editor", { id: r, column: c.id });
          }
          break;
        }
        case "escape": {
          const { editor: o } = this.getState();
          o && this.in.exec("close-editor", { ignore: true });
          break;
        }
        case "f2": {
          const { editor: o, selected: a } = this.getState();
          !o && a && this.in.exec("open-editor", { id: a });
          break;
        }
      }
    }), n.on("scroll", (i) => {
      const { _columns: s, split: o, _sizes: a, data: r } = this.getState();
      let c = -1, u = -1, f = 0;
      if (i.column) {
        c = 0;
        const d = s.findIndex((h) => h.id === i.column);
        f = s[d].width;
        for (let h = o.left; h < d; h++) {
          const m = s[h];
          m.hidden || (c += m.width);
        }
      }
      i.row && (u = a.rowHeight * r.findIndex((d) => d.id === i.row)), this.setState({ scroll: { top: u, left: c, width: f, height: a.rowHeight } });
    });
  }
  getXlsxWorker(e) {
    if (!this._xlsxWorker) {
      const t = window.URL.createObjectURL(new Blob([`importScripts('${e}');`], { type: "text/javascript" }));
      this._xlsxWorker = new Promise((n) => {
        const i = new Worker(t);
        i.addEventListener("message", (s) => {
          s.data.type === "init" && n(i);
        });
      });
    }
    return this._xlsxWorker;
  }
  init(e) {
    e.hasOwnProperty("_skin") && !e._skin && (e._skin = Md()), e.columns && e.columns.forEach((t) => {
      t.options && (t.optionsMap = new Map(t.options.map((n) => [n.id, n.name])));
    }), e.tree && (this._branches = { 0: { data: e.data } }), this._router.init({ sort: [], filter: null, scroll: null, ...e });
  }
  setState(e, t) {
    return this._router.setState(e, t);
  }
  getRow(e) {
    const { tree: t } = this.getState();
    return t ? this._branches[e] : this.getState().data.find((n) => n.id == e);
  }
  getNextRow(e) {
    const t = this.getState().flatData, n = t.findIndex((i) => i.id == e);
    return t[n + 1];
  }
  getPrevRow(e) {
    const t = this.getState().flatData, n = t.findIndex((i) => i.id == e);
    return t[n - 1];
  }
  getColumn(e) {
    return this.getState().columns.find((t) => t.id == e);
  }
  getNextEditor(e) {
    let t = this.getState().columns;
    if (e) {
      const n = t.findIndex((i) => i.id == e);
      t = t.slice(n + 1);
    }
    return t.find((n) => n.editor && !n.hidden);
  }
  getPrevEditor(e) {
    let t = this.getState().columns;
    if (e) {
      const n = t.findLastIndex((i) => i.id == e);
      t = t.slice(0, n);
    }
    return t.findLast((n) => n.editor && !n.hidden);
  }
  toggleBranch(e, t, n) {
    const i = this._branches[e];
    e !== 0 && (i.open = t), n && i.data?.length && i.data.forEach((s) => {
      this.toggleKids(s, t, n);
    });
  }
  toggleKids(e, t, n) {
    e.open = t, n && e.data?.length && e.data.forEach((i) => {
      this.toggleKids(i, t, n);
    });
  }
  isSelected(e) {
    return this.getState().selectedRows.indexOf(e) !== -1;
  }
  copyColumns(e) {
    const t = [];
    return e.forEach((n) => {
      const i = { ...n };
      this.copyHeaderFooter(i, "header"), this.copyHeaderFooter(i, "footer"), t.push(i);
    }), t;
  }
  copyHeaderFooter(e, t) {
    let n = e[t];
    n = Array.isArray(n) ? [...n] : [n], n.forEach((i, s) => {
      n[s] = typeof i == "string" ? { text: i } : { ...i };
    }), e[t] = n;
  }
  setCollapsibleColumns(e, t, n) {
    let i = e.header;
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      if (o.collapsible && o.collapsed) {
        if (o.collapsible !== "first") {
          e.collapsed = true, e.width = 36, o.vertical = true;
          const r = i.length - s;
          i = i.slice(0, s + 1), i[s].rowspan = r;
        }
        const a = o.colspan;
        if (a) {
          const r = i[s + 1];
          let c = 1;
          r && r.colspan && !r.collapsed && (c = r.colspan);
          for (let u = c; u < a; u++) {
            const f = n[t + u];
            f && (f.hidden = true);
          }
        }
      }
    }
  }
  normalizeColumns(e, t, n, i, s) {
    const o = e[t];
    o.width || (o.width = o.flexgrow ? 17 : s.colWidth), o.editor && typeof o.editor == "string" && (o.editor = { type: o.editor });
    const a = o[n], r = s[`${n}RowHeights`];
    for (let c = 0; c < i; c++) {
      const u = a[c];
      u.id = o.id, c === a.length - 1 && (u.rowspan = u.rowspan ? Math.min(u.rowspan, i - c) : i - c);
      for (let f = 1; f < u.rowspan; f++) {
        a.splice(c + f, 0, {});
        for (let d = 1; d < u.colspan; d++) e[t + d][n].splice(c + f, 0, {});
      }
      if (u.rowspan) {
        const f = (u.rowspan === i ? r : r.slice(c, u.rowspan + c)).reduce((d, h) => d + h, 0);
        u.height = f, c + u.rowspan != i && u.height--;
      }
      if (u.colspan) {
        let f = o.width, d = o.flexgrow || 0;
        const h = u.colspan;
        for (let m = 1; m < h; m++) {
          const _ = e[t + m];
          _ && (_.hidden ? u.colspan -= 1 : _.flexgrow ? d += _.flexgrow : f += _.width || s.colWidth), d ? u.flexgrow = d : u.width = f;
        }
      } else u.width = o.width, u.flexgrow = o.flexgrow;
    }
    a.length > i && (a.length = i), o[n] = a;
  }
  normalizeRows(e) {
    return e.forEach((t) => {
      t.id || (t.id = qn());
    }), e;
  }
  normalizeTreeRows(e, t, n) {
    return e.forEach((i) => {
      i.id || (i.id = qn()), i.$level = t || 0, i.$parent = n || 0, this._branches[i.id] = i, i.data?.length && (i.$count = i.data.length, this.normalizeTreeRows(i.data, i.$level + 1, i.id));
    }), e;
  }
  sortTree(e, t) {
    e.sort(t), e.forEach((n) => {
      n.data && this.sortTree(n.data, t);
    });
  }
  flattenRows(e, t) {
    const n = t || [];
    return e.forEach((i) => {
      n.push(i), i.data?.length && i.open !== false && this.flattenRows(i.data, n);
    }), n;
  }
  normalizeSizes(e, t, n, i, s) {
    const o = zi(e, "header", n, t.headerHeight, s), a = zi(e, "footer", i, t.footerHeight, s), r = o.reduce((u, f) => u + f, 0), c = a.reduce((u, f) => u + f, 0);
    return { ...t, headerRowHeights: o, footerRowHeights: a, headerHeight: r, footerHeight: c };
  }
};
__name(_Dd, "Dd");
var Dd = _Dd;
var Wd = (/* @__PURE__ */ new Date()).valueOf();
function qn() {
  return "temp://" + Wd++;
}
__name(qn, "qn");
function Hd(l, _ref42) {
  let { keys: e, exec: t } = _ref42;
  for (const i in e) {
    const s = i.toLowerCase().replace(/ /g, "");
    s !== i && (e[s] = e[i]);
  }
  function n(i) {
    let s = i.code.toLowerCase();
    s === " " && (s = "space");
    const o = `${i.ctrlKey || i.metaKey ? "ctrl+" : ""}${i.shiftKey ? "shift+" : ""}${i.altKey ? "alt+" : ""}${s}`, a = e[o];
    if (typeof a < "u") {
      const r = i.target.tagName === "INPUT" || i.target.tagName === "TEXTAREA";
      typeof a == "function" ? a({ key: o, event: i, node: l, isInput: r }) : a && t({ key: o, event: i, node: l, isInput: r });
    }
  }
  __name(n, "n");
  return l.addEventListener("keydown", n), { destroy: /* @__PURE__ */ __name(() => {
    l.removeEventListener("keydown", n);
  }, "destroy") };
}
__name(Hd, "Hd");
function zd(l, e) {
  let t = null;
  e.scroll.subscribe((n) => {
    if (!n || n === t) return;
    t = n;
    const { left: i, top: s, height: o, width: a } = n, r = e.getHeight(), c = e.getWidth();
    if (s >= 0) {
      const u = l.scrollTop;
      s < u ? l.scrollTop = s : s + o > u + r && (l.scrollTop = s - r + o);
    }
    if (i >= 0) {
      const u = l.scrollLeft;
      i < u ? l.scrollLeft = i : i + a > u + c && (l.scrollLeft = i - c + a);
    }
  });
}
__name(zd, "zd");
function Nd(l, e) {
  const t = new ResizeObserver((n) => e(n[0].contentRect));
  return t.observe(l.parentNode), { destroy() {
    t.disconnect();
  } };
}
__name(Nd, "Nd");
function Pn(l, e, t, n, i) {
  const s = l ? `width:${l}px;` : "", o = l ? `min-width:${l}px;` : "", a = e ? `flex-grow:${e};` : "", r = i ? `height:${i}px;` : "", c = t ? `position:sticky;left:${n}px;` : "";
  return `${o}${s}${r}${a}${c}`;
}
__name(Pn, "Pn");
function lr(l, e, t) {
  let n = "";
  return n += l.fixed ? l.fixed === -1 ? "wx-shadow " : "wx-fixed " : "", n += e.rowspan > 1 ? "wx-rowspan " : "", n += e.colspan > 1 ? "wx-colspan " : "", n += e.vertical ? "wx-vertical " : "", n += t ? t(l) + " " : "", n;
}
__name(lr, "lr");
function Ld(l) {
  let e;
  const t = (
    /*#slots*/
    l[7].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[6],
    null
  ), i = n || Id(l);
  return { c() {
    i && i.c();
  }, m(s, o) {
    i && i.m(s, o), e = true;
  }, p(s, o) {
    n ? n.p && (!e || o & /*$$scope*/
    64) && Oe(
      n,
      t,
      s,
      /*$$scope*/
      s[6],
      e ? Re(
        t,
        /*$$scope*/
        s[6],
        o,
        null
      ) : Ae(
        /*$$scope*/
        s[6]
      ),
      null
    ) : i && i.p && (!e || o & /*row, col*/
    3) && i.p(s, e ? o : -1);
  }, i(s) {
    e || (k(i, s), e = true);
  }, o(s) {
    y(i, s), e = false;
  }, d(s) {
    i && i.d(s);
  } };
}
__name(Ld, "Ld");
function Ed(l) {
  let e, t, n, i, s, o = (
    /*row*/
    l[0].$count && Ni(l)
  );
  const a = (
    /*#slots*/
    l[7].default
  ), r = Ie(
    a,
    l,
    /*$$scope*/
    l[6],
    null
  ), c = r || Rd(l);
  return { c() {
    e = D("div"), t = D("span"), n = Y(), o && o.c(), i = Y(), c && c.c(), j(
      t,
      "margin-left",
      /*row*/
      l[0].$level * 28 + "px"
    ), g(e, "class", "wx-tree-cell x2-1wbpy33");
  }, m(u, f) {
    S(u, e, f), H(e, t), H(e, n), o && o.m(e, null), H(e, i), c && c.m(e, null), s = true;
  }, p(u, f) {
    (!s || f & /*row*/
    1) && j(
      t,
      "margin-left",
      /*row*/
      u[0].$level * 28 + "px"
    ), /*row*/
    u[0].$count ? o ? o.p(u, f) : (o = Ni(u), o.c(), o.m(e, i)) : o && (o.d(1), o = null), r ? r.p && (!s || f & /*$$scope*/
    64) && Oe(
      r,
      a,
      u,
      /*$$scope*/
      u[6],
      s ? Re(
        a,
        /*$$scope*/
        u[6],
        f,
        null
      ) : Ae(
        /*$$scope*/
        u[6]
      ),
      null
    ) : c && c.p && (!s || f & /*row, col*/
    3) && c.p(u, s ? f : -1);
  }, i(u) {
    s || (k(c, u), s = true);
  }, o(u) {
    y(c, u), s = false;
  }, d(u) {
    u && v(e), o && o.d(), c && c.d(u);
  } };
}
__name(Ed, "Ed");
function Id(l) {
  let e = Dt(
    /*row*/
    l[0],
    /*col*/
    l[1]
  ) + "", t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*row, col*/
    3 && e !== (e = Dt(
      /*row*/
      n[0],
      /*col*/
      n[1]
    ) + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(Id, "Id");
function Ni(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "data-action", "toggle-row"), g(e, "class", t = "wx-table-tree-toggle wxi-menu-" + /*row*/
    (l[0].open !== false ? "down" : "right") + " x2-1wbpy33");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*row*/
    1 && t !== (t = "wx-table-tree-toggle wxi-menu-" + /*row*/
    (n[0].open !== false ? "down" : "right") + " x2-1wbpy33") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(Ni, "Ni");
function Rd(l) {
  let e = Dt(
    /*row*/
    l[0],
    /*col*/
    l[1]
  ) + "", t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*row, col*/
    3 && e !== (e = Dt(
      /*row*/
      n[0],
      /*col*/
      n[1]
    ) + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(Rd, "Rd");
function Od(l) {
  let e, t, n, i, s, o, a;
  const r = [Ed, Ld], c = [];
  function u(f, d) {
    return (
      /*col*/
      f[1].treetoggle ? 0 : 1
    );
  }
  __name(u, "u");
  return t = u(l), n = c[t] = r[t](l), { c() {
    e = D("div"), n.c(), g(e, "class", i = Ve(
      /*css*/
      l[3]
    ) + " x2-1wbpy33"), g(
      e,
      "style",
      /*style*/
      l[2]
    ), g(e, "data-row-id", s = /*row*/
    l[0].id), g(e, "data-col-id", o = /*col*/
    l[1].id), Q(
      e,
      "wx-shadow",
      /*col*/
      l[1].fixed === -1
    );
  }, m(f, d) {
    S(f, e, d), c[t].m(e, null), a = true;
  }, p(f, _ref43) {
    let [d] = _ref43;
    let h = t;
    t = u(f), t === h ? c[t].p(f, d) : (te(), y(c[h], 1, 1, () => {
      c[h] = null;
    }), ne(), n = c[t], n ? n.p(f, d) : (n = c[t] = r[t](f), n.c()), k(n, 1), n.m(e, null)), (!a || d & /*css*/
    8 && i !== (i = Ve(
      /*css*/
      f[3]
    ) + " x2-1wbpy33")) && g(e, "class", i), (!a || d & /*style*/
    4) && g(
      e,
      "style",
      /*style*/
      f[2]
    ), (!a || d & /*row*/
    1 && s !== (s = /*row*/
    f[0].id)) && g(e, "data-row-id", s), (!a || d & /*col*/
    2 && o !== (o = /*col*/
    f[1].id)) && g(e, "data-col-id", o), (!a || d & /*css, col*/
    10) && Q(
      e,
      "wx-shadow",
      /*col*/
      f[1].fixed === -1
    );
  }, i(f) {
    a || (k(n), a = true);
  }, o(f) {
    y(n), a = false;
  }, d(f) {
    f && v(e), c[t].d();
  } };
}
__name(Od, "Od");
function Ad(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { row: s } = e, { col: o } = e, { cellStyle: a = null } = e, { columnStyle: r = null } = e, c, u;
  function f(d, h) {
    let m = "wx-cell";
    return m += d ? " " + d(o) : "", m += h ? " " + h(s, o) : "", m;
  }
  __name(f, "f");
  return l.$$set = (d) => {
    "row" in d && t(0, s = d.row), "col" in d && t(1, o = d.col), "cellStyle" in d && t(4, a = d.cellStyle), "columnStyle" in d && t(5, r = d.columnStyle), "$$scope" in d && t(6, i = d.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty & /*col*/
    2 && t(2, c = Pn(o.width, o.flexgrow, o.fixed, o.left)), l.$$.dirty & /*columnStyle, cellStyle*/
    48 && t(3, u = f(r, a));
  }, [s, o, c, u, a, r, i, n];
}
__name(Ad, "Ad");
var _vl = class _vl extends ee {
  constructor(e) {
    super(), $(this, e, Ad, Od, x, { row: 0, col: 1, cellStyle: 4, columnStyle: 5 });
  }
};
__name(_vl, "vl");
var vl = _vl;
function Fd(l, e) {
  let t, n;
  function i(a) {
    t = a.clientX, l.style.opacity = 1, document.body.style.cursor = "ew-resize", document.body.style.userSelect = "none", window.addEventListener("mousemove", s), window.addEventListener("mouseup", o), e && e.down && e.down(l);
  }
  __name(i, "i");
  function s(a) {
    n = a.clientX - t, e && e.move && e.move(n);
  }
  __name(s, "s");
  function o() {
    l.style.opacity = "", document.body.style.cursor = "", document.body.style.userSelect = "", e && e.up && e.up(), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", o);
  }
  __name(o, "o");
  return l.addEventListener("mousedown", i), { destroy() {
    l.removeEventListener("mousedown", i);
  } };
}
__name(Fd, "Fd");
function Pd(l) {
  let e, t, n, i = (
    /*cell*/
    (l[0].text || "") + ""
  ), s, o, a, r, c, u = (
    /*cell*/
    l[0].collapsible && Li(l)
  ), f = (
    /*column*/
    l[1].resize && /*lastRow*/
    l[2] && Ei(l)
  ), d = (
    /*column*/
    l[1].sort && Ii(l)
  );
  return { c() {
    e = D("div"), u && u.c(), t = Y(), n = D("div"), s = re(i), o = Y(), f && f.c(), a = Y(), d && d.c(), g(n, "class", "wx-text x2-hek2za"), g(e, "class", r = "wx-cell " + /*css*/
    l[4] + " " + /*cell*/
    (l[0].css || "") + " x2-hek2za"), g(
      e,
      "style",
      /*style*/
      l[3]
    ), g(e, "data-header-id", c = /*column*/
    l[1].id);
  }, m(h, m) {
    S(h, e, m), u && u.m(e, null), H(e, t), H(e, n), H(n, s), H(e, o), f && f.m(e, null), H(e, a), d && d.m(e, null);
  }, p(h, m) {
    h[0].collapsible ? u ? u.p(h, m) : (u = Li(h), u.c(), u.m(e, t)) : u && (u.d(1), u = null), m & /*cell*/
    1 && i !== (i = /*cell*/
    (h[0].text || "") + "") && me(s, i), /*column*/
    h[1].resize && /*lastRow*/
    h[2] ? f ? f.p(h, m) : (f = Ei(h), f.c(), f.m(e, a)) : f && (f.d(1), f = null), /*column*/
    h[1].sort ? d ? d.p(h, m) : (d = Ii(h), d.c(), d.m(e, null)) : d && (d.d(1), d = null), m & /*css, cell*/
    17 && r !== (r = "wx-cell " + /*css*/
    h[4] + " " + /*cell*/
    (h[0].css || "") + " x2-hek2za") && g(e, "class", r), m & /*style*/
    8 && g(
      e,
      "style",
      /*style*/
      h[3]
    ), m & /*column*/
    2 && c !== (c = /*column*/
    h[1].id) && g(e, "data-header-id", c);
  }, d(h) {
    h && v(e), u && u.d(), f && f.d(), d && d.d();
  } };
}
__name(Pd, "Pd");
function Yd(l) {
  let e, t, n = (
    /*cell*/
    (l[0].text || "") + ""
  ), i, s, o, a, r;
  return { c() {
    e = D("div"), t = D("div"), i = re(n), g(t, "class", "wx-text x2-hek2za"), g(e, "class", s = "wx-cell " + /*css*/
    l[4] + " " + /*cell*/
    (l[0].css || "") + " wx-collapsed x2-hek2za"), g(
      e,
      "style",
      /*style*/
      l[3]
    ), g(e, "data-header-id", o = /*column*/
    l[1].id);
  }, m(c, u) {
    S(c, e, u), H(e, t), H(t, i), a || (r = q(e, "click", En(
      /*collapse*/
      l[8]
    )), a = true);
  }, p(c, u) {
    u & /*cell*/
    1 && n !== (n = /*cell*/
    (c[0].text || "") + "") && me(i, n), u & /*css, cell*/
    17 && s !== (s = "wx-cell " + /*css*/
    c[4] + " " + /*cell*/
    (c[0].css || "") + " wx-collapsed x2-hek2za") && g(e, "class", s), u & /*style*/
    8 && g(
      e,
      "style",
      /*style*/
      c[3]
    ), u & /*column*/
    2 && o !== (o = /*column*/
    c[1].id) && g(e, "data-header-id", o);
  }, d(c) {
    c && v(e), a = false, r();
  } };
}
__name(Yd, "Yd");
function Li(l) {
  let e, t, n, i, s;
  return { c() {
    e = D("div"), t = D("i"), g(t, "class", n = "wxi-angle-" + /*cell*/
    (l[0].collapsed ? "down" : "right")), g(e, "class", "wx-collapse x2-hek2za");
  }, m(o, a) {
    S(o, e, a), H(e, t), i || (s = q(e, "click", En(
      /*collapse*/
      l[8]
    )), i = true);
  }, p(o, a) {
    a & /*cell*/
    1 && n !== (n = "wxi-angle-" + /*cell*/
    (o[0].collapsed ? "down" : "right")) && g(t, "class", n);
  }, d(o) {
    o && v(e), i = false, s();
  } };
}
__name(Li, "Li");
function Ei(l) {
  let e, t, n;
  return { c() {
    e = D("div"), g(e, "class", "wx-grip x2-hek2za");
  }, m(i, s) {
    S(i, e, s), t || (n = nt(Fd.call(null, e, { down: (
      /*down*/
      l[5]
    ), move: (
      /*move*/
      l[6]
    ) })), t = true);
  }, p: I, d(i) {
    i && v(e), t = false, n();
  } };
}
__name(Ei, "Ei");
function Ii(l) {
  let e, t, n, i = (
    /*column*/
    l[1].$sort && /*lastRow*/
    l[2] && Ri(l)
  );
  return { c() {
    e = D("div"), i && i.c(), g(e, "class", "wx-sort x2-hek2za");
  }, m(s, o) {
    S(s, e, o), i && i.m(e, null), t || (n = q(
      e,
      "click",
      /*sort*/
      l[7]
    ), t = true);
  }, p(s, o) {
    s[1].$sort && /*lastRow*/
    s[2] ? i ? i.p(s, o) : (i = Ri(s), i.c(), i.m(e, null)) : i && (i.d(1), i = null);
  }, d(s) {
    s && v(e), i && i.d(), t = false, n();
  } };
}
__name(Ii, "Ii");
function Ri(l) {
  let e, t, n, i = (
    /*column*/
    l[1].$sort.index > 0 && Oi(l)
  );
  return { c() {
    i && i.c(), e = Y(), t = D("i"), g(t, "class", n = "wxi-arrow-" + /*column*/
    (l[1].$sort.order === "asc" ? "up" : "down"));
  }, m(s, o) {
    i && i.m(s, o), S(s, e, o), S(s, t, o);
  }, p(s, o) {
    s[1].$sort.index > 0 ? i ? i.p(s, o) : (i = Oi(s), i.c(), i.m(e.parentNode, e)) : i && (i.d(1), i = null), o & /*column*/
    2 && n !== (n = "wxi-arrow-" + /*column*/
    (s[1].$sort.order === "asc" ? "up" : "down")) && g(t, "class", n);
  }, d(s) {
    s && (v(e), v(t)), i && i.d(s);
  } };
}
__name(Ri, "Ri");
function Oi(l) {
  let e, t = (
    /*column*/
    l[1].$sort.index + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-order x2-hek2za");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*column*/
    2 && t !== (t = /*column*/
    i[1].$sort.index + "") && me(n, t);
  }, d(i) {
    i && v(e);
  } };
}
__name(Oi, "Oi");
function Bd(l) {
  let e;
  function t(s, o) {
    return (
      /*cell*/
      s[0].collapsed && /*column*/
      s[1].collapsed ? Yd : Pd
    );
  }
  __name(t, "t");
  let n = t(l), i = n(l);
  return { c() {
    i.c(), e = se();
  }, m(s, o) {
    i.m(s, o), S(s, e, o);
  }, p(s, _ref44) {
    let [o] = _ref44;
    n === (n = t(s)) && i ? i.p(s, o) : (i.d(1), i = n(s), i && (i.c(), i.m(e.parentNode, e)));
  }, i: I, o: I, d(s) {
    s && v(e), i.d(s);
  } };
}
__name(Bd, "Bd");
function jd(l, e, t) {
  let { cell: n } = e, { column: i } = e, { row: s } = e, { lastRow: o } = e, { columnStyle: a } = e;
  const r = He();
  let c;
  function u(w) {
    c = n.flexgrow ? w.parentNode.clientWidth : n.width;
  }
  __name(u, "u");
  function f(w) {
    r("action", { action: "resize-column", data: { id: n.id, width: Math.max(1, c + w) } });
  }
  __name(f, "f");
  function d(w) {
    r("action", { action: "sort-rows", data: { key: n.id, add: w.ctrlKey } });
  }
  __name(d, "d");
  function h() {
    r("action", { action: "collapse-column", data: { id: n.id, row: s } });
  }
  __name(h, "h");
  let m, _ = "";
  return l.$$set = (w) => {
    "cell" in w && t(0, n = w.cell), "column" in w && t(1, i = w.column), "row" in w && t(9, s = w.row), "lastRow" in w && t(2, o = w.lastRow), "columnStyle" in w && t(10, a = w.columnStyle);
  }, l.$$.update = () => {
    l.$$.dirty & /*cell, column*/
    3 && t(3, m = Pn(n.width, n.flexgrow, i.fixed, i.left, n.height)), l.$$.dirty & /*column, cell, columnStyle*/
    1027 && t(4, _ = lr(i, n, a));
  }, [n, i, o, m, _, u, f, d, h, s, a];
}
__name(jd, "jd");
var _Zd = class _Zd extends ee {
  constructor(e) {
    super(), $(this, e, jd, Bd, x, { cell: 0, column: 1, row: 9, lastRow: 2, columnStyle: 10 });
  }
};
__name(_Zd, "Zd");
var Zd = _Zd;
function Ai(l) {
  let e, t = (
    /*cell*/
    (l[0].text || "") + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-text x2-1pgtgrd");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*cell*/
    1 && t !== (t = /*cell*/
    (i[0].text || "") + "") && me(n, t);
  }, d(i) {
    i && v(e);
  } };
}
__name(Ai, "Ai");
function qd(l) {
  let e, t, n = !/*column*/
  l[1].collapsed && !/*cell*/
  l[0].collapsed && Ai(l);
  return { c() {
    e = D("div"), n && n.c(), g(e, "class", t = "wx-cell " + /*css*/
    l[3] + " " + /*cell*/
    (l[0].css || "") + " x2-1pgtgrd"), g(
      e,
      "style",
      /*style*/
      l[2]
    );
  }, m(i, s) {
    S(i, e, s), n && n.m(e, null);
  }, p(i, _ref45) {
    let [s] = _ref45;
    !/*column*/
    i[1].collapsed && !/*cell*/
    i[0].collapsed ? n ? n.p(i, s) : (n = Ai(i), n.c(), n.m(e, null)) : n && (n.d(1), n = null), s & /*css, cell*/
    9 && t !== (t = "wx-cell " + /*css*/
    i[3] + " " + /*cell*/
    (i[0].css || "") + " x2-1pgtgrd") && g(e, "class", t), s & /*style*/
    4 && g(
      e,
      "style",
      /*style*/
      i[2]
    );
  }, i: I, o: I, d(i) {
    i && v(e), n && n.d();
  } };
}
__name(qd, "qd");
function Kd(l, e, t) {
  let { cell: n } = e, { column: i } = e, { columnStyle: s } = e, o, a = "";
  return l.$$set = (r) => {
    "cell" in r && t(0, n = r.cell), "column" in r && t(1, i = r.column), "columnStyle" in r && t(4, s = r.columnStyle);
  }, l.$$.update = () => {
    l.$$.dirty & /*cell, column*/
    3 && t(2, o = Pn(n.width, n.flexgrow, i.fixed, i.left, n.height)), l.$$.dirty & /*column, cell, columnStyle*/
    19 && t(3, a = lr(i, n, s));
  }, [n, i, o, a, s];
}
__name(Kd, "Kd");
var _Gd = class _Gd extends ee {
  constructor(e) {
    super(), $(this, e, Kd, qd, x, { cell: 0, column: 1, columnStyle: 4 });
  }
};
__name(_Gd, "Gd");
var Gd = _Gd;
function Fi(l, e, t) {
  const n = l.slice();
  return n[10] = e[t], n[12] = t, n;
}
__name(Fi, "Fi");
function Pi(l, e, t) {
  const n = l.slice();
  return n[13] = e[t], n;
}
__name(Pi, "Pi");
function Xd(l) {
  let e, t;
  return e = new Gd({ props: { cell: (
    /*cell*/
    l[13]
  ), columnStyle: (
    /*columnStyle*/
    l[4]
  ), column: (
    /*getColumn*/
    l[6](
      /*cell*/
      l[13].id
    )
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*renderedHeader*/
    32 && (s.cell = /*cell*/
    n[13]), i & /*columnStyle*/
    16 && (s.columnStyle = /*columnStyle*/
    n[4]), i & /*renderedHeader*/
    32 && (s.column = /*getColumn*/
    n[6](
      /*cell*/
      n[13].id
    )), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Xd, "Xd");
function Vd(l) {
  let e, t;
  return e = new Zd({ props: { cell: (
    /*cell*/
    l[13]
  ), columnStyle: (
    /*columnStyle*/
    l[4]
  ), column: (
    /*getColumn*/
    l[6](
      /*cell*/
      l[13].id
    )
  ), row: (
    /*i*/
    l[12]
  ), lastRow: (
    /*isLast*/
    l[7](
      /*cell*/
      l[13],
      /*i*/
      l[12]
    )
  ) } }), e.$on(
    "action",
    /*action_handler*/
    l[9]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*renderedHeader*/
    32 && (s.cell = /*cell*/
    n[13]), i & /*columnStyle*/
    16 && (s.columnStyle = /*columnStyle*/
    n[4]), i & /*renderedHeader*/
    32 && (s.column = /*getColumn*/
    n[6](
      /*cell*/
      n[13].id
    )), i & /*renderedHeader*/
    32 && (s.lastRow = /*isLast*/
    n[7](
      /*cell*/
      n[13],
      /*i*/
      n[12]
    )), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Vd, "Vd");
function Yi(l, e) {
  let t, n, i, s, o;
  const a = [Vd, Xd], r = [];
  function c(u, f) {
    return (
      /*type*/
      u[3] === "header" ? 0 : 1
    );
  }
  __name(c, "c");
  return n = c(e), i = r[n] = a[n](e), { key: l, first: null, c() {
    t = se(), i.c(), s = se(), this.first = t;
  }, m(u, f) {
    S(u, t, f), r[n].m(u, f), S(u, s, f), o = true;
  }, p(u, f) {
    e = u;
    let d = n;
    n = c(e), n === d ? r[n].p(e, f) : (te(), y(r[d], 1, 1, () => {
      r[d] = null;
    }), ne(), i = r[n], i ? i.p(e, f) : (i = r[n] = a[n](e), i.c()), k(i, 1), i.m(s.parentNode, s));
  }, i(u) {
    o || (k(i), o = true);
  }, o(u) {
    y(i), o = false;
  }, d(u) {
    u && (v(t), v(s)), r[n].d(u);
  } };
}
__name(Yi, "Yi");
function Bi(l) {
  let e, t = [], n = /* @__PURE__ */ new Map(), i, s, o, a = de(
    /*row*/
    l[10]
  );
  const r = /* @__PURE__ */ __name((c) => (
    /*cell*/
    c[13].id
  ), "r");
  for (let c = 0; c < a.length; c += 1) {
    let u = Pi(l, a, c), f = r(u);
    n.set(f, t[c] = Yi(f, u));
  }
  return { c() {
    e = D("div");
    for (let c = 0; c < t.length; c += 1) t[c].c();
    i = Y(), g(e, "class", s = Ve(
      /*type*/
      l[3] === "header" ? "wx-h-row" : "wx-f-row"
    ) + " x2-1byhgan"), j(
      e,
      "height",
      /*rowHeights*/
      l[2][
        /*i*/
        l[12]
      ] + "px"
    ), j(e, "display", "flex");
  }, m(c, u) {
    S(c, e, u);
    for (let f = 0; f < t.length; f += 1) t[f] && t[f].m(e, null);
    H(e, i), o = true;
  }, p(c, u) {
    u & /*renderedHeader, columnStyle, getColumn, isLast, type*/
    248 && (a = de(
      /*row*/
      c[10]
    ), te(), t = kt(t, u, r, 1, c, a, n, e, en, Yi, i, Pi), ne()), (!o || u & /*type*/
    8 && s !== (s = Ve(
      /*type*/
      c[3] === "header" ? "wx-h-row" : "wx-f-row"
    ) + " x2-1byhgan")) && g(e, "class", s), (!o || u & /*rowHeights*/
    4) && j(
      e,
      "height",
      /*rowHeights*/
      c[2][
        /*i*/
        c[12]
      ] + "px"
    );
  }, i(c) {
    if (!o) {
      for (let u = 0; u < a.length; u += 1) k(t[u]);
      o = true;
    }
  }, o(c) {
    for (let u = 0; u < t.length; u += 1) y(t[u]);
    o = false;
  }, d(c) {
    c && v(e);
    for (let u = 0; u < t.length; u += 1) t[u].d();
  } };
}
__name(Bi, "Bi");
function Ud(l) {
  let e, t, n, i = de(
    /*renderedHeader*/
    l[5]
  ), s = [];
  for (let a = 0; a < i.length; a += 1) s[a] = Bi(Fi(l, i, a));
  const o = /* @__PURE__ */ __name((a) => y(s[a], 1, 1, () => {
    s[a] = null;
  }), "o");
  return { c() {
    e = D("div");
    for (let a = 0; a < s.length; a += 1) s[a].c();
    g(e, "class", t = Ve(`wx-${/*type*/
    l[3]}`) + " x2-1byhgan"), j(
      e,
      "padding-left",
      /*deltaLeft*/
      l[0] + "px"
    ), j(
      e,
      "width",
      /*contentWidth*/
      l[1] + "px"
    );
  }, m(a, r) {
    S(a, e, r);
    for (let c = 0; c < s.length; c += 1) s[c] && s[c].m(e, null);
    n = true;
  }, p(a, _ref46) {
    let [r] = _ref46;
    if (r & /*type, rowHeights, renderedHeader, columnStyle, getColumn, isLast*/
    252) {
      i = de(
        /*renderedHeader*/
        a[5]
      );
      let c;
      for (c = 0; c < i.length; c += 1) {
        const u = Fi(a, i, c);
        s[c] ? (s[c].p(u, r), k(s[c], 1)) : (s[c] = Bi(u), s[c].c(), k(s[c], 1), s[c].m(e, null));
      }
      for (te(), c = i.length; c < s.length; c += 1) o(c);
      ne();
    }
    (!n || r & /*type*/
    8 && t !== (t = Ve(`wx-${/*type*/
    a[3]}`) + " x2-1byhgan")) && g(e, "class", t), (!n || r & /*deltaLeft*/
    1) && j(
      e,
      "padding-left",
      /*deltaLeft*/
      a[0] + "px"
    ), (!n || r & /*contentWidth*/
    2) && j(
      e,
      "width",
      /*contentWidth*/
      a[1] + "px"
    );
  }, i(a) {
    if (!n) {
      for (let r = 0; r < i.length; r += 1) k(s[r]);
      n = true;
    }
  }, o(a) {
    s = s.filter(Boolean);
    for (let r = 0; r < s.length; r += 1) y(s[r]);
    n = false;
  }, d(a) {
    a && v(e), $e(s, a);
  } };
}
__name(Ud, "Ud");
function Jd(l, e, t) {
  let { deltaLeft: n } = e, { contentWidth: i } = e, { rowHeights: s } = e, { columns: o } = e, { type: a = "header" } = e, { columnStyle: r } = e, c = [];
  function u(h) {
    return o.find((m) => m.id === h);
  }
  __name(u, "u");
  function f(h, m) {
    return h.rowspan && (m += h.rowspan - 1), m === c.length - 1;
  }
  __name(f, "f");
  function d(h) {
    De.call(this, l, h);
  }
  __name(d, "d");
  return l.$$set = (h) => {
    "deltaLeft" in h && t(0, n = h.deltaLeft), "contentWidth" in h && t(1, i = h.contentWidth), "rowHeights" in h && t(2, s = h.rowHeights), "columns" in h && t(8, o = h.columns), "type" in h && t(3, a = h.type), "columnStyle" in h && t(4, r = h.columnStyle);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*columns, type, renderedHeader*/
    296 && o.length) {
      const h = o[0][a].length;
      t(5, c = []);
      for (let m = 0; m < h; m++) {
        let _ = 0;
        c.push([]), o.forEach((w) => {
          _ || c[m].push(w[a][m]), w[a][m].colspan > 1 ? _ = w[a][m].colspan - 1 : _ && _--;
        });
      }
    }
  }, [n, i, s, a, r, c, u, f, o, d];
}
__name(Jd, "Jd");
var _ir = class _ir extends ee {
  constructor(e) {
    super(), $(this, e, Jd, Ud, x, { deltaLeft: 0, contentWidth: 1, rowHeights: 2, columns: 8, type: 3, columnStyle: 4 });
  }
};
__name(_ir, "ir");
var ir = _ir;
function Qd(l) {
  let e;
  return { c() {
    e = re(
      /*overlay*/
      l[0]
    );
  }, m(t, n) {
    S(t, e, n);
  }, p(t, n) {
    n & /*overlay*/
    1 && me(
      e,
      /*overlay*/
      t[0]
    );
  }, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(Qd, "Qd");
function xd(l) {
  let e, t, n;
  var i = (
    /*overlay*/
    l[0]
  );
  function s(o, a) {
    return {};
  }
  __name(s, "s");
  return i && (e = Le(i, s()), e.$on(
    "action",
    /*action_handler*/
    l[1]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a & /*overlay*/
    1 && i !== (i = /*overlay*/
    o[0])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s()), e.$on(
        "action",
        /*action_handler*/
        o[1]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(xd, "xd");
function $d(l) {
  let e, t, n, i, s;
  const o = [xd, Qd], a = [];
  function r(c, u) {
    return u & /*overlay*/
    1 && (t = null), t == null && (t = !!eh(
      /*overlay*/
      c[0]
    )), t ? 0 : 1;
  }
  __name(r, "r");
  return n = r(l, -1), i = a[n] = o[n](l), { c() {
    e = D("div"), i.c(), g(e, "class", "wx-overlay x2-zjaxrx");
  }, m(c, u) {
    S(c, e, u), a[n].m(e, null), s = true;
  }, p(c, _ref47) {
    let [u] = _ref47;
    let f = n;
    n = r(c, u), n === f ? a[n].p(c, u) : (te(), y(a[f], 1, 1, () => {
      a[f] = null;
    }), ne(), i = a[n], i ? i.p(c, u) : (i = a[n] = o[n](c), i.c()), k(i, 1), i.m(e, null));
  }, i(c) {
    s || (k(i), s = true);
  }, o(c) {
    y(i), s = false;
  }, d(c) {
    c && v(e), a[n].d();
  } };
}
__name($d, "$d");
function eh(l) {
  return typeof l == "function";
}
__name(eh, "eh");
function th(l, e, t) {
  let { overlay: n } = e;
  function i(s) {
    De.call(this, l, s);
  }
  __name(i, "i");
  return l.$$set = (s) => {
    "overlay" in s && t(0, n = s.overlay);
  }, [n, i];
}
__name(th, "th");
var _nh = class _nh extends ee {
  constructor(e) {
    super(), $(this, e, th, $d, x, { overlay: 0 });
  }
};
__name(_nh, "nh");
var nh = _nh;
function lh(l) {
  let e, t, n;
  return { c() {
    e = D("input"), g(e, "class", "wx-text x2-1a713m7"), g(e, "type", "text"), e.value = /*value*/
    l[0];
  }, m(i, s) {
    S(i, e, s), l[6](e), t || (n = [q(
      e,
      "input",
      /*updateValue*/
      l[2]
    ), q(
      e,
      "keydown",
      /*closeAndSave*/
      l[3]
    )], t = true);
  }, p(i, _ref48) {
    let [s] = _ref48;
    s & /*value*/
    1 && e.value !== /*value*/
    i[0] && (e.value = /*value*/
    i[0]);
  }, i: I, o: I, d(i) {
    i && v(e), l[6](null), t = false, Ee(n);
  } };
}
__name(lh, "lh");
function ih(l, e, t) {
  let { actions: n } = e, { editor: i } = e, s = "";
  const o = /* @__PURE__ */ __name((f) => t(0, s = f.value), "o");
  let a;
  ht(() => a.focus());
  function r() {
    t(0, s = a.value), n.updateValue(a.value);
  }
  __name(r, "r");
  function c(_ref49) {
    let { key: f } = _ref49;
    f === "Enter" && n.save();
  }
  __name(c, "c");
  function u(f) {
    be[f ? "unshift" : "push"](() => {
      a = f, t(1, a);
    });
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "actions" in f && t(4, n = f.actions), "editor" in f && t(5, i = f.editor);
  }, l.$$.update = () => {
    l.$$.dirty & /*editor*/
    32 && o(i);
  }, [s, a, r, c, n, i, u];
}
__name(ih, "ih");
var _sh = class _sh extends ee {
  constructor(e) {
    super(), $(this, e, ih, lh, x, { actions: 4, editor: 5 });
  }
};
__name(_sh, "sh");
var sh = _sh;
var oh = /* @__PURE__ */ __name((l) => ({ option: l & /*option*/
131072 }), "oh");
var ji = /* @__PURE__ */ __name((l) => ({ option: (
  /*option*/
  l[17]
) }), "ji");
function rh(l) {
  let e = (
    /*option*/
    l[17].name + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*option*/
    131072 && e !== (e = /*option*/
    n[17].name + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(rh, "rh");
function ah(l) {
  let e = (
    /*template*/
    l[0](
      /*option*/
      l[17]
    ) + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*template, option*/
    131073 && e !== (e = /*template*/
    n[0](
      /*option*/
      n[17]
    ) + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(ah, "ah");
function ch(l) {
  let e;
  function t(s, o) {
    return (
      /*template*/
      s[0] ? ah : rh
    );
  }
  __name(t, "t");
  let n = t(l), i = n(l);
  return { c() {
    i.c(), e = se();
  }, m(s, o) {
    i.m(s, o), S(s, e, o);
  }, p(s, o) {
    n === (n = t(s)) && i ? i.p(s, o) : (i.d(1), i = n(s), i && (i.c(), i.m(e.parentNode, e)));
  }, d(s) {
    s && v(e), i.d(s);
  } };
}
__name(ch, "ch");
function uh(l) {
  let e;
  const t = (
    /*#slots*/
    l[11].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[15],
    ji
  ), i = n || ch(l);
  return { c() {
    i && i.c();
  }, m(s, o) {
    i && i.m(s, o), e = true;
  }, p(s, o) {
    n ? n.p && (!e || o & /*$$scope, option*/
    163840) && Oe(
      n,
      t,
      s,
      /*$$scope*/
      s[15],
      e ? Re(
        t,
        /*$$scope*/
        s[15],
        o,
        oh
      ) : Ae(
        /*$$scope*/
        s[15]
      ),
      ji
    ) : i && i.p && (!e || o & /*template, option*/
    131073) && i.p(s, e ? o : -1);
  }, i(s) {
    e || (k(i, s), e = true);
  }, o(s) {
    y(i, s), e = false;
  }, d(s) {
    i && i.d(s);
  } };
}
__name(uh, "uh");
function fh(l) {
  let e, t, n, i, s, o;
  return n = new fl({ props: { items: (
    /*filterOptions*/
    l[2]
  ), $$slots: { default: [uh, (_ref50) => {
    let { option: a } = _ref50;
    return { 17: a };
  }, (_ref51) => {
    let { option: a } = _ref51;
    return a ? 131072 : 0;
  }] }, $$scope: { ctx: l } } }), n.$on(
    "ready",
    /*ready*/
    l[6]
  ), n.$on(
    "select",
    /*updateValue*/
    l[5]
  ), { c() {
    e = D("input"), t = Y(), F(n.$$.fragment), g(e, "class", "wx-input x2-1s4pc76");
  }, m(a, r) {
    S(a, e, r), l[12](e), Ue(
      e,
      /*text*/
      l[1]
    ), S(a, t, r), R(n, a, r), i = true, s || (o = [q(
      e,
      "input",
      /*input_1_input_handler*/
      l[13]
    ), q(
      e,
      "input",
      /*input*/
      l[7]
    ), q(
      e,
      "keydown",
      /*keydown_handler*/
      l[14]
    )], s = true);
  }, p(a, _ref52) {
    let [r] = _ref52;
    r & /*text*/
    2 && e.value !== /*text*/
    a[1] && Ue(
      e,
      /*text*/
      a[1]
    );
    const c = {};
    r & /*filterOptions*/
    4 && (c.items = /*filterOptions*/
    a[2]), r & /*$$scope, template, option*/
    163841 && (c.$$scope = { dirty: r, ctx: a }), n.$set(c);
  }, i(a) {
    i || (k(n.$$.fragment, a), i = true);
  }, o(a) {
    y(n.$$.fragment, a), i = false;
  }, d(a) {
    a && (v(e), v(t)), l[12](null), O(n, a), s = false, Ee(o);
  } };
}
__name(fh, "fh");
function dh(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { actions: s } = e, { editor: o } = e, a;
  o.config && o.config.template && (a = o.config.template);
  let r = o.renderedValue, c = o.options;
  function u(_ref53) {
    let { detail: T } = _ref53;
    const W = T.id;
    s.updateValue(W), s.save();
  }
  __name(u, "u");
  let f, d;
  function h(T) {
    f = T.detail.navigate, t(3, d = T.detail.keydown), f(w());
  }
  __name(h, "h");
  function m() {
    t(2, c = r ? o.options.filter((T) => T.name.toLowerCase().includes(r.toLowerCase())) : o.options), c.length ? f(-1 / 0) : f(null);
  }
  __name(m, "m");
  let _;
  ht(() => {
    _.focus();
  });
  const w = /* @__PURE__ */ __name(() => c.findIndex((T) => T.id === o.value), "w");
  function b(T) {
    be[T ? "unshift" : "push"](() => {
      _ = T, t(4, _);
    });
  }
  __name(b, "b");
  function p() {
    r = this.value, t(1, r);
  }
  __name(p, "p");
  const z = /* @__PURE__ */ __name((T) => d(T, w()), "z");
  return l.$$set = (T) => {
    "actions" in T && t(9, s = T.actions), "editor" in T && t(10, o = T.editor), "$$scope" in T && t(15, i = T.$$scope);
  }, [a, r, c, d, _, u, h, m, w, s, o, n, b, p, z, i];
}
__name(dh, "dh");
var _hh = class _hh extends ee {
  constructor(e) {
    super(), $(this, e, dh, fh, x, { actions: 9, editor: 10 });
  }
};
__name(_hh, "hh");
var hh = _hh;
function mh(l) {
  let e, t = (
    /*editor*/
    l[1].renderedValue + ""
  ), n;
  return { c() {
    e = D("span"), n = re(t), g(e, "class", "wx-text x2-1eq9nh5");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*editor*/
    2 && t !== (t = /*editor*/
    i[1].renderedValue + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(mh, "mh");
function _h(l) {
  let e, t, n;
  var i = (
    /*cell*/
    l[4]
  );
  function s(o, a) {
    return { props: { data: (
      /*value*/
      o[2]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*action_handler*/
    l[6]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a & /*cell*/
    16 && i !== (i = /*cell*/
    o[4])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*action_handler*/
        o[6]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a & /*value*/
      4 && (r.data = /*value*/
      o[2]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(_h, "_h");
function gh(l) {
  let e = (
    /*template*/
    l[3](
      /*value*/
      l[2]
    ) + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*template, value*/
    12 && e !== (e = /*template*/
    n[3](
      /*value*/
      n[2]
    ) + "") && me(t, e);
  }, i: I, o: I, d(n) {
    n && v(t);
  } };
}
__name(gh, "gh");
function wh(l) {
  let e, t, n;
  function i(o) {
    l[7](o);
  }
  __name(i, "i");
  let s = {};
  return (
    /*value*/
    l[2] !== void 0 && (s.value = /*value*/
    l[2]), e = new bo({ props: s }), be.push(() => rt(e, "value", i)), e.$on(
      "change",
      /*updateValue*/
      l[5]
    ), { c() {
      F(e.$$.fragment);
    }, m(o, a) {
      R(e, o, a), n = true;
    }, p(o, a) {
      const r = {};
      !t && a & /*value*/
      4 && (t = true, r.value = /*value*/
      o[2], dt(() => t = false)), e.$set(r);
    }, i(o) {
      n || (k(e.$$.fragment, o), n = true);
    }, o(o) {
      y(e.$$.fragment, o), n = false;
    }, d(o) {
      O(e, o);
    } }
  );
}
__name(wh, "wh");
function bh(l) {
  let e, t, n, i, s, o, a, r;
  const c = [gh, _h, mh], u = [];
  function f(d, h) {
    return (
      /*template*/
      d[3] ? 0 : (
        /*cell*/
        d[4] ? 1 : 2
      )
    );
  }
  __name(f, "f");
  return t = f(l), n = u[t] = c[t](l), s = new pn({ props: { width: "auto", $$slots: { default: [wh] }, $$scope: { ctx: l } } }), { c() {
    e = D("div"), n.c(), i = Y(), F(s.$$.fragment), g(e, "class", "wx-value x2-1eq9nh5");
  }, m(d, h) {
    S(d, e, h), u[t].m(e, null), S(d, i, h), R(s, d, h), o = true, a || (r = q(e, "click", function() {
      ot(
        /*actions*/
        l[0].cancel()
      ) && l[0].cancel().apply(this, arguments);
    }), a = true);
  }, p(d, _ref54) {
    let [h] = _ref54;
    l = d;
    let m = t;
    t = f(l), t === m ? u[t].p(l, h) : (te(), y(u[m], 1, 1, () => {
      u[m] = null;
    }), ne(), n = u[t], n ? n.p(l, h) : (n = u[t] = c[t](l), n.c()), k(n, 1), n.m(e, null));
    const _ = {};
    h & /*$$scope, value*/
    260 && (_.$$scope = { dirty: h, ctx: l }), s.$set(_);
  }, i(d) {
    o || (k(n), k(s.$$.fragment, d), o = true);
  }, o(d) {
    y(n), y(s.$$.fragment, d), o = false;
  }, d(d) {
    d && (v(e), v(i)), u[t].d(), O(s, d), a = false, r();
  } };
}
__name(bh, "bh");
function kh(l, e, t) {
  let { actions: n } = e, { editor: i } = e, s = i.value || /* @__PURE__ */ new Date(), o, a;
  function r(_ref55) {
    let { detail: f } = _ref55;
    const d = f.value;
    n.updateValue(d), n.save();
  }
  __name(r, "r");
  ht(() => {
    window.getSelection && window.getSelection().removeAllRanges();
  });
  function c(f) {
    De.call(this, l, f);
  }
  __name(c, "c");
  function u(f) {
    s = f, t(2, s);
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "actions" in f && t(0, n = f.actions), "editor" in f && t(1, i = f.editor);
  }, l.$$.update = () => {
    l.$$.dirty & /*editor*/
    2 && i.config && t(3, { template: o, cell: a } = i.config, o, (t(4, a), t(1, i)));
  }, [n, i, s, o, a, r, c, u];
}
__name(kh, "kh");
var _ph = class _ph extends ee {
  constructor(e) {
    super(), $(this, e, kh, bh, x, { actions: 0, editor: 1 });
  }
};
__name(_ph, "ph");
var ph = _ph;
var yh = /* @__PURE__ */ __name((l) => ({ option: l & /*option*/
131072 }), "yh");
var Zi = /* @__PURE__ */ __name((l) => ({ option: (
  /*option*/
  l[17]
) }), "Zi");
function vh(l) {
  let e, t = (
    /*editor*/
    l[1].renderedValue + ""
  ), n;
  return { c() {
    e = D("span"), n = re(t), g(e, "class", "wx-text x2-z4gexz");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*editor*/
    2 && t !== (t = /*editor*/
    i[1].renderedValue + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(vh, "vh");
function Sh(l) {
  let e, t, n;
  var i = (
    /*cell*/
    l[3]
  );
  function s(o, a) {
    return { props: { data: (
      /*data*/
      o[6]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*action_handler*/
    l[11]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a & /*cell*/
    8 && i !== (i = /*cell*/
    o[3])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*action_handler*/
        o[11]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a & /*data*/
      64 && (r.data = /*data*/
      o[6]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(Sh, "Sh");
function Mh(l) {
  let e = (
    /*template*/
    l[2](
      /*data*/
      l[6]
    ) + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*template, data*/
    68 && e !== (e = /*template*/
    n[2](
      /*data*/
      n[6]
    ) + "") && me(t, e);
  }, i: I, o: I, d(n) {
    n && v(t);
  } };
}
__name(Mh, "Mh");
function Th(l) {
  let e = (
    /*option*/
    l[17].name + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*option*/
    131072 && e !== (e = /*option*/
    n[17].name + "") && me(t, e);
  }, i: I, o: I, d(n) {
    n && v(t);
  } };
}
__name(Th, "Th");
function Ch(l) {
  let e, t, n;
  var i = (
    /*cell*/
    l[3]
  );
  function s(o, a) {
    return { props: { data: (
      /*option*/
      o[17]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*action_handler_1*/
    l[14]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a & /*cell*/
    8 && i !== (i = /*cell*/
    o[3])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*action_handler_1*/
        o[14]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a & /*option*/
      131072 && (r.data = /*option*/
      o[17]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(Ch, "Ch");
function Dh(l) {
  let e = (
    /*template*/
    l[2](
      /*option*/
      l[17]
    ) + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*template, option*/
    131076 && e !== (e = /*template*/
    n[2](
      /*option*/
      n[17]
    ) + "") && me(t, e);
  }, i: I, o: I, d(n) {
    n && v(t);
  } };
}
__name(Dh, "Dh");
function Wh(l) {
  let e, t, n, i;
  const s = [Dh, Ch, Th], o = [];
  function a(r, c) {
    return (
      /*template*/
      r[2] ? 0 : (
        /*cell*/
        r[3] ? 1 : 2
      )
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, c) {
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(Wh, "Wh");
function Hh(l) {
  let e;
  const t = (
    /*#slots*/
    l[10].default
  ), n = Ie(
    t,
    l,
    /*$$scope*/
    l[15],
    Zi
  ), i = n || Wh(l);
  return { c() {
    i && i.c();
  }, m(s, o) {
    i && i.m(s, o), e = true;
  }, p(s, o) {
    n ? n.p && (!e || o & /*$$scope, option*/
    163840) && Oe(
      n,
      t,
      s,
      /*$$scope*/
      s[15],
      e ? Re(
        t,
        /*$$scope*/
        s[15],
        o,
        yh
      ) : Ae(
        /*$$scope*/
        s[15]
      ),
      Zi
    ) : i && i.p && (!e || o & /*template, option, cell*/
    131084) && i.p(s, e ? o : -1);
  }, i(s) {
    e || (k(i, s), e = true);
  }, o(s) {
    y(i, s), e = false;
  }, d(s) {
    i && i.d(s);
  } };
}
__name(Hh, "Hh");
function zh(l) {
  let e, t, n, i, s, o, a, r;
  const c = [Mh, Sh, vh], u = [];
  function f(d, h) {
    return (
      /*template*/
      d[2] ? 0 : (
        /*cell*/
        d[3] ? 1 : 2
      )
    );
  }
  __name(f, "f");
  return t = f(l), n = u[t] = c[t](l), s = new fl({ props: { items: (
    /*editor*/
    l[1].options
  ), $$slots: { default: [Hh, (_ref56) => {
    let { option: d } = _ref56;
    return { 17: d };
  }, (_ref57) => {
    let { option: d } = _ref57;
    return d ? 131072 : 0;
  }] }, $$scope: { ctx: l } } }), s.$on(
    "ready",
    /*ready*/
    l[8]
  ), s.$on(
    "select",
    /*updateValue*/
    l[7]
  ), { c() {
    e = D("div"), n.c(), i = Y(), F(s.$$.fragment), g(e, "class", "wx-value x2-z4gexz"), g(e, "tabindex", "0");
  }, m(d, h) {
    S(d, e, h), u[t].m(e, null), l[12](e), S(d, i, h), R(s, d, h), o = true, a || (r = [q(e, "click", function() {
      ot(
        /*actions*/
        l[0].cancel()
      ) && l[0].cancel().apply(this, arguments);
    }), q(
      e,
      "keydown",
      /*keydown_handler*/
      l[13]
    )], a = true);
  }, p(d, _ref58) {
    let [h] = _ref58;
    l = d;
    let m = t;
    t = f(l), t === m ? u[t].p(l, h) : (te(), y(u[m], 1, 1, () => {
      u[m] = null;
    }), ne(), n = u[t], n ? n.p(l, h) : (n = u[t] = c[t](l), n.c()), k(n, 1), n.m(e, null));
    const _ = {};
    h & /*editor*/
    2 && (_.items = /*editor*/
    l[1].options), h & /*$$scope, template, option, cell*/
    163852 && (_.$$scope = { dirty: h, ctx: l }), s.$set(_);
  }, i(d) {
    o || (k(n), k(s.$$.fragment, d), o = true);
  }, o(d) {
    y(n), y(s.$$.fragment, d), o = false;
  }, d(d) {
    d && (v(e), v(i)), u[t].d(), l[12](null), O(s, d), a = false, Ee(r);
  } };
}
__name(zh, "zh");
function Nh(l, e, t) {
  let n, { $$slots: i = {}, $$scope: s } = e, { actions: o } = e, { editor: a } = e, r, c;
  function u(_ref59) {
    let { detail: T } = _ref59;
    const W = T.id;
    o.updateValue(W), o.save();
  }
  __name(u, "u");
  let f, d;
  function h(T) {
    f = T.detail.navigate, t(4, d = T.detail.keydown), f(m());
  }
  __name(h, "h");
  const m = /* @__PURE__ */ __name(() => a.options.findIndex((T) => T.id === a.value), "m");
  let _;
  ht(() => {
    _.focus(), window && window.getSelection && window.getSelection().removeAllRanges();
  });
  function w(T) {
    De.call(this, l, T);
  }
  __name(w, "w");
  function b(T) {
    be[T ? "unshift" : "push"](() => {
      _ = T, t(5, _);
    });
  }
  __name(b, "b");
  const p = /* @__PURE__ */ __name((T) => d(T, m()), "p");
  function z(T) {
    De.call(this, l, T);
  }
  __name(z, "z");
  return l.$$set = (T) => {
    "actions" in T && t(0, o = T.actions), "editor" in T && t(1, a = T.editor), "$$scope" in T && t(15, s = T.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty & /*editor*/
    2 && t(6, n = a.options.find((T) => T.id === a.value)), l.$$.dirty & /*editor*/
    2 && a.config && t(2, { template: r, cell: c } = a.config, r, (t(3, c), t(1, a)));
  }, [o, a, r, c, d, _, n, u, h, m, i, w, b, p, z, s];
}
__name(Nh, "Nh");
var _Lh = class _Lh extends ee {
  constructor(e) {
    super(), $(this, e, Nh, zh, x, { actions: 0, editor: 1 });
  }
};
__name(_Lh, "Lh");
var Lh = _Lh;
var qi = { text: sh, combo: hh, datepicker: ph, richselect: Lh };
function Eh(l) {
  let e, t, n, i, s;
  var o = qi[
    /*col*/
    l[0].editor.type
  ];
  function a(r, c) {
    return { props: { editor: (
      /*editor*/
      r[1]
    ), actions: { save: (
      /*save*/
      r[3]
    ), cancel: (
      /*cancel*/
      r[4]
    ), updateValue: (
      /*updateValue*/
      r[5]
    ) } } };
  }
  __name(a, "a");
  return o && (t = Le(o, a(l)), t.$on(
    "action",
    /*action_handler*/
    l[6]
  )), { c() {
    e = D("div"), t && F(t.$$.fragment), g(e, "class", "wx-cell x2-1hzozeb"), g(
      e,
      "style",
      /*style*/
      l[2]
    ), Q(
      e,
      "wx-shadow",
      /*col*/
      l[0].fixed === -1
    );
  }, m(r, c) {
    S(r, e, c), t && R(t, e, null), n = true, i || (s = nt(Rn.call(
      null,
      e,
      /*save*/
      l[3]
    )), i = true);
  }, p(r, _ref60) {
    let [c] = _ref60;
    if (c & /*col*/
    1 && o !== (o = qi[
      /*col*/
      r[0].editor.type
    ])) {
      if (t) {
        te();
        const u = t;
        y(u.$$.fragment, 1, 0, () => {
          O(u, 1);
        }), ne();
      }
      o ? (t = Le(o, a(r)), t.$on(
        "action",
        /*action_handler*/
        r[6]
      ), F(t.$$.fragment), k(t.$$.fragment, 1), R(t, e, null)) : t = null;
    } else if (o) {
      const u = {};
      c & /*editor*/
      2 && (u.editor = /*editor*/
      r[1]), t.$set(u);
    }
    (!n || c & /*style*/
    4) && g(
      e,
      "style",
      /*style*/
      r[2]
    ), (!n || c & /*col*/
    1) && Q(
      e,
      "wx-shadow",
      /*col*/
      r[0].fixed === -1
    );
  }, i(r) {
    n || (t && k(t.$$.fragment, r), n = true);
  }, o(r) {
    t && y(t.$$.fragment, r), n = false;
  }, d(r) {
    r && v(e), t && O(t), i = false, s();
  } };
}
__name(Eh, "Eh");
function Ih(l, e, t) {
  let { col: n } = e, { editor: i } = e;
  const s = He();
  function o() {
    s("action", { action: "close-editor", data: { ignore: false } });
  }
  __name(o, "o");
  function a() {
    s("action", { action: "close-editor", data: { ignore: true } });
  }
  __name(a, "a");
  function r(f) {
    s("action", { action: "editor", data: { value: f } });
  }
  __name(r, "r");
  let c;
  function u(f) {
    De.call(this, l, f);
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "col" in f && t(0, n = f.col), "editor" in f && t(1, i = f.editor);
  }, l.$$.update = () => {
    l.$$.dirty & /*col*/
    1 && t(2, c = Pn(n.width, n.flexgrow, n.fixed, n.left));
  }, [n, i, c, o, a, r, u];
}
__name(Ih, "Ih");
var _Rh = class _Rh extends ee {
  constructor(e) {
    super(), $(this, e, Ih, Eh, x, { col: 0, editor: 1 });
  }
};
__name(_Rh, "Rh");
var Rh = _Rh;
function Ki(l, e, t) {
  const n = l.slice();
  return n[89] = e[t], n;
}
__name(Ki, "Ki");
function Gi(l, e, t) {
  const n = l.slice();
  return n[92] = e[t], n;
}
__name(Gi, "Gi");
function Xi(l) {
  let e, t, n;
  return t = new ir({ props: { contentWidth: (
    /*contentWidth*/
    l[11]
  ), deltaLeft: (
    /*deltaLeftH*/
    l[23]
  ), rowHeights: (
    /*$_sizes*/
    l[18].headerRowHeights
  ), columns: (
    /*renderColumnsH*/
    l[21]
  ), columnStyle: (
    /*columnStyle*/
    l[5]
  ) } }), t.$on(
    "action",
    /*action_handler*/
    l[69]
  ), { c() {
    e = D("div"), F(t.$$.fragment), g(e, "class", "wx-header-wrapper x2-1rhm7gj");
  }, m(i, s) {
    S(i, e, s), R(t, e, null), n = true;
  }, p(i, s) {
    const o = {};
    s[0] & /*contentWidth*/
    2048 && (o.contentWidth = /*contentWidth*/
    i[11]), s[0] & /*deltaLeftH*/
    8388608 && (o.deltaLeft = /*deltaLeftH*/
    i[23]), s[0] & /*$_sizes*/
    262144 && (o.rowHeights = /*$_sizes*/
    i[18].headerRowHeights), s[0] & /*renderColumnsH*/
    2097152 && (o.columns = /*renderColumnsH*/
    i[21]), s[0] & /*columnStyle*/
    32 && (o.columnStyle = /*columnStyle*/
    i[5]), t.$set(o);
  }, i(i) {
    n || (k(t.$$.fragment, i), n = true);
  }, o(i) {
    y(t.$$.fragment, i), n = false;
  }, d(i) {
    i && v(e), O(t);
  } };
}
__name(Xi, "Xi");
function Vi(l) {
  let e, t;
  return e = new nh({ props: { overlay: (
    /*overlay*/
    l[3]
  ) } }), e.$on(
    "action",
    /*action_handler_1*/
    l[70]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*overlay*/
    8 && (s.overlay = /*overlay*/
    n[3]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Vi, "Vi");
function Oh(l) {
  let e, t;
  return e = new vl({ props: { row: (
    /*row*/
    l[89]
  ), col: (
    /*col*/
    l[92]
  ), columnStyle: (
    /*columnStyle*/
    l[5]
  ), cellStyle: (
    /*cellStyle*/
    l[6]
  ) } }), e.$on(
    "action",
    /*action_handler_4*/
    l[73]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*renderRows*/
    524288 && (s.row = /*row*/
    n[89]), i[0] & /*renderColumns*/
    1048576 && (s.col = /*col*/
    n[92]), i[0] & /*columnStyle*/
    32 && (s.columnStyle = /*columnStyle*/
    n[5]), i[0] & /*cellStyle*/
    64 && (s.cellStyle = /*cellStyle*/
    n[6]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Oh, "Oh");
function Ah(l) {
  let e, t, n;
  var i = (
    /*col*/
    l[92].cell
  );
  function s(o, a) {
    return { props: { api: (
      /*api*/
      o[0]
    ), row: (
      /*row*/
      o[89]
    ), col: (
      /*col*/
      o[92]
    ), columnStyle: (
      /*columnStyle*/
      o[5]
    ), cellStyle: (
      /*cellStyle*/
      o[6]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*action_handler_3*/
    l[72]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a[0] & /*renderColumns*/
    1048576 && i !== (i = /*col*/
    o[92].cell)) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*action_handler_3*/
        o[72]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a[0] & /*api*/
      1 && (r.api = /*api*/
      o[0]), a[0] & /*renderRows*/
      524288 && (r.row = /*row*/
      o[89]), a[0] & /*renderColumns*/
      1048576 && (r.col = /*col*/
      o[92]), a[0] & /*columnStyle*/
      32 && (r.columnStyle = /*columnStyle*/
      o[5]), a[0] & /*cellStyle*/
      64 && (r.cellStyle = /*cellStyle*/
      o[6]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(Ah, "Ah");
function Fh(l) {
  let e, t;
  return e = new Rh({ props: { editor: (
    /*$editor*/
    l[16]
  ), col: (
    /*col*/
    l[92]
  ) } }), e.$on(
    "action",
    /*action_handler_2*/
    l[71]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*$editor*/
    65536 && (s.editor = /*$editor*/
    n[16]), i[0] & /*renderColumns*/
    1048576 && (s.col = /*col*/
    n[92]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Fh, "Fh");
function Ph(l) {
  let e;
  return { c() {
    e = D("div"), g(e, "class", "wx-cell wx-collapsed x2-1rhm7gj");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(Ph, "Ph");
function Ui(l, e) {
  let t, n, i, s, o;
  const a = [Ph, Fh, Ah, Oh], r = [];
  function c(u, f) {
    return (
      /*col*/
      u[92].collapsed ? 0 : (
        /*$editor*/
        u[16]?.id === /*row*/
        u[89].id && /*$editor*/
        u[16].column == /*col*/
        u[92].id ? 1 : (
          /*col*/
          u[92].cell ? 2 : 3
        )
      )
    );
  }
  __name(c, "c");
  return n = c(e), i = r[n] = a[n](e), { key: l, first: null, c() {
    t = se(), i.c(), s = se(), this.first = t;
  }, m(u, f) {
    S(u, t, f), r[n].m(u, f), S(u, s, f), o = true;
  }, p(u, f) {
    e = u;
    let d = n;
    n = c(e), n === d ? r[n].p(e, f) : (te(), y(r[d], 1, 1, () => {
      r[d] = null;
    }), ne(), i = r[n], i ? i.p(e, f) : (i = r[n] = a[n](e), i.c()), k(i, 1), i.m(s.parentNode, s));
  }, i(u) {
    o || (k(i), o = true);
  }, o(u) {
    y(i), o = false;
  }, d(u) {
    u && (v(t), v(s)), r[n].d(u);
  } };
}
__name(Ui, "Ui");
function Ji(l, e) {
  let t, n = [], i = /* @__PURE__ */ new Map(), s, o, a, r, c, u, f = de(
    /*renderColumns*/
    e[20]
  );
  const d = /* @__PURE__ */ __name((h) => (
    /*col*/
    h[92].id
  ), "d");
  for (let h = 0; h < f.length; h += 1) {
    let m = Gi(e, f, h), _ = d(m);
    i.set(_, n[h] = Ui(_, m));
  }
  return { key: l, first: null, c() {
    t = D("div");
    for (let h = 0; h < n.length; h += 1) n[h].c();
    s = Y(), g(t, "class", o = Ve("wx-row" + /*rowStyle*/
    (e[4] ? " " + /*rowStyle*/
    e[4](
      /*row*/
      e[89]
    ) : "")) + " x2-1rhm7gj"), g(t, "data-id", a = /*row*/
    e[89].id), g(t, "data-context-id", r = /*row*/
    e[89].id), g(t, "style", c = `${/*autoRowHeight*/
    e[7] ? "min-height" : "height"}:${/*defaultRowHeight*/
    e[15]}px;`), Q(
      t,
      "wx-autoheight",
      /*autoRowHeight*/
      e[7]
    ), Q(
      t,
      "wx-selected",
      /*$selectedRows*/
      e[29].indexOf(
        /*row*/
        e[89].id
      ) !== -1
    ), this.first = t;
  }, m(h, m) {
    S(h, t, m);
    for (let _ = 0; _ < n.length; _ += 1) n[_] && n[_].m(t, null);
    H(t, s), u = true;
  }, p(h, m) {
    e = h, m[0] & /*renderColumns, $editor, renderRows, api, columnStyle, cellStyle*/
    1638497 && (f = de(
      /*renderColumns*/
      e[20]
    ), te(), n = kt(n, m, d, 1, e, f, i, t, en, Ui, s, Gi), ne()), (!u || m[0] & /*rowStyle, renderRows*/
    524304 && o !== (o = Ve("wx-row" + /*rowStyle*/
    (e[4] ? " " + /*rowStyle*/
    e[4](
      /*row*/
      e[89]
    ) : "")) + " x2-1rhm7gj")) && g(t, "class", o), (!u || m[0] & /*renderRows*/
    524288 && a !== (a = /*row*/
    e[89].id)) && g(t, "data-id", a), (!u || m[0] & /*renderRows*/
    524288 && r !== (r = /*row*/
    e[89].id)) && g(t, "data-context-id", r), (!u || m[0] & /*autoRowHeight, defaultRowHeight*/
    32896 && c !== (c = `${/*autoRowHeight*/
    e[7] ? "min-height" : "height"}:${/*defaultRowHeight*/
    e[15]}px;`)) && g(t, "style", c), (!u || m[0] & /*rowStyle, renderRows, autoRowHeight*/
    524432) && Q(
      t,
      "wx-autoheight",
      /*autoRowHeight*/
      e[7]
    ), (!u || m[0] & /*rowStyle, renderRows, $selectedRows, renderRows*/
    537395216) && Q(
      t,
      "wx-selected",
      /*$selectedRows*/
      e[29].indexOf(
        /*row*/
        e[89].id
      ) !== -1
    );
  }, i(h) {
    if (!u) {
      for (let m = 0; m < f.length; m += 1) k(n[m]);
      u = true;
    }
  }, o(h) {
    for (let m = 0; m < n.length; m += 1) y(n[m]);
    u = false;
  }, d(h) {
    h && v(t);
    for (let m = 0; m < n.length; m += 1) n[m].d();
  } };
}
__name(Ji, "Ji");
function Qi(l) {
  let e, t;
  return e = new ir({ props: { type: "footer", contentWidth: (
    /*contentWidth*/
    l[11]
  ), deltaLeft: (
    /*deltaLeftF*/
    l[24]
  ), rowHeights: (
    /*$_sizes*/
    l[18].footerRowHeights
  ), columns: (
    /*renderColumnsF*/
    l[22]
  ), columnStyle: (
    /*columnStyle*/
    l[5]
  ) } }), e.$on(
    "action",
    /*action_handler_5*/
    l[76]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*contentWidth*/
    2048 && (s.contentWidth = /*contentWidth*/
    n[11]), i[0] & /*deltaLeftF*/
    16777216 && (s.deltaLeft = /*deltaLeftF*/
    n[24]), i[0] & /*$_sizes*/
    262144 && (s.rowHeights = /*$_sizes*/
    n[18].footerRowHeights), i[0] & /*renderColumnsF*/
    4194304 && (s.columns = /*renderColumnsF*/
    n[22]), i[0] & /*columnStyle*/
    32 && (s.columnStyle = /*columnStyle*/
    n[5]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Qi, "Qi");
function Yh(l) {
  let e, t, n, i, s, o, a, r = [], c = /* @__PURE__ */ new Map(), u, f, d, h, m, _, w, b = (
    /*header*/
    l[1] && Xi(l)
  ), p = (
    /*overlay*/
    l[3] && Vi(l)
  ), z = de(
    /*renderRows*/
    l[19]
  );
  const T = /* @__PURE__ */ __name((M) => (
    /*row*/
    M[89].id
  ), "T");
  for (let M = 0; M < z.length; M += 1) {
    let C = Ki(l, z, M), P = T(C);
    c.set(P, r[M] = Ji(P, C));
  }
  let W = (
    /*footer*/
    l[2] && /*$data*/
    l[17].length && Qi(l)
  );
  return { c() {
    e = D("div"), t = D("div"), n = D("div"), b && b.c(), i = Y(), s = D("div"), p && p.c(), o = Y(), a = D("div");
    for (let M = 0; M < r.length; M += 1) r[M].c();
    u = Y(), W && W.c(), g(a, "class", "wx-data x2-1rhm7gj"), j(
      a,
      "padding-top",
      /*deltaTop*/
      l[13] + "px"
    ), j(
      a,
      "padding-left",
      /*deltaLeft*/
      l[14] + "px"
    ), g(s, "class", "wx-body x2-1rhm7gj"), j(
      s,
      "width",
      /*contentWidth*/
      l[11] + "px"
    ), j(
      s,
      "height",
      /*fullHeight*/
      l[9] + "px"
    ), g(n, "class", "wx-scroll x2-1rhm7gj"), g(t, "class", "wx-table-box x2-1rhm7gj"), g(
      t,
      "style",
      /*style*/
      l[28]
    ), g(t, "tabindex", "0"), Q(
      t,
      "wx-active",
      /*activeTable*/
      l[27]
    ), g(e, "class", "wx-grid x2-1rhm7gj"), j(
      e,
      "--header-height",
      /*header*/
      (l[1] ? (
        /*$_sizes*/
        l[18].headerHeight
      ) : 0) + "px"
    ), j(
      e,
      "--footer-height",
      /*footer*/
      (l[2] ? (
        /*$_sizes*/
        l[18].footerHeight
      ) : 0) + "px"
    ), j(
      e,
      "--split-left-width",
      /*leftWidth*/
      l[10] + "px"
    );
  }, m(M, C) {
    S(M, e, C), H(e, t), H(t, n), b && b.m(n, null), H(n, i), H(n, s), p && p.m(s, null), H(s, o), H(s, a);
    for (let P = 0; P < r.length; P += 1) r[P] && r[P].m(a, null);
    l[74](a), H(n, u), W && W.m(n, null), l[79](t), m = true, _ || (w = [q(
      s,
      "mousedown",
      /*mousedown_handler*/
      l[75]
    ), nt(In.call(
      null,
      s,
      /*bodyClickHandlers*/
      l[42]
    )), q(
      n,
      "scroll",
      /*onScroll*/
      l[39]
    ), nt(f = zd.call(null, n, { scroll: (
      /*scroll*/
      l[38]
    ), getWidth: (
      /*scrollTo_function*/
      l[77]
    ), getHeight: (
      /*scrollTo_function_1*/
      l[78]
    ) })), nt(d = Rn.call(
      null,
      t,
      /*clickOutside_function*/
      l[80]
    )), q(
      t,
      "click",
      /*click_handler*/
      l[81]
    ), nt(Nd.call(
      null,
      t,
      /*resize*/
      l[40]
    )), nt(h = Hd.call(null, t, { keys: { tab: true, "shift+tab": true, arrowup: true, arrowdown: true, escape: true, f2: true }, exec: (
      /*hotkeys_function*/
      l[82]
    ) }))], _ = true);
  }, p(M, C) {
    M[1] ? b ? (b.p(M, C), C[0] & /*header*/
    2 && k(b, 1)) : (b = Xi(M), b.c(), k(b, 1), b.m(n, i)) : b && (te(), y(b, 1, 1, () => {
      b = null;
    }), ne()), /*overlay*/
    M[3] ? p ? (p.p(M, C), C[0] & /*overlay*/
    8 && k(p, 1)) : (p = Vi(M), p.c(), k(p, 1), p.m(s, o)) : p && (te(), y(p, 1, 1, () => {
      p = null;
    }), ne()), C[0] & /*rowStyle, renderRows, autoRowHeight, defaultRowHeight, $selectedRows, renderColumns, $editor, api, columnStyle, cellStyle*/
    538542321 && (z = de(
      /*renderRows*/
      M[19]
    ), te(), r = kt(r, C, T, 1, M, z, c, a, en, Ji, null, Ki), ne()), (!m || C[0] & /*deltaTop*/
    8192) && j(
      a,
      "padding-top",
      /*deltaTop*/
      M[13] + "px"
    ), (!m || C[0] & /*deltaLeft*/
    16384) && j(
      a,
      "padding-left",
      /*deltaLeft*/
      M[14] + "px"
    ), (!m || C[0] & /*contentWidth*/
    2048) && j(
      s,
      "width",
      /*contentWidth*/
      M[11] + "px"
    ), (!m || C[0] & /*fullHeight*/
    512) && j(
      s,
      "height",
      /*fullHeight*/
      M[9] + "px"
    ), /*footer*/
    M[2] && /*$data*/
    M[17].length ? W ? (W.p(M, C), C[0] & /*footer, $data*/
    131076 && k(W, 1)) : (W = Qi(M), W.c(), k(W, 1), W.m(n, null)) : W && (te(), y(W, 1, 1, () => {
      W = null;
    }), ne()), f && ot(f.update) && C[0] & /*clientWidth, visibleRowsHeight*/
    4352 && f.update.call(null, { scroll: (
      /*scroll*/
      M[38]
    ), getWidth: (
      /*scrollTo_function*/
      M[77]
    ), getHeight: (
      /*scrollTo_function_1*/
      M[78]
    ) }), (!m || C[0] & /*style*/
    268435456) && g(
      t,
      "style",
      /*style*/
      M[28]
    ), d && ot(d.update) && C[0] & /*activeTable*/
    134217728 && d.update.call(
      null,
      /*clickOutside_function*/
      M[80]
    ), h && ot(h.update) && C[0] & /*api*/
    1 && h.update.call(null, { keys: { tab: true, "shift+tab": true, arrowup: true, arrowdown: true, escape: true, f2: true }, exec: (
      /*hotkeys_function*/
      M[82]
    ) }), (!m || C[0] & /*activeTable*/
    134217728) && Q(
      t,
      "wx-active",
      /*activeTable*/
      M[27]
    ), (!m || C[0] & /*header, $_sizes*/
    262146) && j(
      e,
      "--header-height",
      /*header*/
      (M[1] ? (
        /*$_sizes*/
        M[18].headerHeight
      ) : 0) + "px"
    ), (!m || C[0] & /*footer, $_sizes*/
    262148) && j(
      e,
      "--footer-height",
      /*footer*/
      (M[2] ? (
        /*$_sizes*/
        M[18].footerHeight
      ) : 0) + "px"
    ), (!m || C[0] & /*leftWidth*/
    1024) && j(
      e,
      "--split-left-width",
      /*leftWidth*/
      M[10] + "px"
    );
  }, i(M) {
    if (!m) {
      k(b), k(p);
      for (let C = 0; C < z.length; C += 1) k(r[C]);
      k(W), m = true;
    }
  }, o(M) {
    y(b), y(p);
    for (let C = 0; C < r.length; C += 1) y(r[C]);
    y(W), m = false;
  }, d(M) {
    M && v(e), b && b.d(), p && p.d();
    for (let C = 0; C < r.length; C += 1) r[C].d();
    l[74](null), W && W.d(), l[79](null), _ = false, Ee(w);
  } };
}
__name(Yh, "Yh");
var Mn = 2;
var Bh = 1;
function jh() {
  const l = document.createElement("div");
  l.style.cssText = "position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;min-height:100px;overflow-y:scroll;", document.body.appendChild(l);
  const e = l.offsetWidth - l.clientWidth;
  return document.body.removeChild(l), e;
}
__name(jh, "jh");
function Zh(l, e, t) {
  let n, i, s, o, a, r, c, u, f, d;
  const h = He(), m = jh();
  let { store: _ } = e, { api: w } = e, { header: b } = e, { footer: p } = e, { overlay: z } = e, { select: T } = e, { multiselect: W } = e, { rowStyle: M } = e, { columnStyle: C } = e, { cellStyle: P } = e, { autoRowHeight: X } = e;
  const { dynamic: A, flatData: B, _columns: V, split: fe, _sizes: L, selectedRows: Ye, editor: G, filter: pe, scroll: Se } = _.getReactive();
  ce(l, A, (N) => t(66, r = N)), ce(l, B, (N) => t(17, a = N)), ce(l, V, (N) => t(67, u = N)), ce(l, fe, (N) => t(68, f = N)), ce(l, L, (N) => t(18, c = N)), ce(l, Ye, (N) => t(29, d = N)), ce(l, G, (N) => t(16, s = N)), ce(l, pe, (N) => t(65, o = N));
  let K = 0, ue = 0, Ne, ye = [], ve = [], Ze = 0, ie, U, ge, Me, Fe = false, Je = false, J, oe, we = { row: { start: 0, end: 0 } }, E = 0, le = [], _e = 0, ke = 0, Pe = [], Be = [], je = [], Xe = 0, it = 0, pt = 0, mt, nn, At, Wt, Ft = 0, Ht = 0;
  function Z(N) {
    t(62, Ht = N.target.scrollTop), t(61, Ft = N.target.scrollLeft);
  }
  __name(Z, "Z");
  function ae(N) {
    t(8, K = N.width), t(46, ue = N.height);
  }
  __name(ae, "ae");
  function Te(N) {
    N.shiftKey && N.preventDefault(), Pt.focus();
  }
  __name(Te, "Te");
  const at = { dblclick: /* @__PURE__ */ __name((N, Ke) => {
    const Ge = { id: N, column: Or(Ke, "data-col-id") };
    h("action", { action: "open-editor", data: Ge });
  }, "dblclick"), click: /* @__PURE__ */ __name((N, Ke) => {
    if (T === false) return;
    const Ge = W && Ke.ctrlKey, et = W && Ke.shiftKey;
    h("action", { action: "select-row", data: { id: N, toggle: Ge, range: et } });
  }, "click"), "toggle-row": /* @__PURE__ */ __name((N) => {
    const Ke = _.getRow(N);
    h("action", { action: Ke.open ? "close-row" : "open-row", data: { id: N } });
  }, "toggle-row"), "ignore-click": /* @__PURE__ */ __name(() => false, "ignore-click") };
  function ct(N, Ke, Ge) {
    let et = Ke, yt = N;
    if (ve.length) {
      let gt = ve.length;
      for (let tt = N; tt >= 0; tt--) ve[tt][Ge].forEach((sn) => {
        sn.colspan > 1 && tt > N - sn.colspan && tt < gt && (gt = tt);
      });
      if (gt !== ve.length && gt < N) {
        for (let tt = gt; tt < N; tt++) et -= ve[tt].width;
        yt = gt;
      }
    }
    return { index: yt, delta: et };
  }
  __name(ct, "ct");
  let _t, ut = [], zt = 0;
  function dr() {
    let N = 0, Ke = _e;
    _t.childNodes.forEach((Ge, et) => {
      t(63, ut[_e + et] = Ge.offsetHeight, ut), N += Ge.offsetHeight, Ke++;
    }), t(64, zt = N), t(56, ke = Ke);
  }
  __name(dr, "dr");
  X && kn(() => {
    dr();
  });
  let Pt;
  const hr = /* @__PURE__ */ __name((N) => {
    !N && Pt ? (Pt.focus(), t(27, ln = true)) : t(27, ln = null);
  }, "hr");
  let ln = null;
  function mr(N) {
    De.call(this, l, N);
  }
  __name(mr, "mr");
  function _r(N) {
    De.call(this, l, N);
  }
  __name(_r, "_r");
  function gr(N) {
    De.call(this, l, N);
  }
  __name(gr, "gr");
  function wr(N) {
    De.call(this, l, N);
  }
  __name(wr, "wr");
  function br(N) {
    De.call(this, l, N);
  }
  __name(br, "br");
  function kr(N) {
    be[N ? "unshift" : "push"](() => {
      _t = N, t(25, _t);
    });
  }
  __name(kr, "kr");
  const pr = /* @__PURE__ */ __name((N) => Te(N), "pr");
  function yr(N) {
    De.call(this, l, N);
  }
  __name(yr, "yr");
  const vr = /* @__PURE__ */ __name(() => K, "vr"), Sr = /* @__PURE__ */ __name(() => oe, "Sr");
  function Mr(N) {
    be[N ? "unshift" : "push"](() => {
      Pt = N, t(26, Pt);
    });
  }
  __name(Mr, "Mr");
  const Tr = /* @__PURE__ */ __name(() => t(27, ln = null), "Tr"), Cr = /* @__PURE__ */ __name(() => t(27, ln = true), "Cr"), Dr = /* @__PURE__ */ __name((N) => w.exec("hotkey", N), "Dr");
  return l.$$set = (N) => {
    "store" in N && t(43, _ = N.store), "api" in N && t(0, w = N.api), "header" in N && t(1, b = N.header), "footer" in N && t(2, p = N.footer), "overlay" in N && t(3, z = N.overlay), "select" in N && t(44, T = N.select), "multiselect" in N && t(45, W = N.multiselect), "rowStyle" in N && t(4, M = N.rowStyle), "columnStyle" in N && t(5, C = N.columnStyle), "cellStyle" in N && t(6, P = N.cellStyle), "autoRowHeight" in N && t(7, X = N.autoRowHeight);
  }, l.$$.update = () => {
    if (l.$$.dirty[0] & /*$_sizes*/
    262144 && t(15, n = c.rowHeight), l.$$.dirty[1] & /*hasAny, fullWidth*/
    786432 | l.$$.dirty[2] & /*$_columns*/
    32 && (t(49, ie = false), t(50, U = 0), u.forEach((N) => {
      N.hidden || (N.flexgrow && t(49, ie = ie || N.flexgrow), t(50, U += N.width));
    }), t(11, Me = U)), l.$$.dirty[0] & /*clientWidth*/
    256 | l.$$.dirty[1] & /*clientHeight, fullWidth*/
    557056 && t(53, Je = K && ue ? U > K : false), l.$$.dirty[0] & /*header, $_sizes, footer, visibleRowsHeight, defaultRowHeight*/
    299014 | l.$$.dirty[1] & /*clientHeight, hasHScroll*/
    4227072 && (t(12, oe = ue - (b ? c.headerHeight : 0) - (p ? c.footerHeight : 0) - (Je ? m : 0)), t(54, J = Math.ceil(oe / n) + 1)), l.$$.dirty[0] & /*autoRowHeight, defaultRowHeight, deltaTop, $data*/
    172160 | l.$$.dirty[1] & /*visibleRows, requestData*/
    25165824 | l.$$.dirty[2] & /*scrollTop, rowHeights, $dynamic*/
    19) {
      let N = 0;
      if (X) {
        let Ge = Ht;
        for (; Ge > 0; ) Ge -= ut[N] || n, N++;
        t(13, E = Ht - Ge);
        for (let et = Math.max(0, N - Mn - 1); et < N; et++) t(13, E -= ut[N - et] || n);
        N = Math.max(0, N - Mn);
      } else N = Math.floor(Ht / n), N = Math.max(0, N - Mn), t(13, E = N * n);
      const Ke = Math.min(r ? r.rowsCount : a.length, N + J + Mn);
      (N != we.row.start || Ke != we.row.end) && (t(55, we = { row: { start: N, end: Ke } }), r && h("data-request", { requestData: we }));
    }
    if (l.$$.dirty[0] & /*$data, defaultRowHeight, autoRowHeight, deltaTop*/
    172160 | l.$$.dirty[1] & /*renderEnd*/
    33554432 | l.$$.dirty[2] & /*$dynamic, renderedHeight*/
    20) {
      const N = r ? r.rowsCount : a.length, Ke = N * n;
      X ? t(9, Ne = zt + E + (N - ke) * n) : t(9, Ne = Ke);
    }
    if (l.$$.dirty[0] & /*leftWidth*/
    1024 | l.$$.dirty[1] & /*leftColumns, centerColumns*/
    196608 | l.$$.dirty[2] & /*$_columns, $split*/
    96 && (t(47, ye = u.slice(0, f.left).filter((N) => !N.hidden)), t(10, Ze = 0), ye.forEach((N) => {
      N.fixed = 1, N.left = Ze, t(10, Ze += N.width);
    }), ye.length && t(47, ye[ye.length - 1].fixed = -1, ye), t(48, ve = u.slice(f.left).filter((N) => !N.hidden)), ve.forEach((N) => {
      N.fixed = 0;
    })), l.$$.dirty[0] & /*clientWidth, fullHeight*/
    768 | l.$$.dirty[1] & /*clientHeight*/
    32768 && t(52, Fe = K && ue ? Ne > ue : false), l.$$.dirty[0] & /*clientWidth, contentWidth*/
    2304 | l.$$.dirty[1] & /*hasAny, fullWidth, hasVScroll*/
    2883584 && (ie && U <= K ? (t(51, ge = t(11, Me = K)), t(11, Me -= Fe ? m : 0)) : Me < K ? t(51, ge = U + (Fe ? m : 0)) : t(51, ge = -1)), l.$$.dirty[0] & /*$data*/
    131072 | l.$$.dirty[1] & /*requestData*/
    16777216 | l.$$.dirty[2] & /*$dynamic, $filter*/
    24) {
      if (r) t(19, le = a);
      else {
        let N = a;
        o && (N = N.filter(o)), t(19, le = N.slice(we.row.start, we.row.end));
      }
      _e = we?.row.start;
    }
    if (l.$$.dirty[0] & /*clientWidth, deltaLeft*/
    16640 | l.$$.dirty[1] & /*scrollLeft, centerColumns*/
    1073872896) {
      const N = Ft, Ke = Ft + K;
      let Ge = 0, et = 0, yt = 0;
      t(14, Xe = t(23, it = t(24, pt = 0))), ve.forEach((Ml, sn) => {
        N > yt && (Ge = sn, t(14, Xe = t(23, it = t(24, pt = yt)))), yt = yt + Ml.width, Ke > yt && (et = sn + Bh);
      });
      const gt = ct(Ge, Xe, "header"), tt = ct(Ge, Xe, "footer");
      t(23, it = gt.delta), t(58, nn = gt.index), t(24, pt = tt.delta), t(59, At = tt.index), t(57, mt = Ge), t(60, Wt = et);
    }
    l.$$.dirty[0] & /*clientWidth*/
    256 | l.$$.dirty[1] & /*hasAny, fullWidth, leftColumns, centerColumns, cs, ce, csH, csF*/
    1007616e3 && (ie && U > K ? t(20, Pe = t(21, Be = t(22, je = [...ye, ...ve]))) : (t(20, Pe = [...ye, ...ve.slice(mt, Wt + 1)]), t(21, Be = [...ye, ...ve.slice(nn, Wt + 1)]), t(22, je = [...ye, ...ve.slice(At, Wt + 1)]))), l.$$.dirty[1] & /*globalWidth*/
    1048576 && t(28, i = ge ? `width:${ge}px;` : ""), l.$$.dirty[0] & /*$editor*/
    65536 && hr(s);
  }, [w, b, p, z, M, C, P, X, K, Ne, Ze, Me, oe, E, Xe, n, s, a, c, le, Pe, Be, je, it, pt, _t, Pt, ln, i, d, A, B, V, fe, L, Ye, G, pe, Se, Z, ae, Te, at, _, T, W, ue, ye, ve, ie, U, ge, Fe, Je, J, we, ke, mt, nn, At, Wt, Ft, Ht, ut, zt, o, r, u, f, mr, _r, gr, wr, br, kr, pr, yr, vr, Sr, Mr, Tr, Cr, Dr];
}
__name(Zh, "Zh");
var _a5;
var qh = (_a5 = class extends ee {
  constructor(e) {
    super(), $(this, e, Zh, Yh, x, { store: 43, api: 0, header: 1, footer: 2, overlay: 3, select: 44, multiselect: 45, rowStyle: 4, columnStyle: 5, cellStyle: 6, autoRowHeight: 7 }, null, [-1, -1, -1, -1]);
  }
}, __name(_a5, "qh"), _a5);
function Kh(l) {
  let e, t;
  return e = new qh({ props: { store: (
    /*dataStore*/
    l[10]
  ), api: (
    /*api*/
    l[9]
  ), header: (
    /*header*/
    l[5]
  ), footer: (
    /*footer*/
    l[6]
  ), overlay: (
    /*overlay*/
    l[7]
  ), rowStyle: (
    /*rowStyle*/
    l[0]
  ), columnStyle: (
    /*columnStyle*/
    l[1]
  ), cellStyle: (
    /*cellStyle*/
    l[2]
  ), select: (
    /*select*/
    l[3]
  ), multiselect: (
    /*multiselect*/
    l[4]
  ), autoRowHeight: (
    /*autoRowHeight*/
    l[8]
  ) } }), e.$on(
    "action",
    /*actions*/
    l[11]
  ), e.$on(
    "data-request",
    /*data_request_handler*/
    l[25]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*header*/
    32 && (s.header = /*header*/
    n[5]), i & /*footer*/
    64 && (s.footer = /*footer*/
    n[6]), i & /*overlay*/
    128 && (s.overlay = /*overlay*/
    n[7]), i & /*rowStyle*/
    1 && (s.rowStyle = /*rowStyle*/
    n[0]), i & /*columnStyle*/
    2 && (s.columnStyle = /*columnStyle*/
    n[1]), i & /*cellStyle*/
    4 && (s.cellStyle = /*cellStyle*/
    n[2]), i & /*select*/
    8 && (s.select = /*select*/
    n[3]), i & /*multiselect*/
    16 && (s.multiselect = /*multiselect*/
    n[4]), i & /*autoRowHeight*/
    256 && (s.autoRowHeight = /*autoRowHeight*/
    n[8]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Kh, "Kh");
function Gh(l) {
  let e, t;
  return e = new Mo({ props: { words: fd, optional: true, $$slots: { default: [Kh] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref61) {
    let [i] = _ref61;
    const s = {};
    i & /*$$scope, header, footer, overlay, rowStyle, columnStyle, cellStyle, select, multiselect, autoRowHeight*/
    536871423 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Gh, "Gh");
function Xh(l, e, t) {
  let n;
  const i = He();
  let { data: s = [] } = e, { columns: o = [] } = e, { rowStyle: a = null } = e, { columnStyle: r = null } = e, { cellStyle: c = null } = e, { selected: u = null } = e, { selectedRows: f = [] } = e, { select: d = true } = e, { multiselect: h = false } = e, { header: m = true } = e, { footer: _ = false } = e, { dynamic: w = null } = e, { editor: b = null } = e, { filter: p = null } = e, { overlay: z = null } = e, { autoRowHeight: T = false } = e, { sizes: W = {} } = e, { split: M = { left: 0 } } = e, { tree: C = false } = e, { autoConfig: P = false } = e, { init: X = null } = e;
  const A = new Dd(cl);
  let B = A.in, V = new To(i);
  B.setNext(V);
  const fe = /* @__PURE__ */ __name((G) => {
    B.exec(G.detail.action, G.detail.data);
  }, "fe"), L = {
    // state
    getState: A.getState.bind(A),
    getReactiveState: A.getReactive.bind(A),
    getStores: /* @__PURE__ */ __name(() => ({ data: A }), "getStores"),
    // events
    exec: B.exec,
    setNext: /* @__PURE__ */ __name((G) => V = V.setNext(G), "setNext"),
    intercept: B.intercept.bind(B),
    on: B.on.bind(B),
    detach: B.detach.bind(B),
    // extra api
    getRow: /* @__PURE__ */ __name((G) => A.getRow(G), "getRow"),
    getColumn: /* @__PURE__ */ __name((G) => A.getColumn(G), "getColumn")
  };
  function Ye(G) {
    De.call(this, l, G);
  }
  __name(Ye, "Ye");
  return l.$$set = (G) => {
    "data" in G && t(14, s = G.data), "columns" in G && t(15, o = G.columns), "rowStyle" in G && t(0, a = G.rowStyle), "columnStyle" in G && t(1, r = G.columnStyle), "cellStyle" in G && t(2, c = G.cellStyle), "selected" in G && t(12, u = G.selected), "selectedRows" in G && t(16, f = G.selectedRows), "select" in G && t(3, d = G.select), "multiselect" in G && t(4, h = G.multiselect), "header" in G && t(5, m = G.header), "footer" in G && t(6, _ = G.footer), "dynamic" in G && t(17, w = G.dynamic), "editor" in G && t(18, b = G.editor), "filter" in G && t(19, p = G.filter), "overlay" in G && t(7, z = G.overlay), "autoRowHeight" in G && t(8, T = G.autoRowHeight), "sizes" in G && t(20, W = G.sizes), "split" in G && t(21, M = G.split), "tree" in G && t(22, C = G.tree), "autoConfig" in G && t(23, P = G.autoConfig), "init" in G && t(13, X = G.init);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*autoConfig, columns, data*/
    8437760 && P && !o.length && s.length) {
      const G = s[0];
      for (let pe in G) if (pe != "id" && pe[0] != "$") {
        let Se = { id: pe, header: pe[0].toUpperCase() + pe.substr(1) };
        typeof P == "object" && (Se = { ...Se, ...P }), o.push(Se);
      }
    }
    l.$$.dirty & /*selectedRows, selected*/
    69632 && (f.length ? t(12, u = f[0]) : u && f.push(u)), l.$$.dirty & /*data, editor, columns, split, sizes, selected, selectedRows, dynamic, filter, tree, _skin, init*/
    25161728 && (A.init({ data: s, editor: b, columns: o, split: M, sizes: W, selected: u, selectedRows: f, dynamic: w, filter: p, tree: C, _skin: n }), X && (X(L), t(13, X = null)));
  }, t(24, n = ze("wx-theme")), [a, r, c, d, h, m, _, z, T, L, A, fe, u, X, s, o, f, w, b, p, W, M, C, P, n, Ye];
}
__name(Xh, "Xh");
var _Vh = class _Vh extends ee {
  constructor(e) {
    super(), $(this, e, Xh, Gh, x, { data: 14, columns: 15, rowStyle: 0, columnStyle: 1, cellStyle: 2, selected: 12, selectedRows: 16, select: 3, multiselect: 4, header: 5, footer: 6, dynamic: 17, editor: 18, filter: 19, overlay: 7, autoRowHeight: 8, sizes: 20, split: 21, tree: 22, autoConfig: 23, init: 13, api: 9 });
  }
  get api() {
    return this.$$.ctx[9];
  }
};
__name(_Vh, "Vh");
var Vh = _Vh;
function sr(l, e) {
  l.forEach((t) => {
    e(t), t.data && t.data.length && sr(t.data, e);
  });
}
__name(sr, "sr");
function or(l, e) {
  const t = [];
  return l.forEach((n) => {
    if (n.data) {
      const i = or(n.data, e);
      i.length && t.push({ ...n, data: i });
    } else e(n) && t.push(n);
  }), t;
}
__name(or, "or");
var Uh = 1;
function Jh(l) {
  return sr(l, (e) => {
    e.id = e.id || Uh++;
  }), l;
}
__name(Jh, "Jh");
var Qh = {};
function xi(l) {
  return Qh[l];
}
__name(xi, "xi");
function $i(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = "wx-icon " + /*item*/
    l[0].icon + " x2-xfznf6");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*item*/
    1 && t !== (t = "wx-icon " + /*item*/
    n[0].icon + " x2-xfznf6") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name($i, "$i");
function xh(l) {
  let e, t = (
    /*item*/
    l[0].text + ""
  ), n;
  return { c() {
    e = D("span"), n = re(t), g(e, "class", "wx-value x2-xfznf6");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*item*/
    1 && t !== (t = /*item*/
    i[0].text + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(xh, "xh");
function $h(l) {
  let e, t, n;
  var i = xi(
    /*item*/
    l[0].type
  );
  function s(o, a) {
    return { props: { item: (
      /*item*/
      o[0]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l))), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a & /*item*/
    1 && i !== (i = xi(
      /*item*/
      o[0].type
    ))) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a & /*item*/
      1 && (r.item = /*item*/
      o[0]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name($h, "$h");
function es(l) {
  let e, t = (
    /*item*/
    l[0].subtext + ""
  ), n;
  return { c() {
    e = D("span"), n = re(t), g(e, "class", "wx-subtext x2-xfznf6");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*item*/
    1 && t !== (t = /*item*/
    i[0].subtext + "") && me(n, t);
  }, d(i) {
    i && v(e);
  } };
}
__name(es, "es");
function ts(l) {
  let e;
  return { c() {
    e = D("i"), g(e, "class", "wx-sub-icon wxi-angle-right x2-xfznf6");
  }, m(t, n) {
    S(t, e, n);
  }, d(t) {
    t && v(e);
  } };
}
__name(ts, "ts");
function em(l) {
  let e, t, n, i, s, o, a, r, c, u, f, d = (
    /*item*/
    l[0].icon && $i(l)
  );
  const h = [$h, xh], m = [];
  function _(p, z) {
    return (
      /*item*/
      p[0].type ? 0 : 1
    );
  }
  __name(_, "_");
  n = _(l), i = m[n] = h[n](l);
  let w = (
    /*item*/
    l[0].subtext && es(l)
  ), b = (
    /*item*/
    l[0].data && ts()
  );
  return { c() {
    e = D("div"), d && d.c(), t = Y(), i.c(), s = Y(), w && w.c(), o = Y(), b && b.c(), g(e, "class", a = "wx-item " + /*item*/
    (l[0].css || "") + " x2-xfznf6"), g(e, "data-id", r = /*item*/
    l[0].id);
  }, m(p, z) {
    S(p, e, z), d && d.m(e, null), H(e, t), m[n].m(e, null), H(e, s), w && w.m(e, null), H(e, o), b && b.m(e, null), c = true, u || (f = [q(
      e,
      "mouseenter",
      /*onHover*/
      l[1]
    ), q(
      e,
      "click",
      /*click_handler*/
      l[4]
    )], u = true);
  }, p(p, _ref62) {
    let [z] = _ref62;
    p[0].icon ? d ? d.p(p, z) : (d = $i(p), d.c(), d.m(e, t)) : d && (d.d(1), d = null);
    let T = n;
    n = _(p), n === T ? m[n].p(p, z) : (te(), y(m[T], 1, 1, () => {
      m[T] = null;
    }), ne(), i = m[n], i ? i.p(p, z) : (i = m[n] = h[n](p), i.c()), k(i, 1), i.m(e, s)), /*item*/
    p[0].subtext ? w ? w.p(p, z) : (w = es(p), w.c(), w.m(e, o)) : w && (w.d(1), w = null), /*item*/
    p[0].data ? b || (b = ts(), b.c(), b.m(e, null)) : b && (b.d(1), b = null), (!c || z & /*item*/
    1 && a !== (a = "wx-item " + /*item*/
    (p[0].css || "") + " x2-xfznf6")) && g(e, "class", a), (!c || z & /*item*/
    1 && r !== (r = /*item*/
    p[0].id)) && g(e, "data-id", r);
  }, i(p) {
    c || (k(i), c = true);
  }, o(p) {
    y(i), c = false;
  }, d(p) {
    p && v(e), d && d.d(), m[n].d(), w && w.d(), b && b.d(), u = false, Ee(f);
  } };
}
__name(em, "em");
function tm(l, e, t) {
  let { item: n } = e, { showSub: i = false } = e, { activeItem: s = null } = e;
  function o() {
    t(2, i = n.data ? n.id : false), t(3, s = this);
  }
  __name(o, "o");
  function a(r) {
    De.call(this, l, r);
  }
  __name(a, "a");
  return l.$$set = (r) => {
    "item" in r && t(0, n = r.item), "showSub" in r && t(2, i = r.showSub), "activeItem" in r && t(3, s = r.activeItem);
  }, [n, o, i, s, a];
}
__name(tm, "tm");
var _nm = class _nm extends ee {
  constructor(e) {
    super(), $(this, e, tm, em, x, { item: 0, showSub: 2, activeItem: 3 });
  }
};
__name(_nm, "nm");
var nm = _nm;
function ns(l, e, t) {
  const n = l.slice();
  return n[24] = e[t], n;
}
__name(ns, "ns");
function lm(l) {
  let e, t, n, i;
  function s(c) {
    l[17](c);
  }
  __name(s, "s");
  function o(c) {
    l[18](c);
  }
  __name(o, "o");
  function a() {
    for (var _len2 = arguments.length, c = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      c[_key2] = arguments[_key2];
    }
    return (
      /*click_handler_1*/
      l[19](
        /*item*/
        l[24],
        ...c
      )
    );
  }
  __name(a, "a");
  let r = { item: (
    /*item*/
    l[24]
  ) };
  return (
    /*showSub*/
    l[7] !== void 0 && (r.showSub = /*showSub*/
    l[7]), /*activeItem*/
    l[8] !== void 0 && (r.activeItem = /*activeItem*/
    l[8]), e = new nm({ props: r }), be.push(() => rt(e, "showSub", s)), be.push(() => rt(e, "activeItem", o)), e.$on("click", a), { c() {
      F(e.$$.fragment);
    }, m(c, u) {
      R(e, c, u), i = true;
    }, p(c, u) {
      l = c;
      const f = {};
      u & /*options*/
      1 && (f.item = /*item*/
      l[24]), !t && u & /*showSub*/
      128 && (t = true, f.showSub = /*showSub*/
      l[7], dt(() => t = false)), !n && u & /*activeItem*/
      256 && (n = true, f.activeItem = /*activeItem*/
      l[8], dt(() => n = false)), e.$set(f);
    }, i(c) {
      i || (k(e.$$.fragment, c), i = true);
    }, o(c) {
      y(e.$$.fragment, c), i = false;
    }, d(c) {
      O(e, c);
    } }
  );
}
__name(lm, "lm");
function im(l) {
  let e;
  return { c() {
    e = D("div"), g(e, "class", "wx-separator x2-1tqohog");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(im, "im");
function ls(l) {
  let e, t;
  return e = new rr({ props: { css: (
    /*css*/
    l[2]
  ), options: (
    /*item*/
    l[24].data
  ), at: "right-overlap", parent: (
    /*activeItem*/
    l[8]
  ), context: (
    /*context*/
    l[1]
  ) } }), e.$on(
    "click",
    /*click_handler*/
    l[20]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*css*/
    4 && (s.css = /*css*/
    n[2]), i & /*options*/
    1 && (s.options = /*item*/
    n[24].data), i & /*activeItem*/
    256 && (s.parent = /*activeItem*/
    n[8]), i & /*context*/
    2 && (s.context = /*context*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(ls, "ls");
function is(l, e) {
  let t, n, i, s, o, a;
  const r = [im, lm], c = [];
  function u(d, h) {
    return (
      /*item*/
      d[24].type === "separator" ? 0 : 1
    );
  }
  __name(u, "u");
  n = u(e), i = c[n] = r[n](e);
  let f = (
    /*item*/
    e[24].data && /*showSub*/
    e[7] === /*item*/
    e[24].id && ls(e)
  );
  return { key: l, first: null, c() {
    t = se(), i.c(), s = Y(), f && f.c(), o = se(), this.first = t;
  }, m(d, h) {
    S(d, t, h), c[n].m(d, h), S(d, s, h), f && f.m(d, h), S(d, o, h), a = true;
  }, p(d, h) {
    e = d;
    let m = n;
    n = u(e), n === m ? c[n].p(e, h) : (te(), y(c[m], 1, 1, () => {
      c[m] = null;
    }), ne(), i = c[n], i ? i.p(e, h) : (i = c[n] = r[n](e), i.c()), k(i, 1), i.m(s.parentNode, s)), /*item*/
    e[24].data && /*showSub*/
    e[7] === /*item*/
    e[24].id ? f ? (f.p(e, h), h & /*options, showSub*/
    129 && k(f, 1)) : (f = ls(e), f.c(), k(f, 1), f.m(o.parentNode, o)) : f && (te(), y(f, 1, 1, () => {
      f = null;
    }), ne());
  }, i(d) {
    a || (k(i), k(f), a = true);
  }, o(d) {
    y(i), y(f), a = false;
  }, d(d) {
    d && (v(t), v(s), v(o)), c[n].d(d), f && f.d(d);
  } };
}
__name(is, "is");
function sm(l) {
  let e, t = [], n = /* @__PURE__ */ new Map(), i, s, o, a, r = de(
    /*options*/
    l[0]
  );
  const c = /* @__PURE__ */ __name((u) => (
    /*item*/
    u[24].id
  ), "c");
  for (let u = 0; u < r.length; u += 1) {
    let f = ns(l, r, u), d = c(f);
    n.set(d, t[u] = is(d, f));
  }
  return { c() {
    e = D("div");
    for (let u = 0; u < t.length; u += 1) t[u].c();
    g(e, "data-wx-menu", "true"), g(e, "class", i = "wx-menu " + /*css*/
    l[2] + " x2-1tqohog"), j(
      e,
      "top",
      /*y*/
      l[4] + "px"
    ), j(
      e,
      "left",
      /*x*/
      l[3] + "px"
    ), j(
      e,
      "width",
      /*width*/
      l[5]
    );
  }, m(u, f) {
    S(u, e, f);
    for (let d = 0; d < t.length; d += 1) t[d] && t[d].m(e, null);
    l[21](e), s = true, o || (a = [nt(Rn.call(null, e, { callback: (
      /*cancel*/
      l[11]
    ), modal: true })), q(
      e,
      "mouseleave",
      /*onLeave*/
      l[10]
    )], o = true);
  }, p(u, _ref63) {
    let [f] = _ref63;
    f & /*css, options, activeItem, context, showSub, dispatch*/
    903 && (r = de(
      /*options*/
      u[0]
    ), te(), t = kt(t, f, c, 1, u, r, n, e, en, is, null, ns), ne()), (!s || f & /*css*/
    4 && i !== (i = "wx-menu " + /*css*/
    u[2] + " x2-1tqohog")) && g(e, "class", i), (!s || f & /*y*/
    16) && j(
      e,
      "top",
      /*y*/
      u[4] + "px"
    ), (!s || f & /*x*/
    8) && j(
      e,
      "left",
      /*x*/
      u[3] + "px"
    ), (!s || f & /*width*/
    32) && j(
      e,
      "width",
      /*width*/
      u[5]
    );
  }, i(u) {
    if (!s) {
      for (let f = 0; f < r.length; f += 1) k(t[f]);
      s = true;
    }
  }, o(u) {
    for (let f = 0; f < t.length; f += 1) y(t[f]);
    s = false;
  }, d(u) {
    u && v(e);
    for (let f = 0; f < t.length; f += 1) t[f].d();
    l[21](null), o = false, Ee(a);
  } };
}
__name(sm, "sm");
function om(l, e, t) {
  const n = He();
  let { options: i } = e, { left: s = 0 } = e, { top: o = 0 } = e, { at: a = "bottom" } = e, { parent: r = null } = e, { mount: c = null } = e, { context: u = null } = e, { css: f = "" } = e, d = -1e4, h = -1e4, m, _, w, b;
  function p() {
    const A = qr(_, r, a, s, o);
    t(3, d = A.x || d), t(4, h = A.y || h), A.index, t(5, m = A?.width || m);
  }
  __name(p, "p");
  c && c(p), ht(p);
  function z() {
    t(7, w = false);
  }
  __name(z, "z");
  function T() {
    n("click", { action: null });
  }
  __name(T, "T");
  function W(A) {
    w = A, t(7, w);
  }
  __name(W, "W");
  function M(A) {
    b = A, t(8, b);
  }
  __name(M, "M");
  const C = /* @__PURE__ */ __name((A, B) => {
    if (!A.data && !B.defaultPrevented) {
      const V = { context: u, action: A, event: B };
      A.handler && A.handler(V), n("click", V), B.stopPropagation();
    }
  }, "C");
  function P(A) {
    De.call(this, l, A);
  }
  __name(P, "P");
  function X(A) {
    be[A ? "unshift" : "push"](() => {
      _ = A, t(6, _);
    });
  }
  __name(X, "X");
  return l.$$set = (A) => {
    "options" in A && t(0, i = A.options), "left" in A && t(12, s = A.left), "top" in A && t(13, o = A.top), "at" in A && t(14, a = A.at), "parent" in A && t(15, r = A.parent), "mount" in A && t(16, c = A.mount), "context" in A && t(1, u = A.context), "css" in A && t(2, f = A.css);
  }, l.$$.update = () => {
    l.$$.dirty & /*options*/
    1 && Jh(i), l.$$.dirty & /*parent*/
    32768 && p();
  }, [i, u, f, d, h, m, _, w, b, n, z, T, s, o, a, r, c, W, M, C, P, X];
}
__name(om, "om");
var _a6;
var rr = (_a6 = class extends ee {
  constructor(e) {
    super(), $(this, e, om, sm, x, { options: 0, left: 12, top: 13, at: 14, parent: 15, mount: 16, context: 1, css: 2 });
  }
}, __name(_a6, "rr"), _a6);
function rm(l) {
  let e, t, n, i;
  const s = (
    /*#slots*/
    l[14].default
  ), o = Ie(
    s,
    l,
    /*$$scope*/
    l[15],
    null
  );
  return { c() {
    e = D("div"), o && o.c(), g(e, "data-menu-ignore", "true");
  }, m(a, r) {
    S(a, e, r), o && o.m(e, null), t = true, n || (i = q(
      e,
      "click",
      /*handler*/
      l[2]
    ), n = true);
  }, p(a, r) {
    o && o.p && (!t || r & /*$$scope*/
    32768) && Oe(
      o,
      s,
      a,
      /*$$scope*/
      a[15],
      t ? Re(
        s,
        /*$$scope*/
        a[15],
        r,
        null
      ) : Ae(
        /*$$scope*/
        a[15]
      ),
      null
    );
  }, i(a) {
    t || (k(o, a), t = true);
  }, o(a) {
    y(o, a), t = false;
  }, d(a) {
    a && v(e), o && o.d(a), n = false, i();
  } };
}
__name(rm, "rm");
function ss(l) {
  let e, t;
  return e = new yc({ props: { $$slots: { default: [am, (_ref64) => {
    let { mount: n } = _ref64;
    return { 20: n };
  }, (_ref65) => {
    let { mount: n } = _ref65;
    return n ? 1048576 : 0;
  }] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*$$scope, parent, css, at, top, left, mount, item, filteredOptions*/
    1081595 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(ss, "ss");
function os(l) {
  let e, t;
  return e = new rr({ props: { css: (
    /*css*/
    l[1]
  ), at: (
    /*at*/
    l[0]
  ), top: (
    /*top*/
    l[7]
  ), left: (
    /*left*/
    l[6]
  ), mount: (
    /*mount*/
    l[20]
  ), parent: (
    /*parent*/
    l[5]
  ), context: (
    /*item*/
    l[4]
  ), options: (
    /*filteredOptions*/
    l[3]
  ) } }), e.$on(
    "click",
    /*onClick*/
    l[9]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*css*/
    2 && (s.css = /*css*/
    n[1]), i & /*at*/
    1 && (s.at = /*at*/
    n[0]), i & /*top*/
    128 && (s.top = /*top*/
    n[7]), i & /*left*/
    64 && (s.left = /*left*/
    n[6]), i & /*mount*/
    1048576 && (s.mount = /*mount*/
    n[20]), i & /*parent*/
    32 && (s.parent = /*parent*/
    n[5]), i & /*item*/
    16 && (s.context = /*item*/
    n[4]), i & /*filteredOptions*/
    8 && (s.options = /*filteredOptions*/
    n[3]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(os, "os");
function am(l) {
  let e = (
    /*parent*/
    l[5]
  ), t, n, i = os(l);
  return { c() {
    i.c(), t = se();
  }, m(s, o) {
    i.m(s, o), S(s, t, o), n = true;
  }, p(s, o) {
    o & /*parent*/
    32 && x(e, e = /*parent*/
    s[5]) ? (te(), y(i, 1, 1, I), ne(), i = os(s), i.c(), k(i, 1), i.m(t.parentNode, t)) : i.p(s, o);
  }, i(s) {
    n || (k(i), n = true);
  }, o(s) {
    y(i), n = false;
  }, d(s) {
    s && v(t), i.d(s);
  } };
}
__name(am, "am");
function cm(l) {
  let e, t, n, i = (
    /*SLOTS*/
    l[8] && /*SLOTS*/
    l[8].default && rm(l)
  ), s = (
    /*parent*/
    l[5] && ss(l)
  );
  return { c() {
    i && i.c(), e = Y(), s && s.c(), t = se();
  }, m(o, a) {
    i && i.m(o, a), S(o, e, a), s && s.m(o, a), S(o, t, a), n = true;
  }, p(o, _ref66) {
    let [a] = _ref66;
    o[8] && /*SLOTS*/
    o[8].default && i.p(o, a), /*parent*/
    o[5] ? s ? (s.p(o, a), a & /*parent*/
    32 && k(s, 1)) : (s = ss(o), s.c(), k(s, 1), s.m(t.parentNode, t)) : s && (te(), y(s, 1, 1, () => {
      s = null;
    }), ne());
  }, i(o) {
    n || (k(i), k(s), n = true);
  }, o(o) {
    y(i), y(s), n = false;
  }, d(o) {
    o && (v(e), v(t)), i && i.d(o), s && s.d(o);
  } };
}
__name(cm, "cm");
function um(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e;
  const s = He(), o = e.$$slots;
  let { options: a } = e, { at: r = "bottom" } = e, { resolver: c = null } = e, { dataKey: u = "contextId" } = e, { filter: f = null } = e, { css: d = "" } = e;
  const h = W;
  var m, _ = null, w = null;
  let b = 0, p = 0;
  function z(M) {
    t(5, w = null), s("click", M.detail);
  }
  __name(z, "z");
  function T(M, C) {
    let P = null;
    for (; M && M.dataset && !P; ) P = M.dataset[C], M = M.parentNode;
    return P ? ul(P) : null;
  }
  __name(T, "T");
  function W(M, C) {
    if (!M) {
      t(5, w = null);
      return;
    }
    if (M.defaultPrevented) return;
    const P = M.target;
    P && P.dataset && P.dataset.menuIgnore || (t(6, b = M.clientX + 1), t(7, p = M.clientY + 1), t(4, _ = typeof C < "u" ? C : T(P, u)), !(c && (t(4, _ = c(_, M)), !_)) && (_ !== null && f && t(3, m = or(a, (X) => f(X, _))), t(5, w = P), M.preventDefault()));
  }
  __name(W, "W");
  return l.$$set = (M) => {
    t(19, e = We(We({}, e), qe(M))), "options" in M && t(10, a = M.options), "at" in M && t(0, r = M.at), "resolver" in M && t(11, c = M.resolver), "dataKey" in M && t(12, u = M.dataKey), "filter" in M && t(13, f = M.filter), "css" in M && t(1, d = M.css), "$$scope" in M && t(15, i = M.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty & /*options*/
    1024 && t(3, m = a);
  }, e = qe(e), [r, d, h, m, _, w, b, p, o, z, a, c, u, f, n, i];
}
__name(um, "um");
var _fm = class _fm extends ee {
  constructor(e) {
    super(), $(this, e, um, cm, x, { options: 10, at: 0, resolver: 11, dataKey: 12, filter: 13, css: 1, handler: 2 });
  }
  get handler() {
    return this.$$.ctx[2];
  }
};
__name(_fm, "fm");
var fm = _fm;
function dm(l) {
  let e, t, n, i;
  const s = (
    /*#slots*/
    l[9].default
  ), o = Ie(
    s,
    l,
    /*$$scope*/
    l[8],
    null
  );
  return { c() {
    e = D("div"), o && o.c(), g(e, "data-menu-ignore", "true");
  }, m(a, r) {
    S(a, e, r), o && o.m(e, null), t = true, n || (i = q(e, "contextmenu", function() {
      ot(
        /*handler*/
        l[0]
      ) && l[0].apply(this, arguments);
    }), n = true);
  }, p(a, r) {
    l = a, o && o.p && (!t || r & /*$$scope*/
    256) && Oe(
      o,
      s,
      l,
      /*$$scope*/
      l[8],
      t ? Re(
        s,
        /*$$scope*/
        l[8],
        r,
        null
      ) : Ae(
        /*$$scope*/
        l[8]
      ),
      null
    );
  }, i(a) {
    t || (k(o, a), t = true);
  }, o(a) {
    y(o, a), t = false;
  }, d(a) {
    a && v(e), o && o.d(a), n = false, i();
  } };
}
__name(dm, "dm");
function hm(l) {
  let e, t, n, i, s = (
    /*SLOTS*/
    l[7] && /*SLOTS*/
    l[7].default && dm(l)
  );
  function o(r) {
    l[10](r);
  }
  __name(o, "o");
  let a = { css: (
    /*css*/
    l[6]
  ), at: (
    /*at*/
    l[2]
  ), options: (
    /*options*/
    l[1]
  ), resolver: (
    /*resolver*/
    l[3]
  ), dataKey: (
    /*dataKey*/
    l[4]
  ), filter: (
    /*filter*/
    l[5]
  ) };
  return (
    /*handler*/
    l[0] !== void 0 && (a.handler = /*handler*/
    l[0]), t = new fm({ props: a }), be.push(() => rt(t, "handler", o)), t.$on(
      "click",
      /*click_handler*/
      l[11]
    ), { c() {
      s && s.c(), e = Y(), F(t.$$.fragment);
    }, m(r, c) {
      s && s.m(r, c), S(r, e, c), R(t, r, c), i = true;
    }, p(r, _ref67) {
      let [c] = _ref67;
      r[7] && /*SLOTS*/
      r[7].default && s.p(r, c);
      const u = {};
      c & /*css*/
      64 && (u.css = /*css*/
      r[6]), c & /*at*/
      4 && (u.at = /*at*/
      r[2]), c & /*options*/
      2 && (u.options = /*options*/
      r[1]), c & /*resolver*/
      8 && (u.resolver = /*resolver*/
      r[3]), c & /*dataKey*/
      16 && (u.dataKey = /*dataKey*/
      r[4]), c & /*filter*/
      32 && (u.filter = /*filter*/
      r[5]), !n && c & /*handler*/
      1 && (n = true, u.handler = /*handler*/
      r[0], dt(() => n = false)), t.$set(u);
    }, i(r) {
      i || (k(s), k(t.$$.fragment, r), i = true);
    }, o(r) {
      y(s), y(t.$$.fragment, r), i = false;
    }, d(r) {
      r && v(e), s && s.d(r), O(t, r);
    } }
  );
}
__name(hm, "hm");
function mm(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e;
  const s = e.$$slots;
  let { handler: o = null } = e, { options: a } = e, { at: r = "bottom" } = e, { resolver: c = null } = e, { dataKey: u = "contextId" } = e, { filter: f = null } = e, { css: d = "" } = e;
  function h(_) {
    o = _, t(0, o);
  }
  __name(h, "h");
  function m(_) {
    De.call(this, l, _);
  }
  __name(m, "m");
  return l.$$set = (_) => {
    t(12, e = We(We({}, e), qe(_))), "handler" in _ && t(0, o = _.handler), "options" in _ && t(1, a = _.options), "at" in _ && t(2, r = _.at), "resolver" in _ && t(3, c = _.resolver), "dataKey" in _ && t(4, u = _.dataKey), "filter" in _ && t(5, f = _.filter), "css" in _ && t(6, d = _.css), "$$scope" in _ && t(8, i = _.$$scope);
  }, e = qe(e), [o, a, r, c, u, f, d, s, i, n, h, m];
}
__name(mm, "mm");
var __m = class __m extends ee {
  constructor(e) {
    super(), $(this, e, mm, hm, x, { handler: 0, options: 1, at: 2, resolver: 3, dataKey: 4, filter: 5, css: 6 });
  }
};
__name(__m, "_m");
var _m = __m;
function gm(l) {
  let e;
  return { c() {
    e = D("i"), g(e, "class", "wx-toggle-placeholder x2-r092m");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, d(t) {
    t && v(e);
  } };
}
__name(gm, "gm");
function wm(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = "wx-toggle-icon wxi-menu-" + /*row*/
    (l[0].open ? "down" : "right") + " x2-r092m"), g(e, "data-action", "open-task");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*row*/
    1 && t !== (t = "wx-toggle-icon wxi-menu-" + /*row*/
    (n[0].open ? "down" : "right") + " x2-r092m") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(wm, "wm");
function bm(l) {
  let e, t, n, i = (
    /*row*/
    l[0].text + ""
  ), s, o;
  function a(u, f) {
    return (
      /*row*/
      u[0].data || /*row*/
      u[0].lazy ? wm : gm
    );
  }
  __name(a, "a");
  let r = a(l), c = r(l);
  return { c() {
    e = D("div"), c.c(), t = Y(), n = D("div"), s = re(i), g(n, "class", "wx-text x2-r092m"), g(e, "class", "wx-content x2-r092m"), g(e, "style", o = rs(
      /*row*/
      l[0],
      /*col*/
      l[1]
    ));
  }, m(u, f) {
    S(u, e, f), c.m(e, null), H(e, t), H(e, n), H(n, s);
  }, p(u, f) {
    r === (r = a(u)) && c ? c.p(u, f) : (c.d(1), c = r(u), c && (c.c(), c.m(e, t))), f & /*row*/
    1 && i !== (i = /*row*/
    u[0].text + "") && me(s, i), f & /*row, col*/
    3 && o !== (o = rs(
      /*row*/
      u[0],
      /*col*/
      u[1]
    )) && g(e, "style", o);
  }, d(u) {
    u && v(e), c.d();
  } };
}
__name(bm, "bm");
function km(l) {
  let e, t;
  return e = new vl({ props: { row: (
    /*row*/
    l[0]
  ), col: (
    /*col*/
    l[1]
  ), columnStyle: (
    /*columnStyle*/
    l[2]
  ), cellStyle: (
    /*cellStyle*/
    l[3]
  ), $$slots: { default: [bm] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref68) {
    let [i] = _ref68;
    const s = {};
    i & /*row*/
    1 && (s.row = /*row*/
    n[0]), i & /*col*/
    2 && (s.col = /*col*/
    n[1]), i & /*columnStyle*/
    4 && (s.columnStyle = /*columnStyle*/
    n[2]), i & /*cellStyle*/
    8 && (s.cellStyle = /*cellStyle*/
    n[3]), i & /*$$scope, row, col*/
    19 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(km, "km");
function rs(l, e) {
  return `justify-content:${e.align};padding-left: ${(l.$level - 1) * 20}px`;
}
__name(rs, "rs");
function pm(l, e, t) {
  let { row: n } = e, { col: i } = e, { columnStyle: s } = e, { cellStyle: o } = e;
  return l.$$set = (a) => {
    "row" in a && t(0, n = a.row), "col" in a && t(1, i = a.col), "columnStyle" in a && t(2, s = a.columnStyle), "cellStyle" in a && t(3, o = a.cellStyle);
  }, [n, i, s, o];
}
__name(pm, "pm");
var _ym = class _ym extends ee {
  constructor(e) {
    super(), $(this, e, pm, km, x, { row: 0, col: 1, columnStyle: 2, cellStyle: 3 });
  }
};
__name(_ym, "ym");
var ym = _ym;
function as(l) {
  let e, t, n;
  return { c() {
    e = D("div"), t = D("i"), g(t, "class", "wx-add-icon wxi-plus x2-153hphv"), g(t, "data-action", n = /*col*/
    l[1].action), j(
      e,
      "text-align",
      /*col*/
      l[1].align
    );
  }, m(i, s) {
    S(i, e, s), H(e, t);
  }, p(i, s) {
    s & /*col*/
    2 && n !== (n = /*col*/
    i[1].action) && g(t, "data-action", n), s & /*col*/
    2 && j(
      e,
      "text-align",
      /*col*/
      i[1].align
    );
  }, d(i) {
    i && v(e);
  } };
}
__name(as, "as");
function vm(l) {
  let e, t = (
    /*col*/
    l[1].action == "add-task" && as(l)
  );
  return { c() {
    t && t.c(), e = se();
  }, m(n, i) {
    t && t.m(n, i), S(n, e, i);
  }, p(n, i) {
    n[1].action == "add-task" ? t ? t.p(n, i) : (t = as(n), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, d(n) {
    n && v(e), t && t.d(n);
  } };
}
__name(vm, "vm");
function Sm(l) {
  let e, t;
  return e = new vl({ props: { row: (
    /*row*/
    l[0]
  ), col: (
    /*col*/
    l[1]
  ), columnStyle: (
    /*columnStyle*/
    l[2]
  ), cellStyle: (
    /*cellStyle*/
    l[3]
  ), $$slots: { default: [vm] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref69) {
    let [i] = _ref69;
    const s = {};
    i & /*row*/
    1 && (s.row = /*row*/
    n[0]), i & /*col*/
    2 && (s.col = /*col*/
    n[1]), i & /*columnStyle*/
    4 && (s.columnStyle = /*columnStyle*/
    n[2]), i & /*cellStyle*/
    8 && (s.cellStyle = /*cellStyle*/
    n[3]), i & /*$$scope, col*/
    18 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Sm, "Sm");
function Mm(l, e, t) {
  let { row: n } = e, { col: i } = e, { columnStyle: s } = e, { cellStyle: o } = e;
  return l.$$set = (a) => {
    "row" in a && t(0, n = a.row), "col" in a && t(1, i = a.col), "columnStyle" in a && t(2, s = a.columnStyle), "cellStyle" in a && t(3, o = a.cellStyle);
  }, [n, i, s, o];
}
__name(Mm, "Mm");
var _Tm = class _Tm extends ee {
  constructor(e) {
    super(), $(this, e, Mm, Sm, x, { row: 0, col: 1, columnStyle: 2, cellStyle: 3 });
  }
};
__name(_Tm, "Tm");
var Tm = _Tm;
function Cm(l) {
  let e, t, n, i, s, o, a, r, c;
  return s = new Vh({ props: { init: (
    /*init*/
    l[33]
  ), sizes: { rowHeight: (
    /*$cellHeight*/
    l[15]
  ), headerHeight: (
    /*height*/
    l[0] - 1
  ) }, rowStyle: Dm, columnStyle: Wm, data: (
    /*allTasks*/
    l[13]
  ), columns: (
    /*cols*/
    l[6]
  ), selectedRows: [.../*sel*/
  l[14]] } }), { c() {
    e = D("div"), t = D("div"), n = D("div"), i = D("div"), F(s.$$.fragment), g(
      i,
      "style",
      /*tableStyle*/
      l[3]
    ), g(i, "class", "wx-table x2-dnsr36"), g(
      n,
      "style",
      /*tableOuterStyle*/
      l[4]
    ), g(
      t,
      "style",
      /*scrollYStyle*/
      l[11]
    ), g(t, "class", "x2-dnsr36"), Q(
      t,
      "wx-scroll-y",
      /*scrollY*/
      l[2] && !/*showFull*/
      l[7]
    ), g(e, "class", "wx-table-wrapper x2-dnsr36"), j(e, "flex", "0 0 " + /*basis*/
    l[12]), Vt(() => (
      /*div3_elementresize_handler*/
      l[54].call(e)
    )), Q(
      e,
      "wx-wrapper-scroll",
      /*scrollX*/
      l[1]
    ), Q(
      e,
      "wx-wrapper-scroll-y",
      /*scrollY*/
      l[2] && /*showFull*/
      l[7]
    );
  }, m(u, f) {
    S(u, e, f), H(e, t), H(t, n), H(n, i), R(s, i, null), l[52](i), l[53](e), o = sl(
      e,
      /*div3_elementresize_handler*/
      l[54].bind(e)
    ), a = true, r || (c = [q(
      window,
      "touchend",
      /*endScroll*/
      l[27]
    ), nt(ud.call(null, i, { start: (
      /*startReorder*/
      l[30]
    ), touchStart: (
      /*endScroll*/
      l[27]
    ), end: (
      /*endReorder*/
      l[31]
    ), move: (
      /*moveReorder*/
      l[32]
    ), getTask: (
      /*api*/
      l[16].getTask
    ) })), q(
      i,
      "touchstart",
      /*onTouchstart*/
      l[28]
    ), q(
      i,
      "touchmove",
      /*onTouchmove*/
      l[29]
    ), q(
      i,
      "click",
      /*onClick*/
      l[25]
    ), q(
      i,
      "dblclick",
      /*onDblClick*/
      l[26]
    ), q(
      t,
      "scroll",
      /*onScroll*/
      l[34]
    ), q(
      e,
      "scroll",
      /*onScroll*/
      l[34]
    )], r = true);
  }, p(u, f) {
    const d = {};
    f[0] & /*$cellHeight, height*/
    32769 && (d.sizes = { rowHeight: (
      /*$cellHeight*/
      u[15]
    ), headerHeight: (
      /*height*/
      u[0] - 1
    ) }), f[0] & /*allTasks*/
    8192 && (d.data = /*allTasks*/
    u[13]), f[0] & /*cols*/
    64 && (d.columns = /*cols*/
    u[6]), f[0] & /*sel*/
    16384 && (d.selectedRows = [.../*sel*/
    u[14]]), s.$set(d), (!a || f[0] & /*tableStyle*/
    8) && g(
      i,
      "style",
      /*tableStyle*/
      u[3]
    ), (!a || f[0] & /*tableOuterStyle*/
    16) && g(
      n,
      "style",
      /*tableOuterStyle*/
      u[4]
    ), (!a || f[0] & /*scrollYStyle*/
    2048) && g(
      t,
      "style",
      /*scrollYStyle*/
      u[11]
    ), (!a || f[0] & /*scrollY, showFull*/
    132) && Q(
      t,
      "wx-scroll-y",
      /*scrollY*/
      u[2] && !/*showFull*/
      u[7]
    ), (!a || f[0] & /*basis*/
    4096) && j(e, "flex", "0 0 " + /*basis*/
    u[12]), (!a || f[0] & /*scrollX*/
    2) && Q(
      e,
      "wx-wrapper-scroll",
      /*scrollX*/
      u[1]
    ), (!a || f[0] & /*scrollY, showFull*/
    132) && Q(
      e,
      "wx-wrapper-scroll-y",
      /*scrollY*/
      u[2] && /*showFull*/
      u[7]
    );
  }, i(u) {
    a || (k(s.$$.fragment, u), a = true);
  }, o(u) {
    y(s.$$.fragment, u), a = false;
  }, d(u) {
    u && v(e), O(s), l[52](null), l[53](null), o(), r = false, Ee(c);
  } };
}
__name(Cm, "Cm");
var Dm = /* @__PURE__ */ __name((l) => l.$reorder ? "wx-reorder-task" : "", "Dm");
var Wm = /* @__PURE__ */ __name((l) => "wx-text-" + l.align, "Wm");
function Hm(l, e, t) {
  let n, i, s, o, a, r, c, u, f, d, h, { readonly: m } = e, { compactMode: _ } = e, { width: w = 0 } = e, { columnWidth: b = 0 } = e, { fullHeight: p = 0 } = e;
  const z = ze("wx-i18n").getGroup("gantt"), T = ze("gantt-store"), { scrollTop: W, cellHeight: M, _selected: C, area: P, _tasks: X, _scales: A, columns: B, _sort: V } = T.getReactiveState();
  ce(l, W, (Z) => t(45, o = Z)), ce(l, M, (Z) => t(15, h = Z)), ce(l, C, (Z) => t(48, c = Z)), ce(l, P, (Z) => t(50, f = Z)), ce(l, X, (Z) => t(51, d = Z)), ce(l, A, (Z) => t(49, u = Z)), ce(l, B, (Z) => t(47, r = Z)), ce(l, V, (Z) => t(46, a = Z));
  let fe, L, Ye = null, G = true, pe = null, Se, K, ue, Ne, ye, ve, Ze;
  function ie(Z) {
    const ae = hn(Z);
    if (!ae) return;
    let Te = Z.target.dataset.action;
    if (Te && Z.preventDefault(), Te == "add-task") T.exec(Te, { target: ae, task: { text: z("New Task") }, mode: "child" });
    else if (Te == "open-task") {
      const at = fe.find((ct) => ct.id === ae);
      T.exec(Te, { id: ae, mode: !at.open });
    } else T.exec("select-task", { id: ae, toggle: Z.ctrlKey || Z.metaKey, range: Z.shiftKey, show: true });
  }
  __name(ie, "ie");
  function U(Z) {
    if (!m) {
      const ae = hn(Z);
      ae && T.exec("show-editor", { id: ae });
    }
  }
  __name(U, "U");
  function ge() {
    G = false;
  }
  __name(ge, "ge");
  function Me(Z) {
    G = true, Ye = Z.touches[0].clientY + o;
  }
  __name(Me, "Me");
  function Fe(Z) {
    if (G) {
      const ae = Ye - Z.touches[0].clientY;
      return T.exec("scroll-chart", { top: ae }), Z.preventDefault(), false;
    }
  }
  __name(Fe, "Fe");
  let Je;
  function J(Z) {
    const ae = Z.id, { before: Te, after: at } = Z, ct = Z.onMove;
    let _t = Te || at, ut = Te ? "before" : "after";
    if (ct) {
      if (ut == "after") {
        const zt = T.getTask(_t);
        zt.data?.length && zt.open && (ut = "before", _t = zt.data[0].id);
      }
      Je = { id: ae, [ut]: _t };
    } else Je = null;
    T.exec("move-task", { id: ae, mode: ut, target: _t, inProgress: ct });
  }
  __name(J, "J");
  function oe(_ref70) {
    let { id: Z } = _ref70;
    if (m || (T.getTask(Z).open && T.exec("open-task", { id: Z, mode: false }), t(41, pe = fe.find((ae) => ae.id === Z)), !pe)) return false;
  }
  __name(oe, "oe");
  function we(_ref71) {
    let { id: Z, top: ae } = _ref71;
    Je ? J({ ...Je, onMove: false }) : (T.exec("drag-task", { id: Z, top: ae + n, inProgress: false }), t(41, pe = null));
  }
  __name(we, "we");
  function E(_ref72) {
    let { id: Z, top: ae, detail: Te } = _ref72;
    Te && J({ ...Te, onMove: true }), T.exec("drag-task", { id: Z, top: ae + n, inProgress: true });
  }
  __name(E, "E");
  let le, _e, ke = false, Pe = false, Be = 0, je = 0, Xe;
  function it(Z) {
    Z.intercept("scroll", () => false), Z.intercept("select-row", () => false), Z.intercept("collapse-column", () => (_ ? t(7, ke = !ke) : T.exec("add-task", { task: { text: z("New Task") } }), false)), Z.intercept("sort-rows", (ae) => {
      const Te = ae.key, at = a;
      let ct = at ? "asc" : "desc";
      return at && at.key === Te && (ct = at.order === "asc" ? "desc" : "asc"), T.exec("sort-tasks", { key: Te, order: ct }), false;
    }), Z.on("resize-column", () => {
      Pe && mt(le), At();
    });
  }
  __name(it, "it");
  function pt(Z) {
    t(42, Ze = Z.target.scrollTop), T.exec("scroll-chart", { top: Ze });
  }
  __name(pt, "pt");
  function mt(Z) {
    t(43, Pe = Z.some((ae) => Object.hasOwn(ae, "flexgrow")));
  }
  __name(mt, "mt");
  async function nn(Z) {
    await Dn(), t(5, ve.scrollTop = Z, ve);
  }
  __name(nn, "nn");
  function At() {
    t(35, b = le.reduce((Z, ae) => (ae.$width && (ae.$width = ae.width), Z + ae.width), 0));
  }
  __name(At, "At");
  function Wt(Z) {
    be[Z ? "unshift" : "push"](() => {
      Xe = Z, t(10, Xe);
    });
  }
  __name(Wt, "Wt");
  function Ft(Z) {
    be[Z ? "unshift" : "push"](() => {
      ve = Z, t(5, ve);
    });
  }
  __name(Ft, "Ft");
  function Ht() {
    Be = this.clientWidth, je = this.clientHeight, t(8, Be), t(9, je);
  }
  __name(Ht, "Ht");
  return l.$$set = (Z) => {
    "readonly" in Z && t(36, m = Z.readonly), "compactMode" in Z && t(37, _ = Z.compactMode), "width" in Z && t(38, w = Z.width), "columnWidth" in Z && t(35, b = Z.columnWidth), "fullHeight" in Z && t(39, p = Z.fullHeight);
  }, l.$$.update = () => {
    if (l.$$.dirty[1] & /*$rTasks, $area*/
    1572864 && t(40, fe = d.slice(f.start, f.end)), l.$$.dirty[1] & /*$area*/
    524288 && t(44, n = f.from), l.$$.dirty[1] & /*$scales*/
    262144 && t(0, L = u.height), l.$$.dirty[1] & /*$selected*/
    131072 && t(14, i = c.map((Z) => Z.id)), l.$$.dirty[1] & /*dragTask, tasks*/
    1536 && t(13, s = pe && !fe.find((Z) => Z.id === pe.id) ? [...fe, pe] : fe), l.$$.dirty[0] & /*cols, showFull*/
    192 | l.$$.dirty[1] & /*$columns, compactMode, readonly*/
    65632) {
      t(6, le = r.map((Te) => (Te.header = z(Te.header), Te))), mt(le);
      const Z = le.findIndex((Te) => Te.id == "text"), ae = le.findIndex((Te) => Te.id === "action");
      t(6, le[Z].cell = ym, le), t(6, le[ae].cell = Tm, le), t(6, le[ae].header = { css: "wx-action " + (_ ? "wx-expand" : "wx-add-task"), collapsible: true }, le), _ ? (m && t(6, le[ae].action = "expand", le), le.unshift(le.splice(ae, 1)[0]), t(6, le = ke ? le : le.slice(0, 1))) : (m && le.splice(ae, 1), t(7, ke = false)), t(6, le[le.length - 1].resize = false, le), At();
    }
    if (l.$$.dirty[0] & /*cols*/
    64 | l.$$.dirty[1] & /*$sort*/
    32768) {
      const { key: Z, order: ae } = a || {};
      t(6, le = le.map((Te) => (Te.$sort = ae && Te.id === Z ? { order: ae } : null, Te)));
    }
    if (l.$$.dirty[0] & /*showFull, w, scrollX, h, height, scrollY, tableStyle, tableOuterStyle*/
    927 | l.$$.dirty[1] & /*compactMode, columnWidth, width, fullHeight*/
    464 && (t(1, Se = _ ? ke && b > Be : b > w), t(3, ue = t(11, ye = !ke || Se ? `width:${Se ? b : w}px;` : "")), t(2, K = je < L + p), t(4, Ne = ""), K && (t(4, Ne = ue + `height:${p + L}px;`), t(3, ue += `height:${je}px;`), ke && t(11, ye = Ne)), t(12, _e = ke ? "100%" : `${w}px`)), l.$$.dirty[0] & /*showFull, w, cols*/
    448 | l.$$.dirty[1] & /*columnWidth, width, hasFlexCol*/
    4240 && (b < w || ke && b < Be) && !Pe) {
      const Z = (Be - 50) / (b - 50);
      t(6, le = le.map((ae) => (ae.id != "action" && (ae = { ...ae }, ae.$width || (ae.$width = ae.width), ae.width = ae.$width * Z), ae)));
    }
    if (l.$$.dirty[0] & /*table*/
    1024 | l.$$.dirty[1] & /*$scrollTop, scrollDelta*/
    24576 && Xe && (Xe.querySelector(".wx-body").style.top = -(o - n) + "px"), l.$$.dirty[0] & /*showFull*/
    128 | l.$$.dirty[1] & /*compactMode, $scrollTop*/
    16448 && _ && !ke && t(42, Ze = o), l.$$.dirty[0] & /*scrollDiv, showFull, scrollY*/
    164 | l.$$.dirty[1] & /*scrollYPos*/
    2048 && ve && (ke || !K)) {
      const Z = K ? Ze : 0;
      ve.scrollTop != Z && nn(Z);
    }
  }, [L, Se, K, ue, Ne, ve, le, ke, Be, je, Xe, ye, _e, s, i, h, T, W, M, C, P, X, A, B, V, ie, U, ge, Me, Fe, oe, we, E, it, pt, b, m, _, w, p, fe, pe, Ze, Pe, n, o, a, r, c, u, f, d, Wt, Ft, Ht];
}
__name(Hm, "Hm");
var _zm = class _zm extends ee {
  constructor(e) {
    super(), $(this, e, Hm, Cm, x, { readonly: 36, compactMode: 37, width: 38, columnWidth: 35, fullHeight: 39 }, null, [-1, -1, -1]);
  }
};
__name(_zm, "zm");
var zm = _zm;
function Nm(l) {
  let e;
  return { c() {
    e = D("div"), j(e, "width", "100%"), j(e, "height", "100%"), j(e, "background", "url(" + bi(
      /*$cellWidth*/
      l[3],
      /*$cellHeight*/
      l[4],
      /*color*/
      l[2],
      /*borders*/
      l[0]
    ) + ")"), j(e, "position", "absolute");
  }, m(t, n) {
    S(t, e, n), l[7](e);
  }, p(t, _ref73) {
    let [n] = _ref73;
    n & /*$cellWidth, $cellHeight, color, borders*/
    29 && j(e, "background", "url(" + bi(
      /*$cellWidth*/
      t[3],
      /*$cellHeight*/
      t[4],
      /*color*/
      t[2],
      /*borders*/
      t[0]
    ) + ")");
  }, i: I, o: I, d(t) {
    t && v(e), l[7](null);
  } };
}
__name(Nm, "Nm");
function Lm(l, e, t) {
  let n, i, { borders: s = "" } = e;
  const o = ze("gantt-store"), { cellWidth: a, cellHeight: r } = o.getReactiveState();
  ce(l, a, (d) => t(3, n = d)), ce(l, r, (d) => t(4, i = d));
  let c, u = "#e4e4e4";
  kn(() => {
    if (typeof getComputedStyle < "u") {
      const d = getComputedStyle(c).getPropertyValue("--wx-gantt-border");
      t(2, u = d ? d.substring(d.indexOf("#")) : "#1d1e261a");
    }
  });
  function f(d) {
    be[d ? "unshift" : "push"](() => {
      c = d, t(1, c);
    });
  }
  __name(f, "f");
  return l.$$set = (d) => {
    "borders" in d && t(0, s = d.borders);
  }, [s, c, u, n, i, a, r, f];
}
__name(Lm, "Lm");
var _Em = class _Em extends ee {
  constructor(e) {
    super(), $(this, e, Lm, Nm, x, { borders: 0 });
  }
};
__name(_Em, "Em");
var Em = _Em;
function cs(l, e, t) {
  const n = l.slice();
  return n[44] = e[t], n;
}
__name(cs, "cs");
function us(l) {
  let e, t, n, i, s, o, a, r, c, u, f = !/*readonly*/
  l[0] && fs(l);
  const d = [Rm, Im], h = [];
  function m(w, b) {
    return (
      /*task*/
      w[44].type !== "milestone" ? 0 : 1
    );
  }
  __name(m, "m");
  n = m(l), i = h[n] = d[n](l);
  let _ = !/*readonly*/
  l[0] && ms(l);
  return { c() {
    e = D("div"), f && f.c(), t = Y(), i.c(), s = Y(), _ && _.c(), g(e, "class", o = "wx-bar wx-" + /*taskTypeCss*/
    l[24](
      /*task*/
      l[44].type
    ) + " x2-1qryx5p"), g(e, "style", a = bs(
      /*task*/
      l[44]
    )), g(e, "data-tooltip-id", r = /*task*/
    l[44].id), g(e, "data-id", c = /*task*/
    l[44].id), Q(
      e,
      "wx-touch",
      /*touched*/
      l[5] && /*taskMove*/
      l[4] && /*task*/
      l[44].id == /*taskMove*/
      l[4].id
    ), Q(
      e,
      "wx-selected",
      /*linkFrom*/
      l[3] && /*linkFrom*/
      l[3].id === /*task*/
      l[44].id
    ), Q(
      e,
      "wx-reorder-task",
      /*task*/
      l[44].$reorder
    );
  }, m(w, b) {
    S(w, e, b), f && f.m(e, null), H(e, t), h[n].m(e, null), H(e, s), _ && _.m(e, null), u = true;
  }, p(w, b) {
    w[0] ? f && (f.d(1), f = null) : f ? f.p(w, b) : (f = fs(w), f.c(), f.m(e, t));
    let p = n;
    n = m(w), n === p ? h[n].p(w, b) : (te(), y(h[p], 1, 1, () => {
      h[p] = null;
    }), ne(), i = h[n], i ? i.p(w, b) : (i = h[n] = d[n](w), i.c()), k(i, 1), i.m(e, s)), /*readonly*/
    w[0] ? _ && (_.d(1), _ = null) : _ ? _.p(w, b) : (_ = ms(w), _.c(), _.m(e, null)), (!u || b[0] & /*tasks*/
    4 && o !== (o = "wx-bar wx-" + /*taskTypeCss*/
    w[24](
      /*task*/
      w[44].type
    ) + " x2-1qryx5p")) && g(e, "class", o), (!u || b[0] & /*tasks*/
    4 && a !== (a = bs(
      /*task*/
      w[44]
    ))) && g(e, "style", a), (!u || b[0] & /*tasks*/
    4 && r !== (r = /*task*/
    w[44].id)) && g(e, "data-tooltip-id", r), (!u || b[0] & /*tasks*/
    4 && c !== (c = /*task*/
    w[44].id)) && g(e, "data-id", c), (!u || b[0] & /*tasks, touched, taskMove, tasks*/
    52) && Q(
      e,
      "wx-touch",
      /*touched*/
      w[5] && /*taskMove*/
      w[4] && /*task*/
      w[44].id == /*taskMove*/
      w[4].id
    ), (!u || b[0] & /*tasks, linkFrom, tasks*/
    12) && Q(
      e,
      "wx-selected",
      /*linkFrom*/
      w[3] && /*linkFrom*/
      w[3].id === /*task*/
      w[44].id
    ), (!u || b[0] & /*tasks, tasks*/
    4) && Q(
      e,
      "wx-reorder-task",
      /*task*/
      w[44].$reorder
    );
  }, i(w) {
    u || (k(i), u = true);
  }, o(w) {
    y(i), u = false;
  }, d(w) {
    w && v(e), f && f.d(), h[n].d(), _ && _.d();
  } };
}
__name(us, "us");
function fs(l) {
  let e;
  return { c() {
    e = D("div"), e.innerHTML = '<div class="wx-inner x2-1qryx5p"></div>', g(e, "class", "wx-link wx-left x2-1qryx5p"), Q(
      e,
      "wx-visible",
      /*linkFrom*/
      l[3]
    ), Q(e, "wx-target", !/*linkFrom*/
    l[3] || !/*alreadyLinked*/
    l[23](
      /*task*/
      l[44].id,
      true
    )), Q(
      e,
      "wx-selected",
      /*linkFrom*/
      l[3] && /*linkFrom*/
      l[3].id === /*task*/
      l[44].id && /*linkFrom*/
      l[3].start
    );
  }, m(t, n) {
    S(t, e, n);
  }, p(t, n) {
    n[0] & /*linkFrom*/
    8 && Q(
      e,
      "wx-visible",
      /*linkFrom*/
      t[3]
    ), n[0] & /*linkFrom, alreadyLinked, tasks*/
    8388620 && Q(e, "wx-target", !/*linkFrom*/
    t[3] || !/*alreadyLinked*/
    t[23](
      /*task*/
      t[44].id,
      true
    )), n[0] & /*linkFrom, tasks*/
    12 && Q(
      e,
      "wx-selected",
      /*linkFrom*/
      t[3] && /*linkFrom*/
      t[3].id === /*task*/
      t[44].id && /*linkFrom*/
      t[3].start
    );
  }, d(t) {
    t && v(e);
  } };
}
__name(fs, "fs");
function Im(l) {
  let e, t, n, i, s, o;
  const a = [Am, Om], r = [];
  function c(u, f) {
    return (
      /*taskTemplate*/
      u[1] ? 0 : 1
    );
  }
  __name(c, "c");
  return n = c(l), i = r[n] = a[n](l), { c() {
    e = D("div"), t = Y(), i.c(), s = se(), g(e, "class", "wx-content x2-1qryx5p");
  }, m(u, f) {
    S(u, e, f), S(u, t, f), r[n].m(u, f), S(u, s, f), o = true;
  }, p(u, f) {
    let d = n;
    n = c(u), n === d ? r[n].p(u, f) : (te(), y(r[d], 1, 1, () => {
      r[d] = null;
    }), ne(), i = r[n], i ? i.p(u, f) : (i = r[n] = a[n](u), i.c()), k(i, 1), i.m(s.parentNode, s));
  }, i(u) {
    o || (k(i), o = true);
  }, o(u) {
    y(i), o = false;
  }, d(u) {
    u && (v(e), v(t), v(s)), r[n].d(u);
  } };
}
__name(Im, "Im");
function Rm(l) {
  let e, t, n, i, s, o, a = (
    /*task*/
    l[44].progress && ds(l)
  ), r = !/*readonly*/
  l[0] && hs(l);
  const c = [Pm, Fm], u = [];
  function f(d, h) {
    return (
      /*taskTemplate*/
      d[1] ? 0 : 1
    );
  }
  __name(f, "f");
  return n = f(l), i = u[n] = c[n](l), { c() {
    a && a.c(), e = Y(), r && r.c(), t = Y(), i.c(), s = se();
  }, m(d, h) {
    a && a.m(d, h), S(d, e, h), r && r.m(d, h), S(d, t, h), u[n].m(d, h), S(d, s, h), o = true;
  }, p(d, h) {
    d[44].progress ? a ? a.p(d, h) : (a = ds(d), a.c(), a.m(e.parentNode, e)) : a && (a.d(1), a = null), /*readonly*/
    d[0] ? r && (r.d(1), r = null) : r ? r.p(d, h) : (r = hs(d), r.c(), r.m(t.parentNode, t));
    let m = n;
    n = f(d), n === m ? u[n].p(d, h) : (te(), y(u[m], 1, 1, () => {
      u[m] = null;
    }), ne(), i = u[n], i ? i.p(d, h) : (i = u[n] = c[n](d), i.c()), k(i, 1), i.m(s.parentNode, s));
  }, i(d) {
    o || (k(i), o = true);
  }, o(d) {
    y(i), o = false;
  }, d(d) {
    d && (v(e), v(t), v(s)), a && a.d(d), r && r.d(d), u[n].d(d);
  } };
}
__name(Rm, "Rm");
function Om(l) {
  let e, t = (
    /*task*/
    l[44].text + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-text-out x2-1qryx5p");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s[0] & /*tasks*/
    4 && t !== (t = /*task*/
    i[44].text + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(Om, "Om");
function Am(l) {
  let e, t, n;
  var i = (
    /*taskTemplate*/
    l[1]
  );
  function s(o, a) {
    return { props: { data: (
      /*task*/
      o[44]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*forward*/
    l[25]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a[0] & /*taskTemplate*/
    2 && i !== (i = /*taskTemplate*/
    o[1])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*forward*/
        o[25]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a[0] & /*tasks*/
      4 && (r.data = /*task*/
      o[44]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(Am, "Am");
function ds(l) {
  let e, t;
  return { c() {
    e = D("div"), t = D("div"), g(t, "class", "wx-progress-percent x2-1qryx5p"), j(
      t,
      "width",
      /*task*/
      l[44].progress + "%"
    ), g(e, "class", "wx-progress-wrapper x2-1qryx5p");
  }, m(n, i) {
    S(n, e, i), H(e, t);
  }, p(n, i) {
    i[0] & /*tasks*/
    4 && j(
      t,
      "width",
      /*task*/
      n[44].progress + "%"
    );
  }, d(n) {
    n && v(e);
  } };
}
__name(ds, "ds");
function hs(l) {
  let e, t = (
    /*task*/
    l[44].progress + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-progress-marker x2-1qryx5p"), j(e, "left", "calc(" + /*task*/
    l[44].progress + "% - 10px)");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s[0] & /*tasks*/
    4 && t !== (t = /*task*/
    i[44].progress + "") && me(n, t), s[0] & /*tasks*/
    4 && j(e, "left", "calc(" + /*task*/
    i[44].progress + "% - 10px)");
  }, d(i) {
    i && v(e);
  } };
}
__name(hs, "hs");
function Fm(l) {
  let e, t = (
    /*task*/
    (l[44].text || "") + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-content x2-1qryx5p");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s[0] & /*tasks*/
    4 && t !== (t = /*task*/
    (i[44].text || "") + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(Fm, "Fm");
function Pm(l) {
  let e, t, n;
  var i = (
    /*taskTemplate*/
    l[1]
  );
  function s(o, a) {
    return { props: { data: (
      /*task*/
      o[44]
    ) } };
  }
  __name(s, "s");
  return i && (e = Le(i, s(l)), e.$on(
    "action",
    /*forward*/
    l[25]
  )), { c() {
    e && F(e.$$.fragment), t = se();
  }, m(o, a) {
    e && R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    if (a[0] & /*taskTemplate*/
    2 && i !== (i = /*taskTemplate*/
    o[1])) {
      if (e) {
        te();
        const r = e;
        y(r.$$.fragment, 1, 0, () => {
          O(r, 1);
        }), ne();
      }
      i ? (e = Le(i, s(o)), e.$on(
        "action",
        /*forward*/
        o[25]
      ), F(e.$$.fragment), k(e.$$.fragment, 1), R(e, t.parentNode, t)) : e = null;
    } else if (i) {
      const r = {};
      a[0] & /*tasks*/
      4 && (r.data = /*task*/
      o[44]), e.$set(r);
    }
  }, i(o) {
    n || (e && k(e.$$.fragment, o), n = true);
  }, o(o) {
    e && y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), e && O(e, o);
  } };
}
__name(Pm, "Pm");
function ms(l) {
  let e;
  return { c() {
    e = D("div"), e.innerHTML = '<div class="wx-inner x2-1qryx5p"></div>', g(e, "class", "wx-link wx-right x2-1qryx5p"), Q(
      e,
      "wx-visible",
      /*linkFrom*/
      l[3]
    ), Q(e, "wx-target", !/*linkFrom*/
    l[3] || !/*alreadyLinked*/
    l[23](
      /*task*/
      l[44].id,
      false
    )), Q(
      e,
      "wx-selected",
      /*linkFrom*/
      l[3] && /*linkFrom*/
      l[3].id === /*task*/
      l[44].id && !/*linkFrom*/
      l[3].start
    );
  }, m(t, n) {
    S(t, e, n);
  }, p(t, n) {
    n[0] & /*linkFrom*/
    8 && Q(
      e,
      "wx-visible",
      /*linkFrom*/
      t[3]
    ), n[0] & /*linkFrom, alreadyLinked, tasks*/
    8388620 && Q(e, "wx-target", !/*linkFrom*/
    t[3] || !/*alreadyLinked*/
    t[23](
      /*task*/
      t[44].id,
      false
    )), n[0] & /*linkFrom, tasks*/
    12 && Q(
      e,
      "wx-selected",
      /*linkFrom*/
      t[3] && /*linkFrom*/
      t[3].id === /*task*/
      t[44].id && !/*linkFrom*/
      t[3].start
    );
  }, d(t) {
    t && v(e);
  } };
}
__name(ms, "ms");
function _s(l) {
  let e, t;
  return { c() {
    e = D("div"), g(e, "class", "wx-baseline x2-1qryx5p"), g(e, "style", t = ks(
      /*task*/
      l[44]
    )), Q(
      e,
      "wx-milestone",
      /*task*/
      l[44].type === "milestone"
    );
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i[0] & /*tasks*/
    4 && t !== (t = ks(
      /*task*/
      n[44]
    )) && g(e, "style", t), i[0] & /*tasks*/
    4 && Q(
      e,
      "wx-milestone",
      /*task*/
      n[44].type === "milestone"
    );
  }, d(n) {
    n && v(e);
  } };
}
__name(_s, "_s");
function gs(l, e) {
  let t, n, i, s, o = !/*task*/
  e[44].$skip && us(e), a = (
    /*$baselines*/
    e[7] && !/*task*/
    e[44].$skip_baseline && _s(e)
  );
  return { key: l, first: null, c() {
    t = se(), o && o.c(), n = Y(), a && a.c(), i = se(), this.first = t;
  }, m(r, c) {
    S(r, t, c), o && o.m(r, c), S(r, n, c), a && a.m(r, c), S(r, i, c), s = true;
  }, p(r, c) {
    e = r, /*task*/
    e[44].$skip ? o && (te(), y(o, 1, 1, () => {
      o = null;
    }), ne()) : o ? (o.p(e, c), c[0] & /*tasks*/
    4 && k(o, 1)) : (o = us(e), o.c(), k(o, 1), o.m(n.parentNode, n)), /*$baselines*/
    e[7] && !/*task*/
    e[44].$skip_baseline ? a ? a.p(e, c) : (a = _s(e), a.c(), a.m(i.parentNode, i)) : a && (a.d(1), a = null);
  }, i(r) {
    s || (k(o), s = true);
  }, o(r) {
    y(o), s = false;
  }, d(r) {
    r && (v(t), v(n), v(i)), o && o.d(r), a && a.d(r);
  } };
}
__name(gs, "gs");
function Ym(l) {
  let e, t = [], n = /* @__PURE__ */ new Map(), i, s, o, a, r = de(
    /*tasks*/
    l[2]
  );
  const c = /* @__PURE__ */ __name((u) => (
    /*task*/
    u[44].id
  ), "c");
  for (let u = 0; u < r.length; u += 1) {
    let f = cs(l, r, u), d = c(f);
    n.set(d, t[u] = gs(d, f));
  }
  return { c() {
    e = D("div");
    for (let u = 0; u < t.length; u += 1) t[u].c();
    g(e, "class", "wx-bars x2-1qryx5p"), j(
      e,
      "line-height",
      /*tasks*/
      (l[2].length ? (
        /*tasks*/
        l[2][0].$h
      ) : 0) + "px"
    ), Vt(() => (
      /*div_elementresize_handler*/
      l[29].call(e)
    ));
  }, m(u, f) {
    S(u, e, f);
    for (let d = 0; d < t.length; d += 1) t[d] && t[d].m(e, null);
    i = sl(
      e,
      /*div_elementresize_handler*/
      l[29].bind(e)
    ), s = true, o || (a = [q(
      window,
      "mouseup",
      /*mouseup*/
      l[18]
    ), q(
      e,
      "contextmenu",
      /*contextmenu*/
      l[22]
    ), q(
      e,
      "mousedown",
      /*mousedown*/
      l[14]
    ), q(
      e,
      "mousemove",
      /*mousemove*/
      l[17]
    ), q(
      e,
      "touchstart",
      /*touchstart*/
      l[15]
    ), q(
      e,
      "touchmove",
      /*touchmove*/
      l[16]
    ), q(
      e,
      "touchend",
      /*touchend*/
      l[19],
      { passive: true }
    ), q(
      e,
      "click",
      /*onClick*/
      l[21]
    ), q(
      e,
      "dblclick",
      /*onDblClick*/
      l[20]
    ), q(e, "dragstart", jm)], o = true);
  }, p(u, f) {
    f[0] & /*tasks, $baselines, taskTypeCss, touched, taskMove, linkFrom, alreadyLinked, readonly, taskTemplate, forward*/
    58720447 && (r = de(
      /*tasks*/
      u[2]
    ), te(), t = kt(t, f, c, 1, u, r, n, e, en, gs, null, cs), ne()), (!s || f[0] & /*tasks*/
    4) && j(
      e,
      "line-height",
      /*tasks*/
      (u[2].length ? (
        /*tasks*/
        u[2][0].$h
      ) : 0) + "px"
    );
  }, i(u) {
    if (!s) {
      for (let f = 0; f < r.length; f += 1) k(t[f]);
      s = true;
    }
  }, o(u) {
    for (let f = 0; f < t.length; f += 1) y(t[f]);
    s = false;
  }, d(u) {
    u && v(e);
    for (let f = 0; f < t.length; f += 1) t[f].d();
    i(), o = false, Ee(a);
  } };
}
__name(Ym, "Ym");
function Bm() {
  document.body.style.userSelect = "none";
}
__name(Bm, "Bm");
function ws() {
  document.body.style.userSelect = "";
}
__name(ws, "ws");
function bs(l) {
  return `left:${l.$x}px;top:${l.$y}px;width:${l.$w}px;height:${l.$h}px;`;
}
__name(bs, "bs");
function ks(l) {
  return `left:${l.$x_base}px;top:${l.$y_base}px;width:${l.$w_base}px;height:${l.$h_base}px;`;
}
__name(ks, "ks");
var jm = /* @__PURE__ */ __name(() => false, "jm");
function Zm(l, e, t) {
  let n, i, s, o, a, r, c, { readonly: u } = e, { taskTemplate: f } = e;
  const d = ze("gantt-store"), { _tasks: h, _links: m, area: _, _scales: w, taskTypes: b, baselines: p } = d.getReactiveState();
  ce(l, h, (J) => t(28, r = J)), ce(l, m, (J) => t(35, s = J)), ce(l, _, (J) => t(27, a = J)), ce(l, w, (J) => t(26, o = J)), ce(l, b, (J) => t(34, i = J)), ce(l, p, (J) => t(7, c = J));
  let z, T = false, W, M = null, C = null, P, X;
  function A(J) {
    if (J.button !== 0) return;
    const oe = wt(J);
    oe && V(oe, J);
  }
  __name(A, "A");
  function B(J) {
    const oe = wt(J);
    oe && (X = setTimeout(() => {
      t(5, P = true), V(oe, J.touches[0]);
    }, 300));
  }
  __name(B, "B");
  function V(J, oe) {
    const { clientX: we } = oe, E = fn(J), le = d.getTask(E), _e = oe.target.classList;
    if (!u) {
      if (_e.contains("wx-progress-marker")) {
        const { progress: ke } = d.getTask(E);
        C = { id: E, x: we, progress: ke, dx: 0, node: J, marker: oe.target }, oe.target.classList.add("wx-progress-in-drag");
      } else {
        const ke = fe(J, oe, le) || "move";
        t(4, M = { id: E, mode: ke, x: we, dx: 0, l: le.$x, w: le.$w });
      }
      Bm();
    }
  }
  __name(V, "V");
  function fe(J, oe, we) {
    if (we || (we = d.getTask(fn(J))), we.type === "milestone" || we.type == "summary") return "";
    const E = J.getBoundingClientRect(), le = (oe.clientX - E.left) / E.width;
    let _e = 0.2 / (E.width > 200 ? E.width / 200 : 1);
    return le < _e ? "start" : le > 1 - _e ? "end" : "";
  }
  __name(fe, "fe");
  function L(J) {
    P ? (J.preventDefault(), G(J, J.touches[0])) : X && (clearTimeout(X), X = null);
  }
  __name(L, "L");
  function Ye(J) {
    G(J, J);
  }
  __name(Ye, "Ye");
  function G(J, oe) {
    const { clientX: we } = oe;
    if (!u) if (C) {
      const { node: E, x: le, id: _e } = C, ke = C.dx = we - le, Pe = Math.round(ke / E.offsetWidth * 100);
      let Be = C.progress + Pe;
      C.value = Be = Math.min(Math.max(0, Be), 100), d.exec("update-task", { id: _e, task: { progress: Be }, inProgress: true });
    } else if (M) {
      const { mode: E, l: le, w: _e, x: ke, id: Pe, start: Be } = M, je = we - ke;
      if (!Be && Math.abs(je) < 20 || E === "start" && _e - je < n || E === "end" && _e + je < n || E == "move" && (je < 0 && le + je < 0 || je > 0 && le + _e + je > Fe)) return;
      t(4, M.dx = je, M);
      let Xe, it;
      E === "start" ? (Xe = le + je, it = _e - je) : E === "end" ? (Xe = le, it = _e + je) : E === "move" && (Xe = le + je, it = _e);
      let pt = { id: Pe, width: it, left: Xe, inProgress: true };
      d.exec("drag-task", pt);
      const mt = d.getTask(Pe);
      if (!M.start && (E == "move" && mt.$x == le || E != "move" && mt.$w == _e)) return T = true, K();
      t(4, M.start = true, M);
    } else {
      const E = wt(J);
      if (E) {
        const le = fe(E, oe);
        E.style.cursor = le && !u ? "col-resize" : "pointer";
      }
    }
  }
  __name(G, "G");
  function pe() {
    K();
  }
  __name(pe, "pe");
  function Se() {
    t(5, P = null), X && (clearTimeout(X), X = null), K();
  }
  __name(Se, "Se");
  function K() {
    if (C) {
      const { dx: J, id: oe, marker: we, value: E } = C;
      C = null, typeof E < "u" && J && d.exec("update-task", { id: oe, task: { progress: E } }), we.classList.remove("wx-progress-in-drag"), T = true, ws();
    } else if (M) {
      const { id: J, mode: oe, dx: we, l: E, w: le, start: _e } = M;
      if (t(4, M = null), _e) {
        const ke = Math.round(we / n);
        if (!ke) d.exec("drag-task", { id: J, width: le, left: E, inProgress: false });
        else {
          let Pe = {}, Be = d.getTask(J);
          oe == "move" ? (Pe.start = Be.start, Pe.end = Be.end) : Pe[oe] = Be[oe], d.exec("update-task", { id: J, task: Pe, diff: ke });
        }
        T = true;
      }
      ws();
    }
  }
  __name(K, "K");
  function ue(J) {
    if (!u) {
      const oe = hn(J.target);
      oe && !J.target.classList.contains("wx-link") && d.exec("show-editor", { id: oe });
    }
  }
  __name(ue, "ue");
  function Ne(J) {
    if (T) {
      T = false;
      return;
    }
    const oe = hn(J.target);
    if (oe) {
      const we = J.target.classList;
      if (we.contains("wx-link")) {
        const E = we.contains("wx-left");
        if (!W) {
          t(3, W = { id: oe, start: E });
          return;
        }
        W.id !== oe && !ie(oe, E) && d.exec("add-link", { link: { source: W.id, target: oe, type: Ze(W.start, E) } });
      } else d.exec("select-task", { id: oe, toggle: J.ctrlKey || J.metaKey, range: J.shiftKey });
    }
    U();
  }
  __name(Ne, "Ne");
  function ye(J) {
    if (P || X) return J.preventDefault(), false;
  }
  __name(ye, "ye");
  const ve = ["e2s", "s2s", "e2e", "s2e"];
  function Ze(J, oe) {
    return ve[(J ? 1 : 0) + (oe ? 0 : 2)];
  }
  __name(Ze, "Ze");
  function ie(J, oe) {
    const we = W.id, E = W.start;
    return J === we ? true : s.find((le) => le.target == J && le.source == we && le.type === Ze(E, oe));
  }
  __name(ie, "ie");
  function U() {
    W && t(3, W = null);
  }
  __name(U, "U");
  function ge(J) {
    let oe = i.some((we) => J === we.id) ? J : "task";
    return oe !== "task" && oe !== "milestone" && oe !== "summary" && (oe = `task ${oe}`), oe;
  }
  __name(ge, "ge");
  function Me(J) {
    d.exec(J.detail.action, J.detail.data);
  }
  __name(Me, "Me");
  let Fe = 0;
  function Je() {
    Fe = this.offsetWidth, t(6, Fe);
  }
  __name(Je, "Je");
  return l.$$set = (J) => {
    "readonly" in J && t(0, u = J.readonly), "taskTemplate" in J && t(1, f = J.taskTemplate);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*$rTasks, $area*/
    402653184 && t(2, z = r.slice(a.start, a.end)), l.$$.dirty[0] & /*$scales*/
    67108864 && (n = o.lengthUnitWidth);
  }, [u, f, z, W, M, P, Fe, c, h, m, _, w, b, p, A, B, L, Ye, pe, Se, ue, Ne, ye, ie, ge, Me, o, a, r, Je];
}
__name(Zm, "Zm");
var _qm = class _qm extends ee {
  constructor(e) {
    super(), $(this, e, Zm, Ym, x, { readonly: 0, taskTemplate: 1 }, null, [-1, -1]);
  }
};
__name(_qm, "qm");
var qm = _qm;
function ps(l, e, t) {
  const n = l.slice();
  return n[5] = e[t], n;
}
__name(ps, "ps");
function ys(l, e) {
  let t, n;
  return { key: l, first: null, c() {
    t = ll("polyline"), g(t, "class", "wx-line x2-wfzywr"), g(t, "points", n = /*link*/
    e[5].$p), this.first = t;
  }, m(i, s) {
    S(i, t, s);
  }, p(i, s) {
    e = i, s & /*$links*/
    4 && n !== (n = /*link*/
    e[5].$p) && g(t, "points", n);
  }, d(i) {
    i && v(t);
  } };
}
__name(ys, "ys");
function Km(l) {
  let e, t = [], n = /* @__PURE__ */ new Map(), i, s, o = de(
    /*$links*/
    l[2]
  );
  const a = /* @__PURE__ */ __name((r) => (
    /*link*/
    r[5].id
  ), "a");
  for (let r = 0; r < o.length; r += 1) {
    let c = ps(l, o, r), u = a(c);
    n.set(u, t[r] = ys(u, c));
  }
  return { c() {
    e = ll("svg");
    for (let r = 0; r < t.length; r += 1) t[r].c();
    g(e, "class", "wx-links x2-wfzywr"), g(e, "width", i = /*width*/
    l[0] + "px"), g(e, "height", s = /*height*/
    l[1] + "px");
  }, m(r, c) {
    S(r, e, c);
    for (let u = 0; u < t.length; u += 1) t[u] && t[u].m(e, null);
  }, p(r, _ref74) {
    let [c] = _ref74;
    c & /*$links*/
    4 && (o = de(
      /*$links*/
      r[2]
    ), t = kt(t, c, a, 1, r, o, n, e, al, ys, null, ps)), c & /*width*/
    1 && i !== (i = /*width*/
    r[0] + "px") && g(e, "width", i), c & /*height*/
    2 && s !== (s = /*height*/
    r[1] + "px") && g(e, "height", s);
  }, i: I, o: I, d(r) {
    r && v(e);
    for (let c = 0; c < t.length; c += 1) t[c].d();
  } };
}
__name(Km, "Km");
function Gm(l, e, t) {
  let n, { width: i } = e, { height: s } = e;
  const a = ze("gantt-store").getReactiveState()._links;
  return ce(l, a, (r) => t(2, n = r)), l.$$set = (r) => {
    "width" in r && t(0, i = r.width), "height" in r && t(1, s = r.height);
  }, [i, s, n, a];
}
__name(Gm, "Gm");
var _a7;
var Xm = (_a7 = class extends ee {
  constructor(e) {
    super(), $(this, e, Gm, Km, x, { width: 0, height: 1 });
  }
}, __name(_a7, "Xm"), _a7);
function vs(l, e, t) {
  const n = l.slice();
  return n[47] = e[t], n[49] = t, n;
}
__name(vs, "vs");
function Ss(l, e, t) {
  const n = l.slice();
  return n[50] = e[t], n[52] = t, n;
}
__name(Ss, "Ss");
function Ms(l, e, t) {
  const n = l.slice();
  return n[53] = e[t], n;
}
__name(Ms, "Ms");
function Ts(l) {
  let e, t = de(
    /*markers*/
    l[1]
  ), n = [];
  for (let i = 0; i < t.length; i += 1) n[i] = Cs(Ms(l, t, i));
  return { c() {
    e = D("div");
    for (let i = 0; i < n.length; i += 1) n[i].c();
    g(e, "class", "wx-markers x2-1ff484e"), j(
      e,
      "height",
      /*markersHeight*/
      l[10] + "px"
    ), j(e, "left", -/*scrollLeft*/
    l[9] + "px");
  }, m(i, s) {
    S(i, e, s);
    for (let o = 0; o < n.length; o += 1) n[o] && n[o].m(e, null);
  }, p(i, s) {
    if (s[0] & /*markers*/
    2) {
      t = de(
        /*markers*/
        i[1]
      );
      let o;
      for (o = 0; o < t.length; o += 1) {
        const a = Ms(i, t, o);
        n[o] ? n[o].p(a, s) : (n[o] = Cs(a), n[o].c(), n[o].m(e, null));
      }
      for (; o < n.length; o += 1) n[o].d(1);
      n.length = t.length;
    }
    s[0] & /*markersHeight*/
    1024 && j(
      e,
      "height",
      /*markersHeight*/
      i[10] + "px"
    ), s[0] & /*scrollLeft*/
    512 && j(e, "left", -/*scrollLeft*/
    i[9] + "px");
  }, d(i) {
    i && v(e), $e(n, i);
  } };
}
__name(Ts, "Ts");
function Cs(l) {
  let e, t, n = (
    /*marker*/
    l[53].text + ""
  ), i, s, o;
  return { c() {
    e = D("div"), t = D("div"), i = re(n), s = Y(), g(t, "class", "wx-content x2-1ff484e"), g(e, "class", o = "wx-marker " + /*marker*/
    (l[53].css || "wx-default") + " x2-1ff484e"), j(
      e,
      "left",
      /*marker*/
      l[53].left + "px"
    );
  }, m(a, r) {
    S(a, e, r), H(e, t), H(t, i), H(e, s);
  }, p(a, r) {
    r[0] & /*markers*/
    2 && n !== (n = /*marker*/
    a[53].text + "") && me(i, n), r[0] & /*markers*/
    2 && o !== (o = "wx-marker " + /*marker*/
    (a[53].css || "wx-default") + " x2-1ff484e") && g(e, "class", o), r[0] & /*markers*/
    2 && j(
      e,
      "left",
      /*marker*/
      a[53].left + "px"
    );
  }, d(a) {
    a && v(e);
  } };
}
__name(Cs, "Cs");
function Ds(l) {
  let e, t = de(
    /*holidays*/
    l[11]
  ), n = [];
  for (let i = 0; i < t.length; i += 1) n[i] = Hs(Ss(l, t, i));
  return { c() {
    e = D("div");
    for (let i = 0; i < n.length; i += 1) n[i].c();
    g(e, "class", "wx-gantt-holidays x2-1ff484e"), j(e, "height", "100%");
  }, m(i, s) {
    S(i, e, s);
    for (let o = 0; o < n.length; o += 1) n[o] && n[o].m(e, null);
  }, p(i, s) {
    if (s[0] & /*holidays*/
    2048) {
      t = de(
        /*holidays*/
        i[11]
      );
      let o;
      for (o = 0; o < t.length; o += 1) {
        const a = Ss(i, t, o);
        n[o] ? n[o].p(a, s) : (n[o] = Hs(a), n[o].c(), n[o].m(e, null));
      }
      for (; o < n.length; o += 1) n[o].d(1);
      n.length = t.length;
    }
  }, d(i) {
    i && v(e), $e(n, i);
  } };
}
__name(Ds, "Ds");
function Ws(l) {
  let e, t;
  return { c() {
    e = D("div"), g(e, "class", t = Ve(
      /*holiday*/
      l[50].css
    ) + " x2-1ff484e"), j(
      e,
      "width",
      /*holiday*/
      l[50].width + "px"
    ), j(
      e,
      "left",
      /*i*/
      l[52] * /*holiday*/
      l[50].width + "px"
    );
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i[0] & /*holidays*/
    2048 && t !== (t = Ve(
      /*holiday*/
      n[50].css
    ) + " x2-1ff484e") && g(e, "class", t), i[0] & /*holidays*/
    2048 && j(
      e,
      "width",
      /*holiday*/
      n[50].width + "px"
    ), i[0] & /*holidays*/
    2048 && j(
      e,
      "left",
      /*i*/
      n[52] * /*holiday*/
      n[50].width + "px"
    );
  }, d(n) {
    n && v(e);
  } };
}
__name(Ws, "Ws");
function Hs(l) {
  let e, t = (
    /*holiday*/
    l[50] && Ws(l)
  );
  return { c() {
    t && t.c(), e = se();
  }, m(n, i) {
    t && t.m(n, i), S(n, e, i);
  }, p(n, i) {
    n[50] ? t ? t.p(n, i) : (t = Ws(n), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, d(n) {
    n && v(e), t && t.d(n);
  } };
}
__name(Hs, "Hs");
function zs(l) {
  let e = [], t = /* @__PURE__ */ new Map(), n, i = de(
    /*$selected*/
    l[8]
  );
  const s = /* @__PURE__ */ __name((o) => (
    /*obj*/
    o[47].id
  ), "s");
  for (let o = 0; o < i.length; o += 1) {
    let a = vs(l, i, o), r = s(a);
    t.set(r, e[o] = Ls(r, a));
  }
  return { c() {
    for (let o = 0; o < e.length; o += 1) e[o].c();
    n = se();
  }, m(o, a) {
    for (let r = 0; r < e.length; r += 1) e[r] && e[r].m(o, a);
    S(o, n, a);
  }, p(o, a) {
    a[0] & /*$selected, selectStyle*/
    384 && (i = de(
      /*$selected*/
      o[8]
    ), e = kt(e, a, s, 1, o, i, t, n.parentNode, al, Ls, n, vs));
  }, d(o) {
    o && v(n);
    for (let a = 0; a < e.length; a += 1) e[a].d(o);
  } };
}
__name(zs, "zs");
function Ns(l) {
  let e, t, n;
  return { c() {
    e = D("div"), g(e, "class", "wx-selected x2-1ff484e"), g(e, "data-id", t = /*obj*/
    l[47].id), g(e, "style", n = /*selectStyle*/
    l[7][
      /*index*/
      l[49]
    ]);
  }, m(i, s) {
    S(i, e, s);
  }, p(i, s) {
    s[0] & /*$selected*/
    256 && t !== (t = /*obj*/
    i[47].id) && g(e, "data-id", t), s[0] & /*selectStyle, $selected*/
    384 && n !== (n = /*selectStyle*/
    i[7][
      /*index*/
      i[49]
    ]) && g(e, "style", n);
  }, d(i) {
    i && v(e);
  } };
}
__name(Ns, "Ns");
function Ls(l, e) {
  let t, n, i = (
    /*obj*/
    e[47].$y && Ns(e)
  );
  return { key: l, first: null, c() {
    t = se(), i && i.c(), n = se(), this.first = t;
  }, m(s, o) {
    S(s, t, o), i && i.m(s, o), S(s, n, o);
  }, p(s, o) {
    e = s, /*obj*/
    e[47].$y ? i ? i.p(e, o) : (i = Ns(e), i.c(), i.m(n.parentNode, n)) : i && (i.d(1), i = null);
  }, d(s) {
    s && (v(t), v(n)), i && i.d(s);
  } };
}
__name(Ls, "Ls");
function Vm(l) {
  let e, t, n, i, s, o, a, r, c, u, f, d, h, m = (
    /*markers*/
    l[1].length && Ts(l)
  ), _ = (
    /*holidays*/
    l[11] && Ds(l)
  );
  s = new Em({ props: { borders: (
    /*cellBorders*/
    l[5]
  ) } });
  let w = (
    /*$selected*/
    l[8].length && zs(l)
  );
  return r = new Xm({ props: { width: (
    /*fullWidth*/
    l[2]
  ), height: (
    /*fullHeight*/
    l[3]
  ) } }), u = new qm({ props: { readonly: (
    /*readonly*/
    l[0]
  ), taskTemplate: (
    /*taskTemplate*/
    l[4]
  ) } }), { c() {
    e = D("div"), m && m.c(), t = Y(), n = D("div"), _ && _.c(), i = Y(), F(s.$$.fragment), o = Y(), w && w.c(), a = Y(), F(r.$$.fragment), c = Y(), F(u.$$.fragment), g(n, "class", "wx-area x2-1ff484e"), j(
      n,
      "width",
      /*fullWidth*/
      l[2] + "px"
    ), j(
      n,
      "height",
      /*fullHeight*/
      l[3] + "px"
    ), g(e, "class", "wx-chart x2-1ff484e");
  }, m(b, p) {
    S(b, e, p), m && m.m(e, null), H(e, t), H(e, n), _ && _.m(n, null), H(n, i), R(s, n, null), H(n, o), w && w.m(n, null), H(n, a), R(r, n, null), H(n, c), R(u, n, null), l[32](e), f = true, d || (h = [q(
      window,
      "resize",
      /*dataRequest*/
      l[23]
    ), q(
      e,
      "scroll",
      /*onScroll*/
      l[22]
    ), q(
      e,
      "wheel",
      /*onWheel*/
      l[24]
    )], d = true);
  }, p(b, p) {
    b[1].length ? m ? m.p(b, p) : (m = Ts(b), m.c(), m.m(e, t)) : m && (m.d(1), m = null), /*holidays*/
    b[11] ? _ ? _.p(b, p) : (_ = Ds(b), _.c(), _.m(n, i)) : _ && (_.d(1), _ = null);
    const z = {};
    p[0] & /*cellBorders*/
    32 && (z.borders = /*cellBorders*/
    b[5]), s.$set(z), /*$selected*/
    b[8].length ? w ? w.p(b, p) : (w = zs(b), w.c(), w.m(n, a)) : w && (w.d(1), w = null);
    const T = {};
    p[0] & /*fullWidth*/
    4 && (T.width = /*fullWidth*/
    b[2]), p[0] & /*fullHeight*/
    8 && (T.height = /*fullHeight*/
    b[3]), r.$set(T);
    const W = {};
    p[0] & /*readonly*/
    1 && (W.readonly = /*readonly*/
    b[0]), p[0] & /*taskTemplate*/
    16 && (W.taskTemplate = /*taskTemplate*/
    b[4]), u.$set(W), (!f || p[0] & /*fullWidth*/
    4) && j(
      n,
      "width",
      /*fullWidth*/
      b[2] + "px"
    ), (!f || p[0] & /*fullHeight*/
    8) && j(
      n,
      "height",
      /*fullHeight*/
      b[3] + "px"
    );
  }, i(b) {
    f || (k(s.$$.fragment, b), k(r.$$.fragment, b), k(u.$$.fragment, b), f = true);
  }, o(b) {
    y(s.$$.fragment, b), y(r.$$.fragment, b), y(u.$$.fragment, b), f = false;
  }, d(b) {
    b && v(e), m && m.d(), _ && _.d(), O(s), w && w.d(), O(r), O(u), l[32](null), d = false, Ee(h);
  } };
}
__name(Vm, "Vm");
var Es = 0;
function Um(l, e, t) {
  let n, i, s, o, a, r, c, u, f, d, h, m, { readonly: _ } = e, { markers: w } = e, { fullWidth: b } = e, { fullHeight: p } = e, { taskTemplate: z } = e, { cellBorders: T } = e, { highlightTime: W } = e;
  const M = He(), C = ze("gantt-store"), { _selected: P, scrollLeft: X, scrollTop: A, cellWidth: B, cellHeight: V, _scales: fe, zoom: L, _start: Ye, context: G, _scrollSelected: pe } = C.getReactiveState();
  ce(l, P, (E) => t(8, f = E)), ce(l, X, (E) => t(31, m = E)), ce(l, A, (E) => t(30, h = E)), ce(l, B, (E) => t(38, c = E)), ce(l, V, (E) => t(28, r = E)), ce(l, fe, (E) => t(27, s = E)), ce(l, L, (E) => t(36, o = E)), ce(l, Ye, (E) => t(37, a = E)), ce(l, G, (E) => t(39, u = E)), ce(l, pe, (E) => t(29, d = E));
  let Se, K, ue = {}, Ne = 0, ye = [], ve, Ze;
  ht(() => {
    Me();
  }), kn(() => {
    t(6, ue.scrollTop = K, ue), t(6, ue.scrollLeft = Se, ue), K != ue.scrollTop && ge({ top: true }), Se != ue.scrollLeft && ge({ left: true });
  });
  function ie() {
    ge({ left: true, top: true }, true), Me();
  }
  __name(ie, "ie");
  function U(E) {
    M("scale-params", E || { date: Je(ue.scrollLeft) });
  }
  __name(U, "U");
  function ge(E, le) {
    const _e = {};
    E.top && (_e.top = ue.scrollTop), Ze && clearTimeout(Ze), E.left && (_e.left = ue.scrollLeft, le ? Ze = setTimeout(function() {
      U();
    }, 100) : U()), C.exec("scroll-chart", _e);
  }
  __name(ge, "ge");
  function Me() {
    const E = ue.clientHeight || 0, le = Math.ceil(E / r) + 1, _e = Math.floor((ue.scrollTop || 0) / r), ke = Math.max(0, _e - Es), Pe = _e + le + Es, Be = ke * r;
    C.exec("render-data", { start: ke, end: Pe, from: Be });
  }
  __name(Me, "Me");
  function Fe(E) {
    if (u) return;
    const { clientHeight: le, clientWidth: _e } = ue;
    if (E.$x < Se) t(9, Se = E.$x - c);
    else if (E.$x + E.$w >= _e + Se) {
      const ke = _e < E.$w ? c : E.$w;
      t(9, Se = E.$x - _e + ke);
    }
    E.$y < K ? K = E.$y - r : E.$y + E.$h >= le + K && (K = E.$y - le + r);
  }
  __name(Fe, "Fe");
  function Je(E) {
    const le = s.lengthUnit === "day" ? n / 24 : n;
    return ft("hour")(bt(s.minUnit, a), Math.floor(E / le));
  }
  __name(Je, "Je");
  function J(E) {
    if (o && (E.ctrlKey || E.metaKey)) {
      E.preventDefault();
      const le = -Math.sign(E.deltaY), _e = E.clientX - ue.getBoundingClientRect().left, ke = _e + Se, Pe = Je(ke);
      U({ offset: _e, date: Pe }), C.exec("zoom-scale", { dir: le, date: Pe, offset: _e });
    }
  }
  __name(J, "J");
  function oe(E) {
    const le = W(E.date, E.unit);
    return le ? { css: le, width: E.width } : null;
  }
  __name(oe, "oe");
  function we(E) {
    be[E ? "unshift" : "push"](() => {
      ue = E, t(6, ue);
    });
  }
  __name(we, "we");
  return l.$$set = (E) => {
    "readonly" in E && t(0, _ = E.readonly), "markers" in E && t(1, w = E.markers), "fullWidth" in E && t(2, b = E.fullWidth), "fullHeight" in E && t(3, p = E.fullHeight), "taskTemplate" in E && t(4, z = E.taskTemplate), "cellBorders" in E && t(5, T = E.cellBorders), "highlightTime" in E && t(25, W = E.highlightTime);
  }, l.$$.update = () => {
    if (l.$$.dirty[0] & /*$scales*/
    134217728 && (n = s.lengthUnitWidth), l.$$.dirty[1] & /*$rScrollLeft*/
    1 && t(9, Se = m), l.$$.dirty[0] & /*$rScrollTop*/
    1073741824 && (K = h), l.$$.dirty[0] & /*$selected, $cellHeight, selectStyle, $scrollSelected, lastSelectedId*/
    872415616 && f.length && r && (t(7, ye = []), f.forEach((E) => {
      ye.push([`height: ${r}px;top: ${E.$y - 3}px`]);
    }), d)) {
      const E = f[f.length - 1];
      ve !== E.id && (t(26, ve = E.id), Fe(E));
    }
    l.$$.dirty[0] & /*$cellHeight*/
    268435456 && r && Me(), l.$$.dirty[0] & /*fullHeight, chart*/
    72 && t(10, Ne = p > ue.clientHeight ? ue.clientHeight : p), l.$$.dirty[0] & /*$scales, highlightTime*/
    167772160 && t(11, i = (s.minUnit === "hour" || s.minUnit === "day") && W ? s.rows[s.rows.length - 1].cells.map(oe) : null);
  }, [_, w, b, p, z, T, ue, ye, f, Se, Ne, i, P, X, A, B, V, fe, L, Ye, G, pe, ie, Me, J, W, ve, s, r, d, h, m, we];
}
__name(Um, "Um");
var _Jm = class _Jm extends ee {
  constructor(e) {
    super(), $(this, e, Um, Vm, x, { readonly: 0, markers: 1, fullWidth: 2, fullHeight: 3, taskTemplate: 4, cellBorders: 5, highlightTime: 25 }, null, [-1, -1]);
  }
};
__name(_Jm, "Jm");
var Jm = _Jm;
function Kn() {
}
__name(Kn, "Kn");
function Qm(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
__name(Qm, "Qm");
var Zt = [];
function xm(l) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Kn;
  let t;
  const n = /* @__PURE__ */ new Set();
  function i(a) {
    if (Qm(l, a) && (l = a, t)) {
      const r = !Zt.length;
      for (const c of n) c[1](), Zt.push(c, l);
      if (r) {
        for (let c = 0; c < Zt.length; c += 2) Zt[c][0](Zt[c + 1]);
        Zt.length = 0;
      }
    }
  }
  __name(i, "i");
  function s(a) {
    i(a(l));
  }
  __name(s, "s");
  function o(a) {
    let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Kn;
    const c = [a, r];
    return n.add(c), n.size === 1 && (t = e(i, s) || Kn), a(l), () => {
      n.delete(c), n.size === 0 && t && (t(), t = null);
    };
  }
  __name(o, "o");
  return { set: i, update: s, subscribe: o };
}
__name(xm, "xm");
(/* @__PURE__ */ new Date()).valueOf();
function $m(l, e) {
  if (Object.keys(l).length !== Object.keys(e).length) return false;
  for (const t in e) {
    const n = l[t], i = e[t];
    if (!Ln(n, i)) return false;
  }
  return true;
}
__name($m, "$m");
function Ln(l, e) {
  if (typeof l == "number" || typeof l == "string" || typeof l == "boolean" || l === null) return l === e;
  if (typeof l != typeof e || (l === null || e === null) && l !== e || l instanceof Date && e instanceof Date && l.getTime() !== e.getTime()) return false;
  if (typeof l == "object") if (Array.isArray(l) && Array.isArray(e)) {
    if (l.length !== e.length) return false;
    for (let n = l.length - 1; n >= 0; n--) if (!Ln(l[n], e[n])) return false;
    return true;
  } else return $m(l, e);
  return l === e;
}
__name(Ln, "Ln");
function Tn(l, e) {
  return { ...l };
}
__name(Tn, "Tn");
function e1(l, e, t) {
  let n = false;
  const i = xm(l), { set: s } = i;
  let o = Tn(l);
  return i.set = function(a) {
    Ln(o, a) || (o = Tn(a), s(a));
  }, i.update = function(a) {
    const r = a(Tn(o));
    Ln(o, r) || (o = Tn(r), s(r));
  }, i.reset = function(a) {
    n = false, o = {}, i.set(a);
  }, i.subscribe((a) => {
    n ? a && e(a) : n = true;
  }), i;
}
__name(e1, "e1");
function t1(l) {
  let e, t, n, i, s, o, a, r, c, u, f, d;
  return { c() {
    e = D("div"), t = D("label"), n = re(
      /*label*/
      l[1]
    ), i = Y(), s = D("div"), o = D("button"), o.innerHTML = '<svg class="wx-dec x2-1nc55he" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2501 1.74994H0.750092V0.249939H11.2501V1.74994Z"></path></svg>', a = Y(), r = D("input"), c = Y(), u = D("button"), u.innerHTML = `<svg class="wx-inc x2-1nc55he" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2501
					6.74994H6.75009V11.2499H5.25009V6.74994H0.750092V5.24994H5.25009V0.749939H6.75009V5.24994H11.2501V6.74994Z"></path></svg>`, g(t, "class", "wx-label x2-1nc55he"), g(
      t,
      "for",
      /*id*/
      l[7]
    ), g(o, "class", "wx-btn wx-btn-dec x2-1nc55he"), g(
      r,
      "id",
      /*id*/
      l[7]
    ), g(r, "type", "text"), g(r, "class", "wx-input x2-1nc55he"), r.required = true, Q(
      r,
      "wx-error",
      /*error*/
      l[2]
    ), g(u, "class", "wx-btn wx-btn-inc x2-1nc55he"), g(s, "class", "wx-controls x2-1nc55he"), g(e, "class", "wx-counter x2-1nc55he");
  }, m(h, m) {
    S(h, e, m), H(e, t), H(t, n), H(e, i), H(e, s), H(s, o), H(s, a), H(s, r), Ue(
      r,
      /*value*/
      l[0]
    ), H(s, c), H(s, u), f || (d = [q(
      o,
      "click",
      /*dec*/
      l[3]
    ), q(
      r,
      "input",
      /*input_1_input_handler*/
      l[11]
    ), q(
      r,
      "blur",
      /*blur*/
      l[5]
    ), q(
      r,
      "input",
      /*input*/
      l[6]
    ), q(
      u,
      "click",
      /*inc*/
      l[4]
    )], f = true);
  }, p(h, _ref75) {
    let [m] = _ref75;
    m & /*label*/
    2 && me(
      n,
      /*label*/
      h[1]
    ), m & /*value*/
    1 && r.value !== /*value*/
    h[0] && Ue(
      r,
      /*value*/
      h[0]
    ), m & /*error*/
    4 && Q(
      r,
      "wx-error",
      /*error*/
      h[2]
    );
  }, i: I, o: I, d(h) {
    h && v(e), f = false, Ee(d);
  } };
}
__name(t1, "t1");
function n1(l, e, t) {
  let { label: n = "" } = e, { value: i = 0 } = e, { step: s = 1 } = e, { min: o = 1 } = e, { max: a = 1 / 0 } = e;
  const r = He(), c = new RegExp("^[0-9]+$");
  let u = false;
  function f() {
    i <= o || (t(0, i -= s), r("change", { value: i }));
  }
  __name(f, "f");
  function d() {
    i >= a || (t(0, i += s), r("change", { value: i }));
  }
  __name(d, "d");
  function h() {
    const b = Math.round(Math.min(a, Math.max(i, o)) / s) * s;
    t(0, i = isNaN(b) ? 0 : b);
  }
  __name(h, "h");
  function m(b) {
    let p = b.target.value;
    c.test(p) ? (t(2, u = false), r("change", { value: p * 1 })) : t(2, u = true);
  }
  __name(m, "m");
  const _ = Yc();
  function w() {
    i = this.value, t(0, i);
  }
  __name(w, "w");
  return l.$$set = (b) => {
    "label" in b && t(1, n = b.label), "value" in b && t(0, i = b.value), "step" in b && t(8, s = b.step), "min" in b && t(9, o = b.min), "max" in b && t(10, a = b.max);
  }, [i, n, u, f, d, h, m, _, s, o, a, w];
}
__name(n1, "n1");
var _l1 = class _l1 extends ee {
  constructor(e) {
    super(), $(this, e, n1, t1, x, { label: 1, value: 0, step: 8, min: 9, max: 10 });
  }
};
__name(_l1, "l1");
var l1 = _l1;
function Is(l, e, t) {
  const n = l.slice();
  return n[6] = e[t], n;
}
__name(Is, "Is");
function Rs(l, e, t) {
  const n = l.slice();
  return n[13] = e[t], n;
}
__name(Rs, "Rs");
function Os(l) {
  let e, t, n, i;
  return t = new Ot({ props: { label: (
    /*links*/
    l[6].title
  ), position: "top", $$slots: { default: [s1] }, $$scope: { ctx: l } } }), { c() {
    e = D("div"), F(t.$$.fragment), n = Y(), g(e, "class", "wx-links x2-8406i3");
  }, m(s, o) {
    S(s, e, o), R(t, e, null), H(e, n), i = true;
  }, p(s, o) {
    const a = {};
    o & /*linksData*/
    1 && (a.label = /*links*/
    s[6].title), o & /*$$scope, linksData*/
    131073 && (a.$$scope = { dirty: o, ctx: s }), t.$set(a);
  }, i(s) {
    i || (k(t.$$.fragment, s), i = true);
  }, o(s) {
    y(t.$$.fragment, s), i = false;
  }, d(s) {
    s && v(e), O(t);
  } };
}
__name(Os, "Os");
function i1(l) {
  let e = (
    /*option*/
    l[16].label + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*option*/
    65536 && e !== (e = /*option*/
    n[16].label + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(i1, "i1");
function As(l) {
  let e, t, n, i = (
    /*obj*/
    (l[13].task.text || "") + ""
  ), s, o, a, r, c, u, f, d, h, m, _;
  function w() {
    for (var _len3 = arguments.length, b = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      b[_key3] = arguments[_key3];
    }
    return (
      /*select_handler*/
      l[9](
        /*obj*/
        l[13],
        ...b
      )
    );
  }
  __name(w, "w");
  return c = new go({ props: { value: (
    /*obj*/
    l[13].link.type
  ), placeholder: (
    /*_*/
    l[1]("Select link type")
  ), options: (
    /*list*/
    l[3]
  ), $$slots: { default: [i1, (_ref76) => {
    let { option: b } = _ref76;
    return { 16: b };
  }, (_ref77) => {
    let { option: b } = _ref77;
    return b ? 65536 : 0;
  }] }, $$scope: { ctx: l } } }), c.$on("select", w), { c() {
    e = D("tr"), t = D("td"), n = D("div"), s = re(i), o = Y(), a = D("td"), r = D("div"), F(c.$$.fragment), u = Y(), f = D("td"), d = D("i"), m = Y(), g(n, "class", "wx-task-name x2-8406i3"), g(t, "class", "wx-cell x2-8406i3"), g(r, "class", "wx-wrapper x2-8406i3"), g(a, "class", "wx-cell x2-8406i3"), g(d, "class", "wxi-delete wx-delete-icon x2-8406i3"), g(d, "data-action", "delete-link"), g(d, "data-id", h = /*obj*/
    l[13].link.id), g(f, "class", "wx-cell x2-8406i3");
  }, m(b, p) {
    S(b, e, p), H(e, t), H(t, n), H(n, s), H(e, o), H(e, a), H(a, r), R(c, r, null), H(e, u), H(e, f), H(f, d), H(e, m), _ = true;
  }, p(b, p) {
    l = b, (!_ || p & /*linksData*/
    1) && i !== (i = /*obj*/
    (l[13].task.text || "") + "") && me(s, i);
    const z = {};
    p & /*linksData*/
    1 && (z.value = /*obj*/
    l[13].link.type), p & /*$$scope, option*/
    196608 && (z.$$scope = { dirty: p, ctx: l }), c.$set(z), (!_ || p & /*linksData*/
    1 && h !== (h = /*obj*/
    l[13].link.id)) && g(d, "data-id", h);
  }, i(b) {
    _ || (k(c.$$.fragment, b), _ = true);
  }, o(b) {
    y(c.$$.fragment, b), _ = false;
  }, d(b) {
    b && v(e), O(c);
  } };
}
__name(As, "As");
function s1(l) {
  let e, t, n, i, s = de(
    /*links*/
    l[6].data
  ), o = [];
  for (let r = 0; r < s.length; r += 1) o[r] = As(Rs(l, s, r));
  const a = /* @__PURE__ */ __name((r) => y(o[r], 1, 1, () => {
    o[r] = null;
  }), "a");
  return { c() {
    e = D("table");
    for (let r = 0; r < o.length; r += 1) o[r].c();
  }, m(r, c) {
    S(r, e, c);
    for (let u = 0; u < o.length; u += 1) o[u] && o[u].m(e, null);
    t = true, n || (i = q(
      e,
      "click",
      /*onClick*/
      l[4]
    ), n = true);
  }, p(r, c) {
    if (c & /*linksData, _, list, onSelect, option*/
    65579) {
      s = de(
        /*links*/
        r[6].data
      );
      let u;
      for (u = 0; u < s.length; u += 1) {
        const f = Rs(r, s, u);
        o[u] ? (o[u].p(f, c), k(o[u], 1)) : (o[u] = As(f), o[u].c(), k(o[u], 1), o[u].m(e, null));
      }
      for (te(), u = s.length; u < o.length; u += 1) a(u);
      ne();
    }
  }, i(r) {
    if (!t) {
      for (let c = 0; c < s.length; c += 1) k(o[c]);
      t = true;
    }
  }, o(r) {
    o = o.filter(Boolean);
    for (let c = 0; c < o.length; c += 1) y(o[c]);
    t = false;
  }, d(r) {
    r && v(e), $e(o, r), n = false, i();
  } };
}
__name(s1, "s1");
function Fs(l) {
  let e, t, n = (
    /*links*/
    l[6].data.length && Os(l)
  );
  return { c() {
    n && n.c(), e = se();
  }, m(i, s) {
    n && n.m(i, s), S(i, e, s), t = true;
  }, p(i, s) {
    i[6].data.length ? n ? (n.p(i, s), s & /*linksData*/
    1 && k(n, 1)) : (n = Os(i), n.c(), k(n, 1), n.m(e.parentNode, e)) : n && (te(), y(n, 1, 1, () => {
      n = null;
    }), ne());
  }, i(i) {
    t || (k(n), t = true);
  }, o(i) {
    y(n), t = false;
  }, d(i) {
    i && v(e), n && n.d(i);
  } };
}
__name(Fs, "Fs");
function o1(l) {
  let e, t, n = de(
    /*linksData*/
    l[0]
  ), i = [];
  for (let o = 0; o < n.length; o += 1) i[o] = Fs(Is(l, n, o));
  const s = /* @__PURE__ */ __name((o) => y(i[o], 1, 1, () => {
    i[o] = null;
  }), "s");
  return { c() {
    for (let o = 0; o < i.length; o += 1) i[o].c();
    e = se();
  }, m(o, a) {
    for (let r = 0; r < i.length; r += 1) i[r] && i[r].m(o, a);
    S(o, e, a), t = true;
  }, p(o, _ref78) {
    let [a] = _ref78;
    if (a & /*linksData, onClick, _, list, onSelect, option*/
    65595) {
      n = de(
        /*linksData*/
        o[0]
      );
      let r;
      for (r = 0; r < n.length; r += 1) {
        const c = Is(o, n, r);
        i[r] ? (i[r].p(c, a), k(i[r], 1)) : (i[r] = Fs(c), i[r].c(), k(i[r], 1), i[r].m(e.parentNode, e));
      }
      for (te(), r = n.length; r < i.length; r += 1) s(r);
      ne();
    }
  }, i(o) {
    if (!t) {
      for (let a = 0; a < n.length; a += 1) k(i[a]);
      t = true;
    }
  }, o(o) {
    i = i.filter(Boolean);
    for (let a = 0; a < i.length; a += 1) y(i[a]);
    t = false;
  }, d(o) {
    o && v(e), $e(i, o);
  } };
}
__name(o1, "o1");
function r1(l, e, t) {
  let n, i;
  const s = ze("wx-i18n").getGroup("gantt"), o = ze("gantt-store"), { _activeTask: a, _links: r } = o.getReactiveState();
  ce(l, a, (m) => t(7, n = m)), ce(l, r, (m) => t(8, i = m));
  let c;
  const u = [{ id: "e2s", label: s("End-to-start") }, { id: "s2s", label: s("Start-to-start") }, { id: "e2e", label: s("End-to-end") }, { id: "s2e", label: s("Start-to-end") }];
  function f(m) {
    const { action: _, id: w } = m.target.dataset;
    _ && o.exec(_, { id: w });
  }
  __name(f, "f");
  function d(m, _) {
    const w = m.detail.selected.id;
    o.exec("update-link", { id: _, link: { type: w } });
  }
  __name(d, "d");
  const h = /* @__PURE__ */ __name((m, _) => d(_, m.link.id), "h");
  return l.$$.update = () => {
    if (l.$$.dirty & /*$task, $links*/
    384 && n) {
      const m = i.filter((w) => w.target == n.id).map((w) => ({ link: w, task: o.getTask(w.source) })), _ = i.filter((w) => w.source == n.id).map((w) => ({ link: w, task: o.getTask(w.target) }));
      t(0, c = [{ title: s("Predecessors"), data: m }, { title: s("Successors"), data: _ }]);
    }
  }, [c, s, a, u, f, d, r, n, i, h];
}
__name(r1, "r1");
var _a1 = class _a1 extends ee {
  constructor(e) {
    super(), $(this, e, r1, o1, x, {});
  }
};
__name(_a1, "a1");
var a1 = _a1;
function Ps(l, e, t) {
  const n = l.slice();
  return n[19] = e[t], n[20] = e, n[21] = t, n;
}
__name(Ps, "Ps");
function c1(l) {
  let e = (
    /*_*/
    l[5]("Delete") + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(c1, "c1");
function u1(l) {
  let e = (
    /*_*/
    l[5]("Save") + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p: I, d(n) {
    n && v(t);
  } };
}
__name(u1, "u1");
function f1(l) {
  let e, t;
  return e = new a1({}), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p: I, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(f1, "f1");
function d1(l) {
  let e, t;
  return e = new Ot({ props: { label: `${/*_*/
  l[5](
    /*field*/
    l[19].label
  )} ${/*$tdata*/
  l[4][
    /*field*/
    l[19].key
  ]}%` || "", position: "top", $$slots: { default: [b1] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape, $tdata*/
    18 && (s.label = `${/*_*/
    n[5](
      /*field*/
      n[19].label
    )} ${/*$tdata*/
    n[4][
      /*field*/
      n[19].key
    ]}%` || ""), i & /*$$scope, $tdata, editorShape*/
    16777234 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(d1, "d1");
function h1(l) {
  let e, t;
  return e = new Ot({ props: { label: (
    /*_*/
    l[5](
      /*field*/
      l[19].label
    ) || ""
  ), position: "top", $$slots: { default: [k1] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape*/
    2 && (s.label = /*_*/
    n[5](
      /*field*/
      n[19].label
    ) || ""), i & /*$$scope, $tdata, editorShape*/
    16777234 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(h1, "h1");
function m1(l) {
  let e, t;
  return e = new Ot({ props: { label: (
    /*_*/
    l[5](
      /*field*/
      l[19].label
    ) || ""
  ), position: "top", $$slots: { default: [p1, (_ref79) => {
    let { id: n } = _ref79;
    return { 22: n };
  }, (_ref80) => {
    let { id: n } = _ref80;
    return n ? 4194304 : 0;
  }] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape*/
    2 && (s.label = /*_*/
    n[5](
      /*field*/
      n[19].label
    ) || ""), i & /*$$scope, id, editorShape, $tdata*/
    20971538 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(m1, "m1");
function _1(l) {
  let e, t;
  return e = new Ot({ props: { label: (
    /*_*/
    l[5](
      /*field*/
      l[19].label
    ) || ""
  ), position: "top", $$slots: { default: [v1, (_ref81) => {
    let { id: n } = _ref81;
    return { 22: n };
  }, (_ref82) => {
    let { id: n } = _ref82;
    return n ? 4194304 : 0;
  }] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape*/
    2 && (s.label = /*_*/
    n[5](
      /*field*/
      n[19].label
    ) || ""), i & /*$$scope, id, editorShape, $tdata*/
    20971538 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(_1, "_1");
function g1(l) {
  let e, t;
  return e = new Ot({ props: { label: (
    /*_*/
    l[5](
      /*field*/
      l[19].label
    ) || ""
  ), position: "top", $$slots: { default: [S1, (_ref83) => {
    let { id: n } = _ref83;
    return { 22: n };
  }, (_ref84) => {
    let { id: n } = _ref84;
    return n ? 4194304 : 0;
  }] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape*/
    2 && (s.label = /*_*/
    n[5](
      /*field*/
      n[19].label
    ) || ""), i & /*$$scope, id, $tdata, editorShape*/
    20971538 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(g1, "g1");
function w1(l) {
  let e, t;
  return e = new Ot({ props: { label: (
    /*_*/
    l[5](
      /*field*/
      l[19].label
    ) || ""
  ), position: "top", $$slots: { default: [M1, (_ref85) => {
    let { id: n } = _ref85;
    return { 22: n };
  }, (_ref86) => {
    let { id: n } = _ref86;
    return n ? 4194304 : 0;
  }] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*editorShape*/
    2 && (s.label = /*_*/
    n[5](
      /*field*/
      n[19].label
    ) || ""), i & /*$$scope, id, editorShape, $tdata*/
    20971538 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(w1, "w1");
function b1(l) {
  let e, t, n;
  const i = [
    { value: (
      /*$tdata*/
      l[4][
        /*field*/
        l[19].key
      ]
    ) },
    /*field*/
    l[19].config
  ];
  let s = {};
  for (let o = 0; o < i.length; o += 1) s = We(s, i[o]);
  return e = new hc({ props: s }), e.$on(
    "change",
    /*onProgressChange*/
    l[11]
  ), { c() {
    F(e.$$.fragment), t = Y();
  }, m(o, a) {
    R(e, o, a), S(o, t, a), n = true;
  }, p(o, a) {
    const r = a & /*$tdata, editorShape*/
    18 ? Ut(i, [{ value: (
      /*$tdata*/
      o[4][
        /*field*/
        o[19].key
      ]
    ) }, a & /*editorShape*/
    2 && Jt(
      /*field*/
      o[19].config
    )]) : {};
    e.$set(r);
  }, i(o) {
    n || (k(e.$$.fragment, o), n = true);
  }, o(o) {
    y(e.$$.fragment, o), n = false;
  }, d(o) {
    o && v(t), O(e, o);
  } };
}
__name(b1, "b1");
function k1(l) {
  let e, t, n;
  return e = new l1({ props: { value: (
    /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ]
  ) } }), e.$on(
    "change",
    /*onDurationChange*/
    l[10]
  ), { c() {
    F(e.$$.fragment), t = Y();
  }, m(i, s) {
    R(e, i, s), S(i, t, s), n = true;
  }, p(i, s) {
    const o = {};
    s & /*$tdata, editorShape*/
    18 && (o.value = /*$tdata*/
    i[4][
      /*field*/
      i[19].key
    ]), e.$set(o);
  }, i(i) {
    n || (k(e.$$.fragment, i), n = true);
  }, o(i) {
    y(e.$$.fragment, i), n = false;
  }, d(i) {
    i && v(t), O(e, i);
  } };
}
__name(k1, "k1");
function p1(l) {
  let e, t, n, i;
  const s = [
    { id: (
      /*id*/
      l[22]
    ) },
    /*field*/
    l[19].config,
    { placeholder: (
      /*_*/
      l[5](
        /*field*/
        l[19].config.placeholder
      )
    ) }
  ];
  function o(r) {
    l[16](
      r,
      /*field*/
      l[19]
    );
  }
  __name(o, "o");
  let a = {};
  for (let r = 0; r < s.length; r += 1) a = We(a, s[r]);
  return (
    /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ] !== void 0 && (a.value = /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ]), e = new $r({ props: a }), be.push(() => rt(e, "value", o)), { c() {
      F(e.$$.fragment), n = Y();
    }, m(r, c) {
      R(e, r, c), S(r, n, c), i = true;
    }, p(r, c) {
      l = r;
      const u = c & /*id, editorShape, _*/
      4194338 ? Ut(s, [c & /*id*/
      4194304 && { id: (
        /*id*/
        l[22]
      ) }, c & /*editorShape*/
      2 && Jt(
        /*field*/
        l[19].config
      ), c & /*_, editorShape*/
      34 && { placeholder: (
        /*_*/
        l[5](
          /*field*/
          l[19].config.placeholder
        )
      ) }]) : {};
      !t && c & /*$tdata, editorShape*/
      18 && (t = true, u.value = /*$tdata*/
      l[4][
        /*field*/
        l[19].key
      ], dt(() => t = false)), e.$set(u);
    }, i(r) {
      i || (k(e.$$.fragment, r), i = true);
    }, o(r) {
      y(e.$$.fragment, r), i = false;
    }, d(r) {
      r && v(n), O(e, r);
    } }
  );
}
__name(p1, "p1");
function y1(l) {
  let e = (
    /*option*/
    l[23].label + ""
  ), t;
  return { c() {
    t = re(e);
  }, m(n, i) {
    S(n, t, i);
  }, p(n, i) {
    i & /*option*/
    8388608 && e !== (e = /*option*/
    n[23].label + "") && me(t, e);
  }, d(n) {
    n && v(t);
  } };
}
__name(y1, "y1");
function v1(l) {
  let e, t, n, i;
  const s = [
    { id: (
      /*id*/
      l[22]
    ) },
    { placeholder: (
      /*_*/
      l[5]("Select type")
    ) },
    { options: (
      /*field*/
      l[19].options
    ) },
    /*field*/
    l[19].config,
    { title: "" }
  ];
  function o(r) {
    l[15](
      r,
      /*field*/
      l[19]
    );
  }
  __name(o, "o");
  let a = { $$slots: { default: [y1, (_ref87) => {
    let { option: r } = _ref87;
    return { 23: r };
  }, (_ref88) => {
    let { option: r } = _ref88;
    return r ? 8388608 : 0;
  }] }, $$scope: { ctx: l } };
  for (let r = 0; r < s.length; r += 1) a = We(a, s[r]);
  return (
    /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ] !== void 0 && (a.value = /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ]), e = new go({ props: a }), be.push(() => rt(e, "value", o)), { c() {
      F(e.$$.fragment), n = Y();
    }, m(r, c) {
      R(e, r, c), S(r, n, c), i = true;
    }, p(r, c) {
      l = r;
      const u = c & /*id, _, editorShape*/
      4194338 ? Ut(s, [c & /*id*/
      4194304 && { id: (
        /*id*/
        l[22]
      ) }, c & /*_*/
      32 && { placeholder: (
        /*_*/
        l[5]("Select type")
      ) }, c & /*editorShape*/
      2 && { options: (
        /*field*/
        l[19].options
      ) }, c & /*editorShape*/
      2 && Jt(
        /*field*/
        l[19].config
      ), s[4]]) : {};
      c & /*$$scope, option*/
      25165824 && (u.$$scope = { dirty: c, ctx: l }), !t && c & /*$tdata, editorShape*/
      18 && (t = true, u.value = /*$tdata*/
      l[4][
        /*field*/
        l[19].key
      ], dt(() => t = false)), e.$set(u);
    }, i(r) {
      i || (k(e.$$.fragment, r), i = true);
    }, o(r) {
      y(e.$$.fragment, r), i = false;
    }, d(r) {
      r && v(n), O(e, r);
    } }
  );
}
__name(v1, "v1");
function S1(l) {
  let e, t, n, i, s;
  function o(r) {
    l[14](
      r,
      /*field*/
      l[19]
    );
  }
  __name(o, "o");
  let a = { id: (
    /*id*/
    l[22]
  ) };
  return (
    /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ] !== void 0 && (a.value = /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ]), t = new uc({ props: a }), be.push(() => rt(t, "value", o)), { c() {
      e = D("div"), F(t.$$.fragment), i = Y(), g(e, "class", "input_wrapper");
    }, m(r, c) {
      S(r, e, c), R(t, e, null), S(r, i, c), s = true;
    }, p(r, c) {
      l = r;
      const u = {};
      c & /*id*/
      4194304 && (u.id = /*id*/
      l[22]), !n && c & /*$tdata, editorShape*/
      18 && (n = true, u.value = /*$tdata*/
      l[4][
        /*field*/
        l[19].key
      ], dt(() => n = false)), t.$set(u);
    }, i(r) {
      s || (k(t.$$.fragment, r), s = true);
    }, o(r) {
      y(t.$$.fragment, r), s = false;
    }, d(r) {
      r && (v(e), v(i)), O(t);
    } }
  );
}
__name(S1, "S1");
function M1(l) {
  let e, t, n, i;
  const s = [
    { id: (
      /*id*/
      l[22]
    ) },
    /*field*/
    l[19].config,
    { placeholder: (
      /*_*/
      l[5](
        /*field*/
        l[19].config.placeholder
      )
    ) }
  ];
  function o(r) {
    l[13](
      r,
      /*field*/
      l[19]
    );
  }
  __name(o, "o");
  let a = {};
  for (let r = 0; r < s.length; r += 1) a = We(a, s[r]);
  return (
    /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ] !== void 0 && (a.value = /*$tdata*/
    l[4][
      /*field*/
      l[19].key
    ]), e = new wo({ props: a }), be.push(() => rt(e, "value", o)), { c() {
      F(e.$$.fragment), n = Y();
    }, m(r, c) {
      R(e, r, c), S(r, n, c), i = true;
    }, p(r, c) {
      l = r;
      const u = c & /*id, editorShape, _*/
      4194338 ? Ut(s, [c & /*id*/
      4194304 && { id: (
        /*id*/
        l[22]
      ) }, c & /*editorShape*/
      2 && Jt(
        /*field*/
        l[19].config
      ), c & /*_, editorShape*/
      34 && { placeholder: (
        /*_*/
        l[5](
          /*field*/
          l[19].config.placeholder
        )
      ) }]) : {};
      !t && c & /*$tdata, editorShape*/
      18 && (t = true, u.value = /*$tdata*/
      l[4][
        /*field*/
        l[19].key
      ], dt(() => t = false)), e.$set(u);
    }, i(r) {
      i || (k(e.$$.fragment, r), i = true);
    }, o(r) {
      y(e.$$.fragment, r), i = false;
    }, d(r) {
      r && v(n), O(e, r);
    } }
  );
}
__name(M1, "M1");
function Ys(l) {
  let e, t, n, i;
  const s = [w1, g1, _1, m1, h1, d1, f1], o = [];
  function a(r, c) {
    return (
      /*field*/
      r[19].type === "text" ? 0 : (
        /*field*/
        r[19].type === "date" && (!/*milestone*/
        r[3] || /*field*/
        r[19].key !== "end" && /*field*/
        r[19].key !== "base_end") && !/*summary*/
        r[2] ? 1 : (
          /*field*/
          r[19].type === "select" && /*field*/
          r[19].options.length > 1 ? 2 : (
            /*field*/
            r[19].type === "textarea" ? 3 : (
              /*field*/
              r[19].type === "counter" && !/*summary*/
              r[2] && !/*milestone*/
              r[3] ? 4 : (
                /*field*/
                r[19].type === "slider" && !/*milestone*/
                r[3] ? 5 : (
                  /*field*/
                  r[19].type === "links" ? 6 : -1
                )
              )
            )
          )
        )
      )
    );
  }
  __name(a, "a");
  return ~(e = a(l)) && (t = o[e] = s[e](l)), { c() {
    t && t.c(), n = se();
  }, m(r, c) {
    ~e && o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, c) {
    let u = e;
    e = a(r), e === u ? ~e && o[e].p(r, c) : (t && (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne()), ~e ? (t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n)) : t = null);
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), ~e && o[e].d(r);
  } };
}
__name(Ys, "Ys");
function T1(l) {
  let e, t, n, i, s, o, a, r, c, u, f, d, h;
  o = new mn({ props: { type: "danger", click: (
    /*deleteTask*/
    l[8]
  ), $$slots: { default: [c1] }, $$scope: { ctx: l } } }), r = new mn({ props: { type: "primary", click: (
    /*hide*/
    l[9]
  ), $$slots: { default: [u1] }, $$scope: { ctx: l } } });
  let m = de(
    /*editorShape*/
    l[1]
  ), _ = [];
  for (let b = 0; b < m.length; b += 1) _[b] = Ys(Ps(l, m, b));
  const w = /* @__PURE__ */ __name((b) => y(_[b], 1, 1, () => {
    _[b] = null;
  }), "w");
  return { c() {
    e = D("div"), t = D("div"), n = D("i"), i = Y(), s = D("div"), F(o.$$.fragment), a = Y(), F(r.$$.fragment), c = Y(), u = D("div");
    for (let b = 0; b < _.length; b += 1) _[b].c();
    g(n, "class", "wxi-close x2-j8yl6f"), g(t, "class", "wx-header x2-j8yl6f"), g(u, "class", "wx-form x2-j8yl6f"), g(e, "class", "wx-sidebar x2-j8yl6f"), Q(
      e,
      "wx-compact",
      /*compactMode*/
      l[0]
    );
  }, m(b, p) {
    S(b, e, p), H(e, t), H(t, n), H(t, i), H(t, s), R(o, s, null), H(s, a), R(r, s, null), H(e, c), H(e, u);
    for (let z = 0; z < _.length; z += 1) _[z] && _[z].m(u, null);
    f = true, d || (h = q(
      n,
      "click",
      /*hide*/
      l[9]
    ), d = true);
  }, p(b, _ref89) {
    let [p] = _ref89;
    const z = {};
    p & /*$$scope*/
    16777216 && (z.$$scope = { dirty: p, ctx: b }), o.$set(z);
    const T = {};
    if (p & /*$$scope*/
    16777216 && (T.$$scope = { dirty: p, ctx: b }), r.$set(T), p & /*_, editorShape, id, $tdata, milestone, summary, option, onDurationChange, onProgressChange*/
    12586046) {
      m = de(
        /*editorShape*/
        b[1]
      );
      let W;
      for (W = 0; W < m.length; W += 1) {
        const M = Ps(b, m, W);
        _[W] ? (_[W].p(M, p), k(_[W], 1)) : (_[W] = Ys(M), _[W].c(), k(_[W], 1), _[W].m(u, null));
      }
      for (te(), W = m.length; W < _.length; W += 1) w(W);
      ne();
    }
    (!f || p & /*compactMode*/
    1) && Q(
      e,
      "wx-compact",
      /*compactMode*/
      b[0]
    );
  }, i(b) {
    if (!f) {
      k(o.$$.fragment, b), k(r.$$.fragment, b);
      for (let p = 0; p < m.length; p += 1) k(_[p]);
      f = true;
    }
  }, o(b) {
    y(o.$$.fragment, b), y(r.$$.fragment, b), _ = _.filter(Boolean);
    for (let p = 0; p < _.length; p += 1) y(_[p]);
    f = false;
  }, d(b) {
    b && v(e), O(o), O(r), $e(_, b), d = false, h();
  } };
}
__name(T1, "T1");
function C1(l, e, t) {
  let n, i, s, o, { compactMode: a } = e, { editorShape: r } = e;
  const c = ze("wx-i18n").getGroup("gantt"), u = ze("gantt-store"), f = u.getReactiveState()._activeTask;
  ce(l, f, (M) => t(12, s = M));
  let d = e1({}, (M) => {
    M.start && M.end && (M.start >= M.end ? M.end = null : M.duration = null), M.base_start && M.base_end && (M.base_start >= M.base_end ? M.base_end = null : M.base_duration = null), u.exec("update-task", { id: s.id, task: M, inProgress: w });
  });
  ce(l, d, (M) => t(4, o = M));
  function h() {
    u.exec("delete-task", { id: s.id }), m();
  }
  __name(h, "h");
  function m() {
    u.exec("show-editor", { id: null });
  }
  __name(m, "m");
  function _(M) {
    d.update((C) => (C.duration = M.detail.value, C.end = null, C.start = s.start, C));
  }
  __name(_, "_");
  let w = false;
  function b(M) {
    w = M.detail.input, w ? d.update((C) => (C.progress = M.detail.value, C)) : u.exec("update-task", { id: s.id, task: { ...s, progress: M.detail.value } });
  }
  __name(b, "b");
  function p(M, C) {
    l.$$.not_equal(o[C.key], M) && (o[C.key] = M, d.set(o));
  }
  __name(p, "p");
  function z(M, C) {
    l.$$.not_equal(o[C.key], M) && (o[C.key] = M, d.set(o));
  }
  __name(z, "z");
  function T(M, C) {
    l.$$.not_equal(o[C.key], M) && (o[C.key] = M, d.set(o));
  }
  __name(T, "T");
  function W(M, C) {
    l.$$.not_equal(o[C.key], M) && (o[C.key] = M, d.set(o));
  }
  __name(W, "W");
  return l.$$set = (M) => {
    "compactMode" in M && t(0, a = M.compactMode), "editorShape" in M && t(1, r = M.editorShape);
  }, l.$$.update = () => {
    l.$$.dirty & /*$task*/
    4096 && d.reset({ ...s }), l.$$.dirty & /*$task*/
    4096 && t(3, n = s?.type === "milestone"), l.$$.dirty & /*$task*/
    4096 && t(2, i = s?.type === "summary");
  }, [a, r, i, n, o, c, f, d, h, m, _, b, s, p, z, T, W];
}
__name(C1, "C1");
var _D1 = class _D1 extends ee {
  constructor(e) {
    super(), $(this, e, C1, T1, x, { compactMode: 0, editorShape: 1 });
  }
};
__name(_D1, "D1");
var D1 = _D1;
function Bs(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = "wx-button-icon " + /*icon*/
    l[1] + " x2-npj3j5");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*icon*/
    2 && t !== (t = "wx-button-icon " + /*icon*/
    n[1] + " x2-npj3j5") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(Bs, "Bs");
function W1(l) {
  let e, t, n, i, s = (
    /*icon*/
    l[1] && Bs(l)
  );
  return { c() {
    e = D("button"), s && s.c(), g(e, "class", t = "wx-button " + /*appearance*/
    l[0] + " x2-npj3j5");
  }, m(o, a) {
    S(o, e, a), s && s.m(e, null), n || (i = q(
      e,
      "click",
      /*click_handler*/
      l[3]
    ), n = true);
  }, p(o, _ref90) {
    let [a] = _ref90;
    o[1] ? s ? s.p(o, a) : (s = Bs(o), s.c(), s.m(e, null)) : s && (s.d(1), s = null), a & /*appearance*/
    1 && t !== (t = "wx-button " + /*appearance*/
    o[0] + " x2-npj3j5") && g(e, "class", t);
  }, i: I, o: I, d(o) {
    o && v(e), s && s.d(), n = false, i();
  } };
}
__name(W1, "W1");
function H1(l, e, t) {
  const n = He();
  let { appearance: i = "primary" } = e, { icon: s = "" } = e;
  const o = /* @__PURE__ */ __name(() => n("click"), "o");
  return l.$$set = (a) => {
    "appearance" in a && t(0, i = a.appearance), "icon" in a && t(1, s = a.icon);
  }, [i, s, n, o];
}
__name(H1, "H1");
var _ar = class _ar extends ee {
  constructor(e) {
    super(), $(this, e, H1, W1, x, { appearance: 0, icon: 1 });
  }
};
__name(_ar, "ar");
var ar = _ar;
function z1(l) {
  let e, t, n, i, s;
  return { c() {
    e = D("div"), t = D("div"), g(t, "class", "wx-resizer-line x2-1myw878"), g(e, "class", n = "wx-resizer wx-resizer-" + /*dir*/
    l[0] + " x2-1myw878"), j(
      e,
      "left",
      /*b*/
      l[2].p[0]
    ), j(
      e,
      "top",
      /*b*/
      l[2].p[1]
    ), j(
      e,
      "width",
      /*b*/
      l[2].size[0]
    ), j(
      e,
      "height",
      /*b*/
      l[2].size[1]
    ), j(
      e,
      "right",
      /*b*/
      l[2].p2[0]
    ), j(
      e,
      "bottom",
      /*b*/
      l[2].p2[1]
    ), j(
      e,
      "cursor",
      /*cursor*/
      l[1]
    ), Q(
      e,
      "wx-resizer-active",
      /*active*/
      l[3]
    );
  }, m(o, a) {
    S(o, e, a), H(e, t), i || (s = q(
      e,
      "mousedown",
      /*down*/
      l[4]
    ), i = true);
  }, p(o, _ref91) {
    let [a] = _ref91;
    a & /*dir*/
    1 && n !== (n = "wx-resizer wx-resizer-" + /*dir*/
    o[0] + " x2-1myw878") && g(e, "class", n), a & /*b*/
    4 && j(
      e,
      "left",
      /*b*/
      o[2].p[0]
    ), a & /*b*/
    4 && j(
      e,
      "top",
      /*b*/
      o[2].p[1]
    ), a & /*b*/
    4 && j(
      e,
      "width",
      /*b*/
      o[2].size[0]
    ), a & /*b*/
    4 && j(
      e,
      "height",
      /*b*/
      o[2].size[1]
    ), a & /*b*/
    4 && j(
      e,
      "right",
      /*b*/
      o[2].p2[0]
    ), a & /*b*/
    4 && j(
      e,
      "bottom",
      /*b*/
      o[2].p2[1]
    ), a & /*cursor*/
    2 && j(
      e,
      "cursor",
      /*cursor*/
      o[1]
    ), a & /*dir, active*/
    9 && Q(
      e,
      "wx-resizer-active",
      /*active*/
      o[3]
    );
  }, i: I, o: I, d(o) {
    o && v(e), i = false, s();
  } };
}
__name(z1, "z1");
function N1(l, e, t) {
  let { position: n = "after" } = e, { size: i = 4 } = e, { dir: s = "x" } = e, { value: o = 0 } = e, { minValue: a = 0 } = e, { maxValue: r = 0 } = e;
  const c = He();
  let u, f = {};
  function d(W) {
    let M = 0;
    n == "center" ? M = i / 2 : n == "before" && (M = i);
    const C = { size: [i + "px", "auto"], p: [W - M + "px", "0px"], p2: ["auto", "0px"] };
    if (s != "x") for (let P in C) C[P] = C[P].reverse();
    return C;
  }
  __name(d, "d");
  let h = 0, m, _ = false;
  function w(W) {
    return s == "x" ? W.clientX : W.clientY;
  }
  __name(w, "w");
  function b(W) {
    h = w(W), m = o, t(3, _ = true), document.body.style.cursor = u, document.body.style.userSelect = "none", window.addEventListener("mousemove", z), window.addEventListener("mouseup", T);
  }
  __name(b, "b");
  let p;
  function z(W) {
    const M = m + w(W) - h;
    (!a || a <= M) && (!r || r >= M) && (t(5, o = M), p && clearTimeout(p), p = setTimeout(c("move", o), 500));
  }
  __name(z, "z");
  function T() {
    document.body.style.cursor = "", document.body.style.userSelect = "", c("finish", o), t(3, _ = false), window.removeEventListener("mousemove", z), window.removeEventListener("mouseup", T);
  }
  __name(T, "T");
  return l.$$set = (W) => {
    "position" in W && t(6, n = W.position), "size" in W && t(7, i = W.size), "dir" in W && t(0, s = W.dir), "value" in W && t(5, o = W.value), "minValue" in W && t(8, a = W.minValue), "maxValue" in W && t(9, r = W.maxValue);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, dir*/
    33 && (t(2, f = d(o)), t(1, u = s == "x" ? "ew-resize" : "ns-resize"));
  }, [s, u, f, _, b, o, n, i, a, r];
}
__name(N1, "N1");
var _L1 = class _L1 extends ee {
  constructor(e) {
    super(), $(this, e, N1, z1, x, { position: 6, size: 7, dir: 0, value: 5, minValue: 8, maxValue: 9 });
  }
};
__name(_L1, "L1");
var L1 = _L1;
function js(l) {
  let e, t, n, i;
  e = new zm({ props: { compactMode: (
    /*compactMode*/
    l[7]
  ), columnWidth: (
    /*gridColumnWidth*/
    l[9]
  ), width: (
    /*gridWidth*/
    l[5]
  ), readonly: (
    /*readonly*/
    l[1]
  ), fullHeight: (
    /*fullHeight*/
    l[10]
  ) } });
  let s = !/*compactMode*/
  l[7] && Zs(l);
  return { c() {
    F(e.$$.fragment), t = Y(), s && s.c(), n = se();
  }, m(o, a) {
    R(e, o, a), S(o, t, a), s && s.m(o, a), S(o, n, a), i = true;
  }, p(o, a) {
    const r = {};
    a[0] & /*compactMode*/
    128 && (r.compactMode = /*compactMode*/
    o[7]), a[0] & /*gridColumnWidth*/
    512 && (r.columnWidth = /*gridColumnWidth*/
    o[9]), a[0] & /*gridWidth*/
    32 && (r.width = /*gridWidth*/
    o[5]), a[0] & /*readonly*/
    2 && (r.readonly = /*readonly*/
    o[1]), a[0] & /*fullHeight*/
    1024 && (r.fullHeight = /*fullHeight*/
    o[10]), e.$set(r), /*compactMode*/
    o[7] ? s && (te(), y(s, 1, 1, () => {
      s = null;
    }), ne()) : s ? (s.p(o, a), a[0] & /*compactMode*/
    128 && k(s, 1)) : (s = Zs(o), s.c(), k(s, 1), s.m(n.parentNode, n));
  }, i(o) {
    i || (k(e.$$.fragment, o), k(s), i = true);
  }, o(o) {
    y(e.$$.fragment, o), y(s), i = false;
  }, d(o) {
    o && (v(t), v(n)), O(e, o), s && s.d(o);
  } };
}
__name(js, "js");
function Zs(l) {
  let e, t;
  return e = new L1({ props: { value: (
    /*gridWidth*/
    l[5]
  ), minValue: "50", maxValue: "800" } }), e.$on(
    "move",
    /*resizeGrid*/
    l[22]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*gridWidth*/
    32 && (s.value = /*gridWidth*/
    n[5]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(Zs, "Zs");
function qs(l) {
  let e, t;
  return e = new D1({ props: { compactMode: (
    /*compactMode*/
    l[7]
  ), editorShape: (
    /*editorShape*/
    l[3]
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i[0] & /*compactMode*/
    128 && (s.compactMode = /*compactMode*/
    n[7]), i[0] & /*editorShape*/
    8 && (s.editorShape = /*editorShape*/
    n[3]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(qs, "qs");
function Ks(l) {
  let e, t, n;
  return t = new ar({ props: { icon: "wxi-plus" } }), t.$on(
    "click",
    /*addTask*/
    l[21]
  ), { c() {
    e = D("div"), F(t.$$.fragment), g(e, "class", "wx-icon x2-1dzadpy");
  }, m(i, s) {
    S(i, e, s), R(t, e, null), n = true;
  }, p: I, i(i) {
    n || (k(t.$$.fragment, i), n = true);
  }, o(i) {
    y(t.$$.fragment, i), n = false;
  }, d(i) {
    i && v(e), O(t);
  } };
}
__name(Ks, "Ks");
function E1(l) {
  let e, t, n, i, s, o, a, r, c, u, f, d = (
    /*$rColumns*/
    l[8].length && js(l)
  );
  s = new ad({ props: { highlightTime: (
    /*highlightTime*/
    l[4]
  ) } }), a = new Jm({ props: { markers: (
    /*markersData*/
    l[12]
  ), readonly: (
    /*readonly*/
    l[1]
  ), fullWidth: (
    /*fullWidth*/
    l[6]
  ), fullHeight: (
    /*fullHeight*/
    l[10]
  ), taskTemplate: (
    /*taskTemplate*/
    l[0]
  ), cellBorders: (
    /*cellBorders*/
    l[2]
  ), highlightTime: (
    /*highlightTime*/
    l[4]
  ) } }), a.$on(
    "scale-params",
    /*setParams*/
    l[20]
  );
  let h = (
    /*$rActiveTask*/
    l[13] && !/*readonly*/
    l[1] && qs(l)
  ), m = (
    /*compactMode*/
    l[7] && !/*$rActiveTask*/
    l[13] && !/*readonly*/
    l[1] && Ks(l)
  );
  return { c() {
    e = D("div"), t = D("div"), d && d.c(), n = Y(), i = D("div"), F(s.$$.fragment), o = Y(), F(a.$$.fragment), r = Y(), h && h.c(), c = Y(), m && m.c(), g(i, "class", "wx-content x2-1dzadpy"), g(t, "tabindex", "0"), g(t, "class", "wx-layout x2-1dzadpy"), Vt(() => (
      /*div1_elementresize_handler*/
      l[28].call(t)
    )), g(e, "class", "wx-gantt x2-1dzadpy");
  }, m(_, w) {
    S(_, e, w), H(e, t), d && d.m(t, null), H(t, n), H(t, i), R(s, i, null), H(i, o), R(a, i, null), H(t, r), h && h.m(t, null), H(t, c), m && m.m(t, null), u = sl(
      t,
      /*div1_elementresize_handler*/
      l[28].bind(t)
    ), f = true;
  }, p(_, w) {
    _[8].length ? d ? (d.p(_, w), w[0] & /*$rColumns*/
    256 && k(d, 1)) : (d = js(_), d.c(), k(d, 1), d.m(t, n)) : d && (te(), y(d, 1, 1, () => {
      d = null;
    }), ne());
    const b = {};
    w[0] & /*highlightTime*/
    16 && (b.highlightTime = /*highlightTime*/
    _[4]), s.$set(b);
    const p = {};
    w[0] & /*markersData*/
    4096 && (p.markers = /*markersData*/
    _[12]), w[0] & /*readonly*/
    2 && (p.readonly = /*readonly*/
    _[1]), w[0] & /*fullWidth*/
    64 && (p.fullWidth = /*fullWidth*/
    _[6]), w[0] & /*fullHeight*/
    1024 && (p.fullHeight = /*fullHeight*/
    _[10]), w[0] & /*taskTemplate*/
    1 && (p.taskTemplate = /*taskTemplate*/
    _[0]), w[0] & /*cellBorders*/
    4 && (p.cellBorders = /*cellBorders*/
    _[2]), w[0] & /*highlightTime*/
    16 && (p.highlightTime = /*highlightTime*/
    _[4]), a.$set(p), /*$rActiveTask*/
    _[13] && !/*readonly*/
    _[1] ? h ? (h.p(_, w), w[0] & /*$rActiveTask, readonly*/
    8194 && k(h, 1)) : (h = qs(_), h.c(), k(h, 1), h.m(t, c)) : h && (te(), y(h, 1, 1, () => {
      h = null;
    }), ne()), /*compactMode*/
    _[7] && !/*$rActiveTask*/
    _[13] && !/*readonly*/
    _[1] ? m ? (m.p(_, w), w[0] & /*compactMode, $rActiveTask, readonly*/
    8322 && k(m, 1)) : (m = Ks(_), m.c(), k(m, 1), m.m(t, null)) : m && (te(), y(m, 1, 1, () => {
      m = null;
    }), ne());
  }, i(_) {
    f || (k(d), k(s.$$.fragment, _), k(a.$$.fragment, _), k(h), k(m), f = true);
  }, o(_) {
    y(d), y(s.$$.fragment, _), y(a.$$.fragment, _), y(h), y(m), f = false;
  }, d(_) {
    _ && v(e), d && d.d(), O(s), O(a), h && h.d(), m && m.d(), u();
  } };
}
__name(E1, "E1");
var I1 = 650;
function R1(l, e, t) {
  let n, i, s, o, a, r, { taskTemplate: c } = e, { markers: u } = e, { readonly: f } = e, { cellBorders: d } = e, { editorShape: h } = e, { highlightTime: m } = e;
  const _ = ze("gantt-store"), w = ze("wx-i18n").getGroup("gantt"), { _tasks: b, _scales: p, _activeTask: z, cellWidth: T, cellHeight: W, columns: M } = _.getReactiveState();
  ce(l, b, (U) => t(25, s = U)), ce(l, p, (U) => t(26, o = U)), ce(l, z, (U) => t(13, r = U)), ce(l, T, (U) => t(27, a = U)), ce(l, W, (U) => t(24, i = U)), ce(l, M, (U) => t(8, n = U));
  let C, P, X, A, B, V, fe = false;
  const L = new ResizeObserver(Ye);
  L.observe(document.body);
  function Ye(U) {
    for (let ge of U) ge.target === document.body && (t(7, fe = ge.contentRect.width <= I1), ue());
  }
  __name(Ye, "Ye");
  rl(() => {
    L.disconnect();
  });
  let G, pe = true, Se, K;
  async function ue() {
    if (await Dn(), V > B) {
      const U = { minWidth: V - C };
      pe || (Se && (U.date = Se), typeof K < "u" && (U.offset = K)), _.exec("expand-scale", U);
    }
    pe && (pe = false);
  }
  __name(ue, "ue");
  function Ne(U) {
    Se = U.detail.date, K = U.detail.offset;
  }
  __name(Ne, "Ne");
  function ye(U, ge) {
    let Me;
    return ge.every((Fe) => Fe.width && !Fe.flexgrow) ? Me = ge.reduce((Fe, Je) => (Fe += parseInt(Je.width), Fe), 0) : Me = 440, t(9, P = Me), U && (Me = parseInt(ge.find((Fe) => Fe.id === "action")?.width) || 50), Me;
  }
  __name(ye, "ye");
  function ve() {
    _.exec("add-task", { task: { text: w("New Task") } });
  }
  __name(ve, "ve");
  function Ze(U) {
    const ge = U.detail;
    t(5, C = ge);
  }
  __name(Ze, "Ze");
  function ie() {
    V = this.offsetWidth, t(11, V);
  }
  __name(ie, "ie");
  return l.$$set = (U) => {
    "taskTemplate" in U && t(0, c = U.taskTemplate), "markers" in U && t(23, u = U.markers), "readonly" in U && t(1, f = U.readonly), "cellBorders" in U && t(2, d = U.cellBorders), "editorShape" in U && t(3, h = U.editorShape), "highlightTime" in U && t(4, m = U.highlightTime);
  }, l.$$.update = () => {
    if (l.$$.dirty[0] & /*$rScales, markers, $rCellWidth*/
    209715200) {
      const { start: U, diff: ge } = o;
      t(12, G = u.map((Me) => (Me.left = ge(Me.start, U) * a, Me)));
    }
    l.$$.dirty[0] & /*compactMode, $rColumns*/
    384 && t(5, C = ye(fe, n)), l.$$.dirty[0] & /*$rScales, $rTasks, $rCellHeight, gridWidth, fullWidth*/
    117440608 && (t(6, X = o.width), t(10, A = s.length * i), B = C + X, ue());
  }, [c, f, d, h, m, C, X, fe, n, P, A, V, G, r, b, p, z, T, W, M, Ne, ve, Ze, u, i, s, o, a, ie];
}
__name(R1, "R1");
var _O1 = class _O1 extends ee {
  constructor(e) {
    super(), $(this, e, R1, E1, x, { taskTemplate: 0, markers: 23, readonly: 1, cellBorders: 2, editorShape: 3, highlightTime: 4 }, null, [-1, -1]);
  }
};
__name(_O1, "O1");
var O1 = _O1;
function A1(l) {
  let e, t;
  return e = new O1({ props: { taskTemplate: (
    /*taskTemplate*/
    l[0]
  ), markers: (
    /*markers*/
    l[1]
  ), readonly: (
    /*readonly*/
    l[2]
  ), cellBorders: (
    /*cellBorders*/
    l[3]
  ), editorShape: (
    /*editorShape*/
    l[4]
  ), highlightTime: (
    /*highlightTime*/
    l[5]
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*taskTemplate*/
    1 && (s.taskTemplate = /*taskTemplate*/
    n[0]), i & /*markers*/
    2 && (s.markers = /*markers*/
    n[1]), i & /*readonly*/
    4 && (s.readonly = /*readonly*/
    n[2]), i & /*cellBorders*/
    8 && (s.cellBorders = /*cellBorders*/
    n[3]), i & /*editorShape*/
    16 && (s.editorShape = /*editorShape*/
    n[4]), i & /*highlightTime*/
    32 && (s.highlightTime = /*highlightTime*/
    n[5]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(A1, "A1");
function F1(l) {
  let e, t;
  return e = new Mo({ props: { words: dl, optional: true, $$slots: { default: [A1] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref92) {
    let [i] = _ref92;
    const s = {};
    i & /*$$scope, taskTemplate, markers, readonly, cellBorders, editorShape, highlightTime*/
    134217791 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(F1, "F1");
function P1(l, e, t) {
  let { taskTemplate: n = null } = e, { markers: i = [] } = e, { taskTypes: s = [{ id: "task", label: "Task" }, { id: "summary", label: "Summary task" }, { id: "milestone", label: "Milestone" }] } = e, { tasks: o = [] } = e, { selected: a = [] } = e, { activeTask: r = null } = e, { links: c = [] } = e, { scales: u = [{ unit: "month", step: 1, format: "MMMM yyy" }, { unit: "day", step: 1, format: "d" }] } = e, { columns: f = Gf } = e, { start: d = null } = e, { end: h = null } = e, { lengthUnit: m = "day" } = e, { cellWidth: _ = 100 } = e, { cellHeight: w = 38 } = e, { scaleHeight: b = 36 } = e, { readonly: p = false } = e, { cellBorders: z = "full" } = e, { editorShape: T = Qo } = e, { zoom: W = false } = e, { baselines: M = false } = e, { highlightTime: C = null } = e, { init: P = null } = e;
  const X = He(), A = new Uf(cl);
  let B = new To(X), V = A.in;
  V.setNext(B);
  const fe = {
    // state
    getState: A.getState.bind(A),
    getReactiveState: A.getReactive.bind(A),
    getStores: /* @__PURE__ */ __name(() => ({ data: A }), "getStores"),
    // events
    exec: V.exec,
    setNext: /* @__PURE__ */ __name((L) => B = B.setNext(L), "setNext"),
    intercept: V.intercept.bind(V),
    on: V.on.bind(V),
    detach: V.detach.bind(V),
    //specific
    getTask: /* @__PURE__ */ __name((L) => A.getTask(L), "getTask")
  };
  return It("gantt-store", { getReactiveState: A.getReactive.bind(A), exec: V.exec.bind(V), getTask: A.getTask.bind(A) }), l.$$set = (L) => {
    "taskTemplate" in L && t(0, n = L.taskTemplate), "markers" in L && t(1, i = L.markers), "taskTypes" in L && t(7, s = L.taskTypes), "tasks" in L && t(8, o = L.tasks), "selected" in L && t(9, a = L.selected), "activeTask" in L && t(10, r = L.activeTask), "links" in L && t(11, c = L.links), "scales" in L && t(12, u = L.scales), "columns" in L && t(13, f = L.columns), "start" in L && t(14, d = L.start), "end" in L && t(15, h = L.end), "lengthUnit" in L && t(16, m = L.lengthUnit), "cellWidth" in L && t(17, _ = L.cellWidth), "cellHeight" in L && t(18, w = L.cellHeight), "scaleHeight" in L && t(19, b = L.scaleHeight), "readonly" in L && t(2, p = L.readonly), "cellBorders" in L && t(3, z = L.cellBorders), "editorShape" in L && t(4, T = L.editorShape), "zoom" in L && t(20, W = L.zoom), "baselines" in L && t(21, M = L.baselines), "highlightTime" in L && t(5, C = L.highlightTime), "init" in L && t(6, P = L.init);
  }, l.$$.update = () => {
    l.$$.dirty & /*tasks, links, start, columns, end, lengthUnit, cellWidth, cellHeight, scaleHeight, scales, taskTypes, zoom, selected, activeTask, baselines, init*/
    4194240 && (A.init({ tasks: o, links: c, start: d, columns: f, end: h, lengthUnit: m, cellWidth: _, cellHeight: w, scaleHeight: b, scales: u, taskTypes: s, zoom: W, selected: a, activeTask: r, baselines: M }), P && (P(fe), t(6, P = null)));
  }, [n, i, p, z, T, C, P, s, o, a, r, c, u, f, d, h, m, _, w, b, W, M, fe];
}
__name(P1, "P1");
var _mg = class _mg extends ee {
  constructor(e) {
    super(), $(this, e, P1, F1, x, { taskTemplate: 0, markers: 1, taskTypes: 7, tasks: 8, selected: 9, activeTask: 10, links: 11, scales: 12, columns: 13, start: 14, end: 15, lengthUnit: 16, cellWidth: 17, cellHeight: 18, scaleHeight: 19, readonly: 2, cellBorders: 3, editorShape: 4, zoom: 20, baselines: 21, highlightTime: 5, init: 6, api: 22 });
  }
  get api() {
    return this.$$.ctx[22];
  }
};
__name(_mg, "mg");
var mg = _mg;
var Xt = [];
document.addEventListener("keydown", (l) => {
  if (Xt.length && (l.ctrlKey || l.altKey || l.metaKey || l.shiftKey || l.key.length > 1 || l.key === " ")) {
    const e = [];
    l.ctrlKey && e.push("ctrl"), l.altKey && e.push("alt"), l.metaKey && e.push("meta"), l.shiftKey && e.push("shift");
    let t = l.key.toLocaleLowerCase();
    l.key === " " && (t = "space"), e.push(t);
    const n = e.join("+");
    for (let i = Xt.length - 1; i >= 0; i--) {
      const s = Xt[i], o = s.store.get(n) || s.store.get(t), a = l.target.tagName;
      if (o && a !== "INPUT" && a !== "TEXTAREA" && s.isActive()) {
        o(l), l.preventDefault();
        return;
      }
    }
  }
});
var cr = {};
function q1(l) {
  return cr[l] || l;
}
__name(q1, "q1");
function tn(l, e) {
  cr[l] = e;
}
__name(tn, "tn");
function K1(l) {
  let e, t, n;
  return { c() {
    e = D("div"), t = re(" "), g(e, "class", n = "wx-separator" + /*menu*/
    (l[0] ? "-menu" : "") + " x2-1eu7qav");
  }, m(i, s) {
    S(i, e, s), H(e, t);
  }, p(i, _ref94) {
    let [s] = _ref94;
    s & /*menu*/
    1 && n !== (n = "wx-separator" + /*menu*/
    (i[0] ? "-menu" : "") + " x2-1eu7qav") && g(e, "class", n);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(K1, "K1");
function G1(l, e, t) {
  let { menu: n = false } = e;
  return l.$$set = (i) => {
    "menu" in i && t(0, n = i.menu);
  }, [n];
}
__name(G1, "G1");
var _ur = class _ur extends ee {
  constructor(e) {
    super(), $(this, e, G1, K1, x, { menu: 0 });
  }
};
__name(_ur, "ur");
var ur = _ur;
function X1(l) {
  let e;
  return { c() {
    e = D("div"), g(e, "class", "wx-spacer x2-1mbb7ow");
  }, m(t, n) {
    S(t, e, n);
  }, p: I, i: I, o: I, d(t) {
    t && v(e);
  } };
}
__name(X1, "X1");
var _fr = class _fr extends ee {
  constructor(e) {
    super(), $(this, e, null, X1, x, {});
  }
};
__name(_fr, "fr");
var fr = _fr;
function V1(l) {
  let e, t, n, i, s, o;
  const a = [
    { text: (
      /*text*/
      l[3]
    ) },
    { menu: (
      /*menu*/
      l[1]
    ) },
    /*item*/
    l[0]
  ];
  function r(f) {
    l[8](f);
  }
  __name(r, "r");
  var c = (
    /*itemComponent*/
    l[2]
  );
  function u(f, d) {
    let h = {};
    for (let m = 0; m < a.length; m += 1) h = We(h, a[m]);
    return d !== void 0 && d & /*text, menu, item*/
    11 && (h = We(h, Ut(a, [d & /*text*/
    8 && { text: (
      /*text*/
      f[3]
    ) }, d & /*menu*/
    2 && { menu: (
      /*menu*/
      f[1]
    ) }, d & /*item*/
    1 && Jt(
      /*item*/
      f[0]
    )]))), /*$value*/
    f[4] !== void 0 && (h.value = /*$value*/
    f[4]), { props: h };
  }
  __name(u, "u");
  return c && (t = Le(c, u(l)), be.push(() => rt(t, "value", r)), t.$on(
    "click",
    /*onClick*/
    l[5]
  )), { c() {
    e = D("div"), t && F(t.$$.fragment), g(e, "class", i = "wx-tb-element " + /*item*/
    (l[0].css || "") + " x2-ptl7r2"), g(e, "data-id", s = /*item*/
    l[0].id), Q(
      e,
      "wx-spacer",
      /*item*/
      l[0].spacer
    ), Q(
      e,
      "wx-menu",
      /*menu*/
      l[1]
    );
  }, m(f, d) {
    S(f, e, d), t && R(t, e, null), o = true;
  }, p(f, d) {
    if (d & /*itemComponent*/
    4 && c !== (c = /*itemComponent*/
    f[2])) {
      if (t) {
        te();
        const h = t;
        y(h.$$.fragment, 1, 0, () => {
          O(h, 1);
        }), ne();
      }
      c ? (t = Le(c, u(f, d)), be.push(() => rt(t, "value", r)), t.$on(
        "click",
        /*onClick*/
        f[5]
      ), F(t.$$.fragment), k(t.$$.fragment, 1), R(t, e, null)) : t = null;
    } else if (c) {
      const h = d & /*text, menu, item*/
      11 ? Ut(a, [d & /*text*/
      8 && { text: (
        /*text*/
        f[3]
      ) }, d & /*menu*/
      2 && { menu: (
        /*menu*/
        f[1]
      ) }, d & /*item*/
      1 && Jt(
        /*item*/
        f[0]
      )]) : {};
      !n && d & /*$value*/
      16 && (n = true, h.value = /*$value*/
      f[4], dt(() => n = false)), t.$set(h);
    }
    (!o || d & /*item*/
    1 && i !== (i = "wx-tb-element " + /*item*/
    (f[0].css || "") + " x2-ptl7r2")) && g(e, "class", i), (!o || d & /*item*/
    1 && s !== (s = /*item*/
    f[0].id)) && g(e, "data-id", s), (!o || d & /*item, item*/
    1) && Q(
      e,
      "wx-spacer",
      /*item*/
      f[0].spacer
    ), (!o || d & /*item, menu*/
    3) && Q(
      e,
      "wx-menu",
      /*menu*/
      f[1]
    );
  }, i(f) {
    o || (t && k(t.$$.fragment, f), o = true);
  }, o(f) {
    t && y(t.$$.fragment, f), o = false;
  }, d(f) {
    f && v(e), t && O(t);
  } };
}
__name(V1, "V1");
function U1(l) {
  let e, t;
  return e = new ur({ props: { menu: (
    /*menu*/
    l[1]
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*menu*/
    2 && (s.menu = /*menu*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(U1, "U1");
function J1(l) {
  let e, t;
  return e = new fr({ props: { menu: (
    /*menu*/
    l[1]
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*menu*/
    2 && (s.menu = /*menu*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(J1, "J1");
function Q1(l) {
  let e, t, n, i;
  const s = [J1, U1, V1], o = [];
  function a(r, c) {
    return (
      /*item*/
      r[0].comp == "spacer" ? 0 : (
        /*item*/
        r[0].comp == "separator" ? 1 : 2
      )
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, _ref95) {
    let [c] = _ref95;
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(Q1, "Q1");
function x1(l, e, t) {
  let n;
  const i = He();
  let { item: s = {} } = e, { menu: o = false } = e, { values: a } = e, r;
  function c() {
    s.handler && s.handler(s), i("click", { item: s });
  }
  __name(c, "c");
  let u = cl(null);
  ce(l, u, (m) => t(4, n = m));
  let f = false;
  u.subscribe((m) => {
    f || i("change", { value: m, item: s });
  });
  let d = "";
  function h(m) {
    n = m, u.set(n);
  }
  __name(h, "h");
  return l.$$set = (m) => {
    "item" in m && t(0, s = m.item), "menu" in m && t(1, o = m.menu), "values" in m && t(7, a = m.values);
  }, l.$$.update = () => {
    l.$$.dirty & /*item*/
    1 && t(2, r = q1(s.comp || "label")), l.$$.dirty & /*item, values*/
    129 && s.key && (f = true, a ? Cl(u, n = a[s.key], n) : Cl(u, n = void 0, n), f = false), l.$$.dirty & /*menu, item*/
    3 && t(3, d = o && s.menuText || s.text);
  }, [s, o, r, d, n, c, u, a, h];
}
__name(x1, "x1");
var _Sl = class _Sl extends ee {
  constructor(e) {
    super(), $(this, e, x1, Q1, x, { item: 0, menu: 1, values: 7 });
  }
};
__name(_Sl, "Sl");
var Sl = _Sl;
function Gs(l, e, t) {
  const n = l.slice();
  return n[11] = e[t], n;
}
__name(Gs, "Gs");
function $1(l) {
  let e, t, n, i, s = de(
    /*item*/
    l[0].items
  ), o = [];
  for (let c = 0; c < s.length; c += 1) o[c] = Xs(Gs(l, s, c));
  const a = /* @__PURE__ */ __name((c) => y(o[c], 1, 1, () => {
    o[c] = null;
  }), "a");
  let r = (
    /*item*/
    l[0].text && Vs(l)
  );
  return { c() {
    e = D("div");
    for (let c = 0; c < o.length; c += 1) o[c].c();
    t = Y(), r && r.c(), n = se(), g(e, "class", "wx-tb-body x2-155fw4u");
  }, m(c, u) {
    S(c, e, u);
    for (let f = 0; f < o.length; f += 1) o[f] && o[f].m(e, null);
    S(c, t, u), r && r.m(c, u), S(c, n, u), i = true;
  }, p(c, u) {
    if (u & /*item, values, onClick*/
    19) {
      s = de(
        /*item*/
        c[0].items
      );
      let f;
      for (f = 0; f < s.length; f += 1) {
        const d = Gs(c, s, f);
        o[f] ? (o[f].p(d, u), k(o[f], 1)) : (o[f] = Xs(d), o[f].c(), k(o[f], 1), o[f].m(e, null));
      }
      for (te(), f = s.length; f < o.length; f += 1) a(f);
      ne();
    }
    c[0].text ? r ? r.p(c, u) : (r = Vs(c), r.c(), r.m(n.parentNode, n)) : r && (r.d(1), r = null);
  }, i(c) {
    if (!i) {
      for (let u = 0; u < s.length; u += 1) k(o[u]);
      i = true;
    }
  }, o(c) {
    o = o.filter(Boolean);
    for (let u = 0; u < o.length; u += 1) y(o[u]);
    i = false;
  }, d(c) {
    c && (v(e), v(t), v(n)), $e(o, c), r && r.d(c);
  } };
}
__name($1, "$1");
function e_(l) {
  let e, t, n, i, s, o, a, r, c = (
    /*item*/
    l[0].icon && Us(l)
  ), u = (
    /*item*/
    l[0].text && Js(l)
  ), f = (
    /*item*/
    l[0].text && !/*item*/
    l[0].icon && Qs()
  ), d = !/*collapsed*/
  l[3] && xs(l);
  return { c() {
    e = D("div"), c && c.c(), t = Y(), u && u.c(), n = Y(), f && f.c(), i = Y(), d && d.c(), s = se(), g(e, "class", "wx-collapsed x2-155fw4u");
  }, m(h, m) {
    S(h, e, m), c && c.m(e, null), H(e, t), u && u.m(e, null), H(e, n), f && f.m(e, null), S(h, i, m), d && d.m(h, m), S(h, s, m), o = true, a || (r = q(
      e,
      "click",
      /*show*/
      l[5]
    ), a = true);
  }, p(h, m) {
    h[0].icon ? c ? c.p(h, m) : (c = Us(h), c.c(), c.m(e, t)) : c && (c.d(1), c = null), /*item*/
    h[0].text ? u ? u.p(h, m) : (u = Js(h), u.c(), u.m(e, n)) : u && (u.d(1), u = null), /*item*/
    h[0].text && !/*item*/
    h[0].icon ? f || (f = Qs(), f.c(), f.m(e, null)) : f && (f.d(1), f = null), /*collapsed*/
    h[3] ? d && (te(), y(d, 1, 1, () => {
      d = null;
    }), ne()) : d ? (d.p(h, m), m & /*collapsed*/
    8 && k(d, 1)) : (d = xs(h), d.c(), k(d, 1), d.m(s.parentNode, s));
  }, i(h) {
    o || (k(d), o = true);
  }, o(h) {
    y(d), o = false;
  }, d(h) {
    h && (v(e), v(i), v(s)), c && c.d(), u && u.d(), f && f.d(), d && d.d(h), a = false, r();
  } };
}
__name(e_, "e_");
function t_(l) {
  let e, t;
  return e = new Sl({ props: { item: (
    /*sub*/
    l[11]
  ), values: (
    /*values*/
    l[1]
  ) } }), e.$on(
    "click",
    /*onClick*/
    l[4]
  ), e.$on(
    "change",
    /*change_handler_2*/
    l[9]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*item*/
    1 && (s.item = /*sub*/
    n[11]), i & /*values*/
    2 && (s.values = /*values*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(t_, "t_");
function n_(l) {
  let e, t;
  return e = new Yn({ props: { item: (
    /*sub*/
    l[11]
  ), values: (
    /*values*/
    l[1]
  ) } }), e.$on(
    "click",
    /*onClick*/
    l[4]
  ), e.$on(
    "change",
    /*change_handler_1*/
    l[8]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*item*/
    1 && (s.item = /*sub*/
    n[11]), i & /*values*/
    2 && (s.values = /*values*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(n_, "n_");
function Xs(l) {
  let e, t, n, i;
  const s = [n_, t_], o = [];
  function a(r, c) {
    return (
      /*sub*/
      r[11].items ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, c) {
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(Xs, "Xs");
function Vs(l) {
  let e, t = (
    /*item*/
    l[0].text + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-label x2-155fw4u");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*item*/
    1 && t !== (t = /*item*/
    i[0].text + "") && me(n, t);
  }, d(i) {
    i && v(e);
  } };
}
__name(Vs, "Vs");
function Us(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = "icon " + /*item*/
    l[0].icon + " x2-155fw4u");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*item*/
    1 && t !== (t = "icon " + /*item*/
    n[0].icon + " x2-155fw4u") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(Us, "Us");
function Js(l) {
  let e, t = (
    /*item*/
    l[0].text + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-label-text");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*item*/
    1 && t !== (t = /*item*/
    i[0].text + "") && me(n, t);
  }, d(i) {
    i && v(e);
  } };
}
__name(Js, "Js");
function Qs(l) {
  let e;
  return { c() {
    e = D("i"), g(e, "class", "wx-label-arrow wxi-angle-down");
  }, m(t, n) {
    S(t, e, n);
  }, d(t) {
    t && v(e);
  } };
}
__name(Qs, "Qs");
function xs(l) {
  let e, t;
  return e = new pn({ props: { width: "", cancel: (
    /*cancel*/
    l[6]
  ), $$slots: { default: [l_] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*$$scope, item, values, menu*/
    16391 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(xs, "xs");
function l_(l) {
  let e, t, n;
  return t = new Yn({ props: { item: { .../*item*/
  l[0], text: "", collapsed: false }, values: (
    /*values*/
    l[1]
  ), menu: (
    /*menu*/
    l[2]
  ) } }), t.$on(
    "change",
    /*change_handler*/
    l[7]
  ), t.$on(
    "click",
    /*onClick*/
    l[4]
  ), { c() {
    e = D("div"), F(t.$$.fragment), g(e, "class", "wx-drop-group");
  }, m(i, s) {
    S(i, e, s), R(t, e, null), n = true;
  }, p(i, s) {
    const o = {};
    s & /*item*/
    1 && (o.item = { .../*item*/
    i[0], text: "", collapsed: false }), s & /*values*/
    2 && (o.values = /*values*/
    i[1]), s & /*menu*/
    4 && (o.menu = /*menu*/
    i[2]), t.$set(o);
  }, i(i) {
    n || (k(t.$$.fragment, i), n = true);
  }, o(i) {
    y(t.$$.fragment, i), n = false;
  }, d(i) {
    i && v(e), O(t);
  } };
}
__name(l_, "l_");
function i_(l) {
  let e, t, n, i, s;
  const o = [e_, $1], a = [];
  function r(c, u) {
    return (
      /*item*/
      c[0].collapsed && !/*menu*/
      c[2] ? 0 : 1
    );
  }
  __name(r, "r");
  return t = r(l), n = a[t] = o[t](l), { c() {
    e = D("div"), n.c(), g(e, "class", i = "wx-tb-group " + /*item*/
    (l[0].css || "") + " x2-155fw4u"), Q(
      e,
      "wx-column",
      /*item*/
      l[0].layout == "column"
    ), Q(
      e,
      "wx-group-collapsed",
      /*item*/
      l[0].collapsed && !/*menu*/
      l[2]
    );
  }, m(c, u) {
    S(c, e, u), a[t].m(e, null), s = true;
  }, p(c, _ref96) {
    let [u] = _ref96;
    let f = t;
    t = r(c), t === f ? a[t].p(c, u) : (te(), y(a[f], 1, 1, () => {
      a[f] = null;
    }), ne(), n = a[t], n ? n.p(c, u) : (n = a[t] = o[t](c), n.c()), k(n, 1), n.m(e, null)), (!s || u & /*item*/
    1 && i !== (i = "wx-tb-group " + /*item*/
    (c[0].css || "") + " x2-155fw4u")) && g(e, "class", i), (!s || u & /*item, item*/
    1) && Q(
      e,
      "wx-column",
      /*item*/
      c[0].layout == "column"
    ), (!s || u & /*item, item, menu*/
    5) && Q(
      e,
      "wx-group-collapsed",
      /*item*/
      c[0].collapsed && !/*menu*/
      c[2]
    );
  }, i(c) {
    s || (k(n), s = true);
  }, o(c) {
    y(n), s = false;
  }, d(c) {
    c && v(e), a[t].d();
  } };
}
__name(i_, "i_");
function s_(l, e, t) {
  const n = He();
  let { item: i } = e, { values: s = null } = e, { menu: o = false } = e, a = false;
  const r = /* @__PURE__ */ __name((m) => {
    u(), n("click", m.detail);
  }, "r"), c = /* @__PURE__ */ __name(() => t(3, a = false), "c"), u = /* @__PURE__ */ __name(() => t(3, a = true), "u");
  function f(m) {
    De.call(this, l, m);
  }
  __name(f, "f");
  function d(m) {
    De.call(this, l, m);
  }
  __name(d, "d");
  function h(m) {
    De.call(this, l, m);
  }
  __name(h, "h");
  return l.$$set = (m) => {
    "item" in m && t(0, i = m.item), "values" in m && t(1, s = m.values), "menu" in m && t(2, o = m.menu);
  }, l.$$.update = () => {
    l.$$.dirty & /*item*/
    1 && i.collapsed && t(3, a = true);
  }, [i, s, o, a, r, c, u, f, d, h];
}
__name(s_, "s_");
var _Yn = class _Yn extends ee {
  constructor(e) {
    super(), $(this, e, s_, i_, x, { item: 0, values: 1, menu: 2 });
  }
};
__name(_Yn, "Yn");
var Yn = _Yn;
function $s(l, e, t) {
  const n = l.slice();
  return n[13] = e[t], n;
}
__name($s, "$s");
function eo(l) {
  let e, t;
  return e = new pn({ props: { width: (
    /*width*/
    l[3] + "px"
  ), cancel: (
    /*cancel*/
    l[6]
  ), $$slots: { default: [a_] }, $$scope: { ctx: l } } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*width*/
    8 && (s.width = /*width*/
    n[3] + "px"), i & /*$$scope, items, values*/
    65541 && (s.$$scope = { dirty: i, ctx: n }), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(eo, "eo");
function o_(l) {
  let e, t;
  return e = new Sl({ props: { item: (
    /*item*/
    l[13]
  ), values: (
    /*values*/
    l[2]
  ), menu: true } }), e.$on(
    "click",
    /*menuClick*/
    l[8]
  ), e.$on(
    "change",
    /*change_handler_1*/
    l[10]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*items*/
    1 && (s.item = /*item*/
    n[13]), i & /*values*/
    4 && (s.values = /*values*/
    n[2]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(o_, "o_");
function r_(l) {
  let e, t;
  return e = new Yn({ props: { item: (
    /*item*/
    l[13]
  ), values: (
    /*values*/
    l[2]
  ), menu: true } }), e.$on(
    "click",
    /*menuClick*/
    l[8]
  ), e.$on(
    "change",
    /*change_handler*/
    l[9]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*items*/
    1 && (s.item = /*item*/
    n[13]), i & /*values*/
    4 && (s.values = /*values*/
    n[2]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(r_, "r_");
function to(l) {
  let e, t, n, i;
  const s = [r_, o_], o = [];
  function a(r, c) {
    return (
      /*item*/
      r[13].items ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, c) {
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(to, "to");
function a_(l) {
  let e, t, n = de(
    /*items*/
    l[0]
  ), i = [];
  for (let o = 0; o < n.length; o += 1) i[o] = to($s(l, n, o));
  const s = /* @__PURE__ */ __name((o) => y(i[o], 1, 1, () => {
    i[o] = null;
  }), "s");
  return { c() {
    e = D("div");
    for (let o = 0; o < i.length; o += 1) i[o].c();
    g(e, "class", "wx-drop-menu x2-7mtmlh");
  }, m(o, a) {
    S(o, e, a);
    for (let r = 0; r < i.length; r += 1) i[r] && i[r].m(e, null);
    t = true;
  }, p(o, a) {
    if (a & /*items, values, menuClick*/
    261) {
      n = de(
        /*items*/
        o[0]
      );
      let r;
      for (r = 0; r < n.length; r += 1) {
        const c = $s(o, n, r);
        i[r] ? (i[r].p(c, a), k(i[r], 1)) : (i[r] = to(c), i[r].c(), k(i[r], 1), i[r].m(e, null));
      }
      for (te(), r = n.length; r < i.length; r += 1) s(r);
      ne();
    }
  }, i(o) {
    if (!t) {
      for (let a = 0; a < n.length; a += 1) k(i[a]);
      t = true;
    }
  }, o(o) {
    i = i.filter(Boolean);
    for (let a = 0; a < i.length; a += 1) y(i[a]);
    t = false;
  }, d(o) {
    o && v(e), $e(i, o);
  } };
}
__name(a_, "a_");
function c_(l) {
  let e, t, n, i, s;
  t = new mn({ props: { icon: "wxi-dots-h", click: (
    /*showMenu*/
    l[7]
  ) } });
  let o = (
    /*popup*/
    l[4] && eo(l)
  );
  return { c() {
    e = D("div"), F(t.$$.fragment), n = Y(), o && o.c(), g(e, "class", i = "wx-menu " + /*css*/
    (l[1] || "") + " x2-7mtmlh"), g(e, "data-id", "$menu");
  }, m(a, r) {
    S(a, e, r), R(t, e, null), H(e, n), o && o.m(e, null), l[11](e), s = true;
  }, p(a, _ref97) {
    let [r] = _ref97;
    a[4] ? o ? (o.p(a, r), r & /*popup*/
    16 && k(o, 1)) : (o = eo(a), o.c(), k(o, 1), o.m(e, null)) : o && (te(), y(o, 1, 1, () => {
      o = null;
    }), ne()), (!s || r & /*css*/
    2 && i !== (i = "wx-menu " + /*css*/
    (a[1] || "") + " x2-7mtmlh")) && g(e, "class", i);
  }, i(a) {
    s || (k(t.$$.fragment, a), k(o), s = true);
  }, o(a) {
    y(t.$$.fragment, a), y(o), s = false;
  }, d(a) {
    a && v(e), O(t), o && o.d(), l[11](null);
  } };
}
__name(c_, "c_");
function u_(l, e, t) {
  let { items: n = [] } = e, { css: i } = e, { values: s } = e;
  const o = He();
  let { width: a } = e, r, c;
  function u() {
    t(4, r = null);
  }
  __name(u, "u");
  function f() {
    t(4, r = true);
  }
  __name(f, "f");
  function d(w) {
    u(), o("click", w.detail);
  }
  __name(d, "d");
  function h(w) {
    De.call(this, l, w);
  }
  __name(h, "h");
  function m(w) {
    De.call(this, l, w);
  }
  __name(m, "m");
  function _(w) {
    be[w ? "unshift" : "push"](() => {
      c = w, t(5, c);
    });
  }
  __name(_, "_");
  return l.$$set = (w) => {
    "items" in w && t(0, n = w.items), "css" in w && t(1, i = w.css), "values" in w && t(2, s = w.values), "width" in w && t(3, a = w.width);
  }, [n, i, s, a, r, c, u, f, d, h, m, _];
}
__name(u_, "u_");
var _f_ = class _f_ extends ee {
  constructor(e) {
    super(), $(this, e, u_, c_, x, { items: 0, css: 1, values: 2, width: 3 });
  }
};
__name(_f_, "f_");
var f_ = _f_;
function no(l, e, t) {
  const n = l.slice();
  return n[20] = e[t], n[22] = t, n;
}
__name(no, "no");
function d_(l) {
  let e, t;
  return e = new Sl({ props: { item: (
    /*item*/
    l[20]
  ), values: (
    /*values*/
    l[0]
  ) } }), e.$on(
    "click",
    /*click_handler_1*/
    l[10]
  ), e.$on(
    "change",
    /*handleChange*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*visibleItems*/
    64 && (s.item = /*item*/
    n[20]), i & /*values*/
    1 && (s.values = /*values*/
    n[0]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(d_, "d_");
function h_(l) {
  let e, t;
  return e = new Yn({ props: { item: (
    /*item*/
    l[20]
  ), values: (
    /*values*/
    l[0]
  ) } }), e.$on(
    "click",
    /*click_handler*/
    l[9]
  ), e.$on(
    "change",
    /*handleChange*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*visibleItems*/
    64 && (s.item = /*item*/
    n[20]), i & /*values*/
    1 && (s.values = /*values*/
    n[0]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(h_, "h_");
function lo(l) {
  let e, t, n, i;
  const s = [h_, d_], o = [];
  function a(r, c) {
    return (
      /*item*/
      r[20].items ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, c) {
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(lo, "lo");
function io(l) {
  let e, t;
  return e = new f_({ props: { items: (
    /*menuItems*/
    l[5]
  ), css: (
    /*menuCss*/
    l[1]
  ), values: (
    /*values*/
    l[0]
  ) } }), e.$on(
    "click",
    /*click_handler_2*/
    l[11]
  ), e.$on(
    "change",
    /*handleChange*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*menuItems*/
    32 && (s.items = /*menuItems*/
    n[5]), i & /*menuCss*/
    2 && (s.css = /*menuCss*/
    n[1]), i & /*values*/
    1 && (s.values = /*values*/
    n[0]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(io, "io");
function m_(l) {
  let e, t, n, i, s = de(
    /*visibleItems*/
    l[6]
  ), o = [];
  for (let c = 0; c < s.length; c += 1) o[c] = lo(no(l, s, c));
  const a = /* @__PURE__ */ __name((c) => y(o[c], 1, 1, () => {
    o[c] = null;
  }), "a");
  let r = (
    /*menuItems*/
    l[5].length && io(l)
  );
  return { c() {
    e = D("div");
    for (let c = 0; c < o.length; c += 1) o[c].c();
    t = Y(), r && r.c(), g(e, "class", n = "wx-toolbar " + /*css*/
    l[2] + " x2-b19ms9"), Q(
      e,
      "wx-wrap",
      /*overflow*/
      l[3] === "wrap"
    );
  }, m(c, u) {
    S(c, e, u);
    for (let f = 0; f < o.length; f += 1) o[f] && o[f].m(e, null);
    H(e, t), r && r.m(e, null), l[12](e), i = true;
  }, p(c, _ref98) {
    let [u] = _ref98;
    if (u & /*visibleItems, values, handleChange*/
    193) {
      s = de(
        /*visibleItems*/
        c[6]
      );
      let f;
      for (f = 0; f < s.length; f += 1) {
        const d = no(c, s, f);
        o[f] ? (o[f].p(d, u), k(o[f], 1)) : (o[f] = lo(d), o[f].c(), k(o[f], 1), o[f].m(e, t));
      }
      for (te(), f = s.length; f < o.length; f += 1) a(f);
      ne();
    }
    c[5].length ? r ? (r.p(c, u), u & /*menuItems*/
    32 && k(r, 1)) : (r = io(c), r.c(), k(r, 1), r.m(e, null)) : r && (te(), y(r, 1, 1, () => {
      r = null;
    }), ne()), (!i || u & /*css*/
    4 && n !== (n = "wx-toolbar " + /*css*/
    c[2] + " x2-b19ms9")) && g(e, "class", n), (!i || u & /*css, overflow*/
    12) && Q(
      e,
      "wx-wrap",
      /*overflow*/
      c[3] === "wrap"
    );
  }, i(c) {
    if (!i) {
      for (let u = 0; u < s.length; u += 1) k(o[u]);
      k(r), i = true;
    }
  }, o(c) {
    o = o.filter(Boolean);
    for (let u = 0; u < o.length; u += 1) y(o[u]);
    y(r), i = false;
  }, d(c) {
    c && v(e), $e(o, c), r && r.d(), l[12](null);
  } };
}
__name(m_, "m_");
function __(l, e, t) {
  let { items: n = [] } = e, { menuCss: i = "" } = e, { css: s } = e, { values: o = null } = e, { overflow: a = "menu" } = e;
  const r = He();
  function c(C) {
    o && (t(0, o[C.detail.item.key] = C.detail.value, o), t(0, o)), r("change", C.detail);
  }
  __name(c, "c");
  let u, f = -1, d = [], h;
  function m() {
    if (a === "wrap") return;
    const C = u.clientWidth;
    if (u.scrollWidth > C) {
      if (a === "collapse") return w();
      const A = u.children;
      let B = 0;
      for (let V = 0; V < n.length; V++) {
        if (B += A[V].clientWidth, n[V].comp == "separator" && (B += 8), B > C - 40) {
          if (f === V) return;
          f = V, t(5, d = []);
          for (let fe = V; fe < n.length; fe++) d.push(n[fe]), A[fe].style.visibility = "hidden";
          V > 0 && n[V - 1].comp == "separator" && (A[V - 1].style.visibility = "hidden");
          break;
        }
        A[V].style.visibility = "";
      }
    } else {
      const A = C - _();
      if (A <= 0) return;
      if (a === "collapse") return b(A);
      if (d.length) {
        f = null;
        const B = u.children;
        for (let V = 0; V < n.length; V++) B[V].style.visibility = "";
        t(5, d = []);
      }
    }
  }
  __name(m, "m");
  function _() {
    const C = u.children;
    let P = 0;
    for (let X = 0; X < n.length; X++) n[X].comp != "spacer" && (P += C[X].clientWidth, n[X].comp == "separator" && (P += 8));
    return P;
  }
  __name(_, "_");
  function w() {
    for (let C = n.length - 1; C >= 0; C--) if (n[C].items && !n[C].collapsed) {
      t(8, n[C].collapsed = true, n), t(8, n[C].$width = u.children[C].offsetWidth, n), Dn().then(m);
      return;
    }
  }
  __name(w, "w");
  function b(C) {
    for (let P = 0; P < n.length; P++) if (n[P].collapsed && n[P].$width) {
      n[P].$width - u.children[P].offsetWidth < C + 10 && (t(8, n[P].collapsed = false, n), Dn().then(m));
      return;
    }
  }
  __name(b, "b");
  function p(C) {
    C.forEach((P) => {
      P.id || (P.id = Rt());
    });
  }
  __name(p, "p");
  ht(() => {
    const C = new ResizeObserver(() => m());
    return C.observe(u), () => {
      C && C.unobserve(u);
    };
  });
  function z(C) {
    De.call(this, l, C);
  }
  __name(z, "z");
  function T(C) {
    De.call(this, l, C);
  }
  __name(T, "T");
  function W(C) {
    De.call(this, l, C);
  }
  __name(W, "W");
  function M(C) {
    be[C ? "unshift" : "push"](() => {
      u = C, t(4, u);
    });
  }
  __name(M, "M");
  return l.$$set = (C) => {
    "items" in C && t(8, n = C.items), "menuCss" in C && t(1, i = C.menuCss), "css" in C && t(2, s = C.css), "values" in C && t(0, o = C.values), "overflow" in C && t(3, a = C.overflow);
  }, l.$$.update = () => {
    l.$$.dirty & /*items*/
    256 && (p(n), t(6, h = n));
  }, [o, i, s, a, u, d, h, c, n, z, T, W, M];
}
__name(__, "__");
var _g_ = class _g_ extends ee {
  constructor(e) {
    super(), $(this, e, __, m_, x, { items: 8, menuCss: 1, css: 2, values: 0, overflow: 3 });
  }
};
__name(_g_, "g_");
var g_ = _g_;
function w_(l) {
  let e, t;
  return e = new mn({ props: { icon: (
    /*icon*/
    l[0]
  ), type: (
    /*type*/
    l[3]
  ), css: (
    /*css*/
    l[2]
  ), text: (
    /*text*/
    l[1]
  ), disabled: (
    /*disabled*/
    l[4]
  ) } }), e.$on(
    "click",
    /*click_handler_1*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*icon*/
    1 && (s.icon = /*icon*/
    n[0]), i & /*type*/
    8 && (s.type = /*type*/
    n[3]), i & /*css*/
    4 && (s.css = /*css*/
    n[2]), i & /*text*/
    2 && (s.text = /*text*/
    n[1]), i & /*disabled*/
    16 && (s.disabled = /*disabled*/
    n[4]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(w_, "w_");
function b_(l) {
  let e, t, n, i, s, o, a;
  return { c() {
    e = D("div"), t = D("i"), i = Y(), s = re(
      /*text*/
      l[1]
    ), g(t, "class", n = /*icon*/
    (l[0] || "wxi-empty") + " " + /*css*/
    (l[2] || "") + " x2-b4dkf1"), g(e, "class", "wx-item x2-b4dkf1");
  }, m(r, c) {
    S(r, e, c), H(e, t), H(e, i), H(e, s), o || (a = q(
      e,
      "click",
      /*click_handler*/
      l[6]
    ), o = true);
  }, p(r, c) {
    c & /*icon, css*/
    5 && n !== (n = /*icon*/
    (r[0] || "wxi-empty") + " " + /*css*/
    (r[2] || "") + " x2-b4dkf1") && g(t, "class", n), c & /*text*/
    2 && me(
      s,
      /*text*/
      r[1]
    );
  }, i: I, o: I, d(r) {
    r && v(e), o = false, a();
  } };
}
__name(b_, "b_");
function k_(l) {
  let e, t, n, i;
  const s = [b_, w_], o = [];
  function a(r, c) {
    return (
      /*menu*/
      r[5] ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, _ref99) {
    let [c] = _ref99;
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(k_, "k_");
function p_(l, e, t) {
  let { icon: n } = e, { text: i = "" } = e, { css: s } = e, { type: o } = e, { disabled: a } = e, { menu: r } = e;
  function c(f) {
    De.call(this, l, f);
  }
  __name(c, "c");
  function u(f) {
    De.call(this, l, f);
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "icon" in f && t(0, n = f.icon), "text" in f && t(1, i = f.text), "css" in f && t(2, s = f.css), "type" in f && t(3, o = f.type), "disabled" in f && t(4, a = f.disabled), "menu" in f && t(5, r = f.menu);
  }, [n, i, s, o, a, r, c, u];
}
__name(p_, "p_");
var _y_ = class _y_ extends ee {
  constructor(e) {
    super(), $(this, e, p_, k_, x, { icon: 0, text: 1, css: 2, type: 3, disabled: 4, menu: 5 });
  }
};
__name(_y_, "y_");
var y_ = _y_;
function v_(l) {
  let e, t = (
    /*value*/
    (l[1] || /*text*/
    l[0]) + ""
  ), n;
  return { c() {
    e = D("div"), n = re(t), g(e, "class", "wx-label x2-agyr5c");
  }, m(i, s) {
    S(i, e, s), H(e, n);
  }, p(i, s) {
    s & /*value, text*/
    3 && t !== (t = /*value*/
    (i[1] || /*text*/
    i[0]) + "") && me(n, t);
  }, i: I, o: I, d(i) {
    i && v(e);
  } };
}
__name(v_, "v_");
function S_(l) {
  let e, t;
  const n = (
    /*#slots*/
    l[4].default
  ), i = Ie(
    n,
    l,
    /*$$scope*/
    l[3],
    null
  );
  return { c() {
    e = D("div"), i && i.c(), g(e, "class", "wx-label x2-agyr5c");
  }, m(s, o) {
    S(s, e, o), i && i.m(e, null), t = true;
  }, p(s, o) {
    i && i.p && (!t || o & /*$$scope*/
    8) && Oe(
      i,
      n,
      s,
      /*$$scope*/
      s[3],
      t ? Re(
        n,
        /*$$scope*/
        s[3],
        o,
        null
      ) : Ae(
        /*$$scope*/
        s[3]
      ),
      null
    );
  }, i(s) {
    t || (k(i, s), t = true);
  }, o(s) {
    y(i, s), t = false;
  }, d(s) {
    s && v(e), i && i.d(s);
  } };
}
__name(S_, "S_");
function M_(l) {
  let e, t, n, i;
  const s = [S_, v_], o = [];
  function a(r, c) {
    return (
      /*SLOTS*/
      r[2] ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, _ref100) {
    let [c] = _ref100;
    t.p(r, c);
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(M_, "M_");
function T_(l, e, t) {
  let { $$slots: n = {}, $$scope: i } = e, { text: s } = e, { value: o } = e;
  const a = e.$$slots;
  return l.$$set = (r) => {
    t(5, e = We(We({}, e), qe(r))), "text" in r && t(0, s = r.text), "value" in r && t(1, o = r.value), "$$scope" in r && t(3, i = r.$$scope);
  }, e = qe(e), [s, o, a, i, n];
}
__name(T_, "T_");
var _C_ = class _C_ extends ee {
  constructor(e) {
    super(), $(this, e, T_, M_, x, { text: 0, value: 1 });
  }
};
__name(_C_, "C_");
var C_ = _C_;
function D_(l) {
  let e, t;
  return e = new mn({ props: { icon: (
    /*icon*/
    l[0]
  ), type: (
    /*type*/
    l[3]
  ), css: (
    /*css*/
    l[2]
  ), title: (
    /*text*/
    l[1]
  ), disabled: (
    /*disabled*/
    l[4]
  ) } }), e.$on(
    "click",
    /*click_handler_1*/
    l[7]
  ), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, i) {
    const s = {};
    i & /*icon*/
    1 && (s.icon = /*icon*/
    n[0]), i & /*type*/
    8 && (s.type = /*type*/
    n[3]), i & /*css*/
    4 && (s.css = /*css*/
    n[2]), i & /*text*/
    2 && (s.title = /*text*/
    n[1]), i & /*disabled*/
    16 && (s.disabled = /*disabled*/
    n[4]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(D_, "D_");
function W_(l) {
  let e, t, n, i, s, o = (
    /*icon*/
    l[0] && so(l)
  );
  return { c() {
    e = D("div"), o && o.c(), t = Y(), n = re(
      /*text*/
      l[1]
    ), g(e, "class", "wx-item x2-ng2v87");
  }, m(a, r) {
    S(a, e, r), o && o.m(e, null), H(e, t), H(e, n), i || (s = q(
      e,
      "click",
      /*click_handler*/
      l[6]
    ), i = true);
  }, p(a, r) {
    a[0] ? o ? o.p(a, r) : (o = so(a), o.c(), o.m(e, t)) : o && (o.d(1), o = null), r & /*text*/
    2 && me(
      n,
      /*text*/
      a[1]
    );
  }, i: I, o: I, d(a) {
    a && v(e), o && o.d(), i = false, s();
  } };
}
__name(W_, "W_");
function so(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = /*icon*/
    l[0] + " " + /*css*/
    l[2] + " x2-ng2v87");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*icon, css*/
    5 && t !== (t = /*icon*/
    n[0] + " " + /*css*/
    n[2] + " x2-ng2v87") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(so, "so");
function H_(l) {
  let e, t, n, i;
  const s = [W_, D_], o = [];
  function a(r, c) {
    return (
      /*menu*/
      r[5] ? 0 : 1
    );
  }
  __name(a, "a");
  return e = a(l), t = o[e] = s[e](l), { c() {
    t.c(), n = se();
  }, m(r, c) {
    o[e].m(r, c), S(r, n, c), i = true;
  }, p(r, _ref101) {
    let [c] = _ref101;
    let u = e;
    e = a(r), e === u ? o[e].p(r, c) : (te(), y(o[u], 1, 1, () => {
      o[u] = null;
    }), ne(), t = o[e], t ? t.p(r, c) : (t = o[e] = s[e](r), t.c()), k(t, 1), t.m(n.parentNode, n));
  }, i(r) {
    i || (k(t), i = true);
  }, o(r) {
    y(t), i = false;
  }, d(r) {
    r && v(n), o[e].d(r);
  } };
}
__name(H_, "H_");
function z_(l, e, t) {
  let { icon: n } = e, { text: i } = e, { css: s } = e, { type: o } = e, { disabled: a } = e, { menu: r } = e;
  function c(f) {
    De.call(this, l, f);
  }
  __name(c, "c");
  function u(f) {
    De.call(this, l, f);
  }
  __name(u, "u");
  return l.$$set = (f) => {
    "icon" in f && t(0, n = f.icon), "text" in f && t(1, i = f.text), "css" in f && t(2, s = f.css), "type" in f && t(3, o = f.type), "disabled" in f && t(4, a = f.disabled), "menu" in f && t(5, r = f.menu);
  }, [n, i, s, o, a, r, c, u];
}
__name(z_, "z_");
var _N_ = class _N_ extends ee {
  constructor(e) {
    super(), $(this, e, z_, H_, x, { icon: 0, text: 1, css: 2, type: 3, disabled: 4, menu: 5 });
  }
};
__name(_N_, "N_");
var N_ = _N_;
function oo(l) {
  let e, t;
  return { c() {
    e = D("i"), g(e, "class", t = Ve(
      /*icon*/
      l[2]
    ) + " x2-g7c8cw");
  }, m(n, i) {
    S(n, e, i);
  }, p(n, i) {
    i & /*icon*/
    4 && t !== (t = Ve(
      /*icon*/
      n[2]
    ) + " x2-g7c8cw") && g(e, "class", t);
  }, d(n) {
    n && v(e);
  } };
}
__name(oo, "oo");
function L_(l) {
  let e, t, n, i, s, o, a = (
    /*icon*/
    l[2] && oo(l)
  );
  return { c() {
    e = D("div"), a && a.c(), t = Y(), n = re(
      /*text*/
      l[0]
    ), g(e, "class", i = "wx-label " + /*css*/
    l[1] + " x2-g7c8cw");
  }, m(r, c) {
    S(r, e, c), a && a.m(e, null), H(e, t), H(e, n), s || (o = q(
      e,
      "click",
      /*handleClick*/
      l[3]
    ), s = true);
  }, p(r, _ref102) {
    let [c] = _ref102;
    r[2] ? a ? a.p(r, c) : (a = oo(r), a.c(), a.m(e, t)) : a && (a.d(1), a = null), c & /*text*/
    1 && me(
      n,
      /*text*/
      r[0]
    ), c & /*css*/
    2 && i !== (i = "wx-label " + /*css*/
    r[1] + " x2-g7c8cw") && g(e, "class", i);
  }, i: I, o: I, d(r) {
    r && v(e), a && a.d(), s = false, o();
  } };
}
__name(L_, "L_");
function E_(l, e, t) {
  const n = He();
  let { id: i = "" } = e, { text: s = "" } = e, { css: o = "" } = e, { icon: a = "" } = e;
  function r() {
    n("click", { id: i });
  }
  __name(r, "r");
  return l.$$set = (c) => {
    "id" in c && t(4, i = c.id), "text" in c && t(0, s = c.text), "css" in c && t(1, o = c.css), "icon" in c && t(2, a = c.icon);
  }, [s, o, a, r, i];
}
__name(E_, "E_");
var _I_ = class _I_ extends ee {
  constructor(e) {
    super(), $(this, e, E_, L_, x, { id: 4, text: 0, css: 1, icon: 2 });
  }
};
__name(_I_, "I_");
var I_ = _I_;
tn("button", y_);
tn("separator", ur);
tn("spacer", fr);
tn("label", C_);
tn("item", I_);
tn("icon", N_);
function R_(l) {
  let e, t;
  return e = new g_({ props: { items: (
    /*buttons*/
    l[1]
  ) } }), { c() {
    F(e.$$.fragment);
  }, m(n, i) {
    R(e, n, i), t = true;
  }, p(n, _ref103) {
    let [i] = _ref103;
    const s = {};
    i & /*buttons*/
    2 && (s.items = /*buttons*/
    n[1]), e.$set(s);
  }, i(n) {
    t || (k(e.$$.fragment, n), t = true);
  }, o(n) {
    y(e.$$.fragment, n), t = false;
  }, d(n) {
    O(e, n);
  } };
}
__name(R_, "R_");
function O_(l, e, t) {
  let n, i = I, s = /* @__PURE__ */ __name(() => (i(), i = Lt(w, (p) => t(8, n = p)), w), "s"), o, a = I, r = /* @__PURE__ */ __name(() => (a(), a = Lt(m, (p) => t(6, o = p)), m), "r");
  l.$$.on_destroy.push(() => i()), l.$$.on_destroy.push(() => a());
  let { api: c = null } = e, { items: u = [...sd] } = e, f = ze("wx-i18n");
  f || (f = On(dl), It("wx-i18n", f));
  const d = ze("wx-i18n").getGroup("gantt");
  u = u.map((p) => (p = { ...p }, p.handler = (z) => {
    xo(c, z.id, null, d), b();
  }, p.text && (p.text = d(p.text)), p.menuText && (p.menuText = d(p.menuText)), p));
  let h, m, _, w;
  function b() {
    t(3, u = u.map((p) => ({ ...p, disabled: false }))), o?.length ? t(1, _ = u.map((p) => {
      if (!p.check) return p;
      const z = o.some((T) => !p.check(T, n));
      return { ...p, disabled: z };
    })) : t(1, _ = [u[0]]);
  }
  __name(b, "b");
  return l.$$set = (p) => {
    "api" in p && t(4, c = p.api), "items" in p && t(3, u = p.items);
  }, l.$$.update = () => {
    l.$$.dirty & /*api, rState, items*/
    56 && (c ? (t(5, h = c.getReactiveState()), r(t(0, m = h._selected)), s(t(2, w = h._tasks)), b()) : t(1, _ = [u[0]])), l.$$.dirty & /*$rSelected*/
    64 && b();
  }, [m, _, w, u, c, h, o];
}
__name(O_, "O_");
var _gg = class _gg extends ee {
  constructor(e) {
    super(), $(this, e, O_, R_, x, { api: 4, items: 3 });
  }
};
__name(_gg, "gg");
var gg = _gg;
function A_(l) {
  let e, t, n, i, s, o, a;
  function r(d) {
    l[18](d);
  }
  __name(r, "r");
  let c = { filter: (
    /*filterMenu*/
    l[9]
  ), options: (
    /*cOptions*/
    l[6]
  ), dataKey: "id", resolver: (
    /*itemResolver*/
    l[7]
  ), at: (
    /*at*/
    l[1]
  ) };
  l[0] !== void 0 && (c.handler = /*handler*/
  l[0]), e = new _m({ props: c }), be.push(() => rt(e, "handler", r)), e.$on(
    "click",
    /*menuAction*/
    l[8]
  );
  const u = (
    /*#slots*/
    l[17].default
  ), f = Ie(
    u,
    l,
    /*$$scope*/
    l[16],
    null
  );
  return { c() {
    F(e.$$.fragment), n = Y(), i = D("span"), f && f.c(), g(i, "data-menu-ignore", "true");
  }, m(d, h) {
    R(e, d, h), S(d, n, h), S(d, i, h), f && f.m(i, null), s = true, o || (a = q(i, "contextmenu", function() {
      ot(
        /*handler*/
        l[0]
      ) && l[0].apply(this, arguments);
    }), o = true);
  }, p(d, _ref104) {
    let [h] = _ref104;
    l = d;
    const m = {};
    h & /*cOptions*/
    64 && (m.options = /*cOptions*/
    l[6]), h & /*at*/
    2 && (m.at = /*at*/
    l[1]), !t && h & /*handler*/
    1 && (t = true, m.handler = /*handler*/
    l[0], dt(() => t = false)), e.$set(m), f && f.p && (!s || h & /*$$scope*/
    65536) && Oe(
      f,
      u,
      l,
      /*$$scope*/
      l[16],
      s ? Re(
        u,
        /*$$scope*/
        l[16],
        h,
        null
      ) : Ae(
        /*$$scope*/
        l[16]
      ),
      null
    );
  }, i(d) {
    s || (k(e.$$.fragment, d), k(f, d), s = true);
  }, o(d) {
    y(e.$$.fragment, d), y(f, d), s = false;
  }, d(d) {
    d && (v(n), v(i)), O(e, d), f && f.d(d), o = false, a();
  } };
}
__name(A_, "A_");
function F_(l, e, t) {
  let n, i, s = I, o = /* @__PURE__ */ __name(() => (s(), s = Lt(fe, (ie) => t(22, i = ie)), fe), "o"), a, r = I, c = /* @__PURE__ */ __name(() => (r(), r = Lt(V, (ie) => t(23, a = ie)), V), "c"), u, f = I, d = /* @__PURE__ */ __name(() => (f(), f = Lt(B, (ie) => t(24, u = ie)), B), "d"), h, m = I, _ = /* @__PURE__ */ __name(() => (m(), m = Lt(L, (ie) => t(15, h = ie)), L), "_");
  l.$$.on_destroy.push(() => s()), l.$$.on_destroy.push(() => r()), l.$$.on_destroy.push(() => f()), l.$$.on_destroy.push(() => m());
  let { $$slots: w = {}, $$scope: b } = e, { options: p = [...id] } = e, { api: z = null } = e, { resolver: T = null } = e, { filter: W = null } = e, { handler: M = /* @__PURE__ */ __name(() => {
  }, "M") } = e, { at: C = "point" } = e;
  const P = He();
  let X = null, A, B, V, fe, L, Ye, G = ze("wx-i18n");
  G || (G = On({ ...dl, ...So }), It("wx-i18n", G));
  const pe = ze("wx-i18n").getGroup("gantt");
  function Se() {
    const ie = p.find((U) => U.id === "convert-task");
    ie && (ie.data = [], u.forEach((U) => {
      ie.data.push(ie.dataFactory(U));
    })), t(6, Ye = K(p));
  }
  __name(Se, "Se");
  function K(ie) {
    return ie.map((U) => (U = { ...U }, U.text && (U.text = pe(U.text)), U.data && (U.data = K(U.data)), U));
  }
  __name(K, "K");
  function ue(ie, U) {
    let ge = ie ? z.getTask(ie) : null;
    if (T) {
      const Me = T(ie, U);
      ge = Me === true ? ge : Me;
    }
    return ge && (a.includes(ge.id) || (n = [ge], z.exec("select-task", { id: ge.id })), X = ge.id), ge;
  }
  __name(ue, "ue");
  function Ne() {
    M();
  }
  __name(Ne, "Ne");
  function ye(ie) {
    const U = ie.detail.action;
    U && (xo(z, U.id, X, pe), P("click", ie.detail));
  }
  __name(ye, "ye");
  function ve(ie, U) {
    let ge = W ? W(ie, U) : true;
    if (ie.check && ge) {
      const Me = n.some((Fe) => !ie.check(Fe, i));
      ie.css = Me ? "disabled" : "";
    }
    return ge;
  }
  __name(ve, "ve");
  function Ze(ie) {
    M = ie, t(0, M);
  }
  __name(Ze, "Ze");
  return l.$$set = (ie) => {
    "options" in ie && t(10, p = ie.options), "api" in ie && t(11, z = ie.api), "resolver" in ie && t(12, T = ie.resolver), "filter" in ie && t(13, W = ie.filter), "handler" in ie && t(0, M = ie.handler), "at" in ie && t(1, C = ie.at), "$$scope" in ie && t(16, b = ie.$$scope);
  }, l.$$.update = () => {
    l.$$.dirty & /*api, rState, handler*/
    18433 && z && (t(14, A = z.getReactiveState()), d(t(2, B = A.taskTypes)), o(t(4, fe = A._tasks)), c(t(3, V = A.selected)), _(t(5, L = A._selected)), Se(), z.on("scroll-chart", () => Ne()), z.on("drag-task", () => {
      M();
    })), l.$$.dirty & /*$rSelectedTasks*/
    32768 && (n = h || []);
  }, [M, C, B, V, fe, L, Ye, ue, ye, ve, p, z, T, W, A, h, b, w, Ze];
}
__name(F_, "F_");
var _wg = class _wg extends ee {
  constructor(e) {
    super(), $(this, e, F_, A_, x, { options: 10, api: 11, resolver: 12, filter: 13, handler: 0, at: 1 });
  }
};
__name(_wg, "wg");
var wg = _wg;
function og(l) {
  let e, t;
  return { c() {
    e = new ol(false), t = se(), e.a = t;
  }, m(n, i) {
    e.m(
      /*html*/
      l[0],
      n,
      i
    ), S(n, t, i);
  }, p(n, _ref109) {
    let [i] = _ref109;
    i & /*html*/
    1 && e.p(
      /*html*/
      n[0]
    );
  }, i: I, o: I, d(n) {
    n && (v(t), e.d());
  } };
}
__name(og, "og");
function rg(l, e, t) {
  let { html: n = "" } = e;
  return l.$$set = (i) => {
    "html" in i && t(0, n = i.html);
  }, [n];
}
__name(rg, "rg");
var _vg = class _vg extends ee {
  constructor(e) {
    super(), $(this, e, rg, og, x, { html: 0 });
  }
};
__name(_vg, "vg");
var vg = _vg;
var _EventBusRouter = class _EventBusRouter {
  constructor(dispatch) {
    this._nextHandler = null;
    this._dispatch = dispatch;
    this.exec = this.exec.bind(this);
  }
  async exec(name, ev) {
    const res = await this._dispatch(name, ev);
    if (res && this._nextHandler) await this._nextHandler.exec(name, ev);
    return ev;
  }
  setNext(next) {
    return this._nextHandler = next;
  }
};
__name(_EventBusRouter, "EventBusRouter");
var EventBusRouter = _EventBusRouter;
function toStringExpensive(r) {
  let content = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  if (typeof r === "string") return r;
  else if (typeof r.type === "function") r = r.type(r.props);
  else if (typeof r.type === "string") {
    content += buildTag(r);
    if (r.props.children) {
      if (Array.isArray(r.props.children)) {
        r.props.children.forEach((child) => {
          content += toStringExpensive(child);
        });
      } else {
        content += toStringExpensive(r.props.children);
      }
    }
    content += `</${r.type}>`;
  } else if (r.props.children) {
    if (Array.isArray(r.props.children)) {
      r.props.children.forEach((child) => {
        content += toStringExpensive(child);
      });
    } else {
      content += toStringExpensive(r.props.children);
    }
  }
  return content;
}
__name(toStringExpensive, "toStringExpensive");
function buildTag(r) {
  let tag = `<${r.type}`;
  for (const key in r.props) {
    if (key === "children") continue;
    if (key === "style") {
      tag += ` style="`;
      for (const style in r.props.style) {
        tag += `${style}:${r.props.style[style]};`;
      }
      tag += `"`;
    }
    if (key === "className") tag += ` class="${r.props[key]}"`;
    else tag += ` ${key}="${r.props[key]}"`;
  }
  tag += ">";
  return tag;
}
__name(buildTag, "buildTag");
function template(template2, host) {
  return new Proxy(host, {
    construct(target, _ref) {
      let [config] = _ref;
      const props = config.props || {};
      props.html = toStringExpensive(template2(config.props));
      config.props = props;
      return new target(config);
    }
  });
}
__name(template, "template");
var jsxRuntime = { exports: {} };
var reactJsxRuntime_development = {};
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (true) {
    (function() {
      var React = import_react.default;
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      __name(getIteratorFn, "getIteratorFn");
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      __name(error, "error");
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      __name(printWarning, "printWarning");
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      __name(isValidElementType, "isValidElementType");
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      __name(getWrappedName, "getWrappedName");
      function getContextName(type) {
        return type.displayName || "Context";
      }
      __name(getContextName, "getContextName");
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x2) {
                return null;
              }
            }
          }
        }
        return null;
      }
      __name(getComponentNameFromType, "getComponentNameFromType");
      var assign = Object.assign;
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      __name(disabledLog, "disabledLog");
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      __name(disableLogs, "disableLogs");
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      __name(reenableLogs, "reenableLogs");
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0) {
            try {
              throw Error();
            } catch (x2) {
              var match = x2.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          }
          return "\n" + prefix + name;
        }
      }
      __name(describeBuiltInComponentFrame, "describeBuiltInComponentFrame");
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn2, construct) {
        if (!fn2 || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn2);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = /* @__PURE__ */ __name(function() {
              throw Error();
            }, "Fake");
            Object.defineProperty(Fake.prototype, "props", {
              set: /* @__PURE__ */ __name(function() {
                throw Error();
              }, "set")
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x2) {
                control = x2;
              }
              Reflect.construct(fn2, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x2) {
                control = x2;
              }
              fn2.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x2) {
              control = x2;
            }
            fn2();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              if (sampleLines[s] !== controlLines[c]) {
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--;
                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn2.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn2.displayName);
                      }
                      {
                        if (typeof fn2 === "function") {
                          componentFrameCache.set(fn2, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn2 ? fn2.displayName || fn2.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn2 === "function") {
            componentFrameCache.set(fn2, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      __name(describeNativeComponentFrame, "describeNativeComponentFrame");
      function describeFunctionComponentFrame(fn2, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn2, false);
        }
      }
      __name(describeFunctionComponentFrame, "describeFunctionComponentFrame");
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      __name(shouldConstruct, "shouldConstruct");
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x2) {
              }
            }
          }
        }
        return "";
      }
      __name(describeUnknownElementTypeFrameInDEV, "describeUnknownElementTypeFrameInDEV");
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      __name(setCurrentlyValidatingElement, "setCurrentlyValidatingElement");
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      __name(checkPropTypes, "checkPropTypes");
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      __name(isArray, "isArray");
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      __name(typeName, "typeName");
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      __name(willCoercionThrow, "willCoercionThrow");
      function testStringCoercion(value) {
        return "" + value;
      }
      __name(testStringCoercion, "testStringCoercion");
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      __name(checkKeyStringCoercion, "checkKeyStringCoercion");
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      var didWarnAboutStringRefs;
      {
        didWarnAboutStringRefs = {};
      }
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== void 0;
      }
      __name(hasValidRef, "hasValidRef");
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== void 0;
      }
      __name(hasValidKey, "hasValidKey");
      function warnIfStringRefCannotBeAutoConverted(config, self) {
        {
          if (typeof config.ref === "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
            var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (!didWarnAboutStringRefs[componentName]) {
              error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
              didWarnAboutStringRefs[componentName] = true;
            }
          }
        }
      }
      __name(warnIfStringRefCannotBeAutoConverted, "warnIfStringRefCannotBeAutoConverted");
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = /* @__PURE__ */ __name(function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          }, "warnAboutAccessingKey");
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      __name(defineKeyPropWarningGetter, "defineKeyPropWarningGetter");
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = /* @__PURE__ */ __name(function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          }, "warnAboutAccessingRef");
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      __name(defineRefPropWarningGetter, "defineRefPropWarningGetter");
      var ReactElement = /* @__PURE__ */ __name(function(type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type,
          key,
          ref,
          props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      }, "ReactElement");
      function jsxDEV(type, config, maybeKey, source, self) {
        {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          if (maybeKey !== void 0) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = "" + maybeKey;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          if (hasValidRef(config)) {
            ref = config.ref;
            warnIfStringRefCannotBeAutoConverted(config, self);
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      __name(jsxDEV, "jsxDEV");
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      __name(setCurrentlyValidatingElement$1, "setCurrentlyValidatingElement$1");
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function isValidElement(object) {
        {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      __name(isValidElement, "isValidElement");
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
      }
      __name(getDeclarationErrorAddendum, "getDeclarationErrorAddendum");
      function getSourceInfoErrorAddendum(source) {
        {
          return "";
        }
      }
      __name(getSourceInfoErrorAddendum, "getSourceInfoErrorAddendum");
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      __name(getCurrentComponentErrorInfo, "getCurrentComponentErrorInfo");
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      __name(validateExplicitKey, "validateExplicitKey");
      function validateChildKeys(node, parentType) {
        {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      __name(validateChildKeys, "validateChildKeys");
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === void 0 || typeof type === "string") {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      __name(validatePropTypes, "validatePropTypes");
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      __name(validateFragmentProps, "validateFragmentProps");
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum();
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self);
          if (element == null) {
            return element;
          }
          if (validType) {
            var children = props.children;
            if (children !== void 0) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k2) {
                return k2 !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      }
      __name(jsxWithValidation, "jsxWithValidation");
      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      __name(jsxWithValidationStatic, "jsxWithValidationStatic");
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      __name(jsxWithValidationDynamic, "jsxWithValidationDynamic");
      var jsx = jsxWithValidationDynamic;
      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
__name(requireReactJsxRuntime_development, "requireReactJsxRuntime_development");
if (false) {
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;
function GanttComponent(props) {
  let gantt_container = (0, import_react.useRef)();
  const ws2 = (0, import_react.useState)(() => ({}))[0];
  const [widget, setWidget] = (0, import_react.useState)(null);
  const once = (0, import_react.useRef)(false);
  (0, import_react.useImperativeHandle)(props.api, () => ({
    getState: /* @__PURE__ */ __name(() => ws2.api.getState(), "getState"),
    getReactiveState: /* @__PURE__ */ __name(() => ws2.api.getReactiveState(), "getReactiveState"),
    getStores: /* @__PURE__ */ __name(() => ws2.api.getStores(), "getStores"),
    exec: /* @__PURE__ */ __name((name, data) => ws2.api.exec(name, data), "exec"),
    setNext: /* @__PURE__ */ __name((ev) => ws2.api.setNext(ev), "setNext"),
    intercept: /* @__PURE__ */ __name((name, data) => ws2.api.intercept(name, data), "intercept"),
    on: /* @__PURE__ */ __name((name, handler) => ws2.api.on(name, handler), "on"),
    detach: /* @__PURE__ */ __name((name, handler) => ws2.api.detach(name, handler), "detach"),
    getTask: /* @__PURE__ */ __name((id2) => ws2.api.getTask(id2), "getTask")
  }));
  (0, import_react.useEffect)(() => {
    const evs = new EventBusRouter((name, ev) => {
      const camelCase = name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      const eventName = "on" + camelCase[0].toUpperCase() + camelCase.slice(1);
      if (props[eventName]) return props[eventName](ev);
      return true;
    });
    let obj;
    const initProps = {
      ...props
    };
    if (initProps.taskTemplate && typeof initProps.taskTemplate === "function") {
      initProps.taskTemplate = template(initProps.taskTemplate, vg);
    }
    const externalContext = /* @__PURE__ */ new Map([["wx-theme", "willow"]]);
    obj = new mg({
      target: gantt_container.current,
      context: externalContext,
      props: {
        ...initProps,
        init: /* @__PURE__ */ __name((a) => {
          ws2.api = a;
          a.setNext(evs);
          if (props.init) props.init(a);
        }, "init")
      }
    });
    setWidget(obj);
    return () => {
      if (obj) try {
        obj.$destroy();
      } catch (e) {
      }
      if (gantt_container.current) gantt_container.current.innerHTML = "";
    };
  }, []);
  const {
    taskTemplate,
    markers,
    taskTypes,
    tasks,
    selected,
    activeTask,
    links,
    scales,
    columns,
    start,
    end,
    lengthUnit,
    cellWidth,
    cellHeight,
    scaleHeight,
    readonly,
    cellBorders,
    editorShape,
    zoom,
    baselines,
    highlightTime
  } = props;
  (0, import_react.useEffect)(() => {
    if (!once.current) {
      once.current = true;
      return;
    }
    if (ws2.api && widget) {
      const {
        init,
        ...updateProps
      } = props;
      if (updateProps.taskTemplate && typeof updateProps.taskTemplate !== "string") updateProps.taskTemplate = template(updateProps.taskTemplate, vg);
      widget.$$set(updateProps);
    }
  }, [taskTemplate, markers, taskTypes, tasks, selected, activeTask, links, scales, columns, start, end, lengthUnit, cellWidth, cellHeight, scaleHeight, readonly, cellBorders, editorShape, zoom, baselines, highlightTime]);
  return jsxRuntimeExports.jsx("div", {
    className: props.containerClassName ? " " + props.containerClassName : "",
    ref: gantt_container,
    style: {
      height: "100%",
      width: "100%"
    }
  });
}
__name(GanttComponent, "GanttComponent");
function ContextMenuComponent(props) {
  let table_container = (0, import_react.useRef)();
  const [state] = (0, import_react.useState)({});
  const [widget, setWidget] = (0, import_react.useState)(null);
  const once = (0, import_react.useRef)(false);
  (0, import_react.useImperativeHandle)(props.handler, () => function(ev) {
    return widget.$$.ctx[widget.$$.props.handler](ev);
  });
  const {
    api
  } = props;
  (0, import_react.useEffect)(() => {
    const obj = new wg({
      target: table_container.current,
      props: {
        ...props
      }
    });
    state.handler = obj.$$.ctx[obj.$$.props.handler];
    if (props.init) props.init(state.handler);
    setWidget(() => obj);
    return () => {
      if (obj) try {
        obj.$destroy();
      } catch (e) {
      }
      if (table_container.current) table_container.current.innerHTML = "";
    };
  }, [api]);
  (0, import_react.useEffect)(() => {
    if (!once.current) {
      once.current = true;
      return;
    }
    if (api && widget) {
      const {
        init,
        ...updateProps
      } = props;
      widget.$$set(updateProps);
    }
  }, [api]);
  return jsxRuntimeExports.jsx("div", {
    className: "wx-willow-theme",
    ref: table_container
  });
}
__name(ContextMenuComponent, "ContextMenuComponent");
function ToolbarComponent(props) {
  let table_container = (0, import_react.useRef)();
  const [state] = (0, import_react.useState)({});
  const [widget, setWidget] = (0, import_react.useState)(null);
  const once = (0, import_react.useRef)(false);
  (0, import_react.useImperativeHandle)(props.open, () => function(ev) {
    return widget.$$.ctx[widget.$$.props.open](ev);
  });
  (0, import_react.useEffect)(() => {
    const obj = new gg({
      target: table_container.current,
      props: {
        ...props
      }
    });
    state.open = obj.$$.ctx[obj.$$.props.open];
    if (props.init) props.init(state.open);
    setWidget(() => obj);
    return () => {
      if (obj) try {
        obj.$destroy();
      } catch (e) {
      }
      if (table_container.current) table_container.current.innerHTML = "";
    };
  }, []);
  const {
    api
  } = props;
  (0, import_react.useEffect)(() => {
    if (!once.current) {
      once.current = true;
      return;
    }
    if (api && widget) {
      const {
        init,
        ...updateProps
      } = props;
      widget.$$set(updateProps);
    }
  }, [api]);
  return jsxRuntimeExports.jsx("div", {
    ref: table_container
  });
}
__name(ToolbarComponent, "ToolbarComponent");
function Willow(props) {
  if (!props.children) return;
  return jsxRuntimeExports.jsx("div", {
    className: "wx-willow-theme",
    style: {
      height: "100%"
    },
    children: props.children
  });
}
__name(Willow, "Willow");
export {
  ContextMenuComponent as ContextMenu,
  GanttComponent as Gantt,
  ToolbarComponent as Toolbar,
  Willow,
  Willow as WillowDark,
  Gf as defaultColumns,
  Qo as defaultEditorShape,
  id as defaultMenuOptions,
  sd as defaultToolbarButtons
};
/*! Bundled license information:

wx-react-gantt/dist/gantt.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

wx-react-gantt/dist/gantt.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=wx-react-gantt.js.map
