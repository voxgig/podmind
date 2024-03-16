"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_ingest_podcast() {
    return async function ingest_podcast(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        const { humanify } = seneca.export('PodmindUtility/getUtils')();
        let out = { ok: false, why: '' };
        let batch = out.batch = msg.batch || ('B' + humanify());
        let mark = out.mark = msg.mark || ('M' + seneca.util.Nid());
        let podcast_id = msg.podcast_id;
        // Processing controls
        let doUpdate = out.doUpdate = !!msg.doUpdate;
        let doIngest = out.doIngest = !!msg.doIngest;
        let doExtract = out.doExtract = !!msg.doExtract;
        let doAudio = out.doAudio = !!msg.doAudio;
        let doTranscribe = out.doTranscribe = !!msg.doTranscribe;
        let episodeStart = out.episodeStart = parseInt(msg.episodeStart) || 0;
        let episodeEnd = out.episodeEnd = parseInt(msg.episodeEnd) || -1; /* -1 => all */
        let episodeGuid = out.episodeGuid = msg.episodeGuid;
        let chunkEnd = out.chunkEnd = parseInt(msg.chunkEnd) || -1; /* -1 => all */
        debug && debug('START', batch, mark, podcast_id);
        let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id);
        if (null == podcastEnt) {
            out.why = 'podcast-not-found';
            debug && debug('FAIL-PODENT', batch, mark, podcast_id, out);
            return out;
        }
        let feed = podcastEnt.feed;
        debug && debug('GET-RSS', batch, mark, podcastEnt);
        // TODO: also accept from args to avoid double download
        let rssRes = await seneca.shared.getRSS(debug, feed, podcast_id, mark);
        if (!rssRes.ok) {
            out.why = 'rss';
            out.errmsg = rssRes.err?.message || 'unknown-01';
            debug && debug('FAIL-RSS', batch, mark, podcast_id, out);
            return out;
        }
        let rss = rssRes.rss;
        let feedname = encodeURIComponent(feed.toLowerCase().replace(/^https?:\/\//, ''));
        await seneca.entity('pdm/rss').save$({
            id: 'rss01/' + feedname + '/' +
                podcastEnt.id + '-' + batch + '.rss',
            rss
        });
        let episodes = rss.items;
        debug && debug('EPISODES', batch, mark, podcastEnt.id, feed, episodeStart, episodeEnd, episodeGuid, episodes.length);
        out.episodes = episodes.length;
        episodeEnd = 0 <= episodeEnd ? episodeEnd : episodes.length;
        const slog = await seneca.export('PodmindUtility/makeSharedLog')('podcast-ingest-01', podcastEnt.id);
        slog('INGEST', batch, podcastEnt.id, episodes.length);
        if (doUpdate) {
            // Operate on one specific episode
            if (episodeGuid) {
                let episode = episodes.find((episode) => episodeGuid === episode.guid);
                if (episode) {
                    await handleEpisode(episode, -1);
                }
                else {
                    out.why = 'episode-guid-not-found';
                    return out;
                }
            }
            // Operate on all episodes.
            else {
                for (let epI = episodeStart; epI < episodeEnd; epI++) {
                    let episode = episodes[epI];
                    await handleEpisode(episode, epI);
                }
            }
        }
        async function handleEpisode(episode, epI) {
            debug && debug('HANDLE-EPISODE', batch, mark, podcastEnt.id, epI, episode?.guid, !!episode);
            slog('SEND-PROCESS', batch, podcastEnt.id, epI, episode.guid, episode.title);
            await seneca.post('aim:ingest,process:episode', {
                episode,
                podcast_id,
                doUpdate,
                doExtract,
                doIngest,
                doAudio,
                doTranscribe,
                mark,
                batch,
                chunkEnd,
            });
            debug && debug('EPISODE-PROCESS', batch, mark, podcastEnt.id, epI, episode.guid, doAudio, doTranscribe, doIngest, doUpdate);
        }
        out.ok = true;
        return out;
    };
};
//# sourceMappingURL=ingest_podcast.js.map