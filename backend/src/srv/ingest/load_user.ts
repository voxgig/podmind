module.exports = function make_load_ingest() {
  return async function load_ingest(this: any, msg: any) {
    const seneca = this

    const { ingest_id } = msg

    let ingest = await this.entity('sys/ingest').load$(ingest_id)

    return {
      ok: !!ingest,
      ingest,
    }
  }
}

