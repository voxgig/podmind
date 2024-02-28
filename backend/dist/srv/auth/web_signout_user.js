"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_signout_user() {
    return async function web_signout_user(msg, meta) {
        const seneca = this;
        let out = { ok: true };
        const principal = meta.custom.principal;
        if (principal) {
            let res = await this.post('aim:auth,signout:user', {
                token: principal.login.token
            });
            out.ok = res.ok;
        }
        out.gateway$ = {
            auth: {
                remove: true
            }
        };
        return out;
    };
};
//# sourceMappingURL=web_signout_user.js.map