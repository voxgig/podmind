import RssParser from 'rss-parser'


const parser = new RssParser()


module.exports = function make_subscribe_podcast() {
  return async function subscribe_podcast(this: any, msg: any) {
    const seneca = this

    let out: any = { ok: false, why: '' }

    let feed = msg.feed
    let update = msg.update
    let ingest = msg.ingest

    let podcastEnt = await seneca.entity('pdm/podcast').load$({ feed })

    if (null == podcastEnt || update) {
      let rss = await parser.parseURL(feed)

      podcastEnt = podcastEnt || await seneca.entity('pdm/podcast').make$()
      podcastEnt = await podcastEnt.save$({
        feed,
        title: rss.title,
        desc: rss.description,
      })
    }

    if (null != podcastEnt) {
      console.log(podcastEnt)

      out.ok = true
      out.podcast = podcastEnt

      if (ingest) {
        out.ingest = true
        seneca.act('aim:ingest,ingest:podcast', {
          podcast_id: podcastEnt.id
        })
      }
    }

    return out
  }
}

