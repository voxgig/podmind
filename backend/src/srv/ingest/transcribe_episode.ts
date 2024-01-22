

import { createClient } from '@deepgram/sdk'


let Deepgram: any = null


module.exports = function make_transcribe_episode() {
  return async function transcribe_episode(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)


    let out: any = { ok: false, why: '', episode_id: '' }

    let path = msg.path
    let episode_id = msg.episode_id
    let doAudio = false !== msg.doAudio // upload and transcribe by default
    let mark = msg.mark || seneca.util.Nid()

    out.doAudio = doAudio


    if (null == Deepgram) {
      let deepgramApiKey = await this.post(
        'sys:provider,provider:deepgram,get:key,key:apikey'
      )
      if (!deepgramApiKey.ok) {
        out.why = 'deepgram-apikey'
        debug && debug('TRANSCRIBE-DEEPGRAM', mark, path, episode_id, out)
        return out
      }

      Deepgram = createClient(deepgramApiKey.value)
    }


    debug && debug('TRANSCRIBE', mark, path, episode_id, doAudio)

    // AWS S3 event
    if (null == path && null == episode_id) {
      debug && debug('RECORDS', mark, path, episode_id, msg.event?.Records)

      const paths = seneca.shared.listPaths(msg.event)

      if (paths && 0 < paths.length) {
        out.ok = true

        for (path of paths) {
          let pathres = await seneca.post('aim:ingest,transcribe:episode', {
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

    debug && debug('TRANSCRIBE-SINGLE', mark, path, episode_id, doAudio)

    if (null == episode_id) {
      let m = path.match(/folder01\/audio01\/([^-]+)\/([^-]+)/)

      if (null == m) {
        out.why = 'filename-mismatch'
        return out
      }
      episode_id = m[2]
    }

    out.episode_id = episode_id
    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)

    if (null == episodeEnt) {
      out.why = 'episode-not-found'
      debug && debug('TRANSCRIBE-SINGLE-FAIL', mark, path, episode_id, doAudio, out)
      return out
    }

    let startTime = Date.now()

    const transcript_id = 'folder01/transcript01/' + episodeEnt.podcast_id + '/' +
      episodeEnt.id + '-dg01'

    let transcriptEnt = await seneca.entity('pdm/transcript').load$(transcript_id)

    if (null == transcriptEnt && false !== doAudio) {
      let audioEnt = await seneca.entity('pdm/audio').load$({
        bin$: 'content',
        id: 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
          episodeEnt.id + '.mp3',
      })

      out.audioLoadedDur = Date.now() - startTime

      debug && debug('TRANSCRIBE-AUDIO', mark, path, episode_id, audioEnt.content.length)

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

        await seneca.entity('pdm/transcript').save$({
          id: transcript_id,
          deepgram: res.result,
          audioLoadedDur: out.audioLoadedDur,
          deepgramDur: out.deepgramDur,
          duration: out.duration,
        })

        debug && debug('TRANSCRIBE-DONE', mark, path, episode_id, out)
      }
      else {
        out.why = 'deepgram'
        out.details = {
          deepgram: res.error
        }
      }
    }
    else {
      out.ok = true
      out.exists = true
      debug && debug('TRANSCRIBE-EPISODE', mark, path, episode_id, out)
      seneca.act('aim:ingest,handle:transcript', { episode_id })
    }

    return out
  }
}
