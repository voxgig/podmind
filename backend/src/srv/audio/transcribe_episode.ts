

// TOOD: folder01 should come from model

module.exports = function make_transcribe_episode() {
  return async function transcribe_episode(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)
    const { listPaths } = seneca.export('PodmindUtility/getUtils')()
    const Deepgram = seneca.shared.Deepgram

    let out: any = { ok: false, why: '', episode_id: '' }

    let path = msg.path
    let doAudio = false !== msg.doAudio // upload and transcribe by default
    let mark = msg.mark || seneca.util.Nid()

    out.doAudio = doAudio

    debug && debug('TRANSCRIBE', 'no-batch', mark, path, doAudio)


    // Convert S3 Record events into single per-path calls
    if (null == path) {
      debug && debug('RECORDS', 'no-batch', mark, path, msg.event?.Records)

      const paths = listPaths(msg.event)

      if (paths && 0 < paths.length) {
        out.ok = true
        out.paths = []

        for (path of paths) {
          let pathres = await seneca.post('aim:audio,transcribe:episode', {
            path,
            mark,
            doAudio,
          })

          out.paths.push({
            path,
            ...pathres,
          })
          out.ok = out.ok && pathres.ok
        }
      }

      return out
    }


    // Otherwise, transcribe a single path
    debug && debug('TRANSCRIBE-SINGLE', 'no-batch', mark, path, doAudio)

    let m = path.match(/folder01\/audio01\/([^-]+)\/([^-]+)-([^-.]+)/)

    if (null == m) {
      out.why = 'filename-mismatch'
      return out
    }

    const episode_id = out.episode_id = m[2]
    const batch = out.batch = m[3]

    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)

    if (null == episodeEnt) {
      out.why = 'episode-not-found'
      debug && debug('TRANSCRIBE-load-FAIL', batch, mark, path, episode_id, doAudio, out)
      return out
    }

    let startTime = Date.now()

    if (doAudio) {
      let path_id = path.replace(/^folder01\//, '')
      let audioEnt = await seneca.entity('pdm/audio').load$({
        bin$: 'content',
        id: path_id
      })

      if (null == audioEnt) {
        out.why = 'audio-not-found'
        debug && debug('TRANSCRIBE-SINGLE-FAIL', batch, mark, path, episode_id, doAudio, out)
        return out
      }

      out.audioLoadedDur = Date.now() - startTime

      debug && debug('TRANSCRIBE-AUDIO', batch, mark, path, episode_id, audioEnt.content.length)

      const res = await Deepgram.listen.prerecorded.transcribeFile(
        audioEnt.content,
        {
          diarize: true,
          paragraphs: true,
          punctuate: true,
          model: 'nova-2-phonecall',
          language: 'en',
          version: 'latest',
          keywords: ({
            devrel: 2,
            developer: 2,
            relations: 2,
            voxgig: 2,
          } as any)
        }
      )

      out.deepgramDur = Date.now() - (startTime + out.audioLoadedDur)
      out.duration = Date.now() - startTime

      if (res.result) {
        out.ok = true
        out.deepgram = res.result.metadata

        const transcript_id = 'transcript01/' + episodeEnt.podcast_id + '/' +
          episodeEnt.id + '-' + batch + '-dg01.json'

        // const transcript_id_dated = 'transcript01/' + episodeEnt.podcast_id + '/' +
        //  episodeEnt.id + '-dg01-' + humanify(Date.now()) + '.json'

        const transcript_data = {
          deepgram: res.result,
          audioLoadedDur: out.audioLoadedDur,
          deepgramDur: out.deepgramDur,
          duration: out.duration,
        }

        await seneca.entity('pdm/transcript').save$({
          ...transcript_data,
          batch,
          id$: transcript_id,
        })

        // await seneca.entity('pdm/transcript').save$({
        //   id$: transcript_id_dated,
        //   ...transcript_data,
        // })

        debug && debug('TRANSCRIBE-DONE', batch, mark, path, episode_id, out)
      }
      else {
        out.why = 'deepgram'
        out.details = {
          deepgram: res.error
        }
      }
    }

    return out
  }
}
