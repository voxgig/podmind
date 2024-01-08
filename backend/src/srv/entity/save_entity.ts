module.exports = function make_save_entity() {
  return async function save_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let canon = msg.canon
    let ent = msg.ent
    let q = msg.q

    let res = await seneca.entity(canon).data$(ent).save$()

    return { ok: !!res, ent: res, q }
  }
}
