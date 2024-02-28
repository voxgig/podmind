"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_load_auth() {
    return async function load_auth(msg) {
        const seneca = this;
        const { user_id } = msg;
        let user = await this.entity('sys/user').load$(user_id);
        return {
            ok: !!user,
            state: user ? 'signedin' : 'signedout',
            user,
        };
    };
};
//# sourceMappingURL=load_auth.js.map