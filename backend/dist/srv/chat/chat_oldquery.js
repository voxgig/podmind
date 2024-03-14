"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const aws_1 = require("@opensearch-project/opensearch/aws");
const opensearch_1 = require("@opensearch-project/opensearch");
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
module.exports = function make_chat_query() {
    return async function chat_query(msg) {
        const seneca = this;
        const cloud = seneca.context.model.main.conf.cloud;
        const region = cloud.aws.region;
        const model = cloud.aws.bedrock.model;
        const node = cloud.opensearch.url;
        const index = cloud.opensearch.index.query;
        const out = { ok: false, why: '', answer: '', context: {} };
        const query = msg.query;
        const client = getOpenSearchClient(region, node);
        const questionEmbeddings = await getEmbeddings(query, { region });
        const { context, hits } = await getContext(client, index, questionEmbeddings);
        const answer = await askQuestion(context, query, {
            region,
            model,
            modelSettings: {
                maxTokens: 1525,
                temperature: 0.7,
                // temperature: 0.95,
                region
            },
        });
        out.ok = true;
        out.answer = answer;
        // out.context = context
        out.context = { hits };
        return out;
    };
};
async function askQuestion(context, question, config) {
    const clipped = context.substring(0, 8000);
    const prompt = `
Use the CONTEXT to help answer the QUESTION. You are an experienced developer advocate talking to another developer who speaks english as a second language. Answer in the third person, never refer to yourself, do not use casual language. The subject matter is developer relations. The context is taken from devrel podcast conversations. IMPORTANT: YOU MUST ALWAYS ANSWER. MAKE UP AN ANSWER. Do not refer to the existence of the CONTEXT.

CONTEXT:\n\n"""${clipped}"""

QUESTION:\n\n"""${question}"""
`;
    // console.log('Prompt: ', prompt)
    const answer = await invokeBedrock(prompt, config);
    // console.log('Answer:', JSON.stringify(answer))
    return answer;
}
async function invokeBedrock(prompt, config) {
    const { model, modelSettings, region } = config;
    const { maxTokens, temperature } = modelSettings;
    const client = new client_bedrock_runtime_1.BedrockRuntimeClient({ region });
    const response = await client.send(new client_bedrock_runtime_1.InvokeModelCommand({
        modelId: model,
        body: JSON.stringify({
            maxTokens,
            temperature,
            prompt,
            topP: 1.0
        }),
        accept: 'application/json',
        contentType: 'application/json'
    }));
    const result = JSON.parse(Buffer.from(response.body).toString());
    return result.completions[0].data.text;
}
async function getContext(openSearchClient, index, questionEmbeddings) {
    const contextData = await openSearchClient
        .search(createSearchQuery(index, questionEmbeddings));
    // console.log('Full context response:', JSON.stringify(contextData))
    const hits = contextData?.body?.hits?.hits || [];
    // console.log('Search hits:', hits)
    const context = hits.map((item) => item._source.text).join(';;');
    // console.log('Context: ', context)
    return { context, hits };
}
function createSearchQuery(index, vector) {
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
    };
}
function getOpenSearchClient(region, node) {
    return new opensearch_1.Client({
        ...(0, aws_1.AwsSigv4Signer)({
            region,
            service: 'aoss',
            getCredentials: () => {
                const credentialsProvider = (0, credential_provider_node_1.defaultProvider)();
                return credentialsProvider();
            }
        }),
        node
    });
}
async function getEmbeddings(input, config) {
    const { region } = config;
    const client = new client_bedrock_runtime_1.BedrockRuntimeClient({ region });
    const response = await client.send(new client_bedrock_runtime_1.InvokeModelCommand({
        modelId: 'amazon.titan-embed-text-v1',
        body: JSON.stringify({
            inputText: input
        }),
        accept: 'application/json',
        contentType: 'application/json'
    }));
    const result = JSON.parse(Buffer.from(response.body).toString());
    return result.embedding;
}
//# sourceMappingURL=chat_oldquery.js.map