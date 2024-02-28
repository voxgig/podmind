"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_signin_user() {
    return async function web_signin_user(msg) {
        const seneca = this;
        let res = await this.post('aim:auth,signin:user', {
            email: msg.email,
            password: msg.password,
        });
        let out = {
            ok: res.ok
        };
        if (res.ok) {
            out.gateway$ = {
                auth: {
                    token: res.login.token
                }
            };
            out.user = res.user;
        }
        return out;
    };
};
//# sourceMappingURL=web_signin_user.js.map