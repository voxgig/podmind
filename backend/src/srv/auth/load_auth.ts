module.exports = function make_load_auth() {
  return async function load_auth(this: any, msg: any) {
    const seneca = this

    const { user_id } = msg

    let user = await this.entity('sys/user').load$(user_id)

    return {
      ok: !!user,
      state: user ? 'signedin' : 'signedout',
      user,
    }
  }
}

