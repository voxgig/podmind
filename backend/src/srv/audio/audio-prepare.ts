
import { createClient } from '@deepgram/sdk'


let Deepgram: any = null


module.exports = function make_prepare_audio() {
  return async function prepare_audio(this: any) {
    let seneca = this

    // TODO: implement conf, also for deps
    const debug = seneca.shared.debug =
      // seneca.plugin.options.debug ?
      (mark: string) => (...args: any[]) => console.log('##', mark, ...args)
    // : (_mark: string) => null


    let deepgramApiKey = await this.post(
      'sys:provider,provider:deepgram,get:key,key:apikey'
    )
    if (!deepgramApiKey.ok) {
      debug && debug('DEEPGRAM-KEY-FAIL')
      seneca.fail('deepgram-key-fail')
    }

    seneca.shared.Deepgram = createClient(deepgramApiKey.value)

  }
}
