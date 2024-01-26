
import Axios from 'axios'


module.exports = function make_prepare_store() {
  return async function prepare_store(this: any) {
    let seneca = this

    // TODO: implement conf, also for deps
    seneca.shared.debug =
      // seneca.plugin.options.debug ?
      (mark: string) => (...args: any[]) => console.log('##', mark, ...args)
    // : (_mark: string) => null

    seneca.shared.Axios = Axios

    seneca.shared.humanify = (when: number) => {
      const d = new Date(when)
      return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
    }

  }
}
