"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_load_user() {
    return async function load_user(msg) {
        const seneca = this;
        const { user_id } = msg;
        let user = await this.entity('sys/user').load$(user_id);
        return {
            ok: !!user,
            user,
        };
    };
};
//# sourceMappingURL=load_user.js.map