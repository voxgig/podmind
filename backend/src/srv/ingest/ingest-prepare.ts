module.exports = function make_prepare_ingest() {
  return async function prepare_ingest(this: any) {
    let seneca = this

    // TODO: implement conf, also for deps
    seneca.shared.debug =
      // seneca.plugin.options.debug ?
      (mark: string) => (...args: any[]) => console.log('##', mark, ...args)
    // : (_mark: string) => null


    seneca.shared.humanify = (when: number) => {
      const d = new Date(when)
      return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''))
    }


    seneca.shared.listPaths = (event: any) => {
      const paths = event?.Records?.map((r: any) =>
        decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '))
      return paths
    }
  }
}
