

module.exports = function make_ingest_transcript() {
  return async function ingest_transcript(this: any, msg: any) {
    const seneca = this


    let out: any = { ok: false, why: '' }

    let filepath = msg.filepath
    let podcast_id = msg.podcast_id
    let episode_id = msg.episode_id

    let transcript_id = 'folder01/transcript01/' + podcast_id + '/' +
      episode_id + '-dg01'

    const transcriptEnt = await seneca.entity('pdm/transcript')
      .load$(transcript_id)
    if (null == transcriptEnt) {
      out.why = 'transcript-not-found'
      out.details = { filepath, transcript_id, podcast_id, episode_id }
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

    console.log('CHUNKS', chunks.length)

    let chunksOK = 0
    for (let chunkI = 0; chunkI < chunks.length; chunkI++) {
      let chunk = chunks[chunkI]

      try {

        let embedRes = await seneca.post('aim:ingest,embed:chunk', {
          chunk,
          podcast_id,
          episode_id,
        })

        if (!embedRes.ok) {
          console.log('ingest_transcript embed fail', embedRes)
          continue
        }

        chunksOK++
        let embedding = embedRes.embedding

        let storeRes = await seneca.post('aim:ingest,store:embed', {
          chunk,
          embedding,
          podcast_id,
          episode_id,
        })

        if (!storeRes.ok) {
          console.log('ingest_transcript store fail', storeRes)
          continue
        }
      }
      catch (e: any) {
        console.log('ingest_transcript', podcast_id, episode_id, e)
      }
    }


    out.ok = chunksOK === chunks.length
    out.chunks = chunks.length
    out.chunksOK = chunksOK
    out.podcast_id = podcast_id
    out.episode_id = episode_id


    return out
  }
}
