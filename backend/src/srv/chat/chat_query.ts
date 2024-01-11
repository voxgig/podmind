import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws'
import { Client } from '@opensearch-project/opensearch'
import { defaultProvider } from '@aws-sdk/credential-provider-node'



module.exports = function make_chat_query() {
  return async function chat_query(this: any, msg: any) {
    const seneca = this

    const cloud = seneca.context.model.main.conf.cloud

    const region = cloud.aws.region
    const model = cloud.aws.bedrock.model

    const node = cloud.opensearch.url
    const index = cloud.opensearch.index


    const out = { ok: false, why: '', answer: '' }

    const query = msg.query

    const client = getOpenSearchClient(region, node)
    const questionEmbeddings = await getEmbeddings(query, { region })
    const context = await getContext(client, index, questionEmbeddings)
    const answer = await askQuestion(context, query, {
      region,
      model,
      modelSettings: {
        maxTokens: 1525,
        // temperature: 0.7,
        temperature: 0.9,
        region
      },
    })


    out.ok = true
    out.answer = answer

    return out
  }
}




async function askQuestion(context: string, question: string, config: any) {
  const clipped = context.substring(0, 8000)

  const prompt = `
Context:\n\n"""${clipped}"""\n\nBased on the above context,
please answer the question with as much detail and perspective as possible.
Answer:\n\n"""${question}"""
`
  console.log('Prompt: ', prompt)

  const answer = await invokeBedrock(prompt, config)
  console.log('Answer:', JSON.stringify(answer))

  return answer
}


async function invokeBedrock(prompt: string, config: any) {
  const { model, modelSettings, region } = config
  const { maxTokens, temperature } = modelSettings

  const client = new BedrockRuntimeClient({ region })

  const response = await client.send(
    new InvokeModelCommand({
      modelId: model,
      body: JSON.stringify({
        maxTokens,
        temperature,
        prompt,
        topP: 1.0
      }),
      accept: 'application/json',
      contentType: 'application/json'
    })
  )

  const result = JSON.parse(Buffer.from(response.body).toString())
  return result.completions[0].data.text
}



async function getContext(openSearchClient: Client, index: string, questionEmbeddings: number[][]) {
  const contextData = await openSearchClient
    .search(createSearchQuery(index, questionEmbeddings))
  console.log('Full context response:', JSON.stringify(contextData))

  const hits = contextData?.body?.hits?.hits || []
  console.log('Search hits:', hits)

  const context = hits.map((item: Record<string, any>) => item._source.text).join(', ')
  console.log('Context: ', context)

  return context
}



function createSearchQuery(index: string, vector: number[][]) {
  return {
    index,
    body: {
      size: 15,
      _source: { excludes: ['document_vector'] },
      query: {
        knn: {
          document_vector: {
            vector,
            k: 15
          }
        }
      }
    }
  }
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
