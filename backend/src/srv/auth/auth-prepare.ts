
module.exports = function make_prepare_audio() {
  return async function prepare_audio(this: any, _msg: any, meta: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug(meta.action)

    debug('done')
  }
}
