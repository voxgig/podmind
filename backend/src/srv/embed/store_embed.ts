import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws'
import { Client } from '@opensearch-project/opensearch'
import { defaultProvider } from '@aws-sdk/credential-provider-node'


module.exports = function make_store_embed() {
  return async function store_embed(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)
    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    const region = seneca.context.model.main.conf.cloud.aws.region
    const node = seneca.context.model.main.conf.cloud.opensearch.url
    const index = seneca.context.model.main.conf.cloud.opensearch.index

    let out: any = { ok: false, why: '' }

    let batch = out.batch = msg.batch || ('B' + humanify())
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())

    let chunk = out.chunk = msg.chunk
    let chunker = out.chunker = msg.chunker //  chunking algo
    let embeder = out.embeder = msg.embeder //  embedding mark
    let embedding = msg.embedding
    let podcast_id = msg.podcast_id
    let episode_id = msg.episode_id

    debug('STORE', batch, mark, chunker, embeder, podcast_id, episode_id)

    const OpenSearchClient = getOpenSearchClient(region, node)

    let storeRes = await store(OpenSearchClient, index, chunk, embedding)

    out.ok = 201 === storeRes.statusCode
    out.podcast_id = podcast_id
    out.episode_id = episode_id

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

