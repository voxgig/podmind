"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_list_prompt() {
    return async function list_prompt(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        let out = { ok: false };
        const { q } = msg;
        const list = await seneca.entity('pdm/prompt').list$(q);
        out.ok = true;
        out.list = list.map((n) => n.data$(false));
        return out;
    };
};
//# sourceMappingURL=list_prompt.js.map