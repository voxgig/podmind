"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_web_list_entity() {
    return async function web_list_entity(msg) {
        const seneca = this;
        // TODO: review
        let entmsg = {
            aim: 'entity',
            list: 'entity',
            canon: msg.canon,
            ent: msg.ent,
            q: msg.q,
        };
        let res = await seneca.post(entmsg);
        let out = {
            ok: res.ok,
        };
        // if (msg.handler) {
        //   out.handler = msg.handler
        // }
        // else if (res.ok) {
        //   // TODO: should be on client
        //   out.update = [
        //     {
        //       section: 'pdm.ent.list.main.' + msg.canon,
        //       content: res.list,
        //     },
        //     {
        //       section: 'pdm.ent.meta.main.' + msg.canon + '.state',
        //       content: 'loaded',
        //     },
        //   ]
        // }
        if (res.ok) {
            out.list = res.list;
        }
        return out;
    };
};
//# sourceMappingURL=web_list_entity.js.map