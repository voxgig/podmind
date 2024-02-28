"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_chunk() {
    return async function prepare_chunk(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_chunk');
        debug('done');
    };
};
//# sourceMappingURL=chunk-prepare.js.map