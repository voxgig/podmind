"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_set_prompt() {
    return async function set_prompt(msg, meta) {
        const seneca = this;
        const debug = seneca.shared.debug(meta.action);
        let out = { ok: false };
        const name = out.name = msg.name;
        const id = out.id = msg.id;
        const promptEnt = await seneca.entity('pdm/prompt').load$(id);
        if (null == promptEnt) {
            out.why = 'prompt-not-found';
            return out;
        }
        const key = seneca.plugin.options.prefix + name;
        const val = promptEnt.id;
        const currentRes = await seneca.post('sys:config,set:val', { key, val });
        if (!currentRes.ok) {
            return currentRes;
        }
        out.ok = true;
        out.prompt = promptEnt.save$();
        return out;
    };
};
//# sourceMappingURL=set_prompt.js.map