
module.exports = function make_web_load_widget() {
  return async function web_load_widget(this: any, msg: any, meta: any) {
    const seneca = this
    const widget = meta.custom.principal?.widget

    let out: any = {
      ok: false
    }

    if (widget) {
      let res = await this.post('aim:widget,load:widget', {
        widget_id: widget.id
      })

      if (!res.ok) {
        return res
      }

      out.ok = true
      out.widget = {
        id: widget.id,
        email: widget.email,
        name: widget.name,
        handle: widget.handle,
      }
    }

    return out
  }
}
