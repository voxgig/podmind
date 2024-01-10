module.exports = function make_handle_transcript() {
  return async function handle_transcript(this: any, msg: any) {
    const seneca = this

    let out: any = { ok: false, why: '', path: '', paths: [] }

    let path = msg.path

    // AWS S3 event
    if (null == path) {
      // const bucket = event.Records[0].s3.bucket.name

      console.log('Records', msg.event?.Records)

      const paths = msg.event?.Records?.map((r: any) => // r.s3.object.key)
        decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '))

      console.log('MULTIPLE PATHS', paths)

      if (paths && 0 < paths.length) {
        out.ok = true

        for (path of paths) {
          let pathres = await seneca.post('aim:ingest,handle:transcript', {
            path
          })

          out.paths.push({
            path,
            ...pathres,
          })
          out.ok = out.ok && pathres.ok
        }
      }

      return out
    }
    else {
      console.log('SINGLE PATH', path)

      // folder01/transcript01/PODCASTID-EPISODEID.txt
      // let m = path.match(/folder01\/transcript01\/(([a-f0-9]{32})-([a-f0-9]{32}).txt)$/)
      // let m = path.match(/folder01\/transcript01\/(([^-]+)-([^-]+).txt)$/)
      let m = path.match(/folder01\/transcript01\/([^-]+)\/([^-]+)/)

      if (null == m) {
        out.why = 'filename-mismatch'
        return out
      }

      // let filepath = m[0]
      // let filename = m[1]
      let podcast_id = m[1]
      let episode_id = m[2]

      console.log('TRANSCRIPT', path, podcast_id, episode_id)

      out = await seneca.post('aim:ingest,whence:upload,ingest:transcript', {
        filepath: path,
        podcast_id,
        episode_id,
      })
    }

    return out
  }
}

