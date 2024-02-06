import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'


module.exports = function make_handle_chunk() {
  return async function handle_chunk(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)
    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    const region = seneca.context.model.main.conf.cloud.aws.region

    let out: any = { ok: false, why: '' }

    const embeder = out.embeder = 'm01'

    let batch = out.batch = msg.batch || ('B' + humanify())
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())

    let chunk = out.chunk = msg.chunk
    let chunker = out.chunker = msg.chunker //  chunking algo
    let podcast_id = out.podcast_id = msg.podcast_id
    let episode_id = out.episode_id = msg.episode_id
    let doStore = out.doStore = !!msg.doStore
    let doEmbed = out.doEmbed = !!msg.doEmbed

    debug('EMBED',
      batch, mark, chunker, embeder, podcast_id, episode_id, chunk.length, doStore, doEmbed)

    if (doEmbed) {
      let embedding = await getEmbeddings(chunk, { region })

      if (doStore) {
        await seneca.post('aim:embed,store:embed', {
          mark,
          batch,
          chunk,
          chunker,
          embeder,
          embedding,
          podcast_id,
          episode_id,
          doStore,
        })
      }

      out.ok = true
      out.embedding = embedding.length
      out.podcast_id = podcast_id
      out.episode_id = episode_id

      await seneca.entity('pdm/chunk').save$({
        mark,
        batch,
        chunker,
        embeder,
        chunklen: chunk.length,
        embedlen: embedding.length,
        podcast_id,
        episode_id,
        chunk: chunk,
        embed: embedding,
      })
    }
    else {
      out.ok = true
    }

    debug('EMBED-OUT',
      batch, mark, chunker, embeder, podcast_id, episode_id, doEmbed, doStore, out)

    return out
  }
}


async function getEmbeddings(input: string, config: any): Promise<number[][]> {
  const { region } = config

  const client = new BedrockRuntimeClient({ region })

  const response = await client.send(
    new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v1',
      body: JSON.stringify({
        inputText: input
      }),
      accept: 'application/json',
      contentType: 'application/json'
    })
  )

  const result = JSON.parse(Buffer.from(response.body).toString())
  return result.embedding
}
