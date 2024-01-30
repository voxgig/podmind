// const Axios = require('axios')

module.exports = function make_download_audio() {
  return async function download_audio(this: any, msg: any, _meta: any) {

    const seneca = this
    const debug = seneca.shared.debug
    const Axios = seneca.shared.Axios
    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    let out: any = { ok: false, why: '', paths: [], episode_id: '' }

    let episode_id = msg.episode_id
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())
    let doAudio = false !== msg.doAudio // download by default

    out.episode_id = episode_id
    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)
    let podcast_id = episodeEnt?.podcast_id
    debug('HANDLE', mark, podcast_id, episode_id, doAudio)

    if (episodeEnt) {
      let url = episodeEnt.url
      let size = out.size = -1

      if (doAudio) {
        let res

        try {
          res = await Axios.get(url, { responseType: "arraybuffer" })
        }
        catch (err: any) {
          debug('AUDIO-ERROR', mark, podcast_id, episode_id, url, err)
        }

        debug('HANDLE-AUDIO', mark, podcast_id, episode_id, res?.status)

        if (200 === res?.status) {
          try {
            await seneca.entity('pdm/audio').save$({
              bin$: 'content',
              id: 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
                episodeEnt.id + '-' + humanify(Date.now()) + '.mp3',
              content: res.data
            })
          }
          catch (err: any) {
            debug('HANDLE-AUDIO-ERROR', mark, podcast_id, episode_id, res.status, err)
          }
          out.size = size = res.data.length
        }

        debug('AUDIO', mark, podcast_id, episode_id, url, res?.status, size)
      }

      out.ok = true
    }
    else {
      out.why = 'not-found'
    }

    debug('HANDLE-OUT', mark, podcast_id, episode_id, doAudio, out)

    return out
  }
}
