"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_cmd_reset() {
    return async function cmd_reset(msg) {
        const seneca = this;
        return { ok: true, srv: 'auth' };
    };
};
//# sourceMappingURL=reset_user.js.map