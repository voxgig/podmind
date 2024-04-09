/*! reef v13.0.2 | (c) 2023 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/reef */
function e(e2, t2, n2 = document) {
  let i2 = new CustomEvent(`reef:${e2}`, { bubbles: true, cancelable: true, detail: t2 });
  return n2.dispatchEvent(i2);
}
function t(e2) {
  return "string" == typeof e2 ? document.querySelector(e2) : e2;
}
function n(e2) {
  return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
}
function i(t2, r2) {
  let o2 = "signal" + (t2 ? `-${t2}` : "");
  return { get: (e2, r3) => "_isSignal" === r3 || (["object", "array"].includes(n(e2[r3])) && !e2[r3]._isSignal && (e2[r3] = new Proxy(e2[r3], i(t2))), e2[r3]), set: (t3, n2, i2) => (t3[n2] === i2 || (t3[n2] = i2, e(o2, { prop: n2, value: i2, action: "set" })), true), deleteProperty: (t3, n2) => (delete t3[n2], e(o2, { prop: n2, value: t3[n2], action: "delete" }), true) };
}
function r(e2 = {}, t2 = "") {
  return e2 = ["array", "object"].includes(n(e2)) ? e2 : { value: e2 }, new Proxy(e2, i(t2));
}
class o {
  constructor(t2, n2, i2 = "") {
    let r2 = "signal" + (i2 ? `-${i2}` : "");
    Object.defineProperties(this, { value: { get: () => structuredClone(t2), set: () => true } });
    for (let i3 in n2)
      "function" == typeof n2[i3] && (this[i3] = function(...o2) {
        n2[i3](t2, ...o2), e(r2, t2);
      });
  }
}
function l(e2 = {}, t2 = {}, n2 = "") {
  return new o(e2, t2, n2);
}
let s, u = ["input", "option", "textarea"], c = ["value", "checked", "selected"], d = ["checked", "selected"];
function a(e2) {
  return ["false", "null", "undefined", "0", "-0", "NaN", "0n", "-0n"].includes(e2);
}
function f(e2, t2, n2, i2) {
  if (!t2.startsWith("on") || !i2)
    return;
  if (e2[t2])
    return;
  let r2 = i2[n2.split("(")[0]];
  r2 && (e2[t2] = r2);
}
function h(e2, t2) {
  let n2 = t2.replace(/\s+/g, "").toLowerCase();
  return !(!["src", "href", "xlink:href"].includes(e2) || !n2.includes("javascript:") && !n2.includes("data:text/html")) || (!!(e2.startsWith("on") || e2.startsWith("@on") || e2.startsWith("#on")) || void 0);
}
function m(e2, t2, n2, i2) {
  f(e2, t2, n2, i2), h(t2, n2) || (c.includes(t2) && (e2[t2] = "value" === t2 ? n2 : " "), e2.setAttribute(t2, n2));
}
function g(e2, t2) {
  c.includes(t2) && (e2[t2] = ""), e2.removeAttribute(t2);
}
function p(e2, t2) {
  if (1 === e2.nodeType) {
    for (let { name: n2, value: i2 } of e2.attributes) {
      if (h(n2, i2)) {
        g(e2, n2), f(e2, n2, i2, t2);
        continue;
      }
      if (!n2.startsWith("@") && !n2.startsWith("#"))
        continue;
      let r2 = n2.slice(1);
      g(e2, n2), d.includes(r2) && a(i2) || m(e2, r2, i2, t2);
    }
    if (e2.childNodes)
      for (let n2 of e2.childNodes)
        p(n2, t2);
  }
}
function b(e2) {
  return e2.childNodes && e2.childNodes.length ? null : e2.textContent;
}
function y(e2, t2, n2) {
  let i2 = e2.childNodes, r2 = t2.childNodes;
  (function(e3) {
    let t3 = e3.querySelectorAll("script");
    for (let e4 of t3)
      e4.remove();
  })(e2) || (i2.forEach(function(e3, o2) {
    if (!r2[o2]) {
      let i3 = e3.cloneNode(true);
      return p(i3, n2), void t2.append(i3);
    }
    if (l2 = e3, s2 = r2[o2], "number" == typeof l2.nodeType && l2.nodeType !== s2.nodeType || "string" == typeof l2.tagName && l2.tagName !== s2.tagName || "string" == typeof l2.id && l2.id && l2.id !== s2.id || "getAttribute" in l2 && "getAttribute" in s2 && l2.getAttribute("key") !== s2.getAttribute("key") || "string" == typeof l2.src && l2.src && l2.src !== s2.src) {
      let i3 = function(e4, t3) {
        if (1 !== e4.nodeType)
          return;
        let n3 = e4.getAttribute("id"), i4 = e4.getAttribute("key");
        if (!n3 || !i4)
          return;
        let r3 = n3 ? `#${n3}` : `[key="${i4}"]`;
        return t3.querySelector(`:scope > ${r3}`);
      }(e3, t2);
      if (!i3) {
        let t3 = e3.cloneNode(true);
        return p(t3, n2), void r2[o2].before(t3);
      }
      r2[o2].before(i3);
    }
    var l2, s2;
    if (i2[o2] && "hasAttribute" in i2[o2] && i2[o2].hasAttribute("reef-ignore"))
      return;
    if (function(e4, t3, n3) {
      if (1 !== e4.nodeType)
        return;
      let i3 = e4.attributes, r3 = t3.attributes;
      for (let { name: r4, value: o3 } of i3) {
        if (r4.startsWith("#"))
          continue;
        if (c.includes(r4) && u.includes(e4.tagName.toLowerCase()))
          continue;
        let i4 = r4.startsWith("@") ? r4.slice(1) : r4;
        d.includes(i4) && a(o3) ? g(t3, i4) : m(t3, i4, o3, n3);
      }
      for (let { name: e5, value: n4 } of r3)
        i3[e5] || c.includes(e5) && u.includes(t3.tagName.toLowerCase()) || g(t3, e5);
    }(e3, r2[o2], n2), e3.nodeName.includes("-"))
      return;
    let f2 = b(e3);
    if (f2 && f2 !== b(r2[o2]) && (r2[o2].textContent = f2), e3.childNodes.length || !r2[o2].childNodes.length) {
      if (!r2[o2].childNodes.length && e3.childNodes.length) {
        let t3 = document.createDocumentFragment();
        return y(e3, t3, n2), void r2[o2].appendChild(t3);
      }
      e3.childNodes.length && y(e3, r2[o2], n2);
    } else
      r2[o2].innerHTML = "";
  }), function(e3, t3) {
    let n3 = e3.length - t3.length;
    if (!(n3 < 1))
      for (; n3 > 0; n3--)
        e3[e3.length - 1].remove();
  }(r2, i2));
}
function v(n2, i2, r2) {
  let o2 = t(n2), l2 = function(e2) {
    let t2 = new DOMParser().parseFromString(`<body><template>${e2}</template></body>`, "text/html");
    return t2.body ? t2.body.firstElementChild.content : document.createElement("body");
  }(i2);
  e("before-render", null, o2) && (y(l2, o2, r2), e("render", null, o2));
}
class N {
  constructor(e2, t2, n2) {
    var i2;
    this.elem = e2, this.template = t2, this.signals = n2.signals ? n2.signals.map((e3) => `reef:signal-${e3}`) : ["reef:signal"], this.events = n2.events, this.handler = (i2 = this, function(e3) {
      i2.render();
    }), this.debounce = null, this.start();
  }
  start() {
    for (let e2 of this.signals)
      document.addEventListener(e2, this.handler);
    this.render(), e("start", null, t(this.elem));
  }
  stop() {
    for (let e2 of this.signals)
      document.removeEventListener(e2, this.handler);
    e("stop", null, t(this.elem));
  }
  render() {
    let e2 = this;
    e2.debounce && window.cancelAnimationFrame(e2.debounce), e2.debounce = window.requestAnimationFrame(function() {
      v(e2.elem, e2.template(), e2.events);
    });
  }
}
function w(e2, t2, n2 = {}) {
  return new N(e2, t2, n2);
}
function A() {
  setTimeout(function() {
    let e2 = document.querySelector(s);
    s = null, e2 && (e2.focus(), document.activeElement !== e2 && (e2.setAttribute("tabindex", -1), e2.focus()));
  }, 1);
}
function x(e2) {
  e2 && "string" == typeof e2 && (s = e2, document.addEventListener("reef:render", A, { once: true }));
}
const CSS = "\n.voxgig-podmind-ask {\n    color: red;\n}\n";
const NAME = "voxgig-podmind-ask";
function debug(...args) {
  console.log(NAME, ...args);
}
class VoxgigPodmindAsk extends HTMLElement {
  constructor() {
    super();
    debug("START");
    this.uuid = crypto.randomUUID();
    this.store = {
      todolist: r(["one", "two"], this.uuid)
    };
  }
  connectedCallback() {
    debug("CONNECT");
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.innerHTML = CSS;
    this.shadowRoot.appendChild(style);
    const elem = document.createElement("div");
    this.shadowRoot.appendChild(elem);
    this.main(elem);
  }
  main(elem) {
    const self = this;
    const events = {
      add: function(ev) {
        console.log("EVENT add", ev);
        const inputElem = self.shadowRoot.getElementById("tododesc");
        self.store.todolist.push(inputElem.value);
      }
    };
    function Main() {
      return `<div>
        <h1 class="voxgig-podmind-ask">TODO</h1>
        <input id="tododesc" />
        <button onclick="add()">add</button>
        ${TodoList()}
      </div>`;
    }
    function TodoList() {
      return `<ul>
        ${self.store.todolist.map((entry) => `<li>
        ${entry}
        </li>`).join("")}
      </ul>`;
    }
    w(elem, Main, {
      signals: [this.uuid],
      events
    });
  }
}
customElements.define("voxgig-podmind-ask", VoxgigPodmindAsk);
