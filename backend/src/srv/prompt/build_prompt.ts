
module.exports = function make_build_prompt() {
  return async function build_prompt(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false }

    const name = out.name = msg.name
    const p = msg.p ?? {}

    const key = seneca.plugin.options.prefix + name
    const promptIdRes = await seneca.post('sys:config,get:val', { key })

    if (!promptIdRes.ok) {
      return promptIdRes
    }

    const promptEnt = await seneca.entity('pdm/prompt').load$(promptIdRes.val)

    if (null == promptEnt) {
      out.why = 'not-found'
      return out
    }

    const text = promptEnt.text

    const full = Object.entries(p)
      .reduce((text: string, n: any) => (text.replaceAll(n[0], n[1])), text)

    out.ok = true
    out.prompt = promptEnt.data$(false)
    out.full = full

    return out
  }
}


