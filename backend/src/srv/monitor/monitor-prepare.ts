

module.exports = function make_prepare_monitor() {
  return async function prepare_monitor(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_monitor')

    debug('done')
  }
}
