"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_audio() {
    return async function prepare_audio(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_audio');
        debug('done');
    };
};
//# sourceMappingURL=auth-prepare.js.map