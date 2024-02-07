

module.exports = function make_download_audio() {
  return async function download_audio(this: any, msg: any, meta: any) {

    const seneca = this
    const debug = seneca.shared.debug(meta.action)
    const Axios = seneca.shared.Axios
    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    let out: any = { ok: false, why: '', paths: [], episode_id: '' }

    // Associate all artifacts of a batch
    let batch = out.batch = msg.batch || ('B' + humanify())

    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())

    let episode_id = out.episode_id = msg.episode_id

    let doAudio = out.doAudio = !!msg.doAudio
    let doTranscribe = out.doTranscribe = !!msg.doTranscribe
    let chunkEnd = out.chunkEnd = parseInt(msg.chunkEnd) || -1 /* -1 => all */

    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)
    let podcast_id = episodeEnt?.podcast_id
    debug('HANDLE', batch, mark, podcast_id, episode_id, doAudio, doTranscribe)

    if (episodeEnt) {
      let url = episodeEnt.url
      let size = out.size = -1

      if (doAudio) {
        let res: any

        debug('HANDLE-AUDIO-START', batch, mark, podcast_id, episode_id, url)

        try {
          res = await Axios.get(url, { responseType: "arraybuffer" })
        }
        catch (err: any) {
          debug('AUDIO-ERROR', batch, mark, podcast_id, episode_id, url, err)
        }

        debug('HANDLE-AUDIO-DOWN',
          batch, mark, podcast_id, episode_id, url, res?.status, res?.data?.length)

        if (200 === res?.status) {
          const s3id = 'audio01/' + episodeEnt.podcast_id + '/' +
            episodeEnt.id + '-' + batch + '.mp3'
          // const s3id_dated = 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
          //   episodeEnt.id + '-' + batch + '-' + humanify(Date.now()) + '.mp3'

          try {
            await seneca.entity('pdm/audio').save$({
              bin$: 'content',
              id: s3id,
              content: () => res.data
            })

            // await seneca.entity('pdm/audio').save$({
            //   bin$: 'content',
            //   id: s3id_dated,
            //   content: () => res.data
            // })
          }
          catch (err: any) {
            debug('HANDLE-AUDIO-ERROR', batch, mark, podcast_id, episode_id, res.status, err)
          }
          out.size = size = res.data.length

          debug('AUDIO-SAVED', batch, mark, podcast_id, episode_id, url, res?.status, size)

          const slog = await seneca.export('PodmindUtility/makeSharedLog')(
            'podcast-ingest-01', episodeEnt.podcast_id)

          slog('AUDIO', batch, podcast_id, episode_id, size)

          if ('local' === seneca.context.env) {
            seneca.act('aim:audio,transcribe:episode', {
              path: 'folder01/' + s3id,
              mark,
              chunkEnd,
            })
          }
        }
      }

      out.ok = true
    }
    else {
      out.why = 'not-found'
    }

    debug('HANDLE-OUT', batch, mark, podcast_id, episode_id, doAudio, out)

    return out
  }
}

