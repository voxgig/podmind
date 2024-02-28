
module.exports = function make_add_prompt() {
  return async function add_prompt(this: any, msg: any, meta: any) {
    const seneca = this
    const debug = seneca.shared.debug(meta.action)

    let out: any = { ok: false }

    const { name, text, set } = msg
    let { kind, tag } = msg

    out.name = name

    // If kind, tag not specified, inherit from current prompt.

    const key = seneca.plugin.options.prefix + name
    const currentRes =
      await seneca.post('sys:config,get:val', { key })

    if (currentRes.ok) {
      const promptEnt = await seneca.entity('pdm/prompt').load$(currentRes.val)
      console.log('EXISTING', currentRes, promptEnt)
      if (promptEnt) {
        kind ??= promptEnt.kind
        tag ??= promptEnt.tag
      }
    }

    let promptEnt = await seneca.entity('pdm/prompt').data$({
      name, kind, tag, text
    }).save$()

    out.prompt_id = promptEnt.id

    // Set the current prompt to this newly added one.
    if (false !== set) {

      const updatedRes =
        await seneca.post('sys:config', {
          [currentRes.ok ? 'set' : 'init']: 'val',
          key,
          val: promptEnt.id
        })

      if (!updatedRes.ok) {
        return updatedRes
      }
    }

    out.ok = true
    out.prompt = promptEnt.data$(false)

    return out
  }
}


