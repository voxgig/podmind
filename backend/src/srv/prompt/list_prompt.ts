
module.exports = function make_list_prompt() {
  return async function list_prompt(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false }

    const { q } = msg

    const list = await seneca.entity('pdm/prompt').list$(q)

    out.ok = true
    out.list = list.map((n: any) => n.data$(false))

    return out
  }
}


