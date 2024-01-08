module.exports = function make_get_info() {
  return async function get_info(this: any, msg: any) {
    const seneca = this

    return { ok: true, srv: 'monitor' }
  }
}
