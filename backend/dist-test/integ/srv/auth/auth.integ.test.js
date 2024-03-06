"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const code_1 = require("@hapi/code");
const auth_integ_setup_1 = require("./auth.integ.setup");
(0, node_test_1.describe)('integ:auth_srv', () => {
    (0, node_test_1.test)('get:info', async () => {
        const seneca = await (0, auth_integ_setup_1.makeSeneca)();
        const res0 = await seneca.post('aim:auth,get:info');
        (0, code_1.expect)(res0).contains({ ok: true, srv: 'auth' });
        await seneca.close();
    });
});
//# sourceMappingURL=auth.integ.test.js.map