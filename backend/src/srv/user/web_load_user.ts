
module.exports = function make_web_load_user() {
  return async function web_load_user(this: any, msg: any, meta: any) {
    const seneca = this
    const user = meta.custom.principal?.user

    let out: any = {
      ok: false
    }

    if (user) {
      let res = await this.post('aim:user,load:user', {
        user_id: user.id
      })

      if (!res.ok) {
        return res
      }

      out.ok = true
      out.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
      }
    }

    return out
  }
}
