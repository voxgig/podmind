"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const code_1 = require("@hapi/code");
const auth_setup_1 = require("./auth.setup");
(0, node_test_1.describe)('auth_srv', () => {
    (0, node_test_1.test)('happy', async () => {
        const seneca = await (0, auth_setup_1.makeSeneca)();
        (0, code_1.expect)(seneca.find_plugin('srv_auth')).exist();
        await seneca.close();
    });
});
//# sourceMappingURL=auth.test.js.map