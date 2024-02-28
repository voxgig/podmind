import RssParser from 'rss-parser'

const Parser = new RssParser()


module.exports = function make_prepare_prompt() {
  return async function prepare_prompt(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_prompt')

    debug('done')
  }
}
