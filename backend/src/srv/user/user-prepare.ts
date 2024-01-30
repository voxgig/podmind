
module.exports = function make_prepare_user() {
  return async function prepare_user(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_user')

    debug('done')
  }
}
