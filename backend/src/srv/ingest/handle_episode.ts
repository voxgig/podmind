const Axios = require('axios')

module.exports = function make_handle_episode() {
  return async function handle_episode(this: any, msg: any) {
    const seneca = this

    let out: any = { ok: false, why: '', paths: [], episode_id: '' }

    let episode_id = msg.episode_id

    // AWS S3 event
    if (null == episode_id) {
      // const bucket = event.Records[0].s3.bucket.name

      console.log('Records', msg.event?.Records)

      const paths = msg.event?.Records?.map((r: any) => // r.s3.object.key)
        decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '))

      console.log('MULTIPLE PATHS', paths)

      if (paths && 0 < paths.length) {
        out.ok = true

        for (let path of paths) {
          let m = path.match(/^\/folder01\/rss01\/.*\/([^~]+)~\d+\.rss/)
          if (m) {
            episode_id = m[1]
            let pathres = await seneca.post('aim:ingest,handle:episode', {
              episode_id
            })

            out.paths.push({
              path,
              ...pathres,
            })
            out.ok = out.ok && pathres.ok
          }
        }
      }

      return out
    }
    else {
      console.log('SINGLE EPISODE', episode_id)
      out.episode_id = episode_id
      let episodeEnt = await seneca.entity('pdm/episode').load$(episode_id)
      if (episodeEnt) {
        let url = episodeEnt.url

        let res = await Axios.get(url, { responseType: "arraybuffer" })

        console.log('EPISODE', episode_id, url, res)

        if (200 === res.status) {
          await seneca.entity('pdm/audio').save$({
            bin$: 'content',
            id: 'folder01/audio01/' + episodeEnt.podcast_id + '/' +
              episodeEnt.id + '.mp3',
            content: res.data
          })

          out.size = res.data.length
          out.ok = true
        }
      }
      else {
        out.why = 'not-found'
      }
    }

    return out
  }
}

