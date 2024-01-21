module.exports = function make_prepare_ingest() {
  return async function prepare_ingest(this: any) {
    let seneca = this

    if (seneca.plugin.options.debug) {
      seneca.shared.debug =
        (mark: string) => (...args: any[]) => console.log('##', mark, ...args)
    }

    seneca.shared.humanify = (when: number) => {
      const d = new Date(when)
      return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
    }
  }
}
