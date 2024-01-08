
module.exports = function make_web_signout_user() {
  return async function web_signout_user(this: any, msg: any, meta: any) {
    const seneca = this

    let out: any = { ok: true }

    const principal = meta.custom.principal

    if (principal) {
      let res = await this.post('aim:auth,signout:user', {
        token: principal.login.token
      })

      out.ok = res.ok
    }

    out.gateway$ = {
      auth: {
        remove: true
      }
    }

    return out
  }
}





















