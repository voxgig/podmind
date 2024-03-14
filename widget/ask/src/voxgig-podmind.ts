

const util = {
  findAudioElems: (extracts: any, hit: any, index: number) => {
    const audio_id = '#audio-' + hit.episode_id + '-' + index
    const playing_id = '#playing-' + hit.episode_id + '-' + index
    const audio_elem: any = extracts.current.querySelector(audio_id)
    const playing_elem: any = extracts.current.querySelector(playing_id)
    return {
      audio: audio_elem,
      playing: playing_elem,
    }
  },

  groupByEpisode: (hits: any[]): any[] => {
    let episodeMap = hits.reduce((a: any, hit: any) => {
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
