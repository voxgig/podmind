module.exports = function make_load_user() {
  return async function load_user(this: any, msg: any) {
    const seneca = this

    const { user_id } = msg

    let user = await this.entity('sys/user').load$(user_id)

    return {
      ok: !!user,
      user,
    }
  }
}

