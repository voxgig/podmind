import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws'
import { Client } from '@opensearch-project/opensearch'
import { defaultProvider } from '@aws-sdk/credential-provider-node'


import { chunk as Chunk } from 'llm-chunk'


module.exports = function make_ingest_transcript() {
  return async function ingest_transcript(this: any, msg: any) {
    const seneca = this

    const region = seneca.context.model.main.conf.cloud.aws.region
    const node = seneca.context.model.main.conf.cloud.opensearch.url
    const index = seneca.context.model.main.conf.cloud.opensearch.index

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

    // console.log(transcriptEnt)

    // const transcriptText = transcriptEnt.content.toString()
    const transcriptText =
      transcriptEnt.deepgram.result.results.channels[0].alternatives[0].transcript
    // console.log('transcript', transcriptText)

    out.transcript = transcriptText.length

    /*
    const chunks = Chunk(transcriptText, {
      minLength: 111,
      maxLength: 1111,
      // splitter: 'paragraph',
      splitter: 'sentence',
      overlap: 22,
      delimiters: '\n'
    })
    */

    let chunks = []
    for (let pI = 0; pI < transcriptText.length; pI += 1000) {
      chunks.push(transcriptText.substring(pI, pI + 1050))
    }

    chunks = chunks.filter((c: string) => 0 < c.length)

    const client = getOpenSearchClient(region, node)

    for (let chunk of chunks) {
      let startTime = Date.now()
      let embedding = await getEmbeddings(chunk, { region })
      let embedDur = Date.now() - startTime
      console.log('EMBED', embedDur, chunk.length, embedding.length)
      let storeRes = await store(client, index, chunk, embedding)
      let storeDur = Date.now() - (startTime + embedDur)
      console.log('STORE', storeDur, storeRes.statusCode)
    }


    out.ok = true
    out.chunks = chunks.length

    return out
  }
}


async function store(client: Client, index: string, input: string, embeddings: number[][]) {
  if (!input || !embeddings) throw new Error('Missing required input in store()!')

  return await client.index(createIndexObject(index, input, embeddings))
}


function getOpenSearchClient(region: string, node: string) {
  return new Client({
    ...AwsSigv4Signer({
      region,
      service: 'aoss',
      getCredentials: () => {
        const credentialsProvider = defaultProvider()
        return credentialsProvider()
      }
    }),
    node
  })
}


export function createIndexObject(index: string, text: string, embeddings: number[][]) {
  return {
    index,
    body: {
      text,
      document_vector: embeddings
    }
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
