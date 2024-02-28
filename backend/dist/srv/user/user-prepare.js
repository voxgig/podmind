"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_user() {
    return async function prepare_user(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_user');
        debug('done');
    };
};
//# sourceMappingURL=user-prepare.js.map