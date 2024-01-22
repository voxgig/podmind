import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'



module.exports = function make_embed_chunk() {
  return async function embed_chunk(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    const region = seneca.context.model.main.conf.cloud.aws.region

    let out: any = { ok: false, why: '' }

    let chunk = msg.chunk
    let podcast_id = out.podcast_id = msg.podcast_id
    let episode_id = out.episode_id = msg.episode_id
    let doStore = out.doStore = false !== msg.doStore
    let mark = msg.mark || seneca.util.Nid()

    debug && debug('EMBED', mark, podcast_id, episode_id, doStore)

    let embedding = await getEmbeddings(chunk, { region })

    if (doStore) {
      seneca.act('aim:ingest,store:embed', {
        mark,
        chunk,
        embedding,
        podcast_id,
        episode_id,
      })
    }

    out.ok = true
    out.chunk = chunk.length
    out.embedding = embedding.length
    out.podcast_id = podcast_id
    out.episode_id = episode_id

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
