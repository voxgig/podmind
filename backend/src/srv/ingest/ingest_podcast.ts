import RssParser from 'rss-parser'


const parser = new RssParser()


module.exports = function make_ingest_podcast() {
  return async function ingest_podcast(this: any, msg: any) {
    const seneca = this

    let out: any = { ok: false, why: '' }

    let podcast_id = msg.podcast_id

    let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id)

    if (null == podcastEnt) {
      out.why = 'not-found'
      out.details = { podcast_id }
      return out
    }

    let feed = podcastEnt.feed
    let rss = await parser.parseURL(feed)
    let feedname = encodeURIComponent(feed.toLowerCase().replace(/^https?:\/\//, ''))

    await seneca.entity('pdm/rss').save$({
      id: 'folder01/rss01/' + feedname + '/' +
        podcastEnt.id + '~' + humanify(Date.now()) + '.rss',
      rss
    })

    let episodes = rss.items.slice(0, 1)

    out.episodes = episodes.length

    for (let epI = 0; epI < episodes.length; epI++) {
      let episode = episodes[epI]
      let episodeEnt = await seneca.entity('pdm/episode').load$({
        guid: episode.guid
      })

      // console.log('EP', epI, episode, episodeEnt)

      if (null == episodeEnt) {
        episodeEnt = await seneca.entity('pdm/episode').save$({
          podcast_id: podcastEnt.id,
          guid: episode.guid,
          title: episode.guid,
          link: episode.link,
          pubDate: episode.pubDate,
          content: episode.content,
          url: episode.enclosure?.url
        })
      }

      // console.log('EPISODE', episodeEnt)
      // seneca.act('aim:ingest,handle:episode', { episode_id: episodeEnt.id })
    }

    out.ok = true

    return out
  }
}



function humanify(when: number) {
  const d = new Date(when)
  return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
}
