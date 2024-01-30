module.exports = function make_prepare_entity() {
  return async function prepare_entity(this: any, _msg: any, meta: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug(meta.action)

    debug('done')
  }
}
