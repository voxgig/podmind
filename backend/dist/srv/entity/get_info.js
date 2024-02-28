"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_get_info() {
    return async function get_info(msg) {
        const seneca = this;
        return { ok: true, srv: 'entity' };
    };
};
//# sourceMappingURL=get_info.js.map