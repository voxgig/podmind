module.exports = function make_load_entity() {
  return async function load_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let canon = msg.canon
    let ent = msg.ent
    let q = msg.q

    let res = await seneca.entity(canon).load$(q)

    return { ok: !!res, ent: res, q }
  }
}
