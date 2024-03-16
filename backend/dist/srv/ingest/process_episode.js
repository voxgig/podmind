"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_process_episode() {
    return async function ingest_process_episode(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        const { humanify } = seneca.export('PodmindUtility/getUtils')();
        let out = { ok: false, why: '' };
        let batch = out.batch = msg.batch || ('B' + humanify());
        let mark = out.mark = msg.mark || ('M' + seneca.util.Nid());
        let podcast_id = msg.podcast_id;
        let episode_id = out.episode_id = msg.episode_id; // optional
        let episode = msg.episode; // optional, episode RSS item
        // Processing controls
        let doUpdate = out.doUpdate = !!msg.doUpdate;
        let doIngest = out.doIngest = !!msg.doIngest;
        let doExtract = out.doExtract = !!msg.doExtract;
        let doAudio = out.doAudio = !!msg.doAudio;
        let doTranscribe = out.doTranscribe = !!msg.doTranscribe;
        let chunkEnd = out.chunkEnd = parseInt(msg.chunkEnd) || -1; /* -1 => all */
        debug && debug('PROCESS-START', batch, mark, podcast_id, episode_id, !!episode);
        let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id);
        if (null == podcastEnt) {
            out.why = 'podcast-not-found';
            debug && debug('PROCESS-FAIL-PODENT', batch, mark, podcast_id, out);
            return out;
        }
        if (doUpdate) {
            let episodeEnt = await seneca.entity('pdm/episode');
            if (null != episode_id) {
                episodeEnt = await episodeEnt.load$(episode_id);
                if (null === episodeEnt) {
                    out.why = 'podcast-not-found';
                    debug && debug('PROCESS-FAIL-EPISODEID-NOTFOUND', batch, mark, podcast_id, episode_id, out);
                    return out;
                }
            }
            else if (null != episode) {
                episodeEnt = await episodeEnt.load$({
                    guid: episode.guid
                });
            }
            else {
                out.why = 'podcast-not-found';
                debug && debug('PROCESS-FAIL-NO-EPISODE', batch, mark, podcast_id, episode_id, out);
                return out;
            }
            if (null == episodeEnt) {
                episodeEnt = seneca.entity('pdm/episode');
            }
            if (null != episode) {
                episodeEnt = await episodeEnt.save$({
                    podcast_id: podcastEnt.id,
                    guid: episode.guid,
                    title: episode.title,
                    link: episode.link,
                    pubDate: episode.pubDate,
                    content: episode.content,
                    url: episode.enclosure?.url,
                    batch,
                    episode: JSON.stringify(episode),
                });
            }
            if (null == episodeEnt) {
                out.why = 'podcast-not-found';
                debug && debug('PROCESS-FAIL-NO-EPISODE-ENT', batch, mark, podcast_id, episode_id, out);
                return out;
            }
            const slog = await seneca.export('PodmindUtility/makeSharedLog')('podcast-ingest-01', podcastEnt.id);
            slog('EPISODE', batch, podcastEnt.id, episodeEnt.id, episodeEnt.guid, episodeEnt.title);
            if (doIngest) {
                let description = `${episodeEnt.title}: ${episodeEnt.content}`;
                if (doExtract) {
                    // To update via REPL:
                    // aim:prompt,add:prompt,name:ingest.episode.meta01,
                    //   text:<% Load("data/config/prompt/ingest.episode.meta01-v0.txt") %>
                    const promptRes = await seneca.post('aim:prompt,build:prompt,name:ingest.episode.meta01', {
                        p: {
                            '<<DESCRIPTION>>': description
                        }
                    });
                    if (!promptRes.ok) {
                        out.why = 'prompt-failed/' + promptRes.why;
                        debug && debug('PROCESS-FAIL-PROMPT', batch, mark, podcast_id, episodeEnt.id, out);
                        return out;
                    }
                    const query = promptRes.full;
                    let info = {};
                    let tryI = 0;
                    // Retry extraction if JSON reply is invalid
                    extract: for (; tryI < 7; tryI++) {
                        info.ok = false;
                        slog('EPISODE-QUERY', batch, podcastEnt.id, episodeEnt.id, episodeEnt.guid, tryI, episodeEnt.title);
                        let processRes = await seneca.post('sys:chat,submit:query', {
                            query
                        });
                        if (!processRes.ok) {
                            out.why = 'desc-failed/' + processRes.why;
                            debug && debug('PROCESS-FAIL-DESC', batch, mark, podcast_id, episodeEnt.id, out);
                            return out;
                        }
                        try {
                            info = JSON.parse(processRes.answer);
                            info.ok = true;
                        }
                        catch (e) {
                            debug && debug('PROCESS-FAIL-QUERY-JSON', batch, mark, podcast_id, episodeEnt.id, e.message, out, tryI, processRes.answer);
                        }
                        if (info.ok) {
                            episodeEnt.guest = info.guest;
                            episodeEnt.topics = info.topics;
                            episodeEnt.links = info.links;
                            episodeEnt.extracted = Date.now();
                            await episodeEnt.save$();
                            break extract;
                        }
                    }
                    if (!info.ok) {
                        slog('EPISODE-FAIL', batch, podcastEnt.id, episodeEnt.id, episodeEnt.guid, episodeEnt.title, 'QUERY-JSON', tryI);
                        episodeEnt.extracted = 0; // Mark as incomplete for manual correction
                        await episodeEnt.save$();
                    }
                }
                const customRes = await seneca.post('concern:episode,process:episode', {
                    podcast_id: podcastEnt.id,
                    podcast_earmark: podcastEnt.earmark,
                    episode: episodeEnt,
                    default$: {
                        ok: true,
                        episode: episodeEnt
                    }
                });
                if (customRes.ok) {
                    episodeEnt.data$(customRes.episode);
                    console.log('CUSTOM PROCESS', customRes.episode, episodeEnt);
                    await episodeEnt.save$();
                    debug && debug('PROCESS-EPISODE', batch, mark, podcast_id, episodeEnt.id, podcastEnt.earmark, episodeEnt.title);
                }
                else {
                    debug && debug('PROCESS-FAIL-CUSTOM', batch, mark, podcast_id, episodeEnt.id, podcastEnt.earmark, out, customRes);
                    slog('EPISODE-FAIL', batch, podcastEnt.id, episodeEnt.id, episodeEnt.guid, episodeEnt.title, podcastEnt.earmark, 'CUSTOM', customRes);
                }
            }
            if (doAudio) {
                await seneca.post('aim:store,download:audio', {
                    episode_id: episodeEnt.id,
                    podcast_id,
                    doAudio,
                    doTranscribe,
                    mark,
                    batch,
                    chunkEnd,
                });
            }
            debug && debug('PROCESS-EPISODE-SAVE', batch, mark, podcastEnt.id, podcastEnt.earmark, episodeEnt.id, episodeEnt.guid, doIngest, doAudio, doTranscribe);
        }
        out.ok = true;
        return out;
    };
};
//# sourceMappingURL=process_episode.js.map