import Fs from 'fs'

const Axios = require('axios')
const { createClient } = require("@deepgram/sdk")


const deepgram = createClient('a9d4401a594f1569252ec9b3363799128c22f224')

module.exports = function make_transcribe_episode() {
  return async function transcribe_episode(this: any, msg: any) {
    const seneca = this

    let out: any = { ok: false, why: '', episode_id: '' }

    let episode_id = msg.episode_id

    out.episode_id = episode_id
    let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)

    if (episodeEnt) {
      let startTime = Date.now()

      let audio = await seneca.entity('pdm/audio').load$({
        bin$: 'content',
        id: 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
          episodeEnt.id + '.mp3',
      })

      out.audioLoadedDur = Date.now() - startTime

      console.log('AUDIO', episodeEnt, audio.content.length)

      const res = await deepgram.listen.prerecorded.transcribeFile(
        audio.content,
        {
          diarize: true,
          paragraphs: true,
          punctuate: true,
          model: 'nova-2-phonecall',
          language: 'en',
          version: 'latest',
          keywords: {
            devrel: 2,
            developer: 2,
            relations: 2,
            voxgig: 2,
          }
        }
      )

      out.deepgramDur = Date.now() - (startTime + out.audioLoadedDur)
      out.duration = Date.now() - startTime

      // console.log('DEEPGRAM', res)

      // Fs.writeFileSync('/tmp/dg01.json', JSON.stringify(res))

      if (res.result) {
        out.ok = true
        out.deepgram = res.result.metadata


        await seneca.entity('pdm/transcript').save$({
          id: 'folder01/transcript01/' + episodeEnt.podcast_id + '/' +
            episodeEnt.id + '-dg01',
          deepgram: res.result,
          audioLoadedDur: out.audioLoadedDur,
          deepgramDur: out.deepgramDur,
          duration: out.duration,
        })

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

