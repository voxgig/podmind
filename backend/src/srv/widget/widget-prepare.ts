
module.exports = function make_prepare_widget() {
  return async function prepare_widget(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_widget')

    debug('done')
  }
}
