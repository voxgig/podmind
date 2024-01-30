
import { createClient } from '@deepgram/sdk'


module.exports = function make_prepare_audio() {
  return async function prepare_audio(this: any, _msg: any) {
    let seneca = this

    const { makeDebug } = seneca.export('PodmindUtility/getUtils')()

    makeDebug(seneca)
    const debug = seneca.shared.debug('prepare_audio')

    let deepgramApiKey = await this.post(
      'sys:provider,provider:deepgram,get:key,key:apikey'
    )
    if (!deepgramApiKey.ok) {
      debug && debug('DEEPGRAM-KEY-FAIL')
      seneca.fail('deepgram-key-fail')
    }

    seneca.shared.Deepgram = createClient(deepgramApiKey.value)

    debug('done')
  }
}
