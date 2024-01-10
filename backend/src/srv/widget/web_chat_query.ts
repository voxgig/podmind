
module.exports = function make_web_chat_query() {
  return async function web_chat_query(this: any, msg: any, meta: any) {
    const seneca = this

    let out: any = {
      ok: false,
      why: '',
      answer: '',
    }

    const query = msg.query

    let res = await this.post('aim:chat,chat:query', {
      query
    })

    if (res.ok) {
      out.ok = res.ok
      out.answer = res.answer
      delete out.why
    }
    else {
      out.why = res.why
    }

    return out
  }
}
