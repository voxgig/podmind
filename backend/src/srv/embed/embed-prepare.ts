
module.exports = function make_prepare_embed() {
  return async function prepare_embed(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_embed')

    debug('done')
  }
}
