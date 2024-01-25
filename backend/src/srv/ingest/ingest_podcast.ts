
import type { RSS } from './ingest-types'

module.exports = function make_ingest_podcast() {
  return async function ingest_podcast(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false, why: '' }

    let podcast_id = msg.podcast_id
    let mark = msg.mark || seneca.util.Nid()
    let doUpdate = true === msg.doUpdate // save episode details to db
    let doIngest = true === msg.doIngest // trigger download and embedding
    let doAudio = false !== msg.doAudio // download by default
    let doTranscribe = false !== msg.doTranscribe // transcribe by default
    let episodeStart = msg.episodeStart || 0
    let episodeEnd = msg.episodeEnd || -1 // -1 => all
    let episodeGuid = msg.episodeGuid

    let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id)

    if (null == podcastEnt) {
      out.why = 'not-found'
      out.details = { podcast_id }
      return out
    }

    let feed = podcastEnt.feed
    let rssRes = await seneca.options.getRSS(debug, feed, podcast_id, mark)

    if (!rssRes.ok) {
      out.why = 'rss'
      out.details = { podcast_id, errmsg: rssRes.err.message }
      return out
    }

    let rss = rssRes.rss as RSS
    let feedname = encodeURIComponent(feed.toLowerCase().replace(/^https?:\/\//, ''))

    await seneca.entity('pdm/rss').save$({
      id: 'folder01/rss01/' + feedname + '/' +
        podcastEnt.id + '~' + seneca.shared.humanify(Date.now()) + '.rss',
      rss
    })

    let episodes = rss.items
    debug && debug('EPISODES', mark, podcastEnt.id, feed, episodes.length)

    out.episodes = episodes.length
    episodeEnd = 0 <= episodeEnd ? episodeEnd : episodes.length


    async function handleEpisode(episode: any, epI: number) {
      let episodeEnt = await seneca.entity('pdm/episode').load$({
        guid: episode.guid
      })

      if (null == episodeEnt) {
        episodeEnt = seneca.entity('pdm/episode')
      }

      await episodeEnt.save$({
        podcast_id: podcastEnt.id,
        guid: episode.guid,
        title: episode.title,
        link: episode.link,
        pubDate: episode.pubDate,
        content: episode.content,
        url: episode.enclosure?.url
      })

      if (doIngest) {
        seneca.act('aim:ingest,handle:episode',
          { episode_id: episodeEnt.id, podcast_id, doAudio, doTranscribe, mark })
      }

      debug && debug('EPISODE-SAVE', mark, podcastEnt.id, epI, doIngest, episode.guid)

    }

    if (doUpdate) {
      if (episodeGuid) {
        let episode = episodes.find((episode: any) => episodeGuid === episode.guid)
        if (episode) {
          await handleEpisode(episode, -1)
        }
        else {
          out.why = 'episode-not-found'
          return out
        }
      }
      else {
        for (let epI = episodeStart; epI < episodeEnd; epI++) {
          let episode = episodes[epI]
          await handleEpisode(episode, epI)
        }
      }
    }

    out.ok = true

    return out
  }
}


