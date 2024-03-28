
import type { PodcastChunk } from '../../concern/types/shared-types'


module.exports = function make_chunk_transcript() {
  return async function chunk_transcript(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '' }

    const chunker = out.chunker = 'c01'

    let path = out.path = msg.path
    let batch = out.batch = msg.batch
    let podcast_id = out.podcast_id = msg.podcast_id
    let episode_id = out.episode_id = msg.episode_id
    let doEmbed = out.doEmbed = false !== msg.doEmbed // default true as queue event
    let doStore = out.doStore = false !== msg.doStore // default true as queue event
    let chunkEnd = out.chunkEnd = msg.chunkEnd
    let mark = msg.mark || seneca.util.Nid()

    debug && debug('CHUNK',
      'no-batch', mark, chunker, path, podcast_id, episode_id, doEmbed, doStore)

    const episodeEnt = await seneca.entity('pdm/episode')
      .load$(episode_id)

    if (null == episodeEnt) {
      out.why = 'episode-not-found'
      out.details = { path, podcast_id, episode_id }
      debug && debug('CHUNK-FAIL-EPISODE',
        'no-batch', mark, chunker, path, podcast_id, episode_id, doEmbed, doStore, out)
      return out
    }

    let transcript_id: string

    if (null != path) {
      transcript_id = path.replace(/^folder01\//, '')
    }
    else {
      if (null == batch) {
        batch = episodeEnt.batch
      }

      transcript_id = 'transcript01/' + episodeEnt.podcast_id + '/' +
        episodeEnt.id + '-' + batch + '-dg01.json'
    }

    // TODO: s3-store should auto strip folder
    const transcriptEnt = await seneca.entity('pdm/transcript')
      .load$(transcript_id)

    if (null == transcriptEnt) {
      out.why = 'transcript-not-found'
      out.details = { path, transcript_id, podcast_id, episode_id }
      debug && debug('CHUNK-FAIL-TRANSCRIPT',
        'no-batch', mark, chunker, path, podcast_id, episode_id, doEmbed, doStore, out)
      return out
    }

    const guestName = episodeEnt.guest || ''

    batch = transcriptEnt.batch

    const transcriptResults =
      transcriptEnt.deepgram.results

    const alt0 = transcriptResults
      .channels[0]
      .alternatives[0]

    const transcriptText = alt0.transcript
    const paragraphs = alt0.paragraphs.paragraphs

    out.transcript = transcriptText.length
    out.paragraphs = paragraphs.length

    debug && debug('CHUNK-START',
      batch, mark, chunker, path, podcast_id, episode_id, doEmbed, doStore, out)

    let chunks: PodcastChunk[] = []

    chunks.push({
      knd: 'txt',
      txt: `For episode ${episodeEnt.title}, ` +
        `the guest is ${episodeEnt.guest}. The topics are: {episodeEnt.topics.join('.')}`,
      bgn: 0,
      end: 0,
      dur: 0,
    })


    const content = episodeEnt.content
    for (let p = 0; p < content.length; p += 111) {
      chunks.push({
        knd: 'txt',
        txt: content.substring(p, p + 133).replace(/\s+\w+$/, ''),
        bgn: 0,
        end: 0,
        dur: 0,
      })

    }

    console.log('TXT-CHUNKS', chunks)

    // TUNING
    // assume para 0 is standard intro

    // let speaker: any[] = []
    for (let pI = 1; pI < paragraphs.length; pI++) {
      let para: any = paragraphs[pI]

      let qparts = []
      while (para && 0 === para.speaker) {
        qparts.push(para.sentences.map((s: any) => s.text).join(''))
        para = paragraphs[++pI]
      }
      let question = qparts.join('')

      // console.log('Q: ' + question)

      let answered = false
      while (para && 1 === para.speaker) {
        let answer = para.sentences.map((s: any) => s.text).join('')
        let chunk: PodcastChunk = {
          knd: 'tlk',
          txt: '\n<' + question + ' ~ ' + guestName + ': ' + answer + '>',
          bgn: para.start,
          end: para.end,
          dur: para.end - para.start,
        }
        chunks.push(chunk)

        para = paragraphs[++pI]
        answered = true
      }

      if (answered) {
        pI--
      }
    }


    chunks = chunks.filter(c => 0 < c.txt.length)

    debug && debug('CHUNK-CHUNKS',
      mark, chunker, path, podcast_id, episode_id, doEmbed, doStore, chunks.length)

    let embeds = 0
    let maxChunk = 0 <= chunkEnd ? chunkEnd : chunks.length
    for (let chunkI = 0; chunkI < maxChunk; chunkI++) {
      let chunk = chunks[chunkI]

      if (doEmbed) {
        const slog = await seneca.export('PodmindUtility/makeSharedLog')(
          'podcast-ingest-01', podcast_id)

        slog('CHUNK', batch, podcast_id, episode_id,
          chunkI, chunk.txt.length, chunk.bgn, chunk.dur, chunker)

        await seneca.post('aim:embed,handle:chunk', {
          chunker,
          mark,
          batch,
          chunk,
          podcast_id,
          episode_id,
          doStore,
          doEmbed,
        })
        embeds++
      }
    }

    out.ok = true
    out.batch = batch
    out.chunks = chunks.length
    out.embeds = embeds
    out.podcast_id = podcast_id
    out.episode_id = episode_id

    return out
  }
}
