"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rss_parser_1 = __importDefault(require("rss-parser"));
const Parser = new rss_parser_1.default();
module.exports = function make_prepare_prompt() {
    return async function prepare_prompt(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_prompt');
        debug('done');
    };
};
//# sourceMappingURL=prompt-prepare.js.map