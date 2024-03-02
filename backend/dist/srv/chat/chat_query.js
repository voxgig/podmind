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
        // const model = cloud.aws.bedrock.model
        const node = cloud.opensearch.url;
        const index = cloud.opensearch.index;
        const out = { ok: false, why: '', answer: '', context: {} };
        // TODO: change msg param to `question`
        const question = msg.query;
        const client = getOpenSearchClient(region, node);
        const questionEmbeddings = await getEmbeddings(question, { region });
        const { context, hits } = await getContext(client, index, questionEmbeddings);
        let answer = 'Unable to answer at the moment, please try again later.';
        // TOOD: move into prompt service
        const clipped = context.substring(0, 7000);
        const promptRes = await seneca.post('aim:prompt,build:prompt,name:chat.query.hive01', {
            p: {
                '<<CONTEXT>>': clipped,
                '<<QUESTION>>': question
            }
        });
        if (promptRes.ok) {
            const query = promptRes.full;
            let queryRes = await seneca.post('sys:chat,submit:query', {
                query
            });
            if (queryRes.ok) {
                answer = queryRes.answer;
            }
            else {
                console.log('PROMPT-QUERY-FAILED', queryRes);
            }
        }
        else {
            // TODO: production logging
            console.log('PROMPT-BUILD-FAILED', promptRes);
        }
        out.ok = true;
        out.answer = answer;
        out.context = { hits };
        return out;
    };
};
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
//# sourceMappingURL=chat_query.js.map