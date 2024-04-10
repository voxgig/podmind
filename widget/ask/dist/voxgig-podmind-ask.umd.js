(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

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
  const CSS = "\n/* https://www.joshwcomeau.com/css/custom-css-reset/ */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\nbody {\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\nimg, picture, video, canvas, svg {\n  x-display: block;\n  max-width: 100%;\n}\ninput, button, textarea, select {\n  font: inherit;\n}\np, h1, h2, h3, h4, h5, h6 {\n  overflow-wrap: break-word;\n}\n/*\n* {\n  margin: 0;\n}\n:host {\n  isolation: isolate;\n}\n*/\n\n\n.voxgig-podmind {\n    --vxg-c0l: #f2307a;\n    --vxg-c0d: #CE0246;\n\n    --vxg-c2l: #F6F4F9;\n    --vxg-c2d: #BAB8BC;\n\n    --vxg-c3d: #089EA5;\n    --vxg-c3m: #00C6D8;\n    --vxg-c3l: #11E5EF;\n\n    --vxg-c4l: #0796D6;\n    --vxg-c4d: #066189;\n\n\n    \n    width: 80%;\n    margin: 5% auto;\n    border: 1px solid var(--vxg-c2d);\n    border-radius: 16px;\n    padding: 16px;\n    background-color: var(--vxg-c2l);\n    font-family: tahoma;\n}\n\n.voxgig-podmind h3 {\n    margin-top: 0;\n    color: var(--vxg-c0d);\n}\n\n.voxgig-podmind form {\n    margin: 0;\n    display: flex;\n    font-family: tahoma;\n}\n\n.voxgig-podmind input {\n    padding: 8px;\n    border-radius: 8px;\n    font-size: 24px;\n    display: block;\n    flex-grow:2;\n    margin-right: 16px;\n    border: 1px solid var(--vxg-c4d);\n    background-color: var(--vxg-c3d);\n    color: var(--vxg-c2l);\n    font-family: andale mono;\n}\n\n.voxgig-podmind .thinking input {\n    animation: thinking 2s infinite;\n    background: linear-gradient(to right, var(--vxg-c3d),var(--vxg-c2d), var(--vxg-c3d));\n    background-size: 200% 100%;\n}\n\n.voxgig-podmind button {\n    font-family: tahoma;\n    padding: 8px;\n    border-radius: 8px;\n    font-size: 24px;\n    display: block;\n    border: 3px solid var(--vxg-c4d);\n    color: var(--vxg-c4d);\n    background-color: var(--vxg-c2l);\n}\n\n.voxgig-podmind button:hover {\n    cursor: pointer;\n    background-color: var(--vxg-c4l);\n    color: var(--vxg-c2l);\n}\n\n.voxgig-podmind button:active {\n    cursor: pointer;\n    background-color: var(--vxg-c2l);\n    color: var(--vxg-c4l);\n}\n\n\n.voxgig-podmind .audio button {\n    margin-right: 4px;\n    font-size: 16px;\n    font-weight: bold;\n    line-height: 20px;\n    padding: 2px;\n    width: 28px;\n    border: 1px solid var(--vxg-c4d);\n    border-radius: 4px;\n}\n\n@keyframes pulse {\n    0% { opacity: 90%; transform: scale(1); }\n    50% { opacity: 100%; transform: scale(1.2); }\n    100% { opacity: 90%; transform: scale(1); }\n}\n\n.sound-symbol {\n    display: inline-block;\n    font-size: 20px;\n    opacity: 0%;\n}\n\n.sound-symbol-playing {\n    animation: pulse 1s infinite;\n}\n\n@keyframes thinking {\n    0% {\n        background-position: 100% 0;\n    }\n    50% {\n        background-position: 0 0;\n    }\n    100% {\n        background-position: 100% 0;\n    }\n\n}\n";
  var define_import_meta_env_default = { BASE_URL: "/", MODE: "production", DEV: false, PROD: true, SSR: false };
  const ENDPOINT = define_import_meta_env_default.VOXGIG_PODMIND_ENDPOINT || "https://podmind-dev.voxgig.com/api/public/widget";
  const SpanElem = document.createElement("span");
  const util = {
    each: (list, build) => list.map(build).join(""),
    findAudioElems: (root, hit, index) => {
      const audio_id = "#audio-" + hit.episode_id + "-" + index;
      const playing_id = "#playing-" + hit.episode_id + "-" + index;
      const audio_elem = root.querySelector(audio_id);
      const playing_elem = root.querySelector(playing_id);
      return {
        audio: audio_elem,
        playing: playing_elem
      };
    },
    groupByEpisode: (hits) => {
      let repeats = {};
      let episodeMap = hits.reduce((a2, hit) => {
        if (repeats[hit.guest]) {
          if (hit.episode_id !== repeats[hit.guest]) {
            return a2;
          }
        } else {
          repeats[hit.guest] = hit.episode_id;
        }
        const hits2 = (a2[hit.episode_id] = a2[hit.episode_id] || __spreadProps(__spreadValues({}, hit), {
          hits: []
        })).hits;
        if (hits2.length < 3) {
          hits2.push(hit);
        }
        return a2;
      }, {});
      return Object.values(episodeMap);
    },
    minsec: (secs) => {
      return (secs / 60 | 0) + "m " + (secs % 60 | 0) + "s";
    },
    fetchAnswer(spec) {
      return __async(this, null, function* () {
        const { query, apikey, mark } = spec;
        const vxghdr = apikey + ";" + mark + ";" + (/* @__PURE__ */ new Date()).toString();
        let res = yield fetch(ENDPOINT, {
          method: "POST",
          body: JSON.stringify({
            aim: "req",
            on: "widget",
            chat: "query",
            query
          }),
          headers: {
            "content-type": "application/json",
            "voxgig-podmind-widget": vxghdr
          }
        });
        let json = yield res.json();
        let answer = json.answer || "";
        answer = answer.split(/\n/);
        let hits = json.hits;
        let episodes = util.groupByEpisode(hits);
        return util.EH({
          answer,
          episodes
        });
      });
    },
    EH: function EH2(o2) {
      let t2 = typeof o2;
      if ("object" === typeof o2 && null != o2) {
        if (Array.isArray(o2)) {
          return o2.map((n2) => EH2(n2));
        }
        let ts;
        if ("function" === typeof o2.toString) {
          ts = o2.toString();
        }
        if ("[object Object]" !== ts) {
          return EH2(ts);
        }
        for (let p2 in o2) {
          o2[p2] = EH2(o2[p2]);
        }
        return o2;
      } else if ("string" === t2) {
        SpanElem.textContent = "" + o2;
        return SpanElem.innerHTML;
      }
      return o2;
    }
  };
  const NAME = "voxgig-podmind-ask";
  const { each, EH } = util;
  const makeDebug = (self) => self.config.debug ? (...args) => console.log(NAME, self.config.mark, ...args) : () => void 0;
  class VoxgigPodmindAsk extends HTMLElement {
    constructor(...args) {
      super();
      const self = this;
      self.config = {
        apikey: this.getAttribute("apikey"),
        mark: this.getAttribute("mark") || Math.round(Math.random() * 1e16).toString(16).substring(0, 8),
        debug: "true" === this.getAttribute("debug")
      };
      self.debug = makeDebug(this);
      self.debug("START");
      self.store = {
        result: r({ answer: [], episodes: [] }, this.config.mark),
        thinking: r(false, this.config.mark)
      };
    }
    connectedCallback() {
      const self = this;
      self.debug("CONNECT");
      self.shadow = self.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.innerHTML = CSS;
      self.shadowRoot.appendChild(style);
      const elem = document.createElement("div");
      self.shadowRoot.appendChild(elem);
      self.main(elem);
    }
    qs(...args) {
      return this.shadowRoot.querySelector(...args);
    }
    main(elem) {
      const self = this;
      const S = self.store;
      const events = {
        submitFormQuery: function(ev) {
          return __async(this, null, function* () {
            try {
              ev.preventDefault();
              S.thinking.value = true;
              const formElem = self.qs("#query-form");
              const data = new FormData(formElem);
              const query = data.get("query");
              self.debug("QUERY", query);
              const result = yield util.fetchAnswer({
                query,
                apikey: self.config.apikey,
                mark: self.config.mark
              });
              self.debug("RESULT", query, result);
              S.result = result;
            } finally {
              S.thinking.value = false;
            }
          });
        },
        playAudio(ev) {
          const episodeIndex = +ev.target.getAttribute("data-episode");
          const hitIndex = +ev.target.getAttribute("data-hit");
          const hit = S.result.episodes[episodeIndex].hits[hitIndex];
          const { audio, playing } = util.findAudioElems(self.shadowRoot, hit, hitIndex);
          audio.currentTime = hit.bgn;
          audio.play();
          playing.classList.add("sound-symbol-playing");
        },
        stopAudio(ev) {
          const episodeIndex = +ev.target.getAttribute("data-episode");
          const hitIndex = +ev.target.getAttribute("data-hit");
          const hit = S.result.episodes[episodeIndex].hits[hitIndex];
          const { audio, playing } = util.findAudioElems(self.shadowRoot, hit, hitIndex);
          audio.pause();
          playing.classList.remove("sound-symbol-playing");
        }
      };
      function Main() {
        return `<div class="voxgig-podmind">
      <h3>Ask our podcast guests a question about developer relations!</h3>
      <p>You'll get a summary and relevant extracts (audio+text) from our discussions, as well as links with more information about our guests.</p>

      ${part.Form(self, S)}
      ${part.Powered(self, S)}
      ${part.Result(self, S)}
      `;
      }
      w(elem, Main, {
        signals: [this.config.mark],
        events
      });
    }
  }
  const part = {
    Form(self, S) {
      return `<form
        id="query-form"
        onsubmit="submitFormQuery()"
        class="${S.thinking.value ? "thinking" : ""}"
      >
      <input
        name="query"
        type="text"
      />
      <button
        ${S.thinking.value ? "disabled" : ""}
      >Ask</button>
    </form>`;
    },
    Result(self, S) {
      return 0 === S.result.answer.length ? "" : `<div>
         <h4>Summary</h4>
         ${S.result.answer.map(
        (p2) => `<p>${p2}</p>`
      ).join("")}
         ${part.Episodes(self, S)}
       </div>`;
    },
    Episodes(self, S) {
      return 0 === S.result.episodes.length ? "" : `
      <h4>Listen to the relevant extracts:</h4>
      ${each(S.result.episodes, (episode, index) => `<div>
           <h4 style="margin-bottom:4px;">
             <a href={episode.page}>${episode.title}</a>
           </h4>
           <h5 style="margin:4px 0px;">
             <a href=${episode.guestlink || (episode.links || [{ url: "" }])[0].url}>
               More about ${episode.guest}</a>
           </h5>
      ${part.Hits(self, S, { episode, index })}
    </div>`)}`;
    },
    Hits(self, S, props) {
      return each(props.episode.hits, (hit, index) => `
     <div>
       <p style="margin-bottom:4px;">
         <span>${hit.score$ * 100 | 0}%</span>&nbsp;&nbsp;&nbsp;
         <span style="font-style:italic">"${hit.extract}&hellip;"</span>
       </p>
       <div style="display:flex;margin-top:4px;" class="audio">
         <button data-hit="${index}" data-episode="${props.index}" onclick="playAudio()"
           >&#9654;</button>
         <button data-hit="${index}" data-episode="${props.index}" onclick="stopAudio()"
                 style="font-size:31px;padding-bottom:5px;">&#9632;</button>
         <div style="margin: 4px 8px 8px">${util.minsec(hit.bgn)}</div>
         <div id="${"playing-" + hit.episode_id + "-" + index}" class="sound-symbol">&#9835;</div>
         <audio id="${"audio-" + hit.episode_id + "-" + index}" src="${hit.audioUrl}"></audio>
       </div>
     </div>`);
    },
    Powered(self, S) {
      return `<small style="font-size:10px;margin:2px 8px;font-style:italic">Podcast AI Chatbot - <a href="https://voxgig.com">powered by Voxgig</a> <a href="https://voxgig.com"><img style="height:12px; position:relative; top:4px" src="data:image/png;base64,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" /></a></small>`;
    }
  };
  customElements.define("voxgig-podmind-ask", VoxgigPodmindAsk);
});
