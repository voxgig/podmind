
module.exports = function make_prepare_embed() {
  return async function prepare_embed(this: any, _msg: any, meta: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug(meta.action)

    debug('done')
  }
}
