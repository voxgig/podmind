"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_signout_user() {
    return async function signout_user(msg) {
        const seneca = this;
        const token = msg.token;
        let out = await seneca.post('sys:user,logout:user', {
            token
        });
        return out;
    };
};
//# sourceMappingURL=signout_user.js.map