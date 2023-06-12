(function () {
  /*

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  var ba = "' of type ",
      ca = "Edge",
      da = "Failed due to circular reference.",
      ea = "Failed due to illegal value in property: ",
      fa = "Not available",
      ja = "Symbol.iterator",
      ka = "about:invalid#zClosurez",
      p = "function",
      la = "must provide justification",
      ma = "must provide non-empty justification",
      na = "null",
      q = "number",
      u = "object",
      oa = "select-multiple",
      ra = "state is only maintained on arrays.",
      v = "string",
      sa = "zClosurez";

  function ta() {
      return function (a) {
          return a
      }
  }

  function ua(a) {
      return function () {
          return this[a]
      }
  }
  var w;

  function va(a) {
      var b = 0;
      return function () {
          return b < a.length ? {
              done: !1,
              value: a[b++]
          } : {
              done: !0
          }
      }
  }
  var wa = typeof Object.defineProperties == p ? Object.defineProperty : function (a, b, c) {
      if (a == Array.prototype || a == Object.prototype) return a;
      a[b] = c.value;
      return a
  };

  function xa(a) {
      a = [u == typeof globalThis && globalThis, a, u == typeof window && window, u == typeof self && self, u == typeof global && global];
      for (var b = 0; b < a.length; ++b) {
          var c = a[b];
          if (c && c.Math == Math) return c
      }
      throw Error("Cannot find global object");
  }
  var ya = xa(this);

  function x(a, b) {
      if (b) a: {
          var c = ya;a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
              var e = a[d];
              if (!(e in c)) break a;
              c = c[e]
          }
          a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && wa(c, a, {
              configurable: !0,
              writable: !0,
              value: b
          })
      }
  }
  x("Symbol", function (a) {
      function b(f) {
          if (this instanceof b) throw new TypeError("Symbol is not a constructor");
          return new c(d + (f || "") + "_" + e++, f)
      }

      function c(f, g) {
          this.g = f;
          wa(this, "description", {
              configurable: !0,
              writable: !0,
              value: g
          })
      }
      if (a) return a;
      c.prototype.toString = ua("g");
      var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_",
          e = 0;
      return b
  });
  x(ja, function (a) {
      if (a) return a;
      a = Symbol(ja);
      for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
          var d = ya[b[c]];
          typeof d === p && typeof d.prototype[a] != p && wa(d.prototype, a, {
              configurable: !0,
              writable: !0,
              value: function () {
                  return za(va(this))
              }
          })
      }
      return a
  });

  function za(a) {
      a = {
          next: a
      };
      a[Symbol.iterator] = function () {
          return this
      };
      return a
  }

  function Aa(a) {
      var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      if (b) return b.call(a);
      if (typeof a.length == q) return {
          next: va(a)
      };
      throw Error(String(a) + " is not an iterable or ArrayLike");
  }
  var Ea = typeof Object.create == p ? Object.create : function (a) {
          function b() {}
          b.prototype = a;
          return new b
      },
      Fa;
  if (typeof Object.setPrototypeOf == p) Fa = Object.setPrototypeOf;
  else {
      var Ga;
      a: {
          var Ha = {
                  a: !0
              },
              Ia = {};
          try {
              Ia.__proto__ = Ha;
              Ga = Ia.a;
              break a
          } catch (a) {}
          Ga = !1
      }
      Fa = Ga ? function (a, b) {
          a.__proto__ = b;
          if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
          return a
      } : null
  }
  var Ja = Fa;

  function y(a, b) {
      a.prototype = Ea(b.prototype);
      a.prototype.constructor = a;
      if (Ja) Ja(a, b);
      else
          for (var c in b)
              if ("prototype" != c)
                  if (Object.defineProperties) {
                      var d = Object.getOwnPropertyDescriptor(b, c);
                      d && Object.defineProperty(a, c, d)
                  } else a[c] = b[c];
      a.M = b.prototype
  }

  function z(a, b) {
      return Object.prototype.hasOwnProperty.call(a, b)
  }
  x("WeakMap", function (a) {
      function b(k) {
          this.g = (h += Math.random() + 1).toString();
          if (k) {
              k = Aa(k);
              for (var l; !(l = k.next()).done;) l = l.value, this.set(l[0], l[1])
          }
      }

      function c() {}

      function d(k) {
          var l = typeof k;
          return l === u && null !== k || l === p
      }

      function e(k) {
          if (!z(k, g)) {
              var l = new c;
              wa(k, g, {
                  value: l
              })
          }
      }

      function f(k) {
          var l = Object[k];
          l && (Object[k] = function (n) {
              if (n instanceof c) return n;
              Object.isExtensible(n) && e(n);
              return l(n)
          })
      }
      if (function () {
              if (!a || !Object.seal) return !1;
              try {
                  var k = Object.seal({}),
                      l = Object.seal({}),
                      n = new a([
                          [k,
                              2
                          ],
                          [l, 3]
                      ]);
                  if (2 != n.get(k) || 3 != n.get(l)) return !1;
                  n.delete(k);
                  n.set(l, 4);
                  return !n.has(k) && 4 == n.get(l)
              } catch (m) {
                  return !1
              }
          }()) return a;
      var g = "$jscomp_hidden_" + Math.random();
      f("freeze");
      f("preventExtensions");
      f("seal");
      var h = 0;
      b.prototype.set = function (k, l) {
          if (!d(k)) throw Error("Invalid WeakMap key");
          e(k);
          if (!z(k, g)) throw Error("WeakMap key fail: " + k);
          k[g][this.g] = l;
          return this
      };
      b.prototype.get = function (k) {
          return d(k) && z(k, g) ? k[g][this.g] : void 0
      };
      b.prototype.has = function (k) {
          return d(k) && z(k, g) && z(k[g],
              this.g)
      };
      b.prototype.delete = function (k) {
          return d(k) && z(k, g) && z(k[g], this.g) ? delete k[g][this.g] : !1
      };
      return b
  });
  x("Map", function (a) {
      function b() {
          var h = {};
          return h.I = h.next = h.head = h
      }

      function c(h, k) {
          var l = h.g;
          return za(function () {
              if (l) {
                  for (; l.head != h.g;) l = l.I;
                  for (; l.next != l.head;) return l = l.next, {
                      done: !1,
                      value: k(l)
                  };
                  l = null
              }
              return {
                  done: !0,
                  value: void 0
              }
          })
      }

      function d(h, k) {
          var l = k && typeof k;
          l == u || l == p ? f.has(k) ? l = f.get(k) : (l = "" + ++g, f.set(k, l)) : l = "p_" + k;
          var n = h.h[l];
          if (n && z(h.h, l))
              for (h = 0; h < n.length; h++) {
                  var m = n[h];
                  if (k !== k && m.key !== m.key || k === m.key) return {
                      id: l,
                      list: n,
                      index: h,
                      A: m
                  }
              }
          return {
              id: l,
              list: n,
              index: -1,
              A: void 0
          }
      }

      function e(h) {
          this.h = {};
          this.g = b();
          this.size = 0;
          if (h) {
              h = Aa(h);
              for (var k; !(k = h.next()).done;) k = k.value, this.set(k[0], k[1])
          }
      }
      if (function () {
              if (!a || typeof a != p || !a.prototype.entries || typeof Object.seal != p) return !1;
              try {
                  var h = Object.seal({
                          x: 4
                      }),
                      k = new a(Aa([
                          [h, "s"]
                      ]));
                  if ("s" != k.get(h) || 1 != k.size || k.get({
                          x: 4
                      }) || k.set({
                          x: 4
                      }, "t") != k || 2 != k.size) return !1;
                  var l = k.entries(),
                      n = l.next();
                  if (n.done || n.value[0] != h || "s" != n.value[1]) return !1;
                  n = l.next();
                  return n.done || 4 != n.value[0].x || "t" != n.value[1] || !l.next().done ? !1 :
                      !0
              } catch (m) {
                  return !1
              }
          }()) return a;
      var f = new WeakMap;
      e.prototype.set = function (h, k) {
          h = 0 === h ? 0 : h;
          var l = d(this, h);
          l.list || (l.list = this.h[l.id] = []);
          l.A ? l.A.value = k : (l.A = {
              next: this.g,
              I: this.g.I,
              head: this.g,
              key: h,
              value: k
          }, l.list.push(l.A), this.g.I.next = l.A, this.g.I = l.A, this.size++);
          return this
      };
      e.prototype.delete = function (h) {
          h = d(this, h);
          return h.A && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this.h[h.id], h.A.I.next = h.A.next, h.A.next.I = h.A.I, h.A.head = null, this.size--, !0) : !1
      };
      e.prototype.clear =
          function () {
              this.h = {};
              this.g = this.g.I = b();
              this.size = 0
          };
      e.prototype.has = function (h) {
          return !!d(this, h).A
      };
      e.prototype.get = function (h) {
          return (h = d(this, h).A) && h.value
      };
      e.prototype.entries = function () {
          return c(this, function (h) {
              return [h.key, h.value]
          })
      };
      e.prototype.keys = function () {
          return c(this, function (h) {
              return h.key
          })
      };
      e.prototype.values = function () {
          return c(this, function (h) {
              return h.value
          })
      };
      e.prototype.forEach = function (h, k) {
          for (var l = this.entries(), n; !(n = l.next()).done;) n = n.value, h.call(k, n[1], n[0], this)
      };
      e.prototype[Symbol.iterator] = e.prototype.entries;
      var g = 0;
      return e
  });
  x("Number.isFinite", function (a) {
      return a ? a : function (b) {
          return typeof b !== q ? !1 : !isNaN(b) && Infinity !== b && -Infinity !== b
      }
  });

  function Ka(a, b) {
      a instanceof String && (a += "");
      var c = 0,
          d = !1,
          e = {
              next: function () {
                  if (!d && c < a.length) {
                      var f = c++;
                      return {
                          value: b(f, a[f]),
                          done: !1
                      }
                  }
                  d = !0;
                  return {
                      done: !0,
                      value: void 0
                  }
              }
          };
      e[Symbol.iterator] = function () {
          return e
      };
      return e
  }
  x("Array.prototype.values", function (a) {
      return a ? a : function () {
          return Ka(this, function (b, c) {
              return c
          })
      }
  });
  x("Array.prototype.keys", function (a) {
      return a ? a : function () {
          return Ka(this, ta())
      }
  });
  x("Array.from", function (a) {
      return a ? a : function (b, c, d) {
          c = null != c ? c : ta();
          var e = [],
              f = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
          if (typeof f == p) {
              b = f.call(b);
              for (var g = 0; !(f = b.next()).done;) e.push(c.call(d, f.value, g++))
          } else
              for (f = b.length, g = 0; g < f; g++) e.push(c.call(d, b[g], g));
          return e
      }
  });
  x("Array.prototype.entries", function (a) {
      return a ? a : function () {
          return Ka(this, function (b, c) {
              return [b, c]
          })
      }
  });
  x("Number.isInteger", function (a) {
      return a ? a : function (b) {
          return Number.isFinite(b) ? b === Math.floor(b) : !1
      }
  });
  var La = typeof Object.assign == p ? Object.assign : function (a, b) {
      for (var c = 1; c < arguments.length; c++) {
          var d = arguments[c];
          if (d)
              for (var e in d) z(d, e) && (a[e] = d[e])
      }
      return a
  };
  x("Object.assign", function (a) {
      return a || La
  });
  x("Object.entries", function (a) {
      return a ? a : function (b) {
          var c = [],
              d;
          for (d in b) z(b, d) && c.push([d, b[d]]);
          return c
      }
  });
  var A = this || self;

  function Ma(a, b, c) {
      a = a.split(".");
      c = c || A;
      a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
      for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
  }

  function Na(a) {
      a = a.split(".");
      for (var b = A, c = 0; c < a.length; c++)
          if (b = b[a[c]], null == b) return null;
      return b
  }

  function C(a) {
      var b = typeof a;
      return b != u ? b : a ? Array.isArray(a) ? "array" : b : na
  }

  function Oa(a) {
      var b = C(a);
      return "array" == b || b == u && typeof a.length == q
  }

  function D(a) {
      var b = typeof a;
      return b == u && null != a || b == p
  }

  function Pa(a, b, c) {
      return a.call.apply(a.bind, arguments)
  }

  function Qa(a, b, c) {
      if (!a) throw Error();
      if (2 < arguments.length) {
          var d = Array.prototype.slice.call(arguments, 2);
          return function () {
              var e = Array.prototype.slice.call(arguments);
              Array.prototype.unshift.apply(e, d);
              return a.apply(b, e)
          }
      }
      return function () {
          return a.apply(b, arguments)
      }
  }

  function E(a, b, c) {
      E = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? Pa : Qa;
      return E.apply(null, arguments)
  }

  function F(a, b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return function () {
          var d = c.slice();
          d.push.apply(d, arguments);
          return a.apply(this, d)
      }
  }

  function Ra(a, b) {
      function c() {}
      c.prototype = b.prototype;
      a.M = b.prototype;
      a.prototype = new c;
      a.prototype.constructor = a;
      a.pa = function (d, e, f) {
          for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
          return b.prototype[e].apply(d, g)
      }
  }

  function Xa(a) {
      return a
  };

  function Ya(a, b) {
      if (Error.captureStackTrace) Error.captureStackTrace(this, Ya);
      else {
          var c = Error().stack;
          c && (this.stack = c)
      }
      a && (this.message = String(a));
      void 0 !== b && (this.cause = b)
  }
  Ra(Ya, Error);
  Ya.prototype.name = "CustomError";
  var Za;

  function $a(a, b) {
      a = a.split("%s");
      for (var c = "", d = a.length - 1, e = 0; e < d; e++) c += a[e] + (e < b.length ? b[e] : "%s");
      Ya.call(this, c + a[d])
  }
  Ra($a, Ya);
  $a.prototype.name = "AssertionError";

  function ab(a, b, c, d) {
      var e = "Assertion failed";
      if (c) {
          e += ": " + c;
          var f = d
      } else a && (e += ": " + a, f = b);
      throw new $a("" + e, f || []);
  }

  function I(a, b, c) {
      a || ab("", null, b, Array.prototype.slice.call(arguments, 2));
      return a
  }

  function J(a, b) {
      throw new $a("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }

  function bb(a, b, c) {
      typeof a !== q && ab("Expected number but got %s: %s.", [C(a), a], b, Array.prototype.slice.call(arguments, 2));
      return a
  }

  function cb(a, b, c) {
      typeof a !== v && ab("Expected string but got %s: %s.", [C(a), a], b, Array.prototype.slice.call(arguments, 2))
  }

  function db(a, b, c) {
      Array.isArray(a) || ab("Expected array but got %s: %s.", [C(a), a], b, Array.prototype.slice.call(arguments, 2))
  }

  function eb(a, b, c, d) {
      a instanceof b || ab("Expected instanceof %s but got %s.", [fb(b), fb(a)], c, Array.prototype.slice.call(arguments, 3))
  }

  function fb(a) {
      return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? na : typeof a
  };
  var gb = Array.prototype.indexOf ? function (a, b) {
          I(null != a.length);
          return Array.prototype.indexOf.call(a, b, void 0)
      } : function (a, b) {
          if (typeof a === v) return typeof b !== v || 1 != b.length ? -1 : a.indexOf(b, 0);
          for (var c = 0; c < a.length; c++)
              if (c in a && a[c] === b) return c;
          return -1
      },
      hb = Array.prototype.forEach ? function (a, b) {
          I(null != a.length);
          Array.prototype.forEach.call(a, b, void 0)
      } : function (a, b) {
          for (var c = a.length, d = typeof a === v ? a.split("") : a, e = 0; e < c; e++) e in d && b.call(void 0, d[e], e, a)
      };

  function ib(a) {
      var b = a.length;
      if (0 < b) {
          for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
          return c
      }
      return []
  }

  function jb(a, b) {
      for (var c = 1; c < arguments.length; c++) {
          var d = arguments[c];
          if (Oa(d)) {
              var e = a.length || 0,
                  f = d.length || 0;
              a.length = e + f;
              for (var g = 0; g < f; g++) a[e + g] = d[g]
          } else a.push(d)
      }
  }

  function kb(a, b, c) {
      I(null != a.length);
      return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
  };
  var lb, mb = Na("CLOSURE_FLAGS"),
      nb = mb && mb[610401301];
  lb = null != nb ? nb : !1;

  function ob(a) {
      if (!pb.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(qb, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(rb, "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(sb, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(tb, "&quot;")); - 1 != a.indexOf("'") && (a = a.replace(ub, "&#39;")); - 1 != a.indexOf("\x00") && (a = a.replace(zb, "&#0;"));
      return a
  }
  var qb = /&/g,
      rb = /</g,
      sb = />/g,
      tb = /"/g,
      ub = /'/g,
      zb = /\x00/g,
      pb = /[\x00&<>"']/;

  function Ab() {
      var a = A.navigator;
      return a && (a = a.userAgent) ? a : ""
  }
  var Bb, Cb = A.navigator;
  Bb = Cb ? Cb.userAgentData || null : null;

  function Db(a) {
      return lb ? Bb ? Bb.brands.some(function (b) {
          return (b = b.brand) && -1 != b.indexOf(a)
      }) : !1 : !1
  }

  function K(a) {
      return -1 != Ab().indexOf(a)
  };

  function Eb() {
      return lb ? !!Bb && 0 < Bb.brands.length : !1
  }

  function Fb() {
      return Eb() ? Db("Chromium") : (K("Chrome") || K("CriOS")) && !(Eb() ? 0 : K(ca)) || K("Silk")
  };

  function Gb(a) {
      Gb[" "](a);
      return a
  }
  Gb[" "] = function () {};

  function Hb(a, b) {
      try {
          return Gb(a[b]), !0
      } catch (c) {}
      return !1
  };
  var Ib = Eb() ? !1 : K("Opera"),
      Jb = Eb() ? !1 : K("Trident") || K("MSIE"),
      Kb = K(ca),
      Lb = K("Gecko") && !(-1 != Ab().toLowerCase().indexOf("webkit") && !K(ca)) && !(K("Trident") || K("MSIE")) && !K(ca),
      Mb = -1 != Ab().toLowerCase().indexOf("webkit") && !K(ca),
      Nb;
  a: {
      var Ob = "",
          Pb = function () {
              var a = Ab();
              if (Lb) return /rv:([^\);]+)(\)|;)/.exec(a);
              if (Kb) return /Edge\/([\d\.]+)/.exec(a);
              if (Jb) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
              if (Mb) return /WebKit\/(\S+)/.exec(a);
              if (Ib) return /(?:Version)[ \/]?(\S+)/.exec(a)
          }();Pb && (Ob = Pb ? Pb[1] : "");
      if (Jb) {
          var Qb, Rb = A.document;
          Qb = Rb ? Rb.documentMode : void 0;
          if (null != Qb && Qb > parseFloat(Ob)) {
              Nb = String(Qb);
              break a
          }
      }
      Nb = Ob
  }
  var Sb = Nb;

  function L() {}

  function Tb(a) {
      return a
  }

  function Ub(a, b) {
      var c = arguments,
          d = c.length;
      return function () {
          var e;
          d && (e = c[d - 1].apply(this, arguments));
          for (var f = d - 2; 0 <= f; f--) e = c[f].call(this, e);
          return e
      }
  };

  function Vb(a, b, c) {
      for (var d in a) b.call(c, a[d], d, a)
  }

  function M(a, b) {
      return null !== a && b in a ? a[b] : void 0
  }
  var Wb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

  function Xb(a, b) {
      for (var c, d, e = 1; e < arguments.length; e++) {
          d = arguments[e];
          for (c in d) a[c] = d[c];
          for (var f = 0; f < Wb.length; f++) c = Wb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
      }
  };
  var Yb = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      command: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
  };
  var Zb;

  function N(a, b) {
      this.g = a === $b && b || "";
      this.h = ac
  }
  N.prototype.G = !0;
  N.prototype.C = ua("g");
  N.prototype.toString = function () {
      return "Const{" + this.g + "}"
  };

  function bc(a) {
      if (a instanceof N && a.constructor === N && a.h === ac) return a.g;
      J("expected object of type Const, got '" + a + "'");
      return "type_error:Const"
  }
  var ac = {},
      $b = {};

  function cc(a, b) {
      if (b !== dc) throw Error("TrustedResourceUrl is not meant to be built directly");
      this.g = a
  }
  cc.prototype.toString = function () {
      return this.g + ""
  };
  cc.prototype.G = !0;
  cc.prototype.C = function () {
      return this.g.toString()
  };
  var dc = {};

  function P(a, b) {
      if (b !== ec) throw Error("SafeUrl is not meant to be built directly");
      this.g = a
  }
  P.prototype.toString = function () {
      return this.g.toString()
  };
  P.prototype.G = !0;
  P.prototype.C = function () {
      return this.g.toString()
  };

  function fc(a) {
      if (a instanceof P && a.constructor === P) return a.g;
      J("expected object of type SafeUrl, got '" + a + ba + C(a));
      return "type_error:SafeUrl"
  }
  var gc = /^data:(.*);base64,[a-z0-9+\/]+=*$/i,
      hc = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;

  function ic(a) {
      if (a instanceof P) return a;
      a = typeof a == u && a.G ? a.C() : String(a);
      hc.test(a) ? a = jc(a) : (a = String(a).replace(/(%0A|%0D)/g, ""), a = a.match(gc) ? jc(a) : null);
      return a
  }
  var kc;
  try {
      new URL("s://g"), kc = !0
  } catch (a) {
      kc = !1
  }
  var lc = kc,
      ec = {};

  function jc(a) {
      return new P(a, ec)
  }
  var mc = jc(ka);
  jc("about:blank");
  var nc = {};

  function oc(a, b) {
      if (b !== nc) throw Error("SafeStyle is not meant to be built directly");
      this.g = a;
      this.G = !0
  }
  oc.prototype.C = ua("g");
  oc.prototype.toString = function () {
      return this.g.toString()
  };
  var pc = new oc("", nc);

  function qc(a) {
      if (a instanceof P) return 'url("' + fc(a).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") + '")';
      a = a instanceof N ? bc(a) : rc(String(a));
      if (/[{;}]/.test(a)) throw new $a("Value does not allow [{;}], got: %s.", [a]);
      return a
  }

  function rc(a) {
      var b = a.replace(sc, "$1").replace(sc, "$1").replace(tc, "url");
      if (uc.test(b)) {
          if (vc.test(a)) return J("String value disallows comments, got: " + a), sa;
          for (var c = b = !0, d = 0; d < a.length; d++) {
              var e = a.charAt(d);
              "'" == e && c ? b = !b : '"' == e && b && (c = !c)
          }
          if (!b || !c) return J("String value requires balanced quotes, got: " + a), sa;
          if (!wc(a)) return J("String value requires balanced square brackets and one identifier per pair of brackets, got: " + a), sa
      } else return J("String value allows only [-+,.\"'%_!#/ a-zA-Z0-9\\[\\]] and simple functions, got: " +
          a), sa;
      return xc(a)
  }

  function wc(a) {
      for (var b = !0, c = /^[-_a-zA-Z0-9]$/, d = 0; d < a.length; d++) {
          var e = a.charAt(d);
          if ("]" == e) {
              if (b) return !1;
              b = !0
          } else if ("[" == e) {
              if (!b) return !1;
              b = !1
          } else if (!b && !c.test(e)) return !1
      }
      return b
  }
  var uc = RegExp("^[-+,.\"'%_!#/ a-zA-Z0-9\\[\\]]+$"),
      tc = RegExp("\\b(url\\([ \t\n]*)('[ -&(-\\[\\]-~]*'|\"[ !#-\\[\\]-~]*\"|[!#-&*-\\[\\]-~]*)([ \t\n]*\\))", "g"),
      sc = RegExp("\\b(calc|cubic-bezier|fit-content|hsl|hsla|linear-gradient|matrix|minmax|radial-gradient|repeat|rgb|rgba|(rotate|scale|translate)(X|Y|Z|3d)?|steps|var)\\([-+*/0-9a-zA-Z.%#\\[\\], ]+\\)", "g"),
      vc = /\/\*/;

  function xc(a) {
      return a.replace(tc, function (b, c, d, e) {
          var f = "";
          d = d.replace(/^(['"])(.*)\1$/, function (g, h, k) {
              f = h;
              return k
          });
          b = (ic(d) || mc).C();
          return c + f + b + f + e
      })
  };
  var yc = {};

  function zc() {
      if (yc !== yc) throw Error("SafeStyleSheet is not meant to be built directly");
      this.G = !0
  }
  zc.prototype.toString = function () {
      return "".toString()
  };
  zc.prototype.C = function () {
      return ""
  };
  new zc;
  var Ac = {};

  function Bc(a, b) {
      if (b !== Ac) throw Error("SafeHtml is not meant to be built directly");
      this.g = a;
      this.G = !0
  }
  Bc.prototype.C = function () {
      return this.g.toString()
  };
  Bc.prototype.toString = function () {
      return this.g.toString()
  };

  function Cc(a) {
      if (a instanceof Bc && a.constructor === Bc) return a.g;
      J("expected object of type SafeHtml, got '" + a + ba + C(a));
      return "type_error:SafeHtml"
  }

  function Dc(a) {
      return a instanceof Bc ? a : Ec(ob(typeof a == u && a.G ? a.C() : String(a)))
  }

  function Fc(a) {
      if (a instanceof Bc) return a;
      a = Dc(a);
      a = Cc(a).toString().replace(/  /g, " &#160;").replace(/(\r\n|\r|\n)/g, "<br>");
      return Ec(a)
  }

  function Gc(a) {
      function b(e) {
          Array.isArray(e) ? e.forEach(b) : (e = Dc(e), d.push(Cc(e).toString()))
      }
      var c = Dc(Hc),
          d = [];
      a.forEach(b);
      return Ec(d.join(Cc(c).toString()))
  }

  function Ic(a) {
      return Gc(Array.prototype.slice.call(arguments))
  }

  function Ec(a) {
      if (void 0 === Zb) {
          var b = null;
          var c = A.trustedTypes;
          if (c && c.createPolicy) {
              try {
                  b = c.createPolicy("goog#html", {
                      createHTML: Xa,
                      createScript: Xa,
                      createScriptURL: Xa
                  })
              } catch (d) {
                  A.console && A.console.error(d.message)
              }
              Zb = b
          } else Zb = b
      }
      a = (b = Zb) ? b.createHTML(a) : a;
      return new Bc(a, Ac)
  }
  var Jc = /^[a-zA-Z0-9-]+$/,
      Kc = {
          action: !0,
          cite: !0,
          data: !0,
          formaction: !0,
          href: !0,
          manifest: !0,
          poster: !0,
          src: !0
      },
      Lc = {
          APPLET: !0,
          BASE: !0,
          EMBED: !0,
          IFRAME: !0,
          LINK: !0,
          MATH: !0,
          META: !0,
          OBJECT: !0,
          SCRIPT: !0,
          STYLE: !0,
          SVG: !0,
          TEMPLATE: !0
      },
      Hc = new Bc(A.trustedTypes && A.trustedTypes.emptyHTML || "", Ac);

  function Mc(a, b) {
      cb(bc(a), la);
      I(!/^[\s\xa0]*$/.test(bc(a)), ma);
      return Ec(b)
  };

  function Nc(a, b) {
      if (!(b instanceof P || b instanceof P)) {
          b = typeof b == u && b.G ? b.C() : String(b);
          b: {
              var c = b;
              if (lc) {
                  try {
                      var d = new URL(c)
                  } catch (f) {
                      c = "https:";
                      break b
                  }
                  c = d.protocol
              } else c: {
                  d = document.createElement("a");
                  try {
                      d.href = c
                  } catch (f) {
                      c = void 0;
                      break c
                  }
                  c = d.protocol;c = ":" === c || "" === c ? "https:" : c
              }
          }
          I("javascript:" !== c, "%s is a javascript: URL", b) || (b = ka);
          b = jc(b)
      }
      if (!D(a) || !D(a) || !D(a) || 1 !== a.nodeType || a.namespaceURI && "http://www.w3.org/1999/xhtml" !== a.namespaceURI || a.tagName.toUpperCase() !== "FORM".toString()) {
          c =
              "FORM".toString() + "; got: ";
          if (D(a)) try {
              var e = a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a)
          } catch (f) {
              e = "<object could not be stringified>"
          } else e = void 0 === a ? "undefined" : null === a ? na : typeof a;
          J("Argument is not an HTML Element with tag name " + (c + e))
      }
      a.action = fc(b)
  };

  function Oc(a) {
      return a = ob(a)
  }
  var Pc = String.prototype.repeat ? function (a, b) {
      return a.repeat(b)
  } : function (a, b) {
      return Array(b + 1).join(a)
  };

  function Qc(a, b) {
      if (!Number.isFinite(a)) return String(a);
      a = String(a);
      var c = a.indexOf("."); - 1 === c && (c = a.length);
      var d = "-" === a[0] ? "-" : "";
      d && (a = a.substring(1));
      return d + Pc("0", Math.max(0, b - c)) + a
  };

  function Rc(a) {
      return a ? new Sc(Tc(a)) : Za || (Za = new Sc)
  }

  function Uc(a) {
      var b = document;
      return typeof a === v ? b.getElementById(a) : a
  }

  function Vc(a, b) {
      return (b || document).getElementsByTagName(String(a))
  }

  function Wc(a, b) {
      Vb(b, function (c, d) {
          c && typeof c == u && c.G && (c = c.C());
          "style" == d ? a.style.cssText = c : "class" == d ? a.className = c : "for" == d ? a.htmlFor = c : Xc.hasOwnProperty(d) ? a.setAttribute(Xc[d], c) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, c) : a[d] = c
      })
  }
  var Xc = {
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      colspan: "colSpan",
      frameborder: "frameBorder",
      height: "height",
      maxlength: "maxLength",
      nonce: "nonce",
      role: "role",
      rowspan: "rowSpan",
      type: "type",
      usemap: "useMap",
      valign: "vAlign",
      width: "width"
  };

  function Yc(a, b, c) {
      function d(h) {
          h && b.appendChild(typeof h === v ? a.createTextNode(h) : h)
      }
      for (var e = 2; e < c.length; e++) {
          var f = c[e];
          if (!Oa(f) || D(f) && 0 < f.nodeType) d(f);
          else {
              a: {
                  if (f && typeof f.length == q) {
                      if (D(f)) {
                          var g = typeof f.item == p || typeof f.item == v;
                          break a
                      }
                      if (typeof f === p) {
                          g = typeof f.item == p;
                          break a
                      }
                  }
                  g = !1
              }
              hb(g ? ib(f) : f, d)
          }
      }
  }

  function Zc(a) {
      for (var b; b = a.firstChild;) a.removeChild(b)
  }

  function Tc(a) {
      I(a, "Node cannot be null or undefined.");
      return 9 == a.nodeType ? a : a.ownerDocument || a.document
  }

  function $c(a) {
      return a.contentDocument || a.contentWindow.document
  }
  var ad = {
          SCRIPT: 1,
          STYLE: 1,
          HEAD: 1,
          IFRAME: 1,
          OBJECT: 1
      },
      bd = {
          IMG: " ",
          BR: "\n"
      };

  function cd(a, b, c) {
      if (!(a.nodeName in ad))
          if (3 == a.nodeType) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
          else if (a.nodeName in bd) b.push(bd[a.nodeName]);
      else
          for (a = a.firstChild; a;) cd(a, b, c), a = a.nextSibling
  }

  function Sc(a) {
      this.g = a || A.document || document
  }
  Sc.prototype.h = function (a, b, c) {
      var d = this.g,
          e = arguments,
          f = e[1];
      var g = String(e[0]);
      g = String(g);
      "application/xhtml+xml" === d.contentType && (g = g.toLowerCase());
      g = d.createElement(g);
      f && (typeof f === v ? g.className = f : Array.isArray(f) ? g.className = f.join(" ") : Wc(g, f));
      2 < e.length && Yc(d, g, e);
      return g
  };

  function dd(a) {
      var b = Na("window.location.href");
      null == a && (a = 'Unknown Error of type "null/undefined"');
      if (typeof a === v) return {
          message: a,
          name: "Unknown error",
          lineNumber: fa,
          fileName: b,
          stack: fa
      };
      var c = !1;
      try {
          var d = a.lineNumber || a.line || fa
      } catch (f) {
          d = fa, c = !0
      }
      try {
          var e = a.fileName || a.filename || a.sourceURL || A.$googDebugFname || b
      } catch (f) {
          e = fa, c = !0
      }
      b = ed(a);
      if (!(!c && a.lineNumber && a.fileName && a.stack && a.message && a.name)) return c = a.message, null == c && (c = a.constructor && a.constructor instanceof Function ? 'Unknown Error of type "' +
          (a.constructor.name ? a.constructor.name : fd(a.constructor)) + '"' : "Unknown Error of unknown type", typeof a.toString === p && Object.prototype.toString !== a.toString && (c += ": " + a.toString())), {
          message: c,
          name: a.name || "UnknownError",
          lineNumber: d,
          fileName: e,
          stack: b || fa
      };
      a.stack = b;
      return {
          message: a.message,
          name: a.name,
          lineNumber: a.lineNumber,
          fileName: a.fileName,
          stack: a.stack
      }
  }

  function ed(a, b) {
      b || (b = {});
      b[gd(a)] = !0;
      var c = a.stack || "";
      (a = a.cause) && !b[gd(a)] && (c += "\nCaused by: ", a.stack && 0 == a.stack.indexOf(a.toString()) || (c += typeof a === v ? a : a.message + "\n"), c += ed(a, b));
      return c
  }

  function gd(a) {
      var b = "";
      typeof a.toString === p && (b = "" + a);
      return b + a.stack
  }

  function hd(a) {
      var b = Error();
      if (Error.captureStackTrace) Error.captureStackTrace(b, a || hd), b = String(b.stack);
      else {
          try {
              throw b;
          } catch (c) {
              b = c
          }
          b = (b = b.stack) ? String(b) : null
      }
      b || (b = id(a || arguments.callee.caller, []));
      return b
  }

  function id(a, b) {
      var c = [];
      if (0 <= gb(b, a)) c.push("[...circular reference...]");
      else if (a && 50 > b.length) {
          c.push(fd(a) + "(");
          for (var d = a.arguments, e = 0; d && e < d.length; e++) {
              0 < e && c.push(", ");
              var f = d[e];
              switch (typeof f) {
              case u:
                  f = f ? u : na;
                  break;
              case v:
                  break;
              case q:
                  f = String(f);
                  break;
              case "boolean":
                  f = f ? "true" : "false";
                  break;
              case p:
                  f = (f = fd(f)) ? f : "[fn]";
                  break;
              default:
                  f = typeof f
              }
              40 < f.length && (f = f.slice(0, 40) + "...");
              c.push(f)
          }
          b.push(a);
          c.push(")\n");
          try {
              c.push(id(a.caller, b))
          } catch (g) {
              c.push("[exception trying to get caller]\n")
          }
      } else a ?
          c.push("[...long stack...]") : c.push("[end]");
      return c.join("")
  }

  function fd(a) {
      if (jd[a]) return jd[a];
      a = String(a);
      if (!jd[a]) {
          var b = /function\s+([^\(]+)/m.exec(a);
          jd[a] = b ? b[1] : "[Anonymous]"
      }
      return jd[a]
  }
  var jd = {},
      kd = Object.freeze || ta();

  function ld(a) {
      a && typeof a.T == p && a.T()
  };

  function Q() {
      this.i = this.i;
      this.h = this.h
  }
  Q.prototype.i = !1;
  Q.prototype.T = function () {
      this.i || (this.i = !0, this.F())
  };
  Q.prototype.F = function () {
      if (this.h)
          for (; this.h.length;) this.h.shift()()
  };

  function md(a, b) {
      this.type = a;
      this.g = this.target = b;
      this.defaultPrevented = !1
  }
  md.prototype.i = function () {
      this.defaultPrevented = !0
  };
  var nd = function () {
      if (!A.addEventListener || !Object.defineProperty) return !1;
      var a = !1,
          b = Object.defineProperty({}, "passive", {
              get: function () {
                  a = !0
              }
          });
      try {
          var c = function () {};
          A.addEventListener("test", c, b);
          A.removeEventListener("test", c, b)
      } catch (d) {}
      return a
  }();

  function od(a, b) {
      md.call(this, a ? a.type : "");
      this.relatedTarget = this.g = this.target = null;
      this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
      this.key = "";
      this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
      this.state = null;
      this.pointerId = 0;
      this.pointerType = "";
      this.h = null;
      if (a) {
          var c = this.type = a.type,
              d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
          this.target = a.target || a.srcElement;
          this.g = b;
          (b = a.relatedTarget) ? Lb && (Hb(b, "nodeName") || (b = null)): "mouseover" == c ? b = a.fromElement :
              "mouseout" == c && (b = a.toElement);
          this.relatedTarget = b;
          d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
          this.button = a.button;
          this.key = a.key || "";
          this.ctrlKey = a.ctrlKey;
          this.altKey = a.altKey;
          this.shiftKey = a.shiftKey;
          this.metaKey = a.metaKey;
          this.pointerId =
              a.pointerId || 0;
          this.pointerType = typeof a.pointerType === v ? a.pointerType : pd[a.pointerType] || "";
          this.state = a.state;
          this.h = a;
          a.defaultPrevented && od.M.i.call(this)
      }
  }
  Ra(od, md);
  var pd = kd({
      2: "touch",
      3: "pen",
      4: "mouse"
  });
  od.prototype.i = function () {
      od.M.i.call(this);
      var a = this.h;
      a.preventDefault ? a.preventDefault() : a.returnValue = !1
  };
  var qd = "closure_listenable_" + (1E6 * Math.random() | 0);

  function rd(a) {
      return !(!a || !a[qd])
  };
  var sd = 0;

  function td(a, b, c, d, e) {
      this.listener = a;
      this.proxy = null;
      this.src = b;
      this.type = c;
      this.capture = !!d;
      this.U = e;
      this.key = ++sd;
      this.P = this.S = !1
  }

  function ud(a) {
      a.P = !0;
      a.listener = null;
      a.proxy = null;
      a.src = null;
      a.U = null
  };

  function xd(a) {
      this.src = a;
      this.g = {};
      this.h = 0
  }
  xd.prototype.add = function (a, b, c, d, e) {
      var f = a.toString();
      a = this.g[f];
      a || (a = this.g[f] = [], this.h++);
      var g = yd(a, b, d, e); - 1 < g ? (b = a[g], c || (b.S = !1)) : (b = new td(b, this.src, f, !!d, e), b.S = c, a.push(b));
      return b
  };

  function zd(a, b) {
      var c = b.type;
      if (!(c in a.g)) return !1;
      var d = a.g[c],
          e = gb(d, b),
          f;
      if (f = 0 <= e) I(null != d.length), Array.prototype.splice.call(d, e, 1);
      f && (ud(b), 0 == a.g[c].length && (delete a.g[c], a.h--));
      return f
  }

  function Ad(a) {
      var b = 0,
          c;
      for (c in a.g) {
          for (var d = a.g[c], e = 0; e < d.length; e++) ++b, ud(d[e]);
          delete a.g[c];
          a.h--
      }
  }

  function yd(a, b, c, d) {
      for (var e = 0; e < a.length; ++e) {
          var f = a[e];
          if (!f.P && f.listener == b && f.capture == !!c && f.U == d) return e
      }
      return -1
  };
  var Bd = "closure_lm_" + (1E6 * Math.random() | 0),
      Cd = {},
      Dd = 0;

  function Ed(a, b, c, d, e) {
      if (d && d.once) return Fd(a, b, c, d, e);
      if (Array.isArray(b)) {
          for (var f = 0; f < b.length; f++) Ed(a, b[f], c, d, e);
          return null
      }
      c = Gd(c);
      rd(a) ? (d = D(d) ? !!d.capture : !!d, Hd(a), a = a.g.add(String(b), c, !1, d, e)) : a = Id(a, b, c, !1, d, e);
      return a
  }

  function Id(a, b, c, d, e, f) {
      if (!b) throw Error("Invalid event type");
      var g = D(e) ? !!e.capture : !!e,
          h = Jd(a);
      h || (a[Bd] = h = new xd(a));
      c = h.add(b, c, d, g, f);
      if (c.proxy) return c;
      d = Kd();
      c.proxy = d;
      d.src = a;
      d.listener = c;
      if (a.addEventListener) nd || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e);
      else if (a.attachEvent) a.attachEvent(Ld(b.toString()), d);
      else if (a.addListener && a.removeListener) I("change" === b, "MediaQueryList only has a change event"), a.addListener(d);
      else throw Error("addEventListener and attachEvent are unavailable.");
      Dd++;
      return c
  }

  function Kd() {
      function a(c) {
          return b.call(a.src, a.listener, c)
      }
      var b = Md;
      return a
  }

  function Fd(a, b, c, d, e) {
      if (Array.isArray(b)) {
          for (var f = 0; f < b.length; f++) Fd(a, b[f], c, d, e);
          return null
      }
      c = Gd(c);
      return rd(a) ? a.g.add(String(b), c, !0, D(d) ? !!d.capture : !!d, e) : Id(a, b, c, !0, d, e)
  }

  function Nd(a, b, c, d, e) {
      if (Array.isArray(b))
          for (var f = 0; f < b.length; f++) Nd(a, b[f], c, d, e);
      else(d = D(d) ? !!d.capture : !!d, c = Gd(c), rd(a)) ? (a = a.g, b = String(b).toString(), b in a.g && (f = a.g[b], c = yd(f, c, d, e), -1 < c && (ud(f[c]), I(null != f.length), Array.prototype.splice.call(f, c, 1), 0 == f.length && (delete a.g[b], a.h--)))) : a && (a = Jd(a)) && (b = a.g[b.toString()], a = -1, b && (a = yd(b, c, d, e)), (c = -1 < a ? b[a] : null) && Od(c))
  }

  function Od(a) {
      if (typeof a === q || !a || a.P) return !1;
      var b = a.src;
      if (rd(b)) return zd(b.g, a);
      var c = a.type,
          d = a.proxy;
      b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Ld(c), d) : b.addListener && b.removeListener && b.removeListener(d);
      Dd--;
      (c = Jd(b)) ? (zd(c, a), 0 == c.h && (c.src = null, b[Bd] = null)) : ud(a);
      return !0
  }

  function Ld(a) {
      return a in Cd ? Cd[a] : Cd[a] = "on" + a
  }

  function Md(a, b) {
      if (a.P) a = !0;
      else {
          b = new od(b, this);
          var c = a.listener,
              d = a.U || a.src;
          a.S && Od(a);
          a = c.call(d, b)
      }
      return a
  }

  function Jd(a) {
      a = a[Bd];
      return a instanceof xd ? a : null
  }
  var Pd = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);

  function Gd(a) {
      I(a, "Listener can not be null.");
      if (typeof a === p) return a;
      I(a.handleEvent, "An object listener must have handleEvent method.");
      a[Pd] || (a[Pd] = function (b) {
          return a.handleEvent(b)
      });
      return a[Pd]
  };

  function Qd() {
      Q.call(this);
      this.g = new xd(this);
      this.R = this;
      this.o = null
  }
  Ra(Qd, Q);
  Qd.prototype[qd] = !0;
  Qd.prototype.removeEventListener = function (a, b, c, d) {
      Nd(this, a, b, c, d)
  };

  function Rd(a, b) {
      Hd(a);
      var c = a.o;
      if (c) {
          var d = [];
          for (var e = 1; c; c = c.o) d.push(c), I(1E3 > ++e, "infinite loop")
      }
      a = a.R;
      c = b.type || b;
      typeof b === v ? b = new md(b, a) : b instanceof md ? b.target = b.target || a : (e = b, b = new md(c, a), Xb(b, e));
      e = !0;
      if (d)
          for (var f = d.length - 1; 0 <= f; f--) {
              var g = b.g = d[f];
              e = Sd(g, c, !0, b) && e
          }
      g = b.g = a;
      e = Sd(g, c, !0, b) && e;
      e = Sd(g, c, !1, b) && e;
      if (d)
          for (f = 0; f < d.length; f++) g = b.g = d[f], e = Sd(g, c, !1, b) && e
  }
  Qd.prototype.F = function () {
      Qd.M.F.call(this);
      this.g && Ad(this.g);
      this.o = null
  };

  function Sd(a, b, c, d) {
      b = a.g.g[String(b)];
      if (!b) return !0;
      b = b.concat();
      for (var e = !0, f = 0; f < b.length; ++f) {
          var g = b[f];
          if (g && !g.P && g.capture == c) {
              var h = g.listener,
                  k = g.U || g.src;
              g.S && zd(a.g, g);
              e = !1 !== h.call(k, d) && e
          }
      }
      return e && !d.defaultPrevented
  }

  function Hd(a) {
      I(a.g, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
  };

  function Td(a, b, c) {
      if (typeof a === p) c && (a = E(a, c));
      else if (a && typeof a.handleEvent == p) a = E(a.handleEvent, a);
      else throw Error("Invalid listener argument");
      return 2147483647 < Number(b) ? -1 : A.setTimeout(a, b || 0)
  };

  function Ud(a) {
      return Vd("InvalidArgumentError", a)
  }

  function Vd(a, b) {
      b = Error(b);
      b.name = a;
      return b
  };

  function Wd(a, b) {
      this.g = a[A.Symbol.iterator]();
      this.h = b
  }
  Wd.prototype[Symbol.iterator] = function () {
      return this
  };
  Wd.prototype.next = function () {
      var a = this.g.next();
      return {
          value: a.done ? void 0 : this.h.call(void 0, a.value),
          done: a.done
      }
  };

  function Xd(a, b) {
      return new Wd(a, b)
  };

  function Yd() {}
  Yd.prototype.next = function () {
      return Zd
  };
  var Zd = kd({
      done: !0,
      value: void 0
  });
  Yd.prototype.K = function () {
      return this
  };

  function $d(a) {
      if (a instanceof ae || a instanceof be || a instanceof ce) return a;
      if (typeof a.next == p) return new ae(function () {
          return a
      });
      if (typeof a[Symbol.iterator] == p) return new ae(function () {
          return a[Symbol.iterator]()
      });
      if (typeof a.K == p) return new ae(function () {
          return a.K()
      });
      throw Error("Not an iterator or iterable.");
  }

  function ae(a) {
      this.g = a
  }
  ae.prototype.K = function () {
      return new be(this.g())
  };
  ae.prototype[Symbol.iterator] = function () {
      return new ce(this.g())
  };
  ae.prototype.h = function () {
      return new ce(this.g())
  };

  function be(a) {
      this.g = a
  }
  y(be, Yd);
  be.prototype.next = function () {
      return this.g.next()
  };
  be.prototype[Symbol.iterator] = function () {
      return new ce(this.g)
  };
  be.prototype.h = function () {
      return new ce(this.g)
  };

  function ce(a) {
      ae.call(this, function () {
          return a
      });
      this.i = a
  }
  y(ce, ae);
  ce.prototype.next = function () {
      return this.i.next()
  };

  function de(a, b) {
      this.h = {};
      this.g = [];
      this.i = this.size = 0;
      var c = arguments.length;
      if (1 < c) {
          if (c % 2) throw Error("Uneven number of arguments");
          for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
      } else if (a)
          if (a instanceof de)
              for (c = a.X(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d]));
          else
              for (d in a) this.set(d, a[d])
  }
  w = de.prototype;
  w.Y = function () {
      ee(this);
      for (var a = [], b = 0; b < this.g.length; b++) a.push(this.h[this.g[b]]);
      return a
  };
  w.X = function () {
      ee(this);
      return this.g.concat()
  };
  w.has = function (a) {
      return Object.prototype.hasOwnProperty.call(this.h, a)
  };

  function ee(a) {
      if (a.size != a.g.length) {
          for (var b = 0, c = 0; b < a.g.length;) {
              var d = a.g[b];
              Object.prototype.hasOwnProperty.call(a.h, d) && (a.g[c++] = d);
              b++
          }
          a.g.length = c
      }
      if (a.size != a.g.length) {
          var e = {};
          for (c = b = 0; b < a.g.length;) d = a.g[b], Object.prototype.hasOwnProperty.call(e, d) || (a.g[c++] = d, e[d] = 1), b++;
          a.g.length = c
      }
  }
  w.get = function (a, b) {
      return Object.prototype.hasOwnProperty.call(this.h, a) ? this.h[a] : b
  };
  w.set = function (a, b) {
      Object.prototype.hasOwnProperty.call(this.h, a) || (this.size += 1, this.g.push(a), this.i++);
      this.h[a] = b
  };
  w.forEach = function (a, b) {
      for (var c = this.X(), d = 0; d < c.length; d++) {
          var e = c[d],
              f = this.get(e);
          a.call(b, f, e, this)
      }
  };
  w.keys = function () {
      return $d(this.K(!0)).h()
  };
  w.values = function () {
      return $d(this.K(!1)).h()
  };
  w.entries = function () {
      var a = this;
      return Xd(this.keys(), function (b) {
          return [b, a.get(b)]
      })
  };
  w.K = function (a) {
      ee(this);
      var b = 0,
          c = this.i,
          d = this,
          e = new Yd;
      e.next = function () {
          if (c != d.i) throw Error("The map has changed since the iterator was created");
          if (b >= d.g.length) return Zd;
          var f = d.g[b++];
          return {
              value: a ? f : d.h[f],
              done: !1
          }
      };
      return e
  };

  function fe(a, b, c) {
      var d = a.get(b);
      d || (d = [], a.set(b, d));
      d.push(c)
  }

  function ge(a) {
      var b = a.type;
      if (typeof b === v) switch (b.toLowerCase()) {
      case "checkbox":
      case "radio":
          return a.checked ? a.value : null;
      case "select-one":
          return b = a.selectedIndex, 0 <= b ? a.options[b].value : null;
      case oa:
          b = [];
          for (var c, d = 0; c = a.options[d]; d++) c.selected && b.push(c.value);
          return b.length ? b : null
      }
      return null != a.value ? a.value : null
  };

  function he(a) {
      this.g = a
  }

  function ie(a, b, c) {
      if (null == b) c.push(na);
      else {
          if (typeof b == u) {
              if (Array.isArray(b)) {
                  var d = b;
                  b = d.length;
                  c.push("[");
                  for (var e = "", f = 0; f < b; f++) c.push(e), e = d[f], ie(a, a.g ? a.g.call(d, String(f), e) : e, c), e = ",";
                  c.push("]");
                  return
              }
              if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();
              else {
                  c.push("{");
                  f = "";
                  for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (e = b[d], typeof e != p && (c.push(f), je(d, c), c.push(":"), ie(a, a.g ? a.g.call(b, d, e) : e, c), f = ","));
                  c.push("}");
                  return
              }
          }
          switch (typeof b) {
          case v:
              je(b,
                  c);
              break;
          case q:
              c.push(isFinite(b) && !isNaN(b) ? String(b) : na);
              break;
          case "boolean":
              c.push(String(b));
              break;
          case p:
              c.push(na);
              break;
          default:
              throw Error("Unknown type: " + typeof b);
          }
      }
  }
  var ke = {
          '"': '\\"',
          "\\": "\\\\",
          "/": "\\/",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "\t": "\\t",
          "\v": "\\u000b"
      },
      le = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;

  function je(a, b) {
      b.push('"', a.replace(le, function (c) {
          var d = ke[c];
          d || (d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).slice(1), ke[c] = d);
          return d
      }), '"')
  };

  function me(a, b) {
      if (/__$/.test(a)) throw Ud('User properties cannot end with "__". Failed on property: ' + a);
      return b
  }

  function ne(a, b) {
      if (D(b) && 1 == b.nodeType) throw Ud(ea + a);
      return b
  }

  function oe(a) {
      ie(new he(me), a, [])
  }

  function pe(a) {
      return a.source !== window.parent ? (console.log("dropping postMessage.. was from unexpected window"), !1) : !0
  };

  function qe(a, b) {
      var c = [];
      if (void 0 === a) return a;
      var d = [],
          e = [];
      b & 1 && d.push(F(re, c.length));
      b & 2 ? d.push(F(se, !1)) : b & 64 && d.push(F(se, !0));
      b & 4 && d.push(te);
      b & 8 && e.push(oe);
      for (var f = 0; f < c.length; ++f) c[f] & 1 && d.push(F(ue, f, se)), c[f] & 2 && d.push(F(ue, f, te)), c[f] & 4 && d.push(F(ue, f, ve));
      var g = b & 16 ? {} : void 0,
          h = 0 == d.length ? Tb : Ub.apply(A, d),
          k = 0 == e.length ? Tb : Ub.apply(A, e);
      return function () {
          var l = h(Array.from(arguments));
          if (b & 32) Td(function () {
              a.apply(g || this, l)
          });
          else return k(a.apply(g || this, l))
      }
  }

  function re(a, b) {
      return kb(b, 0, a)
  }

  function ue(a, b, c) {
      var d = ib(c);
      d[a] = b([c[a]])[0];
      return d
  }

  function we(a, b, c) {
      var d = Array.isArray(a) ? [] : {},
          e;
      for (e in a)
          if (!/__$/.test(e)) {
              var f = a[e];
              if (!D(f) || D(f) && 1 == f.nodeType && !b) d[e] = f;
              else {
                  var g = Object.prototype.toString.call(f);
                  if (0 <= gb(xe, g)) d[e] = we(f, b, c);
                  else if (c && f && f.constructor && f.call && f.apply) d[e] = f;
                  else throw new TypeError(ea + e);
              }
          } return d
  }

  function se(a, b) {
      try {
          return we(b, !1, a)
      } catch (c) {
          throw c instanceof TypeError ? c : new TypeError(da);
      }
  }

  function te(a) {
      try {
          return we(a, !0, !1)
      } catch (b) {
          throw b instanceof TypeError ? b : new TypeError(da);
      }
  }

  function ve(a) {
      for (var b = [], c = 0; c < a.length; ++c) {
          var d = a[c];
          b[c] = D(d) ? (new String(d)).toString() : d
      }
      return b
  }
  var xe = ["[object Array]", "[object Object]"];

  function ye(a, b) {
      for (var c = {
              withSuccessHandler: function (f) {
                  return ye(ze(a.g, a.j, f, a.i, a.h, a.l), b)
              },
              withFailureHandler: function (f) {
                  return ye(ze(a.g, a.j, a.o, f, a.h, a.l), b)
              },
              withLogger: function (f) {
                  return ye(ze(a.g, a.j, a.o, a.i, f, a.l), b)
              },
              withUserObject: function (f) {
                  return ye(ze(a.g, a.j, a.o, a.i, a.h, f), b)
              }
          }, d = 0; d < b.length; ++d) {
          var e = E(F(a.na, b[d]), a);
          e = qe(e, 2);
          c[b[d]] = e
      }
      return c
  };
  !K("Android") || Fb();
  Fb();
  K("Safari") && (Fb() || (Eb() ? 0 : K("Coast")) || (Eb() ? 0 : K("Opera")) || (Eb() ? 0 : K(ca)) || (Eb() ? Db("Microsoft Edge") : K("Edg/")) || Eb() && Db("Opera"));
  var Ae = {},
      Be = null;
  var Ce = "undefined" !== typeof Uint8Array,
      De = !Jb && typeof btoa === p;
  I(!0);
  var R = typeof Symbol === p && "symbol" === typeof Symbol() ? Symbol("INTERNAL_ARRAY_STATE") : void 0;

  function Ee(a, b) {
      I((b & 127) == b);
      db(a, ra);
      if (R) return a[R] |= b;
      if (void 0 !== a.g) return a.g |= b;
      Object.defineProperties(a, {
          g: {
              value: b,
              configurable: !0,
              writable: !0,
              enumerable: !1
          }
      });
      return b
  }

  function Fe(a) {
      var b = S(a);
      1 !== (b & 1) && (Object.isFrozen(a) && (a = Array.prototype.slice.call(a)), T(a, b | 1));
      return a
  }
  var Ge = Object.getOwnPropertyDescriptor(Array.prototype, "ja");
  Object.defineProperties(Array.prototype, {
      ja: {
          get: function () {
              function a(e, f) {
                  e & b && c.push(f)
              }
              var b = S(this),
                  c = [];
              a(1, "IS_REPEATED_FIELD");
              a(2, "IS_IMMUTABLE_ARRAY");
              a(4, "IS_API_FORMATTED");
              a(8, "ONLY_MUTABLE_VALUES");
              a(16, "MUTABLE_REFERENCES_ARE_OWNED");
              a(32, "CONSTRUCTED");
              a(64, "TRANSFERRED");
              var d = c.join(",");
              return Ge ? Ge.get.call(this) + "|" + d : d
          },
          configurable: !0,
          enumerable: !1
      }
  });

  function S(a) {
      db(a, ra);
      var b;
      R ? b = a[R] : b = a.g;
      return null == b ? 0 : b
  }

  function T(a, b) {
      db(a, ra);
      I((b & 127) == b);
      R ? a[R] = b : void 0 !== a.g ? a.g = b : Object.defineProperties(a, {
          g: {
              value: b,
              configurable: !0,
              writable: !0,
              enumerable: !1
          }
      });
      return a
  }

  function He(a) {
      Ee(a, 1);
      return a
  }

  function Ie(a) {
      return !!(S(a) & 2)
  }

  function Je(a, b) {
      T(b, (a | 0) & -51)
  }

  function Ke(a, b) {
      T(b, (a | 18) & -41)
  };
  var Le = {};

  function Me(a) {
      return null !== a && typeof a === u && !Array.isArray(a) && a.constructor === Object
  }
  var Ne, Oe = Object.freeze(T([], 23));

  function Pe(a) {
      if (a & 2) throw Error("Cannot mutate an immutable Message");
  }

  function Qe() {};

  function Re(a) {
      if (null == a) return a;
      switch (typeof a) {
      case v:
          return +a;
      case q:
          return a
      }
  }

  function Se(a) {
      if (null != a && typeof a !== v) throw Error("Expected a string or null or undefined but got " + a + " a " + C(a));
      return a
  }

  function Te(a) {
      return null == a || typeof a === v ? a : void 0
  }

  function Ue(a, b, c) {
      var d = !1;
      if (null != a && typeof a === u && !(d = Array.isArray(a)) && a.O === Le) return a;
      if (d) {
          var e = d = S(a);
          0 === e && (e |= c & 16);
          e |= c & 2;
          e !== d && T(a, e);
          return new b(a)
      }
  };

  function Ve() {
      throw Error("please construct maps as mutable then call toImmutable");
  }
  if ("undefined" != typeof Symbol && "undefined" != typeof Symbol.hasInstance) {
      var We = function () {
              throw Error("Cannot perform instanceof checks on ImmutableMap: please use isImmutableMap or isMutableMap to assert on the mutability of a map. See go/jspb-api-gotchas#immutable-classes for more information");
          },
          Xe = {};
      Object.defineProperties(Ve, (Xe[Symbol.hasInstance] = {
          value: We,
          configurable: !1,
          writable: !1,
          enumerable: !1
      }, Xe));
      I(Ve[Symbol.hasInstance] === We, "defineProperties did not work: was it monkey-patched?")
  };

  function U(a, b, c) {
      return -1 === b ? null : b >= a.h ? a.g ? a.g[b] : void 0 : c && a.g && (c = a.g[b], null != c) ? c : a.m[b + a.i]
  }

  function Ye(a, b, c) {
      Pe(S(a.m));
      return Ze(a, b, c)
  }

  function Ze(a, b, c) {
      a.j && (a.j = void 0);
      if (b >= a.h) {
          var d = a.h + a.i;
          I(0 <= d && Number.isInteger(d) && 4294967295 > d);
          (a.g || (a.g = a.m[d] = {}))[b] = c;
          return a
      }
      a.m[b + a.i] = c;
      (c = a.g) && b in c && delete c[b];
      return a
  }

  function $e(a, b) {
      if (!a) return a;
      I(Ie(b.m) ? Ie(a.m) : !0);
      return a
  }

  function af(a, b) {
      var c = Ie(b.m),
          d = Ie(a),
          e = Object.isFrozen(a) && d;
      I(Object.isFrozen(a) || !(S(a) & 16));
      I(Ie(b.m) ? Object.isFrozen(a) : !0);
      (c || d) && I(e);
      I(!!(S(a) & 4));
      if (d && a.length)
          for (c = 0; 1 > c; c++) $e(a[c], b);
      return a
  }

  function bf(a, b, c) {
      var d = U(a, c, !1);
      b = Ue(d, b, S(a.m));
      b !== d && null != b && Ze(a, c, b);
      d = $e(b, a);
      if (null == d) return d;
      Ie(a.m) || (b = cf(d), b !== d && (d = b, Ze(a, c, d)));
      return $e(d, a)
  }

  function df(a, b, c) {
      var d = S(a.m),
          e = !!(d & 2);
      var f = e ? 1 : 2,
          g = !!(d & 2);
      I(!g || 2 !== f, "shareMode must be FROZEN for immutable messages");
      I(!0);
      var h = U(a, c);
      Array.isArray(h) || (h = Oe);
      var k = S(h);
      k & 1 || He(h);
      g ? k & 2 || Ee(h, 18) : k & 16 && !(k & 2) && (k = h, I(!0), db(k, ra), R ? k[R] && (k[R] &= -17) : void 0 !== k.g && (k.g &= -17));
      if (h !== Oe && S(h) & 4) 3 === f ? c = h : (g || (g = Object.isFrozen(h), 1 === f ? g || Object.freeze(h) : (f = S(h), b = f & -19, g && (h = Array.prototype.slice.call(h), f = 0, Ze(a, c, h)), f !== b && T(h, b))), c = af(h, a));
      else {
          k = h;
          g = !!(d & 2);
          var l = !!(S(k) & 2);
          I(!(g &&
              !l));
          h = k;
          !g && l && (k = Array.prototype.slice.call(k));
          d |= l ? 2 : 0;
          for (var n = 0, m = 0; n < k.length; n++) {
              var G = Ue(k[n], b, d);
              void 0 !== G && (l || (l = !!(2 & S(G.m))), k[m++] = G)
          }
          m < n && (k.length = m);
          b = k;
          d = !l;
          k = S(b);
          l = k | 5;
          d = d ? l | 8 : l & -9;
          k != d && (Object.isFrozen(b) && (b = Array.prototype.slice.call(b)), T(b, d));
          k = b;
          h !== k && Ze(a, c, k);
          if (g || 1 === f) I(2 !== f), Object.freeze(k);
          c = 3 === f ? k : af(k, a)
      }
      if (!(e || S(c) & 8)) {
          for (e = 0; e < c.length; e++) f = c[e], g = cf(f), f !== g && (c[e] = g);
          Ee(c, 8)
      }
      return af(c, a)
  }

  function ef(a, b) {
      return null == a ? b : a
  }

  function V(a, b) {
      return ef(Te(U(a, b)), "")
  };
  var ff;

  function gf(a, b) {
      return hf(b)
  }

  function hf(a) {
      switch (typeof a) {
      case q:
          return isFinite(a) ? a : String(a);
      case "boolean":
          return a ? 1 : 0;
      case u:
          if (a && !Array.isArray(a) && Ce && null != a && a instanceof Uint8Array) {
              if (De) {
                  for (var b = "", c = 0, d = a.length - 10240; c < d;) b += String.fromCharCode.apply(null, a.subarray(c, c += 10240));
                  b += String.fromCharCode.apply(null, c ? a.subarray(c) : a);
                  a = btoa(b)
              } else {
                  I(Oa(a), "encodeByteArray takes an array as a parameter");
                  void 0 === b && (b = 0);
                  if (!Be) {
                      Be = {};
                      c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
                      d = ["+/=", "+/", "-_=", "-_.", "-_"];
                      for (var e = 0; 5 > e; e++) {
                          var f = c.concat(d[e].split(""));
                          Ae[e] = f;
                          for (var g = 0; g < f.length; g++) {
                              var h = f[g],
                                  k = Be[h];
                              void 0 === k ? Be[h] = g : I(k === g)
                          }
                      }
                  }
                  b = Ae[b];
                  c = Array(Math.floor(a.length / 3));
                  d = b[64] || "";
                  for (e = f = 0; f < a.length - 2; f += 3) {
                      k = a[f];
                      var l = a[f + 1];
                      h = a[f + 2];
                      g = b[k >> 2];
                      k = b[(k & 3) << 4 | l >> 4];
                      l = b[(l & 15) << 2 | h >> 6];
                      h = b[h & 63];
                      c[e++] = "" + g + k + l + h
                  }
                  g = 0;
                  h = d;
                  switch (a.length - f) {
                  case 2:
                      g = a[f + 1], h = b[(g & 15) << 2] || d;
                  case 1:
                      a = a[f], c[e] = "" + b[a >> 2] + b[(a & 3) << 4 | g >> 4] + h + d
                  }
                  a = c.join("")
              }
              return a
          }
      }
      return a
  };

  function jf(a, b) {
      for (var c = Array.prototype.slice.call(a.m), d = a.g, e = c.length + (d ? -1 : 0), f = 0; f < e; f++) c[f] = b(c[f]);
      if (d) {
          e = c[f] = {};
          for (var g in d) I(!isNaN(g), "should not have non-numeric keys in sparse objects after a constructor is called."), e[g] = b(d[g])
      }
      b = a.constructor;
      Ee(c, 16);
      I(!!(S(c) & 16));
      ff = c;
      c = new b(c);
      ff = void 0;
      a.ea && (c.ea = a.ea.slice());
      return c
  }

  function kf(a, b, c, d, e, f) {
      if (null != a) {
          if (Array.isArray(a)) a = e && 0 == a.length && S(a) & 1 ? void 0 : f && S(a) & 2 ? a : lf(a, b, c, void 0 !== d, e, f);
          else if (Me(a)) {
              var g = {},
                  h;
              for (h in a) g[h] = kf(a[h], b, c, d, e, f);
              a = g
          } else a = b(a, d);
          return a
      }
  }

  function lf(a, b, c, d, e, f) {
      var g = d || c ? S(a) : 0;
      d = d ? !!(g & 16) : void 0;
      a = Array.prototype.slice.call(a);
      for (var h = 0; h < a.length; h++) a[h] = kf(a[h], b, c, d, e, f);
      c && c(g, a);
      return a
  }

  function mf(a) {
      return a.O === Le ? a.toJSON() : hf(a)
  };

  function nf(a, b, c) {
      c = void 0 === c ? Ke : c;
      if (null != a) {
          if (Ce && a instanceof Uint8Array) return b ? a : new Uint8Array(a);
          if (Array.isArray(a)) {
              var d = S(a);
              if (d & 2) return a;
              if (b && !(d & 32) && (d & 16 || 0 === d)) return T(a, d | 18), a;
              a = lf(a, nf, d & 4 ? Ke : c, !0, !1, !0);
              b = S(a);
              b & 4 && b & 2 && Object.freeze(a);
              return a
          }
          a.O === Le && (I(a.O === Le), Ie(a.m) || (a = of(a, !0), Ee(a.m, 18)));
          return a
      }
  }

  function of(a, b) {
      I(a.O === Le);
      var c = a.m,
          d = b || Ie(a.m) ? Ke : Je,
          e = !!(S(c) & 16);
      return jf(a, function (f) {
          return nf(f, e, d)
      })
  }

  function cf(a) {
      if (!Ie(a.m)) return a;
      var b = of(a, !1);
      b.j = a;
      return b
  };
  if ("undefined" !== typeof Proxy) {
      var W = wf;
      new Proxy({}, {
          getPrototypeOf: W,
          setPrototypeOf: W,
          isExtensible: W,
          preventExtensions: W,
          getOwnPropertyDescriptor: W,
          defineProperty: W,
          has: W,
          get: W,
          set: W,
          deleteProperty: W,
          apply: W,
          construct: W
      })
  }

  function wf() {
      throw Error("this array or object is owned by JSPB and should not be reused, did you mean to copy it with copyJspbArray? See go/jspb-api-gotchas#construct_from_array");
      throw Error();
  };

  function xf(a, b, c) {
      eb(this, xf, "The message constructor should only be used by subclasses");
      I(this.constructor !== xf, "Message is an abstract class and cannot be directly constructed");
      null == a && (a = ff);
      ff = void 0;
      if (null == a) a = c ? [c] : [], T(a, 48);
      else {
          if (!Array.isArray(a)) throw Error("data passed to JSPB constructors must be an Array, got '" + JSON.stringify(a) + "' a " + C(a));
          if (Object.isFrozen(a) || !Object.isExtensible(a) || Object.isSealed(a)) throw Error("data passed to JSPB constructors must be mutable");
          if (c &&
              c !== a[0]) throw Error('Expected message to have a message id: "' + c + '" in the array, got: ' + JSON.stringify(a[0]) + " a " + C(a[0]) + ", are you parsing with the wrong proto?");
          var d = Ee(a, 0) | 32;
          T(a, d)
      }
      this.i = c ? 0 : -1;
      this.m = a;
      this.preventPassingToStructuredClone = Qe;
      a: {
          c = this.m.length;a = c - 1;
          if (c && (c = this.m[a], Me(c))) {
              this.g = c;
              this.h = a - this.i;
              break a
          }
          b ? (this.h = Math.max(b, a + 1 - this.i), this.g = void 0) : this.h = Number.MAX_VALUE
      }
      I(!!(S(this.m) & 32))
  }
  xf.prototype.toJSON = function () {
      if (Ne) var a = yf(this, this.m, !1);
      else a = this.m, db(a), a = lf(a, mf, void 0, void 0, !1, !1), a = yf(this, a, !0);
      return a
  };
  xf.prototype.O = Le;
  xf.prototype.toString = function () {
      return yf(this, this.m, !1).toString()
  };

  function yf(a, b, c) {
      var d = a ? a.constructor.ba : void 0,
          e = a.h;
      if (d) {
          if (!c) {
              b = Array.prototype.slice.call(b);
              var f;
              if (b.length && Me(f = b[b.length - 1]))
                  for (var g = 0; g < d.length; g++)
                      if (d[g] >= e) {
                          Object.assign(b[b.length - 1] = {}, f);
                          break
                      }
          }
          e = b;
          c = !c;
          f = a.h;
          var h;
          for (g = 0; g < d.length; g++) {
              var k = d[g];
              if (k < f) {
                  k += a.i;
                  var l = e[k];
                  null == l ? e[k] = c ? Oe : He([]) : c && l !== Oe && Fe(l)
              } else h || (l = void 0, e.length && Me(l = e[e.length - 1]) ? h = l : e.push(h = {})), l = h[k], null == h[k] ? h[k] = c ? Oe : He([]) : c && l !== Oe && Fe(l)
          }
      }
      return b
  };

  function zf(a) {
      if (a instanceof xf) return a.constructor.g
  };
  (function () {
      var a = A.jspbGetTypeName;
      A.jspbGetTypeName = a ? function (b) {
          return a(b) || zf(b)
      } : zf
  })();
  var X = xf;

  function Af(a) {
      X.call(this, a)
  }
  y(Af, X);
  Af.g = "maestro.published.shared.proto.UserSafeExecutionRequest";
  Af.ba = [4];

  function Bf(a) {
      X.call(this, a)
  }
  y(Bf, X);
  Bf.g = "maestro.published.shared.proto.UserSafeExecutionResult.UserSafeLogEntry";

  function Cf(a) {
      X.call(this, a)
  }
  y(Cf, X);
  Cf.g = "maestro.published.shared.proto.UserSafeExecutionResult.AbridgedLogs";
  Cf.ba = [1];

  function Df(a) {
      X.call(this, a)
  }
  y(Df, X);
  Df.g = "maestro.published.shared.proto.UserSafeExecutionResult.ScriptStackElement";

  function Ef(a) {
      X.call(this, a)
  }
  y(Ef, X);
  Ef.g = "maestro.published.shared.proto.UserSafeExecutionResult.Failure";
  Ef.ba = [2];

  function Ff(a) {
      X.call(this, a)
  }
  y(Ff, X);
  Ff.g = "maestro.published.shared.proto.UserSafeExecutionResult.Success";

  function Gf(a) {
      X.call(this, a, 0, "op.exec")
  }
  y(Gf, X);
  Gf.g = "maestro.published.shared.proto.UserSafeExecutionResult";

  function Hf(a, b, c) {
      typeof a === q ? (this.g = If(a, b || 0, c || 1), Jf(this, c || 1)) : D(a) ? (this.g = If(a.getFullYear(), a.getMonth(), a.getDate()), Jf(this, a.getDate())) : (this.g = new Date(Date.now()), a = this.g.getDate(), this.g.setHours(0), this.g.setMinutes(0), this.g.setSeconds(0), this.g.setMilliseconds(0), Jf(this, a))
  }

  function If(a, b, c) {
      b = new Date(a, b, c);
      0 <= a && 100 > a && b.setFullYear(b.getFullYear() - 1900);
      return b
  }
  w = Hf.prototype;
  w.getFullYear = function () {
      return this.g.getFullYear()
  };
  w.getMonth = function () {
      return this.g.getMonth()
  };
  w.getDate = function () {
      return this.g.getDate()
  };
  w.getTime = function () {
      return this.g.getTime()
  };
  w.set = function (a) {
      this.g = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  };
  w.add = function (a) {
      if (a.o || a.j) {
          var b = this.getMonth() + a.j + 12 * a.o,
              c = this.getFullYear() + Math.floor(b / 12);
          b %= 12;
          0 > b && (b += 12);
          a: {
              switch (b) {
              case 1:
                  var d = 0 != c % 4 || 0 == c % 100 && 0 != c % 400 ? 28 : 29;
                  break a;
              case 5:
              case 8:
              case 10:
              case 3:
                  d = 30;
                  break a
              }
              d = 31
          }
          d = Math.min(d, this.getDate());
          this.g.setDate(1);
          this.g.setFullYear(c);
          this.g.setMonth(b);
          this.g.setDate(d)
      }
      a.g && (c = this.getFullYear(), b = 0 <= c && 99 >= c ? -1900 : 0, a = new Date((new Date(c, this.getMonth(), this.getDate(), 12)).getTime() + 864E5 * a.g), this.g.setDate(1), this.g.setFullYear(a.getFullYear() +
          b), this.g.setMonth(a.getMonth()), this.g.setDate(a.getDate()), Jf(this, a.getDate()))
  };
  w.N = function (a) {
      var b = this.getFullYear(),
          c = 0 > b ? "-" : 1E4 <= b ? "+" : "";
      return [c + Qc(Math.abs(b), c ? 6 : 4), Qc(this.getMonth() + 1, 2), Qc(this.getDate(), 2)].join(a ? "-" : "") + ""
  };
  w.toString = function () {
      return this.N()
  };

  function Jf(a, b) {
      a.getDate() != b && a.g.setUTCHours(a.g.getUTCHours() + (a.getDate() < b ? 1 : -1))
  }
  w.valueOf = function () {
      return this.g.valueOf()
  };

  function Kf(a, b, c, d, e, f, g) {
      this.g = typeof a === q ? new Date(a, b || 0, c || 1, d || 0, e || 0, f || 0, g || 0) : new Date(a && a.getTime ? a.getTime() : Date.now())
  }
  Ra(Kf, Hf);
  Kf.prototype.add = function (a) {
      Hf.prototype.add.call(this, a);
      a.h && this.g.setUTCHours(this.g.getUTCHours() + a.h);
      a.i && this.g.setUTCMinutes(this.g.getUTCMinutes() + a.i);
      a.l && this.g.setUTCSeconds(this.g.getUTCSeconds() + a.l)
  };
  Kf.prototype.N = function (a) {
      var b = Hf.prototype.N.call(this, a);
      return a ? b + "T" + Qc(this.g.getHours(), 2) + ":" + Qc(this.g.getMinutes(), 2) + ":" + Qc(this.g.getSeconds(), 2) : b + "T" + Qc(this.g.getHours(), 2) + Qc(this.g.getMinutes(), 2) + Qc(this.g.getSeconds(), 2)
  };
  Kf.prototype.toString = function () {
      return this.N()
  };
  var Lf = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");

  function Mf(a, b) {
      if (a) {
          a = a.split("&");
          for (var c = 0; c < a.length; c++) {
              var d = a[c].indexOf("="),
                  e = null;
              if (0 <= d) {
                  var f = a[c].substring(0, d);
                  e = a[c].substring(d + 1)
              } else f = a[c];
              b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
          }
      }
  }

  function Nf(a, b, c) {
      cb(a);
      if (Array.isArray(b)) {
          db(b);
          for (var d = 0; d < b.length; d++) Nf(a, String(b[d]), c)
      } else null != b && c.push(a + ("" === b ? "" : "=" + encodeURIComponent(String(b))))
  }

  function Of(a, b) {
      I(0 == Math.max(a.length - (b || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
      var c = [];
      for (b = b || 0; b < a.length; b += 2) Nf(a[b], a[b + 1], c);
      return c.join("&")
  }

  function Pf(a, b) {
      var c = 2 == arguments.length ? Of(arguments[1], 0) : Of(arguments, 1);
      if (c) {
          var d = a.indexOf("#");
          0 > d && (d = a.length);
          var e = a.indexOf("?");
          if (0 > e || e > d) {
              e = d;
              var f = ""
          } else f = a.substring(e + 1, d);
          d = [a.slice(0, e), f, a.slice(d)];
          e = d[1];
          d[1] = c ? e ? e + "&" + c : c : e;
          c = d[0] + (d[1] ? "?" + d[1] : "") + d[2]
      } else c = a;
      return c
  };

  function Qf(a, b, c, d, e, f) {
      this.g = a;
      this.j = b;
      this.o = c;
      this.i = d;
      this.h = e;
      this.l = f
  }

  function ze(a, b, c, d, e, f) {
      function g(h) {
          throw h;
      }
      return new Qf(a, b, c || L, d || g, e || L, f)
  }
  w = Qf.prototype;
  w.na = function (a, b) {
      var c = F(Rf, this.o, this.i, this.h, this.l),
          d = F(Sf, this.i, this.l),
          e = Array.prototype.slice.call(arguments, 1);
      if (0 != e.length && "[object HTMLFormElement]" === Object.prototype.toString.call(e[0])) {
          if (1 < e.length) throw Ud("Forms with file inputs must be the only parameter.");
          e = e[0];
          a: {
              var f = e.elements;
              for (var g, h = 0; g = f[h]; h++)
                  if (!g.disabled && g.type && "file" == g.type.toLowerCase()) {
                      f = !0;
                      break a
                  } f = !1
          }
          if (f) {
              var k = this.g;
              e = E(this.ia, this, a, e, c, d);
              c = {
                  rq: "post"
              };
              var l = "" + ++k.j;
              d = new Tf(e || L, d || L);
              k.g[l] = d;
              c.eid = l;
              d = JSON.stringify(c);
              Uf(k, d);
              return
          }
          f = new de;
          var n = e.elements,
              m;
          for (g = 0; m = n.item(g); g++)
              if (m.form == e && !m.disabled && "FIELDSET" != m.tagName) switch (h = m.name, m.type.toLowerCase()) {
              case "file":
              case "submit":
              case "reset":
              case "button":
                  break;
              case oa:
                  m = ge(m);
                  if (null != m)
                      for (var G, r = 0; G = m[r]; r++) fe(f, h, G);
                  break;
              default:
                  G = ge(m), null != G && fe(f, h, G)
              }
          n = e.getElementsByTagName("INPUT");
          for (g = 0; m = n[g]; g++) m.form == e && "image" == m.type.toLowerCase() && (h = m.name, fe(f, h, m.value), fe(f, h + ".x", "0"), fe(f, h + ".y",
              "0"));
          e = {};
          g = Aa(f.keys());
          for (h = g.next(); !h.done; h = g.next()) h = h.value, e[h] = f.get(h);
          for (l in e) 1 == e[l].length && (e[l] = e[l][0]);
          e = [e]
      }
      ie(new he(ne), e, []);
      l = new Af;
      l = Ye(l, 1, Se(a));
      e = JSON.stringify(e);
      l = Ye(l, 2, Se(e));
      l = Ye(l, 7, !0);
      Pe(S(l.m));
      e = [0];
      null == e ? e = Oe : (db(e), e = Fe(e));
      l = Ze(l, 4, e);
      l = Ye(l, 8, this.h != L ? 1 : 0);
      a: {
          Ne = !0;
          try {
              k = JSON.stringify(l.toJSON(), gf);
              break a
          } finally {
              Ne = !1
          }
          k = void 0
      }
      e = Of(["request", k]);
      k = this.g;
      l = {
          rq: "xhr"
      };
      l.cn = e || "";
      e = "" + ++k.j;
      d = new Tf(c || L, d || L);
      k.g[e] = d;
      l.eid = e;
      d = JSON.stringify(l);
      Uf(k, d)
  };
  w.ia = function (a, b, c, d, e) {
      var f = this.j;
      c = E(this.ha, this, e, c, d);
      f.l.call(f, b, a, e, c)
  };
  w.ha = function (a, b, c) {
      var d = this.g,
          e = {
              rq: "fpr"
          };
      e.cn = a;
      a = "" + ++d.j;
      b = new Tf(b || L, c || L);
      d.g[a] = b;
      e.eid = a;
      e = JSON.stringify(e);
      Uf(d, e)
  };

  function Vf(a) {
      switch (a) {
      case 0:
          return "DEBUG";
      case 1:
          return "INFO";
      case 2:
          return "WARNING";
      case 3:
          return "ERROR";
      default:
          throw Ud("Unknown Log Severity");
      }
  }

  function Rf(a, b, c, d, e) {
      e = new Gf(e[0]);
      var f = bf(e, Cf, 3);
      if (c && c != L && f)
          for (var g = df(f, Bf, 1), h = 0; h < g.length; ++h) {
              var k = "[Apps Script server";
              V(f, 2) && (k += " " + V(f, 2));
              if (ef(U(g[h], 2), 0)) {
                  var l = new Kf;
                  l.g.setTime(ef(U(g[h], 2), 0));
                  k += " " + l.N(!0)
              }
              k += "] ";
              k += Vf(U(g[h], 1)) + ": " + Te(U(g[h], 3));
              c(k)
          }
      if (void 0 !== bf(e, Ef, 2)) {
          c = bf(e, Ef, 2);
          a = Vd(V(c, 4) || "", V(c, 3) || "");
          a.stack = "";
          c = df(c, Df, 2);
          for (var n = 0; n < c.length; ++n) {
              var m = c[n];
              if (V(m, 1) || V(m, 3)) a.stack += " at ", V(m, 1) ? (a.stack += V(m, 1), V(m, 3) && (a.stack += " (" + V(m,
                  3) + ":" + (ef(Re(U(m, 2)), 0) || "unknown") + ")")) : a.stack += Te(U(m, 3)) + ":" + (ef(Re(U(m, 2)), 0) || "unknown"), V(m, 5) && (a.stack += " (" + V(m, 5), V(m, 6) && (a.stack += ":" + V(m, 6)), a.stack += ")"), V(m, 4) && (a.stack += " " + V(m, 4)), a.stack += "\n"
          }
          b(a, d)
      } else {
          try {
              m = bf(e, Ff, 1);
              var G = (n = Te(U(m, 2))) && JSON.parse(n);
              oe(G)
          } catch (r) {
              b(r, d);
              return
          }
          a(G, d)
      }
  }

  function Sf(a, b, c) {
      a(c, b)
  }
  w.ma = function (a, b, c) {
      var d = Array.prototype.slice.call(arguments, 2);
      ie(new he(ne), d, []);
      d = JSON.stringify({
          hfp: a,
          hfarg: d
      });
      Wf(this.g, d, b)
  };
  w.oa = function (a, b) {
      var c = JSON.stringify({
              hfp: a
          }),
          d = this.g,
          e = {
              rq: "xhh"
          };
      e.cn = c || "";
      b = new Tf(b || L, L);
      d.l[a] = b;
      e.eid = a;
      a = JSON.stringify(e);
      Uf(d, a)
  };
  w.la = function (a, b) {
      var c = Array.prototype.slice.call(arguments, 1);
      ie(new he(ne), c, []);
      c = JSON.stringify({
          hfp: a,
          hfarg: c
      });
      Wf(this.g, c, L)
  };

  function Xf() {}
  Xf.prototype.g = function () {};

  function Yf(a) {
      Q.call(this);
      this.j = a;
      this.g = {}
  }
  Ra(Yf, Q);
  var Zf = [];

  function $f(a) {
      Vb(a.g, function (b, c) {
          this.g.hasOwnProperty(c) && Od(b)
      }, a);
      a.g = {}
  }
  Yf.prototype.F = function () {
      Yf.M.F.call(this);
      $f(this)
  };
  Yf.prototype.handleEvent = function () {
      throw Error("EventHandler.handleEvent not implemented");
  };

  function ag(a, b) {
      this.name = a;
      this.value = b
  }
  ag.prototype.toString = ua("name");
  var bg = new ag("OFF", Infinity),
      cg = new ag("SEVERE", 1E3),
      dg = new ag("WARNING", 900),
      eg = new ag("INFO", 800),
      fg = new ag("CONFIG", 700),
      gg = new ag("FINE", 500),
      hg = new ag("FINER", 400);

  function ig() {}
  var jg;

  function kg(a, b, c) {
      this.reset(a || bg, b, c, void 0, void 0)
  }
  kg.prototype.reset = function () {};

  function lg(a, b) {
      this.g = null;
      this.l = [];
      this.h = (void 0 === b ? null : b) || null;
      this.j = [];
      this.i = {
          g: function () {
              return a
          }
      }
  }

  function mg(a) {
      if (a.g) return a.g;
      if (a.h) return mg(a.h);
      J("Root logger has no level set.");
      return bg
  }

  function ng(a, b) {
      for (; a;) a.l.forEach(function (c) {
          c(b)
      }), a = a.h
  }

  function og() {
      this.entries = {};
      var a = new lg("");
      a.g = fg;
      this.entries[""] = a
  }
  var pg;

  function qg(a, b) {
      var c = a.entries[b];
      if (c) return c;
      c = qg(a, b.slice(0, Math.max(b.lastIndexOf("."), 0)));
      var d = new lg(b, c);
      a.entries[b] = d;
      c.j.push(d);
      return d
  }

  function rg() {
      pg || (pg = new og);
      return pg
  }

  function Y(a, b, c) {
      var d;
      if (d = a)
          if (d = a && b) {
              d = b.value;
              var e = a ? mg(qg(rg(), a.g())) : bg;
              d = d >= e.value
          } d && (b = b || bg, d = qg(rg(), a.g()), typeof c === p && (c = c()), jg || (jg = new ig), a = new kg(b, c, a.g()), ng(d, a))
  }

  function sg(a, b) {
      a && Y(a, gg, b)
  };

  function tg(a) {
      this.h = this.u = this.i = "";
      this.B = null;
      this.l = this.g = "";
      this.j = !1;
      var b;
      a instanceof tg ? (this.j = a.j, ug(this, a.i), this.u = a.u, this.h = a.h, vg(this, a.B), this.g = a.g, wg(this, xg(a.o)), this.l = a.l) : a && (b = String(a).match(Lf)) ? (this.j = !1, ug(this, b[1] || "", !0), this.u = yg(b[2] || ""), this.h = yg(b[3] || "", !0), vg(this, b[4]), this.g = yg(b[5] || "", !0), wg(this, b[6] || "", !0), this.l = yg(b[7] || "")) : (this.j = !1, this.o = new zg(null, this.j))
  }
  tg.prototype.toString = function () {
      var a = [],
          b = this.i;
      b && a.push(Ag(b, Bg, !0), ":");
      var c = this.h;
      if (c || "file" == b) a.push("//"), (b = this.u) && a.push(Ag(b, Bg, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.B, null != c && a.push(":", String(c));
      if (c = this.g) this.h && "/" != c.charAt(0) && a.push("/"), a.push(Ag(c, "/" == c.charAt(0) ? Cg : Dg, !0));
      (c = this.o.toString()) && a.push("?", c);
      (c = this.l) && a.push("#", Ag(c, Eg));
      return a.join("")
  };
  tg.prototype.resolve = function (a) {
      var b = new tg(this),
          c = !!a.i;
      c ? ug(b, a.i) : c = !!a.u;
      c ? b.u = a.u : c = !!a.h;
      c ? b.h = a.h : c = null != a.B;
      var d = a.g;
      if (c) vg(b, a.B);
      else if (c = !!a.g) {
          if ("/" != d.charAt(0))
              if (this.h && !this.g) d = "/" + d;
              else {
                  var e = b.g.lastIndexOf("/"); - 1 != e && (d = b.g.slice(0, e + 1) + d)
              } e = d;
          if (".." == e || "." == e) d = "";
          else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
              d = 0 == e.lastIndexOf("/", 0);
              e = e.split("/");
              for (var f = [], g = 0; g < e.length;) {
                  var h = e[g++];
                  "." == h ? d && g == e.length && f.push("") : ".." == h ? ((1 < f.length || 1 == f.length &&
                      "" != f[0]) && f.pop(), d && g == e.length && f.push("")) : (f.push(h), d = !0)
              }
              d = f.join("/")
          } else d = e
      }
      c ? b.g = d : c = "" !== a.o.toString();
      c ? wg(b, xg(a.o)) : c = !!a.l;
      c && (b.l = a.l);
      return b
  };

  function ug(a, b, c) {
      a.i = c ? yg(b, !0) : b;
      a.i && (a.i = a.i.replace(/:$/, ""))
  }

  function vg(a, b) {
      if (b) {
          b = Number(b);
          if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
          a.B = b
      } else a.B = null
  }

  function wg(a, b, c) {
      b instanceof zg ? (a.o = b, Fg(a.o, a.j)) : (c || (b = Ag(b, Gg)), a.o = new zg(b, a.j))
  }

  function yg(a, b) {
      return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
  }

  function Ag(a, b, c) {
      return typeof a === v ? (a = encodeURI(a).replace(b, Hg), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
  }

  function Hg(a) {
      a = a.charCodeAt(0);
      return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
  }
  var Bg = /[#\/\?@]/g,
      Dg = /[#\?:]/g,
      Cg = /[#\?]/g,
      Gg = /[#\?@]/g,
      Eg = /#/g;

  function zg(a, b) {
      this.h = this.g = null;
      this.i = a || null;
      this.j = !!b
  }

  function Ig(a) {
      a.g || (a.g = new Map, a.h = 0, a.i && Mf(a.i, function (b, c) {
          a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
      }))
  }
  w = zg.prototype;
  w.add = function (a, b) {
      Ig(this);
      this.i = null;
      a = Jg(this, a);
      var c = this.g.get(a);
      c || this.g.set(a, c = []);
      c.push(b);
      this.h = bb(this.h) + 1;
      return this
  };

  function Kg(a, b) {
      Ig(a);
      b = Jg(a, b);
      a.g.has(b) && (a.i = null, a.h = bb(a.h) - a.g.get(b).length, a.g.delete(b))
  }

  function Lg(a, b) {
      Ig(a);
      b = Jg(a, b);
      return a.g.has(b)
  }
  w.forEach = function (a, b) {
      Ig(this);
      this.g.forEach(function (c, d) {
          c.forEach(function (e) {
              a.call(b, e, d, this)
          }, this)
      }, this)
  };
  w.X = function () {
      Ig(this);
      for (var a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [], d = 0; d < b.length; d++)
          for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
      return c
  };
  w.Y = function (a) {
      Ig(this);
      var b = [];
      if (typeof a === v) Lg(this, a) && (b = b.concat(this.g.get(Jg(this, a))));
      else {
          a = Array.from(this.g.values());
          for (var c = 0; c < a.length; c++) b = b.concat(a[c])
      }
      return b
  };
  w.set = function (a, b) {
      Ig(this);
      this.i = null;
      a = Jg(this, a);
      Lg(this, a) && (this.h = bb(this.h) - this.g.get(a).length);
      this.g.set(a, [b]);
      this.h = bb(this.h) + 1;
      return this
  };
  w.get = function (a, b) {
      if (!a) return b;
      a = this.Y(a);
      return 0 < a.length ? String(a[0]) : b
  };
  w.toString = function () {
      if (this.i) return this.i;
      if (!this.g) return "";
      for (var a = [], b = Array.from(this.g.keys()), c = 0; c < b.length; c++) {
          var d = b[c],
              e = encodeURIComponent(String(d));
          d = this.Y(d);
          for (var f = 0; f < d.length; f++) {
              var g = e;
              "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
              a.push(g)
          }
      }
      return this.i = a.join("&")
  };

  function xg(a) {
      var b = new zg;
      b.i = a.i;
      a.g && (b.g = new Map(a.g), b.h = a.h);
      return b
  }

  function Jg(a, b) {
      b = String(b);
      a.j && (b = b.toLowerCase());
      return b
  }

  function Fg(a, b) {
      b && !a.j && (Ig(a), a.i = null, a.g.forEach(function (c, d) {
          var e = d.toLowerCase();
          d != e && (Kg(this, d), Kg(this, e), 0 < c.length && (this.i = null, this.g.set(Jg(this, e), ib(c)), this.h = bb(this.h) + c.length))
      }, a));
      a.j = b
  };

  function Mg() {
      Qd.call(this);
      this.l = "closure_frame" + Ng++;
      this.j = [];
      Og[this.l] = this
  }
  Ra(Mg, Qd);
  var Og = {},
      Ng = 0;
  w = Mg.prototype;
  w.s = qg(rg(), "goog.net.IframeIo").i;
  w.v = null;
  w.D = null;
  w.L = null;
  w.ka = 0;
  w.H = !1;
  w.aa = null;
  w.Z = null;
  w.J = null;
  w.V = !1;
  w.abort = function () {
      if (this.H) {
          var a = this.s;
          a && Y(a, eg, "Request aborted");
          a = Pg(this);
          I(a);
          if (a)
              if (rd(a)) a.g && Ad(a.g);
              else if (a = Jd(a)) {
              var b = 0,
                  c;
              for (c in a.g)
                  for (var d = a.g[c].concat(), e = 0; e < d.length; ++e) Od(d[e]) && ++b
          }
          this.H = !1;
          Rd(this, "abort");
          Qg(this)
      }
  };
  w.F = function () {
      sg(this.s, "Disposing iframeIo instance");
      this.H && (sg(this.s, "Aborting active request"), this.abort());
      Mg.M.F.call(this);
      this.D && Rg(this);
      Sg(this);
      delete this.u;
      this.aa = this.Z = this.v = null;
      delete Og[this.l]
  };
  w.isActive = ua("H");
  w.W = function () {
      Nd(Pg(this), "load", this.W, !1, this);
      try {
          var a = this.D ? $c(Pg(this)) : null;
          sg(this.s, "Iframe loaded");
          this.H = !1;
          try {
              var b = a.body;
              this.Z = b.textContent || b.innerText
          } catch (e) {
              var c = 1
          }
          var d;
          c || typeof this.u != p || (d = this.u(a)) && (c = 4);
          Y(this.s, hg, "Last content: " + this.Z);
          Y(this.s, hg, "Last uri: " + this.aa);
          c ? (sg(this.s, "Load event occurred but failed"), Tg(this, c, d)) : (sg(this.s, "Load succeeded"), Rd(this, "complete"), Rd(this, "success"), Qg(this))
      } catch (e) {
          Tg(this, 1)
      }
  };

  function Tg(a, b, c) {
      a.B || (a.H = !1, 4 == b && I(void 0 !== c), Rd(a, "complete"), Rd(a, "error"), Qg(a), a.B = !0)
  }

  function Qg(a) {
      var b = a.s;
      b && Y(b, eg, "Ready for new requests");
      Rg(a);
      Sg(a);
      a.v = null;
      Rd(a, "ready")
  }

  function Rg(a) {
      var b = a.D;
      b && (b.onreadystatechange = null, b.onload = null, b.onerror = null, a.j.push(b));
      a.J && (A.clearTimeout(a.J), a.J = null);
      Lb ? a.J = Td(a.ca, 2E3, a) : a.ca();
      a.D = null;
      a.L = null
  }
  w.ca = function () {
      this.J && (A.clearTimeout(this.J), this.J = null);
      for (; 0 != this.j.length;) {
          var a = this.j.pop(),
              b = this.s;
          b && Y(b, eg, "Disposing iframe");
          a && a.parentNode && a.parentNode.removeChild(a)
      }
  };

  function Sg(a) {
      a.v && void 0 == a.v && Zc(a.v)
  }

  function Pg(a) {
      return a.D ? $c(a.D).getElementById(a.L + "_inner") : null
  }
  w.ga = function () {
      if (this.H) {
          var a = this.D ? $c(Pg(this)) : null;
          a && !Hb(a, "documentUri") ? (this.V || Nd(Pg(this), "load", this.W, !1, this), navigator.onLine ? ((a = this.s) && Y(a, dg, "Silent Firefox error detected"), Tg(this, 3)) : ((a = this.s) && Y(a, dg, "Firefox is offline so report offline error instead of silent error"), Tg(this, 9))) : Td(this.ga, 250, this)
      }
  };

  function Ug(a, b) {
      Q.call(this);
      this.o = a;
      this.j = b;
      this.g = new Xf;
      this.u = E(this.g.g, this.g)
  }
  y(Ug, Q);
  Ug.prototype.l = function (a, b, c, d) {
      for (var e = a.action, f = a.method, g = a.enctype, h = a.target, k = a.onsubmit, l = a.submit, n = a.elements, m = 0; m < n.length; ++m) n[m].name = "_" + m + "_" + n[m].name;
      m = this.j.slice(0);
      if (void 0 !== c)
          for (var G in c) jb(m, [G, c[G]]);
      null != b && "" != b && jb(m, ["func", b]);
      b = Pf(this.o + "/postform", m);
      a.action = b;
      a.method = "post";
      a.enctype = "multipart/form-data";
      a.onsubmit = null;
      b = I(Uc("example_form"));
      a.submit = b.submit;
      try {
          var r = new Mg;
          r.V = !0;
          if (r.H) throw Error("[goog.net.IframeIo] Unable to send, already active.");
          var Z = new tg(a.action),
              vb = r.s;
          vb && Y(vb, eg, "Sending iframe request from form: " + Z);
          r.aa = Z;
          r.v = a;
          Nc(I(r.v), Z.toString());
          r.H = !0;
          sg(r.s, "Creating iframe");
          r.L = r.l + "_" + (r.ka++).toString(36);
          r.D = Rc(r.v).h("IFRAME", {
              name: r.L,
              id: r.L
          });
          Jb && 7 > Number(Sb) && Nc(r.D, jc(bc(new N($b, 'javascript:""'))));
          var ha = r.D.style;
          ha.visibility = "hidden";
          ha.width = ha.height = "10px";
          ha.display = "none";
          Mb ? ha.marginTop = ha.marginLeft = "-10px" : (ha.position = "absolute", ha.top = ha.left = "-10px");
          sg(r.s, "Setting up iframes and cloning form");
          Rc(r.v).g.body.appendChild(r.D);
          var Sa = r.L + "_inner",
              Ba = $c(r.D);
          if (document.baseURI) {
              var pf = Oc(Sa);
              var qf = Mc(new N($b, "Short HTML snippet, input escaped, safe URL, for performance"), '<head><base href="' + Oc(document.baseURI) + '"></head><body><iframe id="' + pf + '" name="' + pf + '"></iframe>')
          } else {
              var rf = Oc(Sa);
              qf = Mc(new N($b, "Short HTML snippet, input escaped, for performance"), '<body><iframe id="' + rf + '" name="' + rf + '"></iframe>')
          }
          Ba.write(Cc(qf));
          r.V || Ed(Ba.getElementById(Sa), "load", r.W, !1, r);
          var aa = Vc("TEXTAREA",
              I(r.v));
          Z = 0;
          for (var Ta = aa.length; Z < Ta; Z++) {
              var Ua = aa[Z].value;
              vb = [];
              cd(aa[Z], vb, !1);
              if (vb.join("") != Ua) {
                  var H = aa[Z];
                  I(null != H, "goog.dom.setTextContent expects a non-null value for node");
                  if ("textContent" in H) H.textContent = Ua;
                  else if (3 == H.nodeType) H.data = String(Ua);
                  else if (H.firstChild && 3 == H.firstChild.nodeType) {
                      for (; H.lastChild != H.firstChild;) H.removeChild(I(H.lastChild));
                      H.firstChild.data = String(Ua)
                  } else {
                      Zc(H);
                      var $g = Tc(H);
                      H.appendChild($g.createTextNode(String(Ua)))
                  }
                  aa[Z].value = Ua
              }
          }
          var O = Ba.importNode(I(r.v),
              !0);
          O.target = Sa;
          O.action = r.v.action;
          Ba.body.appendChild(O);
          var pa = Vc("SELECT", I(r.v)),
              ah = Vc("SELECT", O);
          aa = 0;
          for (var bh = pa.length; aa < bh; aa++) {
              var sf = Vc("OPTION", pa[aa]),
                  ch = Vc("OPTION", ah[aa]);
              Ta = 0;
              for (var dh = sf.length; Ta < dh; Ta++) ch[Ta].selected = sf[Ta].selected
          }
          var Ca = Vc("INPUT", I(r.v)),
              vd = Vc("INPUT", O);
          pa = 0;
          for (var qa = Ca.length; pa < qa; pa++)
              if ("file" == Ca[pa].type && Ca[pa].value != vd[pa].value) {
                  sg(r.s, "File input value not cloned properly.  Will submit using original form.");
                  r.v.target = Sa;
                  O = r.v;
                  break
              } sg(r.s,
              "Submitting form");
          try {
              r.B = !1, O.submit(), Ba.close(), Lb && Td(r.ga, 250, r)
          } catch (eh) {
              var tf = r.s;
              try {
                  var wb = dd(eh);
                  var t = wb.fileName;
                  null == t && (t = "");
                  if (/^https?:\/\//i.test(t)) {
                      var B = ic(t) || mc,
                          Va = new N($b, "view-source scheme plus HTTP/HTTPS URL"),
                          xb = "view-source:" + fc(B);
                      cb(bc(Va), la);
                      I(!/^[\s\xa0]*$/.test(bc(Va)), ma);
                      var ia = jc(xb)
                  } else ia = jc(bc(new N($b, "sanitizedviewsrc")));
                  var fh = Fc("Message: " + wb.message + "\nUrl: ");
                  O = {
                      href: ia,
                      target: "_new"
                  };
                  var Da = wb.fileName;
                  if (!Jc.test("a")) throw Error("Invalid tag name <a>.");
                  if ("A" in Lc) throw Error("Tag name <a> is not allowed for SafeHtml.");
                  Ca = "";
                  if (O)
                      for (var yb in O)
                          if (Object.prototype.hasOwnProperty.call(O, yb)) {
                              if (!Jc.test(yb)) throw Error('Invalid attribute name "' + yb + '".');
                              var uf = O[yb];
                              if (null != uf) {
                                  vd = Ca;
                                  qa = B = void 0;
                                  ia = yb;
                                  t = uf;
                                  if (t instanceof N) t = bc(t);
                                  else if ("style" == ia.toLowerCase()) {
                                      B = t;
                                      if (!D(B)) throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof B + " given: " + B);
                                      if (!(B instanceof oc)) {
                                          Va = B;
                                          xb = "";
                                          for (qa in Va)
                                              if (Object.prototype.hasOwnProperty.call(Va,
                                                      qa)) {
                                                  if (!/^[-_a-zA-Z0-9]+$/.test(qa)) throw Error("Name allows only [-_a-zA-Z0-9], got: " + qa);
                                                  var Wa = Va[qa];
                                                  null != Wa && (Wa = Array.isArray(Wa) ? Wa.map(qc).join(" ") : qc(Wa), xb += qa + ":" + Wa + ";")
                                              } B = xb ? new oc(xb, nc) : pc
                                      }
                                      B instanceof oc && B.constructor === oc ? t = B.g : (J("expected object of type SafeStyle, got '" + B + ba + C(B)), t = "type_error:SafeStyle")
                                  } else {
                                      if (/^on/i.test(ia)) throw Error('Attribute "' + ia + '" requires goog.string.Const value, "' + t + '" given.');
                                      if (ia.toLowerCase() in Kc)
                                          if (t instanceof cc) t instanceof cc &&
                                              t.constructor === cc ? B = t.g : (J("expected object of type TrustedResourceUrl, got '" + t + ba + C(t)), B = "type_error:TrustedResourceUrl"), t = B.toString();
                                          else if (t instanceof P) t = fc(t);
                                      else if (typeof t === v) t = (ic(t) || mc).C();
                                      else throw Error('Attribute "' + ia + '" on tag "a" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + t + '" given.');
                                  }
                                  t.G && (t = t.C());
                                  I(typeof t === v || typeof t === q, "String or number value expected, got " + typeof t + " with value: " + t);
                                  var gh = ia + '="' + ob(String(t)) + '"';
                                  Ca = vd + (" " + gh)
                              }
                          } var wd =
                      "<a" + Ca;
                  null == Da ? Da = [] : Array.isArray(Da) || (Da = [Da]);
                  if (!0 === Yb.a) I(!Da.length, "Void tag <a> does not allow content."), wd += ">";
                  else {
                      var hh = Ic(Da);
                      wd += ">" + Cc(hh).toString() + "</a>"
                  }
                  var ih = Ec(wd);
                  var vf = Ic(fh, ih, Fc("\nLine: " + wb.lineNumber + "\n\nBrowser stack:\n" + wb.stack + "-> [end]\n\nJS stack traversal:\n" + hd(void 0) + "-> "))
              } catch (jh) {
                  vf = Fc("Exception trying to expose exception! You win, we lose. " + jh)
              }
              var kh = Cc(vf).toString();
              tf && Y(tf, cg, "Error when submitting form: " + kh);
              r.V || Nd(Ba.getElementById(Sa),
                  "load", r.W, !1, r);
              Ba.close();
              Tg(r, 2)
          }
          Fd(Pg(r), "load", F(Vg, this.u, d, r))
      } finally {
          for (a.action = e, a.method = f, a.enctype = g, a.target = h, a.onsubmit = k, a.submit = l, m = 0; m < n.length; ++m) n[m].name = n[m].name.replace("_" + m + "_", "")
      }
  };

  function Vg(a, b, c) {
      a();
      b();
      c.T()
  };

  function Wg(a, b, c, d, e, f, g, h) {
      Q.call(this);
      this.R = b;
      this.B = c;
      this.o = d;
      this.l = e;
      this.j = f;
      this.g = g;
      this.u = h
  }
  y(Wg, Q);

  function Xg(a, b, c) {
      Q.call(this);
      this.u = b;
      this.o = c;
      this.j = 0;
      this.g = {};
      this.l = {};
      b = new Yf(this);
      c = F(ld, b);
      this.i ? c() : (this.h || (this.h = []), this.h.push(c));
      c = this.R;
      var d = "message";
      Array.isArray(d) || (d && (Zf[0] = d.toString()), d = Zf);
      for (var e = 0; e < d.length; e++) {
          var f = Ed(a, d[e], c || b.handleEvent, !1, b.j || b);
          if (!f) break;
          b.g[f.key] = f
      }
  }
  y(Xg, Q);

  function Wf(a, b, c) {
      var d = {
          rq: "xhh"
      };
      d.cn = b || "";
      b = "" + ++a.j;
      c = new Tf(c || L, L);
      a.g[b] = c;
      d.eid = b;
      d = JSON.stringify(d);
      Uf(a, d)
  }

  function Uf(a, b) {
      a.u.postMessage(b, a.o)
  }
  Xg.prototype.R = function (a) {
      a = a.h;
      var b;
      if (b = pe(a)) {
          b = this.o;
          var c = a.origin;
          c != b ? (console.log("dropping postMessage.. was from host " + c + " but expected host " + b), b = !1) : b = !0
      }
      if (b) {
          a = a.data;
          b = null;
          try {
              b = JSON.parse(a)
          } catch (e) {
              return
          }
          if (0 <= ["xhrr", "postr", "fprr", "xhhr"].indexOf(b.rq)) {
              c = b.eid;
              a = (a = M(this.g, c)) ? a : M(this.l, c);
              var d = this.g;
              c in d && delete d[c];
              b.sucr ? (b = b.sucr, (0, a.fa)(b)) : b.failr && (b = b.failr, (0, a.da)(b))
          }
      }
  };
  Xg.prototype.F = function () {
      Q.prototype.F.call(this);
      delete this.u;
      Vb(this.g, this.B, this);
      delete this.g
  };
  Xg.prototype.B = function (a) {
      a.T()
  };

  function Tf(a, b) {
      Q.call(this);
      this.fa = a;
      this.da = b
  }
  y(Tf, Q);
  Tf.prototype.F = function () {
      Q.prototype.F.call(this);
      delete this.fa;
      delete this.da
  };
  /*

   SPDX-License-Identifier: Apache-2.0
  */
  var Yg = [];

  function Zg(a) {
      var b = qg(rg(), "safevalues").i;
      b && Y(b, dg, "A URL with content '" + a + "' was sanitized away.")
  } - 1 === Yg.indexOf(Zg) && Yg.push(Zg);
  var lh = !1;

  function mh(a, b) {
      var c = b.h;
      if (pe(c)) {
          b = c.origin;
          var d = (d = b.match(Lf)[3] || null) ? decodeURI(d) : d;
          var e;
          if (e = !!d) d = d.toLowerCase(), e = d.length - 11, e = 0 <= e && d.indexOf(".google.com", e) == e;
          if (d = e)(a = !a) || (a = b.match(Lf)[1] || null, a = !!a && "https" == a.toLowerCase()), d = a;
          if (d) {
              a = c.data;
              try {
                  var f = JSON.parse(a);
                  var g = f ? new Wg(M(f, "sh"), M(f, "uh"), M(f, "sfns"), M(f, "hfns"), M(f, "cspns"), M(f, "apre"), M(f, "aparm"), M(f, "ift")) : null
              } catch (n) {
                  console.log("dropping postMessage.. deserialize threw error.");
                  return
              }
              if (!g) console.log("dropping postMessage.. data was missing.");
              else if (!lh) {
                  lh = !0;
                  f = I(Uc("userHtmlFrame"));
                  a = f.contentWindow;
                  var h = I(c.source);
                  d = g.R;
                  c = g.u;
                  e = g.B;
                  var k = g.o,
                      l = g.l;
                  g = new Ug(g.j, g.g);
                  b = new Xg(window, h, b);
                  Ma("maeExportApis_", F(nh, ze(b, g), e, k, l, a));
                  a.document.open();
                  b = a.document;
                  g = '<!doctype html><script src="//www.google.com/jsapi">\x3c/script><script>window.parent.maeExportApis_();\x3c/script>' + d;
                  g = null === g ? na : void 0 === g ? "undefined" : g;
                  if (typeof g !== v) throw Error("Expected a string");
                  g = Ec(g);
                  b.write(Cc(g));
                  a.document.close();
                  f.title = c
              }
          } else console.log("posting uri is not valid: " +
              b)
      }
  }

  function nh(a, b, c, d, e) {
      b = ye(a, b);
      Ma("google.script.run", b, e);
      for (b = 0; b < c.length; ++b) {
          var f = c[b],
              g = f.hfp;
          f = f.hft;
          var h = E(F(a.la, g), a);
          h = qe(h, 2);
          "hftr" === f ? (h = E(F(a.ma, g), a), h = qe(h, 64)) : "hftc" === f && (h = E(F(a.oa, g), a), h = qe(h, 64));
          Ma(g, h, e)
      }
      for (var k in d) Ma(k, d[k], e)
  }
  Ma("maeInit_", function (a) {
      Ed(window, "message", F(mh, a))
  });
})()