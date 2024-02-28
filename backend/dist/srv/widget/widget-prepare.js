"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_widget() {
    return async function prepare_widget(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_widget');
        debug('done');
    };
};
//# sourceMappingURL=widget-prepare.js.map