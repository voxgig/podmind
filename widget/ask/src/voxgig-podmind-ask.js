
import { store, component, render, signal } from 'reefjs'

import CSS from './voxgig-podmind-ask.css?inline'

import { util } from './voxgig-podmind.js'

const NAME = 'voxgig-podmind-ask'

const { each, EH } = util


const makeDebug = (self) =>
  self.config.debug ? (...args)=>console.log(NAME, self.config.mark, ...args) : ()=>void 0


class VoxgigPodmindAsk extends HTMLElement {
  constructor(...args) {
    super()
    const self = this
    
    self.config = {
      apikey: this.getAttribute('apikey'),
      mark: this.getAttribute('mark') ||
        Math.round((Math.random()*1e16)).toString(16).substring(0,8),
      debug: 'true' === this.getAttribute('debug') 
    }

    self.debug = makeDebug(this)
    self.debug('START')

    self.store = {
      result: signal({answer:[],episodes:[]}, this.config.mark),
      thinking: signal(false, this.config.mark),
    }
  }

  connectedCallback() {
    const self = this
    
    self.debug('CONNECT')
    self.shadow = self.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.innerHTML = CSS
    
    self.shadowRoot.appendChild(style)

    const elem = document.createElement("div")
    self.shadowRoot.appendChild(elem)    

    self.main(elem)
  }


  qs(...args) {
    return this.shadowRoot.querySelector(...args)
  }

  
  main(elem) {
    const self = this
    const S = self.store
    
    const events = {
      submitFormQuery: async function(ev) {
        try {
          ev.preventDefault()

          S.thinking.value = true

          const formElem = self.qs('#query-form')
          const data = new FormData(formElem)
          const query = data.get('query')
          
          self.debug('QUERY', query)
          const result = await util.fetchAnswer({
            query,
            apikey: self.config.apikey,
            mark: self.config.mark,
          })
          self.debug('RESULT', query, result)

          S.result = result
        }
        finally {
          S.thinking.value = false
        }
      },

      playAudio(ev) {
        const episodeIndex = +ev.target.getAttribute('data-episode')
        const hitIndex = +ev.target.getAttribute('data-hit')

        // console.log('PLAY', episodeIndex, hitIndex, S.result)

        const hit = S.result.episodes[episodeIndex].hits[hitIndex]
        const { audio, playing } = util.findAudioElems(self.shadowRoot,hit,hitIndex) 
        audio.currentTime = hit.bgn
        audio.play()
        playing.classList.add('sound-symbol-playing')
      },

      stopAudio(ev) {
        const episodeIndex = +ev.target.getAttribute('data-episode')
        const hitIndex = +ev.target.getAttribute('data-hit')
        const hit = S.result.episodes[episodeIndex].hits[hitIndex]
        const { audio, playing } = util.findAudioElems(self.shadowRoot,hit,hitIndex) 
        audio.pause()
        playing.classList.remove('sound-symbol-playing')
      },
    }

    function Main() {
      return `<div class="voxgig-podmind">
      <h3>Ask our podcast guests a question about developer relations!</h3>
      <p>You'll get a summary and relevant extracts (audio+text) from our discussions, as well as links with more information about our guests.</p>

      ${part.Form(self,S)}
      ${part.Powered(self,S)}
      ${part.Result(self,S)}
      `
    }
    
    component(elem, Main, {
      signals: [this.config.mark],
      events,
    })
  }
}


const part = {

  Form(self, S) {
    return `<form
        id="query-form"
        onsubmit="submitFormQuery()"
        class="${S.thinking.value?'thinking':''}"
      >
      <input
        name="query"
        type="text"
      />
      <button
        ${S.thinking.value?'disabled':''}
      >Ask</button>
    </form>`
  },

  Result(self, S) {
    return 0===S.result.answer.length ? '' :
      `<div>
         <h4>Summary</h4>
         ${ S.result.answer.map(p=>
           `<p>${p}</p>`
         ).join('')}
         ${part.Episodes(self,S)}
       </div>`
  },

  Episodes(self, S) {
    return 0 === S.result.episodes.length ? '' : `
      <h4>Listen to the relevant extracts:</h4>
      ${ each(S.result.episodes,(episode, index)=>
        `<div>
           <h4 style="margin-bottom:4px;">
             <a href={episode.page}>${episode.title}</a>
           </h4>
           <h5 style="margin:4px 0px;">
             <a href=${episode.guestlink || (episode.links||[{url:''}])[0].url}>
               More about ${episode.guest}</a>
           </h5>
      ${part.Hits(self,S,{episode,index})}
    </div>`)}`
   },

   Hits(self, S, props) {
     return each(props.episode.hits, (hit, index)=>`
     <div>
       <p style="margin-bottom:4px;">
         <span>${(hit.score$ * 100)|0}%</span>&nbsp;&nbsp;&nbsp;
         <span style="font-style:italic">"${hit.extract}&hellip;"</span>
       </p>
       <div style="display:flex;margin-top:4px;" class="audio">
         <button data-hit="${index}" data-episode="${props.index}" onclick="playAudio()"
           >&#9654;</button>
         <button data-hit="${index}" data-episode="${props.index}" onclick="stopAudio()"
                 style="font-size:31px;padding-bottom:5px;">&#9632;</button>
         <div style="margin: 4px 8px 8px">${util.minsec(hit.bgn)}</div>
         <div id="${'playing-'+hit.episode_id+'-'+index}" class="sound-symbol">&#9835;</div>
         <audio id="${'audio-'+hit.episode_id+'-'+index}" src="${hit.audioUrl}"></audio>
       </div>
     </div>`)
  },
  
  Powered(self, S) {
    return `<small style="font-size:10px;margin:2px 8px;font-style:italic">Podcast AI Chatbot - <a href="https://voxgig.com">powered by Voxgig</a> <a href="https://voxgig.com"><img style="height:12px; position:relative; top:4px" src="data:image/png;base64,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" /></a></small>`
  }
}


customElements.define('voxgig-podmind-ask', VoxgigPodmindAsk)
