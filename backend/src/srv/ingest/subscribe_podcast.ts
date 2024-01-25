
import type { RSS } from './ingest-types'


module.exports = function make_subscribe_podcast() {
  return async function subscribe_podcast(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '' }

    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())
    let feed = out.feed = '' + msg.feed
    let doUpdate = out.doUpdate = !!msg.doUpdate
    let doIngest = out.doIngest = !!msg.doIngest
    let doAudio = out.doAudio = false !== msg.doAudio /* download by default */
    let doTranscribe = out.doTranscribe = false !== msg.doTranscribe /* transcribe by default */
    let episodeStart = out.episodeStart = parseInt(msg.episodeStart) || 0
    let episodeEnd = out.episodeEnd = parseInt(msg.episodeEnd) || -1 /* -1 => all */

    debug && debug('START', mark, feed)

    out.feed = feed

    let podcastEnt = await seneca.entity('pdm/podcast').load$({ feed })

    if (null == podcastEnt || doUpdate) {
      let rssRes = await seneca.shared.getRSS(debug, feed, null, mark)

      if (!rssRes.ok) {
        out.why = 'rss'
        out.details = { feed, errmsg: rssRes.err.message }
        return out
      }

      let rss = rssRes.rss as RSS

      podcastEnt = podcastEnt || await seneca.entity('pdm/podcast').make$()
      podcastEnt = await podcastEnt.save$({
        feed,
        title: rss.title,
        desc: rss.description,
      })
    }

    if (null != podcastEnt) {
      debug && debug('SUBSCRIBE-ENT', mark, doIngest, podcastEnt)

      out.ok = true
      out.podcast = podcastEnt

      if (doIngest) {
        out.doIngest = true
        await seneca.post('aim:ingest,ingest:podcast', {
          podcast_id: podcastEnt.id,
          doUpdate,
          doIngest,
          mark,
          doAudio,
          doTranscribe,
          episodeStart,
          episodeEnd,
        })
      }
    }

    return out
  }
}

