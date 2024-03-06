"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSeneca = void 0;
const seneca_1 = __importDefault(require("seneca"));
async function makeSeneca() {
    const seneca = (0, seneca_1.default)({ legacy: false, timeout: 1111, debug: { undead: true } });
    return seneca
        .test()
        .use('promisify')
        .client({ host: 'localhost', port: 50400, path: '/integ' })
        .ready();
}
exports.makeSeneca = makeSeneca;
if (require.main === module) {
    makeSeneca()
        .then((seneca) => {
        console.log(seneca);
    });
}
//# sourceMappingURL=auth.integ.setup.js.map