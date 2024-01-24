import RssParser from 'rss-parser'


const parser = new RssParser()


module.exports = function make_subscribe_podcast() {
  return async function subscribe_podcast(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '' }

    let mark = out.mark = msg.mark || seneca.util.Nid()
    let feed = msg.feed
    let doUpdate = msg.doUpdate
    let doIngest = msg.doIngest
    let doAudio = false !== msg.doAudio // download by default

    out.feed = feed

    let podcastEnt = await seneca.entity('pdm/podcast').load$({ feed })

    if (null == podcastEnt || doUpdate) {
      let rss = await parser.parseURL(feed)

      podcastEnt = podcastEnt || await seneca.entity('pdm/podcast').make$()
      podcastEnt = await podcastEnt.save$({
        feed,
        title: rss.title,
        desc: rss.description,
      })
    }

    if (null != podcastEnt) {
      debug && debug('SUBSCRIBE', mark, podcastEnt)

      out.ok = true
      out.podcast = podcastEnt

      if (doIngest) {
        out.doIngest = true
        seneca.act('aim:ingest,ingest:podcast', {
          podcast_id: podcastEnt.id,
          doUpdate,
          doIngest,
          mark,
          doAudio,
        })
      }
    }

    return out
  }
}

