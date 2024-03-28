"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_store_embed() {
    return async function store_embed(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        const { humanify } = seneca.export('PodmindUtility/getUtils')();
        let out = { ok: false, why: '' };
        let batch = out.batch = msg.batch || ('B' + humanify());
        let mark = out.mark = msg.mark || ('M' + seneca.util.Nid());
        let chunk = out.chunk = msg.chunk;
        let chunker = out.chunker = msg.chunker; //  chunking algo
        let embeder = out.embeder = msg.embeder; //  embedding mark
        let embedding = msg.embedding;
        // TODO: validate - required!
        let podcast_id = msg.podcast_id;
        let episode_id = msg.episode_id;
        // let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id)
        // TODO: if not found
        const slog = await seneca.export('PodmindUtility/makeSharedLog')('podcast-ingest-01', podcast_id);
        debug('STORE', batch, mark, chunker, embeder, podcast_id, episode_id);
        const data = {
            knd: chunk.knd,
            txt: chunk.txt,
            bgn: chunk.bgn,
            end: chunk.end,
            dur: chunk.dur,
            podcast_id,
            episode_id,
            directive$: { vector$: true },
        };
        console.log('CHUNK DATA', data);
        data.vector = embedding;
        const chunkEnt = await seneca.entity('vector/podchunk').data$(data).save$();
        console.log('CHUNK ENT', chunkEnt);
        let chunkdata = chunkEnt.data$(false);
        delete chunkdata.vector;
        out.ok = true;
        out.chunkdata = chunkdata;
        out.podcast_id = podcast_id;
        out.episode_id = episode_id;
        slog('STORE', batch, podcast_id, episode_id, embedding.length, chunker, embeder);
        return out;
    };
};
//# sourceMappingURL=store_embed.js.map