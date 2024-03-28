
module.exports = function make_process_episode_voxgigfireside() {
  return async function process_episode_voxgigfireside(this: any, msg: any) {
    const seneca = this

    const podcast_earmark = msg.podcast_earmark
    const podcast_id = msg.podcast_id || msg.episode.podcast_id
    const episode = msg.episode

    const options = this.plugin.options.podcast[podcast_earmark] || {}

    const podcastCache = (this.shared.podcast = (this.shared.podcast || {}))

    const podcastEntry = podcastCache[podcast_id] || (podcastCache[podcast_id] = {
      webflow: { items: null }
    })

    if (null == podcastEntry.webflow.items) {
      let q = {
        collection_id: options.webflow?.collection_id
      }

      console.log('WEBFLOW LIST', q)
      podcastEntry.webflow.items = await seneca.entity('provider/webflow/colitem').list$(q)
    }


    seneca.root.context.vxgwf = (seneca.root.context.vxgwf || { found: [], notfound: [] })

    const item = podcastEntry.webflow.items
      .find((item: any) => episode.guid === item.fieldData.uuid)

    if (item) {
      episode.pageslug = episode.pageslug || item.fieldData.slug
      episode.guestlink = episode.guestlink || item.fieldData['guest-speaker-link-to-social-or-website']
      episode.page = episode.page || 'https://www.voxgig.com/podcast/' + episode.pageslug
      episode.vxgfound = true

      seneca.root.context.vxgwf.found.push({ u: episode.guid, s: item.fieldData.slug })
    }
    else {
      episode.pageslug = '--none--'
      episode.guestlink = 'https://www.voxgig.com/podcast'
      episode.page = 'https://www.voxgig.com/podcast'
      episode.vxgfound = false
      seneca.root.context.vxgwf.notfound.push({ u: episode.guid, t: episode.title })
    }

    return {
      ok: true,
      episode,
    }
  }
}
