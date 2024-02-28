"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_get_info() {
    return async function get_info(_msg) {
        const seneca = this;
        const debug = !!seneca.plugin.options.debug;
        return { ok: true, srv: 'store', when: Date.now(), debug };
    };
};
//# sourceMappingURL=get_info.js.map