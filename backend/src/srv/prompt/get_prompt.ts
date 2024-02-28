
module.exports = function make_get_prompt() {
  return async function get_prompt(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false }

    const name = out.name = msg.name

    const key = seneca.plugin.options.prefix + name
    const currentRes = await seneca.post('sys:config,get:val', { key })

    if (!currentRes.ok) {
      currentRes.why = (currentRes.why ? currentRes.why + '/' : '') + 'name-not-found'
      return currentRes
    }

    out.prompt_id = currentRes.val
    const promptEnt = await seneca.entity('pdm/prompt').load$(currentRes.val)

    if (null == promptEnt) {
      out.why = 'prompt-not-found'
      return out
    }

    out.ok = true
    out.prompt = promptEnt.data$(false)

    return out
  }
}


