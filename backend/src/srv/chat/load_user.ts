module.exports = function make_load_chat() {
  return async function load_chat(this: any, msg: any) {
    const seneca = this

    const { chat_id } = msg

    let chat = await this.entity('sys/chat').load$(chat_id)

    return {
      ok: !!chat,
      chat,
    }
  }
}

