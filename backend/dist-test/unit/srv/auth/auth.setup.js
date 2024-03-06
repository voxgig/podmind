"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.makeSeneca = void 0;
const seneca_1 = __importDefault(require("seneca"));
const model_json_1 = __importDefault(require("../../../../model/model.json"));
exports.Model = model_json_1.default;
async function makeSeneca() {
    const seneca = (0, seneca_1.default)({ legacy: false, timeout: 1111, debug: { undead: true } });
    seneca.context.model = model_json_1.default;
    seneca.context.env = 'local';
    return seneca
        .test()
        .use('promisify')
        .use('entity')
        .use('reload')
        .use('../../../../dist/concern/PodmindUtility/PodmindUtility')
        .use('../../../../dist/srv/auth/auth-srv')
        .ready();
}
exports.makeSeneca = makeSeneca;
if (require.main === module) {
    makeSeneca();
}
//# sourceMappingURL=auth.setup.js.map