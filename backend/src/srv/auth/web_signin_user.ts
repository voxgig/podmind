

module.exports = function make_web_signin_user() {
  return async function web_signin_user(this: any, msg: any) {
    const seneca = this

    let res = await this.post('aim:auth,signin:user', {
      email: msg.email,
      password: msg.password,
    })

    let out: any = {
      ok: res.ok
    }

    if (res.ok) {
      out.gateway$ = {
        auth: {
          token: res.login.token
        }
      }
      out.user = res.user
    }


    return out
  }
}
