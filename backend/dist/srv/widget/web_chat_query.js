"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_chat_query() {
    return async function web_chat_query(msg, meta) {
        const seneca = this;
        let out = {
            ok: false,
            why: '',
            answer: '',
        };
        const query = msg.query;
        let res = await this.post('aim:chat,chat:query', {
            query
        });
        if (res.ok) {
            out.ok = res.ok;
            out.answer = res.answer;
            delete out.why;
        }
        else {
            out.why = res.why;
        }
        return out;
    };
};
//# sourceMappingURL=web_chat_query.js.map