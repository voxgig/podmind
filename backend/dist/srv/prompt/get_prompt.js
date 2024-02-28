"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_get_prompt() {
    return async function get_prompt(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        let out = { ok: false };
        const name = out.name = msg.name;
        const key = seneca.plugin.options.prefix + name;
        const currentRes = await seneca.post('sys:config,get:val', { key });
        if (!currentRes.ok) {
            currentRes.why = (currentRes.why ? currentRes.why + '/' : '') + 'name-not-found';
            return currentRes;
        }
        out.prompt_id = currentRes.val;
        const promptEnt = await seneca.entity('pdm/prompt').load$(currentRes.val);
        if (null == promptEnt) {
            out.why = 'prompt-not-found';
            return out;
        }
        out.ok = true;
        out.prompt = promptEnt.data$(false);
        return out;
    };
};
//# sourceMappingURL=get_prompt.js.map