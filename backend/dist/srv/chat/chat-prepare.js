"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_chat() {
    return async function prepare_chat(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_chat');
        debug('done');
    };
};
//# sourceMappingURL=chat-prepare.js.map