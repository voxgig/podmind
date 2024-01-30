
module.exports = function make_prepare_audio() {
  return async function prepare_audio(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_audio')

    debug('done')
  }
}
