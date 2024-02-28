"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexObject = void 0;
const aws_1 = require("@opensearch-project/opensearch/aws");
const opensearch_1 = require("@opensearch-project/opensearch");
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
module.exports = function make_store_embed() {
    return async function store_embed(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        const { humanify } = seneca.export('PodmindUtility/getUtils')();
        const region = seneca.context.model.main.conf.cloud.aws.region;
        const node = seneca.context.model.main.conf.cloud.opensearch.url;
        const index = seneca.context.model.main.conf.cloud.opensearch.index;
        let out = { ok: false, why: '' };
        let batch = out.batch = msg.batch || ('B' + humanify());
        let mark = out.mark = msg.mark || ('M' + seneca.util.Nid());
        let chunk = out.chunk = msg.chunk;
        let chunker = out.chunker = msg.chunker; //  chunking algo
        let embeder = out.embeder = msg.embeder; //  embedding mark
        let embedding = msg.embedding;
        let podcast_id = msg.podcast_id;
        let episode_id = msg.episode_id;
        debug('STORE', batch, mark, chunker, embeder, podcast_id, episode_id);
        const OpenSearchClient = getOpenSearchClient(region, node);
        let storeRes = await store(OpenSearchClient, index, chunk, embedding);
        out.ok = 201 === storeRes.statusCode;
        out.podcast_id = podcast_id;
        out.episode_id = episode_id;
        return out;
    };
};
async function store(client, index, input, embeddings) {
    if (!input || !embeddings)
        throw new Error('Missing required input in store()!');
    return await client.index(createIndexObject(index, input, embeddings));
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
function createIndexObject(index, text, embeddings) {
    return {
        index,
        body: {
            text,
            document_vector: embeddings
        }
    };
}
exports.createIndexObject = createIndexObject;
//# sourceMappingURL=store_embed.js.map