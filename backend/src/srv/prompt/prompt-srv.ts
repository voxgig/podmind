
import { MakeSrv } from '@voxgig/system'

// TODO: export default
module.exports = MakeSrv('prompt', require)

module.exports.defaults = {
  debug: false,
  prefix: 'prompt.',
} 
