module.exports = function make_cmd_reset() {
  return async function cmd_reset(this: any, msg: any) {
    const seneca = this

    return { ok: true, srv: 'auth' }
  }
}
