module.exports = function make_load_widget() {
  return async function load_widget(this: any, msg: any) {
    const seneca = this

    const { widget_id } = msg

    let widget = await this.entity('sys/widget').load$(widget_id)

    return {
      ok: !!widget,
      widget,
    }
  }
}

