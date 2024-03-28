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
        // const node = cloud.opensearch.url
        // const index = cloud.opensearch.index
        const out = { ok: false, why: '', answer: '', context: {} };
        // TODO: change msg param to `question`
        const question = msg.query;
        // const client = getOpenSearchClient(region, node)
        const questionEmbeddings = await getEmbeddings(question, { region });
        // const { context, hits } = await getContext(client, index, questionEmbeddings)
        const q = {
            vector: questionEmbeddings,
            directive$: { vector$: true }
        };
        const list = await seneca.entity('vector/podchunk_query').list$(q);
        console.log('LIST', list);
        const context = list.map((n) => n.txt).join('');
        console.log('CONTEXT', context);
        let answer = 'Unable to answer at the moment, please try again later.';
        // TOOD: move into prompt service
        const clipped = context.substring(0, 7000);
        // To update prompt via REPL:
        // aim:prompt,add:prompt,name:chat.query.hive01,text:<% Load("data/config/prompt/chat.query.hive01-v0.txt") %>
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
        let hits = await Promise.all(list.map(async (n) => {
            console.log('HIT', n);
            let episode_id = n.episode_id;
            let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id);
            if (null == episodeEnt) {
                return null;
            }
            return {
                episode_id,
                podcast_id: episodeEnt.podcast_id,
                guest: episodeEnt.guest,
                topics: episodeEnt.topics,
                links: episodeEnt.links,
                title: episodeEnt.title,
                guid: episodeEnt.guid,
                pubDate: episodeEnt.pubDate,
                audioUrl: episodeEnt.url,
                guestlink: episodeEnt.guestlink,
                page: episodeEnt.page,
                bgn: n.bgn,
                end: n.end,
                dur: n.dur,
                knd: n.knd || 'tlk',
                score$: n.custom$.score,
                // TODO: refactor - this is too fragile
                extract: (n.txt.match(/\~(.*)/) || ['', ''])[1]
                    .trim()
                    .substring(episodeEnt.guest.length + 2, 111)
                    .replace(/[<>]/g, '')
                    .replace(/\./g, '. ')
            };
        }));
        // TODO: move score cut off to conf
        hits = hits
            .filter((hit) => null != hit &&
            'tlk' === hit.knd &&
            0.6 < hit.score$);
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