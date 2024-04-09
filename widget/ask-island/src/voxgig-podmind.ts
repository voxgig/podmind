

const util = {
  findAudioElems: (extractsRef: any, hit: any, index: number) => {
    const audio_id = '#audio-' + hit.episode_id + '-' + index
    const playing_id = '#playing-' + hit.episode_id + '-' + index
    const audio_elem: any = extractsRef.current.querySelector(audio_id)
    const playing_elem: any = extractsRef.current.querySelector(playing_id)
    return {
      audio: audio_elem,
      playing: playing_elem,
    }
  },

  groupByEpisode: (hits: any[]): any[] => {
    let repeats: any = {}
    let episodeMap = hits.reduce((a: any, hit: any) => {

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

  minsec: (secs: number) => {
    return ((secs / 60) | 0) + 'm ' + ((secs % 60) | 0) + 's'
  }
}


export {
  util
}
