"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_embed() {
    return async function prepare_embed(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_embed');
        debug('done');
    };
};
//# sourceMappingURL=embed-prepare.js.map