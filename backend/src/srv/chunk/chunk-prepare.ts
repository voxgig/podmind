
module.exports = function make_prepare_chunk() {
  return async function prepare_chunk(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_chunk')

    debug('done')
  }
}
