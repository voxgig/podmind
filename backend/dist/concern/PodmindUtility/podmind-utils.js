"use strict";
// TOOD: https://github.com/senecajs/seneca-reload/issues/1
// export default function make_podmind_utils() {
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function make_podmind_utils() {
    return function getUtils() {
        return {
            humanify,
            listPaths,
            makeDebug,
        };
    };
};
function humanify(when) {
    const d = when ? new Date(when) : new Date();
    return +(d.toISOString().replace(/[^\d]/g, '').replace(/\d$/, ''));
}
function listPaths(event) {
    const paths = event?.Records?.map((r) => decodeURIComponent(r.s3.object.key).replace(/\+/g, ' '));
    return paths;
}
function makeDebug(seneca) {
    seneca.shared.debug = (_mark, _) => (_ = (..._args) => null, _.active = false, _);
    if (seneca.plugin.options.debug) {
        seneca.shared.debug = (mark, _) => (_ = (...args) => console.log('##', mark, ...args), _.active = true, _);
    }
    return seneca.shared.debug;
}
//# sourceMappingURL=podmind-utils.js.map