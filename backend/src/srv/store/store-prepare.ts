
import Axios from 'axios'


module.exports = function make_prepare_store() {
  return async function prepare_store(this: any, _msg: any, meta: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug(meta.action)

    seneca.shared.Axios = Axios

    debug('done')
  }
}
