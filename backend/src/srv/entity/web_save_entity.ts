module.exports = function make_web_save_entity() {
  return async function web_save_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let entmsg = {
      aim: 'entity',
      save: 'entity',
      canon: msg.canon,
      ent: msg.ent,
      q: msg.q,
    }

    let out = await seneca.post(entmsg)

    return out
  }
}
