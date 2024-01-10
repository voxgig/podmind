module.exports = function make_archive_entity() {
  return async function archive_entity(this: any, msg: any) {
    const seneca = this

    const ent = msg.ent
    const archive_id = ent.id + '~' + msg.tag
    const canon = ent.entity$

    await seneca.entity('pdm/archive').save$({
      data: ent.data$(),
      canon,
      when: Date.now(),
      id$: archive_id,
    })

    return { ok: true, archive_id, canon }
  }
}
