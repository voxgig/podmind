"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_monitor() {
    return async function prepare_monitor(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_monitor');
        debug('done');
    };
};
//# sourceMappingURL=monitor-prepare.js.map