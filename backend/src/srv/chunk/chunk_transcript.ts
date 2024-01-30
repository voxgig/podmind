

module.exports = function make_chunk_transcript() {
  return async function chunk_transcript(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '' }

    let path = out.path = msg.path
    let podcast_id = out.podcast_id = msg.podcast_id
    let episode_id = out.episode_id = msg.episode_id
    let doEmbed = out.doEmbed = false !== msg.doEmbed
    let doStore = out.doStore = false !== msg.doStore
    let chunkEnd = out.chunkEnd = msg.chunkEnd
    let mark = msg.mark || seneca.util.Nid()

    debug && debug('CHUNK', mark, path, podcast_id, episode_id, doEmbed, doStore)

    let transcript_id = path
    // 'folder01/transcript01/' + podcast_id + '/' +
    // episode_id + '-dg01.json'

    const transcriptEnt = await seneca.entity('pdm/transcript')
      .load$(transcript_id)

    if (null == transcriptEnt) {
      out.why = 'transcript-not-found'
      out.details = { path, transcript_id, podcast_id, episode_id }
      debug && debug('CHUNK-FAIL', mark, path, podcast_id, episode_id, doEmbed, doStore, out)
      return out
    }

    const transcriptResults =
      transcriptEnt.deepgram.results

    const alt0 = transcriptResults
      .channels[0]
      .alternatives[0]

    const transcriptText = alt0.transcript
    const paragraphs = alt0.paragraphs.paragraphs

    out.transcript = transcriptText.length
    out.paragraphs = paragraphs.length

    let chunks: string[] = []

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

      while (para && 1 === para.speaker) {
        let answer = para.sentences.map((s: any) => s.text).join('')
        let chunk = question + ' :: ' + answer
        chunks.push(chunk)

        para = paragraphs[++pI]
      }

      pI--
    }

    chunks = chunks.filter((c: string) => 0 < c.length)

    debug && debug('CHUNK-CHUNKS',
      mark, path, podcast_id, episode_id, doEmbed, doStore, chunks.length)

    let embeds = 0
    chunkEnd = 0 <= chunkEnd ? chunkEnd : chunks.length
    for (let chunkI = 0; chunkI < chunks.length; chunkI++) {
      let chunk = chunks[chunkI]

      if (doEmbed) {
        await seneca.post('aim:embed,handle:chunk', {
          mark,
          chunk,
          podcast_id,
          episode_id,
          doStore,
        })
        embeds++
      }
    }

    out.ok = true
    out.chunks = chunks.length
    out.embeds = embeds
    out.podcast_id = podcast_id
    out.episode_id = episode_id

    return out
  }
}
