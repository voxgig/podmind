import RssParser from 'rss-parser'

const Parser = new RssParser()


module.exports = function make_prepare_ingest() {
  return async function prepare_ingest(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_ingest')

    seneca.shared.getRSS =
      async function(debug: any, feed: string, podcast_id: string, batch: string, mark: string) {
        try {
          return { ok: true, rss: await Parser.parseURL(feed) }
        }
        catch (err: any) {
          debug && debug('getRSS', batch, mark, podcast_id, feed, err)
          return { ok: false, err }
        }
      }

    debug('done')
  }
}
