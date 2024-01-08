

module.exports = function make_web_reset_user() {
  return async function web_reset_user(this: any, msg: any) {
    const seneca = this


    let res = await this.post('aim:auth,reset:user', {
      email: msg.email,
    })

    let out: any = {
      ok: res.ok
    }

    return out
  }
}
