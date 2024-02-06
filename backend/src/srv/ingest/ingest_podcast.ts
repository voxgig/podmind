
import type { RSS } from './ingest-types'

module.exports = function make_ingest_podcast() {
  return async function ingest_podcast(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)
    const { humanify } = seneca.export('PodmindUtility/getUtils')()

    let out: any = { ok: false, why: '' }
    let batch = out.batch = msg.batch || ('B' + humanify())
    let mark = out.mark = msg.mark || ('M' + seneca.util.Nid())

    let podcast_id = msg.podcast_id

    // Processing controls
    let doUpdate = out.doUpdate = !!msg.doUpdate
    let doIngest = out.doIngest = !!msg.doIngest
    let doAudio = out.doAudio = !!msg.doAudio
    let doTranscribe = out.doTranscribe = !!msg.doTranscribe
    let episodeStart = out.episodeStart = parseInt(msg.episodeStart) || 0
    let episodeEnd = out.episodeEnd = parseInt(msg.episodeEnd) || -1 /* -1 => all */
    let episodeGuid = out.episodeGuid = msg.episodeGuid


    debug && debug('START', batch, mark, podcast_id)

    let podcastEnt = await seneca.entity('pdm/podcast').load$(podcast_id)

    if (null == podcastEnt) {
      out.why = 'podcast-not-found'
      debug && debug('FAIL-PODENT', batch, mark, podcast_id, out)
      return out
    }

    let feed = podcastEnt.feed


    debug && debug('GET-RSS', batch, mark, podcastEnt)

    // TODO: also accept from args to avoid double download
    let rssRes = await seneca.shared.getRSS(debug, feed, podcast_id, mark)

    if (!rssRes.ok) {
      out.why = 'rss'
      out.errmsg = rssRes.err?.message || 'unknown-01'
      debug && debug('FAIL-RSS', batch, mark, podcast_id, out)
      return out
    }

    let rss = rssRes.rss as RSS
    let feedname = encodeURIComponent(feed.toLowerCase().replace(/^https?:\/\//, ''))

    await seneca.entity('pdm/rss').save$({
      id: 'rss01/' + feedname + '/' +
        podcastEnt.id + '-' + batch + '.rss',
      rss
    })

    let episodes = rss.items


    debug && debug('EPISODES',
      batch, mark, podcastEnt.id, feed, episodeStart, episodeEnd, episodeGuid, episodes.length)

    out.episodes = episodes.length
    episodeEnd = 0 <= episodeEnd ? episodeEnd : episodes.length

    if (doUpdate) {
      if (episodeGuid) {
        let episode = episodes.find((episode: any) => episodeGuid === episode.guid)
        if (episode) {
          await handleEpisode(episode, -1)
        }
        else {
          out.why = 'episode-guid-not-found'
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


    async function handleEpisode(episode: any, epI: number) {
      let episodeEnt = await seneca.entity('pdm/episode').load$({
        guid: episode.guid
      })

      if (null == episodeEnt) {
        episodeEnt = seneca.entity('pdm/episode')
      }

      episodeEnt = await episodeEnt.save$({
        podcast_id: podcastEnt.id,
        guid: episode.guid,
        title: episode.title,
        link: episode.link,
        pubDate: episode.pubDate,
        content: episode.content,
        url: episode.enclosure?.url,
        batch,
      })

      if (doAudio) {
        await seneca.post('aim:store,download:audio', {
          episode_id: episodeEnt.id,
          podcast_id,
          doAudio,
          doTranscribe,
          mark,
          batch,
        })
      }

      debug && debug('EPISODE-SAVE', batch, mark, podcastEnt.id, epI, doIngest, episode.guid)
    }


    out.ok = true

    return out
  }
}


