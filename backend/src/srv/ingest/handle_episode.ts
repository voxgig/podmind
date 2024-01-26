// const Axios = require('axios')

module.exports = function make_handle_episode() {
  return async function handle_episode(this: any, msg: any, meta: any) {
    const Axios = require('axios')

    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '', paths: [], episode_id: '' }

    let episode_id = msg.episode_id
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())
    let doAudio = false !== msg.doAudio // download by default
    let doTranscribe = false !== msg.doTranscribe // transcribe by default

    out.episode_id = episode_id
    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)
    let podcast_id = episodeEnt?.podcast_id
    debug && debug('HANDLE', mark, podcast_id, episode_id, doAudio)

    if (episodeEnt) {
      let url = episodeEnt.url
      let size = out.size = -1

      if (doAudio) {
        let res

        try {
          res = await Axios.get(url, { responseType: "arraybuffer" })
        }
        catch (err: any) {
          debug && debug('AUDIO-ERROR', mark, podcast_id, episode_id, url, err)
        }

        debug && debug('HANDLE-AUDIO', mark, podcast_id, episode_id, res?.status)

        if (200 === res?.status) {
          try {
            await seneca.entity('pdm/audio').save$({
              bin$: 'content',
              id: 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
                episodeEnt.id + '.mp3',
              // content: res.data.slice(0, 21001000)
              content: res.data
            })
          }
          catch (err: any) {
            debug && debug('HANDLE-AUDIO-ERROR', mark, podcast_id, episode_id, res.status, err)
          }
          out.size = size = res.data.length
        }

        debug && debug('AUDIO', mark, podcast_id, episode_id, url, res?.status, size)
      }

      if (doTranscribe) {
        // Assume audio already present, trigger transcription viq queue.
        seneca.act('aim:ingest,transcribe:episode', {
          episode_id,
          mark,
          doAudio,
        })
      }

      out.ok = true
    }
    else {
      out.why = 'not-found'
    }

    debug && debug('HANDLE-OUT', mark, podcast_id, episode_id, doAudio, out)

    return out
  }
}

