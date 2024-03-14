"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_subscribe_podcast() {
    return async function subscribe_podcast(msg, meta) {
        // The current seneca instance.
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        const { humanify } = seneca.export('PodmindUtility/getUtils')();
        let out = { ok: false };
        // Associate all artifacts of a batch
        let batch = out.batch = msg.batch || ('B' + humanify());
        // Debugging mark
        let mark = out.mark = msg.mark || ('M' + seneca.util.Nid());
        // RSS URL
        let feed = out.feed = '' + msg.feed;
        // Processing controls (mostly for REPL use)
        let doUpdate = out.doUpdate = !!msg.doUpdate; // update data
        let doIngest = out.doIngest = !!msg.doIngest; // run ingestion
        let doExtract = out.doExtract = !!msg.doExtract; // use llm to extract more info
        let doAudio = out.doAudio = !!msg.doAudio; // download audio
        let doTranscribe = out.doTranscribe = !!msg.doTranscribe; // transcribe audio
        let episodeStart = out.episodeStart = parseInt(msg.episodeStart) || 0;
        let episodeEnd = out.episodeEnd = parseInt(msg.episodeEnd) || -1; /* -1 => all */
        let chunkEnd = out.chunkEnd = parseInt(msg.chunkEnd) || -1; /* -1 => all */
        let earmark = out.earmark = msg.earmark;
        debug && debug('START', batch, mark, feed);
        // Load the podcast by feed URL too see if we are already subscribed
        let podcastEnt = await seneca.entity('pdm/podcast').load$({ feed });
        // Download the RSS feed if new or updating
        if (null == podcastEnt || doUpdate) {
            let rssRes = await seneca.shared.getRSS(debug, feed, null, batch, mark);
            if (!rssRes.ok) {
                out.why = 'rss';
                out.errmsg = rssRes.err?.message || 'unknown-01';
                return out;
            }
            let rss = rssRes.rss;
            podcastEnt = podcastEnt || seneca.entity('pdm/podcast').make$();
            podcastEnt = await podcastEnt.save$({
                feed,
                title: rss.title,
                desc: rss.description,
                batch,
                earmark,
            });
        }
        if (null != podcastEnt) {
            debug && debug('SUBSCRIBE-ENT', batch, mark, doIngest, podcastEnt);
            const slog = await seneca.export('PodmindUtility/makeSharedLog')('podcast-ingest-01', podcastEnt.id);
            slog('SUBSCRIBE', batch, podcastEnt.id, feed, earmark);
            out.ok = true;
            out.podcast = podcastEnt.data$(false);
            if (doIngest) {
                await seneca.post('aim:ingest,ingest:podcast', {
                    podcast_id: podcastEnt.id,
                    doUpdate,
                    doIngest,
                    doExtract,
                    doAudio,
                    doTranscribe,
                    episodeStart,
                    episodeEnd,
                    chunkEnd,
                    mark,
                    batch,
                });
            }
        }
        else {
            out.why = 'podcast-not-found';
        }
        return out;
    };
};
//# sourceMappingURL=subscribe_podcast.js.map