"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_signin_user() {
    return async function signin_user(msg) {
        const seneca = this;
        const email = msg.email;
        const password = msg.password;
        const fields = ['id', 'email', 'name']; // msg.fields || []
        let out = await seneca.post('sys:user,login:user', {
            email,
            password,
            fields,
        });
        return out;
    };
};
//# sourceMappingURL=signin_user.js.map