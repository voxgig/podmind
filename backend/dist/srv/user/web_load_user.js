"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_load_user() {
    return async function web_load_user(msg, meta) {
        const seneca = this;
        const user = meta.custom.principal?.user;
        let out = {
            ok: false
        };
        if (user) {
            let res = await this.post('aim:user,load:user', {
                user_id: user.id
            });
            if (!res.ok) {
                return res;
            }
            out.ok = true;
            out.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                handle: user.handle,
            };
        }
        return out;
    };
};
//# sourceMappingURL=web_load_user.js.map