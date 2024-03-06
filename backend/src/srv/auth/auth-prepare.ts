
module.exports = function make_prepare_auth() {
  return async function prepare_auth(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_auth')

    debug('done')
  }
}
