"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_reset_user() {
    return async function web_reset_user(msg) {
        const seneca = this;
        let res = await this.post('aim:auth,reset:user', {
            email: msg.email,
        });
        let out = {
            ok: res.ok
        };
        return out;
    };
};
//# sourceMappingURL=web_reset_user.js.map