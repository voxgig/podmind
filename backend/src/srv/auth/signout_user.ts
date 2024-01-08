module.exports = function make_signout_user() {
  return async function signout_user(this: any, msg: any) {
    const seneca = this

    const token = msg.token

    let out = await seneca.post('sys:user,logout:user', {
      token
    })

    return out
  }
}
