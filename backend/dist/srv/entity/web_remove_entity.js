"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_remove_entity() {
    return async function web_remove_entity(msg) {
        const seneca = this;
        // TODO: review
        let entmsg = {
            aim: 'entity',
            remove: 'entity',
            canon: msg.canon,
            ent: msg.ent,
            q: msg.q,
        };
        let out = await seneca.post(entmsg);
        return out;
    };
};
//# sourceMappingURL=web_remove_entity.js.map