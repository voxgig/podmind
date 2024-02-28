"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_load_chat() {
    return async function web_load_chat(msg, meta) {
        const seneca = this;
        const chat = meta.custom.principal?.chat;
        let out = {
            ok: false
        };
        if (chat) {
            let res = await this.post('aim:chat,load:chat', {
                chat_id: chat.id
            });
            if (!res.ok) {
                return res;
            }
            out.ok = true;
            out.chat = {
                id: chat.id,
                email: chat.email,
                name: chat.name,
                handle: chat.handle,
            };
        }
        return out;
    };
};
//# sourceMappingURL=web_load_user.js.map