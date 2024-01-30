
module.exports = function make_prepare_chat() {
  return async function prepare_chat(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_chat')

    debug('done')
  }
}
