"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@deepgram/sdk");
module.exports = function make_prepare_audio() {
    return async function prepare_audio(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_audio');
        let deepgramApiKey = await this.post('sys:provider,provider:deepgram,get:key,key:apikey');
        if (!deepgramApiKey.ok) {
            debug && debug('DEEPGRAM-KEY-FAIL');
            seneca.fail('deepgram-key-fail');
        }
        seneca.shared.Deepgram = (0, sdk_1.createClient)(deepgramApiKey.value);
        debug('done');
    };
};
//# sourceMappingURL=audio-prepare.js.map