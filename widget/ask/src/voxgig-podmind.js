const ENDPOINT = import.meta.env.VOXGIG_PODMIND_ENDPOINT ||
  'https://podmind-dev.voxgig.com/api/public/widget'

const SpanElem = document.createElement('span')


const util = {

  each: (list, build)=>list.map(build).join(''),
  
  findAudioElems: (root, hit, index) => {
    const audio_id = '#audio-' + hit.episode_id + '-' + index
    const playing_id = '#playing-' + hit.episode_id + '-' + index
    const audio_elem = root.querySelector(audio_id)
    const playing_elem = root.querySelector(playing_id)
    return {
      audio: audio_elem,
      playing: playing_elem,
    }
  },

  
  groupByEpisode: (hits) => {
    let repeats = {}
    let episodeMap = hits.reduce((a, hit) => {

      // Skip repeat episodes
      if (repeats[hit.guest]) {
        if (hit.episode_id !== repeats[hit.guest]) {
          return a
        }
      }
      else {
        repeats[hit.guest] = hit.episode_id
      }

      const hits = ((a[hit.episode_id] = (a[hit.episode_id] || {
        ...hit,
        hits: []
      }))).hits

      if (hits.length < 3) {
        hits.push(hit)
      }

      return a
    }, {})

    return Object.values(episodeMap)
  },

  
  minsec: (secs) => {
    return ((secs / 60) | 0) + 'm ' + ((secs % 60) | 0) + 's'
  },

  
  async fetchAnswer(spec) {
    const { query, apikey, mark } = spec
    const vxghdr = apikey+';'+mark+';'+new Date().toString()
    // console.log('vxghdr', vxghdr)

    let res = await fetch(ENDPOINT,{
      method: 'POST',
      body: JSON.stringify({
        aim: 'req',
        on: 'widget',
        chat: 'query',
        query,
      }),
      headers: {
        'content-type': 'application/json',
        'voxgig-podmind-widget': vxghdr 
      }
    })
    
    let json = await res.json()

    let answer = json.answer || ''
    answer = answer.split(/\n/)

    let hits = json.hits
    let episodes = util.groupByEpisode(hits)
    
    return util.EH({
      answer,
      episodes,
    })
  },


  EH: function EH(o) {
    let t = typeof o
    if('object'===typeof o && null != o) {
      if(Array.isArray(o)) {
        return o.map(n=>EH(n))
      }
      let ts
      if('function'===typeof o.toString) {
        ts = o.toString()
      }
      if('[object Object]'!==ts) {
        return EH(ts)
      }
      for(let p in o) {
        o[p] = EH(o[p])
      }
      return o
    }
    else if('string'===t) {
      SpanElem.textContent = ''+o
      return SpanElem.innerHTML
    }
    return o
  }
}


export {
  util
}
