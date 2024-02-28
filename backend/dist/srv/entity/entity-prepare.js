"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_prepare_entity() {
    return async function prepare_entity(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_entity');
        debug('done');
    };
};
//# sourceMappingURL=entity-prepare.js.map