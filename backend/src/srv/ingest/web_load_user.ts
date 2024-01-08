
module.exports = function make_web_load_ingest() {
  return async function web_load_ingest(this: any, msg: any, meta: any) {
    const seneca = this
    const ingest = meta.custom.principal?.ingest

    let out: any = {
      ok: false
    }

    if (ingest) {
      let res = await this.post('aim:ingest,load:ingest', {
        ingest_id: ingest.id
      })

      if (!res.ok) {
        return res
      }

      out.ok = true
      out.ingest = {
        id: ingest.id,
        email: ingest.email,
        name: ingest.name,
        handle: ingest.handle,
      }
    }

    return out
  }
}
