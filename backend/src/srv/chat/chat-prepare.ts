
module.exports = function make_prepare_chat() {
  return async function prepare_chat(this: any, _msg: any, meta: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug(meta.action)

    debug('done')
  }
}
