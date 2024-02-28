"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_remove_entity() {
    return async function remove_entity(msg) {
        const seneca = this;
        // TODO: review
        let canon = msg.canon;
        let ent = msg.ent;
        let q = msg.q;
        let res = await seneca.entity(canon).remove$(q);
        return { ok: !!res, ent: res, q };
    };
};
//# sourceMappingURL=remove_entity.js.map