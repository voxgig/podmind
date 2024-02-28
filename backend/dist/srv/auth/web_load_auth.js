"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_load_user() {
    return async function web_load_user(msg, meta) {
        const seneca = this;
        const user = meta.custom.principal?.user;
        let out = {
            ok: true,
            state: 'signedout',
        };
        if (user) {
            // TODO: double work? user already loaded by gateway
            let res = await seneca.post('aim:auth,load:auth', {
                user_id: user.id
            });
            if (!res.ok) {
                return res;
            }
            out.state = res.state;
            out.user = {
                id: user.id,
                email: user.email,
                handle: user.handle,
            };
        }
        return out;
    };
};
//# sourceMappingURL=web_load_auth.js.map