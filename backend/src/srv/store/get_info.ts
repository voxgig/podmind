module.exports = function make_get_info() {
  return async function get_info(this: any, _msg: any) {
    const seneca = this

    const debug = !!seneca.plugin.options.debug

    return { ok: true, srv: 'store', when: Date.now(), debug }
  }
}
