"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rss_parser_1 = __importDefault(require("rss-parser"));
const Parser = new rss_parser_1.default();
module.exports = function make_prepare_ingest() {
    return async function prepare_ingest(_msg) {
        let seneca = this;
        const { makeDebug } = seneca.export('PodmindUtility/getUtils')();
        makeDebug(seneca);
        const debug = seneca.shared.debug('prepare_ingest');
        seneca.shared.getRSS =
            async function (debug, feed, podcast_id, batch, mark) {
                try {
                    return { ok: true, rss: await Parser.parseURL(feed) };
                }
                catch (err) {
                    debug && debug('getRSS', batch, mark, podcast_id, feed, err);
                    return { ok: false, err };
                }
            };
        debug('done');
    };
};
//# sourceMappingURL=ingest-prepare.js.map