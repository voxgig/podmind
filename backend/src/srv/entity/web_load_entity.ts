module.exports = function make_web_load_entity() {
  return async function web_load_entity(this: any, msg: any) {
    const seneca = this

    // TODO: review
    let entmsg = {
      aim: 'entity',
      load: 'entity',
      canon: msg.canon,
      ent: msg.ent,
      q: msg.q,
    }

    let out = await seneca.post(entmsg)

    return out
  }
}
