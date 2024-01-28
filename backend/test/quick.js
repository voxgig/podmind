
const { dive, pinify } = require('@voxgig/model')

const Model = require('../model/model.json')

const srv_auth = Model.main.srv.auth


let d0 = dive(srv_auth.in, 128, (path, meta) => [
  meta.allow ? pinify(path) : null,
  !!meta.allow
])

console.log('d0',d0)
