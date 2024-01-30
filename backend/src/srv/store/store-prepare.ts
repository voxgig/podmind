
import Axios from 'axios'


module.exports = function make_prepare_store() {
  return async function prepare_store(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_store')

    seneca.shared.Axios = Axios

    debug('done')
  }
}
