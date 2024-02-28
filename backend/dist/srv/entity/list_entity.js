"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_list_entity() {
    return async function list_entity(msg) {
        const seneca = this;
        // TODO: review
        let canon = msg.canon;
        let ent = msg.ent;
        let q = msg.q;
        let list = await seneca.entity(canon).list$(q);
        return { ok: !!list, list, q };
    };
};
//# sourceMappingURL=list_entity.js.map