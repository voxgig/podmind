
import type { RSS } from './ingest-types'


module.exports = function make_subscribe_podcast() {
  return async function subscribe_podcast(this: any, msg: any, meta: any) {
    // The current seneca instance.
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    let out: any = { ok: false }

    // Associate all artifacts of a batch
    let batch = out.batch = msg.batch || ('B' + humanify())

    // Debugging mark
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())

    // RSS URL
    let feed = out.feed = '' + msg.feed

    // Processing controls
    let doUpdate = out.doUpdate = !!msg.doUpdate
    let doIngest = out.doIngest = !!msg.doIngest
    let doAudio = out.doAudio = !!msg.doAudio
    let doTranscribe = out.doTranscribe = !!msg.doTranscribe
    let episodeStart = out.episodeStart = parseInt(msg.episodeStart) || 0
    let episodeEnd = out.episodeEnd = parseInt(msg.episodeEnd) || -1 /* -1 => all */
    let chunkEnd = out.chunkEnd = parseInt(msg.chunkEnd) || -1 /* -1 => all */

    debug && debug('START', batch, mark, feed)

    // Load the podcast by feed URL too see if we are already subscribed
    let podcastEnt = await seneca.entity('pdm/podcast').load$({ feed })

    // Download the RSS feed if new or updating
    if (null == podcastEnt || doUpdate) {
      let rssRes = await seneca.shared.getRSS(debug, feed, null, batch, mark)

      if (!rssRes.ok) {
        out.why = 'rss'
        out.errmsg = rssRes.err?.message || 'unknown-01'
        return out
      }

      let rss = rssRes.rss as RSS

      podcastEnt = podcastEnt || seneca.entity('pdm/podcast').make$()
      podcastEnt = await podcastEnt.save$({
        feed,
        title: rss.title,
        desc: rss.description,
        batch,
      })
    }

    if (null != podcastEnt) {
      debug && debug('SUBSCRIBE-ENT', batch, mark, doIngest, podcastEnt)

      const slog = await seneca.export('PodmindUtility/makeSharedLog')(
        'podcast-ingest-01', podcastEnt.id)

      slog('SUBSCRIBE', batch, podcastEnt.id, feed)

      out.ok = true
      out.podcast = podcastEnt.data$(false)

      if (doIngest) {
        await seneca.post('aim:ingest,ingest:podcast', {
          podcast_id: podcastEnt.id,
          doUpdate,
          doIngest,
          mark,
          batch,
          doAudio,
          doTranscribe,
          episodeStart,
          episodeEnd,
          chunkEnd,
        })
      }
    }
    else {
      out.why = 'podcast-not-found'
    }

    return out
  }
}

