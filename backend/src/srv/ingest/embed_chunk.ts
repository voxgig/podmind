import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'





module.exports = function make_embed_chunk() {
  return async function embed_chunk(this: any, msg: any) {
    const seneca = this

    const region = seneca.context.model.main.conf.cloud.aws.region
    // const node = seneca.context.model.main.conf.cloud.opensearch.url
    // const index = seneca.context.model.main.conf.cloud.opensearch.index

    let out: any = { ok: false, why: '' }

    let chunk = msg.chunk
    let podcast_id = msg.podcast_id
    let episode_id = msg.episode_id


    let embedding = await getEmbeddings(chunk, { region })

    out.ok = true
    out.embedding = embedding
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
